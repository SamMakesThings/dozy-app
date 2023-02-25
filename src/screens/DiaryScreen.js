import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withTheme } from '@draftbit/ui';
import { Entypo } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import firestore from '@react-native-firebase/firestore';
import momentTZ from 'moment-timezone';
import DiaryEntriesScreen from './DiaryEntriesScreen';
import { DiaryStatsScreen } from './DiaryStatsScreen';
import { dozy_theme } from '../config/Themes';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import Auth from '../utilities/auth.service';
import { decodeServerTime, encodeLocalTime } from '../utilities/time';
import Notification from '../utilities/notification.service';
import Navigation from '../utilities/navigation.service';
import { useSelectedDateStore } from '../utilities/selectedDateStore';

// Create tab nav for switching between entries and stats
const Tab = createMaterialTopTabNavigator();

function DiaryScreen() {
  const theme = dozy_theme;
  const { dispatch, state } = Auth.useAuth();

  // Get selected date from store
  const alterMonthSelection = useSelectedDateStore(
    (state) => state.alterMonthSelection,
  );

  const currentMonthString = useSelectedDateStore((state) =>
    state.selectedDate.date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    }),
  );

  useEffect(() => {
    const maybeUpdateReminderTimezone = async () => {
      const notifications = await firestore()
        .collection('users')
        .doc(state.userId)
        .collection('notifications')
        .get();
      const currentTimezone = momentTZ.tz.guess(true);

      notifications.docs.forEach((querySnapshot) => {
        const notificationData = querySnapshot.data();
        const localDate = decodeServerTime({
          version: notificationData.version,
          value: notificationData.time.toDate(),
          timezone: notificationData.timezone,
        });

        if (
          (notificationData.version === '0.3' &&
            notificationData.timezone !== currentTimezone) ||
          notificationData.version === '0.2'
        ) {
          const encodedTimeData = encodeLocalTime(localDate);
          firestore()
            .collection('users')
            .doc(state.userId)
            .collection('notifications')
            .doc(querySnapshot.id)
            .update(encodedTimeData);

          if (querySnapshot.id === state.userData.logReminderId) {
            firestore()
              .collection('users')
              .doc(state.userId)
              .update({
                reminders: {
                  sleepDiaryReminder: {
                    diaryReminderTime: encodedTimeData.value,
                    version: encodedTimeData.version,
                  },
                },
              });
          }
        }
      });
    };

    Navigation.setIsInTabNavigator(true);

    maybeUpdateReminderTimezone();

    setTimeout(() => {
      if (Notification.notificationTray.length) {
        Notification.processNotification(Notification.notificationTray[0]);
      }
    }, 500);

    return () => Navigation.setIsInTabNavigator(false);
  }, []);

  return (
    <SafeAreaView style={styles.ScreenContainer} edges={['top']}>
      <FocusAwareStatusBar backgroundColor={dozy_theme.colors.medium} />
      <View style={styles.View_MonthSelectContainer}>
        <TouchableOpacity onPress={() => alterMonthSelection(-1)}>
          <Entypo
            name="chevron-left"
            size={scale(24)}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
        <Text
          style={{ ...theme.typography.headline5, ...styles.Text_MonthSelect }}
          allowFontScaling={true}
        >
          {currentMonthString}
        </Text>
        <TouchableOpacity onPress={() => alterMonthSelection(1)}>
          <Entypo
            name="chevron-right"
            size={scale(24)}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: theme.colors.secondary,
          style: {
            backgroundColor: theme.colors.medium,
          },
          indicatorStyle: {
            backgroundColor: theme.colors.secondary,
          },
          labelStyle: {
            fontSize: scale(13),
          },
          tabStyle: {
            paddingBottom: scale(12),
            paddingTop: scale(10),
          },
        }}
        lazy
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Tab.Screen name="Entries" component={DiaryEntriesScreen} />
        <Tab.Screen name="Stats" component={DiaryStatsScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  View_MonthSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: scale(17),
    paddingTop: scale(
      Platform.select({
        ios: dozy_theme.spacing.small,
        android: dozy_theme.spacing.medium,
      }),
    ),
    paddingBottom: scale(5),
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: dozy_theme.colors.medium,
  },
  Text_MonthSelect: {
    color: dozy_theme.colors.secondary,
  },
});

export default withTheme(DiaryScreen);
