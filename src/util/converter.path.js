'use strict';

const path = require('path');

/**
 * Path conversion utilities
 */

module.exports = {

  unix(str) {
    let input = path.normalize(str);
    input = input.replace(/\\/g, '\/');
    const parts = input.split(':');
    const drive = parts.shift();
    const isLetter = (drive.length === 1 && drive.match(/[a-z]/i));
    const result = (isLetter) ? drive + parts.join(':') : input;
    return result;
  }
};
