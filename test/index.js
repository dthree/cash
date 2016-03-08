'use strict';

require('assert');
const should = require('should');
const $ = require('shelljs');
const delimiter = require('./../dist/delimiter.js');

let cash;

describe('cash', function () {
  before(function () {
    'touch fizzlecrumbs'.to(`${delimiter.getHomeDir()}/.cashrc`);
    cash = require('..');
  });

  it('should export properly', function () {
    should.exist(require('..'));
  });

  describe('.cashrc', function () {
    after(function () {
      $.rm('-rf', '.cashrc');
      $.rm('-rf', 'fizzlecrumbs');
    });

    // I think this is an import problem between test
    // problems.
    it.skip('should load a .cashrc file', function () {
      $.test('-e', 'fizzlecrumbs').should.equal(true);
    });
  });

  describe('template literals', function () {
    before(function () {
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
