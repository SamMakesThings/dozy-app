import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  Icon,
  Switch,
  Touchable,
  DatePicker
} from '@draftbit/ui';
import firestore from '@react-native-firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../context/AuthContext';
import { Analytics } from '../utilities/analytics.service';
import {
  isNotificationEnabled,
  askNotificationPermission
} from '../utilities/pushNotifications';
import { encodeLocalTime, decodeUTCTime } from '../utilities/time';
import AnalyticsEvents from '../constants/AnalyticsEvents';

function Root() {
  // Pass along the signOut function from the context provider
  const { state, signOut } = React.useContext(AuthContext);

  // Get theme object
  const theme = dozy_theme;

  let notifLogReminderRef;

  // Get various Firebase refs for keeping settings updated
  if (state.userId !== null && state.userData?.logReminderId !== undefined) {
    const notifColRef = firestore()
      .collection('users')
      .doc(state.userId)
      .collection('notifications');

    notifLogReminderRef = notifColRef.doc(state.userData.logReminderId);

    var notifFbQuery = notifColRef.where('type', '==', 'DAILY_LOG');
  }

  // Add function to pull existing settings from Firebase, update state with them
  function getSettings() {
    if (notifFbQuery === undefined) {
      return 'ERROR: Firebase not loading correctly';
    }

    notifFbQuery
      .get()
      .then((snapshot) => {
        snapshot.forEach((notif) => {
          const notifData = notif.data();
          dispatch({
            type: 'SET_LOG_REMINDER_TIME',
            time: decodeUTCTime(notifData.time, notifData.version)
          });
          dispatch({
            type: 'TOGGLE_LOG_NOTIFS',
            enabledStatus: notifData.enabled
          });
          // setNotifsEnabled(notifData.enabled);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Add function to update notification in Firebase based on local state
  function updateFbLogNotification(update) {
    notifLogReminderRef.update(update);
  }

  // Set up a reducer to manage settings state & keep Firebase updated
  // TODO: Have enabling notifs recheck permissions / Expo token
  const [settings, dispatch] = React.useReducer(
    (prevState, action) => {
      let encodedTimeData;

      switch (action.type) {
        case 'TOGGLE_LOG_NOTIFS':
          updateFbLogNotification({
            enabled: action.enabledStatus
          });
          return {
            ...prevState,
            logNotifsEnabled: action.enabledStatus
          };
        case 'SET_LOG_REMINDER_TIME':
          encodedTimeData = encodeLocalTime(action.time);
          updateFbLogNotification({
            time: encodedTimeData.value,
            version: encodedTimeData.version
          });
          return {
            ...prevState,
            logReminderTime: action.time
          };
      }
    },
    {
      logReminderTime: new Date(),
      logNotifsEnabled: false
    }
  );

  // Make sure the screen uses updated state once it loads for the first time.
  React.useEffect(() => {
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
              JSON.stringify(newProfileData)
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
                color: theme.colors.strong
              }
            ]}
          >
            {state.profileData.name || 'Tap here to fix chat'}
          </Text>
          <Text
            style={[
              styles.Text_nc,
              theme.typography.subtitle2,
              {
                color: theme.colors.light
              }
            ]}
          >
            @dozyapp 0.7.12
          </Text>
        </Container>
      </TouchableOpacity>
      <Container
        style={styles.Container_ns}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Touchable style={styles.Touchable_n0} onPress={signOut}>
          <Container
            style={styles.Container_nf}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                styles.Text_nl,
                theme.typography.smallLabel,
                {
                  color: theme.colors.strong,
                  textAlign: 'left'
                }
              ]}
            >
              Log out
            </Text>
            <Icon
              style={styles.Icon_nf}
              name="Ionicons/md-mail"
              size={36}
              color={theme.colors.primary}
            />
          </Container>
        </Touchable>
        <Container
          style={styles.Container_ni}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Text
            style={[
              styles.Text_nv,
              theme.typography.smallLabel,
              {
                color: theme.colors.strong
              }
            ]}
          >
            Sleep log reminders
          </Text>
          <Switch
            style={styles.Switch_n9}
            color={theme.colors.primary}
            disabled={false}
            value={settings.logNotifsEnabled}
            onValueChange={async (value) => {
              dispatch({
                type: 'TOGGLE_LOG_NOTIFS',
                enabledStatus: value
              });
              Analytics.logEvent(AnalyticsEvents.switchSleepLogReminders, {
                enabled: value
              });
              if (value && !(await isNotificationEnabled())) {
                await askNotificationPermission(true);
              }
            }}
          />
        </Container>
        <Container
          style={styles.Container_nw}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Text
            style={[
              styles.Text_nb,
              theme.typography.smallLabel,
              {
                color: theme.colors.strong
              }
            ]}
          >
            Reminder time
          </Text>
          <DatePicker
            style={styles.DatePicker_nl}
            mode="time"
            type="solid"
            error={false}
            label="Time"
            disabled={false}
            leftIconMode="inset"
            format="h:MM TT"
            date={settings.logReminderTime}
            onDateChange={(result) => {
              dispatch({ type: 'SET_LOG_REMINDER_TIME', time: result });
              Analytics.logEvent(AnalyticsEvents.editReminderTime);
            }}
          />
        </Container>
      </Container>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  Container_nf: {
    minWidth: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 15
  },
  Container_ni: {
    minWidth: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 15
  },
  Container_ns: {
    alignItems: 'flex-start'
  },
  Container_nw: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Container_nz: {
    alignItems: 'center',
    marginTop: scale(
      Platform.select({
        ios: dozy_theme.spacing.small,
        android: dozy_theme.spacing.medium
      })
    )
  },
  DatePicker_nl: {
    minWidth: 100,
    paddingLeft: 0,
    marginLeft: 0
  },
  Root_nd: {
    justifyContent: 'space-around',
    backgroundColor: dozy_theme.colors.background
  },
  Text_n1: {
    textAlign: 'center',
    width: '100%'
  },
  Text_nl: {
    textAlign: 'center',
    width: '100%'
  },
  Text_nc: {
    textAlign: 'center',
    width: '100%'
  },
  Touchable_n0: {
    paddingBottom: 15
  },
  Icon_nf: {}
});

export default withTheme(Root);
