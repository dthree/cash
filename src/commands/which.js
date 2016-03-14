'use strict';

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const which = {
  exec(args, options) {
    options = options || {};

    let command = ((args instanceof Array) ? args : [args]).join(' ');
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
    // .option('-o, --option', 'option description')
    .action(function (args, callback) {
    //   args.options = args.options || {};
      return interfacer.call(this, {
        command: which,
        args: args.command, // only pass in what you need from Vorpal
        // options: args.options, // split the options into their own arg
        callback
      });
    });
};
