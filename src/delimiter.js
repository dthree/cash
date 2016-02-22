'use strict';

const os = require('os');
const username = require('username');

const pathConverter = require('./util/converter.path');

module.exports = {

  refresh(vorpal, cb) {
    cb = cb || function () {};
    const self = this;
    username(function (err, username) {
      if (!err) {
        const user = username;
        const host = String(os.hostname()).split('.')[0];
        const home = pathConverter.unix(self.getHomeDir());
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
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
  }
};
