const express = require('express');
const taskController = require('./task.controller');
const {
  createTaskSchema,
  updateTaskSchema,
  queryTaskSchema,
} = require('./task.schema');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager', 'sales'));

// Convenience endpoint for current user tasks (must precede /:id)
router.get('/my', taskController.getMyTasks);

// Standard task management endpoints
router.get('/', validate({ query: queryTaskSchema }), taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validate({ body: createTaskSchema }), taskController.createTask);
router.put('/:id', validate({ body: updateTaskSchema }), taskController.updateTask);
router.patch('/:id/toggle', taskController.toggleTaskStatus);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
