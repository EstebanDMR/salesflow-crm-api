const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');

const getAllDeals = async (user, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Sales can only view deals for their own clients or assigned to them
  if (user.role === 'sales') {
    where.OR = [
      { userId: user.id },
      { client: { ownerId: user.id } },
    ];
  } else {
    if (query.userId) {
      where.userId = parseInt(query.userId, 10);
    }
    if (query.clientId) {
      where.clientId = parseInt(query.clientId, 10);
    }
  }

  if (query.stage) {
    where.stage = query.stage;
  }

  if (query.minVal !== undefined || query.maxVal !== undefined) {
    where.value = {};
    if (query.minVal !== undefined) where.value.gte = parseFloat(query.minVal);
    if (query.maxVal !== undefined) where.value.lte = parseFloat(query.maxVal);
  }

  const [deals, total] = await Promise.all([
    prisma.deal.findMany({
      where,
      skip,
      take: limit,
      include: {
        client: {
          select: { id: true, companyName: true, contactName: true, email: true },
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.deal.count({ where }),
  ]);

  return {
    deals,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getDealById = async (id, user) => {
  const dealId = parseInt(id, 10);

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: {
      client: {
        select: { id: true, companyName: true, contactName: true, email: true, ownerId: true },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!deal) {
    throw new AppError('Deal not found.', 404);
  }

  if (
    user.role === 'sales' &&
    deal.userId !== user.id &&
    deal.client?.ownerId !== user.id
  ) {
    throw new AppError('You do not have permission to view this deal.', 403);
  }

  return deal;
};

const getDealStats = async (user) => {
  const where = {};

  if (user.role === 'sales') {
    where.OR = [
      { userId: user.id },
      { client: { ownerId: user.id } },
    ];
  }

  const deals = await prisma.deal.findMany({
    where,
    select: {
      id: true,
      value: true,
      stage: true,
    },
  });

  let totalRevenue = 0;
  let wonDeals = 0;
  let lostDeals = 0;
  let pendingDeals = 0;
  const stageBreakdown = {};

  deals.forEach((deal) => {
    const val = deal.value || 0;
    if (!stageBreakdown[deal.stage]) {
      stageBreakdown[deal.stage] = { count: 0, totalValue: 0 };
    }
    stageBreakdown[deal.stage].count += 1;
    stageBreakdown[deal.stage].totalValue += val;

    if (deal.stage === 'won') {
      wonDeals += 1;
      totalRevenue += val;
    } else if (deal.stage === 'lost') {
      lostDeals += 1;
    } else {
      pendingDeals += 1;
    }
  });

  const totalDeals = deals.length;
  const closedDeals = wonDeals + lostDeals;
  const winRate = closedDeals > 0 ? Number(((wonDeals / closedDeals) * 100).toFixed(2)) : 0;

  return {
    metrics: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      wonDeals,
      pendingDeals,
      lostDeals,
      totalDeals,
      winRatePercentage: winRate,
    },
    dealsByStage: stageBreakdown,
  };
};

const createDeal = async (user, data) => {
  const { title, value, stage, closeDate, clientId, userId } = data;

  // Verify client exists
  const client = await prisma.client.findUnique({
    where: { id: parseInt(clientId, 10) },
  });

  if (!client) {
    throw new AppError('Associated client not found.', 404);
  }

  if (user.role === 'sales' && client.ownerId !== user.id) {
    throw new AppError('You can only create deals for your own clients.', 403);
  }

  const assignedUserId = user.role === 'sales' ? user.id : userId || user.id;

  const newDeal = await prisma.deal.create({
    data: {
      title: title || `Deal with ${client.companyName}`,
      value: parseFloat(value),
      stage: stage || 'lead',
      closeDate: closeDate ? new Date(closeDate) : null,
      clientId: client.id,
      userId: assignedUserId,
    },
    include: {
      client: {
        select: { id: true, companyName: true, contactName: true },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return newDeal;
};

const updateDeal = async (id, user, data) => {
  const dealId = parseInt(id, 10);

  const existingDeal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { client: true },
  });

  if (!existingDeal) {
    throw new AppError('Deal not found.', 404);
  }

  if (
    user.role === 'sales' &&
    existingDeal.userId !== user.id &&
    existingDeal.client?.ownerId !== user.id
  ) {
    throw new AppError('You do not have permission to update this deal.', 403);
  }

  const updateData = { ...data };
  if (updateData.value !== undefined) {
    updateData.value = parseFloat(updateData.value);
  }
  if (updateData.closeDate !== undefined) {
    updateData.closeDate = updateData.closeDate ? new Date(updateData.closeDate) : null;
  }
  if (user.role === 'sales') {
    delete updateData.userId;
    delete updateData.clientId;
  }

  const updatedDeal = await prisma.deal.update({
    where: { id: dealId },
    data: updateData,
    include: {
      client: {
        select: { id: true, companyName: true, contactName: true },
      },
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedDeal;
};

const deleteDeal = async (id, user) => {
  const dealId = parseInt(id, 10);

  const existingDeal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { client: true },
  });

  if (!existingDeal) {
    throw new AppError('Deal not found.', 404);
  }

  if (
    user.role === 'sales' &&
    existingDeal.userId !== user.id &&
    existingDeal.client?.ownerId !== user.id
  ) {
    throw new AppError('You do not have permission to delete this deal.', 403);
  }

  await prisma.deal.delete({
    where: { id: dealId },
  });

  return true;
};

module.exports = {
  getAllDeals,
  getDealById,
  getDealStats,
  createDeal,
  updateDeal,
  deleteDeal,
};
