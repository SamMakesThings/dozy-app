import { Platform, Alert, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export default async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string | undefined = undefined;

  let isGranted = await isNotificationEnabled();
  if (!isGranted) {
    isGranted = await askNotificationPermission(false);
  }

  if (!isGranted) {
    Alert.alert('Failed to get push token for push notification!');
    return;
  }
  token = (
    await Notifications.getExpoPushTokenAsync({
      experienceId: `@startupsam/${Constants.manifest.slug}`,
    })
  )?.data;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: 100,
    });
  }

  return token;
}

export async function isNotificationEnabled(): Promise<boolean> {
  const { status } = await Notifications.getPermissionsAsync();

  return status === 'granted';
}

export async function askNotificationPermission(
  maybeRedirectToSettings = false,
): Promise<boolean> {
  let isSuccess = false;

  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });

  if (status === 'granted') {
    isSuccess = true;
  } else if (maybeRedirectToSettings) {
    Alert.alert(
      'Action needed',
      'You have disabled your notification permission!\nDo you want to enable it on the Settings app?',
      [
        {
          text: 'Yes',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openSettings();
            } else {
              IntentLauncher.startActivityAsync(
                IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                {
                  data: `package:${Application.applicationId}`,
                },
              );
            }
          },
        },
        { text: 'No' },
      ],
    );
  }

  return isSuccess;
}

export async function updateExpoPushToken(
  expoPushToken: string,
  userId: string,
): Promise<void> {
  const userDocRef = firestore().collection('users').doc(userId);

  const notificationsCollection = userDocRef.collection('notifications');
  notificationsCollection.get().then((data) => {
    if (data.docs.length) {
      data.docs.forEach((doc) => {
        notificationsCollection.doc(doc.id).update({
          expoPushToken,
        });
      });
    }
  });

  userDocRef.update({
    reminders: {
      expoPushToken,
    },
  });
}

export async function setBadgeNumber(badgeCount: number): Promise<boolean> {
  return Notifications.setBadgeCountAsync(badgeCount);
}

export async function calculateBadgeNumber(
  userId: string,
  considerSleepLog = true,
  considerCheckin = true,
  considerUnreadMessages = true,
): Promise<number> {
  let badgeNumber = 0;

  if (userId) {
    const userDoc = (
      await firestore().collection('users').doc(userId).get()
    )?.data();

    // Check if the relevant checkin exists
    if (considerCheckin && userDoc) {
      const lastCheckinDate = userDoc?.currentTreatments?.lastCheckinDatetime;
      const nextCheckinDate = userDoc?.currentTreatments?.nextCheckinDatetime;
      if (
        lastCheckinDate &&
        nextCheckinDate &&
        moment(nextCheckinDate.toDate()).isSameOrBefore(moment()) &&
        moment(lastCheckinDate.toDate()).isBefore(
          moment(nextCheckinDate.toDate()),
        )
      ) {
        badgeNumber++;
      }
    }

    // Check if the relevant sleep log exists
    if (considerSleepLog) {
      const sleepLogsAfterToday = await firestore()
        .collection('users')
        .doc(userId)
        .collection('sleepLogs')
        .where('upTime', '>=', moment().startOf('date').valueOf())
        .get();
      if (!sleepLogsAfterToday.docs.length) {
        badgeNumber++;
      }
    }

    // Check unread messages count
    if (
      considerUnreadMessages &&
      userDoc?.livechatUnreadMsg &&
      !userDoc?.lastChat?.sentByUser
    ) {
      const lastMessages = await firestore()
        .collection('users')
        .doc(userId)
        .collection('supportMessages')
        .orderBy('time', 'desc')
        .limit(100)
        .get();
      let index = 0;
      while (!lastMessages?.docs?.[index]?.data()?.sentByUser) {
        badgeNumber++;
        index++;
      }
    }
  }

  return badgeNumber;
}
