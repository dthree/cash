'use strict';

var fs = require('fs');
var fsAutocomplete = require('vorpal-autocomplete-fs');

var expand = require('./../util/expand');
var interfacer = require('./../util/interfacer');
var preparser = require('./../preparser');
var unlinkSync = require('./../util/unlinkSync');

var rm = {
  exec: function exec(args, options) {
    var self = this;
    options = options || {};
    options.recursive = options.R ? options.R : options.recursive;

    var files = args;
    files = files === undefined ? [] : files;
    files = typeof files === 'string' ? [files] : files;

    files = expand(files);

    files.forEach(function (file) {
      if (!fs.existsSync(file)) {
        // Path does not exist, no force flag given
        if (!options.force) {
          self.log('rm: cannot remove ' + file + ': No such file or directory');
          return 2;
        }
        /* istanbul ignore next */
        return 0;
      }

      var stats = fs.lstatSync(file);
      if (stats.isFile() || stats.isSymbolicLink()) {
        if (options.force) {
          unlinkSync(file);
          return 0;
        }

        if (isWriteable(file)) {
          unlinkSync(file);
        } else {
          /* istanbul ignore next */
          self.log('rm: cannot remove ' + file + ': permission denied');
          /* istanbul ignore next */
          return 2;
        }
        return 0;
      }

      // Path is an existing directory, but no -r flag given
      if (stats.isDirectory() && !options.recursive) {
        self.log('rm: cannot remove: path is a directory');
        return 2;
      }

      // Recursively remove existing directory
      if (stats.isDirectory() && options.recursive) {
        rmdirSyncRecursive.call(self, file, options.force, options.dir);
      }
    });
  }
};

function rmdirSyncRecursive(dir, force, removeEmptyDir) {
  var self = this;
  var files = undefined;
  files = fs.readdirSync(dir);

  // Loop through and delete everything in the sub-tree after checking it
  for (var i = 0; i < files.length; i++) {
    var file = dir + '/' + files[i];
    var currFile = fs.lstatSync(file);

    if (currFile.isDirectory()) {
      // Recursive function back to the beginning
      rmdirSyncRecursive(file, force, removeEmptyDir);
    } else if (currFile.isSymbolicLink()) {
      // Unlink symlinks
      /* istanbul ignore next */
      if (force || isWriteable(file)) {
        try {
          unlinkSync(file);
        } catch (e) {
          self.log('rm: cannot remove ' + file + ': code ' + e.code);
          return 2;
        }
      }
    } else if (force || isWriteable(file)) {
      // Assume it's a file.
      try {
        unlinkSync(file);
      } catch (e) {
        /* istanbul ignore next */
        self.log('rm: cannot remove ' + file + ': code ' + e.code);
        /* istanbul ignore next */
        return 2;
      }
    }
  }

  // Now that we know everything in the sub-tree has been deleted,
  // we can delete the main directory.
  var result = undefined;
  try {
    // Retry on windows, sometimes it takes a little time before all the files in the directory are gone
    var start = Date.now();
    while (true) {
      try {
        result = fs.rmdirSync(dir);
        /* istanbul ignore next */
        if (fs.existsSync(dir)) {
          throw new Error('EAGAIN');
        }
        break;
      } catch (er) {
        // In addition to error codes, also check if the directory still exists and loop again if true
        /* istanbul ignore next */
        if (process.platform === 'win32' && (er.code === 'ENOTEMPTY' || er.code === 'EBUSY' || er.code === 'EPERM' || er.code === 'EAGAIN')) {
          if (Date.now() - start > 1000) {
            throw er;
          }
          /* istanbul ignore next */
        } else if (er.code === 'ENOENT') {
            // Directory did not exist, deletion was successful
            break;
            /* istanbul ignore next */
          } else {
              throw er;
            }
      }
    }
  } catch (e) {
    /* istanbul ignore next */
    self.log('rm: cannot remove directory ' + dir + ': code ' + e.code);
    /* istanbul ignore next */
    return 2;
  }
  return result;
}

// Hack to determine if file has write permissions for current user
// Avoids having to check user, group, etc, but it's probably slow.
function isWriteable(file) {
  var writePermission = true;
  try {
    var __fd = fs.openSync(file, 'a');
    fs.closeSync(__fd);
  } catch (e) {
    /* istanbul ignore next */
    writePermission = false;
  }

  return writePermission;
}

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return rm;
  }
  vorpal.api.rm = rm;
  vorpal.command('rm [files...]').parse(preparser).option('-f, --force', 'ignore nonexistent files and arguments, never prompt').option('-r, --recursive', 'remove directories and their contents recursively').option('-R', 'remove directories and their contents recursively').autocomplete(fsAutocomplete()).action(function (args, callback) {
    args.options = args.options || {};
    return interfacer.call(this, {
      command: rm,
      args: args.files,
      options: args.options,
      callback: callback
    });
  });
};