import * as SecureStore from 'expo-secure-store';
import { FbLib } from '../config/firebaseConfig';

export default async function refreshUserData(dispatch) {
  let userToken;
  let onboardingComplete = false;
  // let accessToken;
  // let idToken;
  // let providerId;
  let profileData;

  try {
    userToken = await SecureStore.getItemAsync('userId');
    onboardingComplete =
      (await SecureStore.getItemAsync('onboardingComplete')) === 'true';
    // accessToken = await SecureStore.getItemAsync('accessToken');
    // idToken = await SecureStore.getItemAsync('idToken');
    // providerId = await SecureStore.getItemAsync('providerId');
    profileData = await JSON.parse(
      await SecureStore.getItemAsync('profileData')
    );
  } catch (e) {
    console.log('Error in restoring token:', e);
  }

  // TODO: Add token validation
  dispatch({
    type: 'RESTORE_TOKEN',
    token: userToken,
    onboardingComplete: onboardingComplete,
    profileData: profileData
  });

  // Update user's data from Firestore db
  FbLib.firestore()
    .collection('users')
    .doc(userToken)
    .get()
    .then((userData) => {
      dispatch({
        type: 'UPDATE_USERDATA',
        userData: userData.data()
      });
    });
}
