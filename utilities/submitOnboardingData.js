import * as SecureStore from 'expo-secure-store';
import { FbLib } from '../config/firebaseConfig';
import GLOBAL from './global';
import refreshUserData from './refreshUserData';

export default async function submitOnboardingData(dispatch) {
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

  // Store the sleep diary notification settings, store generated ID in userData
  const notifDocRef = userDocRef.collection('notifications').doc();
  notifDocRef.set({
    expoPushToken: GLOBAL.expoPushToken
      ? GLOBAL.expoPushToken
      : 'No push token provided',
    title: 'How did you sleep?',
    body: "Add last night's entry now",
    type: 'DAILY_LOG',
    time: GLOBAL.diaryReminderTime ? GLOBAL.diaryReminderTime : new Date(),
    enabled: GLOBAL.diaryReminderTime ? true : false
  });

  // Also store reminder info & next check-in datetime
  userDocRef
    .set({
      healthHistory: healthHistory,
      baselineInfo: {
        baselineStartDate: new Date(),
        isiTotal: GLOBAL.ISITotal
      },
      reminders: GLOBAL.diaryReminderTime
        ? {
            sleepDiaryReminder: {
              diaryHabitTrigger: GLOBAL.diaryHabitTrigger,
              diaryReminderTime: GLOBAL.diaryReminderTime
            },
            expoPushToken: GLOBAL.expoPushToken
          }
        : {},
      nextCheckin: {
        nextCheckinDatetime: GLOBAL.firstCheckinTime,
        treatmentModule: 'SCTSRT'
      },
      currentTreatments: {
        BSL: new Date(),
        currentModule: 'BSL',
        lastCheckinDatetime: new Date(),
        nextCheckinDatetime: GLOBAL.firstCheckinTime,
        nextTreatmentModule: 'SCTSRT'
      },
      logReminderId: notifDocRef.id
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

  // Manually refresh user data in state once all the above has completed
  refreshUserData(dispatch);
}
