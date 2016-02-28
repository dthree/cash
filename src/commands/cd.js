'use strict';

const fsAutocomplete = require('vorpal-autocomplete-fs');
const delimiter = require('./../delimiter');

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const cd = {

  exec(dir, options) {
    const self = this;
    const vpl = options.vorpal;
    options = options || {};

    dir = (!dir) ? delimiter.getHomeDir() : dir;

    // Allow Windows drive letter changes
    dir = (dir && dir.length === 2 && dir[1] === '/') ? `${dir[0]}:` : dir;

    try {
      process.chdir(dir);
      if (vpl) {
        delimiter.refresh(vpl);
      }
      return 0;
    } catch (e) {
      return cd.error.call(self, e, dir);
    }
  },

  error(e, dir) {
    let status;
    let stdout;
    if (e.code === 'ENOENT' && e.syscall === 'uv_chdir') {
      status = 1;
      stdout = `-bash: cd: ${dir}: No such file or directory`;
    } else {
      status = 2;
      stdout = e.stack;
    }
    this.log(stdout);
    return status;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return cd;
  }
  vorpal.api.cd = cd;
  vorpal
    .command('cd [dir]')
    .parse(preparser)
    .autocomplete(fsAutocomplete({directory: true}))
    .action(function (args, callback) {
      args.options = args.options || {};
      args.options.vorpal = vorpal;
      return interfacer.call(this, {
        command: cd,
        args: args.dir,
        options: args.options,
        callback
      });
    });
};
