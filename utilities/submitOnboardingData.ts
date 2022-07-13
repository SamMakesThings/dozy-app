import * as SecureStore from 'expo-secure-store';
import firestore from '@react-native-firebase/firestore';
import { sub } from 'date-fns';
import { take } from 'lodash';
import { SleepLog } from '../types/custom';
import refreshUserData from './refreshUserData';
import { ACTION } from './mainAppReducer';
import { encodeLocalTime } from './time';

export interface OnboardingState {
  pills: string;
  snoring: boolean | string; // true, false, 'unknown'
  rls: boolean;
  parasomnias: boolean;
  otherCondition: boolean;
  expoPushToken: string;
  diaryReminderTime: Date | null;
  firstCheckinTime: Date | null;
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
  ouraConnected?: boolean;
  lastSleepRaiting?: number;
  lastSleepTags?: string[];
  lastSleepLogs?: SleepLog[];
}

export default async function submitOnboardingData(
  onboardingState: OnboardingState,
  dispatch: React.Dispatch<ACTION>,
): Promise<void> {
  // Initialize relevant Firebase values
  const userId = await SecureStore.getItemAsync('userId');
  const userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');

  // Also store reminder info & next check-in datetime
  userDocRef
    .update({
      testingGroup: 'beta3',
      userStatus: 'onboarded',
      onboardingComplete: true,
    })
    .catch(function (error) {
      console.error('Error adding health history data: ', error);
    });

  // Manually refresh user data in state once all the above has completed
  refreshUserData(dispatch);
}

export async function submitISIResults(
  isiResults: Pick<
    OnboardingState,
    'ISI1' | 'ISI2' | 'ISI3' | 'ISI4' | 'ISI5' | 'ISI6' | 'ISI7' | 'ISITotal'
  >,
): Promise<void> {
  // Initialize relevant Firebase values
  const userId = await SecureStore.getItemAsync('userId');
  const userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');

  // Store ISI results
  const isiResultsToSave = {
    ISI1: isiResults.ISI1,
    ISI2: isiResults.ISI2,
    ISI3: isiResults.ISI3,
    ISI4: isiResults.ISI4,
    ISI5: isiResults.ISI5,
    ISI6: isiResults.ISI6,
    ISI7: isiResults.ISI7,
    ISITotal: isiResults.ISITotal,
    timestamp: new Date(),
  };

  try {
    const ISIResultsRef = userDocRef.collection('isiResults');
    const collections = await ISIResultsRef.get();
    if (collections.docs.length) {
      await ISIResultsRef.doc(collections.docs[0].id).update(isiResultsToSave);
    } else {
      await ISIResultsRef.add(isiResultsToSave);
    }
  } catch (error) {
    console.error('Error adding ISI data: ', error);
  }

  // Also store reminder info & next check-in datetime
  try {
    await userDocRef.update({
      baselineInfo: {
        baselineStartDate: new Date(),
        isiTotal: isiResults.ISITotal,
      },
    });
  } catch (error) {
    console.error('Error adding ISITotal data into user baselineInfo: ', error);
  }
}

export async function submitHealthHistoryData(
  healthHistory: Partial<
    Pick<
      OnboardingState,
      'pills' | 'snoring' | 'rls' | 'parasomnias' | 'otherCondition'
    >
  >,
): Promise<void> {
  // Initialize relevant Firebase values
  const userId = await SecureStore.getItemAsync('userId');
  const userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');

  try {
    await userDocRef.update({ healthHistory });
  } catch (error) {
    console.error('Error adding health history data: ', error);
  }
}

export async function submitDiaryReminderAndCheckinData(
  onboardingState: OnboardingState &
    NonNullable<
      Pick<
        OnboardingState,
        | 'diaryReminderTime'
        | 'diaryHabitTrigger'
        | 'firstCheckinTime'
        | 'expoPushToken'
      >
    >,
): Promise<void> {
  // Initialize relevant Firebase values
  const userId = await SecureStore.getItemAsync('userId');
  const userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');

  // Store the sleep diary notification settings, store generated ID in userData
  // Also set a reminder for the next checkin
  const notificationsCollection = userDocRef.collection('notifications');
  let logReminderDocId: string | undefined = undefined;
  const diaryReminderTimeDataAsUTC = encodeLocalTime(
    onboardingState.diaryReminderTime ?? new Date(),
  );

  try {
    const querySnapshot = await notificationsCollection
      .where('type', '==', 'DAILY_LOG')
      .get();

    const newDailyLog = {
      expoPushToken: onboardingState.expoPushToken || 'No push token provided',
      title: 'How did you sleep?',
      body: "Add last night's entry now",
      type: 'DAILY_LOG',
      time: diaryReminderTimeDataAsUTC.value,
      version: diaryReminderTimeDataAsUTC.version,
      timezone: diaryReminderTimeDataAsUTC.timezone,
      enabled: !!onboardingState.diaryReminderTime,
    };
    if (querySnapshot.docs.length) {
      const logReminderDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
      logReminderDocId = logReminderDoc.id;
      logReminderDoc.ref.update(newDailyLog);
      // Delete notification docs except the latest one
      if (querySnapshot.docs.length > 1) {
        take(querySnapshot.docs, querySnapshot.docs.length - 1).forEach(
          (it) => {
            it.ref.delete();
          },
        );
      }
    } else {
      const logReminderDoc = await notificationsCollection.add(newDailyLog);
      logReminderDocId = logReminderDoc.id;
    }
  } catch (error) {
    console.log('Error when saving daily log reminder data: ', error);
  }

  notificationsCollection
    .where('type', '==', 'CHECKIN_REMINDER')
    .get()
    .then((querySnapshot) => {
      const newCheckinReminder = {
        expoPushToken:
          onboardingState.expoPushToken || 'No push token provided',
        title: 'Next check-in is ready',
        body: 'Open the app now to get started',
        type: 'CHECKIN_REMINDER',
        time: onboardingState.firstCheckinTime,
        enabled: true,
      };
      if (querySnapshot.docs.length) {
        notificationsCollection
          .doc(querySnapshot.docs[0].id)
          .update(newCheckinReminder);
      } else {
        notificationsCollection.add(newCheckinReminder);
      }
    });

  // Save sleep logs if Oura connected
  if (userId && onboardingState.lastSleepLogs?.length) {
    const lastSleepLogs = onboardingState.lastSleepLogs.slice().reverse();
    lastSleepLogs.forEach((it) => {
      firestore()
        .collection('users')
        .doc(userId)
        .collection('sleepLogs')
        .add(it);
    });
  }

  // Also store reminder info & next check-in datetime
  userDocRef
    .update({
      reminders: onboardingState.diaryReminderTime
        ? {
            sleepDiaryReminder: {
              diaryHabitTrigger: onboardingState.diaryHabitTrigger,
              diaryReminderTime: diaryReminderTimeDataAsUTC.value,
              version: diaryReminderTimeDataAsUTC.version,
            },
            expoPushToken:
              onboardingState.expoPushToken || 'No push token provided',
          }
        : {},
      nextCheckin: {
        nextCheckinDatetime: onboardingState.firstCheckinTime,
        treatmentModule: 'SCTSRT',
      },
      currentTreatments: {
        BSL: new Date(),
        currentModule: 'BSL',
        lastCheckinDatetime: new Date(),
        nextCheckinDatetime: onboardingState.firstCheckinTime,
        nextTreatmentModule: 'SCTSRT',
      },
      logReminderId: logReminderDocId,
    })
    .catch(function (error) {
      console.error('Error adding health history data: ', error);
    });
}

export async function submitFirstChatMessage(
  firstChatMessageContent: string,
  coachId: string,
  coachName: string,
  displayName?: string,
): Promise<void> {
  // Initialize relevant Firebase values
  const userId = await SecureStore.getItemAsync('userId');
  const userDocRef =
    typeof userId === 'string'
      ? firestore().collection('users').doc(userId)
      : firestore().collection('users').doc('ERRORDELETEME');

  // Check user already initialized a chat
  const userData = await userDocRef.get();
  if (!userData.data()?.lastSupportNotifSent) {
    // Add initial support chat messages to chat collection
    const chatColRef = userDocRef.collection('supportMessages');
    chatColRef.add({
      sender: coachId,
      message: `Welcome to Dozy! I'm ${coachName} I'll be your sleep coach.`,
      time: sub(new Date(), { minutes: 4 }),
      sentByUser: false,
      dontSendNotification: true,
    });
    chatColRef.add({
      sender: coachId,
      message: 'Why do you want to improve your sleep?',
      time: sub(new Date(), { minutes: 3 }),
      sentByUser: false,
      dontSendNotification: true,
    });
    chatColRef.add({
      sender: displayName ?? 'You',
      message: firstChatMessageContent,
      time: sub(new Date(), { minutes: 2 }),
      sentByUser: true,
    });
    const lastChat = {
      sender: coachId,
      message:
        "Thanks for sending! We'll reply soon. You can find our conversation in the Support tab of the app. :)",
      time: new Date(),
      sentByUser: false,
      dontSendNotification: true,
    };
    chatColRef.add(lastChat);

    // Also store reminder info & next check-in datetime
    userDocRef
      .update({
        lastChat,
        lastSupportNotifSent: lastChat.time,
        livechatUnreadMsg: false,
      })
      .catch(function (error) {
        console.error('Error adding health history data: ', error);
      });
  }
}
