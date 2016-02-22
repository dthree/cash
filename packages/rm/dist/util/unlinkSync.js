'use strict';

var fs = require('fs');

/**
 * Normalizes _unlinkSync() across
 * platforms to match Unix behavior, i.e.
 * file can be unlinked even its it's
 * read only.
 * See https://github.com/joyent/node/issues/3006
 *
 * @param {String} file
 * @api public
 */

module.exports = function (file) {
  try {
    fs.unlinkSync(file);
  } catch (e) {
    // Try to override file permission
    /* istanbul ignore if */
    if (e.code === 'EPERM') {
      fs.chmodSync(file, '0666');
      fs.unlinkSync(file);
    } else {
      /* istanbul ignore next */
      throw e;
    }
  }
};