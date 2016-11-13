'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

const fxt = {
  ten: 'line2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\nline11\n',
  ten2: 'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\n',
  five: 'line7\nline8\nline9\nline10\nline11\n',
  hdr1: '==> eleven.test <==\n',
  hdr2: '==> ten.test <==\n'
};

describe('tail', function () {
  before(function () {
    process.stdout.columns = 1000;
    new $.ShellString('line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\nline11\n').to('eleven.test');
    new $.ShellString('line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\n').to('ten.test');
  });

  after(function () {
    $.rm('eleven.test', 'ten.test');
  });

  it('should exist and be a function', function () {
    should.exist(cash.tail);
  });

  it('should print the last ten lines in file', function () {
    const fixture = fxt.ten;
    cash('tail eleven.test').should.equal(fixture);
  });

  it('should print the last ten lines for each file with headers', function () {
    const fixture = `${fxt.hdr1}${fxt.ten}${fxt.hdr2}${fxt.ten2}`;
    cash('tail *.test').should.equal(fixture);
  });

  describe('-n, --lines', function () {
    it('should print the last five lines in file', function () {
      const fixture = fxt.five;
      cash('tail eleven.test -n 5').should.equal(fixture);
    });

    it('should disallow an invalid number of lines', function () {
      const fixture = `tail: cows: invalid number of lines\n`;
      cash('tail eleven.test -n cows').should.equal(fixture);
    });
  });

  describe('-v, --verbose', function () {
    it('should print the last five lines in file with header', function () {
      const fixture = `${fxt.hdr1}${fxt.five}`;
      cash('tail eleven.test --lines 5 -v').should.equal(fixture);
    });

    it('should print the last ten lines in file with header', function () {
      const fixture = `${fxt.hdr1}${fxt.ten}`;
      cash('tail eleven.test -v').should.equal(fixture);
    });
  });

  describe('-q, --silent', function () {
    it('should print the last ten lines for each file without headers', function () {
      const fixture = `${fxt.ten}${fxt.ten2}`;
      cash('tail *.test -q').should.equal(fixture);
    });
  });

  describe('input validation', function () {
    it('should do nothing on undefined input', function () {
      cash.tail().should.equal('');
    });

    it('should do nothing on a blank string', function () {
      cash.tail('').should.equal('');
    });

    it('should give message on an invalid file', function () {
      const fx = `tail: cannot open sss.sd for reading: No such file or directory\n`;
      cash.tail('sss.sd').should.equal(fx);
    });

    it('should continue with valid files despite invalid files', function () {
      const fx1 = `tail: cannot open sss.sd for reading: No such file or directory\n`;
      const fx3 = `tail: cannot open ddd.df for reading: No such file or directory\n`;
      cash('tail -n 5 sss.sd eleven.test ddd.df').should.equal(`${fx1}${fxt.hdr1}${fxt.five}${fx3}`);
    });
  });
});
