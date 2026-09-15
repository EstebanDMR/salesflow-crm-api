const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');

const getAllLeads = async (user, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Sales can only view their own leads
  if (user.role === 'sales') {
    where.userId = user.id;
  } else if (query.userId) {
    where.userId = parseInt(query.userId, 10);
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.source) {
    where.source = { contains: query.source, mode: 'insensitive' };
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { source: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getLeadById = async (id, user) => {
  const leadId = parseInt(id, 10);

  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!lead) {
    throw new AppError('Lead not found.', 404);
  }

  if (user.role === 'sales' && lead.userId !== user.id) {
    throw new AppError('You do not have permission to view this lead.', 403);
  }

  return lead;
};

const createLead = async (user, data) => {
  const { name, source, status, userId } = data;

  const assignedUserId = user.role === 'sales' ? user.id : userId || user.id;

  if (assignedUserId !== user.id) {
    const targetUser = await prisma.user.findUnique({
      where: { id: assignedUserId },
    });
    if (!targetUser) {
      throw new AppError('Assigned user does not exist.', 400);
    }
  }

  const newLead = await prisma.lead.create({
    data: {
      name,
      source,
      status: status || 'new',
      userId: assignedUserId,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return newLead;
};

const updateLead = async (id, user, data) => {
  const leadId = parseInt(id, 10);

  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) {
    throw new AppError('Lead not found.', 404);
  }

  if (user.role === 'sales' && existingLead.userId !== user.id) {
    throw new AppError('You do not have permission to update this lead.', 403);
  }

  const updateData = { ...data };
  if (user.role === 'sales') {
    delete updateData.userId;
  } else if (updateData.userId) {
    const targetUser = await prisma.user.findUnique({
      where: { id: updateData.userId },
    });
    if (!targetUser) {
      throw new AppError('Assigned user does not exist.', 400);
    }
  }

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: updateData,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedLead;
};

const updateLeadStatus = async (id, user, status) => {
  const leadId = parseInt(id, 10);

  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) {
    throw new AppError('Lead not found.', 404);
  }

  if (user.role === 'sales' && existingLead.userId !== user.id) {
    throw new AppError('You do not have permission to modify this lead status.', 403);
  }

  const updatedLead = await prisma.lead.update({
    where: { id: leadId },
    data: { status },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedLead;
};

const deleteLead = async (id, user) => {
  const leadId = parseInt(id, 10);

  const existingLead = await prisma.lead.findUnique({
    where: { id: leadId },
  });

  if (!existingLead) {
    throw new AppError('Lead not found.', 404);
  }

  if (user.role === 'sales' && existingLead.userId !== user.id) {
    throw new AppError('You do not have permission to delete this lead.', 403);
  }

  await prisma.lead.delete({
    where: { id: leadId },
  });

  return true;
};

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
};
