'use strict';

/**
 * Simple binding interface between
 * each command's function and the caller
 * of the command, whether by `cash.command`
 * or by being invoked by Vorpal.
 * This exists to abstract complexity
 * and create a standard in interfacing
 * commands acorss muliple execution paths.
 *
 * @param {Object} opt
 * @api public
 */

module.exports = function (opt) {
  var self = this;
  var stdout = '';
  opt.options = opt.options || {};
  opt.callback = opt.callback || function () {};
  opt.command = opt.command || {
    exec: function exec() {}
  };

  var logger = {
    log: function log(out) {
      stdout += out + '\n';
      if (opt.silent !== true) {
        // process.stdout.write(out) // to do - handle newline problem.
        self.log(out);
      }
    }
  };

  function onResult(result) {
    result = result === undefined ? 0 : result;
    opt.callback(null, stdout);
    return stdout;
  }

  if (opt.async === true) {
    return opt.command.exec.call(logger, opt.args, opt.options, onResult);
  }
  return onResult(opt.command.exec.call(logger, opt.args, opt.options));
};