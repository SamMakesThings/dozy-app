import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthLoadingScreen from '../screens/AuthLoadingScreen';
import DiaryEntryNavigator from '../navigation/DiaryEntryNavigator'
import LogEntry1Screen from '../screens/form_screens/LogEntry1Screen';
import LogEntry2Screen from '../screens/form_screens/LogEntry2Screen';
import LogEntry3Screen from '../screens/form_screens/LogEntry3Screen';
import LogEntry4Screen from '../screens/form_screens/LogEntry4Screen';
import LogEntry5Screen from '../screens/form_screens/LogEntry5Screen';
import LogEntry6Screen from '../screens/form_screens/LogEntry6Screen';
import LogEntry7Screen from '../screens/form_screens/LogEntry7Screen';
import LogEntry8Screen from '../screens/form_screens/LogEntry8Screen';


// Create the main app auth navigation flow
// Define the stack navigator
// (do I need individual definitions, or should I just use "Stack" every time?)
const TopStack = createStackNavigator();

// Export the navigation components and screens, with if/then for auth state
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
              component={DiaryEntryNavigator}
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
    </TopStack.Navigator>
  )
};