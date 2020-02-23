import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import BottomTabs from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import DiaryEntryNavigator from './DiaryEntryNavigator';


// Create the main app auth navigation flow
// Define the stack navigator
// (do I need individual definitions, or should I just use "Stack" every time?)
const TopStack = createStackNavigator();

// Export the navigation components and screens, with if/then for auth state
export default function initialAuthNavigator({userToken}) {
  // const isLoggedIn = React.useContext(AuthContext); FIX THIS

  console.log("userToken received in AppNavigator: ")
  console.log(userToken);

  return (
    <TopStack.Navigator
      initialRouteName='AuthLoading'
      screenOptions={{
        headerShown: false
      }}
    >
        {(userToken != undefined ? (
          <>
            <TopStack.Screen
              name="App"
              component={BottomTabs/* If logged in, go to the tab navigator */}
            />
            <TopStack.Screen
              name="SleepDiaryEntry"
              component={DiaryEntryNavigator}
            />
          </>
        ) : (
          <TopStack.Screen
            name="Auth"
            component={LoginScreen}
            options={{ // If not logged in, jump to the login screen
              header: null,
            }}
          />
        ))
      }
    </TopStack.Navigator>
  );
}
