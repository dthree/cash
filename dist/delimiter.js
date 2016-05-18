'use strict';

var os = require('os');
var username = require('username');
var userHome = require('user-home');

var isWindows = process.platform === 'win32';
var pathConverter = require('./util/converter.path');

module.exports = {
  refresh: function refresh(vorpal, cb) {
    cb = cb || function () {};
    username().then(function (username) {
      var user = username;
      var host = String(os.hostname()).split('.')[0];
      var home = pathConverter.unix(userHome);
      var cwd = pathConverter.unix(process.cwd());
      cwd = cwd.replace(home, '~');
      var delimiter = user + '@' + host + ':' + cwd + '$';
      // If we're on linux-based systems, color
      // the prompt so we don't get confused.
      if (!isWindows) {
        delimiter = '\u001b[32m' + delimiter + '\u001b[39m';
      }
      vorpal.delimiter(delimiter);
      cb(null);
    }).catch(function (err) {
      return cb(err);
    });
  },
  getHomeDir: function getHomeDir() {
    return userHome;
  }
};