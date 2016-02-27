'use strict';

require('assert');
const should = require('should');
const $ = require('shelljs');

let cash;

describe('cash', function () {
  it('should export properly', function () {
    should.exist(require('..'));
  });


  describe('template literals', function () {
    before(function () {
      cash = require('..');
      $.rm('-rf', 'test-template');
    });

    after(function () {
      $.rm('-rf', 'test-template');
    });

    it('execute multiple lines as template literals', function () {
      const out = cash `
        mkdir test-template
        cd test-template
        touch foo
        echo hi
      `;
      out.should.equal('hi\n');
      $.test('-e', './../test-template/foo').should.equal(true);
    });
    it('execute later literals in the same context', function () {
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
