'use strict';

require('assert');
require('mocha');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');
require('shelljs/global');

describe('head', function () {
  before(function () {
    'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\nline11'.to('eleven.test');
    'line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10'.to('ten.test');
  });

  after(function () {
    $.rm(['eleven.test', 'ten.test']);
  });

  it('should exist and be a function', function () {
    should.exist(cash.head);
  });

  it('should give back ten lines when called without options', function () {
    const result = cash.head('eleven.test');
    result.should.be.equal('line1\nline2\nline3\nline4\nline5\nline6\nline7\nline8\nline9\nline10\n');
  });

  it('should give back five lines when called with option n set to 5', function () {
    const result = cash.head('eleven.test', {n: 5});
    result.should.be.equal('line1\nline2\nline3\nline4\nline5\n');
  });

  it('should write header when used with more than one file', function () {
    const result = cash.head(['eleven.test', 'ten.test'], {n: 2});
    result.should.be.equal('==> eleven.test <==\nline1\nline2\n\n==> ten.test <==\nline1\nline2\n');
  });
});
