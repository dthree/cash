'use strict';

const os = require('os');
const username = require('username');
const userHome = require('user-home');

const isWindows = process.platform === 'win32';
const pathConverter = require('./util/converter.path');

module.exports = {

  refresh(vorpal, cb) {
    cb = cb || function () {};
    username().then(username => {
      const user = username;
      const host = String(os.hostname()).split('.')[0];
      const home = pathConverter.unix(userHome);
      let cwd = pathConverter.unix(process.cwd());
      cwd = cwd.replace(home, '~');
      let delimiter = `${user}@${host}:${cwd}$`;
      // If we're on linux-based systems, color
      // the prompt so we don't get confused.
      if (!isWindows) {
        delimiter = `\u001b[32m${delimiter}\u001b[39m`;
      }
      vorpal.delimiter(delimiter);
      cb(null);
    }).catch(err => cb(err));
  },

  getHomeDir() {
    return userHome;
  }
};
