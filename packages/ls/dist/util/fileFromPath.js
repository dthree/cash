'use strict';

/**
 * Parses a path and returns just the file
 *
 * @param {path} str
 * @return {String}
 * @api public
 */

module.exports = function (path) {
  var fileShort = String(path).split('/');
  fileShort = fileShort[fileShort.length - 1];
  fileShort = fileShort.split('\\');
  fileShort = fileShort[fileShort.length - 1];
  return fileShort;
};