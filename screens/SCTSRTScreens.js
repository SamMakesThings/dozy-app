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
        navigation.navigate('SleepEfficiency', {
          progressBarPercent: null
        });
      }}
      textLabel="Welcome back! This’ll take 10-15 minutes. We’ll review your sleep over the last week, update your treatment plan, and get you started on your new treatment."
    />
  );
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
          progressBarPercent: null
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
          progressBarPercent: null
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
          progressBarPercent: null
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

export const TreatmentPlan = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('TreatmentPlanContinued', {
          progressBarPercent: null
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

export const TreatmentPlanContinued = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('DriversOfSleep', {
          progressBarPercent: null
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

export const DriversOfSleep = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('WhySleepDrives', {
          progressBarPercent: 0.14
        });
      }}
      titleLabel="The two main drivers of human sleep"
      textLabel={
        <Text>
          Are <Text style={styles.BoldLabelText}>circadian sleep drive</Text>{' '}
          and <Text style={styles.BoldLabelText}>homeostatic sleep drive.</Text>{' '}
          Homeostatic sleep drive means the longer you&apos;ve been awake, the
          sleepier you become. Circadian sleep drive is your body&apos;s
          internal clock - it controls your energy with the day/night cycle.
        </Text>
      }
      flexibleLayout
      buttonLabel="Why does this matter?"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const WhySleepDrives = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('FragmentedSleep', {
          progressBarPercent: 0.14
        });
      }}
      textLabel={
        'By making both your circadian and homeostatic sleep drives stronger, we help you fall asleep faster and stay asleep longer.'
      }
      buttonLabel="Great!"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const FragmentedSleep = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ConsolidatingSleep', {
          progressBarPercent: 0.14
        });
      }}
      titleLabel="Right now, your sleep is pretty fragmented."
      textLabel="That is to say, most of the time you spend in bed isn't spent sleeping - the actual sleep time is scattered in chunks in the night. Our first step in treatment is to fix that."
      flexibleLayout
      buttonLabel="How do I fix it?"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const ConsolidatingSleep = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ReduceTimeInBed', {
          progressBarPercent: 0.14
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

export const ReduceTimeInBed = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SCTSRTIntro', {
          progressBarPercent: 0.14
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

export const SCTSRTIntro = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Rule1', {
          progressBarPercent: 0.14
        });
      }}
      titleLabel="This is where SCT and SRT come in."
      textLabel="By following 3 simple rules, we can break the vicious cycle, boost your homeostatic sleep drive, and start improving your sleep."
      buttonLabel="What's the first rule?"
    >
      <Clipboard width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const Rule1 = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Rule2', {
          progressBarPercent: 0.14
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

export const Rule2 = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('Rule3', {
          progressBarPercent: 0.14
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

export const Rule3 = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('RulesRecap', {
          progressBarPercent: 0.14
        });
      }}
      titleLabel="3rd, don't do anything in bed besides sleeping."
      textLabel="That means no reading, no phone use, no TV, and no daytime naps. "
    >
      <Rule3Illustration width={imgSize * 1.2} height={imgSize} />
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
          progressBarPercent: 0.14
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
          progressBarPercent: 0.14
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
            progressBarPercent: 0.14
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
          progressBarPercent: 0.14
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
          progressBarPercent: 0.6
        });
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
          progressBarPercent: null
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
  const targetBedTimeDisplayString = targetBedTime.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric'
  });
  GLOBAL.targetBedTimeDisplayString = targetBedTimeDisplayString;
  const targetWakeTimeDisplayString = GLOBAL.SCTSRTWakeTime.toLocaleString(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric'
    }
  );
  GLOBAL.targetWakeTimeDisplayString = targetWakeTimeDisplayString;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('PrescriptionSummary', {
          progressBarPercent: 0.14
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
          progressBarPercent: 0.14
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
            progressBarPercent: 0.14
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
            module: 'SCTSRT'
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
        navigation.navigate('SCTSRTEnd', { progressBarPercent: 0.8 });
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
        submitCheckinData({
          userId: state.userToken,
          checkinPostponed: GLOBAL.checkinPostponed,
          nextCheckinDatetime: GLOBAL.nextCheckinDatetime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule:
            state.userData.currentTreatments.nextTreatmentModule,
          lastCheckinModule: 'SCTSRT',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed
        });
        console.log('Data submitted to Firebase!');
        refreshUserData(dispatch);
        // finishOnboarding();
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
