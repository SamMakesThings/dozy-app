import React, { Component } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  WebView,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Text,
  TextInput,
  Platform,
  TimePickerAndroid
} from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  TextField,
  Button,
  DatePicker,
  Picker
} from '@draftbit/ui';
import { slumber_theme } from '../config/slumber_theme';
import Intl from 'intl';
if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore(); /*For syntaxerror invalid regular expression unmatched parentheses*/
}
GLOBAL = require('../global');

class TimePicker extends Component {
  constructor(props) {
    super(props);

    this.state = { defaultTime: '10:00 PM' };
  }

  render() {
    if (Platform.OS === 'ios') {
      console.log('iphone detected');
      return <Text>ios time picker not supported yet</Text>;
    } else {
      console.log('android detected');
      return (
        <TextField
          type="underline"
          // titleProp={inputTitle}
          onChange={(defaultTime) => this.setState({ defaultTime })}
          value={this.state.defaultTime}
          multiline={true}
          placeholder="(press to select time)"
          leftIconMode="inset"
          onPress={async () => {
            try {
              const { action, hour, minute } = await TimePickerAndroid.open({
                hour: 14,
                minute: 0,
                is24Hour: false // Will display '2 PM'
              });
              if (action !== TimePickerAndroid.dismissedAction) {
                // Selected hour (0-23), minute (0-59)
                var timestamp = new Date();
                timestamp.setHours(hour, minute, 0);
                formattedTime = timestamp.toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric'
                });

                console.log(formattedTime);
                // const timeInputTitle = this.props.inputTitle;
                // this.setState({ timeInputTitle: timestamp });
                this.value = formattedTime;
              }
            } catch ({ code, message }) {
              console.warn('Cannot open time picker', message);
            }
          }}
        />
      );
    }
  }
}

class Root extends Component {
  constructor(props) {
    super(props);

    this.state = { fallAsleepDuration: 0 };
  }

  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

  render() {
    const theme = slumber_theme;
    return (
      <ScreenContainer
        style={{ backgroundColor: '#232B3F' }}
        hasSafeArea={true}
        scrollable={false}
      >
        <Container
          style={{
            height: '10%',
            alignItems: 'flex-start',
            alignSelf: 'stretch',
            flexDirection: 'row',
            paddingTop: 35
          }}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <IconButton
            style={{
              alignSelf: 'flex-start'
            }}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            // onPress={this.props.navigation.navigate('App')}
          />
          <ProgressBar
            style={{
              minWidth: '50%',
              alignSelf: 'stretch',
              paddingLeft: 0,
              marginLeft: 50
            }}
            progress={0.3}
          />
        </Container>
        <ScrollView horizontal={false}>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              What time did you go to bed last night?
            </Text>
            <DatePicker
              type="underline"
              error={false}
              label="Bedtime"
              disabled={false}
              leftIconMode="inset"
              onDateChange={this.onDateChange}
            />
          </Container>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              Roughly how long did it take you to fall asleep?
            </Text>
            <TextField
              type="underline"
              onChange={(fallAsleepDuration) =>
                this.setState({ fallAsleepDuration })
              }
              value={this.state.fallAsleepDuration}
              multiline={true}
              placeholder="(in minutes)"
              keyboardType="number-pad"
              leftIconMode="inset"
            />
          </Container>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              After falling asleep, about how many times did you wake up in the
              night?
            </Text>
            <Picker
              type="underline"
              error={false}
              label="Select a rating"
              options={[
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' },
                { value: '6+', label: '6+' }
              ]}
              disabled={false}
              onChange={(wakeCount) => this.setState({ wakeCount })}
              value={this.state.wakeCount}
              placeholder="Select a number..."
              leftIconMode="inset"
            />
          </Container>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              Roughly how long were you awake in the night in total?
            </Text>
            <TextField
              type="underline"
              onChange={(nightMinsAwake) => this.setState({ nightMinsAwake })}
              value={this.state.nightMinsAwake}
              multiline={true}
              placeholder="(in minutes)"
              keyboardType="number-pad"
              leftIconMode="inset"
            />
          </Container>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              What time did you last wake up this morning?
            </Text>
            <DatePicker
              type="underline"
              error={false}
              label="Woke up time"
              disabled={false}
              leftIconMode="inset"
              onChange={(bedTime) => this.setState({ bedTime })}
            />
          </Container>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              What time did you get out of bed this morning?
            </Text>
            <DatePicker
              type="underline"
              error={false}
              label="Got up time"
              disabled={false}
              leftIconMode="inset"
              onDateChange={this.onDateChange}
            />
          </Container>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              On a scale of 1-5, how would you rate the quality of your sleep
              last night?
            </Text>
            <Picker
              type="underline"
              error={false}
              label="Select a rating"
              options={[
                { value: '0', label: '0' },
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' },
                { value: '4', label: '4' },
                { value: '5', label: '5' }
              ]}
              disabled={false}
              onChange={(sleepRating) => this.setState({ sleepRating })}
              value={this.state.sleepRating}
              placeholder="Select a rating..."
              leftIconMode="inset"
            />
          </Container>
          <Container
            style={{
              marginTop: 45
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: '100%'
                }
              ]}
            >
              What, if anything, disturbed your sleep last night?
            </Text>
            <TextField
              type="underline"
              onChange={(notes) => this.setState({ notes })}
              value={this.state.notes}
              multiline={true}
              placeholder="(noise, light, cat, etc)"
              keyboardType="default"
              leftIconMode="inset"
            />
          </Container>
          <Container
            style={{
              height: '10%',
              marginTop: 65
            }}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Button
              type="solid"
              color={theme.colors.primary}
              loading={false}
              disabled={false}
            >
              Finish
            </Button>
          </Container>
        </ScrollView>
      </ScreenContainer>
    );
  }
}

export default withTheme(Root);
