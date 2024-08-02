const fs = require('fs');
const path = require('path');

function loadErrorClasses() {
  const errorClasses = {};

  function loadFromDir(dir) {
    fs.readdirSync(dir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = path.join(dir, dirent.name);
      // console.log('fullPath', fullPath);

      if (dirent.isDirectory()) {
        loadFromDir(fullPath); // Always recurse into directories
      } else if (dirent.name.endsWith('Error.js')) {
        const ErrorClass = require(fullPath);
        if (typeof ErrorClass === 'function') {
          errorClasses[ErrorClass.name] = ErrorClass;
        } else if (typeof ErrorClass === 'object') {
          Object.assign(errorClasses, ErrorClass);
        }
        // console.log(`Loaded: ${Object.keys(errorClasses).join(', ')}`);
      }
    });
  }

  loadFromDir(__dirname);
  // console.log("Final errorClasses", Object.keys(errorClasses));
  return errorClasses;
}

module.exports = loadErrorClasses;