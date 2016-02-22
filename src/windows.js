'use strict';

const _ = require('lodash');
const os = require('os');

const commands = require('./../commands.json').windowsCommands;

module.exports = {

  registerCommands(self) {
    self.vorpal
      .catch('[words...]', 'Catches content')
      .parse(function (input) {
        // Look for aliases and translate them.
        // Makes cash.alias and cash.unalias work.
        const parts = String(input).split(' ');
        const first = parts.shift();
        let out = input;
        const translation = self.vorpal._aliases[first];
        if (self.vorpal._aliases && translation) {
          /* istanbul ignore next */
          out = `${translation} ${parts.join(' ')}`;
        }
        return out;
      })
      /* istanbul ignore next */
      .autocomplete(function () {
        /* istanbul ignore next */
        return _.map(self.vorpal.commands, '_name');
      })
      .action(function (args, cb) {
        cb = cb || function () {};
        const spawn = require('child_process').spawn;
        const slf = this;

        const words = args.words.join(' ');
        let argus;

        let cmd;
        // Only register commands if on Windows.
        /* istanbul ignore next */
        if (os.platform() === 'win32') {
          for (let i = 0; i < commands.length; ++i) {
            if (String(words.slice(0, commands[i].length)).toLowerCase() === commands[i].toLowerCase()) {
              cmd = commands[i];
              argus = String(words.slice(commands[i].length, words.length)).trim().split(' ');
              argus = (argus.length === 1 && argus[0] === '') ? [] : argus;
            }
          }
        }

        // Accommodate tests for Linux.
        if (words === 'cash-test') {
          cmd = 'echo';
          argus = ['hi'];
        }

        if (cmd === undefined || argus === undefined) {
          slf.help();
          cb();
          return;
        }

        argus.unshift(cmd);
        argus.unshift('/C');
        let proc;
        let out = '';
        try {
          proc = spawn('cmd', argus);
        } catch (e) {
          /* istanbul ignore next */
          slf.log(e);
        }

        let closed = false;

        // Properly print stdout as it's fed,
        // waiting for line breaks before sending
        // it to Vorpal.
        function print() {
          const parts = String(out).split('\n');
          /* istanbul ignore next */
          if (parts.length > 1) {
            out = parts.pop();
            const logging = String(parts.join('\n')).replace(/\r\r/g, '\r');
            slf.log(logging);
          }
          /* istanbul ignore next */
          if (closed === false) {
            setTimeout(function () {
              print();
            }, 50);
          }
        }
        print();

        /* istanbul ignore next */
        proc.stdout.on('data', function (data) {
          out += data.toString('utf8');
        });

        /* istanbul ignore next */
        proc.stderr.on('data', function (data) {
          out += data.toString('utf8');
        });

        proc.on('close', function () {
          closed = true;
          if (String(out).trim() !== '') {
            slf.log(String(out).replace(/\r\r/g, '\r'));
            out = '';
          }
          /* istanbul ignore next */
          setTimeout(function () {
            cb();
          }, 150);
        });

        proc.on('error', function (data) {
          out += data.toString('utf8');
        });
      });
  }
};
