'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const util = require('./util/util');
const fs = require('fs-extra');

describe('touch', function () {
  before(function (done) {
    process.stdout.columns = 1000;
    util.writeSampleDir(function () {
      process.chdir('./testing/');
      done();
    });
  });

  after(function () {
    process.chdir('..');
    util.deleteSampleDir();
  });

  it('should exist and be a function', function () {
    should.exist(cash.touch);
  });

  it('should create a file where none exists', function () {
    cash.touch('fizzle');
    const stat = fs.statSync('fizzle');
    stat.should.exist;
  });

  it('should update the atime and mtime of a file that does exist', function () {
    cash.touch('fizzle', {
      date: '1 January 1980'
    });
    const stat = fs.statSync('fizzle');
    const atime = new Date(stat.atime);
    const mtime = new Date(stat.mtime);
    cash.touch('fizzle');
    const stat2 = fs.statSync('fizzle');
    const atime2 = new Date(stat2.atime);
    const mtime2 = new Date(stat2.mtime);
    ((atime2 - atime) > 0).should.equal(true);
    ((mtime2 - mtime) > 0).should.equal(true);
  });

  it('should handle multiple files gracefully', function () {
    cash.touch(['wizzle', 'fizzle']);
    (function () {
      fs.statSync('fizzle');
      fs.statSync('wizzle');
    }).should.not.throw();
  });

  it('should set custom times with --date', function () {
    cash.touch('fizzle', {
      date: '1 January 1980'
    });
    let stat;
    (function () {
      stat = fs.statSync('fizzle');
    }).should.not.throw();
    stat.atime.getFullYear().should.equal(1980);
    stat.mtime.getFullYear().should.equal(1980);
  });

  it('should only change the access time with -a', function () {
    cash.touch('fizzle', {
      a: true,
      date: '1 January 1976'
    });
    let stat;
    (function () {
      stat = fs.statSync('fizzle');
    }).should.not.throw();
    stat.atime.getFullYear().should.equal(1976);
    stat.mtime.getFullYear().should.equal(1980);
  });

  it('should use another file\'s times with --reference', function () {
    cash.touch('wizzle', {
      reference: 'fizzle'
    });
    let stat;
    (function () {
      stat = fs.statSync('wizzle');
    }).should.not.throw();
    stat.atime.getFullYear().should.equal(1976);
    stat.mtime.getFullYear().should.equal(1980);
  });

  it('should use --time as an alias for -a or -m', function () {
    cash.touch('fizzle', {
      time: 'access',
      date: '1 January 1972'
    });
    let stat;
    (function () {
      stat = fs.statSync('fizzle');
    }).should.not.throw();
    stat.atime.getFullYear().should.equal(1972);
    stat.mtime.getFullYear().should.equal(1980);
  });

  it('should throw on invalid --time parameter', function () {
    const results = cash.touch('fizzle', {
      time: 'notime!'
    });
    results.should.containEql('touch: invalid argument "notime!"');
  });

  it('should throw on invalid --date parameter', function () {
    const results = cash.touch('fizzle', {
      date: 'at the prom?'
    });
    results.should.containEql('touch: invalid date format');
  });

  it('should throw on invalid --reference parameter', function () {
    const results = cash.touch('fizzle', {
      reference: 'themissingfile'
    });
    results.should.containEql('touch: failed to get attributes');
  });
});
