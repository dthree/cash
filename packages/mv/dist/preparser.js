'use strict';

var os = require('os');
var windows = os.platform() === 'win32';

// Replace out env variables.
var parseEnvVariables = function parseEnvVariables(input) {
  var regex1 = windows ? /(\%.*?\%)/ : /(\${[^\$]*}|\$[^\$]*)/;
  var regex2 = windows ? /^\%|\%$/g : /^\${|}$|^\$/g;

  var total = '';
  function iterate(str) {
    var match = regex1.exec(str);
    if (match !== null) {
      var string = match[0];
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
      var sliceLength = parseFloat(string.length) + parseFloat(match.index) - (value !== null ? 0 : 1);
      var prefix = str.slice(0, sliceLength);
      var suffix = str.slice(sliceLength, str.length);
      if (value !== null) {
        prefix = prefix.replace(string, value);
      }
      total += prefix;
      return iterate(suffix);
    }
    return str;
  }

  var out = iterate(input);
  total += out;
  return total;
};

var preparser = function preparser(input) {
  input = parseEnvVariables(input);
  return input;
};

module.exports = preparser;