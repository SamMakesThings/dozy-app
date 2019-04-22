import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { Google } from 'expo';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDt4d8l9OnDz-sr3HhoMi9n7pB5EoDcCRo",
  authDomain: "slumber-app.firebaseapp.com",
  databaseURL: "https://slumber-app.firebaseio.com",
  projectId: "slumber-app",
  storageBucket: "slumber-app.appspot.com"
};

firebase.initializeApp(firebaseConfig);

// Making Firestore happen, testing data retrieval
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

// Google sign-in functionality
const clientId = '713165282203-jjc54if1n7krahda9gvkio0siqltq57t.apps.googleusercontent.com';

const _loginWithGoogle = async function() {
  try {
    const result = await Expo.Google.logInAsync({
      androidClientId:"713165282203-7j7bg1vrl51fnf84rbnvbeeght01o603.apps.googleusercontent.com",
      iosClientId:"YOUR_iOS_CLIENT_ID",
      scopes: ["profile", "email"]
    });

    if (result.type === "success") {
      const { idToken, accessToken } = result;
      const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
      firebase
        .auth()
        .signInAndRetrieveDataWithCredential(credential)
        .then(res => {
          // user res, create your user, do whatever you want
        })
        .catch(error => {
          console.log("firebase cred err:", error);
        });
    } else {
      return { cancelled: true };
    }
  } catch (err) {
    console.log("err:", err);
  }
};

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
