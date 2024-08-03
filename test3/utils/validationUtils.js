// utils/validationUtils.js
const { ValidationError } = require('../errors');
const Ajv = require('ajv');
const addErrors = require('ajv-errors');

const ajv = new Ajv({ allErrors: true });
addErrors(ajv);


const createValidator = (schema) => {
  const validate = ajv.compile(schema);
  
  return (data) => {
    const valid = validate(data);
    if (!valid) {
      const errors = validate.errors.reduce((acc, error) => {
        const field = error.message.split(' ')[0].toLowerCase();
        acc[field] = error.message;
        return acc;
      }, {});
      throw new ValidationError(errors);
    }
  };
};

module.exports = { createValidator, ValidationError };