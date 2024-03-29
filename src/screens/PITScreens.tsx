import React from 'react';
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
import { NavigationProp } from '@react-navigation/native';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import GLOBALRAW from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../../assets/images/FemaleDoctor.svg';
import DizzyFace from '../../assets/images/DizzyFace.svg';
import TiredFace from '../../assets/images/TiredFace.svg';
import SleepingFace from '../../assets/images/SleepingFace.svg';
import BarChart from '../../assets/images/BarChart.svg';
import LabCoat from '../../assets/images/LabCoat.svg';
import RaisedHands from '../../assets/images/RaisedHands.svg';
import AlarmClock from '../../assets/images/AlarmClock.svg';
import Rule2Illustration from '../../assets/images/Rule2Illustration.svg';
import Rule3Illustration from '../../assets/images/Rule3Illustration.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';
import { ErrorObj } from '../types/error';
import Feedback from '../utilities/feedback.service';
import Auth from '../utilities/auth.service';
import { useUserDataStore } from '../utilities/userDataStore';

// Use a local state object instead of GLOBAL for GSES score, next checkin time
interface Global {
  GSES1: number;
  GSES2: number;
  GSES3: number;
  GSES4: number;
  GSES5: number;
  GSES6: number;
  GSES7: number;
  GSESScore: number;
  nextCheckinTime: Date;
  treatmentPlan: Array<{ started: boolean; module: string; estDate?: Date }>;
  targetBedTime: Date;
  targetWakeTime: Date;
  targetTimeInBed: number;
}

const GLOBAL: Partial<Global> = GLOBALRAW; // Create a local copy of global app state, typed with above

// Define the theme for the file globally
// 'any' type for now since it's getting an expected something from Draftbit that's breaking.
const theme: any = dozy_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

interface Props {
  navigation: NavigationProp<any>;
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
          progressBarPercent: 0.09,
        });
      }}
      textLabel="Welcome back! This week, we’ll review your sleep data, update your care plan, and get started with a technique to make falling asleep easier - Paradoxical Intention Therapy (PIT)."
    />
  );
};

// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'

export const TreatmentPlan: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('GSES1', {
          progressBarPercent: 0.39,
        });
      }}
      titleLabel="This week: Paradoxical Intention Therapy"
      textLabel={
        "Based on your sleep data, the next step is to reduce the time it takes to fall asleep. To get started, we'll ask you seven related questions. Rate how true each statement has been for you in the past week."
      }
      buttonLabel="Next"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const GSES1: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        GLOBAL.GSES1 = value as number;
        navigation.navigate('GSES2', { progressBarPercent: 0.43 });
      }}
      questionLabel="I put too much effort into sleeping when it should come naturally."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false },
      ]}
    />
  );
};

export const GSES2: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        GLOBAL.GSES2 = value as number;
        navigation.navigate('GSES3', { progressBarPercent: 0.48 });
      }}
      questionLabel="I feel I should be able to control my sleep."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false },
      ]}
    />
  );
};

export const GSES3: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        GLOBAL.GSES3 = value as number;
        navigation.navigate('GSES4', { progressBarPercent: 0.52 });
      }}
      questionLabel="I put off going to bed at night for fear of not being able to sleep."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false },
      ]}
    />
  );
};

export const GSES4: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        GLOBAL.GSES4 = value as number;
        navigation.navigate('GSES5', { progressBarPercent: 0.57 });
      }}
      questionLabel="I worry about not sleeping if I cannot sleep."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false },
      ]}
    />
  );
};

export const GSES5: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        GLOBAL.GSES5 = value as number;
        navigation.navigate('GSES6', { progressBarPercent: 0.61 });
      }}
      questionLabel="I am no good at sleeping."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false },
      ]}
    />
  );
};

export const GSES6: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        GLOBAL.GSES6 = value as number;
        navigation.navigate('GSES7', { progressBarPercent: 0.65 });
      }}
      questionLabel="I get anxious about sleeping before I go to bed."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false },
      ]}
    />
  );
};

export const GSES7: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        GLOBAL.GSES7 = value as number;
        navigation.navigate('GSESResult', { progressBarPercent: 0.7 });
      }}
      questionLabel="I worry about the consequences of not sleeping."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false },
      ]}
    />
  );
};

export const GSESResult: React.FC<Props> = ({ navigation }) => {
  const GSESScore =
    (GLOBAL.GSES1 as number) +
    (GLOBAL.GSES2 as number) +
    (GLOBAL.GSES3 as number) +
    (GLOBAL.GSES4 as number) +
    (GLOBAL.GSES5 as number) +
    (GLOBAL.GSES6 as number) +
    (GLOBAL.GSES7 as number);
  GLOBAL.GSESScore = GSESScore;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TryingToSleep', {
          progressBarPercent: 0.74,
        });
      }}
      titleLabel={`You scored a ${GSESScore} on the Glasgow Sleep Effort Scale.`}
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
          progressBarPercent: 0.78,
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
          progressBarPercent: 0.83,
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
          progressBarPercent: 0.87,
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
          progressBarPercent: 0.91,
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
          progressBarPercent: 0.96,
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
      onQuestionSubmit={(res?: string) => {
        if (res === 'Wait, I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'PIT',
          });
        } else {
          navigation.navigate('RulesRecap', {
            progressBarPercent: 0.97,
          });
        }
      }}
      titleLabel="So, to review:"
      textLabel="In addition to your target sleep schedule and bedtime rules, start using PIT by not trying to fall asleep and instead passively trying to keep your eyes open. You can always review this information on your home page."
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
          progressBarPercent: 0.98,
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
      <View style={styles.rulesRecapContent}>
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
          new Date().getTime() + 86400000 * 7,
        ) /* Default date of 7 days from today */
      }
      onQuestionSubmit={(value: Date | boolean) => {
        GLOBAL.nextCheckinTime = value as Date;
        navigation.navigate('PITEnd', { progressBarPercent: 1 });
      }}
      validInputChecker={(val: Date): ErrorObj | boolean => {
        // Make sure the selected date is 7+ days from today
        // Make sure it's within 14 days
        // Otherwise, mark it valid by returning true
        if (moment().add(7, 'days').hour(0).toDate() > val) {
          return {
            severity: 'ERROR',
            errorMsg: 'Please select a day 7 or more days from today',
          };
        } else if (moment().add(14, 'days').hour(0).toDate() < val) {
          return {
            severity: 'WARNING',
            errorMsg: 'Please select a day within 14 days of today',
          };
        } else {
          return true;
        }
      }}
      questionLabel="Last step: When would you like your next weekly check-in?"
      questionSubtitle="Check-ins take 5-10 minutes and adjust care based on your sleep patterns. A new technique is usually introduced weekly."
      buttonLabel="I've picked a date 7+ days from today"
      mode="datetime"
    />
  );
};

export const PITEnd: React.FC<Props> = ({ navigation }) => {
  const { state, dispatch } = Auth.useAuth();
  const userData = useUserDataStore((userState) => userState.userData);
  const { setShowingFeedbackWidget } = Feedback.useFeedback();

  // Create reminder object for next checkin
  const reminderObject = {
    expoPushToken: userData.reminders.expoPushToken,
    title: 'Next check-in is ready',
    body: 'Open the app now to get started',
    type: 'CHECKIN_REMINDER',
    time: GLOBAL.nextCheckinTime as Date,
    enabled: true,
  };

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        if (!state.userId) throw new Error();
        submitCheckinData({
          userId: state.userId,
          checkinPostponed: false,
          nextCheckinDatetime: GLOBAL.nextCheckinTime as Date,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: GLOBALRAW.treatmentPlan.filter(
            (v: { started: boolean; module: string }) =>
              v.started === false && v.module !== 'PIT',
          )[0].module,
          lastCheckinModule: 'PIT',
          targetBedTime: GLOBALRAW.targetBedTime, // TS is mad, but this needs to access true global state.
          targetWakeTime: GLOBALRAW.targetWakeTime, // (since titration flow is in a different file)
          targetTimeInBed: GLOBALRAW.targetTimeInBed,
          additionalCheckinData: {
            GSES1: GLOBAL.GSES1,
            GSES2: GLOBAL.GSES2,
            GSES3: GLOBAL.GSES3,
            GSES4: GLOBAL.GSES4,
            GSES5: GLOBAL.GSES5,
            GSES6: GLOBAL.GSES6,
            GSES7: GLOBAL.GSES7,
            GSESTotal: GLOBAL.GSESScore,
          },
          reminderObject: reminderObject,
        });
        navigation.navigate('App');
        refreshUserData(dispatch);
        setShowingFeedbackWidget(true);
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
    fontSize: scale(20),
  },
  rulesRecapContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});
