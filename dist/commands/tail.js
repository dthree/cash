'use strict';

var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');
var path = require('path');
var fs = require('fs');
var glob = require("glob");

var fsAutocomplete = require('vorpal-autocomplete-fs');

var tail = {
  exec: function exec(args, options) {
    options = options || {};

    options.lines = options.lines ? Math.abs(options.lines) : 10;
    if (!Number.isInteger(options.lines)) {
      this.log('tail: illegal offset -- ' + options.lines + ' \n');
      return 0;
    }

    if (args != undefined) {
      for (var i = 0; i < args.length; i++) {

        var fileFound = false;
        var isFile = false;

        var pathToFile = path.resolve(process.cwd()).replace(/\\/g, '/') + '/' + args[i];
        var allFiles = glob.sync(pathToFile);

        for (var o = 0; o < allFiles.length; o++) {

          try {
            fs.accessSync(allFiles[o], fs.F_OK);
            fileFound = true;
          } catch (e) {
            console.log('tail: ' + filePath + ': No such file or directory');
          }

          if (fileFound) {
            isFile = fs.statSync(allFiles[o]).isFile();
          }

          if (isFile) {
            var fileName = allFiles[0].replace(path.resolve(process.cwd()).replace(/\\/g, '/') + '/', '');
            var fileContents = fs.readFileSync(allFiles[o], 'utf8');
            var lines = fileContents.split("\n");

            if ((args.length > 1 || allFiles.length > 1) && !options.silent || options.verbose) {
              this.log('==> ' + fileName + ' <==');
            }

            for (var p = 0; p < lines.length; p++) {
              if (p >= lines.length - 1 - options.lines) {
                this.log(lines[p]);
              }
            }
          }
        }
      }
    }

    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return tail;
  }
  vorpal.api.tail = tail;
  vorpal.command('tail <files...>').parse(preparser).option('-n, --lines <number>', 'Output the last N lines, instead of the last 10').option('-q, --silent', 'Suppresses printing of headers when multiple files are being examined.').option('-v, --verbose', 'Always output headers giving file names.').autocomplete(fsAutocomplete()).action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: tail,
      args: args.files,
      options: args.options,
      callback: callback
    });
  });
};