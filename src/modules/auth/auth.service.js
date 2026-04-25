const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../shared/lib/prisma');
const AppError = require('../../shared/utils/AppError');
const env = require('../../shared/config/env');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

const registerUser = async (data) => {
  const { name, email, password } = data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email is already in use', 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const token = generateToken(newUser.id, newUser.role);

  // Return clean user (without password)
  const { password: _, ...userWithoutPassword } = newUser;

  return { user: userWithoutPassword, token };
};

const loginUser = async (data) => {
  const { email, password } = data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user.id, user.role);

  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

module.exports = {
  registerUser,
  loginUser,
};
