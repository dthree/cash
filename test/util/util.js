'use strict';

const $ = require('shelljs');
const fs = require('fs-extra');

module.exports = {

  writeSampleDir(cb) {
    // If tests fail mid, script cleanup doesn't happen.
    // This makes sure we are in the right dir before
    // trying to write.
    if (String(process.cwd()).indexOf('/cash') === -1) {
      process.chdir(`${__dirname}/../..`);
    }

    fs.removeSync('./testing');

    $.mkdir('-p', './testing/');
    $.mkdir('-p', './testing/sub/');

    let filler = 'fill|';

    function writeDir(dir, cbk) {
      const files = ['a.txt', 'c.exe', 'd.json', 'e.gif', 'b.tgz', 'f.jpg', 'g', '.hidden'];
      function write() {
        const next = files.shift();
        if (next) {
          filler = double(filler);
          new $.ShellString(filler).to(dir + next);
          setTimeout(function () {
            write();
          }, 10);
        } else {
          cbk();
        }
      }
      write();
    }

    writeDir('./testing/', function () {
      writeDir('./testing/sub/', function () {
        cb();
      });
    });
  },

  deleteSampleDir() {
    fs.removeSync('./testing');
  }
};

function double(str) {
  return str + str + str.slice(0, 100);
}
