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
import DizzyFace from '../assets/images/DizzyFace.svg';
import RaisedHands from '../assets/images/RaisedHands.svg';
import AlarmClock from '../assets/images/AlarmClock.svg';
import Rule2Illustration from '../assets/images/Rule2Illustration.svg';
import Rule3Illustration from '../assets/images/Rule3Illustration.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';

// Define the theme for the file globally
// 'any' type for now since it's getting an expected something from Draftbit that's breaking.
const theme: any = dozy_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;

// Define default chart styles
const chartStyles = {
  chart: {
    width: scale(300),
    height: scale(300),
    domainPadding: { x: [3, 3], y: [35, 35] }
  },
  axis: {
    tickLabels: {
      angle: -45,
      fontSize: scale(11)
    },
    grid: {
      stroke: theme.colors.medium
    }
  },
  line: {
    data: {
      stroke: theme.colors.primary,
      strokeWidth: scale(4),
      strokeLinejoin: 'round'
    }
  }
};

export const Welcome = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
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
      textLabel="Welcome back! This week, we’ll review your sleep data, update your treatment plan, and get started with a technique to make falling asleep easier - Paradoxical Intention Therapy (PIT)."
    />
  );
};

// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'

export const TreatmentPlan = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('GSES1', {
          progressBarPercent: 0.28
        });
      }}
      titleLabel="This week's treatment: Paradoxical Intention Therapy"
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

export const GSES1 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.GSES1 = value;
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

export const GSES2 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.GSES2 = value;
        navigation.navigate('GSES3', { progressBarPercent: 0.67 });
      }}
      questionLabel="I feel I should be able to control my sleep."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false }
      ]}
    />
  );
};

export const GSES3 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.GSES3 = value;
        navigation.navigate('GSES4', { progressBarPercent: 0.67 });
      }}
      questionLabel="I put off going to bed at night for fear of not being able to sleep."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false }
      ]}
    />
  );
};

export const GSES4 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.GSES4 = value;
        navigation.navigate('GSES5', { progressBarPercent: 0.67 });
      }}
      questionLabel="I worry about not sleeping if I cannot sleep."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false }
      ]}
    />
  );
};

export const GSES5 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.GSES5 = value;
        navigation.navigate('GSES6', { progressBarPercent: 0.67 });
      }}
      questionLabel="I am no good at sleeping."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false }
      ]}
    />
  );
};

export const GSES6 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.GSES6 = value;
        navigation.navigate('GSES7', { progressBarPercent: 0.67 });
      }}
      questionLabel="I get anxious about sleeping before I go to bed."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false }
      ]}
    />
  );
};

export const GSES7 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.GSES7 = value;
        navigation.navigate('GSESResult', { progressBarPercent: 0.67 });
      }}
      questionLabel="I worry about the consequences of not sleeping."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Very much', value: 2, solidColor: false },
        { label: 'To some extent', value: 1, solidColor: false },
        { label: 'Not at all', value: 0, solidColor: false }
      ]}
    />
  );
};

export const WhyPIT = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PITOverview', {
          progressBarPercent: 0.33
        });
      }}
      titleLabel="Why PIT?"
      textLabel={
        "Falling asleep is a subconscious process. It's strange, but the harder we try to fall asleep, the more sleep will elude us. This effort creates a vicious cycle of trying harder and harder to sleep, with disapointing results. By *not* trying to fall asleep, we can actually make it easier."
      }
      buttonLabel="How?"
      flexibleLayout
    >
      <DizzyFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PITOverview = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

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

export const PMRWalkthrough = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

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

export const PostPMR = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

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

export const CalibrationStart = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res) => {
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

export const PMRIntentionAction = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.PMRIntentionAction = value;
        navigation.navigate('PITIntentionTime', { progressBarPercent: 0.67 });
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

export const PITIntentionTime = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={moment().hour(11).minute(0).toDate()}
      onQuestionSubmit={(value) => {
        GLOBAL.PMRIntentionTime = value;
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

export const TreatmentRecommit = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

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

export const RulesRecap = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
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

export const CheckinScheduling = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={new Date(new Date().getTime() + 86400000 * 7)}
      onQuestionSubmit={(value) => {
        GLOBAL.nextCheckinTime = value;
        navigation.navigate('SCTSRTEnd', { progressBarPercent: 1 });
      }}
      validInputChecker={(val) => {
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

export const SCTSRTEnd = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  const { state, dispatch } = React.useContext(AuthContext);
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        submitCheckinData({
          userId: state.userToken,
          checkinPostponed: false,
          nextCheckinDatetime: GLOBAL.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: GLOBAL.treatmentPlan.filter(
            (v) => v.started === false
          )[0].module,
          lastCheckinModule: 'RLX',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed
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
