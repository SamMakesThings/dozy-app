import React from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default class AuthLoadingScreen extends React.Component {
  constructor(props: object) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userId = await SecureStore.getItemAsync('userId');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(userId ? 'App' : 'Auth'); DELETE this if 5.x is working
  };

  // Render loading content
  render() {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
}
