#!/usr/bin/env node
'use strict';
var cash = require('../src/index');
var delimiter = require('./../src/delimiter')
delimiter.refresh(cash.vorpal, function () {
  cash.show();
});
