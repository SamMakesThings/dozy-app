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
import { AuthContext } from '../utilities/authContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../assets/images/FemaleDoctor.svg';
import ThumbsUp from '../assets/images/ThumbsUp.svg';
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
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';

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

export const SRTTitrationStart = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);
  let imgSize = imgSizePercent * useWindowDimensions().width;
  // Trim sleepLogs to only show most recent 7
  const recentSleepLogs = state.sleepLogs.slice(0, 7);

  // Calculate recent sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (recentSleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        recentSleepLogs.length) *
      100
    ).toFixed(0)
  );

  function getSRTTitrationLabel(sleepEffiencyAvg) {
    if (sleepEffiencyAvg < 85) {
      return `Good job sticking to your target sleep schedule! However, your sleep data may indicate that more action is needed.`;
    } else if (sleepEffiencyAvg >= 85 && sleepEffiencyAvg < 90) {
      return `Great job sticking to your target sleep schedule! Your sleep is starting to show signs of improvement.`;
    } else {
      return 'Great job sticking to your target sleep schedule!! Thanks to your efforts, your sleep efficiency has been going up.';
    }
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SleepEfficiency', { progressBarPercent: 0.09 });
      }}
      textLabel={getSRTTitrationLabel(sleepEfficiencyAvg)}
      buttonLabel="Got it - what does that mean?"
    >
      <ThumbsUp width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SleepEfficiency = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 7
  const recentSleepLogs = state.sleepLogs.slice(0, 7);

  // Calculate recent sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (recentSleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        recentSleepLogs.length) *
      100
    ).toFixed(0)
  );

  // Pull baseline from state
  const sleepEfficiencyAvgBaseline =
    state.userData.baselineInfo.sleepEfficiencyAvg;

  function getLabel(sleepEffiencyAvg) {
    if (sleepEffiencyAvg < 85) {
      return `Your sleep efficiency is ok, but with an average of ${sleepEffiencyAvg}% (previously ${sleepEfficiencyAvgBaseline}%) it's not quite where we need it to be yet. More action may be needed.`;
    } else if (sleepEffiencyAvg >= 85 && sleepEffiencyAvg < 90) {
      return `Your sleep is starting to show signs of improvement. You previously had an average sleep efficiency of ${sleepEfficiencyAvgBaseline}%, and it has since been around to ${sleepEfficiencyAvg}%! You're making progress!`;
    } else {
      return `Your sleep is showing signs of improvement. You previously had an average sleep efficiency of ${sleepEfficiencyAvgBaseline}%, and it has since risen to ${sleepEfficiencyAvg}%! You're making great progress.`;
    }
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SRTTitration', {
          progressBarPercent: 0.07
        });
      }}
      textLabel={getLabel(sleepEfficiencyAvg)}
    >
      <VictoryChart
        width={chartStyles.chart.width}
        height={chartStyles.chart.height}
        theme={VictoryTheme.material}
        scale={{ x: 'time' }}
        domainPadding={chartStyles.chart.domainPadding}
      >
        <VictoryAxis
          dependentAxis
          tickFormat={(tick) => tick * 100 + '%'}
          style={chartStyles.axis}
          tickCount={5}
        />
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
          y="sleepEfficiency"
          style={chartStyles.line}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};

export const SRTTitration = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  let imgSize = imgSizePercent * useWindowDimensions().width;

  // Trim sleepLogs to only show most recent 7
  const recentSleepLogs = state.sleepLogs.slice(0, 7);

  // Calculate recent sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (recentSleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        recentSleepLogs.length) *
      100
    ).toFixed(0)
  );

  function getSRTTitrationLabel(sleepEffiencyAvg) {
    if (sleepEffiencyAvg < 85) {
      return `Based on your sleep efficiency, we should maintain the same bedtime & wake time this week. For most people, sleep efficiency climbs over 90% by the next week, and we can start allotting more time in bed. From there, it's adding 15 minutes to bedtime each week until you're sleeping the whole night through.`;
    } else if (sleepEffiencyAvg >= 85 && sleepEffiencyAvg < 90) {
      return `Based on your sleep efficiency, we should maintain the same bedtime & wake time this week. For most people, sleep efficiency climbs over 90% by the next week, and we can start allotting more time in bed. From there, it's adding 15 minutes to bedtime each week until you're sleeping the whole night through.`;
    } else {
      return 'Based on this result, we can increase time in bed by 15 minutes for the next week. Your new target bedtime is (TIME). ';
    }
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SleepOnset', { progressBarPercent: 0.09 });
      }}
      textLabel={getSRTTitrationLabel(sleepEfficiencyAvg)}
      flexibleLayout
    >
      <AlarmClock width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SleepOnset = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 10
  const recentSleepLogs = state.sleepLogs.slice(0, 10);

  // Calculate recent sleep onset average
  const sleepOnsetAvg = Number(
    (
      recentSleepLogs.reduce((a, b) => a + b.minsToFallAsleep, 0) /
      recentSleepLogs.length
    ).toFixed(0)
  );

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SleepMaintenance', {
          progressBarPercent: 0.11
        });
      }}
      textLabel={
        'Your sleep onset latency (time it takes to fall asleep) has been ' +
        (sleepOnsetAvg > 45 ? 'poor this week' : 'ok this week') +
        " - you've been taking an average of " +
        sleepOnsetAvg +
        ' minutes to fall asleep. This number will improve along with sleep efficiency in the coming weeks.'
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
          y="minsToFallAsleep"
          style={chartStyles.line}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};

export const SleepMaintenance = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 10
  const recentSleepLogs = state.sleepLogs.slice(0, 10);

  // Calculate recent night mins awake average
  const nightMinsAwakeAvg = Number(
    (
      recentSleepLogs.reduce((a, b) => a + b.nightMinsAwake, 0) /
      recentSleepLogs.length
    ).toFixed(0)
  );

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TreatmentPlan', {
          progressBarPercent: 0.14
        });
      }}
      textLabel={
        'Your sleep maintenance (how easily you stay asleep) has been ' +
        (nightMinsAwakeAvg > 45 ? 'poor this week' : 'ok this week') +
        " - after initially falling sleep, you're awake " +
        nightMinsAwakeAvg +
        " minutes on average. This number will also improve with the techniques we're introducing today."
      }
      buttonLabel="This week's treatment"
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
          y="nightMinsAwake"
          style={chartStyles.line}
          interpolation="monotoneX"
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};

// TODO: Add sleep duration chart screen
// Have it navigate to passed in value

const styles = StyleSheet.create({
  BoldLabelText: {
    fontFamily: 'RubikMedium',
    fontSize: scale(20)
  }
});
