'use strict';

var os = require('os');
var execa = require('execa');
var windows = os.platform() === 'win32';

var exclusions = require('./../commands.json').windowsExclusions;

module.exports = {
  registerCommands: function registerCommands(self) {
    self.vorpal.catch('[words...]', 'Catches content').parse(function (input) {
      // Look for aliases and translate them.
      // Makes cash.alias and cash.unalias work.
      var parts = String(input).split(' ');
      var first = parts.shift();
      var out = input;
      var translation = self.vorpal._aliases[first];
      if (self.vorpal._aliases && translation) {
        /* istanbul ignore next */
        out = translation + ' ' + parts.join(' ');
      }
      return out;
    }).autocomplete(function () {
      /* istanbul ignore next */
      return self.vorpal.commands.map(function (c) {
        return c._name;
      });
    }).action(function (args, cb) {
      cb = cb || function () {};
      var slf = this;

      var words = args.words.join(' ');
      var argus = void 0;

      var cmd = void 0;
      var excluded = false;
      for (var i = 0; i < exclusions.length; ++i) {
        if (String(words.slice(0, exclusions[i].length)).toLowerCase() === exclusions[i].toLowerCase()) {
          excluded = true;
          cmd = undefined;
          argus = undefined;
        }
      }

      if (!excluded) {
        var parts = words.split(' ');
        cmd = parts.shift();
        argus = parts;
        argus = argus.length === 1 && argus[0] === '' ? [] : argus;
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

      var proc = void 0;
      var out = '';
      try {
        proc = execa(cmd, argus);
      } catch (e) {
        /* istanbul ignore next */
        slf.log(e);
      }

      var closed = false;

      // Properly print stdout as it's fed,
      // waiting for line breaks before sending
      // it to Vorpal.
      function print() {
        var parts = String(out).split('\n');
        /* istanbul ignore next */
        if (parts.length > 1) {
          out = parts.pop();
          var logging = String(parts.join('\n')).replace(/\r\r/g, '\r');
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
      var windowsHelpFlag = false;
      var windowsCommandReject = 'is not recognized as an internal or external command';

      /* istanbul ignore next */
      proc.stdout.on('data', function (data) {
        out += data.toString('utf8');
      });

      /* istanbul ignore next */
      proc.stderr.on('data', function (data) {
        var str = data.toString('utf8');
        if (windows && str.indexOf(windowsCommandReject) > -1) {
          windowsHelpFlag = true;
          return;
        }
        out += str;
      });

      proc.on('close', function () {
        closed = true;
        if (String(out).trim() !== '') {
          // Remove a trailing newline, because log() will add it back:
          out = String(out).replace(/\n$/g, '');
          out = String(out).replace(/\r\r/g, '\r');
          slf.log(out);
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
        if (data.code === 'ENOENT') {
          windowsHelpFlag = true;
          return;
        }
        out += data.toString('utf8');
      });
    });
  }
};