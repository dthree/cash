'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

function burninate() {
  $.rm('-rf', './mvtemp');
  $.rm('-rf', 'mv-a');
  $.rm('-rf', 'mv-b');
  $.rm('-rf', 'mv-c');
  $.rm('-rf', 'mv-d');
  $.rm('-rf', 'mv-e');
}

function reset() {
  burninate();
  $.mkdir('mvtemp');
  $.touch('mv-a');
  $.touch('mv-b');
  $.touch('mv-c');
}

describe('mv', function () {
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
    should.exist(cash.mv);
  });

  it('should show usage when not passed anything', function () {
    const usage = 'mv: missing file operand\nTry \'mv --help\' for more information.\n';
    cash.mv().should.equal(usage);
    cash.mv('').should.equal(usage);
    cash.mv([]).should.equal(usage);
  });

  it('should show usage when passed only one param', function () {
    const usage = 'mv: missing destination file operand after foo\nTry \'mv --help\' for more information.\n';
    cash.mv('foo').should.equal(usage);
    cash.mv(['foo']).should.equal(usage);
  });

  it('should move a file', function () {
    cash.mv('mv-a mvtemp/mv-a');
    $.test('-e', './mvtemp/mv-a').should.equal(true);
  });

  it('should move multiple files', function () {
    cash.mv('mv-a mv-b mvtemp');
    $.test('-e', './mvtemp/mv-a').should.equal(true);
    $.test('-e', './mvtemp/mv-b').should.equal(true);
  });

  it('should only accept directories on multiple files', function () {
    cash.mv('mv-a mv-b mvtemp/mv-cows').should
      .equal('mv: target mvtemp/mv-cows is not a directory\n');
  });

  it('should skip and give message on non-existing src files', function () {
    const msg =
      'mv: cannot stat mv-vorpal: No such file or directory\n' +
      'mv: cannot stat mv-howdy: No such file or directory\n';
    cash.mv('mv-a mv-b mv-vorpal mv-c mv-howdy mvtemp').should
      .equal(msg);
    $.test('-e', './mvtemp/mv-a').should.equal(true);
    $.test('-e', './mvtemp/mv-b').should.equal(true);
    $.test('-e', './mvtemp/mv-c').should.equal(true);
  });

  it('should rename a file', function () {
    cash.mv('mv-a mv-d');
    $.test('-e', 'mv-d').should.equal(true);
    $.test('-e', 'mv-a').should.equal(false);
  });

  it('should clobber existing files', function () {
    new $.ShellString('foxes').to('mv-d');
    new $.ShellString('elephants').to('mv-e');
    cash.mv('mv-d mv-e');
    $.test('-e', 'mv-d').should.equal(false);
    $.cat('mv-e').should.equal('foxes');
  });

  describe('-n', function () {
    it('should not clobber existing files', function () {
      new $.ShellString('foxes').to('mv-d');
      new $.ShellString('elephants').to('mv-e');
      cash.mv('mv-d mv-e', {noclobber: true}).should.equal('');
      $.test('-e', 'mv-d').should.equal(true);
      $.cat('mv-d').should.equal('foxes');
      $.cat('mv-e').should.equal('elephants');
    });
  });

  describe('-f', function () {
    it('should overwrite -n', function () {
      new $.ShellString('foxes').to('mv-d');
      new $.ShellString('elephants').to('mv-e');
      cash.mv('mv-d mv-e', {noclobber: true, force: true});
      $.test('-e', 'mv-d').should.equal(false);
      $.cat('mv-e').should.equal('foxes');
    });
  });

  describe('-v', function () {
    it('should print verbose messages', function () {
      cash.mv('mv-a mv-b mvtemp', {verbose: true}).should
        .equal('mv-a -> mvtemp/mv-a\nmv-b -> mvtemp/mv-b\n');
      $.test('-e', './mvtemp/mv-a').should.equal(true);
      $.test('-e', './mvtemp/mv-b').should.equal(true);
    });
  });
});
