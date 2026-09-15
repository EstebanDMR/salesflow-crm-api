const AppError = require('../utils/AppError');

/**
 * Express middleware to validate request against Zod schemas
 * @param {Object} schemas - Object containing optional schemas: { body, query, params }
 */
const validate = (schemas) => {
  return (req, res, next) => {
    try {
      if (schemas.body) {
        const parsed = schemas.body.safeParse(req.body);
        if (!parsed.success) {
          const errors = parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          return next(
            new AppError(
              `Validation Error: ${errors.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
              400,
              errors
            )
          );
        }
        req.body = parsed.data;
      }

      if (schemas.query) {
        const parsed = schemas.query.safeParse(req.query);
        if (!parsed.success) {
          const errors = parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          return next(
            new AppError(
              `Query Validation Error: ${errors.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
              400,
              errors
            )
          );
        }
        req.query = parsed.data;
      }

      if (schemas.params) {
        const parsed = schemas.params.safeParse(req.params);
        if (!parsed.success) {
          const errors = parsed.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
          }));
          return next(
            new AppError(
              `Params Validation Error: ${errors.map((e) => `${e.field}: ${e.message}`).join(', ')}`,
              400,
              errors
            )
          );
        }
        req.params = parsed.data;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
};

module.exports = validate;
