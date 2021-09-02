import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as TreatmentScreens from '../screens/PITScreens';
import * as SRTTitrationScreens from '../screens/SRTTitrationScreens';
import HeaderProgressBar from '../components/HeaderProgressBar';
import { TreatmentReviewScreen } from '../screens/TreatmentReviewScreen';

// Init and define the authentication flow for diary entry
const PITStack = createStackNavigator();

const animConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01
  }
};

const Screens = { ...TreatmentScreens, ...SRTTitrationScreens };

// Create a stack screen for each component defined in DiaryEntryScreens
export default function PITNavigator() {
  return (
    <PITStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: true,
        animationEnabled: true
      }}
    >
      {Object.keys(Screens).map((screen) => {
        return (
          <PITStack.Screen
            key={screen}
            name={screen}
            component={Screens[screen]}
            options={() => ({
              title: screen,
              // Use a custom header component with a progressbar
              // eslint-disable-next-line react/display-name
              header: ({ scene, navigation }) => {
                return (
                  <HeaderProgressBar
                    progressBarPercent={
                      scene.route.params !== undefined
                        ? scene.route.params.progressBarPercent
                        : null
                    }
                    navigation={navigation}
                    backButtonDisabled
                  />
                );
              },
              animationEnabled: true,
              headerTransparent: true,
              transitionSpec: {
                open: animConfig,
                close: animConfig
              }
            })}
          />
        );
      })}
      <PITStack.Screen
        name="TreatmentReview"
        component={TreatmentReviewScreen}
        options={() => ({
          headerShown: true,
          // eslint-disable-next-line react/display-name
          header: ({ navigation }) => {
            return <HeaderProgressBar navigation={navigation} />;
          },
          animationEnabled: true,
          headerTransparent: true
        })}
      />
    </PITStack.Navigator>
  );
}
