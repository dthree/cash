'use strict';

const fs = require('fs');
const fsAutocomplete = require('vorpal-autocomplete-fs');

const interfacer = require('./../util/interfacer');
const expand = require('./../util/expand');
const unixPath = require('./../util/converter.path').unix;

const tail = {

  exec(args, options) {
    options = options || {};
    const lines = (options.lines) ? Math.abs(options.lines) : 10;
    if (!Number.isInteger(lines)) {
      this.log(`tail: ${options.lines}: invalid number of lines`);
      return 0;
    }

    let files = args;
    files = (files === undefined) ? [] : files;
    files = (typeof files === 'string') ? String(files).split(' ') : files;
    files = files.filter(file => String(file).trim() !== '');
    files = expand(files);

    let out = '';
    for (let i = 0; i < files.length; i++) {
      let fileFound = false;
      let isFile = false;

      try {
        fs.accessSync(files[i], fs.F_OK);
        fileFound = true;
      } catch (e) {
        out += `tail: cannot open ${unixPath(files[i])} for reading: No such file or directory\n`;
      }

      if (fileFound) {
        isFile = fs.statSync(files[i]).isFile();
      }

      if (isFile) {
        const name = unixPath(files[i]);
        const content = fs.readFileSync(files[i], 'utf8').trim().split('\n');
        const verbose = ((files.length > 1 && !options.silent) || options.verbose);
        if (verbose) {
          out += `==> ${name} <==\n`;
        }
        const sliced = content.slice(content.length - lines, content.length);
        out += `${sliced.join('\n')}\n`;
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
  vorpal
    .command('tail [files...]')
    .option('-n, --lines <number>', 'Output the last N lines, instead of the last 10')
    .option('-q, --silent', 'Suppresses printing of headers when multiple files are being examined.')
    .option('-v, --verbose', 'Always output headers giving file names.')
    .autocomplete(fsAutocomplete())
    .action(function (args, callback) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: tail,
        args: args.files,
        options: args.options,
        callback
      });
    });
};
