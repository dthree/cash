'use strict';

const os = require('os');
const windows = (os.platform() === 'win32');

const exclusions = require('./../commands.json').windowsExclusions;

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
      .autocomplete(function () {
        /* istanbul ignore next */
        return self.vorpal.commands.map(c => c._name);
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
        if (windows) {
          let excluded = false;
          for (let i = 0; i < exclusions.length; ++i) {
            if (String(words.slice(0, exclusions[i].length)).toLowerCase() === exclusions[i].toLowerCase()) {
              excluded = true;
              cmd = undefined;
              argus = undefined;
            }
          }

          if (!excluded) {
            const parts = words.split(' ');
            cmd = parts.shift();
            argus = parts;
            argus = (argus.length === 1 && argus[0] === '') ? [] : argus;
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

        // See if we get a Windows help on an
        // invalid command and instead throw
        // Cash help.
        let windowsHelpFlag = false;
        const windowsCommandReject = 'is not recognized as an internal or external command';

        /* istanbul ignore next */
        proc.stdout.on('data', function (data) {
          out += data.toString('utf8');
        });

        /* istanbul ignore next */
        proc.stderr.on('data', function (data) {
          const str = data.toString('utf8');
          if (windows && str.indexOf(windowsCommandReject) > -1) {
            windowsHelpFlag = true;
            return;
          }
          out += str;
        });

        proc.on('close', function () {
          closed = true;
          if (String(out).trim() !== '') {
            slf.log(String(out).replace(/\r\r/g, '\r'));
            out = '';
          }
          if (windowsHelpFlag) {
            slf.help();
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
