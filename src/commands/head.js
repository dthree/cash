'use strict';

const interfacer = require('./../util/interfacer');
const fs = require('fs');
const fsAutocomplete = require('vorpal-autocomplete-fs');

const head = {

  exec(args, options) {
    const self = this;
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
      let files = args.files || args;
      files = (files === undefined) ? [] : files;
      files = (typeof files === 'string') ? String(files).split(' ') : files;
      files = files.filter(arg => String(arg).trim() !== '');
      head.readFiles(files, options.n, self);
    }

    return 0;
  },

  readStdin(stdin, numberOfLines, self) {
    const lines = stdin.split('\n');
    const linesToRead = numberOfLines >= lines.length ? lines.length : numberOfLines;
    for (let i = 0; i < linesToRead; i++) {
      self.log(lines[i]);
    }
  },

  readFiles(files, numberOfLines, self) {
    let writeHeaders = false;
    if (files.length > 1) {
      writeHeaders = true;
    }

    for (let i = 0; i < files.length; i++) {
      if (writeHeaders) {
        head.writeHeader(files[i], i > 0, self);
      }

      head.readFile(files[i], numberOfLines, self);
    }
  },

  readFile(file, numberOfLines, self) {
    const content = fs.readFileSync(file).toString();
    const contentArray = content.split('\n');
    const linesToRead = numberOfLines >= contentArray.length ? contentArray.length : numberOfLines;
    for (let i = 0; i < linesToRead; i++) {
      self.log(contentArray[i]);
    }
  },

  writeHeader(file, includeNewLine, self) {
    self.log(`${includeNewLine ? '\n' : ''}==> ${file} <==\n`);
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return head;
  }
  vorpal.api.head = head;
  vorpal
      .command('head [files...]')
      .option('-n [number]', 'The first number of lines will be copied to stdout.')
      .autocomplete(fsAutocomplete())
      .action(function (args, callback) {
        args.options = args.options || {};
        return interfacer.call(this, {
          command: head,
          args,
          options: args.options,
          callback
        });
      });
};
