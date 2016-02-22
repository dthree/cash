'use strict';

const strip = require('./stripAnsi');

/**
 * Pads to the left hand.
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
  const len = Math.max(0, width - strip(str).length);
  return Array(len + 1).join(delimiter) + str;
};
