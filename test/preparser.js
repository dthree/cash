'use strict';

require('assert');
const should = require('should');
const vorpal = require('vorpal')();

const preparser = require('../dist/preparser.js');

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
});
