'use strict';

var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');
var path = require('path');
var os = require('os');

var expand = require('./../util/expand');
var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');

var cp = {
  exec: function exec(args, options) {
    var self = this;
    options = options || {};

    args = args === undefined ? [] : args;
    args = Array.isArray(args) ? args : args.split(' ');
    args = args.filter(function (arg) {
      return String(arg).trim() !== '';
    });

    options.noclobber = options.force === true ? false : options.noclobber;
    options.recursive = options.R === true ? true : options.recursive;

    if (args.length < 1) {
      this.log('cp: missing file operand\nTry \'cp --help\' for more information.');
      return 1;
    }

    if (args.length === 1) {
      this.log('cp: missing destination file operand after ' + args[0] + '\nTry \'cp --help\' for more information.');
      return 1;
    }

    args = expand(args);

    var dest = args.pop();
    var sources = args;

    var exists = fs.existsSync(dest);
    var stats = exists && fs.statSync(dest);

    // Dest is not existing dir, but multiple sources given
    if ((!exists || !stats.isDirectory()) && sources.length > 1) {
      this.log('cp: target ' + dest + ' is not a directory');
      return 1;
    }

    // Dest is an existing file, but no -f given
    if (exists && stats.isFile() && options.noclobber) {
      // just dont do anything
      return 0;
    }

    if (options.recursive) {
      sources.forEach(function (src, i) {
        if (src[src.length - 1] === '/') {
          sources[i] += '*';
        } else if (fs.statSync(src).isDirectory() && !exists) {
          sources[i] += '/*';
        }
      });
      try {
        fs.mkdirSync(dest, parseInt('0777', 8));
      } catch (e) {
        // like Unix's cp, keep going even if we can't create dest dir
      }
    }

    sources = expand(sources);

    sources.forEach(function (src) {
      if (!fs.existsSync(src)) {
        self.log('cp: cannot stat ' + src + ': No such file or directory');
        return;
      }

      if (fs.statSync(src).isDirectory()) {
        if (!options.recursive) {
          self.log('cp: omitting directory ' + src);
        } else {
          // 'cp /a/source dest' should create 'source' in 'dest'
          var newDest = path.join(dest, path.basename(src));
          var checkDir = fs.statSync(src);
          try {
            fs.mkdirSync(newDest, checkDir.mode);
          } catch (e) {
            /* istanbul ignore if */
            if (e.code !== 'EEXIST') {
              throw new Error();
            }
          }
          cpdirSyncRecursive.call(self, src, newDest, options);
        }
        return;
      }

      // If here, src is a file
      // When copying to '/path/dir', iDest = '/path/dir/file1'
      var iDest = dest;
      if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) {
        iDest = path.normalize(dest + '/' + path.basename(src));
      }

      if (fs.existsSync(iDest) && options.no_force) {
        return;
      }

      copyFileSync.call(self, src, iDest);
    });
  }
};

function cpdirSyncRecursive(sourceDir, destDir, options) {
  var self = this;
  /* istanbul ignore if */
  if (!options) {
    options = {};
  }
  var checkDir = fs.statSync(sourceDir);
  try {
    fs.mkdirSync(destDir, checkDir.mode);
  } catch (e) {
    /* istanbul ignore if */
    if (e.code !== 'EEXIST') {
      throw e;
    }
  }
  var files = fs.readdirSync(sourceDir);
  for (var i = 0; i < files.length; i++) {
    var srcFile = sourceDir + '/' + files[i];
    var destFile = destDir + '/' + files[i];
    var srcFileStat = fs.lstatSync(srcFile);
    if (srcFileStat.isDirectory()) {
      // recursion this thing right on back.
      cpdirSyncRecursive.call(self, srcFile, destFile, options);
    } else if (srcFileStat.isSymbolicLink()) {
      var symlinkFull = fs.readlinkSync(srcFile);
      fs.symlinkSync(symlinkFull, destFile, os.platform() === 'win32' ? 'junction' : null);
      // At this point, we've hit a file actually worth copying... so copy it on over.
    } else if (fs.existsSync(destFile) && options.noclobber) {
        // be silent
      } else {
          copyFileSync.call(self, srcFile, destFile);
        }
  }
}

function copyFileSync(src, dest) {
  /* istanbul ignore if */
  if (!fs.existsSync(src)) {
    this.log('cp: cannot stat ' + src + ': No such file or directory');
    return;
  }

  var BUF_LENGTH = 64 * 1024;
  var buf = new Buffer(BUF_LENGTH);
  var bytesRead = BUF_LENGTH;
  var pos = 0;
  var fdr = null;
  var fdw = null;

  try {
    fdr = fs.openSync(src, 'r');
  } catch (e) {
    /* istanbul ignore next */
    this.log('cp: cannot open ' + src + ': ' + e.code);
    /* istanbul ignore next */
    return;
  }

  try {
    fdw = fs.openSync(dest, 'w');
  } catch (e) {
    /* istanbul ignore next */
    this.log('cp: cannot write to destination file ' + dest + ': ' + e.code);
    /* istanbul ignore next */
    return;
  }

  while (bytesRead === BUF_LENGTH) {
    bytesRead = fs.readSync(fdr, buf, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, buf, 0, bytesRead);
    pos += bytesRead;
  }

  fs.closeSync(fdr);
  fs.closeSync(fdw);
  fs.chmodSync(dest, fs.statSync(src).mode);
}

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return cp;
  }
  vorpal.api.cp = cp;
  vorpal.command('cp [args...]').parse(preparser).option('-f, --force', 'do not prompt before overwriting').option('-n, --no-clobber', 'do not overwrite an existing file').option('-r, --recursive', 'copy directories recursively').option('-R', 'copy directories recursively').autocomplete(fsAutocomplete()).action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: cp,
      args: args.args,
      options: args.options,
      callback: callback
    });
  });
};