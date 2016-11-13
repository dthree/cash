'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

function burninate() {
  $.rm('-rf', './cptemp');
  $.rm('-rf', 'cp-a');
  $.rm('-rf', 'cp-b');
  $.rm('-rf', 'cp-c');
  $.rm('-rf', 'cp-d');
  $.rm('-rf', 'cp-e');
  $.rm('-rf', 'cpra');
  $.rm('-rf', 'cprb');
}

function reset() {
  burninate();
  $.mkdir('-p', 'cpra/cpra2/cpra3/cpra4');
  $.touch('cpra/cpra2/cpra3/cpra4/cprfile.file');
  $.mkdir('cprb');
  $.mkdir('cptemp');
  $.touch('cp-a');
  $.touch('cp-b');
  $.touch('cp-c');
}

describe('cp', function () {
  before(function () {
    process.stdout.columns = 1000;
    burninate();
  });

  after(function () {
    burninate();
  });

  beforeEach(function () {
    reset();
  });

  it('should exist and be a function', function () {
    should.exist(cash.cp);
  });

  it('should show usage when not passed anything', function () {
    const usage = 'cp: missing file operand\nTry \'cp --help\' for more information.\n';
    cash.cp().should.equal(usage);
    cash.cp('').should.equal(usage);
    cash.cp([]).should.equal(usage);
  });

  it('should show usage when passed only one param', function () {
    const usage = 'cp: missing destination file operand after foo\nTry \'cp --help\' for more information.\n';
    cash.cp('foo').should.equal(usage);
    cash.cp(['foo']).should.equal(usage);
  });

  it('should copy a file', function () {
    cash.cp('cp-a cptemp/cp-a');
    $.test('-e', './cptemp/cp-a').should.equal(true);
    $.test('-e', 'cp-a').should.equal(true);
  });

  it('should move multiple files', function () {
    cash.cp('cp-a cp-b cptemp');
    $.test('-e', 'cp-a').should.equal(true);
    $.test('-e', 'cp-b').should.equal(true);
    $.test('-e', './cptemp/cp-a').should.equal(true);
    $.test('-e', './cptemp/cp-b').should.equal(true);
  });

  it('should only accept directories on multiple files', function () {
    cash.cp('cp-a cp-b cptemp/cp-cows').should
      .equal('cp: target cptemp/cp-cows is not a directory\n');
  });

  it('should skip and give message on non-existing src files', function () {
    const msg =
      'cp: cannot stat cp-vorpal: No such file or directory\n' +
      'cp: cannot stat cp-howdy: No such file or directory\n';
    cash.cp('cp-a cp-b cp-vorpal cp-c cp-howdy cptemp').should
      .equal(msg);
    $.test('-e', 'cp-a').should.equal(true);
    $.test('-e', 'cp-vorpal').should.equal(false);
    $.test('-e', './cptemp/cp-a').should.equal(true);
    $.test('-e', './cptemp/cp-b').should.equal(true);
    $.test('-e', './cptemp/cp-c').should.equal(true);
  });

  it('should clobber existing files', function () {
    new $.ShellString('foxes').to('cp-d');
    new $.ShellString('elephants').to('cp-e');
    cash.cp('cp-d cp-e');
    $.test('-e', 'cp-d').should.equal(true);
    $.cat('cp-e').should.equal('foxes');
  });

  describe('-n', function () {
    it('should not clobber existing files', function () {
      new $.ShellString('foxes').to('cp-d');
      new $.ShellString('elephants').to('cp-e');
      cash.cp('cp-d cp-e', {noclobber: true}).should.equal('');
      $.test('-e', 'cp-d').should.equal(true);
      $.cat('cp-d').should.equal('foxes');
      $.cat('cp-e').should.equal('elephants');
    });
  });

  describe('-f', function () {
    it('should overwrite -n', function () {
      new $.ShellString('foxes').to('cp-d');
      new $.ShellString('elephants').to('cp-e');
      cash.cp('cp-d cp-e', {noclobber: true, force: true});
      $.test('-e', 'cp-d').should.equal(true);
      $.cat('cp-e').should.equal('foxes');
    });
  });

  describe('-r', function () {
    it('should copy a file recursively', function () {
      cash.cp('cpra cprb', {recursive: true}).should.equal('');
      $.test('-e', 'cpra/cpra2/cpra3/cpra4/cprfile.file').should.equal(true);
    });
  });
});
