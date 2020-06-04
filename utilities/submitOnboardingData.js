import * as SecureStore from 'expo-secure-store';
import { FbLib } from '../config/firebaseConfig';
import GLOBAL from './global';

export default async function submitOnboardingData() {
  // Initialize relevant Firebase values
  let db = FbLib.firestore();
  let userId = await SecureStore.getItemAsync('userId');
  let userDocRef = db.collection('users').doc(userId);

  // Collect the relevant onboarding values into a map for Firebase & store it
  const healthHistory = {
    pills: GLOBAL.pills,
    snoring: GLOBAL.snoring,
    rls: GLOBAL.rls,
    parasomnias: GLOBAL.parasomnias,
    otherCondition: GLOBAL.otherCondition
  };
  // Also store reminder info & next check-in datetime
  userDocRef
    .set({
      healthHistory: healthHistory,
      reminders: GLOBAL.reminderTime
        ? {
            sleepDiaryReminder: {
              diaryHabitTrigger: GLOBAL.diaryHabitTrigger,
              reminderTime: GLOBAL.diaryReminderTime
            }
          }
        : {},
      nextCheckin: {
        nextCheckinDatetime: GLOBAL.firstCheckinTime,
        treatmentModule: 'SCTSRT'
      }
    })
    .catch(function (error) {
      console.error('Error adding health history data: ', error);
    });

  // Store ISI results
  const ISIResultsRef = userDocRef.collection('isiResults');
  ISIResultsRef.add({
    ISI1: GLOBAL.ISI1,
    ISI2: GLOBAL.ISI2,
    ISI3: GLOBAL.ISI3,
    ISI4: GLOBAL.ISI4,
    ISI5: GLOBAL.ISI5,
    ISI6: GLOBAL.ISI6,
    ISI7: GLOBAL.ISI7,
    ISITotal: GLOBAL.ISITotal,
    timestamp: new Date()
  }).catch(function (error) {
    console.error('Error adding ISI data: ', error);
  });
}
