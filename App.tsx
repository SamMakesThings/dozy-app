import { Provider as ThemeProvider } from '@draftbit/ui';
import * as Icon from '@expo/vector-icons';
import '@react-native-firebase/firestore';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import React from 'react';
import { LogBox, Platform, StatusBar, Text } from 'react-native';
import LoadingOverlay from './components/LoadingOverlay';
import { dozy_theme } from './config/Themes';
import AppNavigator from './navigation/AppNavigator';
import { AuthProvider } from './utilities/authContext';
import { Updates } from './utilities/updates.service';

// Mute "setting a timer" firebase warnings in console
LogBox.ignoreLogs(['Setting a timer']);
const _console = { ...console };
console.warn = (message) => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

// Disable font scaling app-wide, enable on things it doesn't break
// Hmm - this code throws TS undefined errors, but works. Not sure why.
// @ts-expect-error
Text.defaultProps = Text.defaultProps || {};
// @ts-expect-error
Text.defaultProps.allowFontScaling = false;

// Root app component
export default function App() {
  const [isLoading, setIsLoading] = React.useState(true);
  // Using auth functions from react-navigation guide
  // Full dispatch code in mainAppReducer.ts

  const isCheckingUpdate: boolean = Updates.useUpdating();

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');

    // Update user data from storage and Firebase, update state w/dispatch
  }, []);

  // Create authContext so relevant functions are available through the app

  const _handleLoadingError = (error) => {
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
      RubikBold: require('./assets/fonts/RubikBold.ttf')
    });
  }

  // Render a loading screen if loading, otherwise load the main app

  if (isLoading)
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    );
  return (
    <AuthProvider>
      <ThemeProvider theme={dozy_theme}>
        {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
        <AppNavigator />
        {isCheckingUpdate && (
          <LoadingOverlay
            title={isCheckingUpdate ? 'Downloading updates...' : ''}
          />
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
