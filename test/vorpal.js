'use strict';

require('assert');
const should = require('should');
const cash = require('../src/index.js');
const commands = require('../commands.json');

describe('vorpal', function () {
  it('should exist', function () {
    should.exist(cash);
  });

  it('should execute all commands without erroring', function () {
    (function () {
      const cmds = commands.commands;
      for (let i = 0; i < cmds.length; ++i) {
        cash(`${cmds[i]}`);
      }
    }).should.not.throw();
  });

  it('should require commands without vorpal', function () {
    (function () {
      const cmds = commands.commands;
      for (let i = 0; i < cmds.length; ++i) {
        require(`../src/commands/${cmds[i]}.js`)();
      }
    }).should.not.throw();
  });
});
