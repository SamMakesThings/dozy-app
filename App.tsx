/* eslint-disable @typescript-eslint/naming-convention */
import React from 'react';
import { Provider as ThemeProvider } from '@draftbit/ui';
import * as Icon from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import { LogBox, StatusBar, Text, UIManager, Platform } from 'react-native';
import LoadingOverlay from './components/LoadingOverlay';
import { dozy_theme } from './config/Themes';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import { Updates } from './utilities/updates.service';
import Feedback from './utilities/feedback.service';

// Mute "setting a timer" firebase warnings in console
LogBox.ignoreLogs(['Setting a timer']);
const _console = { ...console };
console.warn = (message: string): void => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

// Disable font scaling app-wide, enable on things it doesn't break
// Hmm - this code throws TS undefined errors, but works. Not sure why.
// @ts-expect-error: Unreachable code error
Text.defaultProps = Text.defaultProps || {};
// @ts-expect-error: Unreachable code error
Text.defaultProps.allowFontScaling = false;

// LayoutAnimation for Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Root app component
export default function App(): React.ReactElement {
  // Using auth functions from react-navigation guide
  // Full dispatch code in mainAppReducer.ts

  const isCheckingUpdate: boolean = Updates.useUpdating();
  const feedbackContextValue = Feedback.useFeedbackService();
  const [isLoading, setIsLoading] = React.useState(true);

  // Create authContext so relevant functions are available through the app

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  const _handleLoadingError = (error: Error) => {
    // Add error reporting here
    console.warn(error);
  };

  // Trigger the switch from the loading screen to the app
  function _handleFinishLoading() {
    setIsLoading(false);
  }

  // Load assets async w/Expo tools
  async function _loadResourcesAsync() {
    await Font.loadAsync({
      ...Icon.Ionicons.font,
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      RubikRegular: require('./assets/fonts/RubikRegular.ttf'),
      RubikMedium: require('./assets/fonts/RubikMedium.ttf'),
      RubikBold: require('./assets/fonts/RubikBold.ttf'),
    });
  }

  // Render a loading screen if loading, otherwise load the main app
  if (isLoading) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    );
  } else {
    return (
      <AuthProvider>
        <Feedback.Context.Provider value={feedbackContextValue}>
          <ThemeProvider theme={dozy_theme}>
            <StatusBar
              barStyle="light-content"
              backgroundColor={dozy_theme.colors.background}
            />
            <AppNavigator />
            {isCheckingUpdate && (
              <LoadingOverlay
                title={isCheckingUpdate ? 'Downloading updates...' : ''}
              />
            )}
          </ThemeProvider>
        </Feedback.Context.Provider>
      </AuthProvider>
    );
  }
}
