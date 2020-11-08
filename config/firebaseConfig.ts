import * as firebase from 'firebase';
import 'firebase/firestore';
import Constants from 'expo-constants';

export const FbApp = !firebase.apps.length
  ? firebase.initializeApp(Constants.manifest.extra.firebase)
  : firebase.app();

export const FbAuth = firebase.auth();

export const FbLib = firebase;

export const FbDb = firebase.firestore();

// Need projectId, apiKey, appId and messagingSenderId

// Google sign-in functionality
// const clientId = '713165282203-jjc54if1n7krahda9gvkio0siqltq57t.apps.googleusercontent.com';
