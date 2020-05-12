import React from "react"
import {
  withTheme,
} from "@draftbit/ui"
import * as SecureStore from 'expo-secure-store';
import TagSelectScreen from '../../components/TagSelectScreen'
import { FbLib } from "../../config/firebaseConfig";
import GLOBAL from '../../global'

const LogEntry8Screen = props => {
  const { theme } = props
  return (
    <TagSelectScreen
      theme={theme}
      navigation={props.navigation}
      onFormSubmit={async res => {
        GLOBAL.notes = res.notes;
        GLOBAL.tags = res.tags;

        // Initialize relevant Firebase values
        var db = FbLib.firestore();
        let userId = await SecureStore.getItemAsync('userData');
        var docRef = db.collection("sleep-logs").doc(userId); //CHANGE THIS CALL
    
        // Get today's date, turn it into a string
        var todayDate = new Date();
        var dd = String(todayDate.getDate()).padStart(2, '0');
        var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = todayDate.getFullYear();
        const todayDateString = yyyy + '-' + mm + '-' + dd;
    
        // If bedtime/sleeptime are in the evening, change them to be the day before
        if (GLOBAL.bedTime > GLOBAL.wakeTime) {
          GLOBAL.bedTime = new Date(GLOBAL.bedTime.setDate(GLOBAL.bedTime.getDate() - 1));
        }
    
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
          },
        }).catch(function(error) {
            console.log("Error pushing sleep log data:", error);
        });

        // Navigate back to the main app
        props.navigation.navigate("App");
      }}
      progressBar
      progressBarPercent={0.95}
      questionLabel="What, if anything, disturbed your sleep last night?"
      inputLabel="Anything else of note?"
    />
  )
}

export default withTheme(LogEntry8Screen)
