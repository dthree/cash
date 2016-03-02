'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');

describe('true', function () {
  it('should exist and be a function', function () {
    should.exist(cash.true);
  });

  it('should do nothing when called', function () {
    const results = cash.true();
    console.log(typeof results);
    results.should.equal('');
  });

  describe('programmatic use', function () {
    it('should execute in vorpal mode sync', function () {
      const result = cash('true');
      result.should.equal('');
    });
  });
});
