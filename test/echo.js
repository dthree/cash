'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');

describe('echo', function () {
  before(function (done) {
    process.stdout.columns = 1000;
    done();
  });

  it('should exist and be a function', function () {
    should.exist(cash.echo);
  });

  it('should echo back a single word', function () {
    const results = cash.echo('hi');
    results.should.equal('hi\n');
  });

  it('should echo back multiple words', function () {
    const results = cash.echo('hi my name is slim shady');
    results.should.equal('hi my name is slim shady\n');
  });

  it('should echo back dirty input', function () {
    const fixture = 'hi! --help me i\'m @#$@# angry and r@ndom! "" 0 ';
    const results = cash.echo(fixture);
    results.should.equal(`${fixture}\n`);
  });

  describe('echo -e', function () {
    it('should interpret backspace with \\b', function () {
      const results = cash.echo('this  \\bone sentences\\b should be grammm\\batically correct.', {e: true});
      results.should.equal('this one sentence should be grammatically correct.\n');
    });

    it('should produce no further output with \\c', function () {
      const results = cash.echo('don\'t do drugs\\c, kid.', {e: true});
      results.should.equal('don\'t do drugs\n');
    });

    it('should interpret a newline with \\n', function () {
      const results = cash.echo('these\\nare\\non\\ndifferent\\nlines.', {e: true});
      results.should.equal('these\nare\non\ndifferent\nlines.\n');
    });

    it('should interpret a carriage return with \\r', function () {
      const results = cash.echo('these\\rare\\ron\\rdifferent\\rlines.', {e: true});
      results.should.equal('these\rare\ron\rdifferent\rlines.\n');
    });

    it('should interpret a tab with \\t', function () {
      const results = cash.echo('tab\\tme.', {e: true});
      results.should.equal('tab     me.\n');
    });

    it('should carriage return with \\r', function () {
      const results = cash.echo('these\\rare\\ron\\rdifferent\\rlines.', {e: true});
      results.should.equal('these\rare\ron\rdifferent\rlines.\n');
    });
  });

  describe('echo -E', function () {
    it('should explicitly suppress backslash interpretations', function () {
      const results = cash.echo('the \\cquick \\nbrown \\rfox \\tjumped \\\\over', {e: true, E: true});
      results.should.equal('the \\cquick \\nbrown \\rfox \\tjumped \\\\over\n');
    });
  });
});
