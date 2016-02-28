'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');

let oldProcessEnv;

describe('export', function () {
  before(function () {
    oldProcessEnv = process.env;
  });

  beforeEach(function () {
    process.env = {};
  });

  after(function () {
    process.env = oldProcessEnv;
  });

  it('should exist and be a function', function () {
    should.exist(cash.export);
  });

  it('should create an export with an equal symbol', function () {
    (function () {
      cash.export(['foo=bar']);
    }).should.not.throw();
    cash('echo $foo').should.equal('bar\n');
  });

  it('should accept a string argument', function () {
    (function () {
      cash.export('foo=bar');
    }).should.not.throw();
    cash('echo $foo').should.equal('bar\n');
  });

  it('should print msg when reading an invalid export', function () {
    cash.export(['1lalalala']).should.equal('-cash: export: `1lalalala\': not a valid identifier\n');
    cash.export(['la@lalala']).should.equal('-cash: export: `la@lalala\': not a valid identifier\n');
  });

  it('should reassign an export', function () {
    (function () {
      cash.export(['foo=cows']);
      cash.export(['foo=dogs']);
    }).should.not.throw();
    cash('echo $foo').should.equal('dogs\n');
  });

  it('should do nothing if already exported', function () {
    (function () {
      cash.export(['PATH=/usr/bin']);
      cash.export(['PATH']);
    }).should.not.throw();
    cash('echo $PATH').should.equal(`${process.env.PATH}\n`);
    cash('echo $PATH').should.equal('/usr/bin\n');
  });

  it('should work without surrounding quotes', function () {
    cash.export(['foo=bar']);
    cash('echo $foo').should.equal('bar\n');
  });

  it('should deal with surrounding single quotes', function () {
    cash.export(['foo=\'bar tender nice to meet you\'']);
    cash('echo $foo').should.equal('bar tender nice to meet you\n');
  });

  it('should deal with surrounding double quotes', function () {
    cash.export(['foo="bar tender nice to meet you"']);
    cash('echo $foo').should.equal('bar tender nice to meet you\n');
  });

  it('should handle multiple exports', function () {
    (function () {
      cash.export(['a="A"']);
      cash.export(['b=\'B\'']);
      cash.export(['c="C"']);
    }).should.not.throw();
    cash('echo $a $b $c').should.equal('A B C\n');
  });

  it('should list all registered aliases', function () {
    (function () {
      cash.export(['a="A"']);
      cash.export(['b=\'B\'']);
      cash.export(['c="C"']);
    }).should.not.throw();
    cash.export().should.equal('declare -x a="A"\ndeclare -x b="B"\ndeclare -x c="C"\n');
  });

  describe('-p', function () {
    it('should list all registered exports', function () {
      (function () {
        cash.export(['a="A"']);
        cash.export(['b=\'B\'']);
        cash.export(['c="C"']);
      }).should.not.throw();
      cash.export(undefined, {p: true}).should.equal('declare -x a="A"\ndeclare -x b="B"\ndeclare -x c="C"\n');
    });
  });
});
