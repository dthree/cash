'use strict';

const fs = require('fs');
const fsAutocomplete = require('vorpal-autocomplete-fs');

const fetch = require('./../util/fetch');
const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');
const strip = require('./../util/stripAnsi');
const shuffle = require('array-shuffle');

const sort = {

  counter: 0,

  stdin: '',

  exec(args, options) {
    const self = this;

    // Hack to handle multiple calls
    // due to fragmented stdin, such as
    // by piping. In essence, we're waiting
    // 100 milliseconds for all of the
    // requests to come in, and then running
    // sort. Only applies when sort is called
    // through a piped command.
    /* istanbul ignore next */
    if (args && args.stdin && options.bypass !== true) {
      sort.counter++;
      sort.stdin += `${args.stdin}\n`;
      if (sort.counter === 1) {
        setTimeout(function () {
          sort.counter = 0;
          args.stdin = sort.stdin;
          sort.stdin = '';
          options.bypass = true;
          sort.exec.call(self, args, options);
        }, 100);
      }
      return;
    }
    sort.counter = 0;
    sort.stdin = '';

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

    function log(stdout) {
      if (options.output) {
        if (options.output === true) {
          self.log(`sort: option '--output' requires an argument\nTry 'sort --help' for more information.`);
          return 0;
        }
        try {
          fs.writeFileSync(options.output, stdout);
          return 0;
        } catch (e) {
          if (e.code === 'ENOENT') {
            self.log(`sort: open failed: ${options.output}: No such file or directory`);
          } else {
            /* istanbul ignore next */
            self.log(`sort: open failed: ${options.output}: ${e.code}`);
          }
          return 2;
        }
      } else {
        self.log(stdout);
      }
    }

    try {
      const stdin = fetch(args.files, args.stdin, {
        onDirectory(name) {
          /* istanbul ignore next */
          return `sort: read failed: ${name}: Is a directory`;
        },
        onInvalidFile(name) {
          /* istanbul ignore next */
          return `sort: cannot read: ${name}: No such file or directory`;
        }
      });

      let combined = '';
      for (let i = 0; i < stdin.length; ++i) {
        // Get rid of trailing line break because
        // node logging does it anyway.
        combined += stdin[i];
      }

      combined = combined.replace(/\s$/, '');
      let parts = String(combined).split('\n');

      if (options.check) {
        // Check if the thing was already sorted.
        const original = String(combined).split('\n');
        let disorder;
        for (let i = 0; i < original.length; ++i) {
          const a = original[i];
          const b = original[i + 1];
          if (a && b) {
            if (!isNaN(a) && !isNaN(b) && parseFloat(a) > parseFloat(b)) {
              /* istanbul ignore next */
              disorder = true;
            } else if (a > b) {
              disorder = true;
            }
            if (disorder) {
              // To do: right now, I don't say the file
              // name of the bad sorted item - I have to
              // figure this out as I join all the files
              // together beforehand and lose track.
              disorder = `sort: -:${(i + 2)}: disorder: ${b}`;
              break;
            }
          }
        }
        if (disorder) {
          log(disorder);
          return;
        }
      }

      parts = parts.sort(function (a, b) {
        const aAlpha = strip(a).replace(/\W+/g, '');
        const bAlpha = strip(b).replace(/\W+/g, '');
        const aNumeric = strip(a).replace(/\D/g, '');
        const bNumeric = strip(b).replace(/\D/g, '');
        if (options.humannumericsort) {
          const aHuman = parseHumanReadableNumbers(strip(a));
          const bHuman = parseHumanReadableNumbers(strip(b));
          if (aHuman.group < bHuman.group) {
            return -1;
          } else if (aHuman.group > bHuman.group) {
            return 1;
          } else if (aHuman.num < bHuman.num) {
            return -1;
          } else if (aHuman.num > bHuman.num) {
            return 1;
          }
          return aAlpha.localeCompare(bAlpha);
        } else if (options.monthsort) {
          const aMonth = parseMonths(strip(a));
          const bMonth = parseMonths(strip(b));
          let result = aMonth - bMonth;
          if (aMonth === bMonth) {
            result = aAlpha.localeCompare(bAlpha);
          }
          return result;
        } else if (options.numericsort) {
          let result = aNumeric - bNumeric;
          result = (result === 0) ? aAlpha.localeCompare(bAlpha) : result;
          return result;
        }
        return aAlpha.localeCompare(bAlpha);
      });

      if (options.randomsort) {
        parts = shuffle(parts);
      }

      if (options.reverse) {
        parts.reverse();
      }

      const out = parts.join('\n');
      if (String(out).trim() !== '') {
        log(out);
      }

      return;
    } catch (e) {
      /* istanbul ignore next */
      self.log(e.stack);
      /* istanbul ignore next */
      return;
    }
  }
};

// This shit is gnarly.
// Per the coreutils sort.c:
// <none/unknown> < K/k < M < G < T < P < E < Z < Y
const humanOrdering = {'': 0, 'K': 1, 'k': 1, 'M': 2, 'G': 3, 'T': 4, 'P': 5, 'E': 6, 'Z': 7};
const humanReadableSort = new RegExp(/^([0-9]+)?[\.]?[0-9]+[K|k|M|G|T|P|E|Z|Y]/g);
function parseHumanReadableNumbers(nbr) {
  nbr = String(nbr).replace(/(\r\n|\n|\r)/gm, '');
  if (String(nbr).match(humanReadableSort)) {
    const num = parseFloat(String(nbr).replace(/[a-zA-Z]/g, '').trim());
    const group = humanOrdering[String(nbr).replace(/[^a-zA-Z]/g, '').trim()] || 0;
    return ({
      num,
      group
    });
  }
  const isNumber = (String(nbr).match(/^[0-9]/));
  const stripped = (isNumber) ? parseFloat(String(nbr).replace(/[^0-9.]/g, '')) : 'NaN';
  const result = (!isNaN(stripped)) ? stripped : -99999999999;
  return ({
    num: result,
    group: 0
  });
}

const monthOrdering = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
};

const months = new RegExp(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
function parseMonths(str) {
  const match = String(str).match(months);
  if (match) {
    return monthOrdering[String(str.slice(0, 3).toLowerCase())];
  }
  return 0;
}

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return sort;
  }
  vorpal.api.sort = sort;
  vorpal
    .command('sort [files...]')
    .parse(preparser)
    .option('-M, --month-sort', 'compare (unknown) < \'JAN\' < ... < \'DEC\'')
    .option('-h, --human-numeric-sort', 'compare human readable numbers (e.g., 2K 1G)')
    .option('-n, --numeric-sort', 'compare according to string numerical value')
    .option('-R, --random-sort', 'sort by random hash of keys')
    .option('-r, --reverse', 'reverse the result of comparisons')
    .option('-c, --check', 'check for sorted input; do not sort')
    .option('-o, --output [file]', 'write result to file instead of standard output')
    .autocomplete(fsAutocomplete())
    .action(function (args, callback) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: sort,
        args,
        options: args.options,
        callback
      });
    });
};
