'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');

// Cleans all alias junk out of
// localStorage.
function clear() {
  cash._aliases = {};
  const ls = cash.vorpal.localStorage._localStorage;
  cash.vorpal.localStorage.removeItem('aliases');
  ls.keys = ls.keys.filter(function (key) {
    if (String(key).indexOf('alias|') > -1) {
      delete ls.metaKeyMap[key];
      return false;
    }
  });
}

describe('alias', function () {
  before(function () {
    process.stdout.columns = 1000;
    clear();
  });

  after(function () {
    clear();
  });

  it('should exist and be a function', function () {
    should.exist(cash.alias);
  });

  it('should create an alias with an equal symbol', function () {
    (function () {
      cash.alias('foo=bar');
    }).should.not.throw();
    cash.alias('foo').should.equal('alias foo=\'bar\'\n');
  });

  it('should print msg when reading an invalid alias', function () {
    cash.alias('lalalala').should.equal('-cash: alias: lalalala: not found\n');
  });

  it('should rename an alias', function () {
    (function () {
      cash.alias('foo=cows');
    }).should.not.throw();
    cash.alias('foo').should.equal('alias foo=\'cows\'\n');
  });

  it('should create an alias with spaces and multiple words', function () {
    (function () {
      cash.alias('foo bar tender nice to meet you');
    }).should.not.throw();
    cash.alias('foo').should.equal('alias foo=\'bar tender nice to meet you\'\n');
  });

  it('should deal with surrounding quotes', function () {
    cash.alias('foo "bar tender nice to meet you"');
    cash.alias('foo').should.equal('alias foo=\'bar tender nice to meet you\'\n');
    cash.alias('foo=\'bar tender nice to meet you\'');
    cash.alias('foo').should.equal('alias foo=\'bar tender nice to meet you\'\n');
  });

  it('should handle multiple aliases', function () {
    clear();
    cash.alias('a "a"');
    cash.alias('b "b"');
    cash.alias('c "c"');
    cash.alias('a').should.equal('alias a=\'a\'\n');
    cash.alias('b').should.equal('alias b=\'b\'\n');
    cash.alias('c').should.equal('alias c=\'c\'\n');
  });

  it('should list all registered aliases', function () {
    cash.alias().should.equal('alias a=\'a\'\nalias b=\'b\'\nalias c=\'c\'\n');
  });

  describe('-p', function () {
    it('should list all registered aliases', function () {
      cash.alias(undefined, {p: true}).should.equal('alias a=\'a\'\nalias b=\'b\'\nalias c=\'c\'\n');
    });
  });
});
