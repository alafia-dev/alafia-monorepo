const express = require('express');

const routes = require('./routes');
const ApiError = require('./utils/api-error');
const errorMiddleware = require('./middleware/error.middleware');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.use((req, res, next) => {
	next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

app.use(errorMiddleware);

module.exports = app;
