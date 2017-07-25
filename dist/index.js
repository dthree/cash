'use strict';

var os = require('os');
var Vorpal = require('vorpal');

var commands = require('./../commands.json');
var help = require('./help');
var interfacer = require('./util/interfacer');
var delimiter = require('./delimiter.js');
var path = require('path');
var fs = require('fs');
var minimist = require('minimist');

var cmds = void 0;

var app = {

  commands: commands.commands,

  importedCommands: commands.importedCommands,

  vorpal: new Vorpal(),

  _cwd: process.cwd(),

  _fatal: false,

  export: function _export(str, cbk) {
    // Is this a tagged template literal?
    var tmpl = Array.isArray(str) && Array.isArray(str.raw);
    cbk = tmpl && cbk || function () {};
    var options = {
      fatal: app._fatal || false
    };
    // Hook stdin, execute the command and
    // then return it all.
    var intercept = require('./util/intercept');
    var out = '';
    var unhook = intercept(function (str) {
      out += str + '\n';
      return '';
    });
    var commands = void 0;
    if (tmpl) {
      // Render into a single string, inserting interpolated values.
      var interpVals = [].concat(Array.prototype.slice.call(arguments)).slice(1);
      var interpStr = str[0];
      for (var i = 0, l = interpVals.length; i < l; i++) {
        /* istanbul ignore next */
        interpStr += '' + interpVals[i] + str[i + 1];
      }
      // Split into lines.  Remove blank lines and comments (start with #)
      commands = interpStr.split(/\r\n|\r|\n/).filter(function (command) {
        return !/^\s*(?:#|$)/.test(command);
      });
    } else {
      commands = [str];
    }
    commands.forEach(function (command) {
      app.vorpal.execSync(command, options);
    });
    unhook();
    return String(out).replace(/\n$/, '');
  },
  load: function load() {
    var self = this;
    self.vorpal.api = {};
    this.commands.forEach(function (cmd) {
      if (self.importedCommands.indexOf(cmd) > -1) {
        return;
      }
      try {
        (function () {
          var mod = require('./commands/' + cmd + '.js');
          var help = void 0;
          try {
            help = require('./help/' + cmd + '.js');
            help = String(help).replace(/^\n|\n$/g, '');
          } catch (e) {
            // .. whatever
          }
          self.vorpal.use(mod, {
            parent: self
          });
          var cmdObj = self.vorpal.find(cmd);
          if (cmdObj && help) {
            /* istanbul ignore next */
            cmdObj.help(function (args, cb) {
              cb(help);
            });
          }
        })();
      } catch (e) {
        /* istanbul ignore next */
        self.vorpal.log('Error loading command ' + cmd + ': ', e);
      }
    });
    this.importedCommands.forEach(function (cmd) {
      try {
        var mod = require('vorpal-' + cmd);
        self.vorpal.use(mod, {
          parent: self
        });
      } catch (e) {
        /* istanbul ignore next */
        self.vorpal.log('Error loading command ' + cmd + ': ', e);
      }
    });

    // If we're running Windows, register
    // process spawning for Windows child processes.
    // If on Linux, just does registers the .catch command.
    var windows = require('./windows');
    windows.registerCommands(self);

    var _loop = function _loop(cmd) {
      if (app.vorpal.api.hasOwnProperty(cmd)) {
        app.export[cmd] = function (args, options, callback) {
          callback = callback || function () {};
          options = options || {};
          options.vorpal = app.vorpal;
          return interfacer.call(this, {
            command: app.vorpal.api[cmd],
            args: args,
            options: options,
            callback: callback,
            async: app.vorpal.api[cmd].async || false,
            silent: true
          });
        };
      }
    };

    for (var cmd in app.vorpal.api) {
      _loop(cmd);
    }

    self.vorpal.localEnv = Object.create(process.env);
    var argv = minimist(process.argv.slice(2));

    /* istanbul ignore next */
    if (typeof argv.c !== 'undefined' && typeof argv.c !== 'string') {
      console.error('cash: -c: option requires an argument');
      process.exit(2);
    } else if (typeof argv.c === 'string' || argv._.length > 0) {
      for (var k = 0; k < argv._.length; k++) {
        self.vorpal.localEnv.k = argv._[k];
      }
      // If -c is used, use that string, otherwise use the script-name instead
      var script = argv.c || 'source ' + argv._[0];
      app.vorpal.execSync(script);
      process.exit(0);
    }

    // Otherwise, start an interactive shell
    self.vorpal.localEnv[0] = 'cash';

    app.vorpal.history('cash').localStorage('cash').help(help);

    app.vorpal.find('exit').action(function () {
      /* istanbul ignore next */
      process.exit();
    });

    // Load aliases
    var all = void 0;
    try {
      all = JSON.parse(app.vorpal.localStorage.getItem('aliases') || []);
    } catch (e) {
      /* istanbul ignore next */
      all = [];
      /* istanbul ignore next */
      app.vorpal.localStorage.removeItem('aliases');
    }
    var aliases = {};
    /* istanbul ignore next */
    for (var i = 0; i < all.length; ++i) {
      var item = app.vorpal.localStorage.getItem('alias|' + all[i]);
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
      (function () {
        var counter = 0;
        setInterval(function () {
          counter = counter > 0 ? 0 : counter;
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
      })();
    }

    // Load .cashrc upon startup
    var locations = ['.cashrc'];
    if (process.platform === 'win32') {
      /* istanbul ignore next */
      locations.push('_cashrc');
    }
    locations = locations.map(function (str) {
      return path.join(delimiter.getHomeDir(), str);
    });

    for (var _i = 0; _i < locations.length; ++_i) {
      try {
        /* istanbul ignore if */
        if (!fs.statSync(locations[_i]).isDirectory()) {
          app.vorpal.execSync('source ' + locations[_i]);
          break;
        }
      } catch (e) {
        // File doesn't exist, so just don't load defaults
      }
    }

    app.export.vorpal = app.vorpal;
    Object.assign(app.export, cmds);
    return this;
  }
};

cmds = {
  /* istanbul ignore next */

  show: function show() {
    /* istanbul ignore next */
    app.vorpal.show();
  }
};

app.load();

module.exports = app.export;