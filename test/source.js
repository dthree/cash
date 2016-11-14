'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const path = require('path');
const $ = require('shelljs');

let oldCwd;
let oldProcessEnv;

const usage = `-cash: source: filename argument required\nsource: usage: source filename [arguments]\n`;

describe('source', function () {
  before(function () {
    process.stdout.columns = 1000;
    oldCwd = process.cwd();
    oldProcessEnv = process.env;
    new $.ShellString('echo "      hello world"\nalias foo bar\n').to('a.sh');
    new $.ShellString(`export FOO=hello
    export BAR=$FOO$FOO
    cd ..`).to('b.sh');
    $.touch('nonreadable.txt');
    $.chmod('000', 'nonreadable.txt');
  });

  after(function () {
    process.env = oldProcessEnv;
    $.chmod('555', 'nonreadable.txt'); // to allow deletion
    $.rm('-f', 'a.sh', 'b.sh', 'nonreadable.txt');
  });

  beforeEach(function () {
    process.env = {};
  });

  afterEach(function () {
    process.chdir(oldCwd);
  });

  it('should exist', function () {
    should.exist(cash.source);
  });

  it('should modify current environment', function () {
    (function () {
      cash.export(['FOO=cows']);
      cash.source('b.sh');
    }).should.not.throw();
    cash('echo $FOO $BAR')
      .should.equal('hello hellohello\n');
  });

  it('should change current directory', function () {
    (function () {
      cash.source('b.sh');
    }).should.not.throw();
    process.cwd().should.equal(path.resolve(oldCwd, '..'));
  });

  it('should add alias', function () {
    cash.source('a.sh');
    cash.alias('foo').should.equal('alias foo=\'bar\'\n');
  });

  describe('input validation', function () {
    it('should print usage on an undefined input', function () {
      cash.source().should.equal(usage);
    });

    it('should print usage on a blank string', function () {
      cash.source('').should.equal(usage);
    });

    it('should print msg when reading a non-existent file', function () {
      cash.source({file: 'thisfiledoesntexist'})
        .should.equal('-cash: thisfiledoesntexist: No such file or directory\n');
    });

    it('should print msg when using a directory', function () {
      cash.source({file: '.'}).should.equal('-cash: source: .: is a directory\n');
    });

    it('should print msg when given a nonreadable file', function () {
      // ShellJS's $.chmod() doesn't have good Windows support, so skip this test for now
      if (process.platform !== 'win32') {
        cash.source({file: 'nonreadable.txt'}).should.equal('-cash: nonreadable.txt: Permission denied\n');
      }
    });

    it('should accept parameters', function () {
      (function () {
        cash.source('b.sh foo bar');
      }).should.not.throw();
    });
  });
});
