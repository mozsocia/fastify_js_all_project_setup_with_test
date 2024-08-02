const MultipartError = require('../MultipartError');

class FieldsLimitError extends MultipartError {
  constructor() {
    super(`Too many fields in the form data`, 413);
  }
}

module.exports = FieldsLimitError;