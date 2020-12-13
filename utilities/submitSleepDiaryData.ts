import * as SecureStore from 'expo-secure-store';
import { FbLib } from '../config/firebaseConfig';
import GLOBAL from './global';

interface LogState {
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
  let db = FbLib.firestore();
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
  if (logState.SCTUpCount) {
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

  // Write the data to the user's sleep log document in Firebase
  sleepLogsRef
    .add({
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
    })
    .catch(function (error) {
      console.log('Error pushing sleep log data:', error);
    });
}
