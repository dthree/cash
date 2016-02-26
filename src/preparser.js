'use strict';

const os = require('os');
const windows = (os.platform() === 'win32');

const preparser = function (input) {
  // On windows, replace out env variables.
  /* istanbul ignore next */
  if (windows) {
    let total = '';
    function roll(str) {
      const match = /(\%.*?\%)/.exec(str);
      if (match !== null) {
        const string = match[0];
        const sliceLength = (parseFloat(string.length) + parseFloat(match.index));
        const stripped = String(string.replace(/^\%|\%$/g, '')).toLowerCase();
        let value;
        for (const name in process.env) {
          if (process.env.hasOwnProperty(name)) {
            if (String(name).toLowerCase() === stripped) {
              value = process.env[name];
            }
          }
        }
        let prefix;
        let suffix;
        if (value) {
          prefix = str.slice(0, sliceLength);
          suffix = str.slice(sliceLength, str.length);
          prefix = prefix.replace(string, value);
        } else {
          prefix = str.slice(0, sliceLength - 1);
          suffix = str.slice(sliceLength - 1, str.length);
        }
        total += prefix;
        return roll(suffix);
      }
      return str;
    }
    const remainder = roll(input);
    total += remainder;
    input = total;
  }
  return input;
};

module.exports = preparser;
