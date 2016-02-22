'use strict';

/**
 * Date conversion utilities
 */

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad(num, padding) {
  padding = padding || '0';
  num = parseFloat(num);
  if (num < 10) {
    return '' + padding + num;
  }
  return num;
}

module.exports = {
  unix: function unix(dt) {
    var date = dt;
    var day = pad(date.getDate(), ' ');
    var month = months[date.getMonth()];
    var hour = pad(date.getHours());
    var min = pad(date.getMinutes());
    var hourMin = hour + ':' + min;
    day = day.length === 1 ? ' ' + day : day;
    date = month + ' ' + day + ' ' + hourMin;
    return date;
  }
};