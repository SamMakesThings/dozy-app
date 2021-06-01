import { SleepLog } from '../types/custom';
import { subDays } from 'date-fns';

export function getLogStreakLength(sleepLogs: SleepLog[]) {
  let streakLength = 0;

  // Helper function. Return true if date2 is the day before date1 (or same day)
  function isPreviousDay(date1: Date, date2: Date) {
    // Earliest candidate is midnight of 1 day ago
    const midnight = subDays(date1, 1);
    midnight.setHours(0, 0, 0, 0);
    return midnight <= date2 && date2 <= date1;
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
