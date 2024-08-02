const MultipartError = require('../MultipartError');

class PartsLimitError extends MultipartError {
  constructor() {
    super(`Too many parts in the form data`, 413);
  }
}

module.exports = PartsLimitError;