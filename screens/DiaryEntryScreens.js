/* eslint-disable import/prefer-default-export */
import React from 'react';
import moment from 'moment';
import NumInputScreen from '../components/screens/NumInputScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import TagSelectScreen from '../components/screens/TagSelectScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import submitSleepDiaryData from '../utilities/submitSleepDiaryData';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../utilities/authContext';

// Define the theme for the file globally
const theme = dozy_theme;

export const BedTimeInput = ({ navigation }) => {
  // If there is a sleep log recorded, use the most recent
  // bedtime value as a default
  const { state } = React.useContext(AuthContext);
  let defaultDate = moment().hour(22).minute(0).toDate();
  if (state.sleepLogs.length > 0) {
    defaultDate = state.sleepLogs[0].bedTime.toDate();
  }

  return (
    <DateTimePickerScreen
      theme={theme}
      defaultValue={defaultDate}
      onQuestionSubmit={(value) => {
        GLOBAL.bedTime = value;
        navigation.setParams({ progressBarPercent: 0.13 });
        navigation.navigate('MinsToFallAsleepInput', {
          progressBarPercent: 0.26
        });
      }}
      mode="time"
      questionLabel="What time did you go to bed last night?"
      inputLabel="Bedtime"
    />
  );
};

export const MinsToFallAsleepInput = ({ navigation }) => {
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.minsToFallAsleep = value;
        navigation.navigate('WakeCountInput', { progressBarPercent: 0.38 });
      }}
      questionLabel="Roughly how long did it take you to fall asleep?"
      inputLabel="(in minutes)"
    />
  );
};

export const WakeCountInput = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.wakeCount = value;
        navigation.navigate('NightMinsAwakeInput', { progressBarPercent: 0.5 });
      }}
      buttonValues={[
        { label: "0 (didn't wake up)", value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5+', value: 5 }
      ]}
      questionLabel="After falling asleep, about how many times did you wake up in the night?"
    />
  );
};

// TODO: Skip this question if the answer to the previous one was zero
export const NightMinsAwakeInput = ({ navigation }) => {
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.nightMinsAwake = value;
        navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
      }}
      questionLabel="Roughly how many minutes were you awake in the night in total?"
      inputLabel="(in minutes)"
    />
  );
};

export const WakeTimeInput = ({ navigation }) => {
  // If there is a sleep log recorded, use the most recent
  // wake time value as a default
  const { state } = React.useContext(AuthContext);
  let defaultDate = moment().hour(9).minute(0).toDate();
  if (state.sleepLogs.length > 0) {
    defaultDate = state.sleepLogs[0].wakeTime.toDate();
  }

  return (
    <DateTimePickerScreen
      theme={theme}
      defaultValue={defaultDate}
      onQuestionSubmit={(value) => {
        GLOBAL.wakeTime = value;
        navigation.navigate('UpTimeInput', { progressBarPercent: 0.76 });
      }}
      mode="time"
      questionLabel="What time did you wake up?"
      inputLabel="Wake time"
    />
  );
};

export const UpTimeInput = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.upTime = value;
        navigation.navigate('SleepRatingInput', { progressBarPercent: 0.87 });
      }}
      mode="time"
      defaultValue={GLOBAL.wakeTime}
      questionLabel="What time did you get up?"
      inputLabel="The time you got out of bed"
    />
  );
};

export const SleepRatingInput = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.sleepRating = value;
        navigation.navigate('TagsNotesInput', { progressBarPercent: 0.95 });
      }}
      buttonValues={[
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 }
      ]}
      questionLabel="On a scale of 1-5, how would you rate the quality of your sleep last night?"
    />
  );
};

export const TagsNotesInput = ({ navigation }) => {
  return (
    <TagSelectScreen
      theme={theme}
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
        // Update global state with new values
        GLOBAL.notes = res.notes;
        GLOBAL.tags = res.tags;

        // Submit data to Firebase thru helper function
        submitSleepDiaryData();

        // Navigate back to the main app
        navigation.navigate('App');
      }}
      questionLabel="What, if anything, disturbed your sleep last night?"
      inputLabel="Anything else of note?"
    />
  );
};
