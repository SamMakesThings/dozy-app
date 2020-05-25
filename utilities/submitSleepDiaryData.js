import * as SecureStore from 'expo-secure-store';
import { FbLib } from '../config/firebaseConfig';
import GLOBAL from './global';

export default async function submitSleepDiaryData() {
  // Initialize relevant Firebase values
  var db = FbLib.firestore();
  let userId = await SecureStore.getItemAsync('userId');
  var sleepLogsRef = db.collection('users').doc(userId).collection('sleepLogs');

  // If bedtime/sleeptime are in the evening, change them to be the day before
  if (GLOBAL.bedTime > GLOBAL.wakeTime) {
    GLOBAL.bedTime = new Date(
      GLOBAL.bedTime.setDate(GLOBAL.bedTime.getDate() - 1)
    );
  }

  // calculate total time in bed, time between waking & getting up, and time awake in bed
  var minsInBedTotalMs = GLOBAL.upTime - GLOBAL.bedTime;
  var minsInBedTotal = Math.floor(minsInBedTotalMs / 1000 / 60);
  var minsInBedAfterWakingMs = GLOBAL.upTime - GLOBAL.wakeTime;
  var minsInBedAfterWaking = Math.floor(minsInBedAfterWakingMs / 1000 / 60);
  var minsAwakeInBedTotal =
    parseInt(GLOBAL.nightMinsAwake) +
    parseInt(GLOBAL.minsToFallAsleep) +
    minsInBedAfterWaking;

  // calculate sleep duration & sleep efficiency
  var sleepDuration = minsInBedTotal - minsAwakeInBedTotal;
  var sleepEfficiency = +(sleepDuration / minsInBedTotal).toFixed(2);

  // Write the data to the user's sleep log document in Firebase
  sleepLogsRef
    .add({
      bedTime: GLOBAL.bedTime,
      minsToFallAsleep: parseInt(GLOBAL.minsToFallAsleep),
      wakeCount: GLOBAL.wakeCount,
      nightMinsAwake: parseInt(GLOBAL.nightMinsAwake),
      wakeTime: GLOBAL.wakeTime,
      upTime: GLOBAL.upTime,
      sleepRating: GLOBAL.sleepRating,
      notes: GLOBAL.notes,
      fallAsleepTime: new Date(
        GLOBAL.bedTime.getTime() + GLOBAL.minsToFallAsleep * 60000
      ),
      sleepEfficiency: sleepEfficiency,
      sleepDuration: sleepDuration,
      minsInBedTotal: minsInBedTotal,
      minsAwakeInBedTotal: minsAwakeInBedTotal,
      tags: GLOBAL.tags
    })
    .catch(function (error) {
      console.log('Error pushing sleep log data:', error);
    });
}
