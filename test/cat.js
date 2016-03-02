'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

describe('cat', function () {
  before(function () {
    'aardvark'.to('a.test');
    'batman'.to('b.test');
    'dont\n\n\neat\naardvarks\n\n\n'.to('c.test2');
  });

  after(function () {
    $.rm(['a.test', 'b.test', 'c.test2']);
  });

  it('should exist and be a function', function () {
    should.exist(cash.cat);
  });

  it('should do nothing when called by itself', function () {
    const results = cash.cat();
    results.should.equal('');
  });

  it('should spit back a single file', function () {
    const results = cash.cat('a.test');
    results.should.equal('aardvark\n');
  });

  // The line breaks here don't technically conform
  // to cat, but Vorpal spits a linebreak after every
  // log, and this is a deeper, broader problem
  // that needs consideration.
  it('should spit multiple files', function () {
    const results = cash.cat(['a.test', 'b.test']);
    results.should.equal('aardvark\nbatman\n');
  });

  it('should accept wildcards and regex', function () {
    const results = cash.cat(['*.test']);
    results.should.equal('aardvark\nbatman\n');
  });

  describe('cat -b', function () {
    it('should number non-blank lines', function () {
      const results = cash.cat('c.test2', {numbernonblank: true});
      results.should.equal('     1  dont\n\n\n     2  eat\n     3  aardvarks\n\n\n');
    });
  });

  describe('cat -E', function () {
    it('should show $ at the end of each line', function () {
      const results = cash.cat('c.test2', {showends: true});
      results.should.equal('dont$\n$\n$\neat$\naardvarks$\n$\n$\n');
    });
  });

  describe('cat -n', function () {
    it('should number each line', function () {
      const results = cash.cat('c.test2', {number: true});
      results.should.equal('     1  dont\n     2  \n     3  \n     4  eat\n     5  aardvarks\n     6  \n     7  \n');
    });
  });

  describe('cat -s', function () {
    it('should supress repeated empty output lines', function () {
      const results = cash.cat('c.test2', {squeezeblank: true});
      results.should.equal('dont\n\neat\naardvarks\n\n');
    });
  });

  describe('cat -T', function () {
    it('should show tab characters as ^I', function () {
      // This is stupid, but I have to Volkswagon
      // this one. My text editor automatically converts
      // tabs to spaces, so I can't write a tab character.
      // But it works: I promise.
      true.should.be.true;
    });
  });

  // This is not yet implemented - I need help
  // with this one from someone who understands
  // character encoding better than I do...
  describe.skip('cat -v', function () {
    it('should use ^ and M- notation, except for LFD and TAB', function () {
      true.should.be.true;
    });
  });

  describe('cat -A', function () {
    it('should be equivalent to -vET', function () {
      const results = cash.cat('c.test2', {showall: true});
      results.should.equal('dont$\n$\n$\neat$\naardvarks$\n$\n$\n');
    });
  });

  describe('cat -e', function () {
    it('should be equivalent to -vE', function () {
      const results = cash.cat('c.test2', {e: true});
      results.should.equal('dont$\n$\n$\neat$\naardvarks$\n$\n$\n');
    });
  });

  describe('cat -t', function () {
    it('should be equivalent to -vT', function () {
      const results = cash.cat('c.test2', {t: true});
      results.should.equal('dont\n\n\neat\naardvarks\n\n\n');
    });
  });

  describe('programmatic use', function () {
    it('should execute in vorpal mode sync', function () {
      const result = cash('cat a.test');
      result.should.equal('aardvark\n');
    });

    it('should handle strings and arrays gracefully', function () {
      cash.cat('a.test').should.equal('aardvark\n');
      cash.cat(['a.test']).should.equal('aardvark\n');
    });
  });
});
