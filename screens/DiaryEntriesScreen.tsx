import React from 'react';
import {
  ScrollView,
  Text,
  Platform,
  ActivityIndicator,
  View,
  Alert,
  FlatList
} from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import PropTypes from 'prop-types';
import '@firebase/firestore';
import firebase from 'firebase/app';
import { Entypo } from '@expo/vector-icons';
import Intl from 'intl';
import { scale } from 'react-native-size-matters';
import SleepLogEntryCard from '../components/SleepLogEntryCard';
import { BaselineProgressCard } from '../components/BaselineProgressCard';
import IconTitleSubtitleButton from '../components/IconTitleSubtitleButton';
import { FbLib } from '../config/firebaseConfig';
import { dozy_theme } from '../config/Themes';
import fetchSleepLogs from '../utilities/fetchSleepLogs';
import { AuthContext } from '../utilities/authContext';
import { Navigation, SleepLog } from '../types/custom';
import fetchTasks from '../utilities/fetchTasks';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

const SleepLogsView = (props: {
  isLoading: boolean;
  sleepLogs: Array<SleepLog>;
  logEntryRedirect: Function;
  navigation: Navigation;
}) => {
  const theme = dozy_theme;
  const { state } = React.useContext(AuthContext);
  let loggedToday = false;
  let selectedSleepLogs: Array<SleepLog> = [];

  // Determine whether user has logged sleep for the previous night
  if (props.sleepLogs != [] && props.sleepLogs[0]) {
    loggedToday =
      props.sleepLogs[0].upTime.toDate().getDate() === new Date().getDate();

    // Filter available sleep logs based on which month is selected in context
    selectedSleepLogs = props.sleepLogs.filter((log) => {
      const logDate = log.upTime.toDate();
      return (
        logDate.getMonth() == state.selectedDate.month &&
        logDate.getFullYear() == state.selectedDate.year
      );
    });
  }

  if (props.isLoading) {
    // If sleep logs haven't loaded, show indicator
    return (
      <View>
        <IconTitleSubtitleButton
          onPress={() => props.logEntryRedirect()}
          backgroundColor={
            !loggedToday ? theme.colors.primary : theme.colors.medium
          }
          titleLabel="How did you sleep last night?"
          subtitleLabel="A consistent log improves treatment"
        />
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{
            width: scale(45),
            height: scale(45),
            marginTop: '45%',
            alignSelf: 'center'
          }}
        />
      </View>
    );
  } else if (props.sleepLogs.length === 0) {
    // If there aren't any sleep logs, prompt the first
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <IconTitleSubtitleButton
            onPress={() => props.logEntryRedirect()}
            backgroundColor={
              !loggedToday ? theme.colors.primary : theme.colors.medium
            }
            titleLabel="How did you sleep last night?"
            subtitleLabel="A consistent log improves treatment"
          />
        </View>
        <View
          style={{
            height: scale(325),
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Entypo
            name={'arrow-with-circle-up'}
            size={scale(51)}
            color={theme.colors.medium}
          />
          <Text
            style={[
              theme.typography.smallLabel,
              {
                color: theme.colors.medium,
                textAlign: 'center',
                width: '100%',
                fontSize: scale(16),
                marginTop: scale(17)
              }
            ]}
          >
            Add your first sleep log above!
          </Text>
        </View>
      </View>
    );
  } else {
    // Otherwise load sleep logs
    var sleepLogs = selectedSleepLogs;
    return (
      <ScrollView horizontal={false}>
        <IconTitleSubtitleButton
          onPress={() => props.logEntryRedirect()}
          backgroundColor={
            !loggedToday ? theme.colors.primary : theme.colors.medium
          }
          titleLabel="How did you sleep last night?"
          subtitleLabel="A consistent log improves treatment"
        />
        {props.sleepLogs.length < 7 && (
          <BaselineProgressCard nightsLogged={props.sleepLogs.length} />
        )}
        {sleepLogs.map((log) => {
          return (
            <SleepLogEntryCard
              sleepLog={log}
              key={log.logId}
              onEdit={(event) =>
                props.navigation.navigate('SleepDiaryEntry', {
                  screen: 'BedTimeInput',
                  params: { logId: log.logId }
                })
              }
            />
          );
        })}
      </ScrollView>
    );
  }
};

const SleepLogsScreen = (props: { navigation: Navigation }) => {
  // Get global state & dispatch
  const { state, dispatch } = React.useContext(AuthContext);

  // Set local state for loading/not loading
  const [logsLoading, setLogsLoading] = React.useState(true);

  let colRef: firebase.firestore.CollectionReference;
  let db: firebase.firestore.Firestore;
  let tasksColRef: firebase.firestore.CollectionReference;

  // Set Firebase DB references if userToken is defined
  if (state.userToken) {
    db = FbLib.firestore();
    colRef = db
      .collection('users')
      .doc(state.userToken)
      .collection('sleepLogs');
    tasksColRef = db
      .collection('users')
      .doc(state.userToken)
      .collection('tasks');
  }

  // Function to fetch sleep logs from Firebase and put them in global state
  async function setSleepLogs() {
    async function fetchData() {
      fetchSleepLogs(db, state.userToken)
        .then((sleepLogs: Array<SleepLog>) => {
          // Check that theres >1 entry. If no, set state accordingly
          if (sleepLogs.length === 0) {
            dispatch({ type: 'SET_SLEEPLOGS', sleepLogs: [] });
          } else if (sleepLogs.length === 1) {
            dispatch({ type: 'SET_SLEEPLOGS', sleepLogs: sleepLogs });
            Alert.alert(
              'Done for now',
              "Once you've collected 7 nights of data, we'll get started on treatment.",
              [{ text: 'Ok' }]
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
      const tasks = await fetchTasks(db, state.userToken);
      dispatch({ type: 'SET_TASKS', tasks: tasks });
    });
  }

  // Set sleep logs once upon loading
  React.useEffect(() => {
    setSleepLogs();
  }, []);

  return (
    <ScreenContainer
      style={{ backgroundColor: '#232B3F' }}
      hasSafeArea={true}
      scrollable={true}
    >
      <Container elevation={0} useThemeGutterPadding={true}>
        <SleepLogsView
          isLoading={logsLoading}
          sleepLogs={state.sleepLogs || []}
          logEntryRedirect={() => props.navigation.navigate('SleepDiaryEntry')}
          navigation={props.navigation}
        />
      </Container>
    </ScreenContainer>
  );
};

SleepLogsView.propTypes = {
  sleepLogs: PropTypes.array,
  logEntryRedirect: PropTypes.func
};

export default withTheme(SleepLogsScreen);
