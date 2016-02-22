'use strict';

/**
 * Date conversion utilities
 */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad(num, padding) {
  padding = padding || '0';
  num = parseFloat(num);
  if (num < 10) {
    return `${padding}${num}`;
  }
  return num;
}

module.exports = {

  unix(dt) {
    let date = dt;
    let day = pad(date.getDate(), ' ');
    const month = months[date.getMonth()];
    const hour = pad(date.getHours());
    const min = pad(date.getMinutes());
    const hourMin = `${hour}:${min}`;
    day = (day.length === 1) ? (` ${day}`) : day;
    date = `${month} ${day} ${hourMin}`;
    return date;
  }
};
