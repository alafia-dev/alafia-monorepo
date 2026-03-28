const jwt = require('jsonwebtoken');

const signAccessToken = (payload) => {
  const secret = process.env.JWT_SECRET || 'dev-only-secret';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyAccessToken = (token) => {
  const secret = process.env.JWT_SECRET || 'dev-only-secret';
  return jwt.verify(token, secret);
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
};
