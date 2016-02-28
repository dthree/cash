'use strict';

const fs = require('fs');
const path = require('path');
const fsAutocomplete = require('vorpal-autocomplete-fs');

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const mkdir = {

  exec(args, options) {
    const self = this;
    let dirs = args || [];
    options = options || {};

    if (typeof dirs === 'string') {
      dirs = dirs.split(' ');
    }

    dirs = dirs.filter(str => String(str).trim() !== '');

    if (dirs.length < 1) {
      this.log('mkdir: missing operand\nTry \'mkdir --help\' for more information.');
    }

    dirs.forEach(function (dir) {
      if (fs.existsSync(dir)) {
        if (!options.parents) {
          self.log(`mkdir: cannot create directory ${dir}: File exists`);
        }
        return;
      }

      // Base dir does not exist, and no -p option given
      const baseDir = path.dirname(dir);
      if (!fs.existsSync(baseDir) && !options.parents) {
        self.log(`mkdir: cannot create directory ${dir}: No such file or directory`);
        return;
      }

      if (options.parents) {
        mkdirSyncRecursive.call(self, dir, options);
      } else {
        fs.mkdirSync(dir, parseInt('0777', 8));
        if (options.verbose) {
          self.log(`mkdir: created directory ${dir}`);
        }
      }
    });
    return 0;
  }
};

function mkdirSyncRecursive(dir, options) {
  const baseDir = path.dirname(dir);
  if (fs.existsSync(baseDir)) {
    fs.mkdirSync(dir, parseInt('0777', 8));
    if (options.verbose) {
      this.log(`mkdir: created directory ${dir}`);
    }
    return;
  }
  mkdirSyncRecursive.call(this, baseDir, options);
  fs.mkdirSync(dir, parseInt('0777', 8));
  if (options.verbose) {
    this.log(`mkdir: created directory ${dir}`);
  }
}

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return mkdir;
  }
  vorpal.api.mkdir = mkdir;
  vorpal
    .command('mkdir [directory...]')
    .parse(preparser)
    .option('-p, --parents', 'no error if existing, make parent directories as needed')
    .option('-v, --verbose', 'print a message for each created directory')
    .autocomplete(fsAutocomplete({directory: true}))
    .action(function (args, callback) {
      args.options = args.options || {};
      args.options.vorpal = vorpal;
      return interfacer.call(this, {
        command: mkdir,
        args: args.directory,
        options: args.options,
        callback
      });
    });
};
