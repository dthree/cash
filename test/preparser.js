'use strict';

require('assert');
const should = require('should');
const vorpal = require('vorpal')();
const os = require('os');

const cash = require('..');
const preparser = require('../dist/preparser.js');

const windows = (os.platform() === 'win32');

const path = process.env.PATH;

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

    it.skip('should convert the same variable twice', function () {
      if (windows) {
        cash('echo %PATH%-%PATH%').should.equal(`${path}-${path}\n`);
      } else {
        cash('echo $PATH-$PATH').should.equal(`${path}-${path}\n`);
      }
    });
  });
});
