'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const util = require('./util/util');
const pathConverter = require('../dist/util/converter.path.js');
const delimiter = require('../dist/delimiter');

describe('cd', function () {
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
    should.exist(cash.cd);
  });

  it('should traverse a sub directory', function () {
    cash.cd('./sub');
    String(pathConverter.unix(process.cwd())).should.containEql('/testing');
  });

  it('should go up a directory', function () {
    cash.cd('..');
    String(pathConverter.unix(process.cwd())).should.not.containEql('/sub');
    String(pathConverter.unix(process.cwd())).should.containEql('/testing');
  });

  it('should go to the home dir if nothing is passed', function () {
    const current = process.cwd();
    cash.cd('');
    String(pathConverter.unix(process.cwd())).should.not.containEql('/cash');
    String(pathConverter.unix(process.cwd())).should.containEql(pathConverter.unix(delimiter.getHomeDir()));
    process.chdir(current);
    String(pathConverter.unix(process.cwd())).should.containEql('/cash');
  });

  it('should reject bs directories', function () {
    const result = cash.cd('fubar');
    result.should.equal('-bash: cd: fubar: No such file or directory\n');
  });
});
