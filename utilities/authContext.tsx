import auth, { firebase, FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  statusCodes,
  User as GoogleUserInfo
} from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
// import refreshUserData from './utilities/refreshUserData';
import * as SecureStore from 'expo-secure-store';
import React, { useContext } from 'react';
import { Alert } from 'react-native';
import AnalyticsEvents from '../constants/AnalyticsEvents';
import { Analytics } from './analytics.service';
import { ACTION, appReducer, AppState, initialState } from './mainAppReducer';
import refreshUserData from './refreshUserData';

export type AuthType = {
  state: AppState;
  dispatch: React.Dispatch<ACTION>;
  signIn: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  finishOnboarding: () => void;
};

const initialAuth: AuthType = {
  state: initialState,
  dispatch: () => {},
  signIn: () => new Promise<void>(() => {}),
  signInWithApple: () => new Promise<void>(() => {}),
  signOut: () => new Promise<void>(() => {}),
  finishOnboarding: () => {}
};

export const AuthContext = React.createContext<AuthType>(initialAuth);

export const AuthProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(appReducer, initialState);
  const signIn = async () => {
    let googleUserInfo: GoogleUserInfo | undefined;

    // Fetch and store the relevant auth token
    // if (!isGoogleSigninConfiguredRef.current) {
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
    //   isGoogleSigninConfiguredRef.current = true;
    // }
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true
      });
      googleUserInfo = await GoogleSignin.signIn();
      console.log('Google user info:', googleUserInfo);
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
  };

  const signOut = async () => {
    SecureStore.deleteItemAsync('userId');
    dispatch({ type: 'SIGN_OUT' });
    await auth().signOut();
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    Analytics.logEvent(AnalyticsEvents.logOut);
    Analytics.setUserId(null);
  };

  const signInWithApple = async () => {
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
  };

  const finishOnboarding = async () => {
    dispatch({ type: 'FINISH_ONBOARDING' });
  };

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
        JSON.stringify(result?.additionalUserInfo?.profile)
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
                onboardingComplete: false,
                lastChat: {
                  message: '',
                  sender: '',
                  sentByUser: true,
                  time: firebase.firestore.Timestamp.now()
                }
              })
              .catch((error) => {
                console.error('Error creating user document: ', error);
              });
            return false; // Report onboarding as incomplete
          } else {
            const onboardingMarkedComplete = docSnapshot?.data()
              ?.onboardingComplete; // might be undefined
            return onboardingMarkedComplete ?? false;
          }
        });

      // Update app state accordingly thru context hook function
      dispatch({
        type: 'SIGN_IN',
        token: result.user.uid,
        onboardingComplete: onboardingComplete,
        profileData: result.additionalUserInfo?.profile ?? {},
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
  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        signIn,
        signOut,
        signInWithApple,
        finishOnboarding
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
