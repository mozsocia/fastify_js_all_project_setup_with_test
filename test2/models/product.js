const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image1: { type: String, required: true },
  docs: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);