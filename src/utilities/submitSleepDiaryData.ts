import * as SecureStore from 'expo-secure-store';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { cloneDeep, pick } from 'lodash';

import SleepConstants from '../constants/Sleep';
import { SleepLog } from '../types/custom';
import { ErrorObj } from '../types/error';
import { encodeLocalTime } from './time';
import Notification from './notification.service';

interface LogState {
  logId?: string;
  logDate: Date;
  bedTime: Date;
  wakeTime: Date;
  upTime: Date;
  nightMinsAwake: number;
  minsToFallAsleep: number;
  wakeCount: number;
  sleepRating: number;
  notes: string;
  tags: string[];
  SCTUpCount: undefined | number;
  SCTAnythingNonSleepInBed: undefined | boolean;
  SCTNonSleepActivities: undefined | string | null;
  SCTDaytimeNaps: undefined | boolean;
  PMRPractice: undefined | string;
  PITPractice: undefined | boolean;
  isZeroSleep: boolean;
}

export default async function submitSleepDiaryData(
  logState: LogState,
): Promise<void> {
  let submitError: Error | undefined;

  // Initialize relevant Firebase values
  const userId = await SecureStore.getItemAsync('userId');

  if (!userId) {
    submitError = new Error('User ID does not exist!');
  }
  // If userId is a string, set Firebase ref. If not, mark an error
  const sleepLogsRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId).collection('sleepLogs')
      : firestore()
          .collection('users')
          .doc('ERRORDELETEME')
          .collection('sleepLogs');

  // Prepare object for pushing to Firebase
  const logDataForDoc = normalizeSleepLog(logState, true);

  // If entry is an edit, update existing log document in Firebase
  // Otherwise, create a new document
  try {
    if (logState.logId) {
      await sleepLogsRef.doc(logState.logId).update(logDataForDoc);
    } else {
      await sleepLogsRef.add(logDataForDoc);
      // Update the app icon's badge
      if (
        moment(logDataForDoc.upTime.toDate()).isSameOrAfter(
          moment().startOf('date'),
        )
      ) {
        Notification.calculateBadgeNumber(userId!, false, true, true).then(
          (badgeNumber) => {
            Notification.setBadgeNumber(badgeNumber);
          },
        );
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.error(
        logState.logId
          ? 'Error pushing sleep log data:'
          : 'Error pushing sleep log data:',
        error,
      );
    }
    if (!submitError) {
      if (logState.logId) {
        submitError = new Error(
          `Failed to update the sleep log (ID: ${logState.logId})!`,
        );
      } else {
        submitError = new Error('Failed to add the sleep log!');
      }
    }
  }

  // Make sure userStatus is "active" in Firebase
  const userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');

  try {
    await userDocRef.update({ userStatus: 'active' });
  } catch (error) {
    if (__DEV__) {
      console.error('Error marking user as active:', error);
    }
    if (!submitError) {
      submitError = new Error(
        'Failed to update the user status after submitting a sleep log!',
      );
    }
  }

  if (submitError) {
    throw submitError;
  }
}

/**
 * Normalize log state by adjusting existing fields and adding new fields.
 * @param {Object} logState - The log state inputted on the diary entry screens
 * @param {boolean} isChangeTimezone - When true, change the time to UTC time but the coverted time will have the same hours and minutes as the local time
 * @returns {Object} - SleepLog
 */
export function normalizeSleepLog(
  logState: LogState,
  isChangeTimezone = false,
): SleepLog {
  const newLogState = cloneDeep(logState);

  // If bedtime/sleeptime are in the evening, change them to be the day before
  if (
    logState.bedTime >
    (logState.isZeroSleep ? logState.upTime : logState.wakeTime)
  ) {
    newLogState.bedTime = moment(logState.bedTime).subtract(1, 'days').toDate();
  } else if (
    !logState.isZeroSleep &&
    logState.upTime < logState.bedTime &&
    logState.bedTime < logState.wakeTime &&
    logState.upTime < logState.wakeTime
  ) {
    newLogState.bedTime = moment(logState.bedTime).subtract(1, 'days').toDate();
    newLogState.wakeTime = moment(logState.wakeTime)
      .subtract(1, 'days')
      .toDate();
  }
  if (logState.isZeroSleep) {
    newLogState.wakeTime = newLogState.bedTime;
  }

  // calculate total time in bed, time between waking & getting up, and time awake in bed
  const minsInBedTotal = Math.floor(
    (newLogState.upTime.getTime() - newLogState.bedTime.getTime()) / 1000 / 60,
  );
  if (logState.isZeroSleep) {
    newLogState.minsToFallAsleep = minsInBedTotal / 2;
    newLogState.nightMinsAwake = minsInBedTotal / 2;
  }
  const minsInBedAfterWaking = logState.isZeroSleep
    ? 0
    : Math.floor(
        (newLogState.upTime.getTime() - newLogState.wakeTime.getTime()) /
          1000 /
          60,
      );
  const minsAwakeInBedTotal =
    newLogState.nightMinsAwake +
    newLogState.minsToFallAsleep +
    minsInBedAfterWaking;

  // calculate sleep duration & sleep efficiency
  const sleepDuration = minsInBedTotal - minsAwakeInBedTotal;
  const sleepEfficiency = +(sleepDuration / minsInBedTotal).toFixed(2);

  // Create an object, add any additional treatment module data
  // Currently added: SCT, RLX (PMR), PIT
  let treatmentModuleData = {};
  if (newLogState.SCTAnythingNonSleepInBed) {
    treatmentModuleData = Object.assign(treatmentModuleData, {
      SCTUpCount: newLogState.SCTUpCount,
      SCTAnythingNonSleepInBed: newLogState.SCTAnythingNonSleepInBed,
      SCTNonSleepActivities: newLogState.SCTNonSleepActivities || null,
      SCTDaytimeNaps: newLogState.SCTDaytimeNaps,
    });
  }
  if (newLogState.PMRPractice) {
    treatmentModuleData = Object.assign(treatmentModuleData, {
      PMRPractice: newLogState.PMRPractice,
    });
  }
  if (newLogState.PITPractice) {
    treatmentModuleData = Object.assign(treatmentModuleData, {
      PITPractice: newLogState.PITPractice,
    });
  }

  // Convert to UTC but has the same YYYY-MM-DD HH:mm as the local time's
  const bedTimeUTCData = encodeLocalTime(newLogState.bedTime);
  const fallAsleepTime = moment(newLogState.bedTime)
    .add(newLogState.minsToFallAsleep, 'minutes')
    .toDate();
  const fallAsleepTimeUTCData = encodeLocalTime(fallAsleepTime);
  const wakeTimeUTCData = encodeLocalTime(newLogState.wakeTime);
  const upTimeUTCData = encodeLocalTime(newLogState.upTime);

  // Prepare object for pushing to Firebase
  return {
    ...pick(newLogState, [
      'minsToFallAsleep',
      'wakeCount',
      'nightMinsAwake',
      'sleepRating',
      'notes',
      'tags',
    ]),
    bedTime: firestore.Timestamp.fromDate(
      isChangeTimezone ? bedTimeUTCData.value : newLogState.bedTime,
    ),
    fallAsleepTime: firestore.Timestamp.fromDate(
      isChangeTimezone ? fallAsleepTimeUTCData.value : fallAsleepTime,
    ),
    wakeTime: firestore.Timestamp.fromDate(
      isChangeTimezone ? wakeTimeUTCData.value : newLogState.wakeTime,
    ),
    upTime: firestore.Timestamp.fromDate(
      isChangeTimezone ? upTimeUTCData.value : newLogState.upTime,
    ),
    version: bedTimeUTCData.version,
    timezone: bedTimeUTCData.timezone,
    sleepEfficiency,
    sleepDuration,
    minsInBedTotal,
    minsAwakeInBedTotal,
    ...treatmentModuleData,
  };
}

export function validateSleepLog(logState: LogState): ErrorObj | boolean {
  const bedTime = moment(logState.bedTime).isAfter(
    logState.isZeroSleep ? logState.upTime : logState.wakeTime,
  )
    ? moment(logState.bedTime).subtract(1, 'days')
    : moment(logState.bedTime);

  if (
    bedTime.isSameOrAfter(
      logState.isZeroSleep ? logState.upTime : logState.wakeTime,
    )
  ) {
    // If bed time is the same as wake time
    return {
      severity: 'ERROR',
      errorMsg:
        'The times you selected say you woke up before you went to sleep! Please double check your bedtime and/or wake time.',
    };
  } else if (
    !logState.isZeroSleep &&
    moment(logState.upTime).isBefore(logState.wakeTime)
  ) {
    // If get up time is before wake up time
    return {
      severity: 'ERROR',
      errorMsg:
        'The times you selected suggest you got up before you woke up! Please double check your wake time and/or up time.',
    };
  } else if (
    moment(logState.upTime).diff(bedTime) / 60000 >
    SleepConstants.maxMinsInBedTotal
  ) {
    // If bed time period exceeds the maxium time
    return {
      severity: 'WARNING',
      errorMsg: `You were in a bed for more than ${Math.round(
        SleepConstants.maxMinsInBedTotal / 60,
      )} hours. If not, please check your bed or getup time.`,
    };
  } else if (logState.minsToFallAsleep > SleepConstants.maxMinsToFallAsleep) {
    // If fall asleep time exceeds the maxium time
    return {
      severity: 'WARNING',
      errorMsg: `You fell asleep more than ${SleepConstants.maxMinsToFallAsleep} minutes later. If not, please check it again.`,
    };
  } else if (
    !logState.isZeroSleep &&
    bedTime
      .add(logState.minsToFallAsleep, 'minutes')
      .isSameOrAfter(logState.wakeTime)
  ) {
    // If fall asleep time is same or after wake up time
    return {
      severity: 'ERROR',
      errorMsg:
        'Your fall asleep time is after the time you woke up! Please double check your bedtime, fall aleep time, or wake time.',
    };
  } else if (
    !logState.isZeroSleep &&
    logState.nightMinsAwake >=
      moment(logState.wakeTime).diff(bedTime) / 60000 -
        logState.minsToFallAsleep
  ) {
    // If night awake time is same or exceeds sleep time
    return {
      severity: 'ERROR',
      errorMsg:
        'The time you recorded as awake exceeds your total time in bed last night. Please check your bed time, wake time, fall asleep time or awake duration.',
    };
  } else if (
    (!logState.isZeroSleep && logState.minsToFallAsleep < 0) ||
    logState.nightMinsAwake < 0
  ) {
    // Invalid values
    return {
      severity: 'ERROR',
      errorMsg:
        'The time it took you to fall asleep, or minutes awake, was recorded as negaive?? Please check those values again.',
    };
  }

  return true;
}
