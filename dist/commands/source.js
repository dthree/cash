'use strict';

var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');
var fs = require('fs');

var usage = '-cash: source: filename argument required\nsource: usage: source filename [arguments]';

var source = {
  exec: function exec(args, options) {
    options = options || {};
    args = args || {};

    if (typeof args === 'string') {
      var params = args.split(/\s+/);
      args = {};
      args.file = params[0];
      if (params.length > 1) {
        args.params = params.slice(1);
      }
    }

    var vorpal = options.vorpal;

    /* istanbul ignore next */
    if (!vorpal) {
      throw new Error('Source is not programatically supported.');
    }

    if (!args.file) {
      this.log(usage);
      return 2;
    }
    try {
      // Once support for referencing parameters ($1, $2, etc.) gets added, this
      // should swap these out with the value of args.params
      fs.readFileSync(args.file, 'utf8').split('\n').forEach(function (line) {
        if (line) {
          vorpal.execSync(line); // execute each line in the current environment
        }
      });
    } catch (e) {
      if (e.code === 'ENOENT') {
        this.log('-cash: ' + args.file + ': No such file or directory');
      } else if (e.code === 'EACCES') {
        this.log('-cash: ' + args.file + ': Permission denied');
      } else if (e.code === 'EISDIR') {
        this.log('-cash: source: ' + args.file + ': is a directory');
      } else {
        /* istanbul ignore next */
        this.log('-cash: source: unable to read ' + args.file);
      }
      return 1;
    }

    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return source;
  }
  vorpal.api.source = source;
  vorpal.command('source [file] [params...]').alias('.').parse(preparser).action(function (args, callback) {
    args.options = args.options || {};
    args.options.vorpal = vorpal;
    return interfacer.call(this, {
      command: source,
      args: args,
      options: args.options,
      callback: callback
    });
  });
};