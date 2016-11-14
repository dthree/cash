'use strict';

require('assert');
const should = require('should');
const $ = require('shelljs');
const delimiter = require('./../dist/delimiter.js');

let cash;
let cashrcCopy;
let cashrcPath;

describe('cash', function () {
  it('should export properly', function () {
    should.exist(require('..'));
  });

  describe('.cashrc', function () {
    before(function () {
      process.stdout.columns = 1000;
      cashrcPath = `${delimiter.getHomeDir()}/.cashrc`;
      cashrcCopy = `${cashrcPath}_${String(Math.random())}`;
      if ($.test('-f', cashrcPath)) {
        $.mv(cashrcPath, cashrcCopy);
        if ($.error()) {
          console.error('warning: unable to save your cashrc file');
        }
      }
      new $.ShellString('touch fizzlecrumbs').to(cashrcPath);
      cash = require('..');
    });

    after(function () {
      if ($.test('-f', cashrcCopy)) {
        $.mv(cashrcCopy, cashrcPath);
        if ($.error()) {
          console.error('warning: unable to restore your cashrc file');
        }
      } else {
        $.rm('-f', cashrcPath);
      }
      $.rm('-rf', 'fizzlecrumbs');
    });

    // I think this is an import problem between test
    // problems.
    it.skip('should load a .cashrc file', function () {
      $.test('-f', 'fizzlecrumbs').should.equal(true);
    });
  });

  describe('template literals', function () {
    before(function () {
      process.stdout.columns = 1000;
      cash = require('..');
      $.rm('-rf', 'test-template');
    });

    after(function () {
      $.rm('-rf', 'test-template');
    });

    it('should execute multiple lines as template literals', function () {
      const out = cash `
        mkdir test-template
        cd test-template
        touch foo
        echo hi
      `;
      out.should.equal('hi\n');
      $.test('-e', './../test-template/foo').should.equal(true);
    });
    it('should execute later literals in the same context', function () {
      cash `
        cd ..
      `;
      const out = cash `
        pwd
        rm test-template -rf
      `;
      out.should.not.containEql('test-template');
      $.test('-e', 'test-template').should.equal(false);
    });
  });
});
