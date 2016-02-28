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
    before(function () {
      process.env.FOO = 'This*string\'has   $pecial${characters}';
    });
    it('should convert simple variable references', function () {
      cash('echo $PATH').should.equal(`${path}\n`);
    });

    it('should convert variable references using the ${.*} syntax', function () {
      cash('echo ${PATH}').should.equal(`${path}\n`);
    });

    it('should concatenate variables with no space', function () {
      cash('echo $PATH$PATH').should.equal(`${path}${path}\n`);
      cash('echo ${PATH}${PATH}').should.equal(`${path}${path}\n`);
    });

    it('should display variables with one or more spaces in between', function () {
      cash('echo $PATH $PATH').should.equal(`${path} ${path}\n`);
      cash('echo ${PATH} ${PATH}').should.equal(`${path} ${path}\n`);
    });

    it('should display variable references from inside double quotes', function () {
      cash('echo "$PATH   $PATH"').should.equal(`${path}   ${path}\n`);
    });

    it('should separate variable references from strings with slash or dot', function () {
      cash('echo foo/$PATH/$PATH.bar').should.equal(`foo/${path}/${path}.bar\n`);
    });

    it('should show non-existent variables as the empty string', function () {
      cash('echo $FAKE_ENV_VAR').should.equal('\n');
    });

    it('should allow underscores in environmental variable names', function () {
      if (nvmDir) {
        cash('echo $NVM_DIR').should.equal(`${nvmDir}\n`);
      }
    });

    it('should append variables and strings', function () {
      cash('echo foo${PATH}bar').should.equal(`foo${path}bar\n`);
    });

    it('should have proper case sensitivity', function () {
      if (windows) {
        // Case insensitive
        cash('echo $path.$PATH').should.equal(`${path}.${path}\n`);
      } else {
        // Case sensitive
        cash('echo $path.$PATH').should.equal(`.${path}\n`);
      }
    });

    it('should handle variables with weird characters inside', function () {
      cash('echo "$FOO"').should.equal(`${process.env.FOO}\n`);
    });

    it('should convert the same variable twice', function () {
      cash('echo $PATH-$PATH').should.equal(`${path}-${path}\n`);
    });
    after(function () {
      delete process.env.FOO;
    });
  });
});
