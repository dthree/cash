'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const fs = require('fs');
const $ = require('shelljs');

describe('rm', function () {
  before(function () {
    process.stdout.columns = 1000;
    $.mkdir('rm-test');
    $.mkdir('./rm-test/sub');
    new $.ShellString('1').to('1.rm');
    new $.ShellString('a').to('./rm-test/a.txt');
    new $.ShellString('b').to('./rm-test/b.txt');
    new $.ShellString('c').to('./rm-test/c.txt');
    new $.ShellString('d').to('./rm-test/sub/d.txt');
    new $.ShellString('cow').to('./rm-test/a.cows');
    new $.ShellString('cow').to('./rm-test/b.cows');
    new $.ShellString('cow').to('./rm-test/c.cows');
    new $.ShellString('goose').to('./rm-test/a.goose');
    new $.ShellString('goose').to('./rm-test/b.goose');
  });

  after(function () {
  });

  it('should exist and be a function', function () {
    should.exist(cash.rm);
  });

  it('should remove a file', function () {
    ($.ls('.').indexOf('1.rm')).should.be.above(-1);
    cash.rm('1.rm');
    ($.ls('.').indexOf('1.rm')).should.equal(-1);
  });

  it('should remove from a subdirectory', function () {
    ($.ls('./rm-test').indexOf('a.txt')).should.be.above(-1);
    cash.rm('./rm-test/a.txt');
    ($.ls('./rm-test').indexOf('a.txt')).should.equal(-1);
  });

  it('should remove mutiple files at once', function () {
    cash.rm('./rm-test/a.goose');
    cash.rm('./rm-test/b.goose');
    ($.ls('./rm-test').indexOf('a.goose')).should.equal(-1);
    ($.ls('./rm-test').indexOf('b.goose')).should.equal(-1);
  });

  it('should remove based on wildcards / regex', function () {
    cash.rm('./rm-test/*.cows');
    ($.ls('./rm-test').indexOf('a.cows')).should.equal(-1);
    ($.ls('./rm-test').indexOf('b.cows')).should.equal(-1);
    ($.ls('./rm-test').indexOf('c.cows')).should.equal(-1);
  });

  it('should not remove a dir that doesn\'t exist', function () {
    cash.rm('./bllasdlfjsd')
      .should.equal(`rm: cannot remove ./bllasdlfjsd: No such file or directory\n`);
    ($.ls('./rm-test').indexOf('a.txt')).should.equal(-1);
  });

  it('should not remove a directory without -r', function () {
    const out = cash.rm('rm-test');
    out.should.equal('rm: cannot remove: path is a directory\n');
  });

  describe('rm -r', function () {
    it('should recursively remove directories and files', function () {
      ($.ls('.').indexOf('rm-test')).should.not.equal(-1);
      cash.rm('./rm-test', {recursive: true});
      ($.ls('.').indexOf('rm-test')).should.equal(-1);
    });
  });

  describe('rm -f', function () {
    it('should remove a read only file with', function () {
      $.mkdir('-p', './rm-temp/readonly');
      new $.ShellString('asdf').to('./rm-temp/readonly/file2');
      fs.chmodSync('./rm-temp/readonly/file2', '0444'); // -r--r--r--
      cash.rm('./rm-temp/readonly/file2', {force: true});
      ($.ls('.').indexOf('./rm-temp/readonly/file2')).should.equal(-1);
      cash.rm('./rm-temp', {recursive: true});
      ($.ls('.').indexOf('./rm-temp')).should.equal(-1);
    });
  });
});
