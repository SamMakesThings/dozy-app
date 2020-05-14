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
import { withTheme, ScreenContainer, Container, Button } from '@draftbit/ui';
import PropTypes from 'prop-types';
import '@firebase/firestore';
import { Entypo } from '@expo/vector-icons';
import Intl from 'intl';
import { FbLib } from '../config/firebaseConfig';
import { slumber_theme } from '../config/slumber_theme';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}

const SleepLogEntryCard = (props) => {
  const theme = slumber_theme;
  return (
    <Container
      style={{
        marginTop: 20
      }}
      elevation={0}
      useThemeGutterPadding={false}
    >
      <Container
        style={{
          paddingLeft: 0,
          marginLeft: 28,
          marginBottom: 2
        }}
        elevation={0}
        useThemeGutterPadding={false}
      >
        <Text
          style={[
            theme.typography.headline6,
            {
              color: theme.colors.light,

              width: '100%'
            }
          ]}
        >
          {props.sleepLog.upTime.toDate().toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </Container>
      <Container
        style={{
          minHeight: 200,
          alignContent: 'flex-start',
          flexDirection: 'row',
          paddingVertical: 10,
          borderRadius: theme.borderRadius.global,
          overflow: 'hidden'
        }}
        elevation={2}
        backgroundColor={theme.colors.medium}
        useThemeGutterPadding={true}
      >
        <Container
          style={{
            width: '33%',
            justifyContent: 'space-between',
            alignItems: 'space-between'
          }}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <Container
            style={{
              width: '94%',
              alignSelf: 'flex-start',
              marginHorizontal: 0,
              borderRadius: theme.borderRadius.button,
              overflow: 'hidden'
            }}
            elevation={0}
            backgroundColor={theme.colors.primary}
            useThemeGutterPadding={false}
          >
            <Text
              style={[
                theme.typography.body1,
                {
                  color: theme.colors.secondary,
                  textAlign: 'center',

                  width: '100%',
                  paddingVertical: 8,
                  paddingHorizontal: 2
                }
              ]}
            >
              {props.sleepLog.bedTime.toDate().toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              })}
            </Text>
          </Container>
          <Text
            style={{
              color: theme.colors.light,
              textAlign: 'center',

              width: '100%',
              paddingLeft: 50,
              paddingTop: 1,
              paddingBottom: 0
            }}
          >
            {props.sleepLog.fallAsleepTime
              .toDate()
              .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
              .slice(0, -3)}
          </Text>
          <Text
            style={{
              color: theme.colors.light,
              textAlign: 'center',

              width: '100%',
              paddingLeft: 50,
              paddingTop: 12,
              marginLeft: 0
            }}
          >
            {props.sleepLog.wakeTime
              .toDate()
              .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
              .slice(0, -3)}
          </Text>
          <Container
            style={{
              width: '94%',
              alignSelf: 'flex-start',
              borderRadius: theme.borderRadius.button,
              overflow: 'hidden'
            }}
            elevation={0}
            backgroundColor={theme.colors.secondary}
            useThemeGutterPadding={false}
          >
            <Text
              style={[
                theme.typography.body1,
                {
                  color: theme.colors.primary,
                  textAlign: 'center',

                  width: '100%',
                  paddingVertical: 8,
                  paddingHorizontal: 2
                }
              ]}
            >
              {props.sleepLog.upTime.toDate().toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              })}
            </Text>
          </Container>
        </Container>
        <Container
          style={{
            width: '27%',
            justifyContent: 'space-between',
            alignItems: 'space-between',
            paddingVertical: 8
          }}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',

                width: '100%'
              }
            ]}
          >
            bedtime
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',

                width: '100%'
              }
            ]}
          >
            fell asleep
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',

                width: '100%'
              }
            ]}
          >
            woke up
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',

                width: '100%'
              }
            ]}
          >
            got up
          </Text>
        </Container>
        <Container
          style={{
            width: '40%',
            alignItems: 'space-between',
            alignSelf: 'stretch',
            alignContent: 'space-between'
          }}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <Text
            style={[
              theme.typography.headline5,
              {
                color: theme.colors.secondary,
                textAlign: 'right',

                width: '100%',
                position: 'absolute'
              }
            ]}
          >
            {+(props.sleepLog.sleepDuration / 60).toFixed(1)} hours
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'right',

                width: '100%',
                paddingTop: 0,
                marginTop: 20
              }
            ]}
          >
            duration
          </Text>
          <Text
            style={[
              theme.typography.headline5,
              {
                color: theme.colors.secondary,
                textAlign: 'right',

                width: '100%',
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: 17,
                bottom: 0,
                position: 'absolute'
              }
            ]}
          >
            {props.sleepLog.sleepEfficiency.toString().slice(2)}%
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'right',

                width: '100%',
                bottom: 0,
                position: 'absolute'
              }
            ]}
          >
            sleep efficiency
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

const SleepLogsView = (props) => {
  const theme = slumber_theme;
  if (props.isLoading) {
    // If sleep logs haven't loaded, show indicator
    return (
      <View horizontal={false}>
        <Button
          icon="Ionicons/ios-add-circle"
          type="solid"
          color={theme.colors.primary}
          style={{
            marginTop: 35
          }}
          onPress={() => props.logEntryRedirect()}
        >
          How did you sleep last night?
        </Button>
        <ActivityIndicator style={{ marginTop: '45%' }} />
      </View>
    );
  } else if (props.sleepLogs === null) {
    // If there aren't any sleep logs, prompt the first
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Button
            icon="Ionicons/ios-add-circle"
            type="solid"
            color={theme.colors.primary}
            style={{
              marginTop: 35
            }}
            onPress={() => props.logEntryRedirect()}
          >
            How did you sleep last night?
          </Button>
        </View>
        <View
          style={{
            height: 350,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Entypo
            name={'arrow-with-circle-up'}
            size={56}
            color={theme.colors.medium}
          />
          <Text
            style={[
              theme.typography.body1,
              {
                color: theme.colors.medium,
                textAlign: 'center',
                width: '100%',
                fontSize: 18,
                marginTop: 20
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
        <Button
          icon="Ionicons/ios-add-circle"
          type="solid"
          color={theme.colors.primary}
          style={{
            marginTop: 35
          }}
          onPress={() => props.logEntryRedirect()}
        >
          How did you sleep last night?
        </Button>
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
    const theme = slumber_theme;
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
                  marginTop: 30
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
          ></SleepLogsView>
        </Container>
      </ScreenContainer>
    );
  }
}

SleepLogEntryCard.propTypes = {
  sleepLog: PropTypes.object
};

SleepLogsView.propTypes = {
  sleepLogs: PropTypes.array,
  logEntryRedirect: PropTypes.func
};

Root.propTypes = {
  navigation: PropTypes.any
};

export default withTheme(Root);
