import * as SecureStore from 'expo-secure-store';
import firestore from '@react-native-firebase/firestore';

export default async function refreshUserData(dispatch) {
  let userId;
  // let idToken;
  // let providerId;
  let profileData;

  try {
    userId = await SecureStore.getItemAsync('userId');
    if (userId === null) {
      throw "userId isn't stored in SecureStore, aborting";
    }
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
    firestore()
      .collection('users')
      .doc(userId)
      .get()
      .then((userData) => {
        dispatch({
          type: 'UPDATE_USERDATA',
          userData: userData.data(),
          onboardingComplete:
            userData.exists && userData.data().onboardingComplete === true
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
            userData: userData.data(),
            onboardingComplete:
              userData.exists && userData.data().onboardingComplete === true
          });
        } else {
          console.log("docSnapshot isn't defined at this point");
        }
      });
  } catch (e) {
    console.log('Error in restoring token:', e);
  }
}
