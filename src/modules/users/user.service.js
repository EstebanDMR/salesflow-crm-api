const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');

const getAllUsers = async (query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const where = {};
  if (query.role) {
    where.role = query.role;
  }
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            clients: true,
            leads: true,
            deals: true,
            tasks: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id, 10) },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          clients: true,
          leads: true,
          deals: true,
          tasks: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  return user;
};

const updateUserRole = async (id, role) => {
  const userId = parseInt(id, 10);

  const existing = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!existing) {
    throw new AppError('User not found.', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUser = async (id, currentAdminId) => {
  const userId = parseInt(id, 10);

  if (userId === currentAdminId) {
    throw new AppError('Admins cannot delete their own account.', 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found.', 404);
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
