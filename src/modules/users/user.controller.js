const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/sendResponse');
const userService = require('./user.service');

const getAllUsers = asyncHandler(async (req, res) => {
  const result = await userService.getAllUsers(req.query);
  return sendResponse(res, 200, 'Users retrieved successfully', result.users, result.pagination);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  return sendResponse(res, 200, 'User retrieved successfully', { user });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  return sendResponse(res, 200, 'User role updated successfully', { user });
});

const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id, req.user.id);
  return sendResponse(res, 200, 'User deleted successfully');
});

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
};
