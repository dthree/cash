'use strict';

const interfacer = require('./../util/interfacer');

const _true = {
  exec() {
    // Always return 0
    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return _true;
  }
  vorpal.api.true = _true;
  vorpal
    .command('true')
    .action(function (args, callback) {
      return interfacer.call(this, {
        command: _true,
        callback
      });
    });
};
