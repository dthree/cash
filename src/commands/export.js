'use strict';

const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');

const _export = {

  exec(args, options) {
    args = args || [];
    options = options || {};

    if (args.length < 1) {
      options.p = true;
    }

    if (typeof args === 'string' || args instanceof String) {
      args = [args];
    }

    // Parse similarly to how `alias` does
    let id = args.join(' ');
    let value = '';
    if (String(id).indexOf('=') > -1) {
      const parts = String(id).trim().split('=');
      id = parts[0];
      value = parts[1] || value;
      if (value.match(/^".*"$/)) {
        value = JSON.parse(value);
      } else {
        const regMatch = value.match(/^'(.*)'$/);
        if (regMatch && regMatch[1]) {
          value = regMatch[1];
        }
      }
    } else {
      const parts = String(id).trim().split(' ');
      id = parts.shift();
      value = parts.join(' ') || null;
    }

    const validIdRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (options.p) {
      for (const name in process.env) {
        if (process.env.hasOwnProperty(name)) {
          this.log(`declare -x ${String(name)}=${JSON.stringify(process.env[name])
            .replace(/\$/g, '\\$')}`);
        }
      }
    } else if (id.match(validIdRegex)) {
      process.env[id] = value !== null ? value : process.env[id];
    } else {
      this.log(`-cash: export: \`${id}': not a valid identifier`);
      return 1;
    }

    return 0;
  }
};

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return _export;
  }
  vorpal.api.export = _export;
  vorpal
    .command('export [name...]')
    .parse(preparser)
    .option('-p', 'print all defined aliases in a reusable format')
    .action(function (args, callback) {
      args.options = args.options || {};
      return interfacer.call(this, {
        command: _export,
        args: args.name,
        options: args.options,
        callback
      });
    });
};
