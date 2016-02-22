'use strict';

const fs = require('fs');
const path = require('path');

const expand = require('./expand');

/**
 * Reads the contents of an array of
 * files and returns the array.
 *
 * @param {Array} files
 * @param {String} stdin
 * @param {Object} options
 * @return {Array}
 * @api public
 */

module.exports = function (files, stdin, options) {
  files = files || [];
  stdin = (stdin !== undefined) ? stdin : [];
  const f = expand(files);

  if (!(f.length === 0 && files.length > 0)) {
    files = f;
  }

  for (let i = 0; i < files.length; ++i) {
    try {
      const stat = fs.statSync(files[i]);
      if (stat.isDirectory()) {
        files[i] = options.onDirectory(files[i]);
      } else {
        files[i] = String(fs.readFileSync(path.normalize(files[i]), 'utf8'));
      }
    } catch (e) {
      files[i] = options.onInvalidFile(files[i]);
    }
  }

  const agg = (files.length < 1) ? stdin : files;
  const final = [];

  for (let i = 0; i < agg.length; ++i) {
    if (agg[i] !== undefined) {
      final.push(agg[i]);
    }
  }
  return final;
};
