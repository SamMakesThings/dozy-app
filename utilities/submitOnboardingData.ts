import * as SecureStore from 'expo-secure-store';
import firestore from '@react-native-firebase/firestore';
import refreshUserData from './refreshUserData';
import { sub } from 'date-fns';

interface OnboardingState {
  pills: string;
  snoring: boolean;
  rls: boolean;
  parasomnias: boolean;
  otherCondition: boolean;
  expoPushToken: string;
  diaryReminderTime: Date;
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
  firstChatMessageContent: string;
}

export default async function submitOnboardingData(
  onboardingState: OnboardingState,
  dispatch: Function
) {
  // Initialize relevant Firebase values
  let userId = await SecureStore.getItemAsync('userId');
  let userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');

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
    expoPushToken: onboardingState.expoPushToken || 'No push token provided',
    title: 'How did you sleep?',
    body: "Add last night's entry now",
    type: 'DAILY_LOG',
    time: onboardingState.diaryReminderTime
      ? onboardingState.diaryReminderTime
      : new Date(),
    enabled: onboardingState.diaryReminderTime ? true : false
  });
  userDocRef.collection('notifications').add({
    expoPushToken: onboardingState.expoPushToken || 'No push token provided',
    title: 'Next checkin is ready',
    body: 'Open the app now to get started',
    type: 'CHECKIN_REMINDER',
    time: onboardingState.firstCheckinTime,
    enabled: true
  });

  // Also store reminder info & next check-in datetime
  userDocRef
    .update({
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
            expoPushToken:
              onboardingState.expoPushToken || 'No push token provided'
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
      logReminderId: notifDocRef.id,
      testingGroup: 'beta3',
      userStatus: 'onboarded',
      onboardingComplete: true,
      lastChat: {
        message:
          "Thanks for sending! We'll reply soon. You can find our conversation in the Support tab of the app. :)",
        sender: 'Sam Stowers',
        time: new Date(),
        sentByUser: false
      },
      lastSupportNotifSent: new Date(),
      livechatUnreadMsg: false
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

  // Add initial support chat messages to chat collection
  const chatColRef = userDocRef.collection('supportMessages');
  chatColRef.add({
    sender: 'Sam Stowers',
    message: "Welcome to Dozy! I'm Sam, I'll be your sleep coach.",
    time: sub(new Date(), { minutes: 4 }),
    sentByUser: false
  });
  chatColRef.add({
    sender: 'Sam Stowers',
    message: 'Why do you want to improve your sleep?',
    time: sub(new Date(), { minutes: 3 }),
    sentByUser: false
  });
  chatColRef.add({
    sender: 'You',
    message: onboardingState.firstChatMessageContent,
    time: sub(new Date(), { minutes: 2 }),
    sentByUser: true
  });
  chatColRef.add({
    sender: 'Sam Stowers',
    message:
      "Thanks for sending! We'll reply soon. You can find our conversation in the Support tab of the app. :)",
    time: sub(new Date(), { minutes: 1 }),
    sentByUser: false
  });

  // Manually refresh user data in state once all the above has completed
  refreshUserData(dispatch);
}
