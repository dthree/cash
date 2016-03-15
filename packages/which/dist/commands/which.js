'use strict';

var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');

var which = {
  exec: function exec(args, options) {
    options = options || {};

    var command = (args instanceof Array ? args : [args]).join(' ');
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

  vorpal.command('which [command]').parse(preparser).action(function (args, callback) {
    return interfacer.call(this, {
      command: which,
      args: args.command,
      options: {},
      callback: callback
    });
  });
};