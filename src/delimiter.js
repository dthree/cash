'use strict';

const os = require('os');
const username = require('username');
const userHome = require('user-home');

const pathConverter = require('./util/converter.path');

module.exports = {

  refresh(vorpal, cb) {
    cb = cb || function () {};
    username(function (err, username) {
      if (!err) {
        const user = username;
        const host = String(os.hostname()).split('.')[0];
        const home = pathConverter.unix(userHome);
        let cwd = pathConverter.unix(process.cwd());
        cwd = cwd.replace(home, '~');
        let delimiter = `${user}@${host}:${cwd}$`;
        // If we're on linux-based systems, color
        // the prompt so we don't get confused.
        if (os.platform().indexOf('win') === -1) {
          delimiter = `\u001b[32m${delimiter}\u001b[39m`;
        }
        vorpal.delimiter(delimiter);
      }
      cb(err);
    });
  },

  getHomeDir() {
    return userHome;
  }
};
