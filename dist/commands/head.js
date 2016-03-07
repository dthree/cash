'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var interfacer = require('./../util/interfacer');
var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');

var expand = require('./../util/expand');

var head = {
  exec: function exec(args, options) {
    options = options || {};
    args = args || '';
    var source = args.stdin === undefined ? 'files' : 'stdin';

    var lines = options.lines ? Math.abs(options.lines) : 10;
    if (!Number.isInteger(lines)) {
      this.log('head: ' + options.lines + ': invalid number of lines');
      return 0;
    }

    /* istanbul ignore next */
    if (source === 'stdin') {
      var _stdout = head.readLines(args.stdin[0], lines);
      _stdout = _stdout.replace(/\n$/, '');
      if (_stdout.trim() !== '') {
        this.log(_stdout);
      }
      return 0;
    }

    var files = args.files || args;
    files = (typeof files === 'undefined' ? 'undefined' : _typeof(files)) === 'object' && files !== null && !Array.isArray(files) ? [] : files;
    files = files === undefined ? [] : files;
    files = typeof files === 'string' ? String(files).split(' ') : files;
    files = files.filter(function (arg) {
      return String(arg).trim() !== '';
    });
    files = expand(files);

    var stdout = '';
    var verbose = files.length > 1 && !options.silent || options.verbose;

    for (var i = 0; i < files.length; i++) {
      try {
        var content = fs.readFileSync(files[i]).toString();
        if (verbose) {
          stdout += (i > 0 ? '\n' : '') + '==> ' + files[i] + ' <==\n';
        }
        stdout += head.readLines(content, lines);
      } catch (e) {
        stdout += 'head: cannot open ' + files[i] + ' for reading: No such file or directory';
      }
    }

    stdout = stdout.replace(/\n$/, '');
    if (stdout.trim() !== '') {
      this.log(stdout);
    }

    return 0;
  },
  readLines: function readLines(content, numberOfLines) {
    var stdout = '';
    var contentArray = content.split('\n');
    var linesToRead = numberOfLines >= contentArray.length ? contentArray.length : numberOfLines;
    for (var i = 0; i < linesToRead; i++) {
      if (stdout === '') {
        stdout = contentArray[i] + '\n';
        continue;
      }
      stdout += contentArray[i] + '\n';
    }
    return stdout;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return head;
  }
  vorpal.api.head = head;
  vorpal.command('head [files...]').option('-n, --lines [number]', 'print the first K lines instead of the first 10').option('-q, --silent', 'Suppresses printing of headers when multiple files are being examined.').option('-v, --verbose', 'Always output headers giving file names.').autocomplete(fsAutocomplete()).action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: head,
      args: args,
      options: args.options,
      callback: callback
    });
  });
};