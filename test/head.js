'use strict';

require('assert');
require('mocha');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

const fxt = {
  ten: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\n',
  ten2: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\n',
  five: 'line1\nline2\nline3\nline4\nline5\n',
  hdr1: '==> eleven.test <==\n',
  hdr2: '==> ten.test <==\n'
};

describe('head', function () {
  before(function () {
    process.stdout.columns = 1000;
    new $.ShellString('line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\nline11').to('eleven.test');
    new $.ShellString('line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10').to('ten.test');
  });

  after(function () {
    $.rm('eleven.test', 'ten.test');
  });

  it('should exist', function () {
    should.exist(cash.head);
  });

  it('should print the first ten lines in file', function () {
    const fixture = fxt.ten;
    cash('head eleven.test').should.equal(fixture);
  });

  it('should print the first ten lines for each file with headers', function () {
    const fixture = `${fxt.hdr1}${fxt.ten}\n${fxt.hdr2}${fxt.ten2}`;
    cash('head *.test').should.equal(fixture);
  });

  describe('-n, --lines', function () {
    it('should print the first five lines in file', function () {
      const fixture = fxt.five;
      cash('head eleven.test -n 5').should.equal(fixture);
    });

    it('should disallow an invalid number of lines', function () {
      const fixture = `head: cows: invalid number of lines\n`;
      cash('head eleven.test -n cows').should.equal(fixture);
    });
  });

  describe('-v, --verbose', function () {
    it('should print the first five lines in file with header', function () {
      const fixture = `${fxt.hdr1}${fxt.five}`;
      cash('head eleven.test --lines 5 -v').should.equal(fixture);
    });

    it('should print the first ten lines in file with header', function () {
      const fixture = `${fxt.hdr1}${fxt.ten}`;
      cash('head eleven.test -v').should.equal(fixture);
    });
  });

  describe('-q, --silent', function () {
    it('should print the first ten lines for each file without headers', function () {
      const fixture = `${fxt.ten}${fxt.ten2}`;
      cash('head *.test -q').should.equal(fixture);
    });
  });

  describe('input validation', function () {
    it('should do nothing on undefined input', function () {
      cash.head().should.equal('');
    });

    it('should do nothing on a blank string', function () {
      cash.head('').should.equal('');
    });

    it('should do nothing on no params with options', function () {
      cash('head -n 5').should.equal('');
    });

    it('should give message on an invalid file', function () {
      const fx = `head: cannot open sss.sd for reading: No such file or directory\n`;
      cash.head('sss.sd').should.equal(fx);
    });

    it('should continue with valid files despite invalid files', function () {
      const fx1 = `head: cannot open sss.sd for reading: No such file or directory\n`;
      const fx3 = `head: cannot open ddd.df for reading: No such file or directory\n`;
      cash('head -n 5 sss.sd eleven.test ddd.df').should.equal(`${fx1}${fxt.hdr1}${fxt.five}${fx3}`);
    });
  });

  describe('input piping', function () {
    it('should work with piped input', function () {
      cash('cat eleven.test | head -n 5');
      // const fixture = fxt.five;
      // vorpal bug on piping sync stdout
      // cash('cat eleven.test | head -n 5').should.equal(fixture);
    });
  });
});
