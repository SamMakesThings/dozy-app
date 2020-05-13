/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import TimePickerScreen from '../components/TimePickerScreen';
import NumInputScreen from '../components/NumInputScreen';
import MultiButtonScreen from '../components/MultiButtonScreen';
import TagSelectScreen from '../components/TagSelectScreen';
import { FbLib } from '../config/firebaseConfig';
import GLOBAL from '../global';
import { slumber_theme } from '../config/slumber_theme';

// Define the theme for the file globally
const theme = slumber_theme;

export const BedTimeInput = () => {
  const navigation = useNavigation();
  return (
    <TimePickerScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.bedTime = value;
        navigation.navigate('MinsToFallAsleepInput');
      }}
      navigation={navigation}
      progressBar
      progressBarPercent={0.13}
      questionLabel="What time did you go to bed last night?"
      inputLabel="Bedtime"
    />
  );
};

export const MinsToFallAsleepInput = () => {
  const navigation = useNavigation();
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.minsToFallAsleep = value;
        navigation.navigate('WakeCountInput');
      }}
      navigation={navigation}
      progressBar
      progressBarPercent={0.26}
      questionLabel="Roughly how long did it take you to fall asleep?"
      inputLabel="(in minutes)"
    />
  );
};

export const WakeCountInput = () => {
  const navigation = useNavigation();
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.wakeCount = value;
        navigation.navigate('NightMinsAwakeInput');
      }}
      navigation={navigation}
      buttonValues={[
        { label: "0 (didn't wake up)", value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5+', value: 5 }
      ]}
      progressBar
      progressBarPercent={0.38}
      questionLabel="After falling asleep, about how many times did you wake up in the night?"
    />
  );
};

export const NightMinsAwakeInput = () => {
  const navigation = useNavigation();
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.nightMinsAwake = value;
        navigation.navigate('WakeTimeInput');
      }}
      navigation={navigation}
      progressBar
      progressBarPercent={0.5}
      questionLabel="Roughly how many minutes were you awake in the night in total?"
      inputLabel="(in minutes)"
    />
  );
};

export const WakeTimeInput = () => {
  const navigation = useNavigation();
  return (
    <TimePickerScreen
      theme={theme}
      navigation={navigation}
      progressBar
      progressBarPercent={0.63}
      onQuestionSubmit={(value) => {
        GLOBAL.wakeTime = value;
        navigation.navigate('UpTimeInput');
      }}
      questionLabel="What time did you wake up?"
      inputLabel="Wake time"
    />
  );
};

export const UpTimeInput = () => {
  const navigation = useNavigation();
  return (
    <TimePickerScreen
      theme={theme}
      navigation={navigation}
      progressBar
      progressBarPercent={0.76}
      onQuestionSubmit={(value) => {
        GLOBAL.upTime = value;
        navigation.navigate('SleepRatingInput');
      }}
      defaultValue={GLOBAL.wakeTime}
      questionLabel="What time did you get up?"
      inputLabel="The time you got out of bed"
    />
  );
};

export const SleepRatingInput = () => {
  const navigation = useNavigation();
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.sleepRating = value;
        navigation.navigate('TagsNotesInput');
      }}
      navigation={navigation}
      buttonValues={[
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 }
      ]}
      progressBar
      progressBarPercent={0.87}
      questionLabel="On a scale of 1-5, how would you rate the quality of your sleep last night?"
    />
  );
};

export const TagsNotesInput = () => {
  const navigation = useNavigation();
  return (
    <TagSelectScreen
      theme={theme}
      navigation={navigation}
      touchableTags={[
        { label: 'nothing', icon: 'emoji-happy' },
        { label: 'light', icon: 'light-bulb' },
        { label: 'noise', icon: 'sound' },
        { label: 'pets', icon: 'baidu' },
        { label: 'kids', icon: 'users' },
        { label: 'my partner', icon: 'user' },
        { label: 'heat', icon: 'adjust' },
        { label: 'cold', icon: 'water' },
        { label: 'bad bed', icon: 'bug' },
        { label: 'worry', icon: 'emoji-sad' },
        { label: 'stress', icon: 'new' }
      ]}
      onFormSubmit={async (res) => {
        GLOBAL.notes = res.notes;
        GLOBAL.tags = res.tags;

        // Initialize relevant Firebase values
        var db = FbLib.firestore();
        let userId = await SecureStore.getItemAsync('userData');
        var sleepLogsRef = db
          .collection('users')
          .doc(userId)
          .collection('sleepLogs');

        // Get today's date, turn it into a string
        /* var todayDate = new Date();
        var dd = String(todayDate.getDate()).padStart(2, '0');
        var mm = String(todayDate.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = todayDate.getFullYear();
        const todayDateString = yyyy + '-' + mm + '-' + dd; */

        // If bedtime/sleeptime are in the evening, change them to be the day before
        if (GLOBAL.bedTime > GLOBAL.wakeTime) {
          GLOBAL.bedTime = new Date(
            GLOBAL.bedTime.setDate(GLOBAL.bedTime.getDate() - 1)
          );
        }

        // calculate total time in bed, time between waking & getting up, and time awake in bed
        var minsInBedTotalMs = GLOBAL.upTime - GLOBAL.bedTime;
        var minsInBedTotal = Math.floor(minsInBedTotalMs / 1000 / 60);
        var minsInBedAfterWakingMs = GLOBAL.upTime - GLOBAL.wakeTime;
        var minsInBedAfterWaking = Math.floor(
          minsInBedAfterWakingMs / 1000 / 60
        );
        var minsAwakeInBedTotal =
          parseInt(GLOBAL.nightMinsAwake) +
          parseInt(GLOBAL.minsToFallAsleep) +
          minsInBedAfterWaking;

        // calculate sleep duration & sleep efficiency
        var sleepDuration = minsInBedTotal - minsAwakeInBedTotal;
        var sleepEfficiency = +(sleepDuration / minsInBedTotal).toFixed(2);

        // Write the data to the user's sleep log document in Firebase
        sleepLogsRef
          .add({
            bedTime: GLOBAL.bedTime,
            minsToFallAsleep: parseInt(GLOBAL.minsToFallAsleep),
            wakeCount: GLOBAL.wakeCount,
            nightMinsAwake: parseInt(GLOBAL.nightMinsAwake),
            wakeTime: GLOBAL.wakeTime,
            upTime: GLOBAL.upTime,
            sleepRating: GLOBAL.sleepRating,
            notes: GLOBAL.notes,
            fallAsleepTime: new Date(
              GLOBAL.bedTime.getTime() + GLOBAL.minsToFallAsleep * 60000
            ),
            sleepEfficiency: sleepEfficiency,
            sleepDuration: sleepDuration,
            minsInBedTotal: minsInBedTotal,
            minsAwakeInBedTotal: minsAwakeInBedTotal,
            tags: GLOBAL.tags
          })
          .catch(function (error) {
            console.log('Error pushing sleep log data:', error);
          });

        // Navigate back to the main app
        navigation.navigate('App');
      }}
      progressBar
      progressBarPercent={0.95}
      questionLabel="What, if anything, disturbed your sleep last night?"
      inputLabel="Anything else of note?"
    />
  );
};
