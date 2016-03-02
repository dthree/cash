'use strict';

var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');

/**
 * This is a boilerplate for implementing a new command.
 * Delete all of these comments / instructions before finishing.
 */

/**
 * 0. Replace all instances of `cmdName` with
 *    the exact name of the command being implemented.
 */

var cmdName = {

  /**
   * The cmdName.exec method is exposed by Cash
   * as the only public interfacer to your command.
   */

  exec: function exec(args, options) {
    options = options || {};

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
  /**
   * When do a raw execution of the command
   * without options, Vorpal is not used. In this
   * case, the raw command is returned.
   */
  if (vorpal === undefined) {
    return cmdName;
  }
  vorpal.api.cmdName = cmdName;
  /**
   * Registers the command in Vorpal.
   * Command strings, options and their
   * descriptions should exactly emulate
   * existing commands.
   */
  vorpal.command('cmdName [files...]').parse(preparser).option('-o, --option', 'option description').action(function (args, callback) {
    args.options = args.options || {};
    /**
     * The interfacer method does a
     * lot of heavy lifting on interfacing with
     * the command properly.
     */
    return interfacer.call(this, {
      command: cmdName,
      args: args.files, // only pass in what you need from Vorpal
      options: args.options, // split the options into their own arg
      callback: callback
    });
  });
};