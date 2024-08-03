// utils/validationUtils.js

const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true });
const addFormats = require("ajv-formats");
const addErrors = require('ajv-errors')
addFormats(ajv);
addErrors(ajv);

const createValidator = (schema) => {
  const validate = ajv.compile(schema);
  
  return (data) => {
    const valid = validate(data);
    if (!valid) {
      const errors = validate.errors.map(error => {
        const field = error.message.split(' ')[0].toLowerCase();
        return {
          field: field,
          message: error.message
        };
      });
      return { valid: false, errors };
    }
    return { valid: true };
  };
};

module.exports = { createValidator };