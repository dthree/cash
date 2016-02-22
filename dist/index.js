'use strict';

var _ = require('lodash');
var os = require('os');
var Vorpal = require('vorpal');

var commands = require('./../commands.json');
var help = require('./help');
var interfacer = require('./util/interfacer');

var cmds = undefined;

var app = {

  commands: commands.commands,

  importedCommands: commands.importedCommands,

  vorpal: new Vorpal(),

  _cwd: process.cwd(),

  _fatal: false,

  export: function _export(str, cbk) {
    cbk = cbk || function () {};
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
    app.vorpal.execSync(str, options);
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
          var help = undefined;
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

    app.vorpal.history('cash').localStorage('cash').help(help);

    app.vorpal.find('exit').action(function () {
      /* istanbul ignore next */
      process.exit(1);
    });

    // Load aliases
    var all = undefined;
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

    app.export.vorpal = app.vorpal;
    _.extend(app.export, cmds);
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