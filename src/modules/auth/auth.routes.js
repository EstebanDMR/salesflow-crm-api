const express = require('express');
const authController = require('./auth.controller');
const { registerSchema, loginSchema } = require('./auth.schema');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const { authLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

router.post('/register', authLimiter, validate({ body: registerSchema }), authController.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
router.get('/me', protect, authController.getMe);

module.exports = router;
