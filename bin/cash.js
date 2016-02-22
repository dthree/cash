#!/usr/bin/env node
'use strict';
var cash = require('../dist/index');
var delimiter = require('./../dist/delimiter')
delimiter.refresh(cash.vorpal, function () {
  cash.show();
});
