'use strict';

var strip = require('./stripAnsi');
var pad = require('./pad');

/**
 * Formats an array to display in a TTY
 * in a pretty fashion.
 *
 * @param {Array} arr
 * @return {String}
 * @api public
 */

module.exports = function (arr, options) {
  arr = arr || [];
  options = options || {};
  var bk = JSON.parse(JSON.stringify(arr));
  var width = options.width && !isNaN(options.width) ? options.width : process.stdout.columns;
  var longest = strip(bk.sort(function (a, b) {
    return strip(b).length - strip(a).length;
  })[0] || '').length + 2;
  var fullWidth = strip(arr.join('')).length;
  var fitsOneLine = fullWidth + arr.length * 2 <= width;
  var cols = Math.floor(width / longest);
  cols = cols < 1 ? 1 : cols;
  if (fitsOneLine) {
    return arr.join('  ');
  }
  var col = 0;
  var lines = [];
  var line = '';
  for (var i = 0; i < arr.length; ++i) {
    if (col < cols) {
      col++;
    } else {
      if (String(strip(line)).trim() !== '') {
        lines.push(line);
      }
      line = '';
      col = 1;
    }
    if (cols === 1) {
      // If we have files so damn
      // long that we wrap, don't pad
      // the lines.
      line += arr[i];
    } else {
      // Pad the lines based on the
      // longest word.
      /* istanbul ignore next */
      line += pad(arr[i], longest, ' ');
    }
  }
  if (line !== '') {
    lines.push(line);
  }
  return lines.join('\n');
};