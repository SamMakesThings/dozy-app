import * as firebase from 'firebase';
  
firebase.initializeApp(Expo.Constants.manifest.extra.firebase);

export default firebase;