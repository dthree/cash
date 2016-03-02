'use strict';

module.exports = function (args, command) {
  args.splice(0, 2);
  var pipes = (args.indexOf('|') > -1);
  if (args.length === 0) {
    // If we don't have to parse arguments, do
    // the quickest load: just the raw js file
    // of the command and nothing else.
    var cmd = require('./../dist/commands/' + command)();
    cmd.exec.call(console, {options: {}}, {});
  } else if (pipes === false) {
    // If we need to parse args for this
    // command only, pull up vorpal and just load
    // that one command.
    var vorpal = require('vorpal')();
    vorpal.api = {};
    require('./../dist/commands/' + command)(vorpal);
    args = args.join(' ');

    // If we passed in a help request, load in
    // the help file.
    if (args.indexOf('help') > -1 || args.indexOf('?') > -1) {
      let help;
      try {
        help = require('./../dist/help/' + command + '.js');
        help = String(help).replace(/^\n|\n$/g, '');
      } catch (e) {}
      let cmdObj = vorpal.find(command);
      if (cmdObj && help) {
        cmdObj.help(function (argus, cb) {
          cb(help);
        })
      }
    }
    vorpal.exec(command + ' ' + args);
  } else {
    // If we get into piping other commands,
    // we need to go full bore and load the
    // entire cash library.
    // I guess we could technically parse all
    // of the passed args, look for applicable
    // commands and only load those, but that's
    // some messy work for something that might
    // not matter. If you're reading this and
    // have deemed it matters, do a PR.
    var cash = require('./../dist/index');
    cash.vorpal.exec(command + ' ' + args.join(' '));
  }
};
