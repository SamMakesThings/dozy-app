import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from '../screens/DiaryEntryScreens';

// Init and define the authentication flow for diary entry
const DiaryEntryStack = createStackNavigator();

// Create a stack screen for each component defined in DiaryEntryScreens
export default function DiaryEntryNavigator() {
  return (
    <DiaryEntryStack.Navigator
      initialRouteName="DateTimeInput"
      screenOptions={{
        headerShown: false,
        animationEnabled: false
      }}
    >
      {Object.keys(Screens).map((screen) => {
        return (
          <DiaryEntryStack.Screen
            key={screen}
            name={screen}
            component={Screens[screen]}
            options={{
              title: screen
            }}
          />
        );
      })}
    </DiaryEntryStack.Navigator>
  );
}
