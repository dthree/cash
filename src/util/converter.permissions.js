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

  modeToRWX(mode) {
    const octal = this.modeToOctal(mode);
    const rwx = this.octalToRWX(octal);
    return rwx;
  },

  modeToOctal(mode) {
    const octal = `0${(mode & 0o777).toString(8)}`;
    return octal;
  },

  octalToRWX(octal) {
    if (!octal) {
      return undefined;
    }
    const list = this.listing;
    const a = list[String(octal).charAt(1)];
    const b = list[String(octal).charAt(2)];
    const c = list[String(octal).charAt(3)];
    return a + b + c;
  }
};
