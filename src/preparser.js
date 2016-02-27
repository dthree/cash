'use strict';

const os = require('os');
const windows = (os.platform() === 'win32');

// Replace out env variables.
const parseEnvVariables = function (input) {
  const regex1 = (windows) ?
    /(\%.*?\%)/ :
    /(\${[a-zA-Z_][a-zA-Z0-9_]*}|\$[a-zA-Z_][a-zA-Z0-9_]*)/;
  const regex2 = (windows) ?
    /^\%|\%$/g :
    /^\${|}$|^\$/g;

  let total = '';
  function iterate(str) {
    const match = regex1.exec(str);
    if (match !== null) {
      const string = match[0];
      const stripped = String(string.replace(regex2, '')).toLowerCase();
      let value = null;
      for (const name in process.env) {
        if (process.env.hasOwnProperty(name)) {
          if (String(name).toLowerCase() === stripped) {
            value = process.env[name];
            break;
          } else if (!windows) {
            value = ''; // default to empty string on Unix
          }
        }
      }
      const sliceLength = ((parseFloat(string.length) + parseFloat(match.index)) - ((value !== null) ? 0 : 1));
      let prefix = str.slice(0, sliceLength);
      const suffix = str.slice(sliceLength, str.length);
      if (value !== null) {
        prefix = prefix.replace(string, value);
      }
      total += prefix;
      return iterate(suffix);
    }
    return str;
  }

  const out = iterate(input);
  total += out;
  return total;
};

const preparser = function (input) {
  input = parseEnvVariables(input);
  return input;
};

module.exports = preparser;
