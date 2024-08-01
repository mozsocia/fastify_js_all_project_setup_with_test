const Product = require('../models/product');
const { saveFile } = require('../utils/fileUpload');

const createProduct = async (req, reply) => {
  // console.log(req.body.files.image1)
  try {
    const data = req.body;
    // data.image1 = await saveFile(req.uploads.image1);
    // data.docs = await saveFile(req.uploads.docs);

    // const product = new Product(data);
    // await product.save();

    

    reply.code(201).send({...req.body,...req.uploads});
  } catch (error) {
    console.log(error)
    reply.code(500).send({ error: 'Internal Server Error' });
  }
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