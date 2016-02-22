'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');

describe('kill', function () {
  it('should exist and be a function', function () {
    should.exist(cash.kill);
  });

  it('should show usage when not passed anything', function () {
    const usage = 'kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]\n';
    cash.kill().should.equal(usage);
    cash.kill('').should.equal(usage);
    cash.kill([]).should.equal(usage);
  });

  it('should error on an invalid pid', function () {
    (function () {
      cash.kill('69696969');
    }).should.not.throw();
  });

  it('should error on an invalid process name', function () {
    // Let's hope Travis doesn't incorporate this game into
    // every Docker image! It just might happen.
    (function () {
      cash.kill('banjokazooie');
    }).should.not.throw();
  });

  it('should accept a string of multiple processes', function () {
    (function () {
      cash.kill('69696969 banjokazooie');
    }).should.not.throw();
  });

  describe('-l', function () {
    it('should print available signals', function () {
      cash.kill(undefined, {l: true}).should.equal(` 9) SIGKILL   15) SIGTERM\n`);
    });

    it('should print the name of a signal number', function () {
      cash.kill(undefined, {l: 9}).should.equal(`KILL\n`);
    });

    it('should print the number of a signal name', function () {
      cash.kill(undefined, {l: 'KILL'}).should.equal(`9\n`);
    });

    it('should not allow an invalid signal', function () {
      cash.kill(undefined, {l: 'ALICE-IN-WONDERLAND'}).should
        .equal(`-cash: kill: ALICE-IN-WONDERLAND: invalid signal specification\n`);
    });
  });

  describe('-s', function () {
    it('should accept SIGKILL', function () {
      (function () {
        cash.kill('2342309SDF', {s: 'SIGKILL'});
      }).should.not.throw();
    });
    it('should accept KILL', function () {
      (function () {
        cash.kill('2342309SDF', {s: 'KILL'});
      }).should.not.throw();
    });
  });

  describe('-n', function () {
    it('should accept signal 9', function () {
      (function () {
        cash.kill('2342309SDF', {n: 9});
      }).should.not.throw();
    });
  });
});
