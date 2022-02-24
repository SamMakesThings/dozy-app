import React, { useCallback, useRef } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  Icon,
  Switch,
  Touchable,
  DatePicker,
} from '@draftbit/ui';
import firestore from '@react-native-firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import { scale } from 'react-native-size-matters';
import ExpoConstants from 'expo-constants';
import { take } from 'lodash';
import { dozy_theme } from '../config/Themes';
import Analytics from '../utilities/analytics.service';
import { encodeLocalTime, decodeServerTime } from '../utilities/time';
import Auth from '../utilities/auth.service';
import Notification from '../utilities/notification.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function SettingsScreen() {
  // Pass along the signOut function from the context provider
  const { state, signOut } = Auth.useAuth();
  const logReminderIdRef = useRef();
  const theme = dozy_theme;

  // Add function to update notification in Firebase based on local state
  const updateFbLogNotification = useCallback(
    (update) => {
      if (logReminderIdRef.current) {
        firestore()
          .collection('users')
          .doc(state.userId)
          .collection('notifications')
          .doc(logReminderIdRef.current)
          .update(update);
      }
    },
    [state.userId],
  );

  // Set up a reducer to manage settings state & keep Firebase updated
  // TODO: Have enabling notifs recheck permissions / Expo token
  const [settings, dispatch] = React.useReducer(
    (prevState, action) => {
      let encodedTimeData;

      switch (action.type) {
        case 'TOGGLE_LOG_NOTIFS':
          updateFbLogNotification({
            enabled: action.enabledStatus,
          });
          return {
            ...prevState,
            logNotifsEnabled: action.enabledStatus,
          };
        case 'SET_LOG_REMINDER_TIME':
          encodedTimeData = encodeLocalTime(action.time);
          updateFbLogNotification({
            time: encodedTimeData.value,
            version: encodedTimeData.version,
            timezone: encodedTimeData.timezone,
          });
          return {
            ...prevState,
            logReminderTime: action.time,
          };
      }
    },
    {
      logReminderTime: new Date(),
      logNotifsEnabled: false,
    },
  );

  const maybeAskNotificationPermission = useCallback(async () => {
    if (!(await Notification.isNotificationEnabled())) {
      const expoPushToken =
        await Notification.registerForPushNotificationsAsync(false, true);
      if (expoPushToken) {
        Notification.updateExpoPushToken(expoPushToken, state.userId);
      }
    }
  }, [state.userId]);

  // Make sure the screen uses updated state once it loads for the first time.
  React.useEffect(() => {
    // Add function to pull existing settings from Firebase, update state with them
    const getSettings = async () => {
      const notifFbQuery = firestore()
        .collection('users')
        .doc(state.userId)
        .collection('notifications')
        .where('type', '==', 'DAILY_LOG');

      if (notifFbQuery === undefined) {
        return 'ERROR: Firebase not loading correctly';
      }

      const dailyLogNotificationDocs = await notifFbQuery.get();

      if (dailyLogNotificationDocs.docs.length) {
        const latestNotificationDoc =
          dailyLogNotificationDocs.docs[
            dailyLogNotificationDocs.docs.length - 1
          ];
        logReminderIdRef.current = latestNotificationDoc.id;
        latestNotificationDoc.ref.onSnapshot((notif) => {
          if (notif) {
            const notifData = notif.data();
            dispatch({
              type: 'SET_LOG_REMINDER_TIME',
              time: decodeServerTime({
                version: notifData.version,
                value: notifData.time.toDate(),
                timezone: notifData.timezone,
              }),
            });
            dispatch({
              type: 'TOGGLE_LOG_NOTIFS',
              enabledStatus: notifData.enabled,
            });
          }
        });
        // Delete notification docs except the latest one
        if (dailyLogNotificationDocs.docs.length > 1) {
          take(
            dailyLogNotificationDocs.docs,
            dailyLogNotificationDocs.docs.length - 1,
          ).forEach((it) => {
            it.ref.delete();
          });
          // Update logReminderId in user data
          firestore().collection('users').doc(state.userId).update({
            logReminderId: logReminderIdRef.current,
          });
        }
      }
    };
    getSettings();
  }, []);

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_nd}
    >
      <TouchableOpacity
        onPress={() => {
          if (!state.profileData.name) {
            let newProfileData = state.profileData;
            newProfileData.name =
              state.userData.userInfo?.displayName || 'Temp Name';
            SecureStore.setItemAsync(
              'profileData',
              JSON.stringify(newProfileData),
            );
          }
        }}
        disabled={state.profileData.name || Platform.OS === 'android'}
      >
        <Container
          style={styles.Container_nz}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Icon
            style={styles.Icon_ny}
            name="Ionicons/ios-person"
            size={200}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.Text_n1,
              theme.typography.headline3,
              {
                color: theme.colors.strong,
              },
            ]}
          >
            {state.profileData.name || 'Tap here to fix chat'}
          </Text>
          <Text
            style={[
              styles.Text_nc,
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
              },
            ]}
            testID="appVersion"
          >
            {`@dozyapp ${ExpoConstants.nativeAppVersion}`}
          </Text>
        </Container>
      </TouchableOpacity>
      <Container
        style={styles.optionsWrapper}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Container
          style={[styles.optionsItem, styles.rowAlign]}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Text style={styles.optionsItemText}>
            Sleep log & check-in reminders
          </Text>
          <Switch
            style={styles.Switch_n9}
            color={theme.colors.primary}
            disabled={false}
            value={settings.logNotifsEnabled}
            onValueChange={async (value) => {
              dispatch({
                type: 'TOGGLE_LOG_NOTIFS',
                enabledStatus: value,
              });
              Analytics.logEvent(AnalyticsEvents.switchSleepLogReminders, {
                enabled: value,
              });
              if (value) {
                maybeAskNotificationPermission();
              }
            }}
          />
        </Container>
        <View style={styles.horizontalRule} />
        <Container
          style={styles.optionsItem}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Text style={styles.optionsItemText}>Sleep log reminder time</Text>
          <DatePicker
            style={styles.datePicker}
            mode="time"
            label="Time"
            type="underline"
            error={false}
            disabled={false}
            leftIconMode="inset"
            format="h:MM TT"
            date={settings.logReminderTime}
            onDateChange={(result) => {
              dispatch({ type: 'SET_LOG_REMINDER_TIME', time: result });
              Analytics.logEvent(AnalyticsEvents.editReminderTime);
              maybeAskNotificationPermission();
            }}
          />
        </Container>
        <View style={styles.horizontalRule} />
        <Touchable style={styles.touchableItemWrapper} onPress={signOut}>
          <Container
            style={styles.optionsItem}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[styles.optionsItemText, { color: theme.colors.error }]}
            >
              Sign out of Dozy
            </Text>
          </Container>
        </Touchable>
      </Container>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  optionsItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  optionsWrapper: {
    alignItems: 'flex-start',
    width: '100%',
    backgroundColor: dozy_theme.colors.medium,
    paddingVertical: 10,
    borderRadius: 10,
    paddingLeft: 5,
    paddingRight: 0,
  },
  Container_nz: {
    alignItems: 'center',
    marginTop: scale(
      Platform.select({
        ios: dozy_theme.spacing.small,
        android: dozy_theme.spacing.medium,
      }),
    ),
  },
  datePicker: {
    padding: 0,
    minWidth: 100,
    paddingVertical: 0,
    position: 'absolute',
    right: 0,
    top: -24,
  },
  Root_nd: {
    justifyContent: 'space-around',
    backgroundColor: dozy_theme.colors.background,
    paddingHorizontal: 20,
  },
  Text_n1: {
    textAlign: 'center',
    width: '100%',
  },
  Text_nc: {
    textAlign: 'center',
    width: '100%',
  },
  horizontalRule: {
    height: StyleSheet.hairlineWidth,
    width: '95%',
    backgroundColor: dozy_theme.colors.mediumInverse,
    alignSelf: 'flex-end',
    marginVertical: 10,
  },
  optionsItemText: {
    ...dozy_theme.typography.subtitle2,
    color: dozy_theme.colors.strong,
  },
  touchableItemWrapper: {
    width: '100%',
  },
  rowAlign: {
    alignItems: 'center',
  },
});

export default withTheme(SettingsScreen);
