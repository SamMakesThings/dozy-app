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

export const SleepEfficiency = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 10
  const recentSleepLogs = state.sleepLogs.slice(0, 10);

  // Calculate recent sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (recentSleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        recentSleepLogs.length) *
      100
    ).toFixed(0)
  );

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SleepOnset', {
          progressBarPercent: 0.07
        });
      }}
      textLabel={
        'Your sleep efficiency has been ' +
        (sleepEfficiencyAvg < 85 ? 'poor this week' : 'good this week') +
        ', with an average of ' +
        sleepEfficiencyAvg +
        '% per night. ' +
        (sleepEfficiencyAvg < 85 ? 'Not to worry' : 'Regardless') +
        " - the techniques we'll be introducing today will " +
        (sleepEfficiencyAvg < 85
          ? 'focus on permanently boosting'
          : 'still improve') +
        ' sleep efficiency.'
      }
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

// TODO: Add SRT titration screen here

export const SleepOnset = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 10
  const recentSleepLogs = state.sleepLogs.slice(0, 10);

  // Calculate recent sleep efficiency average
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

  // Calculate recent sleep efficiency average
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
