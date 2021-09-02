/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis,
  VictoryScatter
} from 'victory-native';
import moment from 'moment';
import { AuthContext } from '../context/AuthContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
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
import { formatDateAsTime } from '../utilities/formatDateAsTime';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';
import { Navigation, SleepLog } from '../types/custom';

interface Props {
  navigation: Navigation;
}

// Create a global state object for the file
const SCTSRTState = {
  SCTSRTWakeTime: new Date(),
  SCTSRTTimeInBedTarget: 480,
  SCTSRTBedTime: new Date(),
  targetBedTimeDisplayString: 'ERROR',
  targetWakeTimeDisplayString: 'ERROR',
  checkinPostponed: false,
  nextCheckinTime: new Date()
};

// Define the theme for the file globally, along with sleepLogs array
const theme = dozy_theme;
let recentSleepLogs: Array<SleepLog> = [];

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

// Define default chart styles
const chartStyles = {
  chart: {
    width: scale(300),
    height: scale(300),
    domainPadding: { x: 3, y: 35 }
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
  },
  scatter: {
    data: {
      fill: theme.colors.primary
    }
  }
};

export const Welcome = ({ navigation }: Props) => {
  imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<FemaleDoctor width={imgSize} height={imgSize * 1.2} />}
      onQuestionSubmit={() => {
        navigation.navigate('SleepEfficiency', {
          progressBarPercent: 0.03
        });
      }}
      textLabel="Welcome back! This’ll take 10-15 minutes. We’ll review your sleep over the last week, update your care plan, and get you started on your new technique."
    />
  );
};

export const SleepEfficiency = ({ navigation }: Props) => {
  const { state } = React.useContext(AuthContext);

  // Trim sleepLogs to only show most recent 10
  recentSleepLogs = state.sleepLogs.slice(0, 10);

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

export const SleepOnset = ({ navigation }: Props) => {
  const { state } = React.useContext(AuthContext);

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

export const SleepMaintenance = ({ navigation }: Props) => {
  const { state } = React.useContext(AuthContext);

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
      buttonLabel="This week's plan"
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

export const TreatmentPlan = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TreatmentPlanContinued', {
          progressBarPercent: 0.18
        });
      }}
      textLabel={
        "Let's get started with Stimulus Control Therapy (SCT) and Sleep Restriction Therapy (SRT). We'll calculate your current sleep duration, use that to determine the amount of time you should spend in bed, then work with you to set a new sleep schedule designed to fix your insomnia."
      }
      buttonLabel="Next"
      flexibleLayout
    >
      <SCTSRTTreatmentPlan width={imgSize * 2} height={imgSize} />
    </WizardContentScreen>
  );
};

export const TreatmentPlanContinued = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('DriversOfSleep', {
          progressBarPercent: 0.22
        });
      }}
      textLabel={
        "By sacrificing some short-term comfort, these two techniques will help you fall asleep quickly and stay asleep. To start, we'll talk about how sleep works, why these techniques help, and how to use them."
      }
      buttonLabel="Next"
    >
      <SCTSRTTreatmentPlan width={imgSize * 2} height={imgSize} />
    </WizardContentScreen>
  );
};

export const DriversOfSleep = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('WhySleepDrives', {
          progressBarPercent: 0.25
        });
      }}
      titleLabel="The two main drivers of human sleep"
      textLabel={
        <Text>
          Are <Text style={styles.BoldLabelText}>circadian rhythm</Text> and{' '}
          <Text style={styles.BoldLabelText}>sleep debt.</Text> Sleep debt means
          the longer you&apos;ve been awake, the sleepier you become. Circadian
          rhythm is your body&apos;s internal clock - it controls your energy
          with the day/night cycle.
        </Text>
      }
      flexibleLayout
      buttonLabel="Why does this matter?"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const WhySleepDrives = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('FragmentedSleep', {
          progressBarPercent: 0.29
        });
      }}
      textLabel={
        'By making both your circadian rhythm and sleep debt systems stronger, we help you fall asleep faster and stay asleep longer.'
      }
      buttonLabel="Great!"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

// TODO: ONLY SAY THIS IF THEIR SLEEP IS FUCKING FRAGMENTED (e.g. Snehan is an exception)
export const FragmentedSleep = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ConsolidatingSleep', {
          progressBarPercent: 0.33
        });
      }}
      titleLabel="Right now, your sleep is pretty fragmented."
      textLabel="That is to say, most of the time you spend in bed isn't spent sleeping - the actual sleep time is scattered in chunks in the night. Our first step in improvement is to fix that."
      flexibleLayout
      buttonLabel="How do I fix it?"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const ConsolidatingSleep = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ReduceTimeInBed', {
          progressBarPercent: 0.37
        });
      }}
      titleLabel="We fix it by consolidating your sleep into one chunk."
      textLabel="This raises your sleep efficiency back over 85%, where it should be. Once your sleep is mostly in one efficient chunk again, we carefully increase your time in bed until you can sleep the whole night through."
      flexibleLayout
      buttonLabel="How does one consolidate sleep?"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const ReduceTimeInBed = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SCTSRTIntro', {
          progressBarPercent: 0.4
        });
      }}
      titleLabel="Consolidate sleep by reducing time spent in bed."
      textLabel="Weirdly, staying in bed can be bad for sleep! By extending time in bed, there’s less pressure to sleep the next night. To compensate, you stay in bed longer, which further reduces ability to sleep. It’s a vicious cycle!"
      flexibleLayout
      buttonLabel="What do I need to do?"
    >
      <BadCycleIllustration width={imgSize * 1.5} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SCTSRTIntro = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Rule1', {
          progressBarPercent: 0.44
        });
      }}
      titleLabel="This is where SCT and SRT come in."
      textLabel="By following 3 simple rules, we can break the vicious cycle, boost your body's natural rhythms, and start improving your sleep."
      buttonLabel="What's the first rule?"
    >
      <Clipboard width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const Rule1 = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Rule2', {
          progressBarPercent: 0.48
        });
      }}
      titleLabel="1st, maintain the sleep restricted schedule."
      textLabel="That means going to bed and getting out of bed at specific times we'll pick with you."
      buttonLabel="What's the second rule?"
    >
      <AlarmClock width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const Rule2 = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Rule3', {
          progressBarPercent: 0.51
        });
      }}
      titleLabel="2nd, if you're unable to sleep for 15+ minutes, get out of bed..."
      textLabel="...and go do some other relaxing activity. Return to bed when you're sleepy again."
      buttonLabel="What's the third rule?"
    >
      <Rule2Illustration width={imgSize * 1.5} height={imgSize} />
    </WizardContentScreen>
  );
};

export const Rule3 = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('RulesRecap', {
          progressBarPercent: 0.55
        });
      }}
      titleLabel="3rd, don't do anything in bed besides sleeping."
      textLabel="That means no reading, no phone use, no TV, and no daytime naps. (Sex is an exception)"
    >
      <Rule3Illustration width={imgSize * 1.2} height={imgSize} />
    </WizardContentScreen>
  );
};

export const RulesRecap = ({ navigation }: Props) => {
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

export const WhatToExpect = ({ navigation }: Props) => {
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

export const UnderstandingAsk = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res: string) => {
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

export const SRTCalibrationIntro = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('WakeTimeSetting', {
          progressBarPercent: 0.7
        });
      }}
      titleLabel="Plan calibration"
      textLabel="Ok - now we'll customize the care plan for you. Let’s set your bedtime and out-of-bed time targets."
      buttonLabel="Makes sense"
    >
      <YellowRuler width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const WakeTimeSetting = ({ navigation }: Props) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={moment().hour(9).minute(0).toDate()}
      onQuestionSubmit={(value: Date) => {
        SCTSRTState.SCTSRTWakeTime = value;
        navigation.navigate('SleepDurationCalculation', {
          progressBarPercent: 0.74
        });
      }}
      validInputChecker={(val: Date) => {
        // Make sure the selected time is before 17:00, otherwise it's a likely sign of AM/PM mixup
        return moment(val).hour() < 17
          ? true
          : {
              severity: 'WARNING',
              errorMsg:
                'Did you set AM/PM correctly? Selected time is late for a wake time.'
            };
      }}
      questionLabel="What time do you want to get up every morning this week?"
      questionSubtitle="Pick a consistent time and try to stick to it - our app won't be as effective if you change your hours on the weekend."
      mode="time"
    />
  );
};

export const SleepDurationCalculation = ({ navigation }: Props) => {
  const { state } = React.useContext(AuthContext);

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
  SCTSRTState.SCTSRTTimeInBedTarget = timeInBedTarget;

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

export const TargetBedtime = ({ navigation }: Props) => {
  // Calculate target bedtime based on TIB and wake time
  const targetBedTime = moment(SCTSRTState.SCTSRTWakeTime)
    .subtract(SCTSRTState.SCTSRTTimeInBedTarget, 'minutes')
    .toDate();
  SCTSRTState.SCTSRTBedTime = targetBedTime;
  const targetBedTimeDisplayString = formatDateAsTime(targetBedTime);
  SCTSRTState.targetBedTimeDisplayString = targetBedTimeDisplayString;
  const targetWakeTimeDisplayString = formatDateAsTime(
    SCTSRTState.SCTSRTWakeTime
  );
  SCTSRTState.targetWakeTimeDisplayString = targetWakeTimeDisplayString;

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

export const PrescriptionSummary = ({ navigation }: Props) => {
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
        SCTSRTState.targetBedTimeDisplayString +
        ' and get out of bed at ' +
        SCTSRTState.targetWakeTimeDisplayString +
        ", regardless of how sleepy you feel. Within that window, you're to get out of bed if unable to sleep. Next week, once your sleep efficiency has jumped, we'll increase your time in bed by 15 minutes."
      }
      buttonLabel="Next"
      flexibleLayout
    >
      <View style={{ maxHeight: scale(150) }}>
        <TargetSleepScheduleCard
          bedTime={SCTSRTState.targetBedTimeDisplayString}
          wakeTime={SCTSRTState.targetWakeTimeDisplayString}
          styles={{ minWidth: scale(300) }}
          remainingDays={7}
        />
      </View>
    </WizardContentScreen>
  );
};

export const DeprivationWarning = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(val: string) => {
        if (val !== 'Wait, I have some concerns') {
          navigation.navigate('CheckinScheduling', {
            progressBarPercent: 0.88
          });
        } else {
          navigation.navigate('AddressingConcerns');
        }
      }}
      textLabel="Note that this technique will cause a temporary reduction in sleep before it starts kicking in. You’ll get less sleep than you normally would for 1-3 weeks, in exchange for permanent improvement. Are you ready to commit to following these rules this week?"
      buttonLabel="Yes! I will do it this week"
      bottomGreyButtonLabel="Wait, I have some concerns"
      flexibleLayout
    >
      <RaisedEyebrowFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const AddressingConcerns = ({ navigation }: Props) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(val: string) => {
        if (val !== 'Postpone, not a good time') {
          SCTSRTState.checkinPostponed = false;
          navigation.navigate('TreatmentReview', {
            module: 'SCTSRT',
            progressBarPercent: 0.95
          });
        } else {
          SCTSRTState.checkinPostponed = true;
          navigation.navigate('CheckinScheduling');
        }
      }}
      titleLabel="What's up?"
      textLabel="We can answer any questions you may have, or if this week isn’t ideal (e.g. important test, presentation, etc), then we can postpone starting to next week."
      buttonLabel="I have questions"
      bottomGreyButtonLabel="Postpone, not a good time"
      bottomBackButtonLabel="I'm good, let's get started"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const CheckinScheduling = ({ navigation }: Props) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={new Date(new Date().getTime() + 86400000 * 7)}
      onQuestionSubmit={(value: Date) => {
        SCTSRTState.nextCheckinTime = value;
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
      questionSubtitle="Check-ins take 5-10 minutes and adjust care based on your sleep patterns. A new technique is usually introduced weekly."
      buttonLabel="I've picked a date 7+ days from today"
      mode="datetime"
    />
  );
};

export const SCTSRTEnd = ({ navigation }: Props) => {
  const { state, dispatch } = React.useContext(AuthContext);

  // Calculate some baseline statistics for later reference
  const sleepLogs: Array<SleepLog> = state.sleepLogs;

  // Calculate baseline sleep efficiency average
  const sleepEfficiencyAvg = Number(
    (
      (sleepLogs.reduce((a, b) => a + b.sleepEfficiency, 0) /
        sleepLogs.length) *
      100
    ).toFixed(0)
  );

  // Calculate baseline sleep onset average
  const sleepOnsetAvg = Number(
    (
      sleepLogs.reduce((a, b) => a + b.minsToFallAsleep, 0) / sleepLogs.length
    ).toFixed(0)
  );

  // Calculate baseline night mins awake average
  const nightMinsAwakeAvg = Number(
    (
      sleepLogs.reduce((a, b) => a + b.nightMinsAwake, 0) / sleepLogs.length
    ).toFixed(0)
  );

  // Calculate baseline sleep duration average
  const sleepDurationAvg = Number(
    (
      sleepLogs.reduce((a, b) => a + b.sleepDuration, 0) / sleepLogs.length
    ).toFixed(0)
  );

  // Create reminder object for next checkin
  const reminderObject = {
    expoPushToken: state.userData.reminders.expoPushToken,
    title: 'Next checkin is ready',
    body: 'Open the app now to get started',
    type: 'CHECKIN_REMINDER',
    time: SCTSRTState.nextCheckinTime,
    enabled: true
  };

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<RaisedHands width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        if (!state.userId) throw new Error();
        submitCheckinData({
          userId: state.userId,
          checkinPostponed: SCTSRTState.checkinPostponed,
          nextCheckinDatetime: SCTSRTState.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: GLOBAL.treatmentPlan.filter(
            (v) => v.started === false && v.module !== 'SCTSRT'
          )[0].module,
          lastCheckinModule: 'SCTSRT',
          targetBedTime: SCTSRTState.SCTSRTBedTime,
          targetWakeTime: SCTSRTState.SCTSRTWakeTime,
          targetTimeInBed: SCTSRTState.SCTSRTTimeInBedTarget,
          sleepEfficiencyAvgBaseline: sleepEfficiencyAvg,
          sleepOnsetAvgBaseline: sleepOnsetAvg,
          nightMinsAwakeAvgBaseline: nightMinsAwakeAvg,
          sleepDurationAvgBaseline: sleepDurationAvg,
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
