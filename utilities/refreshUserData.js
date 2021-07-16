import * as SecureStore from 'expo-secure-store';
import { FbLib, FbDb } from '../config/firebaseConfig';

export default async function refreshUserData(dispatch) {
  let userId;
  // let accessToken;
  // let idToken;
  // let providerId;
  let profileData;

  try {
    userId = await SecureStore.getItemAsync('userId');
    if (userId === null) {
      throw "userId isn't stored in SecureStore, aborting";
    }
    // accessToken = await SecureStore.getItemAsync('accessToken');
    // idToken = await SecureStore.getItemAsync('idToken');
    // providerId = await SecureStore.getItemAsync('providerId');
    profileData = await JSON.parse(
      await SecureStore.getItemAsync('profileData')
    );

    // TODO: Add token validation
    dispatch({
      type: 'RESTORE_TOKEN',
      token: userId,
      profileData: profileData
    });

    // Update user's data from Firestore db
    FbDb.collection('users')
      .doc(userId)
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
      .doc(userId)
      .onSnapshot((docSnapshot) => {
        if (docSnapshot) {
          dispatch({
            type: 'UPDATE_USERDATA',
            userData: docSnapshot.data(),
            onboardingComplete: docSnapshot.data() != undefined
          });
        } else {
          console.log("docSnapshot isn't defined at this point");
        }
      });
  } catch (e) {
    console.log('Error in restoring token:', e);
  }
}
