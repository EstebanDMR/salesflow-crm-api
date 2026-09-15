const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');

const getAllClients = async (user, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  // Ownership filtering: sales users can only see their own clients
  if (user.role === 'sales') {
    where.ownerId = user.id;
  } else if (query.ownerId) {
    where.ownerId = parseInt(query.ownerId, 10);
  }

  if (query.search) {
    where.OR = [
      { companyName: { contains: query.search, mode: 'insensitive' } },
      { contactName: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      skip,
      take: limit,
      include: {
        owner: {
          select: { id: true, name: true, email: true },
        },
        _count: {
          select: { deals: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.client.count({ where }),
  ]);

  return {
    clients,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getClientById = async (id, user) => {
  const clientId = parseInt(id, 10);

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
      deals: {
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!client) {
    throw new AppError('Client not found.', 404);
  }

  if (user.role === 'sales' && client.ownerId !== user.id) {
    throw new AppError('You do not have permission to view this client.', 403);
  }

  return client;
};

const createClient = async (user, data) => {
  const { companyName, contactName, email, phone, ownerId } = data;

  // Sales can only create clients for themselves
  const assignedOwnerId = user.role === 'sales' ? user.id : ownerId || user.id;

  // If assigning to someone else, verify target owner exists
  if (assignedOwnerId !== user.id) {
    const targetOwner = await prisma.user.findUnique({
      where: { id: assignedOwnerId },
    });
    if (!targetOwner) {
      throw new AppError('Assigned owner user does not exist.', 400);
    }
  }

  const newClient = await prisma.client.create({
    data: {
      companyName,
      contactName,
      email: email || null,
      phone: phone || null,
      ownerId: assignedOwnerId,
    },
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return newClient;
};

const updateClient = async (id, user, data) => {
  const clientId = parseInt(id, 10);

  const existingClient = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!existingClient) {
    throw new AppError('Client not found.', 404);
  }

  if (user.role === 'sales' && existingClient.ownerId !== user.id) {
    throw new AppError('You do not have permission to modify this client.', 403);
  }

  const updateData = { ...data };
  // Only admin and manager can reassign owner
  if (user.role === 'sales') {
    delete updateData.ownerId;
  } else if (updateData.ownerId) {
    const targetOwner = await prisma.user.findUnique({
      where: { id: updateData.ownerId },
    });
    if (!targetOwner) {
      throw new AppError('Assigned owner user does not exist.', 400);
    }
  }

  const updatedClient = await prisma.client.update({
    where: { id: clientId },
    data: updateData,
    include: {
      owner: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedClient;
};

const deleteClient = async (id, user) => {
  const clientId = parseInt(id, 10);

  const existingClient = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!existingClient) {
    throw new AppError('Client not found.', 404);
  }

  if (user.role === 'sales' && existingClient.ownerId !== user.id) {
    throw new AppError('You do not have permission to delete this client.', 403);
  }

  await prisma.client.delete({
    where: { id: clientId },
  });

  return true;
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
