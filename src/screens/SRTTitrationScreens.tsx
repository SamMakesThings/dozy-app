import React from 'react';
import { useWindowDimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
} from 'victory-native';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import ThumbsUp from '../../assets/images/ThumbsUp.svg';
import AlarmClock from '../../assets/images/AlarmClock.svg';
import { formatDateAsTime } from '../utilities/formatDateAsTime';
import { Navigation, SleepLog } from '../types/custom';
import { useSleepLogsStore } from '../utilities/sleepLogsStore';
import { useUserDataStore } from '../utilities/userDataStore';

interface Props {
  navigation: Navigation;
}

// Define the theme for the file globally
const theme = dozy_theme;

// Define square image size defaults as a percent of width, and set global SleepLogs value
const imgSizePercent = 0.4;
let recentSleepLogs: Array<SleepLog> = [];

// Define default chart styles
const chartStyles = {
  chart: {
    width: scale(300),
    height: scale(300),
    domainPadding: { x: 3, y: 35 },
  },
  axis: {
    tickLabels: {
      angle: -45,
      fontSize: scale(11),
    },
    grid: {
      stroke: theme.colors.medium,
    },
  },
  line: {
    data: {
      stroke: theme.colors.primary,
      strokeWidth: scale(4),
      strokeLinejoin: 'round',
    },
  },
  scatter: {
    data: {
      fill: theme.colors.primary,
    },
  },
};

export const SRTTitrationStart: React.FC<Props> = ({ navigation }) => {
  const imgSize = imgSizePercent * useWindowDimensions().width;
  const sleepLogs = useSleepLogsStore((logsState) => logsState.sleepLogs);
  // Trim sleepLogs to only show most recent 7
  recentSleepLogs = sleepLogs.slice(0, 7);

  // Calculate recent sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (recentSleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        recentSleepLogs.length) *
      100
    ).toFixed(0),
  );

  function getSRTTitrationLabel(sleepEffiencyAvg: number) {
    if (sleepEffiencyAvg < 80) {
      return `Good job sticking to your target sleep schedule! However, your sleep data may indicate that more action is needed.`;
    } else if (sleepEffiencyAvg >= 80 && sleepEffiencyAvg < 87) {
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

export const SleepEfficiency: React.FC<Props> = ({ navigation }) => {
  const { userData } = useUserDataStore((userState) => userState.userData);

  // Calculate recent sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (recentSleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        recentSleepLogs.length) *
      100
    ).toFixed(0),
  );

  // Pull baseline from state
  const sleepEfficiencyAvgBaseline = userData.baselineInfo.sleepEfficiencyAvg;

  function getLabel(sleepEffiencyAvg: number) {
    if (sleepEfficiencyAvg < sleepEfficiencyAvgBaseline) {
      return sleepEfficiencyAvg < 85
        ? `Your sleep efficiency is ok, but with an average of ${sleepEffiencyAvg}% (previously ${sleepEfficiencyAvgBaseline}%) it's not quite where we need it to be yet.`
        : `Your sleep efficiency was slightly lower ${sleepEffiencyAvg} than your baseline of ${sleepEfficiencyAvgBaseline}%), but it's still plenty high - nothing to worry about.`;
    } else if (sleepEffiencyAvg < 80) {
      return `Your sleep efficiency is ok, but with an average of ${sleepEffiencyAvg}% (previously ${sleepEfficiencyAvgBaseline}%) it's not quite where we need it to be yet.`;
    } else if (sleepEffiencyAvg >= 80 && sleepEffiencyAvg < 87) {
      return `Your sleep is starting to show signs of improvement. You previously had an average sleep efficiency of ${sleepEfficiencyAvgBaseline}%, and it has since been around ${sleepEfficiencyAvg}%! You're making progress!`;
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
          progressBarPercent: 0.12,
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
              day: 'numeric',
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
        <VictoryScatter
          data={recentSleepLogs}
          x={(d) => d.upTime.toDate()}
          y="sleepEfficiency"
          style={chartStyles.scatter}
          size={scale(5)}
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};

export const SRTTitration: React.FC<Props> = ({ navigation }) => {
  const { userData } = useUserDataStore((userState) => userState.userData);

  const imgSize = imgSizePercent * useWindowDimensions().width;

  // Calculate recent sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (recentSleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        recentSleepLogs.length) *
      100
    ).toFixed(0),
  );

  // Use old target bedtime to calculate new (if needed)
  const oldTargetBedTime = userData.currentTreatments.targetBedTime.toDate();
  const newTargetBedTime = oldTargetBedTime;
  GLOBAL.targetTimeInBed = userData.currentTreatments.targetTimeInBed;
  if (sleepEfficiencyAvg >= 87) {
    newTargetBedTime.setMinutes(oldTargetBedTime.getMinutes() - 15);
    GLOBAL.targetTimeInBed = userData.currentTreatments.targetTimeInBed + 15;
  }
  const targetBedTimeLabel = formatDateAsTime(newTargetBedTime);
  const targetWakeTimeLabel = formatDateAsTime(
    userData.currentTreatments.targetWakeTime.toDate(),
  );

  function getSRTTitrationLabel(sleepEffiencyAvg: number) {
    if (sleepEffiencyAvg < 80) {
      return `Based on your sleep efficiency, we should maintain the same target bedtime (${targetBedTimeLabel}) & wake time (${targetWakeTimeLabel}) this week. For most people, sleep efficiency climbs over 90% by the next week, and we can start allotting more time in bed. From there, it's adding 15 minutes to bedtime each week until you're sleeping the whole night through.`;
    } else if (sleepEffiencyAvg >= 80 && sleepEffiencyAvg < 87) {
      return `Based on your sleep efficiency, we should maintain the same target bedtime (${targetBedTimeLabel}) & wake time (${targetWakeTimeLabel}) this week. For most people, sleep efficiency climbs over 90% by the next week, and we can start allotting more time in bed. From there, it's adding 15 minutes to bedtime each week until you're sleeping the whole night through.`;
    } else {
      return `Based on this result, we can increase time in bed by 15 minutes for the next week. Your new target bedtime is ${targetBedTimeLabel}. Maintain your wake time at (${targetWakeTimeLabel}).`;
    }
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        // Set target bedtime and wake time in Global for use in treatment module submit function
        GLOBAL.targetBedTime = newTargetBedTime;
        GLOBAL.targetWakeTime =
          userData.currentTreatments.targetWakeTime.toDate();
        navigation.navigate('SleepOnset', { progressBarPercent: 0.15 });
      }}
      textLabel={getSRTTitrationLabel(sleepEfficiencyAvg)}
      buttonLabel="Review sleep onset"
      flexibleLayout
    >
      <AlarmClock width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SleepOnset: React.FC<Props> = ({ navigation }) => {
  const { userData } = useUserDataStore((userState) => userState.userData);

  // Calculate recent sleep onset average & fetch baseline for comparison
  const sleepOnsetAvg = Number(
    (
      recentSleepLogs.reduce((a, b) => a + b.minsToFallAsleep, 0) /
      recentSleepLogs.length
    ).toFixed(0),
  );
  const baselineSleepOnsetAvg = userData.baselineInfo.sleepOnsetAvg;

  function getLabel(sleepAvg: number) {
    if (sleepAvg > baselineSleepOnsetAvg + 5) {
      return `On average, it's taken you ${sleepAvg} minutes to fall asleep this week, which is a bit worse than your previous baseline of ${baselineSleepOnsetAvg} minutes. The techniques we're introducing today may help you fall asleep faster.`;
    } else if (sleepAvg > baselineSleepOnsetAvg - 2) {
      return `On average, it's taken you ${sleepAvg} minutes to fall asleep this week, which is about the same as your previous baseline of ${baselineSleepOnsetAvg} minutes. The techniques we're introducing today may help you fall asleep faster.`;
    } else {
      return `On average, it's taken you ${sleepAvg} minutes to fall asleep this week, which is improved over your ${baselineSleepOnsetAvg} minutes before treatment. Keep up the good work!`;
    }
  }

  const highestValueForDomain = Math.max(
    ...recentSleepLogs.map(function (o) {
      return o.minsToFallAsleep;
    }),
  );

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SleepMaintenance', {
          progressBarPercent: 0.18,
        });
      }}
      textLabel={getLabel(sleepOnsetAvg)}
      buttonLabel="Review sleep maintenance"
    >
      <VictoryChart
        width={chartStyles.chart.width}
        height={chartStyles.chart.height}
        theme={VictoryTheme.material}
        scale={{ x: 'time' }}
        domainPadding={chartStyles.chart.domainPadding}
        domain={{ y: [0, highestValueForDomain] }}
      >
        <VictoryAxis dependentAxis style={chartStyles.axis} tickCount={5} />
        <VictoryAxis
          style={chartStyles.axis}
          tickFormat={(tick) => {
            return tick.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
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
        <VictoryScatter
          data={recentSleepLogs}
          x={(d) => d.upTime.toDate()}
          y="minsToFallAsleep"
          style={chartStyles.scatter}
          size={scale(5)}
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};

export const SleepMaintenance: React.FC<Props> = ({ navigation }) => {
  const { userData } = useUserDataStore((userState) => userState.userData);

  // Calculate recent night mins awake average & fetch baseline for comparison
  const nightMinsAwakeAvg = Number(
    (
      recentSleepLogs.reduce((a, b) => a + b.nightMinsAwake, 0) /
      recentSleepLogs.length
    ).toFixed(0),
  );
  const baselineSleepMaintenanceAvg = userData.baselineInfo.nightMinsAwakeAvg;

  function getLabel(nightMinsAvg: number) {
    if (nightMinsAvg > baselineSleepMaintenanceAvg + 5) {
      return `You're spending ${nightMinsAvg} minutes awake during the night on average, which is a bit worse than your previous baseline of ${baselineSleepMaintenanceAvg} minutes. Consider messaging our team for some one on one advice on avoiding this nightly wakefulness.`;
    } else if (nightMinsAvg > baselineSleepMaintenanceAvg - 2) {
      return `You're spending ${nightMinsAvg} minutes awake during the night on average, which is about the same as your previous baseline of ${baselineSleepMaintenanceAvg} minutes. The techniques we're introducing today may help you stay asleep better.`;
    } else {
      return `You're spending ${nightMinsAvg} minutes awake during the night on average, which is improved over your ${baselineSleepMaintenanceAvg} minutes before treatment. You're making progress!`;
    }
  }

  const highestValueForDomain = Math.max(
    ...recentSleepLogs.map(function (o) {
      return o.nightMinsAwake;
    }),
  );

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SleepDuration', {
          progressBarPercent: 0.21,
        });
      }}
      textLabel={getLabel(nightMinsAwakeAvg)}
      buttonLabel="Review sleep duration"
    >
      <VictoryChart
        width={chartStyles.chart.width}
        height={chartStyles.chart.height}
        theme={VictoryTheme.material}
        scale={{ x: 'time' }}
        domainPadding={chartStyles.chart.domainPadding}
        domain={{ y: [0, highestValueForDomain] }}
      >
        <VictoryAxis dependentAxis style={chartStyles.axis} tickCount={5} />
        <VictoryAxis
          style={chartStyles.axis}
          tickFormat={(tick) => {
            return tick.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
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
        <VictoryScatter
          data={recentSleepLogs}
          x={(d) => d.upTime.toDate()}
          y="nightMinsAwake"
          style={chartStyles.scatter}
          size={scale(5)}
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};

export const SleepDuration: React.FC<Props> = ({ navigation }) => {
  const { userData } = useUserDataStore((userState) => userState.userData);

  // Calculate recent night mins awake average & fetch baseline for comparison
  const sleepDurationAvg = Number(
    (
      recentSleepLogs.reduce((a, b) => a + b.sleepDuration, 0) /
      recentSleepLogs.length
    ).toFixed(0),
  );
  const baselineSleepDurationAvg = userData.baselineInfo.sleepDurationAvg;
  const sleepDurationAvgLabel = (sleepDurationAvg / 60).toFixed(1);
  const baselineSleepDurationAvgLabel = (baselineSleepDurationAvg / 60).toFixed(
    1,
  );

  function getLabel(sleepDurAvg: number) {
    if (sleepDurAvg < baselineSleepDurationAvg - 8) {
      return `You're spending ${sleepDurationAvgLabel} hours asleep during the night on average, which is a bit worse than your previous baseline of ${baselineSleepDurationAvgLabel} hours. This should improve as your sleep progresses.`;
    } else if (sleepDurAvg < baselineSleepDurationAvg + 5) {
      return `You're spending ${sleepDurationAvgLabel} hours asleep during the night on average, which is about the same as your previous baseline of ${baselineSleepDurationAvgLabel} hours. This should improve as your sleep progresses.`;
    } else {
      return `You're spending ${sleepDurationAvgLabel} hours asleep during the night on average, which is improved over your ${baselineSleepDurationAvgLabel} hours before starting with Dozy. You're making progress!`;
    }
  }

  const highestValueForDomain = Math.max(
    ...recentSleepLogs.map(function (o) {
      return o.sleepDuration;
    }),
  );

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TreatmentPlan', {
          progressBarPercent: 0.24,
        });
      }}
      textLabel={getLabel(sleepDurationAvg)}
      buttonLabel="This week's care plan"
    >
      <VictoryChart
        width={chartStyles.chart.width}
        height={chartStyles.chart.height}
        theme={VictoryTheme.material}
        scale={{ x: 'time' }}
        domainPadding={chartStyles.chart.domainPadding}
        domain={{ y: [0, highestValueForDomain] }}
      >
        <VictoryAxis dependentAxis style={chartStyles.axis} tickCount={5} />
        <VictoryAxis
          style={chartStyles.axis}
          tickFormat={(tick) => {
            return tick.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
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
        <VictoryScatter
          data={recentSleepLogs}
          x={(d) => d.upTime.toDate()}
          y="sleepDuration"
          style={chartStyles.scatter}
          size={scale(5)}
        />
      </VictoryChart>
    </WizardContentScreen>
  );
};
