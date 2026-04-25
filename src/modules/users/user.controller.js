const asyncHandler = require('../../shared/middlewares/asyncHandler');
const sendResponse = require('../../shared/utils/sendResponse');
const prisma = require('../../shared/lib/prisma');

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });
  sendResponse(res, 200, 'Users retrieved successfully', { users });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  await prisma.user.delete({
    where: { id: parseInt(id, 10) }
  });
  
  sendResponse(res, 200, 'User deleted successfully');
});

module.exports = {
  getAllUsers,
  deleteUser
};
