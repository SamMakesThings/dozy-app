import React from 'react';
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import { AuthContext } from '../context/AuthContext';
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
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';
import { Navigation } from '../types/custom';
import { ErrorObj } from '../types/error';

// Define the theme for the file globally
const theme = dozy_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

// Set up state for this check-in
const RLXState = {
  PMRIntentionAction: 'None',
  PMRIntentionTime: new Date(),
  nextCheckinTime: new Date(),
};

export const Welcome: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<FemaleDoctor width={imgSize} height={imgSize * 1.2} />}
      onQuestionSubmit={() => {
        navigation.navigate('SRTTitrationStart', {
          progressBarPercent: 0.06,
        });
      }}
      textLabel="Welcome back! This week, we’ll review your sleep data, update your care plan, and get started with some relaxation techniques to help you sleep."
    />
  );
};

// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'

export const TreatmentPlan: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('WhyPMR', {
          progressBarPercent: 0.28,
        });
      }}
      titleLabel="This week: Progressive Muscle Relaxation"
      textLabel={
        "Based on your sleep data, the next step is to give you some new tools to address stress & tension. We'll do this by learning a technique called Progressive Muscle Relaxation (PMR)."
      }
      buttonLabel="Next"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const WhyPMR: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PMROverview', {
          progressBarPercent: 0.33,
        });
      }}
      titleLabel="Why PMR?"
      textLabel={
        "Worry and muscular tension that we're not even aware of can often prevent us from falling sleep. By learning physical relaxation techniques, we can also improve mental relaxation, thereby falling asleep faster."
      }
      buttonLabel="How?"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PMROverview: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PMRWalkthrough', {
          progressBarPercent: 0.39,
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
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PostPMR', {
          progressBarPercent: 0.44,
        });
      }}
      textLabel={
        "Let's try it now! Find a comfy chair and follow along with the 6 minute video above. (If you have trouble seeing the video, make sure you don't have the YouTube website blocked.)"
      }
      buttonLabel="I've finished the video"
    >
      <WebView
        source={{
          uri: 'https://www.youtube.com/embed/1nZEdqcGVzo',
        }}
        style={{
          ...styles.webView,
          width: useWindowDimensions().width,
          marginBottom: scale(20),
        }}
      />
    </WizardContentScreen>
  );
};

export const PostPMR: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('CalibrationStart', {
          progressBarPercent: 0.56,
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
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === 'Wait, I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'RLX',
          });
        } else {
          navigation.navigate('PMRIntentionAction', {
            progressBarPercent: 0.61,
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
  navigation,
}) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        RLXState.PMRIntentionAction = value as string;
        navigation.navigate('PMRIntentionTime', { progressBarPercent: 0.67 });
      }}
      buttonValues={[
        { label: 'Before lunch', value: 'before lunch', solidColor: false },
        { label: 'After lunch', value: 'after lunch', solidColor: false },
        {
          label: 'After getting home from work',
          value: 'after work',
          solidColor: false,
        },
        { label: 'After dinner', value: 'after dinner', solidColor: false },
        { label: 'Other', value: 'other trigger', solidColor: false },
      ]}
      questionLabel="When would you like to practice PMR during the day?"
    />
  );
};

export const PMRIntentionTime: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={moment().hour(11).minute(0).toDate()}
      onQuestionSubmit={(value: Date | boolean) => {
        RLXState.PMRIntentionTime = value as Date;
        navigation.navigate('TreatmentRecommit', {
          progressBarPercent: 0.72,
        });
      }}
      questionLabel="When would you like to be reminded?"
      questionSubtitle="We'll send a push notification to remind you."
      mode="time"
    />
  );
};

export const TreatmentRecommit: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('RulesRecap', {
          progressBarPercent: 0.78,
        });
      }}
      titleLabel="Can you re-commit to following the care plan this week?"
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
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('LastTip', {
          progressBarPercent: 0.83,
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

export const LastTip: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('CheckinScheduling', {
          progressBarPercent: 0.9,
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
  navigation,
}) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={new Date(new Date().getTime() + 86400000 * 7)}
      onQuestionSubmit={(value: Date | boolean) => {
        RLXState.nextCheckinTime = value as Date;
        navigation.navigate('SCTSRTEnd', { progressBarPercent: 1 });
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

export const SCTSRTEnd: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  const { state, dispatch } = React.useContext(AuthContext);

  // Create reminder objects, put them in an array
  const reminderArray = [
    {
      expoPushToken: state.userData.reminders.expoPushToken,
      title: 'Next checkin is ready',
      body: 'Open the app now to get started',
      type: 'CHECKIN_REMINDER',
      time: RLXState.nextCheckinTime,
      enabled: true,
    },
  ];
  // Give the option to not set a reminder for PMR practice
  if (RLXState.PMRIntentionTime) {
    reminderArray.push({
      expoPushToken: state.userData.reminders.expoPushToken,
      title: 'Remember to practice PMR',
      body: 'Go to the home screen to practice',
      type: 'PMR_REMINDER',
      time: RLXState.PMRIntentionTime,
      enabled: true,
    });
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        if (state.userId) {
          submitCheckinData({
            userId: state.userId,
            checkinPostponed: false,
            nextCheckinDatetime: RLXState.nextCheckinTime,
            lastCheckinDatetime: new Date(),
            nextCheckinModule: GLOBAL.treatmentPlan.filter(
              (v) => v.started === false && v.module !== 'RLX',
            )[0].module,
            lastCheckinModule: 'RLX',
            targetBedTime: GLOBAL.targetBedTime,
            targetWakeTime: GLOBAL.targetWakeTime,
            targetTimeInBed: GLOBAL.targetTimeInBed,
            additionalCheckinData: {
              PMRIntentionAction: RLXState.PMRIntentionAction,
              PMRIntentionTime: RLXState.PMRIntentionTime,
            },
            reminderObject: reminderArray,
          });
          navigation.navigate('App');
          refreshUserData(dispatch);
        } else {
          console.log('ERROR IN SCTSRTend: Invalid user id');
        }
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
  webView: {
    opacity: 0.99,
    overflow: 'hidden',
  },
});
