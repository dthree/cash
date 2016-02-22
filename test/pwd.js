'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

describe('pwd', function () {
  it('should exist and be a function', function () {
    should.exist(cash.pwd);
  });

  it('should print the current working directory', function () {
    cash.pwd().should.containEql('cash');
  });

  it('should change on directory change', function () {
    String(cash.pwd()).should.not.containEql('node_modules');
    $.cd('./node_modules');
    String(cash.pwd()).should.containEql('node_modules');
    $.cd('..');
  });
});
