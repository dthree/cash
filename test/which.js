'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');

describe('true', function () {
  it('should exist and be a function', function () {
    should.exist(cash.which);
  });

  it('should do nothing when called', function () {
    const results = cash.which();
    console.log(typeof results);
    results.should.equal('');
  });

  it('should find cmd when called', function () {
    const results = cash.which('cmd');
    console.log(typeof results);
    results.should.not.equal('');
  });
});
