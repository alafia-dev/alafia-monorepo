const ApiError = require('../utils/api-error');
const { verifyAccessToken } = require('../utils/token');

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return next(new ApiError(401, 'Missing bearer token'));
  }

  try {
    req.auth = verifyAccessToken(token);
    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token'));
  }
};

module.exports = {
  requireAuth,
};
