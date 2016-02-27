'use strict';

var interfacer = require('./../util/interfacer');
var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');

var head = {
  exec: function exec(args, options) {
    var self = this;
    options = options || {};

    options.argsType = args.stdin === undefined ? 'files' : 'stdin';
    options.n = options.n === undefined ? 10 : options.n;

    if (options.n < 1) {
      this.log('Option n must be a positive integer.');
      return 1;
    }

    if (options.argsType === 'stdin') {
      head.readStdin(args.stdin[0], options.n, self);
    } else {
      var files = args.files || args;
      files = files === undefined ? [] : files;
      files = typeof files === 'string' ? String(files).split(' ') : files;
      files = files.filter(function (arg) {
        return String(arg).trim() !== '';
      });
      head.readFiles(files, options.n, self);
    }

    return 0;
  },
  readStdin: function readStdin(stdin, numberOfLines, self) {
    var lines = stdin.split('\n');
    var linesToRead = numberOfLines >= lines.length ? lines.length : numberOfLines;
    for (var i = 0; i < linesToRead; i++) {
      self.log(lines[i]);
    }
  },
  readFiles: function readFiles(files, numberOfLines, self) {
    var writeHeaders = false;
    if (files.length > 1) {
      writeHeaders = true;
    }

    for (var i = 0; i < files.length; i++) {
      if (writeHeaders) {
        head.writeHeader(files[i], i > 0, self);
      }

      head.readFile(files[i], numberOfLines, self);
    }
  },
  readFile: function readFile(file, numberOfLines, self) {
    var content = fs.readFileSync(file).toString();
    var contentArray = content.split('\n');
    var linesToRead = numberOfLines >= contentArray.length ? contentArray.length : numberOfLines;
    for (var i = 0; i < linesToRead; i++) {
      self.log(contentArray[i]);
    }
  },
  writeHeader: function writeHeader(file, includeNewLine, self) {
    self.log((includeNewLine ? '\n' : '') + '==> ' + file + ' <==\n');
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return head;
  }
  vorpal.api.head = head;
  vorpal.command('head [files...]').option('-n [number]', 'The first number of lines will be copied to stdout.').autocomplete(fsAutocomplete()).action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: head,
      args: args,
      options: args.options,
      callback: callback
    });
  });
};