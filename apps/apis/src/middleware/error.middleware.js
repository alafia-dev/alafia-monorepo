const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const payload = {
    ok: false,
    message: err.message || 'Internal server error',
  };

  if (err.details) {
    payload.details = err.details;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json(payload);
};

module.exports = errorMiddleware;
