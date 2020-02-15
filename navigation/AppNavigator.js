import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import LogEntry1Screen from '../screens/form_screens/LogEntry1Screen';
import LogEntry2Screen from '../screens/form_screens/LogEntry2Screen';
import LogEntry3Screen from '../screens/form_screens/LogEntry3Screen';
import LogEntry4Screen from '../screens/form_screens/LogEntry4Screen';
import LogEntry5Screen from '../screens/form_screens/LogEntry5Screen';
import LogEntry6Screen from '../screens/form_screens/LogEntry6Screen';
import LogEntry7Screen from '../screens/form_screens/LogEntry7Screen';
import LogEntry8Screen from '../screens/form_screens/LogEntry8Screen';


// const AuthStack = createStackNavigator({ SignIn: LoginScreen }); DELETE THIS LINE IF 5.0 NAV IS WORKING
const DiaryEntryStack = createStackNavigator();

function diaryEntryNavigator () {
  return (
    <DiaryEntryStack.Navigator
      initialRouteName='LogEntry1Screen'
    >
      <DiaryEntryStack.Screen
        name="LogEntry1Screen"
        component={LogEntry1Screen}
        options={{
          title: "Log Entry 1"
        }}
      />
      <DiaryEntryStack.Screen
        name="LogEntry2Screen"
        component={LogEntry2Screen}
        options={{
          title: "Log Entry 2"
        }}
      />
      <DiaryEntryStack.Screen
        name="LogEntry3Screen"
        component={LogEntry3Screen}
        options={{
          title: "Log Entry 3"
        }}
      />
      <DiaryEntryStack.Screen
        name="LogEntry4Screen"
        component={LogEntry4Screen}
        options={{
          title: "Log Entry 4"
        }}
      />
      <DiaryEntryStack.Screen
        name="LogEntry5Screen"
        component={LogEntry5Screen}
        options={{
          title: "Log Entry 5"
        }}
      />
      <DiaryEntryStack.Screen
        name="LogEntry6Screen"
        component={LogEntry6Screen}
        options={{
          title: "Log Entry 6"
        }}
      />
      <DiaryEntryStack.Screen
        name="LogEntry7Screen"
        component={LogEntry7Screen}
        options={{
          title: "Log Entry 7"
        }}
      />
      <DiaryEntryStack.Screen
        name="LogEntry8Screen"
        component={LogEntry8Screen}
        options={{
          title: "Log Entry 8"
        }}
      />
    </DiaryEntryStack.Navigator>

    
    
  );
};
/*
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
  } */

const TopStack = createStackNavigator();

export default function initialAuthNavigator() {
  return (
    <TopStack.Navigator
      initialRouteName='AuthLoading'
    >
      {state=isLoading}
      {isLoggedIn ? (
          <>
            <TopStack.Screen 
              name="App"
              component={MainTabNavigator}
            />
            <TopStack.Screen
              name="SleepDiaryEntry"
              component={diaryEntryNavigator}
            />
            <TopStack.Screen
              name="AuthLoading"
              component={AuthLoadingScreen}
            />
          </>
        ) : (
          <TopStack.Screen
            name="Auth"
            component={LoginScreen}
            options={{
              header: null
            }}
          />
        )}
      <TopStack.Screen 
        name="App"
        component={MainTabNavigator}
      />
      <TopStack.Screen
        name="SleepDiaryEntry"
        component={diaryEntryNavigator}
      />
      <TopStack.Screen
        name="AuthLoading"
        component={AuthLoadingScreen}
      />
      {/* 4.0 NAV HERE - DELETE IF 5.0 IS WORKING
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
      } */}
    </TopStack.Navigator>
  )
};