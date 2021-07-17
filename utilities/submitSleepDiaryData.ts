import * as SecureStore from 'expo-secure-store';
import { FbDb } from '../config/firebaseConfig';
import moment from 'moment';

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
}

export default async function submitSleepDiaryData(logState: LogState) {
  // Initialize relevant Firebase values
  let db = FbDb;
  let userId = await SecureStore.getItemAsync('userId');
  // If userId is a string, set Firebase ref. If not, mark an error
  let sleepLogsRef =
    typeof userId === 'string'
      ? db.collection('users').doc(userId).collection('sleepLogs')
      : db.collection('users').doc('ERRORDELETEME').collection('sleepLogs');

  // If bedtime/sleeptime are in the evening, change them to be the day before
  if (logState.bedTime > logState.wakeTime) {
    logState.bedTime = new Date(
      logState.bedTime.setDate(logState.bedTime.getDate() - 1)
    );
  }

  // Add a helper function for adding/removing days
  function addDays(date: Date, daysToAdd: number): Date {
    let newDate = new Date(date.valueOf());
    newDate.setDate(date.getDate() + daysToAdd);
    return newDate;
  }

  // If log isn't for today, adjust all date values accordingly
  const dateToCompare = logState.logId ? logState.upTime : new Date();
  const logDate = logState.logDate;
  let daysDiff = moment(logDate).diff(dateToCompare, 'days');
  daysDiff = logDate > dateToCompare ? daysDiff + 1 : daysDiff; // Add 1 if set date is larger than today. To make sure it catches diff accurately
  if (daysDiff !== 0) {
    logState.bedTime = addDays(logState.bedTime, daysDiff);
    logState.wakeTime = addDays(logState.wakeTime, daysDiff);
    logState.upTime = addDays(logState.upTime, daysDiff);
  }

  // calculate total time in bed, time between waking & getting up, and time awake in bed
  var minsInBedTotalMs = logState.upTime.getTime() - logState.bedTime.getTime();
  var minsInBedTotal = Math.floor(minsInBedTotalMs / 1000 / 60);
  var minsInBedAfterWakingMs =
    logState.upTime.getTime() - logState.wakeTime.getTime();
  var minsInBedAfterWaking = Math.floor(minsInBedAfterWakingMs / 1000 / 60);
  var minsAwakeInBedTotal =
    logState.nightMinsAwake + logState.minsToFallAsleep + minsInBedAfterWaking;

  // calculate sleep duration & sleep efficiency
  var sleepDuration = minsInBedTotal - minsAwakeInBedTotal;
  var sleepEfficiency = +(sleepDuration / minsInBedTotal).toFixed(2);

  // Create an object, add any additional treatment module data
  // Currently added: SCT, RLX (PMR), PIT
  let treatmentModuleData = {};
  if (logState.SCTAnythingNonSleepInBed) {
    treatmentModuleData = Object.assign(treatmentModuleData, {
      SCTUpCount: logState.SCTUpCount,
      SCTAnythingNonSleepInBed: logState.SCTAnythingNonSleepInBed,
      SCTNonSleepActivities: logState.SCTNonSleepActivities || null,
      SCTDaytimeNaps: logState.SCTDaytimeNaps
    });
  }
  if (logState.PMRPractice) {
    treatmentModuleData = Object.assign(treatmentModuleData, {
      PMRPractice: logState.PMRPractice
    });
  }
  if (logState.PITPractice) {
    treatmentModuleData = Object.assign(treatmentModuleData, {
      PITPractice: logState.PITPractice
    });
  }

  // Prepare object for pushing to Firebase
  const logDataForDoc = {
    bedTime: logState.bedTime,
    minsToFallAsleep: logState.minsToFallAsleep,
    wakeCount: logState.wakeCount,
    nightMinsAwake: logState.nightMinsAwake,
    wakeTime: logState.wakeTime,
    upTime: logState.upTime,
    sleepRating: logState.sleepRating,
    notes: logState.notes,
    fallAsleepTime: new Date(
      logState.bedTime.getTime() + logState.minsToFallAsleep * 60000
    ),
    sleepEfficiency: sleepEfficiency,
    sleepDuration: sleepDuration,
    minsInBedTotal: minsInBedTotal,
    minsAwakeInBedTotal: minsAwakeInBedTotal,
    tags: logState.tags,
    ...treatmentModuleData
  };

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
  let userDocRef =
    typeof userId === 'string'
      ? db.collection('users').doc(userId)
      : db.collection('users').doc('ERRORDELETEME');
  userDocRef
    .update({ userStatus: 'active' })
    .catch((error) => console.error('Error marking user as active:', error));
}
