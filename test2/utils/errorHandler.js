const { BaseError } = require('../errors');

function errorHandler(error, request, reply) {
  console.error('Error occurred:', error);

  if (error instanceof BaseError) {
    reply.status(error.statusCode).send({ error: error.message });
  } else {
    reply.status(500).send({ error: 'Internal Server Error' });
  }
}

module.exports = errorHandler;