import React, { Component } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  WebView,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Text,
  TextInput,
  FlatList,
  AsyncStorage,
} from "react-native";
import { FbAuth, FbLib } from "../config/firebaseConfig";
import { withTheme, ScreenContainer, Container, Button } from "@draftbit/ui";
import * as SecureStore from 'expo-secure-store';
import * as Google from 'expo-google-app-auth';
GLOBAL = require('../global');

class LoginScreen extends Component {
  constructor (props) {
    super(props);
    state={}
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content");
  };

  _signInAsync = async (userData) => {
    console.log("this is just before the _signInAsync function is called.");
    // console.log(userData.uid);
    await SecureStore.setItemAsync('userData', userData.user.uid);
    console.log("this is just after the _signInAsync function is called.");
    this.props.navigation.navigate('App');
  }

  _loginWithGoogle = async () => {
    try {
      // NOTE: These keys only work in Expo dev environment!! To work in standalone apps, need to update hostnames
      // on these keys through the Google Cloud Console.
      const result = await Google.logInAsync({
        androidClientId:"713165282203-7j7bg1vrl51fnf84rbnvbeeght01o603.apps.googleusercontent.com",
        iosClientId:"713165282203-fr943kvhd9rbst5i5ss4g3htgjho143a.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      });
  
      if (result.type === "success") {
        const { idToken, accessToken } = result;
        const credential = FbLib.auth.GoogleAuthProvider.credential(idToken, accessToken);
        await FbAuth.setPersistence(FbLib.auth.Auth.Persistence.LOCAL);
        FbAuth
          .signInAndRetrieveDataWithCredential(credential)
          .then(res => {
            // user res, create your user, do whatever you want
            console.log("hey, the login worked!");
            // console.log("here's the result: " + JSON.stringify(res));
            GLOBAL.userData = res;
            console.log(res.user.uid);
            // console.log(GLOBAL.userData);
            this._signInAsync(res);
          })
          .catch(error => {
            console.log("firebase cred err:", error);
          });
      } else {
        return { cancelled: true };
      }
    } catch (err) {
      console.log("err from LoginScreen.js:", err);
    }
  };

  render() {
    const { theme } = this.props;
    return (
      <ScreenContainer hasSafeArea={false} scrollable={false}>
        <Container
          style={{
            minWidth: "100%",
            minHeight: "100%",
            justifyContent: "space-around",
            flexGrow: 1
          }}
          elevation={0}
          backgroundImage="https://apps-draftbit-com.s3.amazonaws.com/nnVD1nJp/assets/a7c432db-7d90-4506-9e09-15bc773ad9bc"
          useThemeGutterPadding={true}
          backgroundImageResizeMode="cover"
        >
          <Container elevation={0} useThemeGutterPadding={true}>
            <Text
              style={[
                theme.typography.headline2,
                {
                  color: theme.colors.strongInverse,
                  textAlign: "center",

                  paddingHorizontal: 0,
                  marginVertical: 0
                }
              ]}
            >
              Welcome to Slumber
            </Text>
            <Text
              style={[
                theme.typography.headline6,
                {
                  color: theme.colors.strongInverse,
                  textAlign: "center",

                  paddingHorizontal: 0,
                  marginVertical: 0
                }
              ]}
            >
              Lets get started.
            </Text>
          </Container>
          <Container
            style={{
              height: 150,
              justifyContent: "space-between"
            }}
            elevation={0}
            useThemeGutterPadding={false}
          >
            <Button
              style={{
                marginTop: 0
              }}
              type="solid"
              color={theme.colors.primary}
              onPress={this._loginWithGoogle}
            >
              Sign Up
            </Button>
            <Button type="outline" color={theme.colors.background} onPress={this._loginWithGoogle}>
              Log In
            </Button>
            <Text
              style={[
                theme.typography.caption,
                {
                  color: theme.colors.lightInverse,
                  textAlign: "center"
                }
              ]}
            >
              Login powered by Google
            </Text>
          </Container>
        </Container>
      </ScreenContainer>
    );
  }
}

export default withTheme(LoginScreen);

/*
class SignInScreen extends React.Component {
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View>
        <Button title="Sign in!" onPress={this._signInAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
      <View>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

*/