const Product = require('../models/product');
const { saveFile } = require('../utils/fileUtils');
const { createValidator, ValidationError } = require('../utils/validationUtils');

// Define the schema for product creation with custom error messages
const productSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    description: { type: 'string', minLength: 1 },
    image1: { type: 'object' },
    docs: { type: 'object' }
  },
  required: ['title', 'description', 'image1', 'docs'],
  errorMessage: {
    properties: {
      title: 'Title should not be empty',
      description: 'Description should not be empty',
      image1: 'Image1 object is required',
      docs: 'Docs object is required'

    },
    required: {
      title: 'Title is required',
      description: 'Description is required',
      image1: 'Image1 is require d',
      docs: 'Docs is required',
    },
    _: 'Invalid product data structure'
  }
};

// Create a validator function for the product schema
const validateProduct = createValidator(productSchema);

const createProduct = async (req, reply) => {
  console.log(req.body);  // Contains form fields
  // Validate the request body
  validateProduct(req.body);

  const { title, description } = req.body;

  // Save image1
  const image1File = req.body.image1;
  const image1FileName = await saveFile(image1File);

  // Save docs
  const docsFile = req.body.docs;
  const docsFileName = await saveFile(docsFile);

  // Create and save the product
  const product = new Product({
    title,
    description,
    image1: image1FileName,
    docs: docsFileName,
  });

  await product.save();

  reply.code(201).send({ message: 'Product created successfully', product });

};


const getProducts = async (req, reply) => {
  try {
    const products = await Product.find();
    reply.send(products);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};

const getProduct = async (req, reply) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return reply.code(404).send({ error: 'Product not found' });
    }
    reply.send(product);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};

const updateProduct = async (req, reply) => {
  try {
    const { title, description } = req.body;
    const updateData = { title, description };

    if (req.body.files.image1) {
      updateData.image1 = await saveFile(req.body.files.image1);
    }
    if (req.body.files.docs) {
      updateData.docs = await saveFile(req.body.files.docs);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) {
      return reply.code(404).send({ error: 'Product not found' });
    }
    reply.send(product);
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};

const deleteProduct = async (req, reply) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return reply.code(404).send({ error: 'Product not found' });
    }
    reply.send({ message: 'Product deleted successfully' });
  } catch (error) {
    reply.code(500).send({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
};