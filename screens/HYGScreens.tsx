import React from 'react';
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
import { AuthContext } from '../utilities/authContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../assets/images/FemaleDoctor.svg';
import DizzyFace from '../assets/images/DizzyFace.svg';
import TiredFace from '../assets/images/TiredFace.svg';
import SleepingFace from '../assets/images/SleepingFace.svg';
import BarChart from '../assets/images/BarChart.svg';
import LabCoat from '../assets/images/LabCoat.svg';
import RaisedHands from '../assets/images/RaisedHands.svg';
import AlarmClock from '../assets/images/AlarmClock.svg';
import Rule2Illustration from '../assets/images/Rule2Illustration.svg';
import Rule3Illustration from '../assets/images/Rule3Illustration.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';

// TODO: Update percentage values for progress bar

const theme: any = dozy_theme; // Define the theme for the file globally
// 'any' type for now since it's getting an expected something from Draftbit that's breaking.

// Define an interface for HYG flow state (SHI score & next checkin info)
interface HYGState {
  SHI1?: number;
  SHI2?: number;
  SHI3?: number;
  SHI4?: number;
  SHI4a?: number;
  SHI5?: number;
  SHI6?: number;
  SHI7?: number;
  SHI8?: number;
  SHI9?: number;
  SHIScore?: number;
  nextCheckinTime: Date;
  treatmentPlan: Array<{ started: boolean; module: string }>;
}
let HYGState: HYGState = {
  nextCheckinTime: new Date(),
  treatmentPlan: [{ started: false, module: 'deleteme' }]
};

const imgSizePercent = 0.4; // Define square image size defaults as a percent of width
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

interface Props {
  // Define Props type for all screens in this flow
  navigation: {
    navigate: Function;
    goBack: Function;
  };
}

export const Welcome: React.FC<Props> = ({ navigation }) => {
  imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<FemaleDoctor width={imgSize} height={imgSize * 1.2} />}
      onQuestionSubmit={() => {
        navigation.navigate('SRTTitrationStart', {
          progressBarPercent: 0.06
        });
      }}
      textLabel="Welcome back! This week we'll address some of your sleep hygiene-related issues - things like light, temperature, and partners/pets. But first, let's review your sleep and how treatment's been going for you so far."
    />
  );
};

// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'

export const TreatmentPlan: React.FC<Props> = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 12
  const recentSleepLogs = state.sleepLogs.slice(0, 12);

  // Find top 3 sleep disturbance tags.
  const logTagsFrequencyObject: {
    [key: string]: number;
  } = recentSleepLogs.reduce(
    (
      tagsObject: { [key: string]: number },
      sleepLog: { tags: Array<string> }
    ) => {
      let newTagsObject = tagsObject;
      sleepLog.tags.map((tag) => {
        newTagsObject[tag] = newTagsObject[tag] ? newTagsObject[tag] + 1 : 1; // if exists, increment. Otherwise, start with 1
      });
      return newTagsObject;
    },
    { nothing: -20 }
  ); // Add nothing way negative so it's excluded from the highest frequency
  // Then find the 3 highest from the object. Put them in an array as strings.
  const mostCommonTags = Object.keys(logTagsFrequencyObject)
    .sort(function (a, b) {
      return logTagsFrequencyObject[b] - logTagsFrequencyObject[a];
    })
    .slice(0, 3);
  // Turn it into a nice string for this screen
  const tagsString =
    mostCommonTags.length === 3
      ? `${mostCommonTags[0]}, ${mostCommonTags[1]}, and ${mostCommonTags[2]}`
      : `light, heat, noise, and other issues`;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('HYGIntro', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel="This week's treatment: Sleep hygiene improvements"
      textLabel={`Today we'll be addressing your sleep problems caused by ${tagsString}.`}
      buttonLabel="Next"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const HYGIntro: React.FC<Props> = ({ navigation }) => {
  let SHIScore = 0;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TryingToSleep', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel={`You scored a ${SHIScore} on the Glasgow Sleep Effort Scale.`}
      textLabel="You might've even tried some tricks from it (reduce caffeine, reduce nightly electronics use, etc). However, as you may have learned, sleep hygiene tips on their own aren't usually enough to fix insomnia."
      buttonLabel="Next"
      flexibleLayout
    >
      <BarChart width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const GSES1: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        HYGState.SHI1 = value;
        navigation.navigate('GSES2', { progressBarPercent: 0.67 });
      }}
      questionLabel="I put too much effort into sleeping when it should come naturally."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false }
      ]}
    />
  );
};

export const GSESResult: React.FC<Props> = ({ navigation }) => {
  let SHIScore = 0;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TryingToSleep', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel={`You scored a ${SHIScore} on the Glasgow Sleep Effort Scale.`}
      textLabel="That means your efforts to fall asleep faster are an obstacle for you. Today's technique, Paradoxical Intention Therapy (PIT), will likely make falling asleep easier! Let's get started."
      buttonLabel="Next"
      flexibleLayout
    >
      <BarChart width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const TryingToSleep: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Paradox', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel="Studies show that poor sleepers have something in common:"
      textLabel="They try very hard to sleep. Since sleep isn't a conscious process, this strong effort actually makes sleeping harder! In fact, insomnia itself can sometimes be characterized as a symptom of trying too hard to sleep."
      buttonLabel="Well that sucks"
      flexibleLayout
    >
      <TiredFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const Paradox: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Antidote', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel="It's a paradox"
      textLabel="The more you try to sleep, the less you can. And it's the opposite of what non-insomniacs do: when someone with normal sleep patterns goes to sleep, they spend almost no effort."
      buttonLabel="The lucky pricks"
      flexibleLayout
    >
      <DizzyFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const Antidote: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('HowToPIT', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel="Fortunately, we can counteract this with a simple technique:"
      textLabel="Paradoxical Intention Therapy, or PIT. Paradoxical Intention Therapy is all about letting go of the effort to sleep. By releasing any effort to sleep, sleep actually comes faster."
      buttonLabel="How do I do it?"
      flexibleLayout
    >
      <SleepingFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const HowToPIT: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PITScience', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel="How to use Paradoxical Intention Therapy:"
      textLabel={
        <>
          <Text>
            <Text style={styles.BoldLabelText}>1.</Text> Maintain the target
            sleep schedule,
          </Text>
          {'\n'}
          <Text>
            <Text style={styles.BoldLabelText}>2.</Text> When you're in bed,
            gently keep your eyes open and make no effort to fall asleep.
          </Text>
          {'\n'}
          <Text>
            <Text style={styles.BoldLabelText}>3.</Text> Don't actively keep
            yourself awake though - don't move around, drink coffee, etc. You're
            simply letting go of the effort to fall asleep.
          </Text>
        </>
      }
      buttonLabel="This sounds kinda silly"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PITScience: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PITReview', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel="It may sound silly, but it's science!"
      textLabel="Multiple independent studies have found that sleepers who use PIT fall asleep faster than those who don't. It may sound weird, but it works, and there's a good chance it'll work for you."
      buttonLabel="Next"
      flexibleLayout
    >
      <LabCoat width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PITReview: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res: string) => {
        if (res === 'Wait, I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'PIT'
          });
        } else {
          navigation.navigate('RulesRecap', {
            progressBarPercent: 0.61
          });
        }
      }}
      titleLabel="So, to review:"
      textLabel="In addition to your target sleep schedule and bedtime rules, start using PIT by not trying to fall asleep and instead passively trying to keep your eyes open. You can always review this information on your Treatments page."
      buttonLabel="Ok, I can do it this week"
      bottomGreyButtonLabel="Wait, I have questions"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const RulesRecap: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('CheckinScheduling', {
          progressBarPercent: 0.83
        });
      }}
      titleLabel="Quick recap of the 3 rules:"
      textLabel={
        <>
          <Text>
            <Text style={styles.BoldLabelText}>1.</Text> Maintain the target
            sleep schedule,
          </Text>
          {'\n'}
          <Text>
            <Text style={styles.BoldLabelText}>2.</Text> Get out of bed if
            unable to sleep for 15+ minutes (and return once sleepy again), and
          </Text>
          {'\n'}
          <Text>
            <Text style={styles.BoldLabelText}>3.</Text> Don&apos;t do anything
            in bed besides sleeping (including naps).
          </Text>
        </>
      }
      flexibleLayout
    >
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          alignItems: 'center'
        }}
      >
        <AlarmClock width={imgSize * 0.5} height={imgSize * 0.5} />
        <Rule2Illustration width={imgSize * 1.2} height={imgSize} />
        <Rule3Illustration width={imgSize * 0.7} height={imgSize * 0.7} />
      </View>
    </WizardContentScreen>
  );
};

export const CheckinScheduling: React.FC<Props> = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={
        new Date(
          new Date().getTime() + 86400000 * 7
        ) /* Default date of 7 days from today */
      }
      onQuestionSubmit={(value: Date) => {
        HYGState.nextCheckinTime = value;
        navigation.navigate('PITEnd', { progressBarPercent: 1 });
      }}
      validInputChecker={(val: Date) => {
        // Make sure the selected date is 7+ days from today
        // Make sure it's within 14 days
        // Otherwise, mark it valid by returning true
        if (moment().add(7, 'days').hour(0).toDate() > val) {
          return 'Please select a day 7 or more days from today';
        } else if (moment().add(14, 'days').hour(0).toDate() < val) {
          return 'Please select a day within 14 days of today';
        } else {
          return true;
        }
      }}
      questionLabel="Last step: When would you like your next weekly check-in?"
      questionSubtitle="Check-ins take 5-10 minutes and adjust treatments based on your sleep patterns. A new technique is usually introduced weekly."
      buttonLabel="I've picked a date 7+ days from today"
      mode="datetime"
    />
  );
};

export const PITEnd: React.FC<Props> = ({ navigation }) => {
  const { state, dispatch } = React.useContext(AuthContext);

  // Create reminder object for next checkin
  let reminderObject = {
    expoPushToken: state.userData.reminders.expoPushToken,
    title: 'Next checkin is ready',
    body: 'Open the app now to get started',
    type: 'CHECKIN_REMINDER',
    time: HYGState.nextCheckinTime,
    enabled: true
  };

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        submitCheckinData({
          userId: state.userToken,
          checkinPostponed: false,
          nextCheckinDatetime: HYGState.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: HYGState.treatmentPlan.filter(
            (v: { started: boolean; module: string }) =>
              v.started === false && v.module !== 'PIT'
          )[0].module,
          lastCheckinModule: 'PIT',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed,
          additionalCheckinData: {
            SHI1: HYGState.SHI1,
            SHI2: HYGState.SHI2,
            SHI3: HYGState.SHI3,
            SHI4: HYGState.SHI4,
            SHI4a: HYGState.SHI4a,
            SHI5: HYGState.SHI5,
            SHI6: HYGState.SHI6,
            SHI7: HYGState.SHI7,
            SHI8: HYGState.SHI8,
            SHI9: HYGState.SHI9,
            SHIScore: HYGState.SHIScore
          },
          reminderObject: reminderObject
        });
        navigation.navigate('App');
        refreshUserData(dispatch);
      }}
      textLabel="Weekly check-in completed!"
      buttonLabel="Finish"
    >
      <RaisedHands width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

const styles = StyleSheet.create({
  BoldLabelText: {
    fontFamily: 'RubikMedium',
    fontSize: scale(20)
  }
});
