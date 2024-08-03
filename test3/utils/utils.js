const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;


exports.validateId = (id) => {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Invalid ID');
    error.statusCode = 400;
    throw error;
  }
  return id;
};
