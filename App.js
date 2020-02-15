import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider as ThemeProvider } from '@draftbit/ui';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset'
import Constants from 'expo-constants'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'
import AppNavigator from './navigation/AppNavigator';
import { FbAuth } from "./config/firebaseConfig";
import { slumber_theme } from "./config/slumber_theme";
import '@firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
GLOBAL = require('./global');

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    user: null,
  };

  componentDidMount() {
    this.subscribeAuthChange(fbUser => { this.setState({ user: fbUser }); console.log(this.state.user);});
    this.subscribeAuthChange(fbUser => { GLOBAL.userData = fbUser });
  }

  subscribeAuthChange(callback = (user) => void 0) {
    FbAuth.onAuthStateChanged(callback);
  }

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
        <NavigationContainer>
          <View style={styles.container}>
            <ThemeProvider theme={slumber_theme}>
              {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
              <AppNavigator />
            </ThemeProvider>
          </View>
        </NavigationContainer>
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
    backgroundColor: '#232B3F',
  },
});