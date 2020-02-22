import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider as ThemeProvider } from '@draftbit/ui';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset'
import * as Font from 'expo-font'
import * as Icon from '@expo/vector-icons'
import * as Google from 'expo-google-app-auth';
import * as SecureStore from 'expo-secure-store';
import { NavigationContainer } from '@react-navigation/native';
import { FbAuth, FbLib } from "./config/firebaseConfig";
import { slumber_theme } from "./config/slumber_theme";
import '@firebase/firestore';
import AppNavigator from './navigation/AppNavigator';
import GLOBAL from './global';

// Prepare hooks for authentication functions
const AuthContext = React.createContext();

// Root app component
export default function App () {
  /* DELETE this old state if new navigation functions as it should
  state = {
    isLoadingComplete: false,
    user: null,
  }; */

  /*
  // If user is logged in, store that in app state
  componentDidMount() {
    this.subscribeAuthChange(fbUser => { this.setState({ user: fbUser }); console.log(this.state.user);});
    this.subscribeAuthChange(fbUser => { GLOBAL.userData = fbUser });
  }

  // Update auth state as necessary (may remove this with new dynamic nav structure)
  subscribeAuthChange(callback = (user) => void 0) {
    FbAuth.onAuthStateChanged(callback);
  }

  */

  // Copying auth functions from react-navigation guide
  // Sticking it all inside render since Babel seems unable to parse class properties
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: undefined,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  async function _loginWithGoogle () {
    try {
      // NOTE: Current keys only work in Expo dev environment!! To work in standalone apps, need to update hostnames
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
            // this._signInAsync(res); REPLACE THIS
            return (res);
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
  }

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        // userToken = await AsyncStorage.getItem('userToken'); // This is the template code, delete if below line works
        userToken = await SecureStore.getItemAsync('userData');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  // Create authContext so relevant functions are available through the app
  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        // Use my previously defined login function to get user data and store the token
        let userData = _loginWithGoogle();

        // Store the retrieved token in secure async storage
        await SecureStore.setItemAsync('userData', userData);

        dispatch({ type: 'SIGN_IN', token: userData.user.uid });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        // Use my previously defined login function to get user data and store the token
        let userData = _loginWithGoogle();

        // Store the retrieved token in secure async storage
        await SecureStore.setItemAsync('userData', userData);

        dispatch({ type: 'SIGN_IN', token: userData.user.uid });
      },
    }),
    []
  );

  const _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  // Trigger the switch from the loading screen to the app
  const _handleFinishLoading = () => {
    this.setState({ isLoading: false });
  };

  // Load assets async w/Expo tools
  const _loadResourcesAsync = async () => {
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

  // Render a loading screen if loading, otherwise load the main app
  if (state.isLoading) {
    return (
      <AppLoading
        startAsync={_loadResourcesAsync}
        onError={_handleLoadingError}
        onFinish={_handleFinishLoading}
      />
    );
  } else {
    return (
      <AuthContext.Provider value={authContext}>
        <NavigationContainer>
          <View style={styles.container}>
            <ThemeProvider theme={slumber_theme}>
              {Platform.OS === 'ios' ? <StatusBar barStyle="default" /> : []}
              <AppNavigator userToken={state.userToken}/>
            </ThemeProvider>
          </View>
        </NavigationContainer>
      </AuthContext.Provider>
    );
  }
}


// Basic app styles - will move to their own file soon
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#232B3F',
  },
});