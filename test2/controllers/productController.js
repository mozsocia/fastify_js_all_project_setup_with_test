const Product = require('../models/product');
const { saveFile } = require('../utils/fileUtils');


const createProduct = async (req, reply) => {
  console.log(req.body)  // Contains form fields

  try {
    if (!req.body.files) {
      return reply.code(400).send({ error: 'No files uploaded' })
    }

    const { title, description } = req.body
    
    // Save image1
    const image1File = req.body.files.image1
    if (!image1File) {
      return reply.code(400).send({ error: 'Image1 is required' })
    }
    const image1FileName = await saveFile(image1File)

    // Save docs
    const docsFile = req.body.files.docs
    if (!docsFile) {
      return reply.code(400).send({ error: 'Docs file is required' })
    }
    const docsFileName = await saveFile(docsFile)

    // Create and save the product
    const product = new Product({
      title,
      description,
      image1: image1FileName,
      docs: docsFileName,
    })

    await product.save()

    reply.code(201).send({ message: 'Product created successfully', product })
  } catch (error) {
    console.error('Error creating product:', error)
    reply.code(500).send({ error: 'Internal server error' , error})
  }
}

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