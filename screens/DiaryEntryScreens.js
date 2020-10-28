/* eslint-disable import/prefer-default-export */
import React from 'react';
import moment from 'moment';
import NumInputScreen from '../components/screens/NumInputScreen';
import TextInputScreen from '../components/screens/TextInputScreen';
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
  if (state.sleepLogs && state.sleepLogs.length > 0) {
    defaultDate = moment()
      .hour(state.sleepLogs[0].bedTime.toDate().getHours())
      .minute(state.sleepLogs[0].bedTime.toDate().getMinutes())
      .toDate();
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
      validInputChecker={(val) => {
        // Make sure the selected time isn't between 8:00 and 18:00, a likely sign of AM/PM mixup
        return !(moment(val).hour() > 8 && moment(val).hour() < 18)
          ? true
          : 'Did you set AM/PM correctly? Selected time is unusual for a bedtime';
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
      validInputChecker={(val) => {
        if (val < 0) {
          return 'Please enter a non-negative number';
        } else if (val > 1200) {
          return 'Entered number of minutes is too large. Is this a typo?';
        } else {
          return true;
        }
      }}
      questionLabel="Roughly how long did it take you to fall asleep?"
      inputLabel="(in minutes)"
    />
  );
};

export const WakeCountInput = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.wakeCount = value;
        // If SCTSRT has started, navigate to SCT questions
        // If user didn't wake in the night, skip asking how long they were awake
        if (state.userData.currentTreatments.SCTSRT) {
          navigation.navigate('SCTUpCountInput', { progressBarPercent: 0.5 });
        } else if (value === 0) {
          navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
          GLOBAL.nightMinsAwake = 0;
        } else {
          navigation.navigate('NightMinsAwakeInput', {
            progressBarPercent: 0.5
          });
        }
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

// If SCTSRT started, show SCT question screens
export const SCTUpCountInput = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.SCTUpCount = value;
        navigation.navigate('SCTAnythingNonSleepInBedInput', {
          progressBarPercent: 0.55
        });
      }}
      buttonValues={[
        { label: "0 (didn't get up)", value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5+', value: 5 }
      ]}
      questionLabel="(SCT) Following rule 2, how many times did you get out of bed when unable to sleep for more than 15 minutes?"
    />
  );
};

// If SCTSRT started, show SCT question screens
export const SCTAnythingNonSleepInBedInput = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.SCTAnythingNonSleepInBed = value === 1;
        // If user says they did something not sleep in bed, ask what (text input)
        if (value === 1) {
          navigation.navigate('SCTNonSleepActivitiesInput', {
            progressBarPercent: 0.6
          });
        } else {
          navigation.navigate('SCTDaytimeNapsInput', {
            progressBarPercent: 0.6
          });
        }
      }}
      buttonValues={[
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 }
      ]}
      questionLabel="(SCT) Did you do anything in bed besides sleeping? (e.g. use phone, watch tv, read a book. Sex excluded 🙈)"
    />
  );
};

export const SCTNonSleepActivitiesInput = ({ navigation }) => {
  return (
    <TextInputScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.SCTNonSleepActivities = value;
        navigation.navigate('SCTDaytimeNapsInput', {
          progressBarPercent: 0.63
        });
      }}
      questionLabel="(SCT) What were you doing besides sleeping?"
      inputLabel="(e.g. reading, using phone)"
    />
  );
};

export const SCTDaytimeNapsInput = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.SCTDaytimeNaps = value === 1;
        // If user didn't wake in the night, skip asking how long they were awake
        if (GLOBAL.wakeCount === 0) {
          navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
          GLOBAL.nightMinsAwake = 0;
        } else {
          navigation.navigate('NightMinsAwakeInput', {
            progressBarPercent: 0.61
          });
        }
      }}
      buttonValues={[
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 }
      ]}
      questionLabel="(SCT) Did you take any daytime naps longer than 30 minutes yesterday?"
    />
  );
};

export const NightMinsAwakeInput = ({ navigation }) => {
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.nightMinsAwake = value;
        navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
      }}
      validInputChecker={(val) => {
        if (val < 0) {
          return 'Please enter a non-negative number';
        } else if (val > 1000) {
          return 'Entered number of minutes is too large. Is this a typo?';
        } else {
          return true;
        }
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
  if (state.sleepLogs && state.sleepLogs.length > 0) {
    defaultDate = moment()
      .hour(state.sleepLogs[0].wakeTime.toDate().getHours())
      .minute(state.sleepLogs[0].wakeTime.toDate().getMinutes())
      .toDate();
  }

  return (
    <DateTimePickerScreen
      theme={theme}
      defaultValue={defaultDate}
      onQuestionSubmit={(value) => {
        GLOBAL.wakeTime = value;
        navigation.navigate('UpTimeInput', { progressBarPercent: 0.76 });
      }}
      validInputChecker={(val) => {
        // Make sure the selected time is before 17:00, otherwise it's a likely sign of AM/PM mixup
        // Also make sure the wake time occurs after the bedtime (complex b/c PM>AM crossover)
        console.log(moment(GLOBAL.bedTime).hour());
        if (!(moment(val).hour() < 17)) {
          return 'Did you set AM/PM correctly? Selected time is late for a wake time.';
        } else if (
          val < GLOBAL.bedTime &&
          !(moment(GLOBAL.bedTime).hour() > 17)
        ) {
          return 'Did you set AM/PM correctly? Selected wake time is before your entered bed time.';
        } else {
          return true;
        }
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
      validInputChecker={(val) => {
        // Make sure the selected time is before 18:00, otherwise it's a likely sign of AM/PM mixup
        // Also make sure up time is after or equal to wake time
        if (moment(val).hour() > 18) {
          return 'Did you set AM/PM correctly? Selected time is late for a wake time.';
        } else if (moment(val).add(1, 'minutes').toDate() < GLOBAL.wakeTime) {
          return 'Selected up time is earlier than selected wake time. Did you set AM/PM correctly?';
        } else {
          return true;
        }
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
        { label: 'stress', icon: 'new' },
        { label: 'pain', icon: 'flash' },
        { label: 'restroom', icon: 'warning' }
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
