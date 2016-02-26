'use strict';

var os = require('os');
var windows = os.platform() === 'win32';

var preparser = function preparser(input) {
  // Replace out env variables.
  /* istanbul ignore next */
  var regex1 = undefined;
  var regex2 = undefined;
  if (windows) {
    regex1 = /(\%.*?\%)/;
    regex2 = /^\%|\%$/g;
  } else {
    regex1 = /(\${[^\$]*}|\$[^\$]*)/;
    regex2 = /^\${|}$|^\$/g;
  }
  var total = '';
  function roll(str) {
    var match = regex1.exec(str);
    if (match !== null) {
      var string = match[0];
      var sliceLength = parseFloat(string.length) + parseFloat(match.index);
      var stripped = String(string.replace(regex2, '')).toLowerCase();
      var value = null;
      for (var name in process.env) {
        if (process.env.hasOwnProperty(name)) {
          if (String(name).toLowerCase() === stripped) {
            value = process.env[name];
            break;
          } else if (!windows) {
            value = ''; // default to empty string on Unix
          }
        }
      }
      var prefix = undefined;
      var suffix = undefined;
      if (value !== null) {
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
  var remainder = roll(input);
  total += remainder;
  input = total;
  return input;
};

module.exports = preparser;