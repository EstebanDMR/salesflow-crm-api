const asyncHandler = require('../../shared/middlewares/asyncHandler');
const sendResponse = require('../../shared/utils/sendResponse');
const authService = require('./auth.service');
const { registerSchema, loginSchema } = require('./auth.schema');
const AppError = require('../../shared/utils/AppError');

const register = asyncHandler(async (req, res) => {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = validation.error.errors.map(err => err.message).join(', ');
    throw new AppError(`Validation Error: ${errors}`, 400);
  }

  const { user, token } = await authService.registerUser(validation.data);

  sendResponse(res, 201, 'User registered successfully', { user, token });
});

const login = asyncHandler(async (req, res) => {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    const errors = validation.error.errors.map(err => err.message).join(', ');
    throw new AppError(`Validation Error: ${errors}`, 400);
  }

  const { user, token } = await authService.loginUser(validation.data);

  sendResponse(res, 200, 'Login successful', { user, token });
});

const getMe = asyncHandler(async (req, res) => {
  // req.user will be populated by the protect middleware
  sendResponse(res, 200, 'User details retrieved successfully', { user: req.user });
});

module.exports = {
  register,
  login,
  getMe,
};
