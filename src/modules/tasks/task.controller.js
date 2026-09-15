const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/sendResponse');
const taskService = require('./task.service');

const getAllTasks = asyncHandler(async (req, res) => {
  const result = await taskService.getAllTasks(req.user, req.query);
  return sendResponse(res, 200, 'Tasks retrieved successfully', result.tasks, result.pagination);
});

const getMyTasks = asyncHandler(async (req, res) => {
  const tasks = await taskService.getMyTasks(req.user.id);
  return sendResponse(res, 200, 'User tasks retrieved successfully', { tasks });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await taskService.getTaskById(req.params.id, req.user);
  return sendResponse(res, 200, 'Task retrieved successfully', { task });
});

const createTask = asyncHandler(async (req, res) => {
  const task = await taskService.createTask(req.user, req.body);
  return sendResponse(res, 201, 'Task created successfully', { task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await taskService.updateTask(req.params.id, req.user, req.body);
  return sendResponse(res, 200, 'Task updated successfully', { task });
});

const toggleTaskStatus = asyncHandler(async (req, res) => {
  const task = await taskService.toggleTaskStatus(req.params.id, req.user);
  return sendResponse(res, 200, 'Task completion status toggled successfully', { task });
});

const deleteTask = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.id, req.user);
  return sendResponse(res, 200, 'Task deleted successfully');
});

module.exports = {
  getAllTasks,
  getMyTasks,
  getTaskById,
  createTask,
  updateTask,
  toggleTaskStatus,
  deleteTask,
};
