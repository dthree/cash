'use strict';

const interfacer = require('./../util/interfacer');

const clear = {
  exec() {
    this.log('\u001b[2J\u001b[0;0H');
    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return clear;
  }
  vorpal.api.clear = clear;
  vorpal
    .command('clear')
    .action(function (args, callback) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: clear,
        args,
        options: args.options,
        callback
      });
    });
};
