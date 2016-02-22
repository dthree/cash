'use strict';

const glob = require('glob');

/**
 * Expands wildcard files, etc. out
 * into their full paths.
 *
 * @param {Array} list
 * @return {Array}
 * @api public
 */

module.exports = function (list) {
  const total = list.length;
  const files = [];
  if (list.length < 1) {
    return [];
  }
  for (let i = 0; i < total; ++i) {
    const res = glob.sync(list[i], {});
    files[i] = (res.length > 0) ?
      res :
      list[i];
  }
  let out = [];
  for (let i = 0; i < files.length; ++i) {
    out = (Array.isArray(files[i])) ?
      out.concat(files[i]) :
      out.concat([files[i]]);
  }
  return out;
};
