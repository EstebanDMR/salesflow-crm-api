const express = require('express');
const userController = require('./user.controller');
const { updateRoleSchema, queryUsersSchema } = require('./user.schema');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router.use(protect);

// Managers and Admins can view users
router.get('/', authorize('admin', 'manager'), validate({ query: queryUsersSchema }), userController.getAllUsers);
router.get('/:id', authorize('admin', 'manager'), userController.getUserById);

// Only Admins can modify user roles or delete users
router.patch('/:id/role', authorize('admin'), validate({ body: updateRoleSchema }), userController.updateUserRole);
router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
