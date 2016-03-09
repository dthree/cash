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
 * @param {Function} errorCallback
 * @api public
 */
module.exports = function (currentDirPath, callback, errorCallback) {
  /**
   * @param {String} path
   * @param {Function} cbk
   * @param {Function} ecbk
   */
  function readFile(path, cbk, ecbk) {
    try {
      var stat = fs.statSync(path);
      if (stat.isFile() || stat.isDirectory()) {
        cbk(path, stat);
      }
    } catch (e) {
      ecbk(path, e);
    }
  }

  try {
    var dirs = fs.readdirSync(currentDirPath);
    dirs.forEach(function (name) {
      var filePath = path.join(currentDirPath, name);
      readFile(filePath, callback, errorCallback);
    });
  } catch (e) {
    if (e.code === 'ENOTDIR') {
      readFile(currentDirPath, callback, errorCallback);
    } else {
      errorCallback(currentDirPath, e);
    }
  }
};