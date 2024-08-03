const BaseError = require('./BaseError');

class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;