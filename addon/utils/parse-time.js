import moment from 'moment';

/**
 * Parse a time from a string.
 *
 * This will parse a string and return a moment.js object.
 * Value can also be a moment.js object.
 *
 * It can detect the following input formats:
 *
 * 7
 * 14
 * 7,5
 * 7.5
 * 14,15
 * 14.15
 * 7:30
 * 14:30
 * 7am
 * 7pm
 * 12am
 * 12pm
 * 7:30
 * 07:30
 * 14:2
 * 12:40 am
 * 08:10 pm
 *
 * It will max out at 23:59.
 *
 * @namespace EmberDateComponents.Utils
 * @method parseTime
 * @param {String|Object} value
 * @return {Object}
 * @public
 */
export function parseTime(value) {
  if (!value) {
    return null;
  }

  // Moment.js objects are handled directly.
  if (typeof value === 'object' && typeof value.format === 'function') {
    return value;
  }

  // Always convert to a string for parsing
  value = `${value}`;

  // Try to be smart and detect the used format
  let usesAmPm = value.indexOf('am') > -1 || value.indexOf('pm') > -1;
  let hourIsTwoDigit = /^\d\d$/.test(value.substr(0, 2));
  let minuteSeparator = ':';
  if (value.indexOf(',') > -1) {
    minuteSeparator = ',';
  }
  if (value.indexOf('.') > -1) {
    minuteSeparator = '.';
  }
  let usesMinutes = value.indexOf(minuteSeparator) > -1;

  let hours = 0;
  let minutes = 0;
  let amPm = null;

  // Hours
  if (hourIsTwoDigit) {
    hours = value.substr(0, 2) * 1;
  } else {
    hours = (value[0] || 0) * 1;
  }

  // Minutes
  if (usesMinutes) {
    let minutePosition = value.indexOf(minuteSeparator) + 1;
    let tmp = value.substr(minutePosition, 2);
    let minuteIsTwoDigit = /^\d\d$/.test(tmp);

    if (minuteIsTwoDigit) {
      minutes = tmp * 1;
    } else {
      minutes = (value[minutePosition] || 0) * 1;
    }

    // Convert e.g. 7,5 --> 7:30
    if (minuteSeparator !== ':') {
      minutes = minutes * 60 * (minuteIsTwoDigit ? 0.01 : 0.1);
    }
  }

  // am/pm ?
  if (usesAmPm) {
    amPm = value.indexOf('am') > -1 ? 'am' : 'pm';
    if (amPm === 'am' && hours === 12) {
      hours = 0;
    } else if (amPm === 'pm' && hours === 12) {
      hours = 12;
    } else if (amPm === 'pm') {
      hours += 12;
    }

  }

  // Minutes cannot be greater than 59
  if (minutes > 59) {
    minutes = 59;
  }

  // Hours cannot be greater than 23
  if (hours > 23) {
    hours = 23;
    minutes = 59;
  }

  return moment(0).hour(hours).minutes(minutes).seconds(0).milliseconds(0);
}

export default parseTime;
