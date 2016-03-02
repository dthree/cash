'use strict';

var pad = require('./util/pad');

var commands = ['alias [-p] [name=[value]]', 'cat [-AbeEnstTv] [files ...]', 'cd [dir]', 'clear', 'cp [-fnr] source ... dest', 'echo [-eE] [arg ...]', 'export [-p][id=[value]]', 'false', 'grep [-bHhinqsvw] [-m max] [--silent] [--include pattern] pattern [files ...]', 'kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l', 'less [files ...]', 'ls [-aAdFhilQrRStUwx1] [paths ...]', 'mkdir [-pv] [directories ...]', 'mv [-fnv] source ... dest', 'pwd [files ...]', 'rm [-frR] [files ...]', 'sort [-chMnrR] [-o file] [files ...]', 'touch [-acm] [-d date] [-r ref] [--time word] file ...', 'true', 'unalias [-a] name [names ...]'];

function chop(str, len) {
  var res = String(str).slice(0, len - 2);
  res = res.length === len - 2 ? res + '>' : res;
  return res;
}

module.exports = function () {
  var version = require('./../package.json').version;
  var result = '';

  result += 'Cash, version ' + version + '\n';
  result += 'These shell commands are defined internally.  Type `help\' to see this list.\n';
  result += 'Type `help name\' to find out more about the function `name\'.\n';
  result += 'Use `info cash\' to find out more about the shell in general.\n';
  result += '\n';

  var half = Math.floor(commands.length / 2);
  var width = Math.floor((process.stdout.columns - 3) / 2);
  var lhalf = Math.ceil(commands.length / 2);
  var padding = commands.length % 2 === 1 ? 1 : 0;
  for (var i = 0; i < lhalf; ++i) {
    var colA = pad(chop(commands[i], width), width);
    var colB = pad(chop(commands[half + i + padding] || '', width), width);
    var line = i === lhalf - 1 ? '' : '\n';
    result += ' ' + colA + ' ' + colB + line;
  }

  return result;
};