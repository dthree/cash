'use strict';

var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');

var alias = {
  exec: function exec(args, options) {
    args = args || [];
    options = options || {};
    var vorpal = options.vorpal;

    if (!vorpal) {
      throw new Error('Alias is not programatically supported.');
    }

    vorpal._aliases = vorpal._aliases || [];

    if (args.length < 1) {
      options.p = true;
    }

    if (typeof args === 'string' || args instanceof String) {
      args = [args];
    }

    // Parse incoming args. Accept either:
    // alias foo=bar, or
    // alias foo 'bar and so on'.
    var key = args.join(' ');
    var value = void 0;
    if (String(key).indexOf('=') > -1) {
      var parts = String(key).trim().split('=');
      key = parts[0];
      value = parts[1] || value;
    } else {
      var _parts = String(key).trim().split(' ');
      key = _parts.shift();
      value = _parts.join(' ');
    }

    // Remove wrapped quotes from value.
    if (value !== undefined) {
      value = String(value).replace(/^[\"|\']|[\"|\']$/g, '');
    }

    // Pull list of aliases
    var all = void 0;
    try {
      all = JSON.parse(vorpal.localStorage.getItem('aliases') || []);
    } catch (e) {
      all = [];
      vorpal.localStorage.removeItem('aliases');
    }

    if (options.p) {
      for (var i = 0; i < all.length; ++i) {
        var item = vorpal.localStorage.getItem('alias|' + all[i]);
        if (item !== undefined && item !== null) {
          this.log('alias ' + all[i] + '=\'' + item + '\'');
        }
      }
    } else {
      if (value) {
        vorpal.localStorage.setItem('alias|' + key, value);
        all = all.filter(function (val) {
          return val !== key;
        });
        all.push(key);
      } else {
        var _item = vorpal.localStorage.getItem('alias|' + key);
        if (_item !== undefined && _item !== null) {
          this.log('alias ' + key + '=\'' + _item + '\'');
        } else {
          this.log('-cash: alias: ' + key + ': not found');
        }
      }

      var aliases = {};
      for (var _i = 0; _i < all.length; ++_i) {
        var _item2 = vorpal.localStorage.getItem('alias|' + all[_i]);
        if (_item2 !== undefined && _item2 !== null) {
          aliases[all[_i]] = _item2;
        }
      }
      vorpal._aliases = aliases;
    }

    vorpal.localStorage.setItem('aliases', JSON.stringify(all));
    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return alias;
  }
  vorpal.api.alias = alias;
  vorpal.command('alias [name...]').parse(preparser).option('-p', 'print all defined aliases in a reusable format').action(function (args, callback) {
    args.options = args.options || {};
    args.options.vorpal = vorpal;
    return interfacer.call(this, {
      command: alias,
      args: args.name,
      options: args.options,
      callback: callback
    });
  });
};