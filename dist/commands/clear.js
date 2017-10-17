'use strict';

var interfacer = require('./../util/interfacer');

var clear = {
  exec: function exec() {
    this.log('\x1B[2J\x1B[0;0H');
    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return clear;
  }
  vorpal.api.clear = clear;
  vorpal.command('clear').action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: clear,
      args: args,
      options: args.options,
      callback: callback
    });
  });
};