export function setTimeOnDate(date, time) {
  let hours = time ? time.hours() : 0;
  let minutes = time ? time.minutes() : 0;
  let newDate = date.clone().startOf('day').hours(hours).minutes(minutes);
  return newDate;
}

export default setTimeOnDate;
