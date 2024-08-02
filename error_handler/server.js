const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');

// Connect to MongoDB mongoose.connect('mongodb://127.0.0.1:27017/test1')
mongoose.connect('mongodb://127.0.0.1:27017/error_test')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Define a schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }
});

const User = mongoose.model('User', UserSchema);

const errorHandler = (error, request, reply) => {
  // console.error(error);
  const statusCode = error.statusCode || 500;
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

fastify.post('/create-user', async (request, reply) => {
  const userData = request.body;
  
  
    const user = new User(userData);
    await user.save();
    reply.code(201).send(user);

});

// Start server
fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log('Server listening on port 3000');
});