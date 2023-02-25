import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  Platform,
  ActivityIndicator,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import PropTypes from 'prop-types';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { Entypo } from '@expo/vector-icons';
import Intl from 'intl';
import { scale } from 'react-native-size-matters';
import { get } from 'lodash';
import moment from 'moment';
import SleepLogEntryCard from '../components/SleepLogEntryCard';
import { BaselineProgressCard } from '../components/BaselineProgressCard';
import IconTitleSubtitleButton from '../components/IconTitleSubtitleButton';
import { dozy_theme } from '../config/Themes';
import fetchSleepLogs from '../utilities/fetchSleepLogs';
import { Navigation, SleepLog } from '../types/custom';
import { Theme } from '../types/theme';
import fetchTasks from '../utilities/fetchTasks';
import Analytics from '../utilities/analytics.service';
import Auth from '../utilities/auth.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';
import Notification from '../utilities/notification.service';
import { useSelectedDateStore } from '../utilities/selectedDateStore';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Intl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

const SleepLogsView = (props: {
  isLoading: boolean;
  sleepLogs: Array<SleepLog>;
  logEntryRedirect: () => void;
  navigation: Navigation;
}) => {
  const theme = dozy_theme;
  let loggedToday = false;
  let selectedSleepLogs: Array<SleepLog> = [];

  const selectedDate = useSelectedDateStore((state) => state.selectedDate);

  // Determine whether user has logged sleep for the previous night
  if (props.sleepLogs != [] && props.sleepLogs[0]) {
    loggedToday =
      props.sleepLogs[0].upTime.toDate().getDate() === new Date().getDate();

    // Filter available sleep logs based on which month is selected in context
    selectedSleepLogs = props.sleepLogs.filter((log) => {
      const logDate = log.upTime.toDate();
      return (
        logDate.getMonth() == selectedDate.month &&
        logDate.getFullYear() == selectedDate.year
      );
    });
  }

  const onEditLog = useCallback(
    (log: SleepLog): void => {
      props.navigation.navigate('SleepDiaryEntry', {
        screen: 'BedTimeInput',
        params: { logId: log.logId },
      });
      Analytics.logEvent(AnalyticsEvents.editSleepLog);
    },
    [props.navigation],
  );

  if (props.isLoading) {
    // If sleep logs haven't loaded, show indicator
    return (
      <View>
        <IconTitleSubtitleButton
          onPress={() => props.logEntryRedirect()}
          backgroundColor={
            !loggedToday ? theme.colors.primary : theme.colors.medium
          }
          titleLabel={
            loggedToday
              ? 'Log sleep for a different night'
              : 'How did you sleep last night?'
          }
          subtitleLabel={
            loggedToday
              ? 'If you missed a night previously'
              : 'A consistent log improves care'
          }
        />
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
      </View>
    );
  } else if (props.sleepLogs.length === 0) {
    // If there aren't any sleep logs, prompt the first
    return (
      <View style={styles.container}>
        <View style={styles.container}>
          <IconTitleSubtitleButton
            onPress={() => props.logEntryRedirect()}
            backgroundColor={
              !loggedToday ? theme.colors.primary : theme.colors.medium
            }
            titleLabel="How did you sleep last night?"
            subtitleLabel="A consistent log improves care"
          />
        </View>
        <View style={styles.emptyLogContainer}>
          <Entypo
            name={'arrow-with-circle-up'}
            size={scale(51)}
            color={theme.colors.medium}
          />
          <Text
            style={[
              theme.typography.smallLabel,
              styles.emptyLogText,
              { color: theme.colors.medium },
            ]}
          >
            Add your first sleep log above!
          </Text>
        </View>
      </View>
    );
  } else {
    // Otherwise load sleep logs
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <IconTitleSubtitleButton
          onPress={props.logEntryRedirect}
          onPressIn={props.logEntryRedirect}
          delayPressIn={0}
          backgroundColor={
            !loggedToday ? theme.colors.primary : theme.colors.medium
          }
          titleLabel={
            loggedToday
              ? 'Log sleep for a different night'
              : 'How did you sleep last night?'
          }
          subtitleLabel={
            loggedToday
              ? 'If you missed a night previously'
              : 'A consistent log improves care'
          }
        />
        {props.sleepLogs.length < 7 && (
          <BaselineProgressCard nightsLogged={props.sleepLogs.length} />
        )}
        {selectedSleepLogs.map((log) => {
          return (
            <SleepLogEntryCard
              sleepLog={log}
              key={log.logId}
              onEdit={() => onEditLog(log)}
            />
          );
        })}
      </ScrollView>
    );
  }
};

const SleepLogsScreen: React.FC<{ navigation: Navigation; theme: Theme }> = (
  props,
) => {
  // Get global state & dispatch
  const { state, dispatch } = Auth.useAuth();

  // Set local state for loading/not loading
  const [logsLoading, setLogsLoading] = useState(true);

  let colRef: FirebaseFirestoreTypes.CollectionReference;
  let db: FirebaseFirestoreTypes.Module;
  let tasksColRef: FirebaseFirestoreTypes.CollectionReference;

  // Set Firebase DB references if userId is defined
  if (state.userId) {
    db = firestore();
    colRef = db.collection('users').doc(state.userId).collection('sleepLogs');
    tasksColRef = db.collection('users').doc(state.userId).collection('tasks');
  }

  // Function to fetch sleep logs from Firebase and put them in global state
  async function setSleepLogs() {
    async function fetchData() {
      if (!state.userId) return false;
      fetchSleepLogs(db, state.userId)
        .then((sleepLogs: Array<SleepLog>) => {
          // Check that theres >1 entry. If no, set state accordingly
          if (sleepLogs.length === 0) {
            dispatch({ type: 'SET_SLEEPLOGS', sleepLogs: [] });
          } else if (sleepLogs.length === 1) {
            dispatch({ type: 'SET_SLEEPLOGS', sleepLogs: sleepLogs });
            Alert.alert(
              'Done for now',
              "Once you've collected 7 nights of data, we'll get started on improvement.",
              [{ text: 'Ok' }],
            );
          } else {
            dispatch({ type: 'SET_SLEEPLOGS', sleepLogs: sleepLogs });
          }

          setLogsLoading(false);

          return;
        })
        .catch(function (error) {
          console.log('Error getting sleep logs:', error);
        });
    }

    // Setup a listener to fetch new logs from Firebase
    colRef.onSnapshot(function () {
      fetchData();
    });

    // Setup a listener to get new tasks from Firebase
    tasksColRef.onSnapshot(async function () {
      if (!state.userId) return false;
      const tasks = await fetchTasks(db, state.userId);
      dispatch({ type: 'SET_TASKS', tasks: tasks });
    });
  }

  const addSleepLog = useCallback((): void => {
    props.navigation.navigate('SleepDiaryEntry');
    Analytics.logEvent(AnalyticsEvents.addSleepLog);
  }, [props.navigation]);

  // Set sleep logs once upon loading
  useEffect(() => {
    setSleepLogs();
  }, []);

  // Maybe remove DAILY_LOG push notification
  const loggedToday =
    get(state.sleepLogs, 'length', 0) > 0 &&
    moment(state.sleepLogs[0].upTime.toDate()).isSame(new Date(), 'day');

  useEffect(() => {
    if (loggedToday) {
      Notification.removeNotificationsFromTrayByType('DAILY_LOG');
    }
  }, [loggedToday]);

  return (
    <ScreenContainer
      style={styles.sleepLogsScreenContainer}
      hasSafeArea={true}
      scrollable={false}
    >
      <Container
        elevation={0}
        useThemeGutterPadding={true}
        style={styles.container}
      >
        <SleepLogsView
          isLoading={logsLoading}
          sleepLogs={state.sleepLogs || []}
          logEntryRedirect={addSleepLog}
          navigation={props.navigation}
        />
      </Container>
    </ScreenContainer>
  );
};

SleepLogsView.propTypes = {
  sleepLogs: PropTypes.array,
  logEntryRedirect: PropTypes.func,
};

const styles = StyleSheet.create({
  loader: {
    width: scale(45),
    height: scale(45),
    marginTop: '45%',
    alignSelf: 'center',
  },
  container: { flex: 1 },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: scale(15),
  },
  emptyLogContainer: {
    height: scale(325),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyLogText: {
    textAlign: 'center',
    width: '100%',
    fontSize: scale(16),
    marginTop: scale(17),
  },
  // eslint-disable-next-line react-native/no-color-literals
  sleepLogsScreenContainer: {
    flex: 1,
    backgroundColor: '#232B3F',
  },
});

export default withTheme(SleepLogsScreen);