'use strict';

var interfacer = require('./../util/interfacer');

var clear = {
  exec: function exec() {
    this.log('\u001b[2J\u001b[0;0H');
    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return clear;
  }
  vorpal.api.clear = clear;
  vorpal.command('clear [files...]').action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: clear,
      args: args.files, // only pass in what you need from Vorpal
      options: args.options, // split the options into their own arg
      callback: callback
    });
  });
};