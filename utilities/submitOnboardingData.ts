import * as SecureStore from 'expo-secure-store';
import { FbLib } from '../config/firebaseConfig';
import GLOBAL from './global';
import refreshUserData from './refreshUserData';

interface OnboardingState {
  pills: string;
  snoring: boolean;
  rls: boolean;
  parasomnias: boolean;
  otherCondition: boolean;
  expoPushToken: string | undefined;
  diaryReminderTime: Date | undefined;
  firstCheckinTime: Date;
  diaryHabitTrigger: string;
  ISI1: number;
  ISI2: number;
  ISI3: number;
  ISI4: number;
  ISI5: number;
  ISI6: number;
  ISI7: number;
  ISITotal: number;
}

export default async function submitOnboardingData(
  onboardingState: OnboardingState,
  dispatch: Function
) {
  // Initialize relevant Firebase values
  let db = FbLib.firestore();
  let userId = await SecureStore.getItemAsync('userId');
  let userDocRef =
    typeof userId === 'string'
      ? db.collection('users').doc(userId)
      : db.collection('users').doc('ERRORDELETEME');

  // Collect the relevant onboarding values into a map for Firebase & store it
  const healthHistory = {
    pills: onboardingState.pills,
    snoring: onboardingState.snoring,
    rls: onboardingState.rls,
    parasomnias: onboardingState.parasomnias,
    otherCondition: onboardingState.otherCondition
  };

  // Store the sleep diary notification settings, store generated ID in userData
  // Also set a reminder for the next checkin
  const notifDocRef = userDocRef.collection('notifications').doc();
  notifDocRef.set({
    expoPushToken: onboardingState.expoPushToken
      ? onboardingState.expoPushToken
      : 'No push token provided',
    title: 'How did you sleep?',
    body: "Add last night's entry now",
    type: 'DAILY_LOG',
    time: onboardingState.diaryReminderTime
      ? onboardingState.diaryReminderTime
      : new Date(),
    enabled: onboardingState.diaryReminderTime ? true : false
  });
  userDocRef.collection('notifications').add({
    expoPushToken: onboardingState.expoPushToken,
    title: 'Next checkin is ready',
    body: 'Open the app now to get started',
    type: 'CHECKIN_REMINDER',
    time: onboardingState.firstCheckinTime,
    enabled: true
  });

  // Also store reminder info & next check-in datetime
  userDocRef
    .set({
      healthHistory: healthHistory,
      baselineInfo: {
        baselineStartDate: new Date(),
        isiTotal: onboardingState.ISITotal
      },
      reminders: onboardingState.diaryReminderTime
        ? {
            sleepDiaryReminder: {
              diaryHabitTrigger: onboardingState.diaryHabitTrigger,
              diaryReminderTime: onboardingState.diaryReminderTime
            },
            expoPushToken: onboardingState.expoPushToken
          }
        : {},
      nextCheckin: {
        nextCheckinDatetime: onboardingState.firstCheckinTime,
        treatmentModule: 'SCTSRT'
      },
      currentTreatments: {
        BSL: new Date(),
        currentModule: 'BSL',
        lastCheckinDatetime: new Date(),
        nextCheckinDatetime: onboardingState.firstCheckinTime,
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
    ISI1: onboardingState.ISI1,
    ISI2: onboardingState.ISI2,
    ISI3: onboardingState.ISI3,
    ISI4: onboardingState.ISI4,
    ISI5: onboardingState.ISI5,
    ISI6: onboardingState.ISI6,
    ISI7: onboardingState.ISI7,
    ISITotal: onboardingState.ISITotal,
    timestamp: new Date()
  }).catch(function (error) {
    console.error('Error adding ISI data: ', error);
  });

  // Manually refresh user data in state once all the above has completed
  refreshUserData(dispatch);
}
