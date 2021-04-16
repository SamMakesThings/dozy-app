import { SleepLog } from '../types/custom';

export function getLogStreakLength(sleepLogs: SleepLog[]) {
  let streakLength = 0;

  // Helper function. Return true if date2 is the day before date1 (or same day)
  function isPreviousDay(date1: Date, date2: Date) {
    const [date1day, date1month, date2day, date2month] = [
      date1.getDate(),
      date1.getMonth(),
      date2.getDate(),
      date2.getMonth()
    ];
    return (
      (Math.abs(date1day - date2day) <= 1 && // True if same month and day is 1 or 0 away
        Math.abs(date1month - date2month) === 0) ||
      (date1month !== date2month && // OR true if different month and date1's day is 1
        date1day === 1)
    );
  }

  // Calculate the current diary streak length
  while (true) {
    // Check that most recent log is yesterday or today. If not, break here at streak 0
    if (
      !sleepLogs.length ||
      !isPreviousDay(new Date(), sleepLogs[0].upTime.toDate())
    ) {
      break;
    }

    // Increment streak to start, since zero indexed
    streakLength++;

    // Check if current log day is the day after previous log day. If not, break
    if (
      sleepLogs.length === 1 ||
      !isPreviousDay(
        sleepLogs[streakLength].upTime.toDate(),
        sleepLogs[streakLength + 1].upTime.toDate()
      )
    ) {
      break;
    }
  }

  return streakLength;
}
