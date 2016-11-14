'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

describe('mkdir', function () {
  before(function () {
    process.stdout.columns = 1000;
    $.rm('-rf', './testabot*');
  });

  after(function () {
    $.rm('-rf', './testabot*');
  });

  it('should exist and be a function', function () {
    should.exist(cash.mkdir);
  });

  it('should show usage when not passed anything', function () {
    const usage = 'mkdir: missing operand\nTry \'mkdir --help\' for more information.\n';
    cash.mkdir().should.equal(usage);
    cash.mkdir('').should.equal(usage);
    cash.mkdir([]).should.equal(usage);
  });

  it('should make a dir', function () {
    $.test('-e', './testabot').should.equal(false);
    cash.mkdir('testabot');
    $.test('-e', './testabot').should.equal(true);
  });

  it('should make multiple dirs', function () {
    $.test('-e', './testabot-a').should.equal(false);
    $.test('-e', './testabot-b').should.equal(false);
    $.test('-e', './testabot-c').should.equal(false);
    cash.mkdir('testabot-a testabot-b testabot-c');
    $.test('-e', './testabot-a').should.equal(true);
    $.test('-e', './testabot-b').should.equal(true);
    $.test('-e', './testabot-c').should.equal(true);
    $.rm('-rf', './testabot-a');
    $.rm('-rf', './testabot-b');
    $.rm('-rf', './testabot-c');
  });

  it('accept arrays as an input', function () {
    $.test('-e', './testabot-a').should.equal(false);
    $.test('-e', './testabot-b').should.equal(false);
    $.test('-e', './testabot-c').should.equal(false);
    cash.mkdir(['testabot-a', 'testabot-b', 'testabot-c']);
    $.test('-e', './testabot-a').should.equal(true);
    $.test('-e', './testabot-b').should.equal(true);
    $.test('-e', './testabot-c').should.equal(true);
  });

  it('should error on an existing dir', function () {
    $.test('-e', './testabot').should.equal(true);
    cash.mkdir('testabot').should.equal('mkdir: cannot create directory testabot: File exists\n');
  });

  it('should error on a child dir that doesn\'t exist', function () {
    $.rm('-rf', './testabot');
    $.test('-e', './testabot').should.equal(false);
    cash.mkdir('testabot/foo').should
      .equal('mkdir: cannot create directory testabot/foo: No such file or directory\n');
  });

  describe('-p', function () {
    it('should create a child dir that doesn\'t exist', function () {
      $.rm('-rf', './testabot');
      $.test('-e', './testabot').should.equal(false);
      cash.mkdir('testabot/foo', {parents: true});
      $.test('-e', './testabot/foo').should.equal(true);
    });
  });

  describe('-v', function () {
    it('should print a message on a single directory created', function () {
      $.rm('-rf', './testabot');
      $.test('-e', './testabot').should.equal(false);
      cash.mkdir('testabot', {verbose: true}).should.equal('mkdir: created directory testabot\n');
      $.test('-e', './testabot').should.equal(true);
    });

    it('should print a message on a -p directory created', function () {
      $.rm('-rf', './testabot');
      $.test('-e', './testabot').should.equal(false);
      cash.mkdir('testabot/foo', {parents: true, verbose: true}).should
        .equal('mkdir: created directory testabot\nmkdir: created directory testabot/foo\n');
      $.test('-e', './testabot/foo').should.equal(true);
    });
  });
});
