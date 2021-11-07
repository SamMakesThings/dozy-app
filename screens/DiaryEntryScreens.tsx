import React, { useCallback, useMemo, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { DatePicker } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import moment from 'moment';
import { pick } from 'lodash';
import NumInputScreen from '../components/screens/NumInputScreen';
import TextInputScreen from '../components/screens/TextInputScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import TagSelectScreen from '../components/screens/TagSelectScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import submitSleepDiaryData, {
  validateSleepLog,
  normalizeSleepLog,
} from '../utilities/submitSleepDiaryData';
import { dozy_theme } from '../config/Themes';
import { Navigation, SleepLog } from '../types/custom';
import { ErrorObj } from '../types/error';
import Analytics from '../utilities/analytics.service';
import Auth from '../utilities/auth.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';
import { RichTextData } from '../types/RichTextData';

// Define the theme & state objects for the file globally
const theme = dozy_theme;

interface Props {
  navigation: Navigation;
  route: {
    params?: {
      logId?: string;
    };
  };
}

interface GlobalState {
  sleepLogs: SleepLog[];
  userData: {
    currentTreatments: {
      RLX?: Date;
      PIT?: Date;
      SCTSRT?: Date;
    };
  };
}

let globalState: GlobalState = {
  sleepLogs: [] as SleepLog[],
  userData: {
    currentTreatments: {
      RLX: undefined as undefined | Date,
      PIT: undefined as undefined | Date,
      SCTSRT: undefined as undefined | Date,
    },
  },
};

// Architecture: pass an optional prop logId, which if defined, signals it's an edit.
// TODO: Update screens to use these values as defaults
const logState = {
  logId: undefined as undefined | string,
  logDate: new Date(),
  bedTime: new Date(),
  minsToFallAsleep: 0,
  isZeroSleep: false,
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
  tags: [] as string[],
};

const goToNextFromWakeCountInput = (
  navigation: Props['navigation'],
  minsToFallAsleep: number,
  wakeCount: number,
) => {
  logState.wakeCount = wakeCount;
  if (
    globalState.userData?.currentTreatments?.SCTSRT &&
    (minsToFallAsleep >= 20 || wakeCount >= 1)
  ) {
    // If SCTSRT has started AND user woke 1+ times or took 20+ mins to sleep, navigate to SCT questions
    navigation.navigate('SCTUpCountInput', { progressBarPercent: 0.44 });
  } else if (globalState.userData?.currentTreatments?.SCTSRT) {
    // If user started SCTSRT but slept quickly, skip to asking about daytime naps
    // & set SCT values appropriately
    logState.SCTUpCount = 0;
    logState.SCTAnythingNonSleepInBed = false;
    navigation.navigate('SCTDaytimeNapsInput', {
      progressBarPercent: 0.5,
    });
  } else if (wakeCount === 0) {
    // If user didn't wake in the night, skip asking how long they were awake
    logState.nightMinsAwake = 0;
    if (logState.isZeroSleep) {
      // If zero sleep, skip WakeTimeInput step
      navigation.navigate('UpTimeInput', { progressBarPercent: 0.76 });
    } else {
      navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
    }
  } else {
    // Otherwise, ask how long they were awake
    navigation.navigate('NightMinsAwakeInput', {
      progressBarPercent: 0.5,
    });
  }
};

export const BedTimeInput: React.FC<Props> = ({ navigation, route }) => {
  // If there is a sleep log recorded, use the most recent
  // bedtime value as a default.
  // Also use hook to set globalState value for the file
  const safeInsets = useSafeAreaInsets();
  globalState =
    (pick(Auth.useAuth().state, ['userData', 'sleepLogs']) as GlobalState) ||
    globalState;
  let defaultDate = moment().hour(22).minute(0).toDate();
  if (globalState.sleepLogs && globalState.sleepLogs.length > 0) {
    defaultDate = moment()
      .hour(globalState.sleepLogs[0].bedTime.toDate().getHours())
      .minute(globalState.sleepLogs[0].bedTime.toDate().getMinutes())
      .toDate();
  }

  let initialDateVal = new Date(); // Declare variable for the initial selectedState value
  const baseSleepLog: SleepLog | undefined = globalState.sleepLogs.find(
    (sleepLog) => sleepLog.logId === route.params?.logId,
  );

  useEffect((): void => {
    // If editing existing sleep log, set defaults from that. Otherwise, use normal defaults
    if (route.params?.logId) {
      if (baseSleepLog) {
        initialDateVal = baseSleepLog.upTime.toDate(); // If editing, use upTime as initial logDate value

        logState.logId = route.params.logId;
        logState.minsToFallAsleep = baseSleepLog.minsToFallAsleep;
        logState.wakeCount = baseSleepLog.wakeCount;
        logState.nightMinsAwake = baseSleepLog.nightMinsAwake;
        logState.SCTNonSleepActivities = baseSleepLog.SCTNonSleepActivities;
        logState.wakeTime = moment(initialDateVal)
          .hour(baseSleepLog.wakeTime.toDate().getHours())
          .minute(baseSleepLog.wakeTime.toDate().getMinutes())
          .startOf('minute')
          .toDate();
        logState.upTime = moment(baseSleepLog.upTime.toDate())
          .startOf('minute')
          .toDate();
        logState.notes = baseSleepLog.notes;
        logState.tags = baseSleepLog.tags;
      } else {
        console.error("Attempted to edit sleep log that doesn't exist!");
      }
    } else {
      logState.logId = undefined;
    }
  }, [route.params?.logId]);

  const prevBedtime = baseSleepLog?.bedTime?.toDate();

  // Create state to display selected log date
  const [selectedDate, setSelectedDate] = React.useState(initialDateVal);

  return (
    <>
      <DateTimePickerScreen
        theme={theme}
        defaultValue={
          // Sets the bedtime's date as the log date
          prevBedtime
            ? moment(selectedDate)
                .hours(prevBedtime.getHours())
                .minutes(prevBedtime.getMinutes())
                .startOf('minute')
                .toDate()
            : defaultDate
        }
        onQuestionSubmit={(value: Date | boolean) => {
          logState.bedTime = moment(selectedDate)
            .hour((value as Date).getHours())
            .minute((value as Date).getMinutes())
            .startOf('minute')
            .toDate();
          logState.logDate = selectedDate; // Make sure this is set even if user doesn't change it
          navigation.setParams({ progressBarPercent: 0.13 });
          navigation.navigate('MinsToFallAsleepInput', {
            progressBarPercent: 0.26,
          });
        }}
        validInputChecker={(val: Date): ErrorObj | boolean => {
          // Make sure the selected time isn't between 8:00 and 18:00, a likely sign of AM/PM mixup
          return moment(val).isSameOrBefore(
            moment(val).hour(8).startOf('hour'),
          ) || moment(val).isSameOrAfter(moment(val).hour(18).startOf('hour'))
            ? true
            : {
                severity: 'WARNING',
                errorMsg:
                  'Did you set AM/PM correctly? Selected time is unusual for a bedtime',
              };
        }}
        mode="time"
        questionLabel="What time did you go to bed last night?"
        inputLabel="Bedtime"
      />
      <DatePicker
        style={[
          styles.datePicker,
          {
            marginTop: (Platform.OS === 'ios' ? safeInsets.top : 0) + scale(29),
          },
        ]}
        mode={'date'}
        type="underline"
        disabled={false}
        leftIconMode="inset"
        format={'dddd, mmmm dS'}
        date={selectedDate}
        onDateChange={(selectedDay: Date) => {
          let dateSetting = selectedDay; // why do dates have to be mutable like this
          dateSetting.setHours(new Date().getHours());
          dateSetting.setMinutes(new Date().getMinutes() - 7); // TODO: Make this less hacky
          logState.logDate = dateSetting;
          if (moment(selectedDay).diff(new Date(), 'days') >= 1) {
            // Make sure it's not a future date
            dateSetting = new Date();
          }
          setSelectedDate(dateSetting);
        }}
      />
    </>
  );
};

export const MinsToFallAsleepInput: React.FC<Props> = ({ navigation }) => {
  const subTitle = useMemo(
    (): RichTextData => [
      { text: "Or, if you couldn't sleep at all last night, " },
      {
        text: 'click here',
        onPress: () => {
          logState.isZeroSleep = true;
          // If RLX (PMR) started, navigate to RLX. If PIT but no RLX, then PIT.
          // Otherwise go to WakeCountInput or skip WakeCountInput in case of zero sleep
          if (globalState.userData?.currentTreatments?.RLX) {
            navigation.navigate('PMRAsk', { progressBarPercent: 0.3 });
          } else if (globalState.userData?.currentTreatments?.PIT) {
            navigation.navigate('PITAsk', { progressBarPercent: 0.33 });
          } else {
            logState.wakeCount = 0;
            goToNextFromWakeCountInput(navigation, Number.MAX_SAFE_INTEGER, 0);
          }
        },
      },
    ],
    [navigation],
  );

  return (
    <NumInputScreen
      theme={theme}
      defaultValue={logState.logId ? logState.minsToFallAsleep : undefined}
      onQuestionSubmit={(value: number) => {
        logState.minsToFallAsleep = value;
        // If RLX (PMR) started, navigate to RLX. If PIT but no RLX, then PIT. Otherwise wakeCount
        if (globalState.userData?.currentTreatments?.RLX) {
          navigation.navigate('PMRAsk', { progressBarPercent: 0.3 });
        } else if (globalState.userData?.currentTreatments?.PIT) {
          navigation.navigate('PITAsk', { progressBarPercent: 0.33 });
        } else {
          navigation.navigate('WakeCountInput', { progressBarPercent: 0.38 });
        }
      }}
      validInputChecker={(val: number) => {
        if (val < 0) {
          return {
            severity: 'ERROR',
            errorMsg: 'Please enter a non-negative number',
          };
        } else if (val > 1200) {
          return {
            severity: 'ERROR',
            errorMsg: 'Entered number of minutes is too large. Is this a typo?',
          };
        } else {
          return true;
        }
      }}
      questionLabel="Roughly how long did it take you to fall asleep?"
      questionSubtitle={subTitle}
      inputLabel="(in minutes)"
    />
  );
};

export const PMRAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        logState.PMRPractice = value as string;
        // If PIT started, navigate to PIT. Otherwise navigate to WakeCountInput
        if (globalState.userData?.currentTreatments?.PIT) {
          navigation.navigate('PITAsk', { progressBarPercent: 0.33 });
        } else if (logState.isZeroSleep) {
          goToNextFromWakeCountInput(navigation, Number.MAX_SAFE_INTEGER, 0);
        } else {
          navigation.navigate('WakeCountInput', { progressBarPercent: 0.38 });
        }
      }}
      buttonValues={[
        {
          label: 'Yes, daytime & before sleeping',
          value: 'DuringDayAndBeforeSleep',
        },
        { label: 'Yes, during the day only', value: 'DuringDay' },
        { label: 'Yes, before falling asleep only', value: 'BeforeSleep' },
        { label: 'No', value: 'NoPMR' },
      ]}
      questionLabel="Did you practice Progressive Muscle Relaxation (PMR)?"
    />
  );
};

export const PITAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        logState.PITPractice = value as boolean;
        if (logState.isZeroSleep) {
          goToNextFromWakeCountInput(navigation, Number.MAX_SAFE_INTEGER, 0);
        } else {
          navigation.navigate('WakeCountInput', { progressBarPercent: 0.38 });
        }
      }}
      buttonValues={[
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ]}
      questionLabel="Did you use Paradoxical Intention Therapy (PIT) to help you fall asleep?"
    />
  );
};

export const WakeCountInput: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        logState.wakeCount = value as number;
        goToNextFromWakeCountInput(
          navigation,
          logState.minsToFallAsleep,
          value as number,
        );
      }}
      buttonValues={[
        { label: "0 (didn't wake up)", value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5+', value: 5 },
      ]}
      questionLabel="After falling asleep, about how many times did you wake up in the night?"
    />
  );
};

// If SCTSRT started, show SCT question screens
export const SCTUpCountInput: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        logState.SCTUpCount = value as number;
        navigation.navigate('SCTAnythingNonSleepInBedInput', {
          progressBarPercent: 0.55,
        });
      }}
      buttonValues={[
        { label: "0 (didn't get up)", value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5+', value: 5 },
      ]}
      questionLabel="Following rule 2 of SCT, how many times did you get out of bed when unable to sleep for more than 15 minutes?"
    />
  );
};

export const SCTAnythingNonSleepInBedInput: React.FC<Props> = ({
  navigation,
}) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        logState.SCTAnythingNonSleepInBed = value === 1;
        // If user says they did something not sleep in bed, ask what (text input)
        if (value === 1) {
          navigation.navigate('SCTNonSleepActivitiesInput', {
            progressBarPercent: 0.6,
          });
        } else {
          navigation.navigate('SCTDaytimeNapsInput', {
            progressBarPercent: 0.6,
          });
        }
      }}
      buttonValues={[
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ]}
      questionLabel="Did you do anything in bed besides sleeping? (e.g. use phone, watch tv, read a book. Sex excluded 🙈)"
    />
  );
};

export const SCTNonSleepActivitiesInput: React.FC<Props> = ({ navigation }) => {
  return (
    <TextInputScreen
      theme={theme}
      defaultValue={logState.logId ? logState.SCTNonSleepActivities : undefined}
      onQuestionSubmit={(value: string) => {
        logState.SCTNonSleepActivities = value;
        navigation.navigate('SCTDaytimeNapsInput', {
          progressBarPercent: 0.63,
        });
      }}
      questionLabel="What were you doing besides sleeping?"
      inputLabel="(e.g. reading, using phone)"
    />
  );
};

export const SCTDaytimeNapsInput: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        logState.SCTDaytimeNaps = value === 1;
        // If zero sleep, go to UpTimeInput step
        if (logState.isZeroSleep) {
          navigation.navigate('UpTimeInput', { progressBarPercent: 0.76 });
        } else {
          // If user didn't wake in the night, skip asking how long they were awake
          if (logState.wakeCount === 0) {
            navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
            logState.nightMinsAwake = 0;
          } else {
            navigation.navigate('NightMinsAwakeInput', {
              progressBarPercent: 0.61,
            });
          }
        }
      }}
      buttonValues={[
        { label: 'Yes', value: 1 },
        { label: 'No', value: 0 },
      ]}
      questionLabel="Did you take any daytime naps longer than 30 minutes yesterday?"
    />
  );
};

export const NightMinsAwakeInput: React.FC<Props> = ({ navigation }) => {
  return (
    <NumInputScreen
      theme={theme}
      defaultValue={logState.logId ? logState.nightMinsAwake : undefined}
      onQuestionSubmit={(value: number) => {
        logState.nightMinsAwake = value;
        navigation.navigate('WakeTimeInput', { progressBarPercent: 0.63 });
      }}
      validInputChecker={(val: number) => {
        if (val < 0) {
          return {
            severity: 'ERROR',
            errorMsg: 'Please enter a non-negative number',
          };
        } else if (val > 1000) {
          return {
            severity: 'ERROR',
            errorMsg: 'Entered number of minutes is too large. Is this a typo?',
          };
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

export const WakeTimeInput: React.FC<Props> = ({ navigation }) => {
  // If there is a sleep log recorded, use the most recent
  // wake time value as a default
  let defaultDate;
  if (globalState.sleepLogs && globalState.sleepLogs.length > 0) {
    const previousWakeTime = globalState.sleepLogs[0].wakeTime.toDate();
    const correctedPrevWakeTime = moment(logState.logDate)
      .hour(previousWakeTime.getHours())
      .minute(previousWakeTime.getMinutes())
      .startOf('minute');
    defaultDate = moment().isAfter(correctedPrevWakeTime)
      ? correctedPrevWakeTime.toDate()
      : new Date();
  } else {
    defaultDate =
      moment().hour() >= 9
        ? moment().hour(9).startOf('hours').toDate()
        : new Date();
  }

  return (
    <DateTimePickerScreen
      theme={theme}
      defaultValue={logState.logId ? logState.wakeTime : defaultDate}
      onQuestionSubmit={(value: Date | boolean) => {
        logState.wakeTime = moment(logState.logDate)
          .hour((value as Date).getHours())
          .minute((value as Date).getMinutes())
          .startOf('minute')
          .toDate();
        navigation.navigate('UpTimeInput', { progressBarPercent: 0.76 });
      }}
      validInputChecker={(val: Date): ErrorObj | boolean => {
        // Make sure the selected time is before 17:00, otherwise it's a likely sign of AM/PM mixup
        // Also make sure the wake time occurs after the bedtime (complex b/c PM>AM crossover)
        if (val.getHours() >= 17) {
          return {
            severity: 'WARNING',
            errorMsg:
              'Did you set AM/PM correctly? Selected time is late for a wake time.',
          };
        } else if (
          val.getHours() < logState.bedTime.getHours() &&
          logState.bedTime.getHours() <= 17
        ) {
          return {
            severity: 'ERROR',
            errorMsg:
              'Did you set AM/PM correctly? Selected wake time is before your entered bed time.',
          };
        } else if (
          moment(logState.logDate)
            .startOf('date')
            .isSameOrAfter(moment().startOf('date')) &&
          moment()
            .hour(val.getHours())
            .minute(val.getMinutes())
            .isAfter(new Date(), 'minute')
        ) {
          return {
            severity: 'WARNING',
            errorMsg:
              "Did you set AM/PM correctly? This wake time is in the future, which doesn't make sense.",
          };
        } else {
          return true;
        }
      }}
      mode="time"
      questionLabel="What time did you wake up?"
      questionSubtitle="The approximate time you woke up and didn't fall asleep again"
      inputLabel="Wake time"
    />
  );
};

export const UpTimeInput: React.FC<Props> = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      onQuestionSubmit={(value: Date | boolean) => {
        logState.upTime = moment(logState.logDate)
          .hour((value as Date).getHours())
          .minute((value as Date).getMinutes())
          .startOf('minute')
          .toDate();
        navigation.navigate('SleepRatingInput', { progressBarPercent: 0.87 });
      }}
      validInputChecker={(val: Date): ErrorObj | boolean => {
        const upTime = moment(logState.logDate)
          .hour(val.getHours())
          .minute(val.getMinutes())
          .startOf('minute');
        // Make sure the selected time is before 18:00, otherwise it's a likely sign of AM/PM mixup
        // Also make sure up time is after or equal to wake time
        // Also make sure up time cannot be future time.
        if (val.getHours() > 18) {
          return {
            severity: 'WARNING',
            errorMsg:
              'Did you set AM/PM correctly? Selected time is late for a wake time.',
          };
        } else if (
          !logState.isZeroSleep &&
          ((moment(logState.bedTime).isBefore(upTime) &&
            upTime.isBefore(logState.wakeTime) &&
            moment(logState.bedTime).isBefore(logState.wakeTime)) ||
            (moment(logState.wakeTime).isBefore(logState.bedTime) &&
              moment(logState.bedTime).isBefore(upTime) &&
              moment(logState.wakeTime).isBefore(upTime)) ||
            (upTime.isBefore(logState.wakeTime) &&
              moment(logState.wakeTime).isBefore(logState.bedTime) &&
              upTime.isBefore(logState.bedTime)))
        ) {
          return {
            severity: 'ERROR',
            errorMsg:
              'Selected up time is earlier than selected wake time. Did you set AM/PM correctly?',
          };
        } else if (
          moment(logState.logDate)
            .startOf('date')
            .isSameOrAfter(moment().startOf('date')) &&
          moment(val).isAfter(new Date(), 'minute')
        ) {
          return {
            severity: 'WARNING',
            errorMsg:
              "Did you set AM/PM correctly? This time is in the future, which doesn't make sense.",
          };
        } else {
          return true;
        }
      }}
      mode="time"
      defaultValue={logState.logId ? logState.upTime : logState.wakeTime}
      questionLabel="What time did you get up?"
      inputLabel="The time you got out of bed"
    />
  );
};

export const SleepRatingInput: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        logState.sleepRating = value as number;
        navigation.navigate('TagsNotesInput', { progressBarPercent: 0.95 });
      }}
      buttonValues={[
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ]}
      questionLabel="On a scale of 1-5, how would you rate the quality of your sleep last night?"
      questionSubtitle="Where 1 is terrible and 5 is great"
    />
  );
};

export const TagsNotesInput: React.FC<Props> = ({ navigation }) => {
  const onInvalidForm = useCallback((): void => {
    navigation.navigate('BedTimeInput');
  }, [navigation.navigate]);

  const validateLog = useCallback(() => validateSleepLog(logState), []);

  return (
    <TagSelectScreen
      theme={theme}
      defaultTags={logState.logId ? logState.tags : undefined}
      defaultNotes={logState.logId ? logState.notes : undefined}
      sleepLog={normalizeSleepLog(logState)}
      touchableTags={[
        { label: 'nothing', icon: 'emoji-happy' },
        { label: 'light', icon: 'light-bulb' },
        { label: 'noise', icon: 'sound' },
        { label: 'pets', icon: 'baidu' },
        { label: 'my partner', icon: 'user' },
        { label: 'kids', icon: 'users' },
        { label: 'heat', icon: 'adjust' },
        { label: 'cold', icon: 'water' },
        { label: 'hot flashes', icon: 'air' },
        { label: 'bad bed', icon: 'bug' },
        { label: 'worry', icon: 'emoji-sad' },
        { label: 'stress', icon: 'new' },
        { label: 'pain', icon: 'flash' },
        { label: 'restroom', icon: 'warning' },
        { label: 'phone & devices', icon: 'mobile' },
        { label: 'eating', icon: 'bowl' },
        { label: 'smoking', icon: 'cloud' },
        { label: 'late caffeine', icon: 'drop' },
        { label: 'late alcohol', icon: 'cup' },
      ]}
      validateSleepLog={validateLog}
      onInvalidForm={onInvalidForm}
      onFormSubmit={async (res: { notes: string; tags: string[] }) => {
        // Update state with new values
        logState.notes = res.notes;
        logState.tags = res.tags;

        // Submit data to Firebase thru helper function
        submitSleepDiaryData(logState);

        Analytics.logEvent(
          logState.logId
            ? AnalyticsEvents.updateSleepLog
            : AnalyticsEvents.submitSleepLog,
        );

        // Navigate back to the main app
        navigation.navigate('App');
      }}
      questionLabel="What, if anything, disturbed your sleep last night?"
      inputLabel="Anything else of note?"
    />
  );
};

const styles = StyleSheet.create({
  datePicker: {
    position: 'absolute',
    alignSelf: 'center',
    opacity: 0.35,
  },
});
