'use strict';

const path = require('path');

const interfacer = require('./../util/interfacer');

const pwd = {
  exec() {
    this.log(path.resolve(process.cwd()).replace(/\\/g, '/'));
    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return pwd;
  }
  vorpal.api.pwd = pwd;
  vorpal
    .command('pwd [files...]')
    .action(function (args, callback) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: pwd,
        args: args.files,
        options: args.options,
        callback
      });
    });
};
