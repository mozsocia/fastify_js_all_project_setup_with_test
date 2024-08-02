const fastify = require('fastify')({ logger: true });

const errorHandler = (error, request, reply) => {
  // Log the error (you might want to use a proper logging library in production)
  console.error(error);

  // Determine the status code
  const statusCode = error.statusCode || 500;

  // Send the error response
  reply.status(statusCode).send({
    error: {
      message: error.message || 'Internal Server Error',
      statusCode: statusCode
    }
  });
};

// Global error handler
fastify.setErrorHandler(errorHandler);

// Plugin
fastify.register(async (instance, opts) => {
  instance.get('/plugin-route', async (request, reply) => {
    throw new Error('Error in plugin');
  });
});


class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

fastify.get('/custom-error', async (request, reply) => {
  throw new CustomError('Custom error message', 400);
});

// Start server
fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server listening on port 3000');
});