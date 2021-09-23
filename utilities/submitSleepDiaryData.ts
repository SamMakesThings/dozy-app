import * as SecureStore from 'expo-secure-store';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { cloneDeep, pick } from 'lodash';

import SleepConstants from '../constants/Sleep';
import { SleepLog } from '../types/custom';
import { encodeLocalTime } from './time';

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
  // Initialize relevant Firebase values
  const userId = await SecureStore.getItemAsync('userId');
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
  if (logState.logId) {
    sleepLogsRef
      .doc(logState.logId)
      .update(logDataForDoc)
      .catch(function (error) {
        console.error('Error pushing sleep log data:', error);
      });
  } else {
    sleepLogsRef.add(logDataForDoc).catch(function (error) {
      console.error('Error pushing sleep log data:', error);
    });
  }

  // Make sure userStatus is "active" in Firebase
  const userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');
  userDocRef
    .update({ userStatus: 'active' })
    .catch((error) => console.error('Error marking user as active:', error));
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
  }
  if (logState.isZeroSleep) {
    newLogState.wakeTime = newLogState.bedTime;
  }

  // If log isn't for today, adjust all date values accordingly
  const dateToCompare = newLogState.logId ? newLogState.upTime : new Date();
  let daysDiff = moment(newLogState.logDate).diff(dateToCompare, 'days');
  daysDiff = newLogState.logDate > dateToCompare ? daysDiff + 1 : daysDiff; // Add 1 if set date is larger than today. To make sure it catches diff accurately
  if (daysDiff !== 0) {
    newLogState.bedTime = moment(newLogState.bedTime)
      .add(daysDiff, 'days')
      .toDate();
    newLogState.wakeTime = moment(newLogState.wakeTime)
      .add(daysDiff, 'days')
      .toDate();
    newLogState.upTime = moment(newLogState.upTime)
      .add(daysDiff, 'days')
      .toDate();
  }

  // calculate total time in bed, time between waking & getting up, and time awake in bed
  const minsInBedTotal = Math.floor(
    (newLogState.upTime.getTime() - newLogState.bedTime.getTime()) / 1000 / 60,
  );
  if (logState.isZeroSleep) {
    newLogState.minsToFallAsleep = minsInBedTotal / 2;
    newLogState.nightMinsAwake = minsInBedTotal / 2;
  }
  const minsInBedAfterWaking = Math.floor(
    (newLogState.upTime.getTime() - newLogState.wakeTime.getTime()) / 1000 / 60,
  );
  const minsAwakeInBedTotal = logState.isZeroSleep
    ? minsInBedTotal
    : newLogState.nightMinsAwake +
      newLogState.minsToFallAsleep +
      minsInBedAfterWaking;

  // calculate sleep duration & sleep efficiency
  const sleepDuration = logState.isZeroSleep
    ? 0
    : minsInBedTotal - minsAwakeInBedTotal;
  const sleepEfficiency = logState.isZeroSleep
    ? 0
    : +(sleepDuration / minsInBedTotal).toFixed(2);

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
    sleepEfficiency,
    sleepDuration,
    minsInBedTotal,
    minsAwakeInBedTotal,
    ...treatmentModuleData,
  };
}

export function validateSleepLog(logState: LogState): boolean {
  let isValid = true;

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
    isValid = false;
  } else if (
    !logState.isZeroSleep &&
    moment(logState.upTime).isBefore(logState.wakeTime)
  ) {
    // If get up time is before wake up time
    isValid = false;
  } else if (
    moment(logState.upTime).diff(bedTime) / 60000 >
    SleepConstants.maxMinsInBedTotal
  ) {
    // If bed time period exceeds the maxium time
    isValid = false;
  } else if (logState.minsToFallAsleep > SleepConstants.maxMinsToFallAsleep) {
    // If fall asleep time exceeds the maxium time
    isValid = false;
  } else if (
    !logState.isZeroSleep &&
    bedTime
      .add(logState.minsToFallAsleep, 'minutes')
      .isSameOrAfter(logState.wakeTime)
  ) {
    // If fall asleep time is same or after wake up time
    isValid = false;
  } else if (
    !logState.isZeroSleep &&
    logState.nightMinsAwake >=
      moment(logState.wakeTime).diff(bedTime) / 60000 -
        logState.minsToFallAsleep
  ) {
    // If night awake time is same or exceeds sleep time
    isValid = false;
  } else if (
    (!logState.isZeroSleep && logState.minsToFallAsleep < 0) ||
    logState.nightMinsAwake < 0
  ) {
    // Invalid values
    isValid = false;
  }

  return isValid;
}
