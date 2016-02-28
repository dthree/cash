'use strict';

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const unalias = {

  exec(args, options) {
    args = args;
    options = options || {};
    const vorpal = options.vorpal;

    if (!vorpal) {
      /* istanbul ignore next */
      throw new Error('Unalias is not programatically supported.');
    }

    vorpal._aliases = vorpal._aliases || [];

    if (typeof args === 'string' || args instanceof String) {
      args = String(args).split(' ');
      args = args.filter(str => {
        return String(str).trim() !== '';
      });
    }

    // Validate no input with help.
    if ((args === undefined || args.length < 1 || args === '') && !options.a) {
      this.log('unalias: usage: unalias [-a] name [name ...]');
      return 1;
    }

    // Pull list of aliases
    let all;
    try {
      all = JSON.parse(vorpal.localStorage.getItem('aliases') || []);
    } catch (e) {
      /* istanbul ignore next */
      all = [];
      /* istanbul ignore next */
      vorpal.localStorage.removeItem('aliases');
    }

    if (options.a) {
      args = all;
    }

    // Remove each alias in the list.
    for (let i = 0; i < args.length; ++i) {
      const key = args[i];
      const item = vorpal.localStorage.getItem(`alias|${key}`);
      if (item !== undefined && item !== null) {
        vorpal.localStorage.removeItem(`alias|${key}`);
      } else {
        this.log(`-cash: unalias: ${key}: not found`);
      }
      all = all.filter(str => {
        return !(str === key);
      });
    }

    // Rebuild alias lists.
    const aliases = {};
    /* istanbul ignore next */
    for (let i = 0; i < all.length; ++i) {
      const item = vorpal.localStorage.getItem(`alias|${all[i]}`);
      if (item !== undefined && item !== null) {
        aliases[all[i]] = item;
      }
    }
    vorpal._aliases = aliases;

    vorpal.localStorage.setItem('aliases', JSON.stringify(all));
    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return unalias;
  }
  vorpal.api.unalias = unalias;
  vorpal
    .command('unalias [name...]')
    .parse(preparser)
    .option('-a', 'remove all alias definitions')
    .action(function (args, callback) {
      args.options = args.options || {};
      args.options.vorpal = vorpal;
      return interfacer.call(this, {
        command: unalias,
        args: args.name,
        options: args.options,
        callback
      });
    });
};
