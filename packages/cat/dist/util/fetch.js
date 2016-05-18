'use strict';

var fs = require('fs');
var path = require('path');

var expand = require('./expand');

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
  stdin = stdin !== undefined ? stdin : [];
  var f = expand(files);

  if (!(f.length === 0 && files.length > 0)) {
    files = f;
  }

  for (var i = 0; i < files.length; ++i) {
    try {
      var stat = fs.statSync(files[i]);
      if (stat.isDirectory()) {
        files[i] = options.onDirectory(files[i]);
      } else {
        files[i] = String(fs.readFileSync(path.normalize(files[i]), 'utf8'));
      }
    } catch (e) {
      files[i] = options.onInvalidFile(files[i]);
    }
  }

  var agg = files.length < 1 ? stdin : files;
  var final = [];

  for (var _i = 0; _i < agg.length; ++_i) {
    if (agg[_i] !== undefined) {
      final.push(agg[_i]);
    }
  }
  return final;
};