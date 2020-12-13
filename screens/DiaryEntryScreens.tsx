/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Platform } from 'react-native';
import moment from 'moment';
import NumInputScreen from '../components/screens/NumInputScreen';
import TextInputScreen from '../components/screens/TextInputScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import TagSelectScreen from '../components/screens/TagSelectScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import submitSleepDiaryData from '../utilities/submitSleepDiaryData';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../utilities/authContext';
import { Navigation, SleepLog } from '../types/custom';

// Define the theme & state objects for the file globally
const theme = dozy_theme;
interface Props {
  navigation: Navigation;
}
let globalState = {
  sleepLogs: [] as SleepLog[],
  userData: {
    currentTreatments: {
      RLX: undefined as undefined | Date,
      PIT: undefined as undefined | Date,
      SCTSRT: undefined as undefined | Date
    }
  }
};
let logState = {
  bedTime: new Date(),
  minsToFallAsleep: 0,
  PMRPractice: undefined as undefined | string,
  PITPractice: undefined as undefined | boolean,
  wakeCount: 0,
  SCTUpCount: undefined as undefined | number,
  SCTAnythingNonSleepInBed: undefined as undefined | boolean,
  nightMinsAwake: 0,
  SCTNonSleepActivities: undefined as undefined | string,
  SCTDaytimeNaps: undefined as undefined | boolean,
  wakeTime: new Date(),
  upTime: new Date(),
  sleepRating: 0,
  notes: '',
  tags: [] as string[]
};

export const BedTimeInput = ({ navigation }: Props) => {
  // If there is a sleep log recorded, use the most recent
  // bedtime value as a default.
  // Also use hook to set globalState value for the file
  globalState = React.useContext(AuthContext).state;
  let defaultDate = moment().hour(22).minute(0).toDate();
  if (globalState.sleepLogs && globalState.sleepLogs.length > 0) {
    defaultDate = moment()
      .hour(globalState.sleepLogs[0].bedTime.toDate().getHours())
      .minute(globalState.sleepLogs[0].bedTime.toDate().getMinutes())
      .toDate();
  }

  console.log(Platform.Version);

  return (
    <DateTimePickerScreen
      theme={theme}
      defaultValue={defaultDate}
      onQuestionSubmit={(value: Date) => {
        logState.bedTime = value;
        navigation.setParams({ progressBarPercent: 0.13 });
        navigation.navigate('MinsToFallAsleepInput', {
          progressBarPercent: 0.26
        });
      }}
      validInputChecker={(val: Date) => {
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

export const MinsToFallAsleepInput = ({ navigation }: Props) => {
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value: number) => {
        logState.minsToFallAsleep = value;
        // If RLX (PMR) started, navigate to RLX. If PIT but no RLX, then PIT. Otherwise wakeCount
        if (globalState.userData.currentTreatments.RLX) {
          navigation.navigate('PMRAsk', { progressBarPercent: 0.3 });
        } else if (globalState.userData.currentTreatments.PIT) {
          navigation.navigate('PITAsk', { progressBarPercent: 0.33 });
        } else {
          navigation.navigate('WakeCountInput', { progressBarPercent: 0.38 });
        }
      }}
      validInputChecker={(val: number) => {
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

export const PMRAsk = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value: string) => {
        logState.PMRPractice = value;
        // If PIT started, navigate to PIT. Otherwise navigate to WakeCountInput
        if (globalState.userData.currentTreatments.PIT) {
          navigation.navigate('PITAsk', { progressBarPercent: 0.33 });
        } else {
          navigation.navigate('WakeCountInput', { progressBarPercent: 0.38 });
        }
      }}
      buttonValues={[
        {
          label: 'Yes, daytime & before sleeping',
          value: 'DuringDayAndBeforeSleep'
        },
        { label: 'Yes, during the day only', value: 'DuringDay' },
        { label: 'Yes, before falling asleep only', value: 'BeforeSleep' },
        { label: 'No', value: 'NoPMR' }
      ]}
      questionLabel="Did you practice Progressive Muscle Relaxation (PMR)?"
    />
  );
};

export const PITAsk = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value: boolean) => {
        logState.PITPractice = value;
        navigation.navigate('WakeCountInput', { progressBarPercent: 0.38 });
      }}
      buttonValues={[
        { label: 'Yes', value: true },
        { label: 'No', value: false }
      ]}
      questionLabel="Did you use Paradoxical Intention Therapy (PIT) to help you fall asleep?"
    />
  );
};

export const WakeCountInput = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value: number) => {
        logState.wakeCount = value;
        if (
          globalState.userData.currentTreatments.SCTSRT &&
          (logState.minsToFallAsleep >= 20 || value >= 1)
        ) {
          // If SCTSRT has started AND user woke 1+ times or took 20+ mins to sleep, navigate to SCT questions
          navigation.navigate('SCTUpCountInput', { progressBarPercent: 0.44 });
        } else if (globalState.userData.currentTreatments.SCTSRT) {
          // If user started SCTSRT but slept quickly, skip to asking about daytime naps
          // & set SCT values appropriately
          logState.SCTUpCount = 0;
          logState.SCTAnythingNonSleepInBed = false;
          navigation.navigate('SCTDaytimeNapsInput', {
            progressBarPercent: 0.5
          });
        } else if (value === 0) {
          // If user didn't wake in the night, skip asking how long they were awake
          logState.nightMinsAwake = 0;
          navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
        } else {
          // Otherwise, ask how long they were awake
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
export const SCTUpCountInput = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value: number) => {
        logState.SCTUpCount = value;
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
      questionLabel="Following rule 2 of SCT, how many times did you get out of bed when unable to sleep for more than 15 minutes?"
    />
  );
};

export const SCTAnythingNonSleepInBedInput = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value: number) => {
        logState.SCTAnythingNonSleepInBed = value === 1;
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
      questionLabel="Did you do anything in bed besides sleeping? (e.g. use phone, watch tv, read a book. Sex excluded 🙈)"
    />
  );
};

export const SCTNonSleepActivitiesInput = ({ navigation }: Props) => {
  return (
    <TextInputScreen
      theme={theme}
      onQuestionSubmit={(value: string) => {
        logState.SCTNonSleepActivities = value;
        navigation.navigate('SCTDaytimeNapsInput', {
          progressBarPercent: 0.63
        });
      }}
      questionLabel="What were you doing besides sleeping?"
      inputLabel="(e.g. reading, using phone)"
    />
  );
};

export const SCTDaytimeNapsInput = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value: number) => {
        logState.SCTDaytimeNaps = value === 1;
        // If user didn't wake in the night, skip asking how long they were awake
        if (logState.wakeCount === 0) {
          navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
          logState.nightMinsAwake = 0;
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
      questionLabel="Did you take any daytime naps longer than 30 minutes yesterday?"
    />
  );
};

export const NightMinsAwakeInput = ({ navigation }: Props) => {
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value: number) => {
        logState.nightMinsAwake = value;
        navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
      }}
      validInputChecker={(val: number) => {
        if (val < 0) {
          return 'Please enter a non-negative number';
        } else if (val > 1000) {
          return 'Entered number of minutes is too large. Is this a typo?';
        } else {
          return true;
        }
      }}
      questionLabel="Roughly how many minutes were you awake after initially falling asleep?"
      questionSubtitle="Include time after initially falling asleep but not time after your final wake."
      inputLabel="(in minutes)"
    />
  );
};

export const WakeTimeInput = ({ navigation }: Props) => {
  // If there is a sleep log recorded, use the most recent
  // wake time value as a default
  let defaultDate = moment().hour(9).minute(0).toDate();
  if (globalState.sleepLogs && globalState.sleepLogs.length > 0) {
    defaultDate = moment()
      .hour(globalState.sleepLogs[0].wakeTime.toDate().getHours())
      .minute(globalState.sleepLogs[0].wakeTime.toDate().getMinutes())
      .toDate();
  }

  return (
    <DateTimePickerScreen
      theme={theme}
      defaultValue={defaultDate}
      onQuestionSubmit={(value: Date) => {
        logState.wakeTime = value;
        navigation.navigate('UpTimeInput', { progressBarPercent: 0.76 });
      }}
      validInputChecker={(val: Date) => {
        // Make sure the selected time is before 17:00, otherwise it's a likely sign of AM/PM mixup
        // Also make sure the wake time occurs after the bedtime (complex b/c PM>AM crossover)
        if (!(moment(val).hour() < 17)) {
          return 'Did you set AM/PM correctly? Selected time is late for a wake time.';
        } else if (
          val < logState.bedTime &&
          !(moment(logState.bedTime).hour() > 17)
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

export const UpTimeInput = ({ navigation }: Props) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      onQuestionSubmit={(value: Date) => {
        logState.upTime = value;
        navigation.navigate('SleepRatingInput', { progressBarPercent: 0.87 });
      }}
      validInputChecker={(val: Date) => {
        // Make sure the selected time is before 18:00, otherwise it's a likely sign of AM/PM mixup
        // Also make sure up time is after or equal to wake time
        if (moment(val).hour() > 18) {
          return 'Did you set AM/PM correctly? Selected time is late for a wake time.';
        } else if (moment(val).add(1, 'minutes').toDate() < logState.wakeTime) {
          return 'Selected up time is earlier than selected wake time. Did you set AM/PM correctly?';
        } else {
          return true;
        }
      }}
      mode="time"
      defaultValue={logState.wakeTime}
      questionLabel="What time did you get up?"
      inputLabel="The time you got out of bed"
    />
  );
};

export const SleepRatingInput = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value: number) => {
        logState.sleepRating = value;
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

export const TagsNotesInput = ({ navigation }: Props) => {
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
      onFormSubmit={async (res: { notes: string; tags: string[] }) => {
        // Update state with new values
        logState.notes = res.notes;
        logState.tags = res.tags;

        // Submit data to Firebase thru helper function
        submitSleepDiaryData(logState);

        // Navigate back to the main app
        navigation.navigate('App');
      }}
      questionLabel="What, if anything, disturbed your sleep last night?"
      inputLabel="Anything else of note?"
    />
  );
};
