import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';

import BottomTabs from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import DiaryEntryNavigator from './DiaryEntryNavigator';

// Create the main app auth navigation flow
// Define the stack navigator
// (do I need individual definitions, or should I just use "Stack" every time?)
const TopStack = createStackNavigator();

// Set up a loading screen for waiting on Firebase response
function LoadingScreen() {
  return (
    <View
      styles={{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#232B3F',
        padding: 20
      }}
    >
      <ActivityIndicator
        size="large"
        color="#ffffff"
        style={{
          width: 50,
          height: 50,
          marginTop: '100%',
          alignSelf: 'center'
        }}
      />
    </View>
  );
}

// Export the navigation components and screens, with if/then for auth state
export default function InitialAuthNavigator({ userToken, authLoading }) {
  console.log('userToken received in AppNavigator: ');
  console.log(userToken);

  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <TopStack.Navigator
      initialRouteName="AuthLoading"
      screenOptions={{
        headerShown: false
      }}
    >
      {userToken != undefined ? (
        <>
          <TopStack.Screen
            name="App"
            component={BottomTabs /* If logged in, go to the tab navigator */}
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
          options={{
            // If not logged in, jump to the login screen
            header: null
          }}
        />
      )}
    </TopStack.Navigator>
  );
}

InitialAuthNavigator.propTypes = {
  userToken: PropTypes.string,
  authLoading: PropTypes.bool
};
