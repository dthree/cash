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
    should.exist(cash.unalias);
  });

  it('should show usage when not passed anything', function () {
    cash.unalias().should.equal('unalias: usage: unalias [-a] name [name ...]\n');
    cash.unalias('').should.equal('unalias: usage: unalias [-a] name [name ...]\n');
    cash.unalias([]).should.equal('unalias: usage: unalias [-a] name [name ...]\n');
  });

  it('should remove an alias', function () {
    cash.alias('foo=bar');
    cash.alias('foo').should.equal('alias foo=\'bar\'\n');
    cash.unalias('foo');
    cash.alias('foo').should.equal('-cash: alias: foo: not found\n');
  });

  it('should remove multiple aliases', function () {
    cash.alias('foo=bar');
    cash.alias('fizz buzz');
    cash.alias('foo').should.equal('alias foo=\'bar\'\n');
    cash.alias('fizz').should.equal('alias fizz=\'buzz\'\n');
    cash.unalias('foo fizz');
    cash.alias('foo').should.equal('-cash: alias: foo: not found\n');
    cash.alias('fizz').should.equal('-cash: alias: fizz: not found\n');
  });

  it('should chuck norris roundhouse kick you on an invalid alias', function () {
    cash.unalias('foo');
    cash.unalias('chucknorrisweakspot').should.equal('-cash: unalias: chucknorrisweakspot: not found\n');
  });

  describe('-a', function () {
    it('should remove all registered aliases', function () {
      cash.alias('foo=bar');
      cash.alias('fizz buzz');
      cash.unalias(undefined, {a: true});
      cash.alias('foo').should.equal('-cash: alias: foo: not found\n');
      cash.alias('fizz').should.equal('-cash: alias: fizz: not found\n');
    });
  });
});
