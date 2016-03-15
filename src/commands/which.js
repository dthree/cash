'use strict';

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const which = {
  exec(args, options) {
    options = options || {};

    const command = ((args instanceof Array) ? args : [args]).join(' ');
    if (command.length <= 0) {
      return 0;
    }
    try {
      this.log(require('which').sync(command));
      return 0;
    } catch (error) {
      this.log(error);
      return 1;
    }
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return which;
  }
  vorpal.api.which = which;

  vorpal
    .command('which [command]')
    .parse(preparser)
    .action(function (args, callback) {
      return interfacer.call(this, {
        command: which,
        args: args.command,
        options: {},
        callback
      });
    });
};
