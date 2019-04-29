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
  FlatList
} from "react-native";
import { withTheme, ScreenContainer, Container, Button } from "@draftbit/ui";

// Google login function
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

class Root extends Component {
  state = {};

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    StatusBar.setBarStyle("light-content");
  }

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
            >
              Sign Up
            </Button>
            <Button type="outline" color={theme.colors.background} onPress={_loginWithGoogle}>
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

export default withTheme(Root);