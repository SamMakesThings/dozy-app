import React from 'react';
import {
  StatusBar,
  ScrollView,
  Text,
  Platform,
  ActivityIndicator,
  View
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import PropTypes from 'prop-types';
import '@firebase/firestore';
import { Entypo } from '@expo/vector-icons';
import Intl from 'intl';
import { scale } from 'react-native-size-matters';
import SleepLogEntryCard from '../components/SleepLogEntryCard';
import AddSleepLogButton from '../components/AddSleepLogButton';
import { FbLib } from '../config/firebaseConfig';
import { dozy_theme } from '../config/Themes';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

const SleepLogsView = (props) => {
  const theme = dozy_theme;
  let loggedToday = false;

  // Determine whether user has logged sleep for the previous night
  // const loggedToday = props.sleepLogs[0].upTime.toDate().getDay() === new Date().getDay();
  if (props.sleepLogs != null) {
    loggedToday =
      props.sleepLogs[0].upTime.toDate().getDay() === new Date().getDay();
  }

  if (props.isLoading) {
    // If sleep logs haven't loaded, show indicator
    return (
      <View horizontal={false}>
        <AddSleepLogButton
          onPress={() => props.logEntryRedirect()}
          notLoggedToday={!loggedToday}
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
  } else if (props.sleepLogs === null) {
    // If there aren't any sleep logs, prompt the first
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <AddSleepLogButton
            onPress={() => props.logEntryRedirect()}
            notLoggedToday={!loggedToday}
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
    var sleepLogs = props.sleepLogs;
    return (
      <ScrollView horizontal={false}>
        <AddSleepLogButton
          onPress={() => props.logEntryRedirect()}
          notLoggedToday={!loggedToday}
        />
        {sleepLogs.map((log) => {
          return <SleepLogEntryCard sleepLog={log} key={log.upTime.seconds} />;
        })}
      </ScrollView>
    );
  }
};

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sleepLogs: null,
      logsLoading: true
    };
  }

  static navigationOptions = {
    header: null
  };

  _fetchUidFromAsync = async () => {
    let userId = await SecureStore.getItemAsync('userId');
    this.fetchSleepLogs();
    return userId;
  };

  componentDidMount = () => {
    StatusBar.setBarStyle('light-content');
    this._fetchUidFromAsync();
  };

  fetchSleepLogs = async () => {
    // Retrieving sleep logs from Firestore
    let db = FbLib.firestore();
    let userId = await SecureStore.getItemAsync('userId');

    // Pull the sleep diary collection from Firestore, array it
    let colRef = db.collection('users').doc(userId).collection('sleepLogs');

    // Function to retrieve the Firebase data, called in listener below
    async function fetchData() {
      colRef
        .orderBy('upTime', 'desc')
        .get()
        .then((res) => {
          let sleepLogs = [];

          // Check that theres >1 entry. If no, set state accordingly
          if (res.size === 0) {
            this.setState({ logsLoading: false });
            return 0;
          }

          // Otherwise, arrange data and update state
          res.forEach(function (doc) {
            sleepLogs.push(doc.data());
          });
          this.setState({ sleepLogs: sleepLogs, logsLoading: false });
        })
        .catch(function (error) {
          console.log('Error getting sleep logs:', error);
        });
    }

    // Setup a listener to fetch new logs from Firebase
    const fetchDataBound = fetchData.bind(this);
    colRef.onSnapshot(function () {
      fetchDataBound();
    });
  };

  goToLogEntry = () => {
    this.props.navigation.navigate('SleepDiaryEntry');
  };

  render() {
    const theme = dozy_theme;
    return (
      <ScreenContainer
        style={{ backgroundColor: '#232B3F' }}
        hasSafeArea={true}
        scrollable={true}
      >
        <Container elevation={0} useThemeGutterPadding={true}>
          <Container elevation={0} useThemeGutterPadding={true}>
            <Text
              style={[
                theme.typography.headline5,
                {
                  color: theme.colors.secondary,
                  textAlign: 'center',
                  width: '100%',
                  marginTop: scale(26)
                }
              ]}
            >
              Sleep diary
            </Text>
          </Container>
        </Container>
        <Container elevation={0} useThemeGutterPadding={true}>
          <SleepLogsView
            isLoading={this.state.logsLoading}
            sleepLogs={this.state.sleepLogs}
            logEntryRedirect={this.goToLogEntry}
          />
        </Container>
      </ScreenContainer>
    );
  }
}

SleepLogsView.propTypes = {
  sleepLogs: PropTypes.array,
  logEntryRedirect: PropTypes.func
};

Root.propTypes = {
  navigation: PropTypes.any
};

export default withTheme(Root);
