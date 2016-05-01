'use strict';

require('assert');
require('should');
const cash = require('../src/index.js');

describe('windows', function () {
  it('execute a catch command', function () {
    cash('cash-test');
  });
});
