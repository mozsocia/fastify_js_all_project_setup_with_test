const fs = require('fs');
const path = require('path');

const errorClasses = {};

function loadErrorClasses(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
    const fullPath = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dirent.name !== 'subtypes') {
        loadErrorClasses(fullPath);
      } else {
        // Load subtypes
        fs.readdirSync(fullPath).forEach(file => {
          if (file.endsWith('.js')) {
            const ErrorClass = require(path.join(fullPath, file));
            errorClasses[ErrorClass.name] = ErrorClass;
          }
        });
      }
    } else if (dirent.name.endsWith('.js') && dirent.name !== 'index.js') {
      const ErrorClass = require(fullPath);
      errorClasses[ErrorClass.name] = ErrorClass;
    }
  });
}

loadErrorClasses(__dirname);

function createError(name, ...args) {
  const ErrorClass = errorClasses[name];
  if (!ErrorClass) {
    throw new Error(`Unknown error type: ${name}`);
  }
  return new ErrorClass(...args);
}

module.exports = { createError };