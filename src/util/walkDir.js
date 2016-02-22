'use strict';

const fs = require('fs');
const path = require('path');

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
    let stat;
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
    const dirs = fs.readdirSync(currentDirPath);
    dirs.forEach(function (name) {
      const filePath = path.join(currentDirPath, name);
      readFile(filePath, callback);
    });
  } catch (e) {
    if (e.code === 'ENOTDIR') {
      readFile(currentDirPath, callback);
    }
  }
};
