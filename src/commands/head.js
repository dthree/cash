'use strict';

const interfacer = require('./../util/interfacer');
const fs = require('fs');
const fsAutocomplete = require('vorpal-autocomplete-fs');

const expand = require('./../util/expand');

const head = {

  exec(args, options) {
    options = options || {};
    args = args || '';
    const source = (args.stdin === undefined) ? 'files' : 'stdin';

    const lines = (options.lines) ? Math.abs(options.lines) : 10;
    if (!Number.isInteger(lines)) {
      this.log(`head: ${options.lines}: invalid number of lines`);
      return 0;
    }

    /* istanbul ignore next */
    if (source === 'stdin') {
      let stdout = head.readLines(args.stdin[0], lines);
      stdout = stdout.replace(/\n$/, '');
      if (stdout.trim() !== '') {
        this.log(stdout);
      }
      return 0;
    }

    let files = args.files || args;
    files = (typeof files === 'object' && files !== null && !Array.isArray(files)) ? [] : files;
    files = (files === undefined) ? [] : files;
    files = (typeof files === 'string') ? String(files).split(' ') : files;
    files = files.filter(arg => String(arg).trim() !== '');
    files = expand(files);

    let stdout = '';
    const verbose = ((files.length > 1 && !options.silent) || options.verbose);

    for (let i = 0; i < files.length; i++) {
      try {
        const content = fs.readFileSync(files[i]).toString();
        if (verbose) {
          stdout += `${i > 0 ? '\n' : ''}==> ${files[i]} <==\n`;
        }
        stdout += head.readLines(content, lines);
      } catch (e) {
        stdout += `head: cannot open ${files[i]} for reading: No such file or directory`;
      }
    }

    stdout = stdout.replace(/\n$/, '');
    if (stdout.trim() !== '') {
      this.log(stdout);
    }

    return 0;
  },

  readLines(content, numberOfLines) {
    let stdout = '';
    const contentArray = content.split('\n');
    const linesToRead = numberOfLines >= contentArray.length ? contentArray.length : numberOfLines;
    for (let i = 0; i < linesToRead; i++) {
      if (stdout === '') {
        stdout = `${contentArray[i]}\n`;
        continue;
      }
      stdout += `${contentArray[i]}\n`;
    }
    return stdout;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return head;
  }
  vorpal.api.head = head;
  vorpal
      .command('head [files...]')
      .option('-n, --lines [number]', 'print the first K lines instead of the first 10')
      .option('-q, --silent', 'Suppresses printing of headers when multiple files are being examined.')
      .option('-v, --verbose', 'Always output headers giving file names.')
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
