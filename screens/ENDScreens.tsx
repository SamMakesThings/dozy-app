/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import { AuthContext } from '../utilities/authContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../assets/images/FemaleDoctor.svg';
import RaisedHands from '../assets/images/RaisedHands.svg';
import AlarmClock from '../assets/images/AlarmClock.svg';
import Rule2Illustration from '../assets/images/Rule2Illustration.svg';
import Rule3Illustration from '../assets/images/Rule3Illustration.svg';
import SleepingFace from '../assets/images/SleepingFace.svg';
import TiredFace from '../assets/images/TiredFace.svg';
import BarChart from '../assets/images/BarChart.svg';
import Expressionless from '../assets/images/Expressionless.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';
import { Navigation } from '../types/custom';

// Define the theme for the file globally
const theme = dozy_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

// Set up state for this check-in
let ENDState = {
  PMRIntentionAction: 'None',
  PMRIntentionTime: new Date(),
  nextCheckinTime: new Date(),
  ISI1: 0,
  ISI2: 0,
  ISI3: 0,
  ISI4: 0,
  ISI5: 0,
  ISI6: 0,
  ISI7: 0,
  ISITotal: 0
};

interface Props {
  navigation: Navigation;
  route: { params: { nextScreen: string; warnAbout: string } };
}

export const Welcome: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
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
      textLabel="Welcome back! Today we'll review your target schedule, then ask a few questions to check how your sleep is doing. Finally, we'll talk about how you can maintain your improved sleep, and what to do if insomnia appears again later."
    />
  );
};

// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'

export const TreatmentPlan: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ISIIntro', {
          progressBarPercent: 0.28
        });
      }}
      textLabel={
        "To check on your sleep, we'll ask you 7 questions. These are the same questions you answered when you first started Dozy!"
      }
      buttonLabel="Next"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

//
// ISI RETEST SCREENS
//

export const ISI1 = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        ENDState.ISI1 = value;
        navigation.navigate('ISI2', { progressBarPercent: 0.28 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true }
      ]}
      questionLabel="How much difficulty do you have falling asleep?"
    />
  );
};

export const ISI2 = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        ENDState.ISI2 = value;
        navigation.navigate('ISI3', { progressBarPercent: 0.42 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true }
      ]}
      questionLabel="How much difficulty do you have *staying* asleep?"
    />
  );
};

export const ISI3 = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        ENDState.ISI3 = value;
        navigation.navigate('ISI4', { progressBarPercent: 0.56 });
      }}
      buttonValues={[
        { label: 'Not a problem', value: 0, solidColor: true },
        { label: 'I rarely wake up too early', value: 1, solidColor: true },
        { label: 'I sometimes wake up too early', value: 2, solidColor: true },
        {
          label: 'I often wake up too early',
          value: 3,
          solidColor: true
        },
        { label: 'I always wake up too early', value: 4, solidColor: true }
      ]}
      questionLabel="How much of a problem do you have with waking up too early?"
    />
  );
};

export const ISI4 = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        ENDState.ISI4 = value;
        navigation.navigate('ISI5', { progressBarPercent: 0.7 });
      }}
      buttonValues={[
        { label: 'Very satisfied', value: 0, solidColor: true },
        { label: 'Satisfied', value: 1, solidColor: true },
        {
          label: 'Could be better, could be worse',
          value: 2,
          solidColor: true
        },
        { label: 'Dissatisfied', value: 3, solidColor: true },
        { label: 'Very dissatisfied', value: 4, solidColor: true }
      ]}
      questionLabel="How satisfied/dissatisfied are you with your current sleep pattern?"
    />
  );
};

export const ISI5 = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        ENDState.ISI5 = value;
        navigation.navigate('ISI6', { progressBarPercent: 0.84 });
      }}
      buttonValues={[
        { label: 'Not at all noticeable', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much noticeable', value: 4, solidColor: true }
      ]}
      questionLabel="How noticeable to others do you think your sleep problem is? (in terms of impairing the quality of your life)"
    />
  );
};

export const ISI6 = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        ENDState.ISI6 = value;
        navigation.navigate('ISI7', { progressBarPercent: 0.95 });
      }}
      buttonValues={[
        { label: 'Not at all worried', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much worried', value: 4, solidColor: true }
      ]}
      questionLabel="How worried are you about your current sleep pattern?"
    />
  );
};

export const ISI7 = ({ navigation }: Props) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        // Sum ISI scores, store value & navigate accordingly
        const { ISI1, ISI2, ISI3, ISI4, ISI5, ISI6 } = ENDState;
        ENDState.ISI7 = value;
        ENDState.ISITotal = ISI1 + ISI2 + ISI3 + ISI4 + ISI5 + ISI6 + value;
        navigation.navigate('ISIProcessing', { progressBarPercent: null });
      }}
      buttonValues={[
        { label: 'Not at all interfering', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much interfering', value: 4, solidColor: true }
      ]}
      questionLabel="How much does your sleep problem interfere with your daily life? (e.g. tiredness, mood, ability to function at work, concentration, etc.)?"
    />
  );
};

export const ISIProcessing = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ISIResults', {
          progressBarPercent: 0.14
        });
      }}
      textLabel="Done! Let's look at your results."
      buttonLabel="Next"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const ISIResults = ({ navigation }: Props) => {
  const { state } = React.useContext(AuthContext);

  const severityText = () => {
    if (ENDState.ISITotal <= 7) {
      return 'no clinically significant insomnia';
    } else if (ENDState.ISITotal <= 14) {
      return 'clinically mild insomnia';
    } else if (ENDState.ISITotal <= 21) {
      return 'clinically moderate insomnia';
    } else {
      return 'clinically severe insomnia';
    }
  };

  // Get % improvement in ISI score, format it nicely
  const prevISITotal = state.userData.baselineInfo.isiTotal;
  const rawISIPercentImprovement = (prevISITotal - ENDState.ISITotal) / 28;
  const ISIPercentImprovement =
    parseFloat(rawISIPercentImprovement.toFixed(2)) * 100;

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<BarChart width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate(
          ENDState.ISITotal > 7 ? 'ISISignificant' : 'ISINoSignificant',
          {
            progressBarPercent: null
          }
        );
      }}
      textLabel={
        <Text>
          According to the Insomnia Severity Index, you’ve got
          {ENDState.ISITotal >= 7 ? '\n' : ' '}
          <Text style={styles.BoldLabelText}>{severityText() + ' '}</Text>
          with a total of {ENDState.ISITotal} points. That's{' '}
          {ISIPercentImprovement}% improvement over your previous score!
        </Text>
      }
      buttonLabel="What's that mean?"
    />
  );
};

export const ISISignificant = ({ navigation }: Props) => {
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyIntro', {
          progressBarPercent: null
        });
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>
            Clinically significant insomnia{'\n'}
          </Text>
          <Text style={{ lineHeight: scale(18) }}>
            Your insomnia is {ENDState.ISITotal >= 14 ? 'definitely' : 'likely'}{' '}
            interfering with your life. However, there&apos;s good news:
            You&apos;re exactly the person our app was designed to help! With
            your support, Dozy can take you from your current insomnia to no
            insomnia.
          </Text>
        </>
      }
      buttonLabel="Let's get started"
    />
  );
};

export const ISINoSignificant = ({ navigation }: Props) => {
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Expressionless width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyIntro', {
          progressBarPercent: null
        });
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>
            No significant insomnia{'\n'}
          </Text>
          <Text style={{ lineHeight: scale(18) }}>
            We&apos;re glad to tell you that you don&apos;t have serious
            problems with insomnia. That said, this app is designed for people
            with more severe sleep problems. The techniques used may temporarily
            disrupt your sleep and may not improve it much. If you&apos;d still
            like to use the app, be our guest, just be aware that you may not
            get much out of it.
          </Text>
        </>
      }
      buttonLabel="Whatever, I'll use it anyway"
    />
  );
};

export const WhatCanIStop: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PMROverview', {
          progressBarPercent: 0.33
        });
      }}
      titleLabel="Why PMR?"
      textLabel={
        "About the end of treatment. Some of the rules we've set, we can phase out. For instance, if you no longer need it, you might stop using PMR or PIT to help you sleep. Or (if you're confident about it), you might start reading in bed again. (no phones though)"
      }
      buttonLabel="Cool"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PMROverview: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PMRWalkthrough', {
          progressBarPercent: 0.39
        });
      }}
      titleLabel="There are 3 main steps."
      textLabel={`1. Tense the muscles in your forehead for 5ish seconds. Feel what tension there feels like. 

2. Release the tension with a deep outbreath. Continue breathing deeply through the whole process. 

3. Repeat steps 1 and 2 for every major muscle group in the body.

It's all about noticing & releasing muscular tension.`}
      buttonLabel="Let's try it"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PMRWalkthrough: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PostPMR', {
          progressBarPercent: 0.44
        });
      }}
      textLabel={
        "Let's try it now! Find a comfy chair and follow along with the 6 minute video above. (If you have trouble seeing the video, make sure you don't have the YouTube website blocked.)"
      }
      buttonLabel="I've finished the video"
    >
      <WebView
        source={{
          uri: 'https://www.youtube.com/embed/1nZEdqcGVzo'
        }}
        style={{ width: useWindowDimensions().width, marginBottom: scale(20) }}
      />
    </WizardContentScreen>
  );
};

export const PostPMR: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('CalibrationStart', {
          progressBarPercent: 0.56
        });
      }}
      titleLabel="How do you feel?"
      textLabel={
        "If all went well, you should be feeling significantly more relaxed. This is a useful tool both during the day and when you're about to sleep. We'll leave this exercise on the home page where you can find it easily later."
      }
      buttonLabel="So how do I use it?"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const CalibrationStart: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res: string) => {
        if (res === 'Wait, I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'RLX'
          });
        } else {
          navigation.navigate('PMRIntentionAction', {
            progressBarPercent: 0.61
          });
        }
      }}
      titleLabel="How to apply PMR"
      textLabel={
        "During the week, we'll practice PMR twice daily: once during the day, and again when you go to bed at night."
      }
      buttonLabel="Ok, sounds reasonable"
      bottomGreyButtonLabel="Wait, I have questions"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PMRIntentionAction: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: string) => {
        ENDState.PMRIntentionAction = value;
        navigation.navigate('PMRIntentionTime', { progressBarPercent: 0.67 });
      }}
      buttonValues={[
        { label: 'Before lunch', value: 'before lunch', solidColor: false },
        { label: 'After lunch', value: 'after lunch', solidColor: false },
        {
          label: 'After getting home from work',
          value: 'after work',
          solidColor: false
        },
        { label: 'After dinner', value: 'after dinner', solidColor: false },
        { label: 'Other', value: 'other trigger', solidColor: false }
      ]}
      questionLabel="When would you like to practice PMR during the day?"
    />
  );
};

export const PMRIntentionTime: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={moment().hour(11).minute(0).toDate()}
      onQuestionSubmit={(value: Date) => {
        ENDState.PMRIntentionTime = value;
        navigation.navigate('TreatmentRecommit', {
          progressBarPercent: 0.72
        });
      }}
      questionLabel="When would you like to be reminded?"
      questionSubtitle="We'll send a push notification to remind you."
      mode="time"
    />
  );
};

export const TreatmentRecommit: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('RulesRecap', {
          progressBarPercent: 0.78
        });
      }}
      titleLabel="Can you re-commit to following the treatment plan this week?"
      textLabel={
        "That means following the target sleep schedule, following the 3 rules (nothing in bed besides sleeping, etc), practicing PMR during the day and before sleeping, and any others you've started."
      }
      buttonLabel="Yes, I can do it this week"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const RulesRecap: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('LastTip', {
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

export const LastTip: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('CheckinScheduling', {
          progressBarPercent: 0.9
        });
      }}
      titleLabel="One last tip"
      textLabel={
        'For a powerful combo: try relaxing your muscles thoroughly, then gently maintaining focus on the sensation of breathing until you fall asleep.'
      }
      buttonLabel="Continue"
      flexibleLayout
    >
      <SleepingFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const CheckinScheduling: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={new Date(new Date().getTime() + 86400000 * 7)}
      onQuestionSubmit={(value: Date) => {
        ENDState.nextCheckinTime = value;
        navigation.navigate('SCTSRTEnd', { progressBarPercent: 1 });
      }}
      validInputChecker={(val: Date) => {
        // Make sure the selected date is 7+ days from today
        // Make sure it's within 14 days
        // Otherwise, mark it valid by returning true
        if (moment().add(7, 'days').hour(0).toDate() > val) {
          return {
            severity: 'ERROR',
            errorMsg: 'Please select a day 7 or more days from today'
          };
        } else if (moment().add(14, 'days').hour(0).toDate() < val) {
          return {
            severity: 'WARNING',
            errorMsg: 'Please select a day within 14 days of today'
          };
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

export const SCTSRTEnd: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  const { state, dispatch } = React.useContext(AuthContext);

  // Create reminder objects, put them in an array
  let reminderArray = [
    {
      expoPushToken: state.userData.reminders.expoPushToken,
      title: 'Next checkin is ready',
      body: 'Open the app now to get started',
      type: 'CHECKIN_REMINDER',
      time: ENDState.nextCheckinTime,
      enabled: true
    }
  ];
  // Give the option to not set a reminder for PMR practice
  if (ENDState.PMRIntentionTime) {
    reminderArray.push({
      expoPushToken: state.userData.reminders.expoPushToken,
      title: 'Remember to practice PMR',
      body: 'Go to the Treatments screen to practice',
      type: 'PMR_REMINDER',
      time: ENDState.PMRIntentionTime,
      enabled: true
    });
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<RaisedHands width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        submitCheckinData({
          userId: state.userToken,
          checkinPostponed: false,
          nextCheckinDatetime: ENDState.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: GLOBAL.treatmentPlan.filter(
            (v) => v.started === false && v.module !== 'RLX'
          )[0].module,
          lastCheckinModule: 'RLX',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed,
          additionalCheckinData: {
            PMRIntentionAction: ENDState.PMRIntentionAction,
            PMRIntentionTime: ENDState.PMRIntentionTime
          },
          reminderObject: reminderArray
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
