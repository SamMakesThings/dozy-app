import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import { dozy_theme } from '../config/Themes';
import BottomTabs from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import { TreatmentReviewScreen } from '../screens/TreatmentReviewScreen';
import { TreatmentPlanScreen } from '../screens/TreatmentPlanScreen';
import DiaryEntryNavigator from './DiaryEntryNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import HeaderProgressBar from '../components/HeaderProgressBar';

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
        color={dozy_theme.colors.primary}
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
export default function InitialAuthNavigator({
  userToken,
  authLoading,
  onboardingComplete
}) {
  if (authLoading) {
    return <LoadingScreen />;
  }

  return (
    <TopStack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false
      }}
    >
      {userToken != undefined ? (
        <>
          {onboardingComplete === false && (
            <TopStack.Screen
              name="Onboarding"
              component={OnboardingNavigator}
            />
          )}
          <TopStack.Screen
            name="App"
            component={BottomTabs /* If logged in, go to the tab navigator */}
          />
          <TopStack.Screen
            name="TreatmentReview"
            component={TreatmentReviewScreen}
            options={() => ({
              headerShown: true,
              // eslint-disable-next-line react/display-name
              header: ({ scene, navigation }) => {
                return <HeaderProgressBar navigation={navigation} />;
              },
              headerStyle: {
                height: 300
              },
              animationEnabled: true,
              headerTransparent: true
            })}
          />
          <TopStack.Screen
            name="TreatmentPlan"
            component={TreatmentPlanScreen}
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
