import React, { useCallback, useMemo, useState } from 'react';
import { Alert, Platform, StyleSheet, View, Text } from 'react-native';
import { DatePicker, Button, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import {
  useSafeAreaInsets,
  SafeAreaView,
} from 'react-native-safe-area-context';
import moment from 'moment';
import { omit } from 'lodash';
import firestore from '@react-native-firebase/firestore';
import NumInputScreen from '../components/screens/NumInputScreen';
import TextInputScreen from '../components/screens/TextInputScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import TagSelectScreen from '../components/screens/TagSelectScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import SleepLogSummaryCard from '../components/SleepLogSummaryCard';
import submitSleepDiaryData, {
  validateSleepLog,
  normalizeSleepLog,
} from '../utilities/submitSleepDiaryData';
import { dozy_theme } from '../config/Themes';
import { Navigation, SleepLog } from '../types/custom';
import { ErrorObj } from '../types/error';
import Analytics from '../utilities/analytics.service';
import Auth from '../utilities/auth.service';
import HealthDevice from '../utilities/healthDevice.service';
import DiaryEntryFlow from '../utilities/diaryEntryFlow.service';
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

export const TrackerStart: React.FC<Props> = ({ navigation }) => {
  const { state } = Auth.useAuth();
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  const [fetchingFromDevice, setFetchingFromDevice] = useState(false);

  const onOura = useCallback(async () => {
    if (logState) {
      const nextStepData = updateFlow(
        {
          isDraft: true,
        },
        'TrackerStart',
      );
      navigation.navigate(nextStepData.screen, {
        progressBarPercent: nextStepData.progress,
      });
    } else {
      if (fetchingFromDevice) {
        return;
      }

      setFetchingFromDevice(true);

      try {
        // Get sleep samples for the past day
        const sleepSamples = await HealthDevice.getSleepSamples(
          'oura',
          moment().subtract(1, 'days').format('YYYY-MM-DD'),
          moment().format('YYYY-MM-DD'),
        );
        const sleepLogs = sleepSamples.map((it) =>
          HealthDevice.mapTerraSleepDataToSleepLog(it, 'oura'),
        );
        sleepLogs.sort(
          (a, b) => b.upTime.toDate().valueOf() - a.upTime.toDate().valueOf(),
        );
        if (
          sleepLogs[0] &&
          (!state.sleepLogs[0] ||
            moment(sleepLogs[0].upTime.toDate()).isAfter(
              state.sleepLogs[0].upTime.toDate(),
            ))
        ) {
          const newSleepLogRef = await firestore()
            .collection('users')
            .doc(state.userId)
            .collection('sleepLogs')
            .add(sleepLogs[0]);
          updateFlow(
            {
              ...omit(sleepLogs[0], [
                'bedTime',
                'fallAsleepTime',
                'wakeTime',
                'upTime',
              ]),
              logId: newSleepLogRef.id,
              bedTime: sleepLogs[0].bedTime.toDate(),
              fallAsleepTime: sleepLogs[0].fallAsleepTime.toDate(),
              wakeTime: sleepLogs[0].wakeTime.toDate(),
              upTime: sleepLogs[0].upTime.toDate(),
              logDate: sleepLogs[0].upTime.toDate(),
              isZeroSleep: false,
            },
            'TrackerStart',
            false,
          );
        }
      } catch {}

      setFetchingFromDevice(false);
    }
  }, [navigation, fetchingFromDevice, logState, state.sleepLogs, updateFlow]);

  const onManual = useCallback(() => {
    const nextStepData = updateFlow({ isDraft: false }, 'TrackerStart');
    navigation.navigate(nextStepData.screen, {
      progressBarPercent: nextStepData.progress,
    });
  }, [navigation, updateFlow]);

  return (
    <SafeAreaView style={styles.trackerStartContainer}>
      <Container
        style={styles.trackerStartHeaderContainer}
        elevation={0}
        useThemeGutterPadding={true}
      />
      <Container
        style={styles.trackerStartContentContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <SleepLogSummaryCard sleepLog={logState} />
        <View style={styles.trackerStartDescriptionContainer}>
          <Text
            style={[
              theme.typography.headline5,
              {
                color: theme.colors.secondary,
                marginBottom: scale(10),
              },
            ]}
          >
            {logState
              ? 'Is this info accurate?'
              : 'Your tracker is missing data'}
          </Text>
          <Text
            style={[
              theme.typography.body1,
              {
                color: theme.colors.secondary,
              },
            ]}
          >
            {logState
              ? 'Your Oura ring recorded this data. Please check that it matches your experience. If not, you can adjust individual answers above, or answer everything manually.'
              : "You use an Oura Ring, but we don't have data from it for last night. Have you synced your night with the Oura app yet?"}
          </Text>
        </View>
        <Button
          style={[theme.buttonLayout, styles.ouraStepBottomButton]}
          type="solid"
          color={theme.colors.primary}
          loading={fetchingFromDevice}
          onPress={onOura}
        >
          {logState ? 'Seems right' : 'Open the Oura app'}
        </Button>
        <Button
          style={[theme.buttonLayout, styles.ouraStepTopButton]}
          type="solid"
          color={theme.colors.medium}
          disabled={fetchingFromDevice}
          onPress={onManual}
        >
          {logState
            ? "It's off - enter night's info manually"
            : "Enter night's info manually"}
        </Button>
      </Container>
    </SafeAreaView>
  );
};

export const BedTimeInput: React.FC<Props> = ({ navigation }) => {
  // If there is a sleep log recorded, use the most recent
  // bedtime value as a default.
  // Also use hook to set globalState value for the file
  const { state } = Auth.useAuth();
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();
  const safeInsets = useSafeAreaInsets();

  const [isDateChanged, setDateChanged] = useState(false);

  const logDate = useMemo(
    () => (logState ? logState.logDate : new Date()),
    [logState?.logDate],
  ); // Declare variable for the initial selectedState value

  const validateDate = useCallback(
    (date: Date): boolean => {
      const sleepLogsToCompare: SleepLog[] = logState
        ? state.sleepLogs.filter((it) => it.logId !== logState.logId)
        : state.sleepLogs;

      return !sleepLogsToCompare.find((it) =>
        moment(it.upTime.toDate()).isSame(date, 'day'),
      );
    },
    [state.sleepLogs, logState],
  );

  const isValidDate = useMemo(
    () => validateDate(logDate),
    [logDate, validateDate],
  );

  return (
    <>
      <DateTimePickerScreen
        theme={theme}
        defaultValue={
          // Sets the bedtime's date as the log date
          logState?.bedTime
            ? moment(logDate)
                .hours(logState.bedTime.getHours())
                .minutes(logState.bedTime.getMinutes())
                .startOf('minute')
                .toDate()
            : moment().hour(22).minute(0).toDate()
        }
        onQuestionSubmit={(value: Date | boolean) => {
          const nextStepData = updateFlow(
            {
              bedTime: moment(logDate)
                .hour((value as Date).getHours())
                .minute((value as Date).getMinutes())
                .startOf('minute')
                .toDate(),
            },
            'BedTimeInput',
          );
          navigation.setParams({ progressBarPercent: 0.13 });
          navigation.navigate(nextStepData.screen, {
            progressBarPercent: nextStepData.progress,
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
        questionLabel="What time did you go to bed?"
        inputLabel="Bedtime"
        nextDisabled={!isValidDate}
      />
      <View
        style={[
          styles.dateHeader,
          {
            marginTop: (Platform.OS === 'ios' ? safeInsets.top : 0) + scale(29),
          },
        ]}
      >
        <DatePicker
          style={styles.datePicker}
          mode={'date'}
          type="underline"
          disabled={false}
          leftIconMode="inset"
          format={'dddd, mmmm dS'}
          date={logDate}
          onDateChange={(selectedDay: Date) => {
            let dateSetting = selectedDay;
            // Make sure it's not a future date
            if (
              moment(selectedDay)
                .startOf('day')
                .isAfter(moment().startOf('day'))
            ) {
              dateSetting = new Date();
            }

            setDateChanged(true);
            updateFlow({ logDate: dateSetting }, 'BedTimeInput', false);
          }}
        />
        {!isValidDate && (
          <Text
            style={[
              styles.datePickerMessage,
              theme.typography.body1,
              {
                color: isDateChanged
                  ? theme.colors.error
                  : theme.colors.secondary,
              },
            ]}
          >
            {isDateChanged
              ? "You already logged sleep that day! Please select another day or go back and delete that day's previous log"
              : "Select the date you're logging sleep for"}
          </Text>
        )}
      </View>
    </>
  );
};

export const MinsToFallAsleepInput: React.FC<Props> = ({ navigation }) => {
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  const subTitle = useMemo(
    (): RichTextData => [
      { text: "Or, if you couldn't sleep at all, " },
      {
        text: 'click here',
        onPress: () => {
          const nextStepData = updateFlow(
            { isZeroSleep: true },
            'MinsToFallAsleepInput',
          );
          navigation.navigate(nextStepData.screen, {
            progressBarPercent: nextStepData.progress,
          });
        },
      },
    ],
    [navigation, updateFlow],
  );

  return (
    <NumInputScreen
      theme={theme}
      defaultValue={logState?.minsToFallAsleep}
      onQuestionSubmit={(value: number) => {
        const nextStepData = updateFlow(
          { minsToFallAsleep: value },
          'MinsToFallAsleepInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
  const { updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        const nextStepData = updateFlow(
          { PMRPractice: value as string },
          'PMRAsk',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
  const { updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        const nextStepData = updateFlow(
          { PITPractice: value as boolean },
          'PITAsk',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
  const { updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        const nextStepData = updateFlow(
          { wakeCount: value as number },
          'WakeCountInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
  const { updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        const nextStepData = updateFlow(
          { SCTUpCount: value as number },
          'SCTUpCountInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
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
  const { updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        const nextStepData = updateFlow(
          { SCTAnythingNonSleepInBed: value === 1 },
          'SCTAnythingNonSleepInBedInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <TextInputScreen
      theme={theme}
      defaultValue={logState!.SCTNonSleepActivities}
      onQuestionSubmit={(value: string) => {
        const nextStepData = updateFlow(
          { SCTNonSleepActivities: value },
          'SCTNonSleepActivitiesInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
      }}
      questionLabel="What were you doing besides sleeping?"
      inputLabel="(e.g. reading, using phone)"
    />
  );
};

export const SCTDaytimeNapsInput: React.FC<Props> = ({ navigation }) => {
  const { updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        const nextStepData = updateFlow(
          { SCTDaytimeNaps: value === 1 },
          'SCTDaytimeNapsInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <NumInputScreen
      theme={theme}
      defaultValue={logState?.nightMinsAwake}
      onQuestionSubmit={(value: number) => {
        const nextStepData = updateFlow(
          { nightMinsAwake: value },
          'NightMinsAwakeInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
  const { state } = Auth.useAuth();
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  // If there is a sleep log recorded, use the most recent
  // wake time value as a default
  const defaultWakeTime = useMemo((): Date => {
    let newWakeTime: Date | undefined;
    if (state.sleepLogs.length > 0) {
      const previousWakeTime = state.sleepLogs[0].wakeTime.toDate();
      const correctedPrevWakeTime = moment(logState!.logDate)
        .hour(previousWakeTime.getHours())
        .minute(previousWakeTime.getMinutes())
        .startOf('minute');
      newWakeTime = moment().isAfter(correctedPrevWakeTime)
        ? correctedPrevWakeTime.toDate()
        : new Date();
    } else {
      newWakeTime =
        moment().hour() >= 9
          ? moment().hour(9).startOf('hours').toDate()
          : new Date();
    }

    return newWakeTime;
  }, [state.sleepLogs, logState?.logDate]);

  return (
    <DateTimePickerScreen
      theme={theme}
      defaultValue={logState?.wakeTime || defaultWakeTime}
      onQuestionSubmit={(value: Date | boolean) => {
        const nextStepData = updateFlow(
          {
            wakeTime: moment(logState!.logDate)
              .hour((value as Date).getHours())
              .minute((value as Date).getMinutes())
              .startOf('minute')
              .toDate(),
          },
          'WakeTimeInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
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
          val.getHours() < logState!.bedTime.getHours() &&
          logState!.bedTime.getHours() <= 17
        ) {
          return {
            severity: 'ERROR',
            errorMsg:
              'Did you set AM/PM correctly? Selected wake time is before your entered bed time.',
          };
        } else if (
          moment(logState!.logDate)
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
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <DateTimePickerScreen
      theme={theme}
      onQuestionSubmit={(value: Date | boolean) => {
        const nextStepData = updateFlow(
          {
            upTime: moment(logState!.logDate)
              .hour((value as Date).getHours())
              .minute((value as Date).getMinutes())
              .startOf('minute')
              .toDate(),
          },
          'UpTimeInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
      }}
      validInputChecker={(val: Date): ErrorObj | boolean => {
        const upTime = moment(logState!.logDate)
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
          !logState!.isZeroSleep &&
          ((moment(logState!.bedTime).isBefore(upTime) &&
            upTime.isBefore(logState!.wakeTime) &&
            moment(logState!.bedTime).isBefore(logState!.wakeTime)) ||
            (moment(logState!.wakeTime).isBefore(logState!.bedTime) &&
              moment(logState!.bedTime).isBefore(upTime) &&
              moment(logState!.wakeTime).isBefore(upTime)) ||
            (upTime.isBefore(logState!.wakeTime) &&
              moment(logState!.wakeTime).isBefore(logState!.bedTime) &&
              upTime.isBefore(logState!.bedTime)))
        ) {
          return {
            severity: 'ERROR',
            errorMsg:
              'Selected up time is earlier than selected wake time. Did you set AM/PM correctly?',
          };
        } else if (
          moment(logState!.logDate)
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
      defaultValue={logState!.upTime || logState!.wakeTime}
      questionLabel="What time did you get up?"
      inputLabel="The time you got out of bed"
    />
  );
};

export const SleepRatingInput: React.FC<Props> = ({ navigation }) => {
  const { updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value?: string | number | boolean) => {
        const nextStepData = updateFlow(
          { sleepRating: value as number },
          'SleepRatingInput',
        );
        navigation.navigate(nextStepData.screen, {
          progressBarPercent: nextStepData.progress,
        });
      }}
      buttonValues={[
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
      ]}
      questionLabel="On a scale of 1-5, how would you rate the quality of your sleep?"
      questionSubtitle="Where 1 is terrible and 5 is great"
    />
  );
};

export const TagsNotesInput: React.FC<Props> = ({ navigation }) => {
  const { logState, updateFlow } = DiaryEntryFlow.useDiaryEntryFlow();

  const onInvalidForm = useCallback((): void => {
    navigation.navigate('BedTimeInput');
  }, [navigation.navigate]);

  const validateLog = useCallback(
    () => (logState!.isDraft ? true : validateSleepLog(logState!)),
    [logState],
  );

  return (
    <TagSelectScreen
      theme={theme}
      defaultTags={logState?.tags}
      defaultNotes={logState?.notes}
      sleepLog={normalizeSleepLog(logState!, false, logState!.isDraft)}
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
        const { logState: newLogState } = updateFlow(
          { notes: res.notes, tags: res.tags },
          'TagsNotesInput',
          false,
        );

        // Submit data to Firebase thru helper function
        try {
          submitSleepDiaryData(newLogState);
        } catch (error: any) {
          Alert.alert(
            newLogState.logId ? 'Update failed' : 'Log failed',
            error.message,
          );
        }

        Analytics.logEvent(
          newLogState.logId
            ? AnalyticsEvents.updateSleepLog
            : AnalyticsEvents.submitSleepLog,
        );

        // Navigate back to the main app
        navigation.navigate('App');
      }}
      hasNotes
      questionLabel="What, if anything, disturbed your sleep?"
      inputLabel="Anything else of note?"
    />
  );
};

const styles = StyleSheet.create({
  dateHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  datePicker: {
    opacity: 0.35,
    alignSelf: 'center',
  },
  datePickerMessage: {
    position: 'absolute',
    top: 68,
    left: 16,
    right: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  trackerStartContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  trackerStartHeaderContainer: {
    width: '100%',
    height: '10%',
    marginTop: 0,
  },
  trackerStartContentContainer: {
    flex: 1,
    justifyContent: 'space-around',
  },
  trackerStartDescriptionContainer: {
    flex: 1,
    marginTop: scale(14),
    paddingHorizontal: scale(10),
  },
  ouraStepTopButton: {
    marginTop: scale(5),
  },
  ouraStepBottomButton: {
    marginTop: scale(5),
  },
});
