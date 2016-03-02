'use strict';

var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');

var tail = {
  exec: function exec(args, options) {
    options = options || {};

    this.log(args);
    this.log(options);

    return 0;

    /**
     * 1. Validate arg input to include every
     *    possible form of input, such as:
     *
     *    a. as a string:
     *       cash.foo('bar and so on', {option: true});
     *
     *    b. as an array:
     *       cash.foo(['bar', 'and', 'so', 'on'], {option: true});
     *
     *    c. as interpeted through Vorpal:
     *       cash('foo bar and so on --option');
     */

    /**
     * 2. For errors, use `this.log` to print the
     *    error message to the user, and only return
     *    the error code (1, 2, etc.)
     *
     *    if (args.length < 1) {
     *      this.log('foo: cannot bar: requires at least one file name');
     *      return 1;
     *    }
     */

    /**
     * 3. For all other stdout to the user, use `this.log`.
     *    For large jobs that should stream logging a
     *    bit at a time, use multiple `this.log` statements
     *    and cash will handle the heavy lifting of piping
     *    and returning the final assembled output to the
     *    user in the case of programmatically executed
     *    commands.
     */

    /**
     * 4. When complete with no errors, return 0;
     *
     *    return 0;
     */
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return tail;
  }
  vorpal.api.tail = tail;
  vorpal.command('tail [files...]').parse(preparser).option('-n, --lines <number>', 'Output the last N lines, instead of the last 10').action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: tail,
      args: args.files,
      options: args.options,
      callback: callback
    });
  });
};