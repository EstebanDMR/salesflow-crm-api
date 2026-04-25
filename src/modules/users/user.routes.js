const express = require('express');
const userController = require('./user.controller');
const protect = require('../../shared/middlewares/protect');
const authorize = require('../../shared/middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/', userController.getAllUsers);
router.delete('/:id', userController.deleteUser);

module.exports = router;
