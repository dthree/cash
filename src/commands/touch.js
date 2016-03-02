'use strict';

const fs = require('fs-extra');
const fsAutocomplete = require('vorpal-autocomplete-fs');

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');
require('./../lib/sugar');

const touch = {

  /**
   * Main command execution.
   *
   * @param {Object} args
   * @return {Object} { status, stdout }
   * @api public
   */

  exec(files, options) {
    const self = this;
    files = files || ['.'];
    files = (!Array.isArray(files)) ? [files] : files;
    options = options || {};

    // If any version of --no-create is passed, change it to false.
    options.create = (options.create === true) ? false : options.create;

    // If --time is passed, ensure a valid param is called in
    // and map it to -a or -m, as this is the equivalent of these.
    // Throw an error if nothing valid passed.
    if (options.time) {
      const a = ['access', 'atime', 'use'];
      const m = ['modify', 'mtime'];
      const opt = (a.indexOf(options.time) > -1) ? 'a' :
        (m.indexOf(options.time) > -1) ? 'm' :
        undefined;
      if (!opt) {
        const error =
          `touch: invalid argument "${options.time}" for "--time"\n` +
          'Valid arguments are:\n' +
          '  - "atime", "access", "use"\n' +
          '  - "mtime", "modify"\n' +
          'Try \'touch --help\' for more information.';
        // I think this is the stupidest thing
        // I've ever written.
        try {
          throw new Error(error);
        } catch (e) {
          return touch.error.call(self, e);
        }
      } else {
        options[opt] = true;
      }
    }

    try {
      let err = false;
      for (let i = 0; i < files.length; ++i) {
        try {
          touch.file(files[i], options);
        } catch (e) {
          err = e;
          break;
        }
      }
      if (err) {
        return touch.error.call(self, err);
      }
      return 0;
    } catch (e) {
      return touch.error.call(self, e);
    }
  },

  /**
   * Returns touch stderr and response codes
   * for errors.
   *
   * @param {Error} e
   * @return {Object} { status, stdout }
   * @api private
   */

  error(e) {
    this.log(e.message);
    return 2;
  },

  /**
   * Handler for a single file using touch.
   *
   * @param {String} path
   * @param {Object} options
   * @api private
   */

  file(path, options) {
    try {
      try {
        fs.lstatSync(path);
      } catch (e) {
        // If the file doesn't exist and
        // the user doesn't want to create it,
        // we have no purpose in life. Goodbye.
        if (options.create === false) {
          throw new Error(e);
        } else {
          fs.closeSync(fs.openSync(path, 'wx'));
        }
      }

      const stat = fs.statSync(path);
      const dateToSet = (options.date) ?
        Date.create(options.date) :
        new Date();

      if (String(dateToSet) === 'Invalid Date') {
        throw new Error(`touch: invalid date format ${options.date}`);
      }

      // If -m, keep access time current.
      let atime = (options.m === true) ? new Date(stat.atime) : dateToSet;

      // If -a, keep mod time to current.
      let mtime = (options.a === true) ? new Date(stat.mtime) : dateToSet;

      if (options.reference !== undefined) {
        let reference;
        try {
          reference = fs.statSync(options.reference);
        } catch (e) {
          throw new Error(`touch: failed to get attributes of ${options.reference}: No such file or directory`);
        }
        atime = (options.m === true) ? atime : reference.atime;
        mtime = (options.a === true) ? mtime : reference.mtime;
      }

      fs.utimesSync(path, atime, mtime);
      fs.utimesSync(path, atime, mtime);
    } catch (e) {
      throw new Error(e);
    }
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return touch;
  }
  vorpal.api.touch = touch;
  vorpal
    .command('touch <files...>')
    .parse(preparser)
    .option('-a', 'change only the access time')
    .option('-c, --no-create', 'do not create any files')
    .option('-d, --date [STRING]', 'parse STRING and use it instead of current time')
    .option('-m', 'change only the modification time')
    .option('-r, --reference [FILE]', 'use this file\'s times instead of current time')
    .option('--time [WORD]', 'change the specified time: WORD is access, atime, or use: equivalent to -a WORD is modify or mtime: equivalent to -m')
    .autocomplete(fsAutocomplete())
    .action(function (args, callback) {
      return interfacer.call(this, {
        command: touch,
        args: args.files || [],
        options: args.options,
        callback
      });
    });
};
