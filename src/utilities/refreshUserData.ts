import React from 'react';
import firestore from '@react-native-firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import { ACTION } from './mainAppReducer';
import { useUserDataStore } from '../utilities/userDataStore';

export default async function refreshUserData(
  dispatch: React.Dispatch<ACTION>,
): Promise<void> {
  let userId;

  const updateUserData = useUserDataStore.getState().updateUserData;
  const setOnboardingComplete =
    useUserDataStore.getState().setOnboardingComplete;

  try {
    userId = await SecureStore.getItemAsync('userId');
    if (userId === null) {
      throw new Error("userId isn't stored in SecureStore, aborting");
    }
    // idToken = await SecureStore.getItemAsync('idToken');
    // providerId = await SecureStore.getItemAsync('providerId');
    const profileJson = await SecureStore.getItemAsync('profileData');

    // TODO: Add token validation
    if (profileJson) {
      const profileData = await JSON.parse(profileJson);
      dispatch({ type: 'RESTORE_TOKEN', token: userId, profileData });
    }

    // Update user's data from Firestore db
    firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then((userData) => {
        updateUserData(userData.data() ?? {});
        userData.exists && userData.data()?.onboardingComplete === true
          ? setOnboardingComplete()
          : null;

        dispatch({ type: 'SET_LOADING', isLoading: false });
      });

    // Add a listener so user doc state updates live
    firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot((userData) => {
        if (userData) {
          updateUserData(userData.data() ?? {});
          userData.exists && userData.data()?.onboardingComplete === true
            ? setOnboardingComplete()
            : null;
        } else {
          console.log("docSnapshot isn't defined at this point");
        }
      });
  } catch (e) {
    console.log('Error in restoring token:', e);
  }
}
