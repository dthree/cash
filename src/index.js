'use strict';

const os = require('os');
const Vorpal = require('vorpal');

const commands = require('./../commands.json');
const help = require('./help');
const interfacer = require('./util/interfacer');

let cmds;

const app = {

  commands: commands.commands,

  importedCommands: commands.importedCommands,

  vorpal: new Vorpal(),

  _cwd: process.cwd(),

  _fatal: false,

  export(str, cbk) {
    // Is this a tagged template literal?
    const tmpl = Array.isArray(str) && Array.isArray(str.raw);
    cbk = tmpl && cbk || function () {};
    const options = {
      fatal: app._fatal || false
    };
    // Hook stdin, execute the command and
    // then return it all.
    const intercept = require('./util/intercept');
    let out = '';
    const unhook = intercept(function (str) {
      out += `${str}\n`;
      return '';
    });
    let commands;
    if (tmpl) {
      // Render into a single string, inserting interpolated values.
      const interpVals = [...arguments].slice(1);
      let interpStr = str[0];
      for (let i = 0, l = interpVals.length; i < l; i++) {
        interpStr += `${interpVals[i]}${str[i + 1]}`;
      }
      // Split into lines.  Remove blank lines and comments (start with #)
      commands = interpStr.split(/\r\n|\r|\n/).filter(command => {
        return !(/^\s*(?:#|$)/.test(command));
      });
    } else {
      commands = [str];
    }
    commands.forEach(command => {
      app.vorpal.execSync(command, options);
    });
    unhook();
    return String(out).replace(/\n$/, '');
  },

  load() {
    const self = this;
    self.vorpal.api = {};
    this.commands.forEach(function (cmd) {
      if (self.importedCommands.indexOf(cmd) > -1) {
        return;
      }
      try {
        const mod = require(`./commands/${cmd}.js`);
        let help;
        try {
          help = require(`./help/${cmd}.js`);
          help = String(help).replace(/^\n|\n$/g, '');
        } catch (e) {
          // .. whatever
        }
        self.vorpal.use(mod, {
          parent: self
        });
        const cmdObj = self.vorpal.find(cmd);
        if (cmdObj && help) {
          /* istanbul ignore next */
          cmdObj.help(function (args, cb) {
            cb(help);
          });
        }
      } catch (e) {
        /* istanbul ignore next */
        self.vorpal.log(`Error loading command ${cmd}: `, e);
      }
    });
    this.importedCommands.forEach(function (cmd) {
      try {
        const mod = require(`vorpal-${cmd}`);
        self.vorpal.use(mod, {
          parent: self
        });
      } catch (e) {
        /* istanbul ignore next */
        self.vorpal.log(`Error loading command ${cmd}: `, e);
      }
    });

    // If we're running Windows, register
    // process spawning for Windows child processes.
    // If on Linux, just does registers the .catch command.
    const windows = require('./windows');
    windows.registerCommands(self);

    for (const cmd in app.vorpal.api) {
      if (app.vorpal.api.hasOwnProperty(cmd)) {
        app.export[cmd] = function (args, options, callback) {
          callback = callback || function () {};
          options = options || {};
          options.vorpal = app.vorpal;
          return interfacer.call(this, {
            command: app.vorpal.api[cmd],
            args,
            options,
            callback,
            async: app.vorpal.api[cmd].async || false,
            silent: true
          });
        };
      }
    }

    app.vorpal
      .history('cash')
      .localStorage('cash')
      .help(help);

    app.vorpal
      .find('exit')
      .action(function () {
        /* istanbul ignore next */
        process.exit(1);
      });

    // Load aliases
    let all;
    try {
      all = JSON.parse(app.vorpal.localStorage.getItem('aliases') || []);
    } catch (e) {
      /* istanbul ignore next */
      all = [];
      /* istanbul ignore next */
      app.vorpal.localStorage.removeItem('aliases');
    }
    const aliases = {};
    /* istanbul ignore next */
    for (let i = 0; i < all.length; ++i) {
      const item = app.vorpal.localStorage.getItem(`alias|${all[i]}`);
      if (item !== undefined && item !== null) {
        aliases[all[i]] = item;
      }
    }
    app.vorpal._aliases = aliases;

    // Override SIGINT to be ignored,
    // and if the user is insistent, give
    // a helpful message. The purpose of this
    // is to give a full shell feel, not an
    // application running over the shell.
    // Skip this on linux, as its mainly
    // for dev testing.
    /* istanbul ignore next */
    if (os.platform().indexOf('win') > -1) {
      let counter = 0;
      setInterval(function () {
        counter = (counter > 0) ? 0 : counter;
      }, 3000);
      app.vorpal.sigint(function () {
        counter++;
        app.vorpal.ui.submit('');
        if (counter > 5) {
          app.vorpal.log('(to quit Cash, use the "exit" command)');
          counter -= 10000;
        }
        return;
      });
    }

    app.export.vorpal = app.vorpal;
    Object.assign(app.export, cmds);
    return this;
  }
};

cmds = {
  /* istanbul ignore next */
  show() {
    /* istanbul ignore next */
    app.vorpal.show();
  }
};

app.load();

module.exports = app.export;
