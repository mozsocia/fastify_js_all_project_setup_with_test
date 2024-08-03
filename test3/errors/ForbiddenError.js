const BaseError = require('./BaseError');

class ForbiddenError extends BaseError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
  }
}

module.exports = ForbiddenError;