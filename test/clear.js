'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');

describe('clear', function () {
  it('should exist and be a function', function () {
    should.exist(cash.clear);
  });

  it('should run without throwing', function () {
    (function () {
      cash.clear();
    }).should.not.throw();
  });
});
