'use strict';

var strip = require('./stripAnsi');

/**
 * Pads a value with with space or
 * a specified delimiter to match a
 * given width.
 *
 * @param {String} str
 * @param {Integer} width
 * @param {String} delimiter
 * @return {String}
 * @api public
 */

module.exports = function (str, width, delimiter) {
  width = Math.floor(width);
  delimiter = delimiter || ' ';
  var len = Math.max(0, width - strip(str).length);
  return str + Array(len + 1).join(delimiter);
};