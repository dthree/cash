'use strict';

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const alias = {

  exec(args, options) {
    args = args || [];
    options = options || {};
    const vorpal = options.vorpal;

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
    let key = args.join(' ');
    let value;
    if (String(key).indexOf('=') > -1) {
      const parts = String(key).trim().split('=');
      key = parts[0];
      value = parts[1] || value;
    } else {
      const parts = String(key).trim().split(' ');
      key = parts.shift();
      value = parts.join(' ');
    }

    // Remove wrapped quotes from value.
    if (value !== undefined) {
      value = String(value).replace(/^[\"|\']|[\"|\']$/g, '');
    }

    // Pull list of aliases
    let all;
    try {
      all = JSON.parse(vorpal.localStorage.getItem('aliases') || []);
    } catch (e) {
      all = [];
      vorpal.localStorage.removeItem('aliases');
    }

    if (options.p) {
      for (let i = 0; i < all.length; ++i) {
        const item = vorpal.localStorage.getItem(`alias|${all[i]}`);
        if (item !== undefined && item !== null) {
          this.log(`alias ${all[i]}='${item}'`);
        }
      }
    } else {
      if (value) {
        vorpal.localStorage.setItem(`alias|${key}`, value);
        all = all.filter(function (val) {
          return val !== key;
        });
        all.push(key);
      } else {
        const item = vorpal.localStorage.getItem(`alias|${key}`);
        if (item !== undefined && item !== null) {
          this.log(`alias ${key}='${item}'`);
        } else {
          this.log(`-cash: alias: ${key}: not found`);
        }
      }

      const aliases = {};
      for (let i = 0; i < all.length; ++i) {
        const item = vorpal.localStorage.getItem(`alias|${all[i]}`);
        if (item !== undefined && item !== null) {
          aliases[all[i]] = item;
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
  vorpal
    .command('alias [name...]')
    .parse(preparser)
    .option('-p', 'print all defined aliases in a reusable format')
    .action(function (args, callback) {
      args.options = args.options || {};
      args.options.vorpal = vorpal;
      return interfacer.call(this, {
        command: alias,
        args: args.name,
        options: args.options,
        callback
      });
    });
};
