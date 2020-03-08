import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import LogEntry1Screen from '../screens/form_screens/LogEntry1Screen'
import LogEntry2Screen from '../screens/form_screens/LogEntry2Screen'
import LogEntry3Screen from '../screens/form_screens/LogEntry3Screen'
import LogEntry4Screen from '../screens/form_screens/LogEntry4Screen'
import LogEntry5Screen from '../screens/form_screens/LogEntry5Screen'
import LogEntry6Screen from '../screens/form_screens/LogEntry6Screen'
import LogEntry7Screen from '../screens/form_screens/LogEntry7Screen'
import LogEntry8Screen from '../screens/form_screens/LogEntry8Screen'

// Init and define the authentication flow for diary entry
const DiaryEntryStack = createStackNavigator();

// And create the nav components & screens. Will probably remove this later once
// ...I have a better wizard template in place.
export default function DiaryEntryNavigator () {
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