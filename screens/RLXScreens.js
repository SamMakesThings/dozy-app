/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis
} from 'victory-native';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import { AuthContext } from '../utilities/authContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import * as SRTTitrationScreens from './SRTTitrationScreens';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../assets/images/FemaleDoctor.svg';
import Clipboard from '../assets/images/Clipboard.svg';
import RaisedHands from '../assets/images/RaisedHands.svg';
import SCTSRTTreatmentPlan from '../assets/images/SCTSRTTreatmentPlan.svg';
import BadCycleIllustration from '../assets/images/BadCycleIllustration.svg';
import AlarmClock from '../assets/images/AlarmClock.svg';
import Rule2Illustration from '../assets/images/Rule2Illustration.svg';
import Rule3Illustration from '../assets/images/Rule3Illustration.svg';
import BarChart from '../assets/images/BarChart.svg';
import YellowRuler from '../assets/images/YellowRuler.svg';
import ManInBed from '../assets/images/ManInBed.svg';
import RaisedEyebrowFace from '../assets/images/RaisedEyebrowFace.svg';
import { TargetSleepScheduleCard } from '../components/TargetSleepScheduleCard';
import { formatDateAsTime } from '../utilities/formatDateAsTime.ts';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';

// TODO: Add progress bar percentages to each screen

// Define the theme for the file globally
const theme = dozy_theme;

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
          progressBarPercent: 0.03
        });
      }}
      textLabel="Welcome back! This week, we’ll review your sleep data, update your treatment plan, and get started with some relaxation techniques to help you sleep."
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
        navigation.navigate('WhyPMR', {
          progressBarPercent: 0.15
        });
      }}
      titleLabel="This week's treatment: Progressive Muscle Relaxation"
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

export const WhyPMR = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PMROverview', {
          progressBarPercent: 0.22
        });
      }}
      titleLabel="Why PMR?"
      textLabel={
        "Worry and muscular tension that we're not even aware of can often prevent us from falling sleep. By learning physical relaxation techniques, we can also improve mental relaxation, thereby falling asleep faster. (How?)"
      }
      buttonLabel="Next"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PMROverview = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PMRWalkthrough', {
          progressBarPercent: 0.22
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
          progressBarPercent: 0.22
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
        }} /*'https://www.youtube.com/watch?v=1nZEdqcGVzo'*/
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
        navigation.navigate('PMRWalkthrough', {
          progressBarPercent: 0.22
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

export const RulesRecap = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('WhatToExpect', {
          progressBarPercent: 0.59
        });
      }}
      titleLabel="A quick recap:"
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

export const WhatToExpect = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('UnderstandingAsk', {
          progressBarPercent: 0.62
        });
      }}
      titleLabel="What to expect"
      textLabel="For most, sleep efficiency starts improving after 2-6 days of this schedule. Once efficiency is over 90%, we'll increase your time in bed by 15 minutes every week until you sleep through the night reliably."
      flexibleLayout
      buttonLabel="Makes sense"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const UnderstandingAsk = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res) => {
        if (res === 'I have some questions or concerns') {
          navigation.navigate('TreatmentReview', {
            module: 'SCTSRT'
          });
        } else {
          navigation.navigate('SRTCalibrationIntro', {
            progressBarPercent: 0.66
          });
        }
      }}
      textLabel="In other words, by following this program, you're trading a week or two of reduced sleep for a lifetime without insomnia. Short-term pain for long term gain."
      flexibleLayout
      buttonLabel="I understand, let's start"
      bottomGreyButtonLabel="I have some questions or concerns"
    >
      <BarChart width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

// TreatmentReview screen is defined in the SCTSRTNavigator.js file!

export const SRTCalibrationIntro = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('WakeTimeSetting', {
          progressBarPercent: 0.7
        });
      }}
      titleLabel="Treatment calibration"
      textLabel="Ok - now we'll customize the treatment for you. Let’s set your bedtime and out-of-bed time targets."
      buttonLabel="Makes sense"
    >
      <YellowRuler width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const WakeTimeSetting = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={moment().hour(9).minute(0).toDate()}
      onQuestionSubmit={(value) => {
        GLOBAL.SCTSRTWakeTime = value;
        navigation.navigate('SleepDurationCalculation', {
          progressBarPercent: 0.74
        });
      }}
      validInputChecker={(val) => {
        // Make sure the selected time is before 17:00, otherwise it's a likely sign of AM/PM mixup
        return moment(val).hour() < 17
          ? true
          : 'Did you set AM/PM correctly? Selected time is late for a wake time.';
      }}
      questionLabel="What time do you want to get up every morning this week?"
      questionSubtitle="Pick a consistent time and try to stick to it - our treatments won't be as effective if you change your hours on the weekend."
      mode="time"
    />
  );
};

export const SleepDurationCalculation = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 10
  const recentSleepLogs = state.sleepLogs.slice(0, 10);

  // Calculate recent sleep efficiency average
  const sleepDurationAvg = Number(
    (
      recentSleepLogs.reduce((a, b) => a + b.sleepDuration, 0) /
      recentSleepLogs.length
    ).toFixed(0)
  );

  // Calculate Time in Bed (TIB) target
  // Round it to the nearest multiple of 15. Min value 5h (300 mins)
  let timeInBedTarget;
  if (sleepDurationAvg < 300) {
    timeInBedTarget = 315;
  } else {
    timeInBedTarget = 15 * Math.round(sleepDurationAvg / 15);
  }
  GLOBAL.SCTSRTTimeInBedTarget = timeInBedTarget;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TargetBedtime', {
          progressBarPercent: 0.78
        });
      }}
      titleLabel={
        'Your average time asleep is ' +
        (sleepDurationAvg / 60).toFixed(1) +
        ' hours.'
      }
      textLabel={
        "Based on this, we'll set your time in bed at " +
        timeInBedTarget / 60 +
        ' hours to start. Time in bed is the total time you spend laying in bed, including time awake.'
      }
    >
      <VictoryChart
        width={chartStyles.chart.width}
        height={chartStyles.chart.height}
        theme={VictoryTheme.material}
        scale={{ x: 'time' }}
        domainPadding={chartStyles.chart.domainPadding}
      >
        <VictoryAxis dependentAxis style={chartStyles.axis} tickCount={5} />
        <VictoryAxis
          style={chartStyles.axis}
          tickFormat={(tick) => {
            return tick.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          }}
          tickCount={7}
        />
        <VictoryLine
          data={recentSleepLogs}
          x={(d) => d.upTime.toDate()}
          y="sleepDuration"
          style={chartStyles.line}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};

export const TargetBedtime = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  // Calculate target bedtime based on TIB and wake time
  const targetBedTime = moment(GLOBAL.SCTSRTWakeTime)
    .subtract(GLOBAL.SCTSRTTimeInBedTarget, 'minutes')
    .toDate();
  GLOBAL.SCTSRTBedTime = targetBedTime;
  const targetBedTimeDisplayString = formatDateAsTime(targetBedTime);
  GLOBAL.targetBedTimeDisplayString = targetBedTimeDisplayString;
  const targetWakeTimeDisplayString = formatDateAsTime(GLOBAL.SCTSRTWakeTime);
  GLOBAL.targetWakeTimeDisplayString = targetWakeTimeDisplayString;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PrescriptionSummary', {
          progressBarPercent: 0.81
        });
      }}
      titleLabel={'Your target bedtime is ' + targetBedTimeDisplayString}
      textLabel={
        'Calculated from your target Time in Bed (TIB) and preferred wake time of ' +
        targetWakeTimeDisplayString +
        '.'
      }
      buttonLabel="Got it"
    >
      <ManInBed width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const PrescriptionSummary = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('DeprivationWarning', {
          progressBarPercent: 0.85
        });
      }}
      titleLabel={'Your target sleep schedule'}
      textLabel={
        'The plan is to get in bed at ' +
        GLOBAL.targetBedTimeDisplayString +
        ' and get out of bed at ' +
        GLOBAL.targetWakeTimeDisplayString +
        ", regardless of how sleepy you feel. Within that window, you're to get out of bed if unable to sleep. Next week, once your sleep efficiency has jumped, we'll increase your time in bed by 15 minutes."
      }
      buttonLabel="Next"
      flexibleLayout
    >
      <View style={{ maxHeight: scale(150) }}>
        <TargetSleepScheduleCard
          bedTime={GLOBAL.targetBedTimeDisplayString}
          wakeTime={GLOBAL.targetWakeTimeDisplayString}
          styles={{ minWidth: scale(300) }}
        />
      </View>
    </WizardContentScreen>
  );
};

export const DeprivationWarning = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(val) => {
        if (val !== 'Wait, I have some concerns') {
          navigation.navigate('CheckinScheduling', {
            progressBarPercent: 0.88
          });
        } else {
          navigation.navigate('AddressingConcerns');
        }
      }}
      textLabel="Note that this treatment will cause a temporary reduction in sleep before it starts kicking in. You’ll get less sleep than you normally would for 1-3 weeks, in exchange for permanent improvement. Are you ready to commit to following these rules this week?"
      buttonLabel="Yes! I will do it this week"
      bottomGreyButtonLabel="Wait, I have some concerns"
      flexibleLayout
    >
      <RaisedEyebrowFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const AddressingConcerns = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(val) => {
        if (val !== 'Postpone, not a good time') {
          GLOBAL.checkinPostponed = false;
          navigation.navigate('TreatmentReview', {
            module: 'SCTSRT',
            progressBarPercent: 0.95
          });
        } else {
          GLOBAL.checkinPostponed = true;
          navigation.navigate('CheckinScheduling');
        }
      }}
      titleLabel="What's up?"
      textLabel="We can answer any questions you may have, or if this week isn’t ideal (e.g. important test, presentation, etc), then we can postpone starting treatment to next week."
      buttonLabel="I have questions"
      bottomGreyButtonLabel="Postpone, not a good time"
      bottomBackButtonLabel="I'm good, let's get started"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
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
        // TODO: Add validation to ensure date is far out enough for data colleciton
        // Another option - wait until 7 sleep logs are collected before allowing continue
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
      image={<RaisedHands width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        // TODO: Get the treatments screen to update when
        // ...finished with checkin
        submitCheckinData({
          userId: state.userToken,
          checkinPostponed: GLOBAL.checkinPostponed,
          nextCheckinDatetime: GLOBAL.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: GLOBAL.treatmentPlan.filter(
            (v) => v.started === false
          )[0].module,
          lastCheckinModule: 'SCTSRT',
          targetBedTime: GLOBAL.SCTSRTBedTime,
          targetWakeTime: GLOBAL.SCTSRTWakeTime,
          targetTimeInBed: GLOBAL.SCTSRTTimeInBedTarget
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
