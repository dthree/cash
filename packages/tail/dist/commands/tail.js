'use strict';

var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');

var interfacer = require('./../util/interfacer');
var expand = require('./../util/expand');
var unixPath = require('./../util/converter.path').unix;

var tail = {
  exec: function exec(args, options) {
    options = options || {};
    var lines = options.lines ? Math.abs(options.lines) : 10;
    if (!Number.isInteger(lines)) {
      this.log('tail: ' + options.lines + ': invalid number of lines');
      return 0;
    }

    var files = args;
    files = files === undefined ? [] : files;
    files = typeof files === 'string' ? String(files).split(' ') : files;
    files = files.filter(function (file) {
      return String(file).trim() !== '';
    });
    files = expand(files);

    var out = '';
    for (var i = 0; i < files.length; i++) {
      var fileFound = false;
      var isFile = false;

      try {
        fs.accessSync(files[i], fs.F_OK);
        fileFound = true;
      } catch (e) {
        out += 'tail: cannot open ' + unixPath(files[i]) + ' for reading: No such file or directory\n';
      }

      if (fileFound) {
        isFile = fs.statSync(files[i]).isFile();
      }

      if (isFile) {
        var name = unixPath(files[i]);
        var content = fs.readFileSync(files[i], 'utf8').trim().split('\n');
        var verbose = files.length > 1 && !options.silent || options.verbose;
        if (verbose) {
          out += '==> ' + name + ' <==\n';
        }
        var sliced = content.slice(content.length - lines, content.length);
        out += sliced.join('\n') + '\n';
      }
    }

    out = out.replace(/\n$/, '');
    if (out.trim() !== '') {
      this.log(out);
    }

    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return tail;
  }
  vorpal.api.tail = tail;
  vorpal.command('tail [files...]').option('-n, --lines <number>', 'Output the last N lines, instead of the last 10').option('-q, --silent', 'Suppresses printing of headers when multiple files are being examined.').option('-v, --verbose', 'Always output headers giving file names.').autocomplete(fsAutocomplete()).action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: tail,
      args: args.files,
      options: args.options,
      callback: callback
    });
  });
};