const AppError = require('../utils/AppError');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Forbidden: Role '${req.user?.role || 'anonymous'}' is not authorized to access this resource. Required: [${roles.join(', ')}]`,
          403
        )
      );
    }
    next();
  };
};

module.exports = authorize;
