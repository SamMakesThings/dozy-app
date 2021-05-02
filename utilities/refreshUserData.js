import * as SecureStore from 'expo-secure-store';
import { FbLib, FbDb } from '../config/firebaseConfig';

export default async function refreshUserData(dispatch) {
  let userToken;
  // let accessToken;
  // let idToken;
  // let providerId;
  let profileData;

  try {
    userToken = await SecureStore.getItemAsync('userId');
    // accessToken = await SecureStore.getItemAsync('accessToken');
    // idToken = await SecureStore.getItemAsync('idToken');
    // providerId = await SecureStore.getItemAsync('providerId');
    profileData = await JSON.parse(
      await SecureStore.getItemAsync('profileData')
    );

    // TODO: Add token validation
    dispatch({
      type: 'RESTORE_TOKEN',
      token: userToken,
      profileData: profileData
    });

    // Update user's data from Firestore db
    FbDb.collection('users')
      .doc(userToken)
      .get()
      .then((userData) => {
        dispatch({
          type: 'UPDATE_USERDATA',
          userData: userData.data(),
          onboardingComplete: userData.data() != undefined
        });
      });

    // Add a listener so user doc state updates live
    FbDb.collection('users')
      .doc(userToken)
      .onSnapshot((docSnapshot) => {
        dispatch({
          type: 'UPDATE_USERDATA',
          userData: docSnapshot.data(),
          onboardingComplete: docSnapshot.data() != undefined
        });
      });
  } catch (e) {
    console.log('Error in restoring token:', e);
  }
}
