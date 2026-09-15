const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/sendResponse');
const authService = require('./auth.service');

const register = asyncHandler(async (req, res) => {
  const { user, token } = await authService.registerUser(req.body);
  return sendResponse(res, 201, 'User registered successfully', { user, token });
});

const login = asyncHandler(async (req, res) => {
  const { user, token } = await authService.loginUser(req.body);
  return sendResponse(res, 200, 'Login successful', { user, token });
});

const getMe = asyncHandler(async (req, res) => {
  const profile = await authService.getUserProfile(req.user.id);
  return sendResponse(res, 200, 'Current user profile retrieved successfully', { user: profile });
});

module.exports = {
  register,
  login,
  getMe,
};
