'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');
const fs = require('fs');


describe('pwd', function () {
  it('should exist and be a function', function () {
    should.exist(cash.pwd);
  });

  it('should print the current working directory', function () {
    cash.pwd().should.containEql('cash');
  });

  it('should change on directory change', function () {
    fs.writeFileSync('test3.txt', String(cash.pwd()), 'utf8');
    String(cash.pwd()).should.not.containEql('node_modules');
    $.cd('./node_modules');
    String(cash.pwd()).should.containEql('node_modules');
    $.cd('..');
  });
});
