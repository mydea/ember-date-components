export function compareTimes(time1, time2, accuracy = 'minute') {
  let adjustedTime2 = time2
    .clone()
    .year(time1.year())
    .month(time1.month())
    .date(time1.date());

  return time1.isSame(adjustedTime2, accuracy);
}
