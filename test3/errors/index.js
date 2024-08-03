const BaseError = require('./BaseError');
const NotFoundError = require('./NotFoundError');
const ValidationError = require('./ValidationError');
const UnauthorizedError = require('./UnauthorizedError');
const ForbiddenError = require('./ForbiddenError');

module.exports = {
  BaseError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError
};