'use strict';

var os = require('os');
var windows = os.platform() === 'win32';

var preparser = function preparser(input) {
  // On windows, replace out env variables.
  /* istanbul ignore next */
  if (windows) {
    (function () {
      var roll = function roll(str) {
        var match = /(\%.*?\%)/.exec(str);
        if (match !== null) {
          var string = match[0];
          var sliceLength = parseFloat(string.length) + parseFloat(match.index);
          var stripped = String(string.replace(/^\%|\%$/g, '')).toLowerCase();
          var value = undefined;
          for (var name in process.env) {
            if (process.env.hasOwnProperty(name)) {
              if (String(name).toLowerCase() === stripped) {
                value = process.env[name];
              }
            }
          }
          var prefix = undefined;
          var suffix = undefined;
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
      };

      var total = '';

      var remainder = roll(input);
      total += remainder;
      input = total;
    })();
  }
  return input;
};

module.exports = preparser;