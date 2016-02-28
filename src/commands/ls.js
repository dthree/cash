'use strict';

const chalk = require('chalk');
const filesize = require('filesize');
const fs = require('fs');
const fsAutocomplete = require('vorpal-autocomplete-fs');
const os = require('os');

const expand = require('./../util/expand');
const colorFile = require('./../util/colorFile');
const columnify = require('./../util/columnify');
const dateConverter = require('./../util/converter.date');
const fileFromPath = require('./../util/fileFromPath');
const interfacer = require('./../util/interfacer');
const preparser = require('./../preparser');
const pad = require('./../util/pad');
const lpad = require('./../util/lpad');
const permissionsConverter = require('./../util/converter.permissions');
const strip = require('./../util/stripAnsi');
const walkDir = require('./../util/walkDir');
const walkDirRecursive = require('./../util/walkDirRecursive');

const pads = {pad, lpad};

const ls = {

  /**
   * Main command execution.
   *
   * @param {Object} args
   * @return {Object} { status, stdout }
   * @api public
   */

  exec(paths, options) {
    const self = this;
    paths = (paths !== null && !Array.isArray(paths) && (typeof paths === 'object')) ? paths.paths : paths;
    paths = paths || ['.'];
    paths = (Array.isArray(paths)) ? paths : [paths];
    paths = expand(paths);
    options = options || {};
    try {
      let results = [];
      for (let i = 0; i < paths.length; ++i) {
        if (options.recursive) {
          const result = ls.execDirRecursive(paths[i], options);
          results = results.concat(result);
        } else {
          const result = ls.execDir(paths[i], options);
          results.push(result);
        }
      }
      const stdout = ls.formatAll(results, options);
      if (strip(stdout).trim() !== '') {
        self.log(String(stdout).replace(/\\/g, '/'));
      }
      return 0;
    } catch (e) {
      /* istanbul ignore next */
      return ls.error.call(self, e);
    }
  },

  /**
   * Returns ls stderr and response codes
   * for errors.
   *
   * @param {Error} e
   * @return {Object} { status, stdout }
   * @api private
   */

  error(e) {
    /* istanbul ignore next */
    let status;
    /* istanbul ignore next */
    let stdout;
    /* istanbul ignore next */
    if (e.code === 'ENOENT' && e.syscall === 'scandir') {
      status = 1;
      stdout = `ls: cannot access: No such file or directory`;
    } else {
      /* istanbul ignore next */
      status = 2;
      /* istanbul ignore next */
      stdout = e.stack;
    }
    /* istanbul ignore next */
    this.log(stdout);
    /* istanbul ignore next */
    return status;
  },

  /**
   * Recursively executes `execDir`.
   * For use with `ls -R`.
   *
   * @param {String} path
   * @param {Object} options
   * @return {String} results
   * @api private
   */

  execDirRecursive(path, options) {
    const self = this;
    const results = [];
    walkDirRecursive(path, pth => {
      const result = self.execDir(pth, options);
      results.push(result);
    });
    return results;
  },

  /**
   * Executes `ls` functionality
   * for a given directory.
   *
   * @param {String} path
   * @param {Object} options
   * @return {String} results
   * @api private
   */

  execDir(path, options) {
    const files = [];
    let rawFiles = [];
    let totalSize = 0;

    function pushFile(file, data) {
      rawFiles.push({
        file,
        data
      });
    }

    // Add in implied current and parent dirs.
    pushFile('.', fs.statSync('.'));
    pushFile('..', fs.statSync('..'));

    // Walk the passed in directory,
    // pushing the results into `rawFiles`.
    walkDir(path, pushFile);

    // Sort alphabetically be default,
    // unless -U is specified, in which case
    // we don't sort.
    if (!options.U) {
      rawFiles = rawFiles.sort(function (a, b) {
        // Sort by size.
        if (options.S) {
          // Hack for windows - a directory lising
          // in linux says the size is 4096, and Windows
          // it's 0, leading to inconsistent sorts based
          // on size, and failing tests.
          const win = (os.platform() === 'win32');
          a.data.size = (win && a.data.isDirectory() && a.data.size === 0) ? 4096 : a.data.size;
          b.data.size = (win && b.data.isDirectory() && b.data.size === 0) ? 4096 : b.data.size;
          return (a.data.size > b.data.size) ? -1 : (a.data.size < b.data.size) ? 1 : 0;
        }
        if (options.t) {
          // Sort by date modified.
          return ((a.data.mtime < b.data.mtime) ? 1 :
            (b.data.mtime < a.data.mtime) ? -1 :
            0);
        }
        // Sort alphabetically - default.
        const aFileName = fileFromPath(a.file)
          .trim()
          .toLowerCase()
          .replace(/\W/g, '');
        const bFileName = fileFromPath(b.file)
          .trim()
          .toLowerCase()
          .replace(/\W/g, '');
        return (aFileName > bFileName) ? 1 : (aFileName < bFileName) ? -1 : 0;
      });
    }

    // Reverse whatever sort the user specified.
    if (options.reverse) {
      rawFiles.reverse();
    }

    for (let i = 0; i < rawFiles.length; ++i) {
      const file = rawFiles[i].file;
      const data = rawFiles[i].data;
      const fileShort = fileFromPath(file);
      const dotted = (fileShort && fileShort.charAt(0) === '.');
      const implied = (fileShort === '..' || fileShort === '.');
      const type = (data.isDirectory()) ? 'd' : '-';
      const permissions = permissionsConverter.modeToRWX(data.mode);
      const hardLinks = data.nlink;
      const size = (options.humanreadable) ? filesize(data.size, {unix: true}) : data.size;
      const modified = dateConverter.unix(data.mtime);
      const owner = data.uid;
      const group = data.gid;
      const inode = data.ino;

      totalSize += data.size;

      let fileName = fileShort;

      // If --classify, add '/' to end of folders.
      fileName = (options.classify && data.isDirectory()) ?
        `${fileName}/` :
        fileName;

      // If getting --directory, give full path.
      fileName = (options.directory && file === '.') ? path : fileName;

      // Color the files based on $LS_COLORS
      fileName = (data.isFile()) ? colorFile(fileName) : fileName;

      // If not already colored and is executable,
      // make it green
      const colored = (strip(fileName) !== fileName);
      if (String(permissions).indexOf('x') > -1 && !colored && data.isFile()) {
        fileName = chalk.green(fileName);
      }

      // If --quote-name, wrap in double quotes;
      fileName = (options.quotename) ? `"${fileName}"` : fileName;

      // Make directories cyan.
      fileName = (data.isDirectory()) ? chalk.cyan(fileName) : fileName;

      const include = (() => {
        const directory = options.directory;
        const all = options.all;
        const almostAll = options.almostall;
        let result = false;
        if (directory && file !== '.') {
          result = false;
        } else if (!dotted) {
          result = true;
        } else if (all) {
          result = true;
        } else if (!implied && almostAll) {
          result = true;
        } else if (directory && file === '.') {
          result = true;
        }
        return result;
      })();

      const details = [type + permissions, hardLinks, owner, group, size, modified, fileName];

      if (options.inode) {
        details.unshift(inode);
      }

      const result =
        (options.l && !options.x) ? details :
        fileName;

      if (include) {
        files.push(result);
      }
    }

    let result;

    // If we have the detail view, draw out
    // all of the details of each file.
    // Otherwise, just throw the file names
    // into columns.
    if (Array.isArray(files[0])) {
      const longest = {};
      for (let i = 0; i < files.length; ++i) {
        for (let j = 0; j < files[i].length; ++j) {
          const len = String(files[i][j]).length;
          longest[j] = longest[j] || 0;
          longest[j] = (len > longest[j]) ? len : longest[j];
        }
      }

      const newFiles = [];
      for (let i = 0; i < files.length; ++i) {
        let glob = '';
        for (let j = 0; j < files[i].length; ++j) {
          const padFn = (j === files[i].length - 1) ? 'pad' : 'lpad';
          if (j === files[i].length - 1) {
            glob += String(files[i][j]);
          } else {
            glob += `${pads[padFn](String(files[i][j]), longest[j], ' ')} `;
          }
        }
        newFiles.push(String(glob));
      }
      result = newFiles.join('\n');
    } else if (options['1']) {
      result = files.join('\n');
    } else {
      const opt = {};
      if (options.width) {
        opt.width = options.width;
      }
      result = columnify(files, opt);
    }

    return ({
      path,
      size: (options.humanreadable) ? filesize(totalSize, {unix: true}) : totalSize,
      results: result
    });
  },

  /**
   * Concatenates the results of multiple
   * `execDir` functions into their proper
   * form based on options provided.
   *
   * @param {String} results
   * @param {Object} options
   * @return {String} stdout
   * @api private
   */

  formatAll(results, options) {
    let stdout = '';
    if (results.length > 1) {
      for (let i = 0; i < results.length; ++i) {
        stdout += `${results[i].path}:\n`;
        if (options.l) {
          stdout += `total ${results[i].size}\n`;
        }
        stdout += results[i].results;
        if (i !== results.length - 1) {
          stdout += '\n\n';
        }
      }
    } else if (results.length === 1) {
      if (options.l && !options.x) {
        stdout += `total ${results[0].size}\n`;
      }
      stdout += results[0].results;
    }
    return stdout;
  }
};

/**
 * Expose as a Vorpal extension.
 */

module.exports = function (vorpal) {
  if (vorpal === undefined) {
    return ls;
  }
  vorpal.api.ls = ls;
  vorpal
    .command('ls [paths...]')
    .parse(preparser)
    .option('-a, --all', 'do not ignore entries starting with .')
    .option('-A, --almost-all', 'do not list implied . and ..')
    .option('-d, --directory', 'list directory entries instead of contents, and do not dereference symbolic links')
    .option('-F, --classify', 'append indicator (one of */=>@|) to entries')
    .option('-h, --human-readable', 'with -l, print sizes in human readable format (e.g., 1K 234M 2G)')
    .option('-i, --inode', 'print the index number of each file')
    .option('-l', 'use a long listing format')
    .option('-Q, --quote-name', 'enclose entry names in double quotes')
    .option('-r, --reverse', 'reverse order while sorting')
    .option('-R, --recursive', 'list subdirectories recursively')
    .option('-S', 'sort by file size')
    .option('-t', 'sort by modification time, newest first')
    .option('-U', 'do not sort; list entries in directory order')
    .option('-w, --width [COLS]', 'assume screen width instead of current value')
    .option('-x', 'list entries by lines instead of columns')
    .option('-1', 'list one file per line')
    .autocomplete(fsAutocomplete())
    .action(function (args, cb) {
      return interfacer.call(this, {
        command: ls,
        args: args.paths,
        options: args.options,
        callback: cb
      });
    });
};
