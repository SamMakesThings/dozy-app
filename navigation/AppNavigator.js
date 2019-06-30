import React from 'react';
import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import HomeScreen from '../screens/HomeScreen';
import DiaryScreen from '../screens/DiaryScreen';
import LoginTest from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import DiaryEntryScreen from '../screens/DiaryEntryScreen';
import LogEntry1Screen from '../screens/form_screens/LogEntry1Screen';
import LogEntry2Screen from '../screens/form_screens/LogEntry2Screen';
import LogEntry3Screen from '../screens/form_screens/LogEntry3Screen';
import LogEntry4Screen from '../screens/form_screens/LogEntry4Screen';
import LogEntry5Screen from '../screens/form_screens/LogEntry5Screen';
import LogEntry6Screen from '../screens/form_screens/LogEntry6Screen';
import LogEntry7Screen from '../screens/form_screens/LogEntry7Screen';
import LogEntry8Screen from '../screens/form_screens/LogEntry8Screen';


const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator({ SignIn: LoginTest });
const DiaryEntryStack = createStackNavigator(
  {
    LogEntry3Screen: {
      screen: LogEntry3Screen,
      navigationOptions: {
        title: "Log Entry 3"
      }
    },
    LogEntry4Screen: {
      screen: LogEntry4Screen,
      navigationOptions: {
        title: "Log Entry 4"
      }
    },
    LogEntry6Screen: {
      screen: LogEntry6Screen,
      navigationOptions: {
        title: "Log Entry 6"
      }
    },
    LogEntry1Screen: {
      screen: LogEntry1Screen,
      navigationOptions: {
        title: "Log Entry 1"
      }
    },
    LogEntry7Screen: {
      screen: LogEntry7Screen,
      navigationOptions: {
        title: "Log Entry 7"
      }
    },
    LogEntry8Screen: {
      screen: LogEntry8Screen,
      navigationOptions: {
        title: "Log Entry 8"
      }
    },
    LogEntry2Screen: {
      screen: LogEntry2Screen,
      navigationOptions: {
        title: "Log Entry 2"
      }
    },
    LogEntry5Screen: {
      screen: LogEntry5Screen,
      navigationOptions: {
        title: "Log Entry 5"
      }
    }
  },
  {
    headerMode: "none",
    initialRouteName: "LogEntry1Screen"
  }
);

export default createAppContainer(createSwitchNavigator(
  {
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStack,
    App: MainTabNavigator,
    SleepDiaryEntry: DiaryEntryStack
  },
  {
    initialRouteName: 'AuthLoading'
  }));

/*
import { createSwitchNavigator, createStackNavigator, createAppContainer } from 'react-navigation';

// Implementation of HomeScreen, OtherScreen, SignInScreen, AuthLoadingScreen
// goes here.

const AppStack = createStackNavigator({ Home: HomeScreen, Other: OtherScreen });
const AuthStack = createStackNavigator({ SignIn: SignInScreen });

export default createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
*/