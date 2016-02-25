'use strict';

/**
 * Intercepts stdout, passes thru callback
 * also pass console.error thru stdout so it goes to callback too
 * (stdout.write and stderr.write are both refs to the same stream.write function)
 * returns an unhook() function, call when done intercepting
 *
 * @param {Function} callback
 * @return {Function}
 */

module.exports = function (callback) {
  var oldStdoutWrite = process.stdout.write;
  var oldConsoleError = console.error;
  process.stdout.write = function (write) {
    return function (string) {
      var args = Array.from(arguments);
      args[0] = interceptor(string);
      write.apply(process.stdout, args);
    };
  }(process.stdout.write);

  console.error = function () {
    return function () {
      var args = Array.from(arguments);
      args.unshift('\x1b[31m[ERROR]\x1b[0m');
      console.log.apply(console.log, args);
    };
  }(console.error);

  function interceptor(string) {
    // only intercept the string
    var result = callback(string);
    if (typeof result === 'string') {
      string = result.replace(/\n$/, '') + (result && /\n$/.test(string) ? '\n' : '');
    }
    return string;
  }
  // puts back to original
  return function unhook() {
    process.stdout.write = oldStdoutWrite;
    console.error = oldConsoleError;
  };
};