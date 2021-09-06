import React from 'react';
import firestore from '@react-native-firebase/firestore';
import * as SecureStore from 'expo-secure-store';
import { ACTION } from './mainAppReducer';

export default async function refreshUserData(
  dispatch: React.Dispatch<ACTION>,
): Promise<void> {
  let userId;

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
        dispatch({
          type: 'UPDATE_USERDATA',
          userData: userData.data() ?? {},
          onboardingComplete:
            userData.exists && userData.data()?.onboardingComplete === true,
        });
      });

    // Add a listener so user doc state updates live
    firestore()
      .collection('users')
      .doc(userId)
      .onSnapshot((userData) => {
        if (userData) {
          dispatch({
            type: 'UPDATE_USERDATA',
            userData: userData.data() ?? {},
            onboardingComplete:
              userData.exists && userData.data()?.onboardingComplete === true,
          });
        } else {
          console.log("docSnapshot isn't defined at this point");
        }
      });
  } catch (e) {
    console.log('Error in restoring token:', e);
  }
}
