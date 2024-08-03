// src/middleware/errorHandler.js

const { BaseError, ValidationError } = require('../errors');

function errorHandler(error, request, reply) {
  if (error instanceof BaseError) {
    // console.log(error)
    const response = {
      status: 'error',
      message: error.message,
    };

    if (error instanceof ValidationError) {
      response.details = error.details;
    }

    reply.status(error.statusCode).send(response);
  } else {
    // Handle unexpected errors
    console.error(error);
    reply.status(500).send({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
}

module.exports = errorHandler;