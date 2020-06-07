import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider as ThemeProvider } from '@draftbit/ui';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import * as Google from 'expo-google-app-auth';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { decode, encode } from 'base-64';
import { FbAuth, FbLib } from './config/firebaseConfig';
import { slumber_theme } from './config/Themes';
import '@firebase/firestore';
import AppNavigator from './navigation/AppNavigator';
import { AuthContext } from './utilities/authContext';

// Root app component
export default function App() {
  // Temporary fix for the Firebase "can't find atob" error
  if (!global.btoa) {
    global.btoa = encode;
  }
  if (!global.atob) {
    global.atob = decode;
  }

  // Using auth functions from react-navigation guide
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            onboardingComplete: true
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            onboardingComplete: action.onboardingComplete,
            authLoading: action.isAuthLoading
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null
          };
        case 'AUTH_LOADING':
          return {
            ...prevState,
            authLoading: action.isAuthLoading
          };
        case 'FINISH_LOADING':
          return {
            ...prevState,
            isLoading: false
          };
        case 'FINISH_ONBOARDING':
          return {
            ...prevState,
            onboardingComplete: true
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      onboardingComplete: false,
      profileData: null
    }
  );

  async function _loginWithGoogle() {
    try {
      // NOTE: Current keys only work in Expo dev environment!! To work in standalone apps, need to update hostnames
      // on these keys through the Google Cloud Console.
      const result = await Google.logInAsync({
        // TODO: Move these client IDs to the manifest or another file for cleaner code.
        androidClientId:
          '713165282203-7j7bg1vrl51fnf84rbnvbeeght01o603.apps.googleusercontent.com',
        iosClientId:
          '713165282203-fr943kvhd9rbst5i5ss4g3htgjho143a.apps.googleusercontent.com',
        standaloneAndroidClientId:
          '713165282203-15rbcpiu517fikvak6c9okehpusbk84e.apps.googleusercontent.com',
        iosStandaloneAppClientId:
          '713165282203-dmren1nkmi5aho4bjm7ssiert19a3fpf.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        const { idToken, accessToken } = result;
        dispatch({ type: 'AUTH_LOADING', isAuthLoading: true });
        const credential = FbLib.auth.GoogleAuthProvider.credential(
          idToken,
          accessToken
        );
        await FbAuth.setPersistence(FbLib.auth.Auth.Persistence.LOCAL);
        let fbSigninResult = FbAuth.signInWithCredential(credential);
        return await fbSigninResult;
      } else {
        return { cancelled: true };
      }
    } catch (err) {
      console.log('err from App.js:', err);
    }
  }

  React.useEffect(() => {
    // Fetch the token from storage then navigate to appropriate screen
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await SecureStore.getItemAsync('userId');
      } catch (e) {
        // Restoring token failed
      }

      // TODO: Add token validation
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  // Create authContext so relevant functions are available through the app
  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        // Fetch and store the relevant auth token
        // TODO: Handle errors if sign in fails

        // Use my previously defined login function to get user data and store the token
        _loginWithGoogle().then((result) => {
          // Store credentials in SecureStore
          SecureStore.setItemAsync(
            'accessToken',
            result.credential.accessToken
          );
          SecureStore.setItemAsync('idToken', result.credential.idToken);
          SecureStore.setItemAsync('providerId', result.credential.providerId);
          SecureStore.setItemAsync('userId', result.user.uid);

          // Update app state accordingly thru context hook function
          dispatch({
            type: 'SIGN_IN',
            token: result.user.uid,
            onboardingComplete: !result.additionalUserInfo.isNewUser,
            isAuthLoading: false
          });
        });
      },
      signOut: () => {
        SecureStore.deleteItemAsync('userId');
        dispatch({ type: 'SIGN_OUT' });
      },
      finishOnboarding: () => {
        dispatch({ type: 'FINISH_ONBOARDING' });
      },
      dispatch: (argsObject) => {
        dispatch(argsObject);
      }
    }),
    []
  );

  const _handleLoadingError = (error) => {
    // TODO: Add error reporting here
    console.warn(error);
  };

  // Trigger the switch from the loading screen to the app
  function _handleFinishLoading() {
    dispatch({ type: 'FINISH_LOADING' });
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
  if (state.isLoading) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    );
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <View style={styles.container}>
            <ThemeProvider theme={slumber_theme}>
              {Platform.OS === 'ios' ? <StatusBar barStyle="default" /> : []}
              <AppNavigator
                userToken={state.userToken}
                authLoading={state.authLoading}
                onboardingComplete={state.onboardingComplete}
              />
            </ThemeProvider>
          </View>
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232B3F'
  }
});
