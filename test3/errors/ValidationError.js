const BaseError = require('./BaseError');

class ValidationError extends BaseError {
  constructor(details = {}, message = 'Validation failed' ) {
    super(message, 400);
    this.details = details;
  }
}

module.exports = ValidationError;