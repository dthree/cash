'use strict';

// Replace out env variables.

var parseEnvVariables = function parseEnvVariables(input) {
  var referenceRegex = /\${([a-zA-Z_][a-zA-Z0-9_]*)}|\$([a-zA-Z_][a-zA-Z0-9_]*)/g;

  return input.replace(referenceRegex, function (varRef, capture1, capture2, capture3) {
    var varName = capture1 || capture2 || capture3;
    // Return the value of the variable, or the empty string if not there
    return process.env.hasOwnProperty(varName) ? process.env[varName] : '';
  });
};

var preparser = function preparser(input) {
  input = parseEnvVariables(input);
  return input;
};

module.exports = preparser;