const ApiError = require('../utils/api-error');

const parseSegment = (schema, payload, segment) => {
  if (!schema) {
    return undefined;
  }

  if (typeof schema.safeParse === 'function') {
    const result = schema.safeParse(payload || {});

    if (!result.success) {
      throw new ApiError(400, `Invalid ${segment}`, {
        issues: result.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    return result.data;
  }

  return schema(payload || {});
};

const validateRequest = ({ body, params, query } = {}) => (req, res, next) => {
  try {
    if (body) {
      req.validatedBody = parseSegment(body, req.body, 'request body');
    }

    if (params) {
      req.validatedParams = parseSegment(params, req.params, 'route params');
    }

    if (query) {
      req.validatedQuery = parseSegment(query, req.query, 'query string');
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = validateRequest;
