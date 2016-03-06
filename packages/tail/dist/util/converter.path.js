'use strict';

var path = require('path');

/**
 * Path conversion utilities
 */

module.exports = {
  unix: function unix(str) {
    var input = path.normalize(str);
    input = input.replace(/\\/g, '\/');
    var parts = input.split(':');
    var drive = parts.shift();
    var isLetter = drive.length === 1 && drive.match(/[a-z]/i);
    var result = isLetter ? drive + parts.join(':') : input;
    return result;
  }
};