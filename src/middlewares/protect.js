const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const AppError = require('../utils/AppError');
const env = require('../config/env');
const prisma = require('../utils/prisma');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please provide a Bearer token to get access.', 401)
    );
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    req.user = currentUser;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token. Please log in again.', 401));
  }
});

module.exports = protect;
