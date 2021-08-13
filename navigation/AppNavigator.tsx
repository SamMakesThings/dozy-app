import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PropTypes from 'prop-types';
import BottomTabs from './MainTabNavigator';
import LoginScreen from '../screens/LoginScreen';
import { TreatmentReviewScreen } from '../screens/TreatmentReviewScreen';
import TreatmentPlanScreen from '../screens/TreatmentPlanScreen';
import DiaryEntryNavigator from './DiaryEntryNavigator';
import OnboardingNavigator from './OnboardingNavigator';
import SCTSRTNavigator from './SCTSRTNavigator';
import RLXNavigator from './RLXNavigator';
import PITNavigator from './PITNavigator';
import HYGNavigator from './HYGNavigator';
import COG1Navigator from './COG1Navigator';
import ENDNavigator from './ENDNavigator';
import HeaderProgressBar from '../components/HeaderProgressBar';
import { Analytics } from '../utilities/analytics.service';
import { AuthContext } from '../context/AuthContext';
import refreshUserData from '../utilities/refreshUserData';
import { firebase } from '@react-native-firebase/auth';
import { Crashlytics } from '../utilities/crashlytics.service';
import { Text } from 'react-native';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import LoadingOverlay from '../components/LoadingOverlay';

// Create the main app auth navigation flow
// Define the stack navigator
// (do I need individual definitions, or should I just use "Stack" every time?)
const TopStack = createStackNavigator();

// Export the navigation components and screens, with if/then for auth state
interface InitialAuthNavigatorProps {
  userId: string;
  onboardingComplete: boolean;
}
function InitialAuthNavigator({
  userId,
  onboardingComplete
}: InitialAuthNavigatorProps) {
  if (!userId)
    return (
      <TopStack.Screen
        name="Auth"
        component={LoginScreen}
        options={{
          // If not logged in, jump to the login screen
          header: null
        }}
      />
    );

  return (
    <TopStack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false
      }}
    >
      <>
        {onboardingComplete ? (
          <TopStack.Screen
            name="App"
            component={BottomTabs /* If logged in, go to the tab navigator */}
          />
        ) : (
          <TopStack.Screen name="Onboarding" component={OnboardingNavigator} />
        )}
        <TopStack.Screen
          name="TreatmentReview"
          component={TreatmentReviewScreen}
          options={() => ({
            headerShown: true,
            // eslint-disable-next-line react/display-name
            header: ({ navigation }) => {
              return (
                <HeaderProgressBar navigation={navigation} backButtonDisabled />
              );
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
          options={() => ({
            headerShown: true,
            // eslint-disable-next-line react/display-name
            header: ({ navigation }) => {
              return (
                <HeaderProgressBar navigation={navigation} backButtonDisabled />
              );
            },
            headerStyle: {
              height: 300
            },
            animationEnabled: true,
            headerTransparent: true
          })}
        />
        <TopStack.Screen
          name="SleepDiaryEntry"
          component={DiaryEntryNavigator}
        />
        <TopStack.Screen name="SCTSRT" component={SCTSRTNavigator} />
        <TopStack.Screen name="RLX" component={RLXNavigator} />
        <TopStack.Screen name="PIT" component={PITNavigator} />
        <TopStack.Screen name="HYG" component={HYGNavigator} />
        <TopStack.Screen name="COG1" component={COG1Navigator} />
        <TopStack.Screen name="END" component={ENDNavigator} />
      </>
    </TopStack.Navigator>
  );
}

InitialAuthNavigator.propTypes = {
  userId: PropTypes.string,
  authLoading: PropTypes.bool
};

export default function AppNavigator() {
  const { state, dispatch } = useContext(AuthContext);
  const { navigationRef, onStateChange } = Analytics.useAnalytics(state.userId);
  Crashlytics.useCrashlytics(state.userId);

  React.useEffect(() => {
    // Update user data from storage and Firebase, update state w/dispatch
    const subscriber = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        refreshUserData(dispatch);
      } else {
        dispatch({ type: 'SIGN_OUT' });
        await firebase.auth().signOut();
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    });
    return subscriber;
  }, []);

  if (state.authLoading) return <LoadingOverlay />;
  return (
    // <NavigationContainer>
    <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
      <View style={styles.container}>
        <InitialAuthNavigator
          userId={state.userId}
          onboardingComplete={state.onboardingComplete}
        />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232B3F'
  }
});
