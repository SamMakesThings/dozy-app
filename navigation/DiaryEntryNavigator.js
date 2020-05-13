import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from '../screens/DiaryEntryScreens';

// Init and define the authentication flow for diary entry
const DiaryEntryStack = createStackNavigator();

// And create the nav components & screens. Will probably remove this later once
// ...I have a better wizard template in place.
export default function DiaryEntryNavigator() {
  return (
    <DiaryEntryStack.Navigator
      initialRouteName="BedTimeInput"
      screenOptions={{
        headerShown: false
      }}
    >
      <DiaryEntryStack.Screen
        name="BedTimeInput"
        component={Screens.BedTimeInput}
        options={{
          title: 'Bedtime input'
        }}
      />
      <DiaryEntryStack.Screen
        name="MinsToFallAsleepInput"
        component={Screens.MinsToFallAsleepInput}
        options={{
          title: 'Minutes to fall asleep input'
        }}
      />
      <DiaryEntryStack.Screen
        name="WakeCountInput"
        component={Screens.WakeCountInput}
        options={{
          title: 'Wake count input'
        }}
      />
      <DiaryEntryStack.Screen
        name="NightMinsAwakeInput"
        component={Screens.NightMinsAwakeInput}
        options={{
          title: 'Night mins awake input'
        }}
      />
      <DiaryEntryStack.Screen
        name="WakeTimeInput"
        component={Screens.WakeTimeInput}
        options={{
          title: 'Wake time input'
        }}
      />
      <DiaryEntryStack.Screen
        name="UpTimeInput"
        component={Screens.UpTimeInput}
        options={{
          title: 'Up time input'
        }}
      />
      <DiaryEntryStack.Screen
        name="SleepRatingInput"
        component={Screens.SleepRatingInput}
        options={{
          title: 'Sleep rating input'
        }}
      />
      <DiaryEntryStack.Screen
        name="TagsNotesInput"
        component={Screens.TagsNotesInput}
        options={{
          title: 'Tags and notes input'
        }}
      />
    </DiaryEntryStack.Navigator>
  );
}
