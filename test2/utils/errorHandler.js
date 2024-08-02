const errorHandler = (error, request, reply) => {
  const statusCode = error.statusCode || 500;
  const errorResponse = {
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = error.stack;
  }

  request.log.error(error);
  reply.status(statusCode).send(errorResponse);
};

module.exports = errorHandler;