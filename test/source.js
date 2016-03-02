'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const path = require('path');
const $ = require('shelljs');

let oldCwd;
let oldProcessEnv;

describe('source', function () {
  before(function () {
    oldCwd = process.cwd();
    oldProcessEnv = process.env;
    `echo 'hello world'`.to('a.sh');
    'echo "hello world"\nalias foo bar\n'.to('b.sh');
    `export FOO=hello
    export BAR=$FOO$FOO
    cd ..`.to('c.sh');
    `echo $BAZ`.to('d.sh');
    $.touch('nonreadable.txt');
    $.chmod('000', 'nonreadable.txt');
  });

  after(function () {
    process.env = oldProcessEnv;
    $.chmod('555', 'nonreadable.txt'); // to allow deletion
    $.rm('-f', ['a.sh', 'b.sh', 'c.sh', 'd.sh', 'nonreadable.txt']);
  });

  beforeEach(function () {
    process.env = {};
  });

  afterEach(function () {
    process.chdir(oldCwd);
  });

  it('should exist and be a function', function () {
    should.exist(cash.source);
  });

  it('should print msg when reading a nonexistant file', function () {
    cash.source({file: 'thisfiledoesntexist'}).should.equal('-cash: thisfiledoesntexist: No such file or directory\n');
  });

  it('should print msg when using a directory', function () {
    cash.source({file: '.'}).should.equal('-cash: source: .: is a directory\n');
  });

  it('should print msg when given a nonreadable file', function () {
    cash.source({file: 'nonreadable.txt'}).should.equal('-cash: nonreadable.txt: Permission denied\n');
  });

  it('should modify current environment', function () {
    (function () {
      cash.export(['FOO=cows']);
      cash.source('c.sh');
    }).should.not.throw();
    cash('echo $FOO $BAR').should.equal('hello hellohello\n');
  });

  it('should change current directory', function () {
    (function () {
      cash.source('c.sh');
    }).should.not.throw();
    process.cwd().should.equal(path.resolve(oldCwd, '..'));
  });

  it('should add alias', function () {
    console.log(cash.cat('b.sh'));
    cash.source('b.sh');
    cash.alias('foo').should.equal('alias foo=\'bar\'\n');
  });
});
