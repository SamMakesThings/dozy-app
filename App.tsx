import React, { useRef } from 'react';
import { Platform, StatusBar, LogBox, Text, Alert } from 'react-native';
import * as Crypto from 'expo-crypto';
import { Provider as ThemeProvider } from '@draftbit/ui';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import * as Icon from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import * as AppleAuthentication from 'expo-apple-authentication';
import { dozy_theme } from './config/Themes';
import '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
  User as GoogleUserInfo
} from '@react-native-google-signin/google-signin';
import AppNavigator from './navigation/AppNavigator';
import { AuthContext } from './utilities/authContext';
import refreshUserData from './utilities/refreshUserData';
import { getMainAppReducer } from './utilities/mainAppReducer';
import { Updates } from './utilities/updates.service';
import LoadingOverlay from './components/LoadingOverlay';
import { Analytics } from './utilities/analytics.service';
import registerForPushNotificationsAsync, {
  updateExpoPushToken
} from './utilities/pushNotifications';
import AnalyticsEvents from './constants/AnalyticsEvents';

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
  const isGoogleSigninConfiguredRef = useRef(false);
  // Using auth functions from react-navigation guide
  // Full dispatch code in mainAppReducer.ts
  const [state, dispatch] = getMainAppReducer();
  const isCheckingUpdate: boolean = Updates.useUpdating();

  async function firebaseAuthApple(
    appleAuthResponse: AppleAuthentication.AppleAuthenticationCredential,
    rawNonce?: string
  ): Promise<void> {
    dispatch({ type: 'AUTH_LOADING', isAuthLoading: true });
    // Pipe the result of Sign in with Apple into Firebase auth
    const { identityToken } = appleAuthResponse;
    const credential = firebase.auth.AppleAuthProvider.credential(
      identityToken!,
      rawNonce
    );
    const fbSigninResult = await auth().signInWithCredential(credential);

    return processFbLogin(fbSigninResult);
  }

  async function firebaseAuthGoogle(googleAuthResponse: GoogleUserInfo) {
    dispatch({ type: 'AUTH_LOADING', isAuthLoading: true });
    // Pipe the result of Google login into Firebase auth
    const { idToken } = googleAuthResponse;
    const credential = auth.GoogleAuthProvider.credential(idToken);
    const fbSigninResult = await auth().signInWithCredential(credential);

    return processFbLogin(fbSigninResult);
  }

  async function processFbLogin(
    result: FirebaseAuthTypes.UserCredential
  ): Promise<void> {
    // Store credentials in SecureStore
    if ('user' in result) {
      SecureStore.setItemAsync('providerId', result.user.providerId);
      SecureStore.setItemAsync('userId', result.user.uid);
      SecureStore.setItemAsync(
        'profileData',
        JSON.stringify(result.additionalUserInfo.profile)
      ).catch((error) => {
        Alert.alert('Signin failed', error.message);
        if (__DEV__) {
          console.log('Error signing in: ' + error);
        }
      });

      // Check if that user's document exists, in order to direct them to or past onboarding
      const onboardingComplete = await firestore()
        .collection('users')
        .doc(result.user.uid)
        .get()
        .then((docSnapshot) => {
          // Check if the user document exists and if onboarding is marked complete.
          // If user doc doesn't exist, create it
          if (!docSnapshot.exists) {
            firestore()
              .collection('users')
              .doc(result.user.uid)
              .set({
                userInfo: {
                  displayName: result.user.displayName,
                  email: result.user.email,
                  uid: result.user.uid,
                  photoURL: result.user.photoURL ?? ''
                },
                onboardingComplete: false
              })
              .catch((error) => {
                console.error('Error creating user document: ', error);
              });
            return false; // Report onboarding as incomplete
          } else {
            const onboardingMarkedComplete = docSnapshot.data()
              .onboardingComplete; // might be undefined
            return onboardingMarkedComplete ? onboardingMarkedComplete : false;
          }
        });

      // Update app state accordingly thru context hook function
      dispatch({
        type: 'SIGN_IN',
        token: result.user.uid,
        onboardingComplete: onboardingComplete,
        profileData: result.additionalUserInfo.profile,
        isAuthLoading: false
      });
      Analytics.logEvent(AnalyticsEvents.logIn);
    } else {
      Alert.alert(
        'Signin failed',
        'Unexpected error occurred! Please try again later.'
      );
      console.log('Error signing in (maybe cancelled)');
    }

    // Update user's data from Firestore db
    refreshUserData(dispatch);
  }

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');

    // Update user data from storage and Firebase, update state w/dispatch
    const subscriber = auth().onAuthStateChanged(async (user) => {
      if (user) {
        refreshUserData(dispatch);

        const userDocRef = firestore().collection('users').doc(user.uid);

        // Check if that user's document exists, in order to direct them to or past onboarding
        const isOnboardingCompleted = await userDocRef
          .get()
          .then((docSnapshot) => {
            // Check if the user document exists and if onboarding is marked complete.
            // If user doc doesn't exist, create it
            if (!docSnapshot.exists) {
              return false; // Report onboarding as incomplete
            } else {
              const onboardingMarkedComplete = docSnapshot.data()
                ?.onboardingComplete; // might be undefined
              return onboardingMarkedComplete || false;
            }
          });
        if (isOnboardingCompleted) {
          const expoPushToken = await registerForPushNotificationsAsync();
          if (expoPushToken) {
            updateExpoPushToken(expoPushToken, user.uid);
          }
        }
      } else {
        dispatch({ type: 'SIGN_OUT' });
        await auth().signOut();
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
    });
    return subscriber;
  }, []);

  // Create authContext so relevant functions are available through the app
  const authContext = {
    dispatch: (argsObject) => {
      dispatch(argsObject);
    },
    state: state,
    signIn: async () => {
      let googleUserInfo: GoogleUserInfo | undefined;

      // Fetch and store the relevant auth token
      if (!isGoogleSigninConfiguredRef.current) {
        GoogleSignin.configure({
          scopes: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
          ],
          webClientId:
            '713165282203-jjc54if1n7krahda9gvkio0siqltq57t.apps.googleusercontent.com',
          offlineAccess: false,
          forceCodeForRefreshToken: false
        });
        isGoogleSigninConfiguredRef.current = true;
      }
      try {
        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true
        });
        googleUserInfo = await GoogleSignin.signIn();
      } catch (error) {
        console.log('error: ', error);
        error.message =
          error.code === statusCodes.SIGN_IN_CANCELLED
            ? ''
            : error.code === statusCodes.IN_PROGRESS
            ? 'Sign in is in progress already.'
            : error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
            ? 'Google play services are not available or outdated.'
            : 'Unknown error happened! Please try again later.';

        if (error.message) {
          Alert.alert('Google Sigin Error', error.message);
        }

        return;
      }

      return firebaseAuthGoogle(googleUserInfo);
    },
    signInWithApple: async () => {
      try {
        const rawNonce = Math.random().toString(36).substring(2, 10);
        const hashedNonce = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          rawNonce
        );

        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL
          ],
          nonce: hashedNonce
        });

        return firebaseAuthApple(credential, rawNonce);
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          Alert.alert('Signin failed', error.message);
        }
      }
    },
    signOut: async () => {
      SecureStore.deleteItemAsync('userId');
      dispatch({ type: 'SIGN_OUT' });
      await auth().signOut();
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      Analytics.logEvent(AnalyticsEvents.logOut);
      Analytics.setUserId(null);
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
        <ThemeProvider theme={dozy_theme}>
          {Platform.OS === 'ios' && <StatusBar barStyle="light-content" />}
          <AppNavigator />
          {(state.authLoading || isCheckingUpdate) && (
            <LoadingOverlay
              title={isCheckingUpdate ? 'Downloading updates...' : ''}
            />
          )}
        </ThemeProvider>
      </AuthContext.Provider>
    );
  }
}
