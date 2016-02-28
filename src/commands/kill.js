'use strict';

const fkill = require('fkill');
const os = require('os');

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const usage = `kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]`;
const windows = (os.platform().indexOf('win') > -1);
const signals = {
  SIGKILL: 9,
  SIGTERM: 15,
  KILL: 9,
  TERM: 15,
  9: 'KILL',
  15: 'TERM'
};

const kill = {

  exec(args, options) {
    options = options || {};

    let procs = args;
    procs = (procs === undefined) ? [] : procs;
    procs = (typeof procs === 'string') ? String(procs).split(' ') : procs;
    procs = procs.filter(arg => String(arg).trim() !== '');

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
        this.log(` 9) SIGKILL   15) SIGTERM`);
        return 0;
      }
      if (signals[options.l]) {
        this.log(signals[options.l]);
        return 0;
      }
      this.log(`-cash: kill: ${options.l}: invalid signal specification`);
      return 0;
    }

    if (procs.length < 1) {
      this.log(usage);
      return 0;
    }

    const forced = (options['9'] === true) ||
      (options.n === 9) ||
      (String(options.s).toLowerCase() === 'sigkill') ||
      (String(options.s).toLowerCase() === 'kill');
    const opts = {force: forced};

    for (let i = 0; i < procs.length; ++i) {
      let proc = procs[i];
      proc = (!isNaN(proc)) ? parseFloat(proc) : proc;
      proc = (windows && isNaN(proc) && proc.indexOf('.') === -1) ?
        `${proc}.exe` :
        proc;
      fkill(proc, opts).then(function () {
        // .. chill
      }).catch(function (err) {
        if (String(err.message).indexOf('failed') > -1) {
          log(`-cash: kill: (${proc}) - No such process`);
        }
      });
    }

    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return kill;
  }
  vorpal.api.kill = kill;
  vorpal
    .command('kill [process...]')
    .parse(preparser)
    .option('-9', 'sigkill')
    .option('-s [sig]', 'sig is a signal name')
    .option('-n [sig]', 'sig is a signal number')
    .option('-l [sigspec]', 'list the signal names')
    .action(function (args, callback) {
      args.options = args.options || {};
      args.options.vorpal = vorpal;
      return interfacer.call(this, {
        command: kill,
        args: args.process,
        options: args.options,
        callback
      });
    });
};
