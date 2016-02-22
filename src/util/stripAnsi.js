'use strict';

/**
 * Removes all ansi characters.
 *
 * @param {String} str
 * @return {String}
 * @api public
 */

module.exports = function (str) {
  const ansiRegex = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
  return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};
