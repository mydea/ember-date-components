import Ember from 'ember';
import parseTime from './parse-time';

const {
  isNone
} = Ember;

/**
 * Build a time range.
 * This will return an array of moment.js objects with corresponding times set.
 * minTime/maxTime will be used to define the boundaries of the range.
 * They can either be parseable strings, or moment.js objects.
 * Steps should be the number of minutes between the different steps, e.g. 30 or 60.
 *
 * @namespace EmberDateComponents.Utils
 * @method buildTimeRange
 * @param {String|Object} minTime The time where the range should begin. Defaults to '00:00'
 * @param {String|Object} maxTime The time where the range should end. Defaults to '23:59'
 * @param {Number} step The number of minutes between the steps. Defaults to 30.
 * @return {Object[]} An array of moment.js objects
 * @public
 */
export function buildTimeRange({ minTime, maxTime, step }) {
  let min = !isNone(minTime) ? minTime : '00:00';
  let max = !isNone(maxTime) ? maxTime : '23:59';
  step = !isNone(step) ? step : 30;

  min = parseTime(min);
  max = parseTime(max);

  let lastValue = min;
  let steps = [];

  while (lastValue.date() === max.date() && (lastValue.hours() < max.hours() || (lastValue.hours() === max.hours() && lastValue.minutes() <= max.minutes()))) {
    steps.push(lastValue);
    let newTime = lastValue.clone().add(step, 'minutes');
    lastValue = newTime;
  }

  return steps;
}

export default buildTimeRange;
