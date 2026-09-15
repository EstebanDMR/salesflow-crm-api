const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../utils/prisma');
const AppError = require('../../utils/AppError');
const env = require('../../config/env');

const generateToken = (id, role, email) => {
  return jwt.sign({ id, role, email }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

const registerUser = async (data) => {
  const { name, email, password, role } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('A user with this email address already exists.', 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: role || 'sales',
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const token = generateToken(newUser.id, newUser.role, newUser.email);

  return { user: newUser, token };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const token = generateToken(user.id, user.role, user.email);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
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

module.exports = {
  generateToken,
  registerUser,
  loginUser,
  getUserProfile,
};
