import React from "react"
import { StatusBar, StyleSheet, Text, Linking } from "react-native"
import { withTheme, ScreenContainer, Container, Icon, Switch, DatePicker, Touchable } from "@draftbit/ui"
import { FbLib } from "../config/firebaseConfig"
import { Notifications } from "expo"
import * as Permissions from 'expo-permissions';
import * as SecureStore from 'expo-secure-store';
import { slumber_theme } from "../config/slumber_theme"

class Root extends React.Component {
  state = {}

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  static navigationOptions = {
    header: null,
  };

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

    pushExpoTokenToFirebase = async () => {
      // Pushing our generated Expo token (for push notifications) into Firestore

      console.log("attempting to push an expo token to Firebase");
      
      var db = FbLib.firestore();
  
      userId = await SecureStore.getItemAsync('userData');
  
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
    userId = await SecureStore.getItemAsync('userData');
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
    userId = await SecureStore.getItemAsync('userData');
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
    userId = await SecureStore.getItemAsync('userData');
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
  }

  render() {
    const theme = slumber_theme;
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_nd}>
        <Container style={styles.Container_nz} elevation={0} useThemeGutterPadding={true}>
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
            User
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
            @slumberapp
          </Text>
        </Container>
        <Container style={styles.Container_ns} elevation={0} useThemeGutterPadding={true}>
          <Touchable style={styles.Touchable_n0} onPress={() => {Linking.openURL("mailto:sam@naritai.co")}}>
            <Container style={styles.Container_nf} elevation={0} useThemeGutterPadding={true}>
              <Text
                style={[
                  styles.Text_nl,
                  theme.typography.body1,
                  {
                    color: theme.colors.strong
                  }
                ]}
              >
                Get Help and Support
              </Text>
              <Icon
                style={styles.Icon_nf}
                name="Ionicons/md-mail"
                size={36}
                color={theme.colors.primary}
              />
            </Container>
          </Touchable>
          <Touchable style={styles.Touchable_n0} onPress={() => {this.registerForPushNotificationsAsync()}}>
            <Container style={styles.Container_nf} elevation={0} useThemeGutterPadding={true}>
              <Text
                style={[
                  styles.Text_nl,
                  theme.typography.body1,
                  {
                    color: theme.colors.strong
                  }
                ]}
              >
                Test push notification key storage
              </Text>
              <Icon
                style={styles.Icon_nf}
                name="Ionicons/md-mail"
                size={36}
                color={theme.colors.primary}
              />
            </Container>
          </Touchable>
          <Container style={styles.Container_ni} elevation={0} useThemeGutterPadding={true}>
            <Text
              style={[
                styles.Text_nv,
                theme.typography.body1,
                {
                  color: theme.colors.strong
                }
              ]}
            >
              Sleep Log Reminders
            </Text>
            <Switch
              style={styles.Switch_n9}
              color={theme.colors.primary}
              disabled={false}
              onValueChange={remindersOn => {
                this.setState({ remindersOn });
                this.updateReminderTime(remindersOn);
                }
              }
              value={this.state.remindersOn}
            />
          </Container>
          <Container style={styles.Container_nw} elevation={0} useThemeGutterPadding={true}>
            <Text
              style={[
                styles.Text_nb,
                theme.typography.body1,
                {
                  color: theme.colors.strong
                }
              ]}
            >
              Reminder Time
            </Text>
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
                this.setState({ reminderTime });
                this.updateRemindersOnOff(reminderTime);
                console.log(this.state);
                }
              }
            />
          </Container>
        </Container>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  Container_nf: {
    minWidth: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 15
    },
  Container_ni: {
    minWidth: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 15
  },
  Container_ns: {
    alignItems: "flex-start"
  },
  Container_nw: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  Container_nz: {
    alignItems: "center",
    marginTop: 20,
  },
  DatePicker_nl: {
    minWidth: 100,
    paddingLeft: 0,
    marginLeft: 0
  },
  Root_nd: {
    justifyContent: "space-around",
    backgroundColor: slumber_theme.colors.background,
  },
  Text_n1: {
    textAlign: "center",
    width: "100%"
  },
  Text_nl: {
    textAlign: "center",
    width: "100%"
  },
  Text_nc: {
    textAlign: "center",
    width: "100%"
  },
  Touchable_n0: {
    paddingBottom: 15
  },
  Icon_nf: {
  }
})

export default withTheme(Root)
