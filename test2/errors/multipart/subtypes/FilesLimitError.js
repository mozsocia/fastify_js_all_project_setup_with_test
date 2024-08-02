const MultipartError = require('../MultipartError');

class FilesLimitError extends MultipartError {
  constructor() {
    super(`Too many files in the form data`, 413);
  }
}

module.exports = FilesLimitError;