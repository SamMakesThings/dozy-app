import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider as ThemeProvider } from '@draftbit/ui';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'
import AppNavigator from './navigation/AppNavigator';
import { FbAuth } from "./config/firebaseConfig";
import { slumber_theme } from "./config/slumber_theme";
import '@firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
GLOBAL = require('./global');

// Prepare hooks for authentication functions
const AuthContext = React.createContext();

// Root app component
export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    user: null,
  };

  // If user is logged in, store that in app state
  componentDidMount() {
    this.subscribeAuthChange(fbUser => { this.setState({ user: fbUser }); console.log(this.state.user);});
    this.subscribeAuthChange(fbUser => { GLOBAL.userData = fbUser });
  };

  // Update auth state as necessary (may remove this with new dynamic nav structure)
  subscribeAuthChange(callback = (user) => void 0) {
    FbAuth.onAuthStateChanged(callback);
  };

  // Copying auth functions from react-navigation guide
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: undefined,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  return (
    <AuthContext.Provider value={authContext}>
      {/* We'll render navigator content here */}
    </AuthContext.Provider>
  );

  // Render a loading screen if loading, otherwise load the main app
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <NavigationContainer> {/* Wrapper component for react-navigation 5.0 */}
          <View style={styles.container}>
            <ThemeProvider theme={slumber_theme}> {/* Theme wrapper for Draftbit theme*/}
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
            </ThemeProvider>
          </View>
        </NavigationContainer>
      );
    }
  }

  // Load assets async w/Expo tools
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  // Trigger the switch from the loading screen to the app
  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

// Basic app styles - will move to their own file soon
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232B3F',
  },
});