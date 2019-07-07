import React from "react"
import { StatusBar, StyleSheet, Text, Platform } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  TextField,
  Button,
} from "@draftbit/ui"
import { slumber_theme } from "../../config/slumber_theme";
import { FbAuth, FbLib } from "../../config/firebaseConfig";
import '@firebase/firestore';
import Intl from 'intl';
import { SecureStore } from 'expo';
if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore();/*For syntaxerror invalid regular expression unmatched parentheses*/
}
import GLOBAL from '../../global';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  static navigationOptions = {
    header: null,
  }

  pushSleepLogToFirebase = async () => {
    // Pushing today's sleep log into Firestore
    
    var db = FbLib.firestore();

    userId = await SecureStore.getItemAsync('userData');

    var docRef = db.collection("sleep-logs").doc(userId); //CHANGE THIS CALL

    // Get today's date, turn it into a string
    var todayDate = new Date();
    var dd = String(todayDate.getDate()).padStart(2, '0');
    var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = todayDate.getFullYear();
    todayDateString = yyyy + '-' + mm + '-' + dd;

    // TODO: If bedtime/sleeptime are in the evening, change them to be the day before

    // calculate total time in bed, time between waking & getting up, and time awake in bed
    var minsInBedTotalMs = (GLOBAL.upTime - GLOBAL.bedTime);
    var minsInBedTotal = Math.floor((minsInBedTotalMs/1000)/60);
    var minsInBedAfterWakingMs = GLOBAL.upTime - GLOBAL.wakeTime;
    var minsInBedAfterWaking = Math.floor((minsInBedAfterWakingMs/1000)/60);
    var minsAwakeInBedTotal = (parseInt(GLOBAL.nightMinsAwake) + parseInt(GLOBAL.minsToFallAsleep) + minsInBedAfterWaking);
    
    // calculate sleep duration & sleep efficiency
    var sleepDuration = minsInBedTotal - minsAwakeInBedTotal;
    var sleepEfficiency = +((sleepDuration / minsInBedTotal).toFixed(2));

    // Write the data to the user's sleep log document in Firebase
    docRef.update({
      [todayDateString]: {
        bedTime: GLOBAL.bedTime,
        minsToFallAsleep: parseInt(GLOBAL.minsToFallAsleep),
        wakeCount: GLOBAL.wakeCount,
        nightMinsAwake: parseInt(GLOBAL.nightMinsAwake),
        wakeTime: GLOBAL.wakeTime,
        upTime: GLOBAL.upTime,
        sleepRating: GLOBAL.sleepRating,
        notes: GLOBAL.notes,
        fallAsleepTime: new Date(GLOBAL.bedTime.getTime() + GLOBAL.minsToFallAsleep*60000),
        sleepEfficiency: sleepEfficiency,
        sleepDuration: sleepDuration,
        minsInBedTotal: minsInBedTotal,
        minsAwakeInBedTotal: minsAwakeInBedTotal,
        sleepDuration: sleepDuration,
      },
    }).catch(function(error) {
        console.log("Error pushing sleep log data:", error);
    });
  };

  onFormSubmit (value) {
    GLOBAL.notes = value;
    this.pushSleepLogToFirebase();
    this.props.navigation.navigate("App");
  }

  render() {
    const theme = slumber_theme;
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_nb1}>
        <Container style={styles.Container_nof} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_n9u}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_nuv} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_nn5}
              color={theme.colors.primary}
              progress={0.95}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_n8t} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_nqt,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            What, if anything, disturbed your sleep last night?
          </Text>
          <TextField
            style={styles.TextField_no0}
            type="underline"
            label="(e.g. noise, lights)"
            keyboardType="default"
            leftIconMode="inset"
            onChangeText={notes => this.setState({ notes })}
            onSubmitEditing={(event)=>{
                this.onFormSubmit(event.nativeEvent.text)
            }}
          />
        </Container>
        <Container style={styles.Container_nmw} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_n5c}
            type="solid"
            onPress={() => {
                this.onFormSubmit(this.state.notes)
            }}
            color={theme.colors.primary}
          >
            Finish
          </Button>
        </Container>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  Button_n5c: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n8t: {
    height: "72%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_nmw: {
    height: "15%"
  },
  Container_nof: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nuv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  IconButton_n9u: {
    paddingRight: 0
  },
  ProgressBar_nn5: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_nb1: {
    backgroundColor: slumber_theme.colors.background
  },
  TextField_no0: {},
  Text_nqt: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(Root)
