'use strict';

var fsAutocomplete = require('vorpal-autocomplete-fs');

var fetch = require('./../util/fetch');
var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');
var lpad = require('./../util/lpad');
var strip = require('./../util/stripAnsi');

var cat = {
  exec: function exec(args, options) {
    var self = this;

    // Input normalization
    if (args === undefined) {
      args = {
        files: []
      };
    } else if (typeof args === 'string' || args instanceof String) {
      args = {
        files: [args]
      };
    } else if (Array.isArray(args)) {
      args = {
        files: args
      };
    }

    options = options || {};

    // -A handler
    if (options.showall) {
      options.shownonprinting = true;
      options.showends = true;
      options.showtabs = true;
    }

    // -e handler
    if (options.e) {
      options.shownonprinting = true;
      options.showends = true;
    }

    // -t handler
    if (options.t) {
      options.shownonprinting = true;
      options.showtabs = true;
    }

    var stdout = '';
    try {
      var stdin = fetch(args.files, args.stdin, {
        onDirectory: function onDirectory(name) {
          return 'cat: ' + name + ': Is a directory';
        },
        onInvalidFile: function onInvalidFile(name) {
          return 'cat: ' + name + ': No such file or directory';
        }
      });
      var ctr = 0;
      for (var i = 0; i < stdin.length; ++i) {
        // If -s, squeeze double blank lines to a
        // single line.
        if (options.squeezeblank) {
          stdin[i] = stdin[i].replace(/\n\n\s*\n/g, '\n\n');
        }
        if (options.showtabs) {
          stdin[i] = stdin[i].replace(/\t/g, '^I');
        }
        // Get rid of trailing line break because
        // node logging does it anyway.
        stdin[i] = stdin[i].replace(/\s$/, '');
        var parts = String(stdin[i]).split('\n');
        for (var j = 0; j < parts.length; ++j) {
          var blank = strip(parts[j]).trim() === '';
          // If -b, number every non-blank line
          // If -n, number every line
          var numbered = !blank && options.numbernonblank || options.number && !options.numbernonblank;
          if (numbered) {
            ctr++;
          }
          var numStr = numbered ? lpad(String(ctr), 6, ' ') + '  ' : '';
          // If -E, append a $ to each line end.
          var dollarStr = options.showends ? '$' : '';
          var line = numStr + parts[j] + dollarStr;
          self.log(line);
          stdout += line + '\n';
        }
      }
      return 0;
    } catch (e) {
      /* istanbul ignore next */
      self.log(e.stack);
      /* istanbul ignore next */
      return 1;
    }
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return cat;
  }
  vorpal.api.cat = cat;
  vorpal.command('cat [files...]').parse(preparser).option('-A, --show-all', 'equivalent to -vET').option('-b, --number-nonblank', 'number nonempty output lines, overrides -n').option('-e', 'equivalent to -vE').option('-E, --show-ends', 'display $ at end of each line').option('-n, --number', 'number all output lines').option('-s, --squeeze-blank', 'suppress repeated empty output lines').option('-t', 'equivalent to -vT').option('-T, --show-tabs', 'display TAB characters as ^I').option('-v, --show-nonprinting', 'use ^ and M- notation, except for LFD and TAB') // this doesn't work yet...
  .autocomplete(fsAutocomplete()).action(function (args, cb) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: cat,
      args: args,
      options: args.options,
      callback: cb
    });
  });
};