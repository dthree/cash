'use strict';

const strip = require('./stripAnsi');
const pad = require('./pad');

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
  const bk = JSON.parse(JSON.stringify(arr));
  const width = (options.width && !isNaN(options.width)) ?
    options.width :
    process.stdout.columns;
  const longest = strip(bk.sort(function (a, b) {
    return strip(b).length - strip(a).length;
  })[0] || '').length + 2;
  const fullWidth = strip(arr.join('')).length;
  const fitsOneLine = ((fullWidth + (arr.length * 2)) <= width);
  let cols = Math.floor(width / longest);
  cols = (cols < 1) ? 1 : cols;
  if (fitsOneLine) {
    return arr.join('  ');
  }
  let col = 0;
  const lines = [];
  let line = '';
  for (let i = 0; i < arr.length; ++i) {
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
