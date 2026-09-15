const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');

const getAllTasks = async (user, query = {}) => {
  const page = parseInt(query.page, 10) || 1;
  const limit = parseInt(query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (user.role === 'sales') {
    where.userId = user.id;
  } else if (query.userId) {
    where.userId = parseInt(query.userId, 10);
  }

  if (query.completed !== undefined) {
    where.completed = query.completed;
  }

  if (query.dueBefore || query.dueAfter) {
    where.dueDate = {};
    if (query.dueBefore) where.dueDate.lte = new Date(query.dueBefore);
    if (query.dueAfter) where.dueDate.gte = new Date(query.dueAfter);
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
    }),
    prisma.task.count({ where }),
  ]);

  return {
    tasks,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getMyTasks = async (userId) => {
  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
  });

  return tasks;
};

const getTaskById = async (id, user) => {
  const taskId = parseInt(id, 10);

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!task) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role === 'sales' && task.userId !== user.id) {
    throw new AppError('You do not have permission to view this task.', 403);
  }

  return task;
};

const createTask = async (user, data) => {
  const { title, description, dueDate, completed, userId } = data;

  const assignedUserId = user.role === 'sales' ? user.id : userId || user.id;

  if (assignedUserId !== user.id) {
    const targetUser = await prisma.user.findUnique({
      where: { id: assignedUserId },
    });
    if (!targetUser) {
      throw new AppError('Assigned user does not exist.', 400);
    }
  }

  const newTask = await prisma.task.create({
    data: {
      title,
      description: description || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: completed || false,
      userId: assignedUserId,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return newTask;
};

const updateTask = async (id, user, data) => {
  const taskId = parseInt(id, 10);

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role === 'sales' && existingTask.userId !== user.id) {
    throw new AppError('You do not have permission to update this task.', 403);
  }

  const updateData = { ...data };
  if (updateData.dueDate !== undefined) {
    updateData.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null;
  }
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

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedTask;
};

const toggleTaskStatus = async (id, user) => {
  const taskId = parseInt(id, 10);

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role === 'sales' && existingTask.userId !== user.id) {
    throw new AppError('You do not have permission to modify this task.', 403);
  }

  const updatedTask = await prisma.task.update({
    where: { id: taskId },
    data: {
      completed: !existingTask.completed,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return updatedTask;
};

const deleteTask = async (id, user) => {
  const taskId = parseInt(id, 10);

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new AppError('Task not found.', 404);
  }

  if (user.role === 'sales' && existingTask.userId !== user.id) {
    throw new AppError('You do not have permission to delete this task.', 403);
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return true;
};

module.exports = {
  getAllTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
