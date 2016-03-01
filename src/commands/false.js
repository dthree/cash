'use strict';

const interfacer = require('./../util/interfacer');

const _false = {
  exec() {
    // Always return 1
    return 1;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return _false;
  }
  vorpal.api.false = _false;
  vorpal
    .command('false')
    .action(function (args, callback) {
      return interfacer.call(this, {
        command: _false,
        callback
      });
    });
};
