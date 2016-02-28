'use strict';

require('assert');
const should = require('should');
const vorpal = require('vorpal')();
const os = require('os');

const cash = require('..');
const preparser = require('../dist/preparser.js');

const windows = (os.platform() === 'win32');
const path = process.env.PATH;
const nvmDir = process.env.NVM_DIR;

describe('preparser', function () {
  it('should exist and be a function', function () {
    should.exist(preparser);
    (typeof preparser).should.equal('function');
  });

  it('should load into a command', function () {
    vorpal.command('foo').parse(preparser).action(function () {
      this.log('bar');
      return 'bar';
    });
  });

  it('should execute without throwing', function () {
    vorpal.execSync('foo').should.equal('bar');
  });

  describe('environmental variables', function () {
    it('should convert them according to os', function () {
      if (windows) {
        cash('echo %PATH%').should.equal(`${path}\n`);
      } else {
        cash('echo $PATH').should.equal(`${path}\n`);
      }
    });

    it('concatenate variables with no space', function () {
      if (windows) {
        cash('echo %PATH%%PATH%').should.equal(`${path}${path}\n`);
      } else {
        cash('echo $PATH$PATH').should.equal(`${path}${path}\n`);
      }
    });

    it('display variables with one or more spaces in between', function () {
      if (windows) {
        cash('echo %PATH% %PATH%').should.equal(`${path} ${path}\n`);
      } else {
        cash('echo $PATH $PATH').should.equal(`${path} ${path}\n`);
      }
    });

    it('display variable references from inside double quotes', function () {
      if (windows) {
        cash('echo "%PATH%   %PATH%"').should.equal(`${path}   ${path}\n`);
      } else {
        cash('echo "$PATH   $PATH"').should.equal(`${path}   ${path}\n`);
      }
    });

    it('separate variable references from strings with slash or dot', function () {
      if (windows) {
        cash('echo foo/%PATH%/%PATH%.bar').should.equal(`foo/${path}/${path}.bar\n`);
      } else {
        cash('echo foo/$PATH/$PATH.bar').should.equal(`foo/${path}/${path}.bar\n`);
      }
    });

    it('non-existent variables default to the empty string for unix', function () {
      if (!windows) {
        cash('echo $FAKE_ENV_VAR').should.equal('\n');
      }
    });

    it('underscores can be in environmental variable names', function () {
      if (nvmDir) {
        if (windows) {
          cash('echo %NVM_DIR%').should.equal(`${nvmDir}\n`);
        } else {
          cash('echo $NVM_DIR').should.equal(`${nvmDir}\n`);
        }
      }
    });

    it('append variables and strings', function () {
      if (windows) {
        cash('echo foo%PATH%bar').should.equal(`foo${path}bar\n`);
      } else {
        cash('echo foo${PATH}bar').should.equal(`foo${path}bar\n`);
      }
    });

    it('should convert the same variable twice', function () {
      if (windows) {
        cash('echo %PATH%-%PATH%').should.equal(`${path}-${path}\n`);
      } else {
        cash('echo $PATH-$PATH').should.equal(`${path}-${path}\n`);
      }
    });
  });
});
