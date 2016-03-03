'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

describe('tail', function () {
  before(function () {
    'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\nline11'.to('eleven.test');
    'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10'.to('ten.test');
  });

  after(function () {
    $.rm(['eleven.test', 'ten.test']);
  })

  it('should exist and be a function', function () {
    should.exist(cash.tail);
  });

  it('should print the last ten lines in file', function () {
    const result = String(cash.tail('eleven.test')).split("\n");
    (result.length).should.be.exactly(11);
  });

  it('should print the last five lines in file', function () {
    var result = String(cash('tail -n5 test.txt')).split("\n");
    (result.length).should.be.exactly(6);
  });

  it('should print the last five lines in file with header', function () {
    var result = String(cash('tail test.txt -n5 -v')).split("\n");
    (result.length).should.be.exactly(7);
  });

  it('should print the last ten lines in file with header', function () {
    var result = String(cash('tail test.txt -v')).split("\n");
    fs.writeFileSync('test3.txt', result, 'utf8');
    (result.length).should.be.exactly(12);
  });

  it('should print the last ten lines for each file with headers', function () {
    var result = String(cash('tail te*.txt')).split("\n");
    (result.length).should.be.exactly(24);
  });

  it('should print the last ten lines for each file without headers', function () {
    var result = String(cash('tail te*.txt -q')).split("\n");
    (result.length).should.be.exactly(22);
  });

  it('should print the last six lines for each file without headers', function () {
    var result = String(cash('tail te*.txt -n6 -q')).split("\n");
    (result.length).should.be.exactly(14);
  });

  it('should print the last six lines for each file with headers', function () {
    var result = String(cash('tail te*.txt')).split("\n");
    (result.length).should.be.exactly(16);
  });
});
