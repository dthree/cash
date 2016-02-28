'use strict';

const os = require('os');
const windows = (os.platform() === 'win32');

// Replace out env variables.
const parseEnvVariables = function (input) {
  const referenceRegex =
    /\${([a-zA-Z_][a-zA-Z0-9_]*)}|\$([a-zA-Z_][a-zA-Z0-9_]*)/g;

  return input.replace(referenceRegex, function (varRef, capture1, capture2, capture3) {
    const varName = capture1 || capture2 || capture3;
    let value = '';
    if (windows) {
      for (const name in process.env) {
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

const preparser = function (input) {
  input = parseEnvVariables(input);
  return input;
};

module.exports = preparser;
