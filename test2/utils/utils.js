const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const addFormats = require("ajv-formats");
const addErrors = require('ajv-errors')
addFormats(ajv);
addErrors(ajv);

exports.validateId = (id) => {
  if (!ObjectId.isValid(id)) {
    const error = new Error('Invalid ID');
    error.statusCode = 400;
    throw error;
  }
  return id;
};

exports.validateSchema = (schema) => {
  const validate = ajv.compile(schema);
  
  return (data) => {
    const valid = validate(data);
    if (!valid) {
      console.log(validate.errors)
      const errors = validate.errors.reduce((acc, error) => {
        const field = error.instancePath.substring(1); // Remove leading slash
        acc[field || error.params.missingProperty] = error.message;
        return acc;
      }, {});
      
      const error = new Error('Validation failed');
      error.statusCode = 400;
      error.errors = errors;
      throw error;
    }
    return data;
  };
};