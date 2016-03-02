'use strict';

const fs = require('fs');
const fsAutocomplete = require('vorpal-autocomplete-fs');
const path = require('path');

const expand = require('./../util/expand');
const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const mv = {

  exec(args, options) {
    const self = this;
    options = options || {};

    args = (args === undefined) ? [] : args;
    args = (Array.isArray(args)) ? args : args.split(' ');
    args = args.filter(arg => String(arg).trim() !== '');

    options.noclobber = (options.force === true) ? false : options.noclobber;

    if (args.length < 1) {
      this.log('mv: missing file operand\nTry \'mv --help\' for more information.');
      return 1;
    }

    if (args.length === 1) {
      this.log(`mv: missing destination file operand after ${args[0]}\nTry 'mv --help' for more information.`);
      return 1;
    }

    args = expand(args);

    const dest = args.pop();
    let sources = args;

    const exists = fs.existsSync(dest);
    const stats = exists && fs.statSync(dest);

    // Dest is not existing dir, but multiple sources given
    if ((!exists || !stats.isDirectory()) && sources.length > 1) {
      this.log(`mv: target ${dest} is not a directory`);
      return 1;
    }

    // Dest is an existing file, but no -f given
    if (exists && stats.isFile() && options.noclobber) {
      // just dont do anything
      return 0;
    }

    if (options.striptrailingslashes) {
      sources = sources.map(src => String(src).replace(/\/$/g, ''));
    }

    sources.forEach(function (src) {
      if (!fs.existsSync(src)) {
        self.log(`mv: cannot stat ${src}: No such file or directory`);
        return;
      }

      // When copying to '/path/dir', iDest = '/path/dir/file1'
      let iDest = dest;
      if (exists && stats.isDirectory()) {
        iDest = path.normalize(`${dest}/${path.basename(src)}`);
      }

      // If the file exists and we're not clobbering, skip.
      if (fs.existsSync(iDest) && options.noclobber) {
        return;
      }

      if (path.resolve(src) === path.dirname(path.resolve(iDest))) {
        self.log(`mv: ${src} and ${iDest} are the same file`);
        return;
      }

      fs.renameSync(src, iDest);
      if (options.verbose === true) {
        self.log(String(`${src} -> ${iDest}`).replace(/\\/g, '/'));
      }
    });
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return mv;
  }
  vorpal.api.mv = mv;
  vorpal
    .command('mv [args...]')
    .parse(preparser)
    .option('-f, --force', 'do not prompt before overwriting')
    .option('-n, --no-clobber', 'do not overwrite an existing file')
    .option('--striptrailingslashes', 'remove any trailing slashes from each source') // vorpal bug, need to add dashes between words
    .option('-v, --verbose', 'explain what is being done')
    .autocomplete(fsAutocomplete())
    .action(function (args, callback) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: mv,
        args: args.args,
        options: args.options,
        callback
      });
    });
};
