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
    const result = cash.tail('eleven.test').split("\n");
    (result.length).should.be.exactly(11);
  });

  it('should print the last five lines in file', function () {
    var result = cash.tail('eleven.test', {n: 5}).split("\n");
    (result.length).should.be.exactly(6);
  });

  it('should print the last five lines in file with header', function () {
    var result = cash.tail('eleven.test', {n: 5, v: true}).split("\n");
    (result.length).should.be.exactly(7);
  });

  it('should print the last ten lines in file with header', function () {
    var result = cash.tail('eleven.test', {v: true}).split("\n");
    (result.length).should.be.exactly(12);
  });

  it('should print the last ten lines for each file with headers', function () {
    var result = cash.tail('eleven.test').split("\n");
    (result.length).should.be.exactly(24);
  });

  it('should print the last ten lines for each file without headers', function () {
    var result = cash.tail('eleven.test', {q:true}).split("\n");
    (result.length).should.be.exactly(22);
  });

  it('should print the last six lines for each file without headers', function () {
    var result = cash.tail('eleven.test', {n: 6, q: true}).split("\n");
    (result.length).should.be.exactly(14);
  });

  it('should print the last six lines for each file with headers', function () {
    var result = cash.tail('eleven.test', {n: 6}).split("\n");
    (result.length).should.be.exactly(16);
  });

  it('should print the last ten lines for each file with headers', function () {
    var result = cash.tail(['ten.txt', 'eleven.test']).split("\n");
    (result.length).should.be.exactly(16);
  });
});
