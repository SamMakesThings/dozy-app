import * as firebase from 'firebase';
import Expo from 'expo';
import Constants from 'expo-constants';
  
export const FbApp = !firebase.apps.length ? firebase.initializeApp(Constants.manifest.extra.firebase) : firebase.app();

export const FbAuth = firebase.auth();

export const FbLib = firebase;

// Making Firestore happen, testing data retrieval
/* 
var db = firebase.firestore();

var docRef = db.collection("cities").doc("SF");

docRef.get().then(function(doc) {
    if (doc.exists) {
        console.log("Document data:", doc.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});
*/

// Google sign-in functionality
// const clientId = '713165282203-jjc54if1n7krahda9gvkio0siqltq57t.apps.googleusercontent.com';