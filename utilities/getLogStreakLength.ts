import moment from 'moment';
import { SleepLog } from '../types/custom';

// Helper function. Return true if date2 is the day before date1 (or same day)
export function isPreviousDay(date: Date, previousDay: Date) {
  return moment(date).subtract(1, 'days').isSame(previousDay, 'date');
}
const isMoreYesterday = (date: Date) => {
  const yesterday = moment(new Date()).subtract(2, 'days');
  return moment(date).isBefore(yesterday);
};

export function getLogStreakLength(sleepLogs: SleepLog[]) {
  let streakLength = 0;

  // Calculate the current diary streak length
  while (true) {
    // Check that most recent log is more than yesterday or today. If yes, break here at streak 0
    if (!sleepLogs.length || isMoreYesterday(sleepLogs[0].upTime.toDate()))
      break;

    // Increment streak to start, since zero indexed
    streakLength++;

    // Check if current log day is the day after previous log day. If not, break
    if (
      sleepLogs.length === 1 || // If there's only 1 night logged, streak can be at most 1
      !sleepLogs[streakLength + 1] || // Make sure the next index is defined or the below code breaks
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
