import React, { useCallback } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import * as Screens from '../screens/SCTSRTScreens';
import HeaderProgressBar from '../components/HeaderProgressBar';
import { TreatmentReviewScreen } from '../screens/TreatmentReviewScreen';
import FAQScreen from '../screens/FAQScreen';
import AnswerScreen from '../screens/AnswerScreen';

// Init and define the authentication flow for diary entry
const SCTSRTStack = createStackNavigator();

const animConfig = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

// Create a stack screen for each component defined in DiaryEntryScreens
export default function SCTSRTNavigator() {
  const header = useCallback(
    ({ scene, navigation }) => (
      <HeaderProgressBar
        progressBarPercent={
          scene.route.params !== undefined
            ? scene.route.params.progressBarPercent
            : null
        }
        navigation={navigation}
        backButtonDisabled
      />
    ),
    [],
  );

  return (
    <SCTSRTStack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: true,
        animationEnabled: true,
      }}
    >
      {Object.keys(Screens).map((screen) => {
        return (
          <SCTSRTStack.Screen
            key={screen}
            name={screen}
            component={Screens[screen]}
            options={() => ({
              title: screen,
              // Use a custom header component with a progressbar
              // eslint-disable-next-line react/display-name
              header,
              animationEnabled: true,
              headerTransparent: true,
              transitionSpec: {
                open: animConfig,
                close: animConfig,
              },
            })}
          />
        );
      })}
      <SCTSRTStack.Screen
        name="TreatmentReview"
        component={TreatmentReviewScreen}
        options={() => ({
          headerShown: true,
          // eslint-disable-next-line react/display-name
          header: ({ navigation }) => {
            return <HeaderProgressBar navigation={navigation} />;
          },
          animationEnabled: true,
          headerTransparent: true,
        })}
      />
      <SCTSRTStack.Screen
        name="FAQ"
        component={FAQScreen}
        options={() => ({
          // Use a custom header component with a progressbar
          // eslint-disable-next-line react/display-name
          header,
          animationEnabled: true,
          headerTransparent: true,
          transitionSpec: {
            open: animConfig,
            close: animConfig,
          },
        })}
      />
      <SCTSRTStack.Screen
        name="Answer"
        component={AnswerScreen}
        options={() => ({
          // Use a custom header component with a progressbar
          // eslint-disable-next-line react/display-name
          header,
          animationEnabled: true,
          headerTransparent: true,
          transitionSpec: {
            open: animConfig,
            close: animConfig,
          },
        })}
      />
    </SCTSRTStack.Navigator>
  );
}
