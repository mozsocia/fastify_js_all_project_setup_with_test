const productController = require('../controllers/productController');

async function productRoutes(fastify, options) {
  fastify.post('/products', productController.createProduct);
  fastify.get('/products', productController.getProducts);
  fastify.get('/products/:id', productController.getProduct);
  fastify.put('/products/:id', productController.updateProduct);
  fastify.delete('/products/:id', productController.deleteProduct);
}

module.exports = productRoutes;