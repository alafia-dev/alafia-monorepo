const ApiError = require('../utils/api-error');

const requireRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.auth || !req.auth.role) {
    return next(new ApiError(401, 'Unauthorized'));
  }

  if (!allowedRoles.includes(req.auth.role)) {
    return next(new ApiError(403, 'Forbidden: insufficient role'));
  }

  return next();
};

module.exports = {
  requireRoles,
};
