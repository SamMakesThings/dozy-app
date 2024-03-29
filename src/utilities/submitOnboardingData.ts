import * as SecureStore from 'expo-secure-store';
import firestore from '@react-native-firebase/firestore';
import { take } from 'lodash';
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
  diaryAndCheckinData: NonNullable<
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
    diaryAndCheckinData.diaryReminderTime ?? new Date(),
  );

  try {
    const querySnapshot = await notificationsCollection
      .where('type', '==', 'DAILY_LOG')
      .get();

    const newDailyLog = {
      expoPushToken:
        diaryAndCheckinData.expoPushToken || 'No push token provided',
      title: 'How did you sleep?',
      body: "Add last night's entry now",
      type: 'DAILY_LOG',
      time: diaryReminderTimeDataAsUTC.value,
      version: diaryReminderTimeDataAsUTC.version,
      timezone: diaryReminderTimeDataAsUTC.timezone,
      enabled: !!diaryAndCheckinData.diaryReminderTime,
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
          diaryAndCheckinData.expoPushToken || 'No push token provided',
        title: 'Next check-in is ready',
        body: 'Open the app now to get started',
        type: 'CHECKIN_REMINDER',
        time: diaryAndCheckinData.firstCheckinTime,
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

  // Also store reminder info & next check-in datetime
  userDocRef
    .update({
      reminders: diaryAndCheckinData.diaryReminderTime
        ? {
            sleepDiaryReminder: {
              diaryHabitTrigger: diaryAndCheckinData.diaryHabitTrigger,
              diaryReminderTime: diaryReminderTimeDataAsUTC.value,
              version: diaryReminderTimeDataAsUTC.version,
            },
            expoPushToken:
              diaryAndCheckinData.expoPushToken || 'No push token provided',
          }
        : {},
      nextCheckin: {
        nextCheckinDatetime: diaryAndCheckinData.firstCheckinTime,
        treatmentModule: 'SCTSRT',
      },
      currentTreatments: {
        BSL: new Date(),
        currentModule: 'BSL',
        lastCheckinDatetime: new Date(),
        nextCheckinDatetime: diaryAndCheckinData.firstCheckinTime,
        nextTreatmentModule: 'SCTSRT',
      },
      logReminderId: logReminderDocId,
    })
    .catch(function (error) {
      console.error('Error adding health history data: ', error);
    });
}
