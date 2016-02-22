'use strict';

require('assert');
require('should');
const cash = require('../dist/index.js');

describe('windows', function () {
  it('execute a catch command', function () {
    cash('cash-test');
  });
});
