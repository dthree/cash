'use strict';

var glob = require('glob');

/**
 * Expands wildcard files, etc. out
 * into their full paths.
 *
 * @param {Array} list
 * @return {Array}
 * @api public
 */

module.exports = function (list) {
  var total = list.length;
  var files = [];
  if (list.length < 1) {
    return [];
  }
  for (var i = 0; i < total; ++i) {
    var res = glob.sync(list[i], {});
    files[i] = res.length > 0 ? res : list[i];
  }
  var out = [];
  for (var i = 0; i < files.length; ++i) {
    out = Array.isArray(files[i]) ? out.concat(files[i]) : out.concat([files[i]]);
  }
  return out;
};