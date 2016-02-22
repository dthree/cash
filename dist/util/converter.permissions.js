'use strict';

/**
 * Permission conversion utilities
 */

module.exports = {

  listing: {
    0: '---',
    1: '--x',
    2: '-w-',
    3: '-wx',
    4: 'r--',
    5: 'r-x',
    6: 'rw-',
    7: 'rwx'
  },

  modeToRWX: function modeToRWX(mode) {
    var octal = this.modeToOctal(mode);
    var rwx = this.octalToRWX(octal);
    return rwx;
  },
  modeToOctal: function modeToOctal(mode) {
    var octal = '0' + (mode & 511).toString(8);
    return octal;
  },
  octalToRWX: function octalToRWX(octal) {
    if (!octal) {
      return undefined;
    }
    var list = this.listing;
    var a = list[String(octal).charAt(1)];
    var b = list[String(octal).charAt(2)];
    var c = list[String(octal).charAt(3)];
    return a + b + c;
  }
};