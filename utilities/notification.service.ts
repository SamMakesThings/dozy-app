import { useEffect, useRef } from 'react';
import {
  Platform,
  Alert,
  Linking,
  AppState,
  AppStateStatus,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Application from 'expo-application';
import * as IntentLauncher from 'expo-intent-launcher';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

export default class Notification {
  static useNotificationService(userId?: string): void {
    const notificationEnabledRef = useRef(false);

    useEffect((): (() => void) | void => {
      if (userId && Platform.OS === 'android') {
        Notification.isNotificationEnabled().then((enabled: boolean) => {
          notificationEnabledRef.current = enabled;
        });

        const handleAppStateChange = async (
          newState: AppStateStatus,
        ): Promise<void> => {
          if (newState === 'background') {
            notificationEnabledRef.current =
              await Notification.isNotificationEnabled();
          } else if (newState === 'active') {
            const newNotificationEnabled =
              await Notification.isNotificationEnabled();
            if (!notificationEnabledRef.current && newNotificationEnabled) {
              notificationEnabledRef.current = newNotificationEnabled;
              const expoPushToken =
                await Notification.registerForPushNotificationsAsync(false);
              if (expoPushToken) {
                await Notification.updateExpoPushToken(expoPushToken, userId);
              }
            } else {
              notificationEnabledRef.current = newNotificationEnabled;
            }
          }
        };

        AppState.addEventListener('change', handleAppStateChange);

        return () =>
          AppState.removeEventListener('change', handleAppStateChange);
      }
    }, [userId]);
  }

  static async getExpoPushToken(): Promise<string | undefined> {
    return (
      await Notifications.getExpoPushTokenAsync({
        experienceId: `@startupsam/${Constants.manifest.slug}`,
      })
    )?.data;
  }

  static async registerForPushNotificationsAsync(
    showAlert = true,
    maybeRedirectToSettings = false,
  ): Promise<string | undefined> {
    let isGranted = await Notification.isNotificationEnabled();
    if (!isGranted) {
      isGranted = await Notification.askNotificationPermission(
        maybeRedirectToSettings,
      );
    }

    if (!isGranted) {
      if (showAlert) {
        Alert.alert('Failed to get push token for push notification!');
      }
      return;
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: 100,
      });
    }

    return Notification.getExpoPushToken();
  }

  static async isNotificationEnabled(): Promise<boolean> {
    const { status } = await Notifications.getPermissionsAsync();

    return status === 'granted';
  }

  static async askNotificationPermission(
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

  static async updateExpoPushToken(
    expoPushToken: string,
    userId: string,
  ): Promise<void> {
    const userDocRef = firestore().collection('users').doc(userId);

    userDocRef.update({
      reminders: {
        expoPushToken,
      },
    });

    const notificationsCollection = await userDocRef
      .collection('notifications')
      .get();
    if (notificationsCollection.docs.length) {
      notificationsCollection.docs.forEach((doc) => {
        if (doc.data()?.expoPushToken !== expoPushToken) {
          doc.ref.update({ expoPushToken });
        }
      });
    }
  }

  static async setBadgeNumber(badgeCount: number): Promise<boolean> {
    return Notifications.setBadgeCountAsync(badgeCount);
  }

  static async calculateBadgeNumber(
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
}
