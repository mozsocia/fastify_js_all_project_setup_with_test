const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
const cors = require('@fastify/cors');
const formDataParser = require('./utils/formDataParser');
const productRoutes = require('./routes/productRoutes');
const errorHandler = require('./utils/errorHandler');

// Register plugins
fastify.register(cors, { origin: '*' });
fastify.register(formDataParser)

// Global error handler
fastify.setErrorHandler(errorHandler);

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/test1')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Register routes
fastify.register(productRoutes);

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server listening on http://localhost:3000');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();