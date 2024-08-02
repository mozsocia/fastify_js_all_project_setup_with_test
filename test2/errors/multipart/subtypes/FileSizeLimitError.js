const MultipartError = require('../MultipartError');

class FileSizeLimitError extends MultipartError {
  constructor(fieldname) {
    super(`File size limit exceeded for ${fieldname}`, 413);
  }
}

module.exports = FileSizeLimitError;