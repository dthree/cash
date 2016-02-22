'use strict';

require('assert');
const should = require('should');
const cash = require('../dist/index.js');
const os = require('os');

describe('help', function () {
  it('should exist', function () {
    should.exist(cash);
  });

  // Appveyor creates some problems
  // that I can't reproduce on any Windows
  // box. Need to work on this.
  if (os.platform() !== 'win32') {
    it('should show help when passed an invalid command', function () {
      const out = cash('banjo kazooie!');
      out.should.containEql('Cash');
      out.should.containEql('These shell commands are defined internally');
    });
  }
});
