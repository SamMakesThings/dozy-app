import React from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  View,
  LogBox,
  Text
} from 'react-native';
import * as Crypto from 'expo-crypto';
import { Provider as ThemeProvider } from '@draftbit/ui';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import { revokeAsync } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { FbAuth, FbLib, FbDb } from './config/firebaseConfig';
import * as AppleAuthentication from 'expo-apple-authentication';
import { dozy_theme } from './config/Themes';
import '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import AppNavigator from './navigation/AppNavigator';
import { AuthContext } from './utilities/authContext';
import refreshUserData from './utilities/refreshUserData';
import { getMainAppReducer } from './utilities/mainAppReducer';

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
  // Using auth functions from react-navigation guide
  // Full dispatch code in mainAppReducer.ts
  const [state, dispatch] = getMainAppReducer();

  // Auth code snippet from https://docs.expo.io/guides/authentication/#google
  const [request, response, promptLoginAsync] = Google.useAuthRequest({
    // TODO: Move these client IDs to the manifest or another file for cleaner code.
    iosClientId:
      '713165282203-dmren1nkmi5aho4bjm7ssiert19a3fpf.apps.googleusercontent.com',
    androidClientId:
      '713165282203-15rbcpiu517fikvak6c9okehpusbk84e.apps.googleusercontent.com'
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      firebaseAuthGoogle(authentication);
    } else {
      console.log('Login did not succeed');
    }
  }, [response]);

  async function firebaseAuthApple(appleAuthResponse, nonce) {
    dispatch({ type: 'AUTH_LOADING', isAuthLoading: true });
    // Pipe the result of Sign in with Apple into Firebase auth
    const { identityToken } = appleAuthResponse;
    const provider = firebase.auth.AppleAuthProvider;
    const credential = provider.credential(identityToken!, nonce);
    const fbSigninResult = FbAuth.signInWithCredential(credential);
    await processFbLogin(fbSigninResult);
  }

  async function firebaseAuthGoogle(googleAuthResponse) {
    dispatch({ type: 'AUTH_LOADING', isAuthLoading: true });
    // Pipe the result of Google login into Firebase auth
    const { idToken, accessToken } = googleAuthResponse;
    SecureStore.setItemAsync('accessToken', accessToken);
    const credential = FbLib.auth.GoogleAuthProvider.credential(
      idToken,
      accessToken
    );
    // await firebase.auth.setPersistence(FbLib.auth.Auth.Persistence.LOCAL);
    const fbSigninResult = await FbAuth.signInWithCredential(credential);
    await processFbLogin(fbSigninResult);
  }

  async function processFbLogin(result) {
    // Store credentials in SecureStore
    if ('user' in result) {
      SecureStore.setItemAsync('providerId', result.user.providerId);
      SecureStore.setItemAsync('userId', result.user.uid);
      SecureStore.setItemAsync(
        'profileData',
        JSON.stringify(result.additionalUserInfo.profile)
      ).catch((error) => {
        console.log('Error signing in: ' + error);
      });

      // Check if that user's document exists, in order to direct them to or past onboarding
      const userDocExists = await FbDb.collection('users')
        .doc(result.user.uid)
        .get()
        .then((docSnapshot) => {
          return docSnapshot.exists;
        });

      // Update app state accordingly thru context hook function
      dispatch({
        type: 'SIGN_IN',
        token: result.user.uid,
        onboardingComplete: userDocExists,
        profileData: result.additionalUserInfo.profile,
        isAuthLoading: false
      });
    } else {
      console.log('Error signing in (maybe cancelled)');
    }

    // Update user's data from Firestore db
    refreshUserData(dispatch);
  }

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');

    // Update user data from storage and Firebase, update state w/dispatch
    refreshUserData(dispatch);
  }, []);

  // Create authContext so relevant functions are available through the app
  const authContext = {
    dispatch: (argsObject) => {
      dispatch(argsObject);
    },
    state: state,
    signIn: async () => {
      // Fetch and store the relevant auth token
      await promptLoginAsync();
      // Fixes issue where user can't log in after logging out w/o app reload
      if (response?.type === 'success') {
        const { authentication } = response;
        firebaseAuthGoogle(authentication);
      } else {
        // console.log('Login did not succeed');
      }
    },
    signInWithApple: async () => {
      try {
        const nonce = Math.random().toString(36).substring(2, 10);
        const hashedNonce = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          nonce
        );

        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL
          ],
          nonce: hashedNonce
        });

        // console.log('>>>> SIGNED IN WITH APPLE', credential);
        firebaseAuthApple(credential, hashedNonce);
      } catch (e) {
        if (e.code === 'ERR_CANCELED') {
          // handle that the user canceled the sign-in flow
        } else {
          // handle other errors
        }
      }
    },
    signOut: async () => {
      SecureStore.deleteItemAsync('userId');
      dispatch({ type: 'SIGN_OUT' });
      FbAuth.signOut();
      const accessToken = await SecureStore.getItemAsync('accessToken');
      revokeAsync(
        {
          token: accessToken,
          clientId:
            '713165282203-15rbcpiu517fikvak6c9okehpusbk84e.apps.googleusercontent.com'
        },
        Google.discovery
      );
    },
    finishOnboarding: () => {
      dispatch({ type: 'FINISH_ONBOARDING' });
    }
  };

  const _handleLoadingError = (error) => {
    // Add error reporting here
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
            <ThemeProvider theme={dozy_theme}>
              {Platform.OS === 'ios' ? (
                <StatusBar barStyle="light-content" />
              ) : (
                []
              )}
              <AppNavigator
                userId={state.userId}
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
