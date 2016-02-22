'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Recursively walks through and executes
 * a callback function for each directory found.
 *
 * @param {String} currentDirPath
 * @param {Function} callback
 * @api public
 */

module.exports = function (currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach(function (name) {
    var filePath = path.join(currentDirPath, name);
    var stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      callback(filePath, stat);
      module.exports(filePath, callback);
    }
  });
};