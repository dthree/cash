'use strict';

require('assert');
const should = require('should');
const strip = require('../dist/util/stripAnsi.js');
const cash = require('../dist/index.js');
const $ = require('shelljs');
const util = require('./util/util');
const os = require('os');

const expected = {
  rootDirFlat: 'a.txt  b.tgz  c.exe  d.json  e.gif  f.jpg  g  sub\n',
  rootDirFlatAll: '.  ..  a.txt  b.tgz  c.exe  d.json  e.gif  f.jpg  g  .hidden  sub\n',
  rootDirFlatHidden: 'a.txt  b.tgz  c.exe  d.json  e.gif  f.jpg  g  .hidden  sub\n',
  rootDirFlatReversed: 'a.txt  b.tgz  c.exe  d.json  e.gif  f.jpg  g  sub\n',
  rootDirFlatClassified: 'a.txt  b.tgz  c.exe  d.json  e.gif  f.jpg  g  sub/\n',
  rootDirFlatThinWidth: 'a.txt\nb.tgz\nc.exe\nd.json\ne.gif\nf.jpg\ng\nsub\n',
  rootDirFlatQuotes: '"a.txt"  "b.tgz"  "c.exe"  "d.json"  "e.gif"  "f.jpg"  "g"  "sub"\n',
  rootDirFlatByFileSize: 'sub  g  f.jpg  b.tgz  e.gif  d.json  c.exe  a.txt\n',
  subDirFlat: 'a.txt  b.tgz  c.exe  d.json  e.gif  f.jpg  g\n'
};

function ls(path, opts) {
  opts = opts || {};
  opts.options = opts.options || {};
  try {
    const result = cash.ls(path, opts);
    return result;
  } catch (e) {
    console.log(e);
    throw new Error(e);
  }
}

// Appveyor creates some problems
// that I can't reproduce on any Windows
// box. Need to work on this.
if (os.platform() !== 'win32') {
  describe('ls', function () {
    before(function (done) {
      $.mkdir('-p', './atatatest/foo/bar');
      $.touch('./atatatest/foo/bar/cows.file');
      util.writeSampleDir(function () {
        process.chdir('./testing/');
        done();
      });
    });

    after(function () {
      process.chdir('..');
      $.rm('-rf', './atatatest');
      util.deleteSampleDir();
    });

    describe('directory listings', function () {
      it('should exist and be a function', function () {
        should.exist(cash.ls);
      });

      it('should list current dir as default', function () {
        const res = ls();
        strip(res).should.equal(expected.rootDirFlat);
      });

      it('should list a sub directory', function () {
        const res = ls('./sub');
        strip(res).should.equal(expected.subDirFlat);
      });

      it('should list multiple directories', function () {
        const res = ls(['.', './sub']);
        strip(res).should.equal(`.:\n${expected.rootDirFlat}\n./sub:\n${expected.subDirFlat}`);
      });

      it('should handle globs', function () {
        const res = ls('*.gif');
        strip(res).should.equal(`e.gif\n`);
      });

      it('should list a parent directory', function () {
        process.chdir('./sub/');
        const res = ls('..');
        strip(res).should.equal(expected.rootDirFlat);
        process.chdir('..');
      });
    });

    describe('sorting', function () {
      it('should not sort with -U', function () {
        // This is hard to test as linux sorts
        // the files by default and windows doesn't
        const unsorted = ls('.', {U: true});
        if (os.platform() !== 'win32') {
          strip(unsorted).should.equal(expected.rootDirFlat);
        }
      });

      it('should reverse-sort with -r', function () {
        const res = ls('.', {r: true});
        strip(res).should.equal(expected.rootDirFlatReversed);
      });

      // this is breaking on travis but not in my ubuntu box... weird
      // have to debug.
      it.skip('should sort by file size with -S', function () {
        const res = ls('.', {S: true});
        strip(res).should.equal(expected.rootDirFlatByFileSize);
      });
    });

    describe('file display', function () {
      it('should list hidden files with --almost-all', function () {
        const res = ls('.', {almostall: true});
        strip(res).should.equal(expected.rootDirFlatHidden);
      });

      it('should list hidden and implied files with --all', function () {
        const res = ls('.', {all: true});
        strip(res).should.equal(expected.rootDirFlatAll);
      });

      it('should list append "/" to folders with --classify', function () {
        const res = ls('.', {classify: true});
        strip(res).should.equal(expected.rootDirFlatClassified);
      });

      it('should add quotes to names with --quote-name', function () {
        const res = ls('.', {quotename: true});
        strip(res).should.equal(expected.rootDirFlatQuotes);
      });

      it('should adjust screen width with --width', function () {
        const res = ls('.', {width: 5});
        strip(res).replace(/ /g, '').should.equal(expected.rootDirFlatThinWidth);
      });

      it('should list entries as flat  -x', function () {
        const res = ls('.', {x: true});
        strip(res).should.equal(expected.rootDirFlat);
      });

      it('should list one file per line with -1', function () {
        const res = ls('.', {1: true});
        strip(res).replace(/ /g, '').should.equal(expected.rootDirFlatThinWidth);
      });
    });

    describe('long listing', function () {
      it('should draw long listings with -l', function () {
        const res = ls('.', {l: true});
        const out = strip(res);
        out.should.containEql('total');
        out.should.containEql('-rw');
        out.should.containEql(' 1 ');
        out.should.containEql(' 135 ');
        out.should.containEql(' e.gif');
        out.should.containEql(' sub');
      });

      it('should display human readable numbers of --human-readable', function () {
        const res = ls('.', {l: true, humanreadable: true});
        const out = strip(res);
        out.should.containEql(' 135');
        out.should.containEql('3.6K');
      });
    });

    describe('-r', function () {
      it('should list recursively with -r', function () {
        const res = ls('../atatatest', {recursive: true});
        const out = strip(res);
        out.should.equal(`../atatatest/foo:\nbar\n\n../atatatest/foo/bar:\ncows.file\n`);
      });
    });
  });
}
