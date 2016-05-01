'use strict';

var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');

var fetch = require('./../util/fetch');
var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');
var strip = require('./../util/stripAnsi');
var shuffle = require('array-shuffle');

var sort = {

  counter: 0,

  stdin: '',

  exec: function exec(args, options) {
    var self = this;

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
      sort.stdin += args.stdin + '\n';
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
          self.log('sort: option \'--output\' requires an argument\nTry \'sort --help\' for more information.');
          return 0;
        }
        try {
          fs.writeFileSync(options.output, stdout);
          return 0;
        } catch (e) {
          if (e.code === 'ENOENT') {
            self.log('sort: open failed: ' + options.output + ': No such file or directory');
          } else {
            /* istanbul ignore next */
            self.log('sort: open failed: ' + options.output + ': ' + e.code);
          }
          return 2;
        }
      } else {
        self.log(stdout);
      }
    }

    try {
      var stdin = fetch(args.files, args.stdin, {
        onDirectory: function onDirectory(name) {
          /* istanbul ignore next */
          return 'sort: read failed: ' + name + ': Is a directory';
        },
        onInvalidFile: function onInvalidFile(name) {
          /* istanbul ignore next */
          return 'sort: cannot read: ' + name + ': No such file or directory';
        }
      });

      var combined = '';
      for (var i = 0; i < stdin.length; ++i) {
        // Get rid of trailing line break because
        // node logging does it anyway.
        combined += stdin[i];
      }

      combined = combined.replace(/\s$/, '');
      var parts = String(combined).split('\n');

      if (options.check) {
        // Check if the thing was already sorted.
        var original = String(combined).split('\n');
        var disorder = void 0;
        for (var _i = 0; _i < original.length; ++_i) {
          var a = original[_i];
          var b = original[_i + 1];
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
              disorder = 'sort: -:' + (_i + 2) + ': disorder: ' + b;
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
        var aAlpha = strip(a).replace(/\W+/g, '');
        var bAlpha = strip(b).replace(/\W+/g, '');
        var aNumeric = strip(a).replace(/\D/g, '');
        var bNumeric = strip(b).replace(/\D/g, '');
        if (options.humannumericsort) {
          var aHuman = parseHumanReadableNumbers(strip(a));
          var bHuman = parseHumanReadableNumbers(strip(b));
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
          var aMonth = parseMonths(strip(a));
          var bMonth = parseMonths(strip(b));
          var result = aMonth - bMonth;
          if (aMonth === bMonth) {
            result = aAlpha.localeCompare(bAlpha);
          }
          return result;
        } else if (options.numericsort) {
          var _result = aNumeric - bNumeric;
          _result = _result === 0 ? aAlpha.localeCompare(bAlpha) : _result;
          return _result;
        }
        return aAlpha.localeCompare(bAlpha);
      });

      if (options.randomsort) {
        parts = shuffle(parts);
      }

      if (options.reverse) {
        parts.reverse();
      }

      var out = parts.join('\n');
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
var humanOrdering = { '': 0, 'K': 1, 'k': 1, 'M': 2, 'G': 3, 'T': 4, 'P': 5, 'E': 6, 'Z': 7 };
var humanReadableSort = new RegExp(/^([0-9]+)?[\.]?[0-9]+[K|k|M|G|T|P|E|Z|Y]/g);
function parseHumanReadableNumbers(nbr) {
  nbr = String(nbr).replace(/(\r\n|\n|\r)/gm, '');
  if (String(nbr).match(humanReadableSort)) {
    var num = parseFloat(String(nbr).replace(/[a-zA-Z]/g, '').trim());
    var group = humanOrdering[String(nbr).replace(/[^a-zA-Z]/g, '').trim()] || 0;
    return {
      num: num,
      group: group
    };
  }
  var isNumber = String(nbr).match(/^[0-9]/);
  var stripped = isNumber ? parseFloat(String(nbr).replace(/[^0-9.]/g, '')) : 'NaN';
  var result = !isNaN(stripped) ? stripped : -99999999999;
  return {
    num: result,
    group: 0
  };
}

var monthOrdering = {
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

var months = new RegExp(/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i);
function parseMonths(str) {
  var match = String(str).match(months);
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
  vorpal.command('sort [files...]').parse(preparser).option('-M, --month-sort', 'compare (unknown) < \'JAN\' < ... < \'DEC\'').option('-h, --human-numeric-sort', 'compare human readable numbers (e.g., 2K 1G)').option('-n, --numeric-sort', 'compare according to string numerical value').option('-R, --random-sort', 'sort by random hash of keys').option('-r, --reverse', 'reverse the result of comparisons').option('-c, --check', 'check for sorted input; do not sort').option('-o, --output [file]', 'write result to file instead of standard output').autocomplete(fsAutocomplete()).action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: sort,
      args: args,
      options: args.options,
      callback: callback
    });
  });
};