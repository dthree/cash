'use strict';

var os = require('os');
var windows = os.platform() === 'win32';

// Replace out env variables.
var parseEnvVariables = function parseEnvVariables(input) {
  var referenceRegex = /\${([a-zA-Z_][a-zA-Z0-9_]*)}|\$([a-zA-Z_][a-zA-Z0-9_]*)/g;

  return input.replace(referenceRegex, function (varRef, capture1, capture2, capture3) {
    var varName = capture1 || capture2 || capture3;
    var value = '';
    if (windows) {
      for (var name in process.env) {
        if (process.env.hasOwnProperty(name)) {
          // Windows is case insensitive
          if (String(name).toLowerCase() === varName.toLowerCase()) {
            value = process.env[name];
            break;
          }
        }
      }
    } else {
      // default to empty string on Unix
      value = process.env.hasOwnProperty(varName) ? process.env[varName] : '';
    }
    return value;
  });
};

var preparser = function preparser(input) {
  input = parseEnvVariables(input);
  return input;
};

module.exports = preparser;