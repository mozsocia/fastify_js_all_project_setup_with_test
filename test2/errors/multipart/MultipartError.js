const BaseError = require('../base/BaseError');

class MultipartError extends BaseError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}

module.exports = MultipartError;