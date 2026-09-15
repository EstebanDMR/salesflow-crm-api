const AppError = require('../utils/AppError');

const notFound = (req, res, next) => {
  next(new AppError(`Resource not found: Cannot ${req.method} ${req.originalUrl}`, 404));
};

module.exports = notFound;
