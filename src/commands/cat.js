'use strict';

const fsAutocomplete = require('vorpal-autocomplete-fs');

const fetch = require('./../util/fetch');
const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');
const lpad = require('./../util/lpad');
const strip = require('./../util/stripAnsi');

const cat = {

  exec(args, options) {
    const self = this;

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

    let stdout = '';
    try {
      const stdin = fetch(args.files, args.stdin, {
        onDirectory(name) {
          return `cat: ${name}: Is a directory`;
        },
        onInvalidFile(name) {
          return `cat: ${name}: No such file or directory`;
        }
      });
      let ctr = 0;
      for (let i = 0; i < stdin.length; ++i) {
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
        const parts = String(stdin[i]).split('\n');
        for (let j = 0; j < parts.length; ++j) {
          const blank = ((strip(parts[j])).trim() === '');
          // If -b, number every non-blank line
          // If -n, number every line
          const numbered = ((!blank && options.numbernonblank) || (options.number && !options.numbernonblank));
          if (numbered) {
            ctr++;
          }
          const numStr = (numbered) ?
            `${lpad(String(ctr), 6, ' ')}  ` :
            '';
          // If -E, append a $ to each line end.
          const dollarStr = (options.showends) ? '$' : '';
          const line =
            numStr +
            parts[j] +
            dollarStr;
          self.log(line);
          stdout += `${line}\n`;
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
  vorpal
    .command('cat [files...]')
    .parse(preparser)
    .option('-A, --show-all', 'equivalent to -vET')
    .option('-b, --number-nonblank', 'number nonempty output lines, overrides -n')
    .option('-e', 'equivalent to -vE')
    .option('-E, --show-ends', 'display $ at end of each line')
    .option('-n, --number', 'number all output lines')
    .option('-s, --squeeze-blank', 'suppress repeated empty output lines')
    .option('-t', 'equivalent to -vT')
    .option('-T, --show-tabs', 'display TAB characters as ^I')
    .option('-v, --show-nonprinting', 'use ^ and M- notation, except for LFD and TAB') // this doesn't work yet...
    .autocomplete(fsAutocomplete())
    .action(function (args, cb) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: cat,
        args,
        options: args.options,
        callback: cb
      });
    });
};
