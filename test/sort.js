'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const $ = require('shelljs');

function sort(dir, opts) {
  opts = opts || {};
  opts.options = opts.options || {};
  try {
    return cash.sort(dir, opts);
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
}

describe('sort', function () {
  before(function (done) {
    process.stdout.columns = 1000;
    setTimeout(function () {
      new $.ShellString('zaz\nsss\nqqq\n-zbz\nBBB\nddd\nCCC\n2bbb\nccc\n').to('./default.sort');
      new $.ShellString('22 zaz\n33 sss\n11 qqq\n77 ccc\n55 BBB\nddd\nCCC\n2bbb\n-zbz\n').to('./numeric.sort');
      new $.ShellString('1k\na 2G\n8k\n1M\n.8K\nddd\nCCC\n7bbb\n1bbb\n5M\n4G\n3T\n2.5P\n2E\n1Z\n6bbb\n5bbb\n-zbz\n').to('./human.sort');
      new $.ShellString('4mar\nMarch\nMarc\napr\nAPR\ngoats\n56sevenjan\njan345kds\ndec\ndecem\nau\nAuGuSt\nAuGurt\naug\naugust\n').to('./month.sort');
      new $.ShellString('1\n2\n3\n4\n5\n26\n7\n8\n9\n10\n11\n').to('./disorder-numeric.sort');
      new $.ShellString('a\nb\nc\nd\nf\ne\ng\n').to('./disorder.sort');
      new $.ShellString('1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13\n14\n15\n16\n17\n18\n19\n20\n').to('./numbers.sort');
      done();
    }, 100);
  });

  after(function () {
    $.rm('*.sort');
  });

  it('should exist and be a function', function () {
    should.exist(cash.sort);
  });

  it('should do nothing when called by itself', function () {
    const results = sort();
    results.should.equal('');
  });

  it('should properly sort a single file', function () {
    const results = sort('default.sort');
    results.should.equal('2bbb\nBBB\nccc\nCCC\nddd\nqqq\nsss\nzaz\n-zbz\n');
  });

  it('should sort multiple files in a combined fashion', function () {
    const results = sort(['default.sort', 'default.sort']);
    results.should.equal('2bbb\n2bbb\nBBB\nBBB\nccc\nccc\nCCC\nCCC\nddd\nddd\nqqq\nqqq\nsss\nsss\nzaz\nzaz\n-zbz\n-zbz\n');
  });

  describe('sort -n', function () {
    it('should compare according to string numerical value', function () {
      const results = sort('numeric.sort', {numericsort: true});
      results.should.equal('CCC\nddd\n-zbz\n2bbb\n11 qqq\n22 zaz\n33 sss\n55 BBB\n77 ccc\n');
    });
  });

  describe('sort -h', function () {
    it('should compare human readable numbers (e.g., 2K 1G)', function () {
      const results = sort('human.sort', {humannumericsort: true});
      results.should.equal('a 2G\nCCC\nddd\n-zbz\n1bbb\n5bbb\n6bbb\n7bbb\n.8K\n1k\n8k\n1M\n5M\n4G\n3T\n2.5P\n2E\n1Z\n');
    });
  });

  describe('sort -m', function () {
    it('should compare (unknown) < \'JAN\' < ... < \'DEC\'', function () {
      const results = sort('month.sort', {monthsort: true});
      results.should.equal('4mar\n56sevenjan\nau\ngoats\njan345kds\nMarc\nMarch\napr\nAPR\naug\nAuGurt\naugust\nAuGuSt\ndec\ndecem\n');
    });
  });

  describe('sort -c', function () {
    it('should check for sorted input', function () {
      const results = sort('disorder.sort', {check: true});
      results.should.equal('sort: -:6: disorder: e\n');
    });

    it('should check for sorted numeric input', function () {
      const results = sort('disorder-numeric.sort', {check: true});
      results.should.equal('sort: -:6: disorder: 26\n');
    });
  });

  describe('sort -r', function () {
    it('should reverse the result of comparisons', function () {
      sort('default.sort', {reverse: true})
        .should.equal('-zbz\nzaz\nsss\nqqq\nddd\nCCC\nccc\nBBB\n2bbb\n');
    });

    it('should reverse multiple-file comparisons', function () {
      sort(['default.sort', 'default.sort'], {reverse: true})
        .should.equal('-zbz\n-zbz\nzaz\nzaz\nsss\nsss\nqqq\nqqq\nddd\nddd\nCCC\nCCC\nccc\nccc\nBBB\nBBB\n2bbb\n2bbb\n');
    });

    it('should reverse operations using other options', function () {
      sort('human.sort', {humannumericsort: true, reverse: true})
        .should.equal('1Z\n2E\n2.5P\n3T\n4G\n5M\n1M\n8k\n1k\n.8K\n7bbb\n6bbb\n5bbb\n1bbb\n-zbz\nddd\nCCC\na 2G\n');
    });
  });

  describe('sort -o', function () {
    it('should write result to file instead of standard output', function () {
      sort('default.sort', {output: 'default-out.sort'}).should.equal('');
      cash.cat('default-out.sort').should.equal('2bbb\nBBB\nccc\nCCC\nddd\nqqq\nsss\nzaz\n-zbz\n');
    });

    it('should shit on you for passing no argument to "--output', function () {
      sort('default.sort', {output: true})
        .should.equal('sort: option \'--output\' requires an argument\nTry \'sort --help\' for more information.\n');
    });

    it('should shit on you for passing an invalid file', function () {
      // Yeah, I'm a muggle.
      sort('default.sort', {output: './platform/nine/and/three/quarters.sort'})
        .should.equal('sort: open failed: ./platform/nine/and/three/quarters.sort: No such file or directory\n');
    });
  });

  describe('sort -R', function () {
    // I use currently use the Fisher Yates shuffle,
    // Bostock style. Yes, I know, sorting arrays has woes.
    it('should sort by a random hash of keys', function () {
      let last = '';
      // Is 20 factorial sufficient entropy? What are the
      // odds of my test failing? :)
      for (let i = 0; i < 100; ++i) {
        const results = sort('numbers.sort', {randomsort: true});
        results.should.not.equal(last);
        last = results;
      }
    });
  });
});
