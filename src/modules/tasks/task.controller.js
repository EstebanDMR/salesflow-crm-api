const asyncHandler = require('../../shared/middlewares/asyncHandler');
const sendResponse = require('../../shared/utils/sendResponse');
const prisma = require('../../shared/lib/prisma');

const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await prisma.task.findMany({
    where: { userId: req.user.id }
  });
  sendResponse(res, 200, 'Tasks retrieved successfully', { tasks });
});

module.exports = {
  getMyTasks
};
