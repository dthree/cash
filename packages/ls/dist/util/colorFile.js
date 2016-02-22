'use strict';

var strip = require('./stripAnsi');

var chalk = {};
var map = { cyan: 36, red: 31, magenta: 35 };
Object.keys(map).forEach(function (key, value) {
  chalk[key] = function (str) {
    return '\u001b[' + value + 'm' + str + '\u001b[39m';
  };
});

/**
 * Wraps file strings in ANSI colors
 * based on their extension.
 *
 * @param {file} str
 * @return {String}
 * @api public
 */

module.exports = function (file) {
  var audio = ['aac', 'au', 'flac', 'mid', 'midi', 'mka', 'mp3', 'mpc', 'ogg', 'ra', 'wav', 'axa', 'oga', 'spx', 'xspf'];
  var archive = ['tar', 'tgz', 'arj', 'taz', 'lzh', 'lzma', 'tlz', 'txz', 'zip', 'z', 'Z', 'dz', 'gz', 'lz', 'xz', 'bz2', 'bz', 'tbz', 'tbz2', 'tz', 'deb', 'rpm', 'jar', 'rar', 'ace', 'zoo', 'cpio', '7z', 'rz'];
  var images = ['jpg', 'jpeg', 'gif', 'bmp', 'pbm', 'pgm', 'ppm', 'tga', 'xbm', 'xpm', 'tif', 'tiff', 'png', 'svg', 'svgz', 'mng', 'pcx', 'mov', 'mpg', 'mpeg', 'm2v', 'mkv', 'ogm', 'mp4', 'm4v', 'mp4v', 'vob', 'qt', 'nuv', 'wmv', 'asf', 'rm', 'rmvb', 'flc', 'avi', 'fli', 'flv', 'gl', 'dl', 'xcf', 'xwd', 'yuv', 'cgm', 'emf', 'axv', 'anx', 'ogv', 'ogx'];

  var extension = String(file).toLowerCase().trim().split('.');
  extension = extension[extension.length - 1];

  var colored = strip(file);
  colored = audio.indexOf(extension) > -1 ? chalk.cyan(file) : archive.indexOf(extension) > -1 ? chalk.red(file) : images.indexOf(extension) > -1 ? chalk.magenta(file) : colored;

  return colored;
};