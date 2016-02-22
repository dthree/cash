'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Walks a single directory calling
 * a callback function for each file or
 * folder, returning the path and results
 * of fs.statSync.
 *
 * @param {String} currentDirPath
 * @param {Function} callback
 * @api public
 */

module.exports = function (currentDirPath, callback) {
  function readFile(path, cbk) {
    var stat = undefined;
    try {
      stat = fs.statSync(path);
      if (stat.isFile() || stat.isDirectory()) {
        cbk(path, stat);
      }
    } catch (e) {
      // .. if we can't read the file, forget
      // about it for now.
    }
  }
  try {
    var dirs = fs.readdirSync(currentDirPath);
    dirs.forEach(function (name) {
      var filePath = path.join(currentDirPath, name);
      readFile(filePath, callback);
    });
  } catch (e) {
    if (e.code === 'ENOTDIR') {
      readFile(currentDirPath, callback);
    }
  }
};