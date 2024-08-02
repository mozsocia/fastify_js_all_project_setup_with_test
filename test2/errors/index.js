const BaseError = require('./base/BaseError');
const loadErrorClasses = require('./loadErrors');

const errorClasses = loadErrorClasses();

function createError(name, ...args) {
  const ErrorClass = errorClasses[name];
  if (!ErrorClass) {
    throw new Error(`Unknown error type: ${name}`);
  }
  return new ErrorClass(...args);
}

module.exports = {
  createError,
  BaseError,
  ...errorClasses
};