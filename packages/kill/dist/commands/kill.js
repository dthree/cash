'use strict';

var fkill = require('fkill');
var os = require('os');

var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');

var usage = 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]';
var windows = os.platform().indexOf('win') > -1;
var signals = {
  SIGKILL: 9,
  SIGTERM: 15,
  KILL: 9,
  TERM: 15,
  9: 'KILL',
  15: 'TERM'
};

var kill = {
  exec: function exec(args, options) {
    options = options || {};

    var procs = args;
    procs = procs === undefined ? [] : procs;
    procs = typeof procs === 'string' ? String(procs).split(' ') : procs;
    procs = procs.filter(function (arg) {
      return String(arg).trim() !== '';
    });

    function log(str) {
      if (options.vorpal) {
        options.vorpal.log(str);
      } else {
        /* istanbul ignore next */
        console.log(str);
      }
    }

    if (options.l !== undefined) {
      if (options.l === true) {
        this.log(' 9) SIGKILL   15) SIGTERM');
        return 0;
      }
      if (signals[options.l]) {
        this.log(signals[options.l]);
        return 0;
      }
      this.log('-cash: kill: ' + options.l + ': invalid signal specification');
      return 0;
    }

    if (procs.length < 1) {
      this.log(usage);
      return 0;
    }

    var forced = options['9'] === true || options.n === 9 || String(options.s).toLowerCase() === 'sigkill' || String(options.s).toLowerCase() === 'kill';
    var opts = { force: forced };

    var _loop = function _loop(i) {
      var proc = procs[i];
      proc = !isNaN(proc) ? parseFloat(proc) : proc;
      proc = windows && isNaN(proc) && proc.indexOf('.') === -1 ? proc + '.exe' : proc;
      fkill(proc, opts).then(function () {
        // .. chill
      }).catch(function (err) {
        if (String(err.message).indexOf('failed') > -1) {
          log('-cash: kill: (' + proc + ') - No such process');
        }
      });
    };

    for (var i = 0; i < procs.length; ++i) {
      _loop(i);
    }

    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return kill;
  }
  vorpal.api.kill = kill;
  vorpal.command('kill [process...]').parse(preparser).option('-9', 'sigkill').option('-s [sig]', 'sig is a signal name').option('-n [sig]', 'sig is a signal number').option('-l [sigspec]', 'list the signal names').action(function (args, callback) {
    args.options = args.options || {};
    args.options.vorpal = vorpal;
    return interfacer.call(this, {
      command: kill,
      args: args.process,
      options: args.options,
      callback: callback
    });
  });
};