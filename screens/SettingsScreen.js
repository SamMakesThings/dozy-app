import React from 'react';
import { StyleSheet, Text } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  Icon,
  Switch,
  Touchable,
  DatePicker
} from '@draftbit/ui';
// import { Notifications } from "expo";
// import * as Permissions from 'expo-permissions';
// import * as SecureStore from 'expo-secure-store';
import { FbLib } from '../config/firebaseConfig';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../utilities/authContext';
// import registerForPushNotificationsAsync from '../utilities/pushNotifications';
import planTreatmentModules from '../utilities/planTreatmentModules';

function Root() {
  // state = {}
  /*

  registerForPushNotificationsAsync = async() => {
    console.log("ATTEMPTING TO DO A PUSH NOTIFICATION TOKEN THING...")

    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
  
    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== 'granted') {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
  
    // Stop here if the user did not grant permissions
    if (finalStatus !== 'granted') {
      return;
    }
  
    // Get the token that uniquely identifies this device
    let token = await Notifications.getExpoPushTokenAsync();

    let pushExpoTokenToFirebase = async () => {
      // Pushing our generated Expo token (for push notifications) into Firestore

      console.log("attempting to push an expo token to Firebase");
      
      var db = FbLib.firestore();
  
      let userId = await SecureStore.getItemAsync('userId');
  
      var docRef = db.collection("users").doc(userId);
    
      // Write the token to the user's data document in Firebase
      docRef.update({
        "expoToken": token
      }).catch(function(error) {
          console.log("Error pushing Expo token to Firebase:", error);
      });
    };

    pushExpoTokenToFirebase();

  }

  updateReminderTime = async (newSetting) => {
    // Define variables for the Firebase push
    var db = FbLib.firestore();
    let userId = await SecureStore.getItemAsync('userId');
    var docRef = db.collection("users").doc(userId);

    // Write the new setting (reminder time) to Firebase
    docRef.update({
      "reminderTime": newSetting
    }).catch(function(error) {
      console.log("Error pushing updated reminder time to Firebase:", error);
    })
  }

  updateRemindersOnOff = async (newSetting) => {
    // Define variables for the Firebase push
    var db = FbLib.firestore();
    let userId = await SecureStore.getItemAsync('userId');
    var docRef = db.collection("users").doc(userId);

    // Write the new setting (turning reminders on/off) to Firebase
    docRef.update({
      "remindersOn": newSetting
    }).catch(function(error) {
      console.log("Error pushing reminder on/off to Firebase:", error);
    })
  }

  componentDidMount = async () => {
    // Define variables for the Firebase pull
    var db = FbLib.firestore();
    let userId = await SecureStore.getItemAsync('userId');
    var docRef = db.collection("users").doc(userId);

    // Update displayed settings based on current user settings
    docRef.get().then((userData) => {
      console.log("updating settings from firebase");
      console.log(userData);
      let reminderTime = userData.reminderTime;
      this.setState({ reminderTime });
      console.log(this.state);
    }).catch(function(error) {
      console.log("Error getting settings from Firebase:", error);
    })
  } */

  // Pass along the signOut function from the context provider
  const { state, signOut } = React.useContext(AuthContext);

  // Get theme object
  const theme = dozy_theme;

  let notifFbQuery;
  let notifLogReminderRef;

  // Get various Firebase refs for keeping settings updated
  if (state.userToken !== null) {
    const notifColRef = FbLib.firestore()
      .collection('users')
      .doc(state.userToken)
      .collection('notifications');

    notifLogReminderRef = notifColRef.doc(state.userData.logReminderId);

    notifFbQuery = notifColRef.where('type', '==', 'DAILY_LOG');
  }

  // Add function to pull existing settings from Firebase, update state with them
  function getSettings() {
    notifFbQuery
      .get()
      .then((snapshot) => {
        snapshot.forEach((notif) => {
          const notifData = notif.data();
          dispatch({
            type: 'SET_LOG_REMINDER_TIME',
            time: notifData.time.toDate()
          });
          dispatch({
            type: 'TOGGLE_LOG_NOTIFS',
            enabledStatus: notifData.enabled
          });
          // setNotifsEnabled(notifData.enabled);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Add function to update notification in Firebase based on local state
  function updateFbLogNotification(update) {
    notifLogReminderRef.update(update);
  }

  // Set up a reducer to manage settings state & keep Firebase updated
  // TODO: Have enabling notifs recheck permissions / Expo token
  const [settings, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'TOGGLE_LOG_NOTIFS':
          updateFbLogNotification({
            enabled: action.enabledStatus
          });
          return {
            ...prevState,
            logNotifsEnabled: action.enabledStatus
          };
        case 'SET_LOG_REMINDER_TIME':
          updateFbLogNotification({
            time: action.time
          });
          return {
            ...prevState,
            logReminderTime: action.time
          };
      }
    },
    {
      logReminderTime: new Date(),
      logNotifsEnabled: false
    }
  );

  // Make sure the screen uses updated state once it loads for the first time.
  React.useEffect(() => {
    getSettings();
  }, []);

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_nd}
    >
      <Container
        style={styles.Container_nz}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Icon
          style={styles.Icon_ny}
          name="Ionicons/ios-person"
          size={200}
          color={theme.colors.primary}
        />
        <Text
          style={[
            styles.Text_n1,
            theme.typography.headline3,
            {
              color: theme.colors.strong
            }
          ]}
        >
          {state.profileData.name}
        </Text>
        <Text
          style={[
            styles.Text_nc,
            theme.typography.subtitle2,
            {
              color: theme.colors.light
            }
          ]}
        >
          @dozyapp
        </Text>
      </Container>
      <Container
        style={styles.Container_ns}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Touchable style={styles.Touchable_n0} onPress={signOut}>
          <Container
            style={styles.Container_nf}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                styles.Text_nl,
                theme.typography.smallLabel,
                {
                  color: theme.colors.strong
                }
              ]}
            >
              Log out
            </Text>
            <Icon
              style={styles.Icon_nf}
              name="Ionicons/md-mail"
              size={36}
              color={theme.colors.primary}
            />
          </Container>
        </Touchable>
        <Touchable
          style={styles.Touchable_n0}
          onPress={async () =>
            planTreatmentModules({
              currentTreatments: state.userData.currentTreatments,
              userId: state.userToken
            })
          }
        >
          <Container
            style={styles.Container_nf}
            elevation={0}
            useThemeGutterPadding={true}
          >
            <Text
              style={[
                styles.Text_nl,
                theme.typography.smallLabel,
                {
                  color: theme.colors.strong
                }
              ]}
            >
              Log treatment object
            </Text>
            <Icon
              style={styles.Icon_nf}
              name="Ionicons/md-mail"
              size={36}
              color={theme.colors.primary}
            />
          </Container>
        </Touchable>
        <Container
          style={styles.Container_ni}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Text
            style={[
              styles.Text_nv,
              theme.typography.smallLabel,
              {
                color: theme.colors.strong
              }
            ]}
          >
            Sleep log reminders
          </Text>
          <Switch
            style={styles.Switch_n9}
            color={theme.colors.primary}
            disabled={false}
            value={settings.logNotifsEnabled}
            onValueChange={(value) => {
              dispatch({
                type: 'TOGGLE_LOG_NOTIFS',
                enabledStatus: value
              });
            }}
          />
        </Container>
        <Container
          style={styles.Container_nw}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Text
            style={[
              styles.Text_nb,
              theme.typography.smallLabel,
              {
                color: theme.colors.strong
              }
            ]}
          >
            Reminder time
          </Text>
          <DatePicker
            style={styles.DatePicker_nl}
            mode="time"
            type="solid"
            error={false}
            label="Time"
            disabled={false}
            leftIconMode="inset"
            format="h:MM TT"
            date={settings.logReminderTime}
            onDateChange={(result) => {
              dispatch({ type: 'SET_LOG_REMINDER_TIME', time: result });
            }}
          />
        </Container>
      </Container>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  Container_nf: {
    minWidth: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 15
  },
  Container_ni: {
    minWidth: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 15
  },
  Container_ns: {
    alignItems: 'flex-start'
  },
  Container_nw: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Container_nz: {
    alignItems: 'center',
    marginTop: 20
  },
  DatePicker_nl: {
    minWidth: 100,
    paddingLeft: 0,
    marginLeft: 0
  },
  Root_nd: {
    justifyContent: 'space-around',
    backgroundColor: dozy_theme.colors.background
  },
  Text_n1: {
    textAlign: 'center',
    width: '100%'
  },
  Text_nl: {
    textAlign: 'center',
    width: '100%'
  },
  Text_nc: {
    textAlign: 'center',
    width: '100%'
  },
  Touchable_n0: {
    paddingBottom: 15
  },
  Icon_nf: {}
});

export default withTheme(Root);

/* OLD TIME PICKER - this was causing a toLocaleTimeString error, which means I think it's a Draftbit error.
          <DatePicker
            style={styles.DatePicker_nl}
            mode="time"
            type="solid"
            error={false}
            label="Date"
            disabled={false}
            leftIconMode="inset"
            date={this.state.reminderTime}
            onDateChange={reminderTime => {
              // this.setState({ reminderTime });
              // this.updateRemindersOnOff(reminderTime);
              // console.log(this.state);
              console.log("attempted to set push notifs time change");
              }
            }
          />
*/
