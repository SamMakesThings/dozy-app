import React from 'react';
import { useWindowDimensions, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../context/AuthContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../assets/images/FemaleDoctor.svg';
import RaisedHands from '../assets/images/RaisedHands.svg';
import MonocleEmoji from '../assets/images/MonocleEmoji.svg';
import TanBook from '../assets/images/TanBook.svg';
import AlarmClock from '../assets/images/AlarmClock.svg';
import Rule3Illustration from '../assets/images/Rule3Illustration.svg';
import ManInBed from '../assets/images/ManInBed.svg';
import DizzyFace from '../assets/images/DizzyFace.svg';
import TiredFace from '../assets/images/TiredFace.svg';
import BarChart from '../assets/images/BarChart.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';
import { Navigation } from '../types/custom';
import Feedback from '../utilities/feedback.service';

// Define the theme for the file globally
const theme = dozy_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

// Set up state for this check-in
const ENDState = {
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
  ISITotal: 0,
};

interface Props {
  navigation: Navigation;
  route: { params: { nextScreen: string; warnAbout: string } };
}

// Helper function to get an ISI severity string from an int score
function getISISeverity(score: number): string {
  if (score >= 22) {
    return 'clinically severe insomnia';
  } else if (score >= 15) {
    return 'clinically moderate insomnia';
  } else if (score >= 8) {
    return 'clinically mild insomnia';
  } else {
    return 'no clinically significant insomnia';
  }
}

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
          progressBarPercent: 0.08,
        });
      }}
      textLabel="Welcome back! Today we'll review your target schedule, then ask a few questions to check how your sleep is doing. Finally, we'll talk about how you can maintain your improved sleep, and what to do if insomnia appears again later."
    />
  );
};

//
// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'
//

export const TreatmentPlan: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ISI1', {
          progressBarPercent: 0.3,
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
        navigation.navigate('ISI2', { progressBarPercent: 0.33 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true },
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
        navigation.navigate('ISI3', { progressBarPercent: 0.37 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true },
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
        navigation.navigate('ISI4', { progressBarPercent: 0.4 });
      }}
      buttonValues={[
        { label: 'Not a problem', value: 0, solidColor: true },
        { label: 'I rarely wake up too early', value: 1, solidColor: true },
        { label: 'I sometimes wake up too early', value: 2, solidColor: true },
        {
          label: 'I often wake up too early',
          value: 3,
          solidColor: true,
        },
        { label: 'I always wake up too early', value: 4, solidColor: true },
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
        navigation.navigate('ISI5', { progressBarPercent: 0.43 });
      }}
      buttonValues={[
        { label: 'Very satisfied', value: 0, solidColor: true },
        { label: 'Satisfied', value: 1, solidColor: true },
        {
          label: 'Could be better, could be worse',
          value: 2,
          solidColor: true,
        },
        { label: 'Dissatisfied', value: 3, solidColor: true },
        { label: 'Very dissatisfied', value: 4, solidColor: true },
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
        navigation.navigate('ISI6', { progressBarPercent: 0.47 });
      }}
      buttonValues={[
        { label: 'Not at all noticeable', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much noticeable', value: 4, solidColor: true },
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
        navigation.navigate('ISI7', { progressBarPercent: 0.5 });
      }}
      buttonValues={[
        { label: 'Not at all worried', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much worried', value: 4, solidColor: true },
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
        ENDState.ISI7 = value;
        ENDState.ISITotal =
          ENDState.ISI1 +
          ENDState.ISI2 +
          ENDState.ISI3 +
          ENDState.ISI4 +
          ENDState.ISI5 +
          ENDState.ISI6 +
          value;
        navigation.navigate('ISIProcessing', { progressBarPercent: 0.53 });
      }}
      buttonValues={[
        { label: 'Not at all interfering', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much interfering', value: 4, solidColor: true },
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
          progressBarPercent: 0.57,
        });
      }}
      textLabel="Done! Let's look at your results."
      buttonLabel="Next"
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

// TODO: Handle (unlikely but possible) worse sleep numbers with different flow

export const ISIResults = ({ navigation }: Props) => {
  const { state } = React.useContext(AuthContext);

  // Get % improvement in ISI score, format it nicely
  const prevISITotal = state.userData.baselineInfo.isiTotal;
  const currentISITotal = ENDState.ISITotal;
  const rawISIPercentImprovement = (prevISITotal - currentISITotal) / 28;
  const ISIPercentImprovement =
    parseFloat(rawISIPercentImprovement.toFixed(2)) * 100;

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<BarChart width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate(
          // If sleep improved by an ISI cagegory, such as moderate to no insomnia, show additional screen
          currentISITotal < prevISITotal &&
            getISISeverity(currentISITotal) != getISISeverity(prevISITotal)
            ? 'ISICategoryChange'
            : 'ISIEnd',
          /*ENDState.ISITotal > 7 ? 'ISISignificant' : 'ISINoSignificant', */
          {
            progressBarPercent: 0.6,
          },
        );
      }}
      textLabel={
        <Text>
          According to the Insomnia Severity Index, you’ve got
          {ENDState.ISITotal >= 7 ? '\n' : ' '}
          <Text style={styles.BoldLabelText}>
            {getISISeverity(ENDState.ISITotal) + ' '}
          </Text>
          with a total of {ENDState.ISITotal} points. That's{' '}
          {ISIPercentImprovement}% improvement over your previous score!
        </Text>
      }
      buttonLabel="Continue"
    />
  );
};

export const ISICategoryChange = ({ navigation }: Props) => {
  const { state } = React.useContext(AuthContext);

  const prevISITotal = state.userData.baselineInfo.isiTotal;
  const currentISITotal = ENDState.ISITotal;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ISIEnd', {
          progressBarPercent: 0.63,
        });
      }}
      textLabel={`Not only that, but you've moved from ${getISISeverity(
        prevISITotal,
      )} to ${getISISeverity(currentISITotal)}. Amazing!`}
      buttonLabel="Next"
    >
      <DizzyFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const ISIEnd = ({ navigation }: Props) => (
  <WizardContentScreen
    theme={theme}
    bottomBackButton={() => navigation.goBack()}
    onQuestionSubmit={() => {
      navigation.navigate('EducationStart', {
        progressBarPercent: 0.67,
      });
    }}
    textLabel={`Now let's talk about how to maintain your improved sleep patterns.`}
    buttonLabel="Next"
  >
    <FemaleDoctor width={imgSize} height={imgSize} />
  </WizardContentScreen>
);

export const EducationStart: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('RulesPhaseOut', {
          progressBarPercent: 0.7,
        });
      }}
      titleLabel="What's next?"
      textLabel={
        "Many of the techniques you learned from Dozy can be treated like a buffet - you keep what works for you, and drop what doesn't. That said, there are a few techniques likely to stay useful."
      }
      flexibleLayout
    >
      <MonocleEmoji width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const RulesPhaseOut: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('WhatToKeepOverview', {
          progressBarPercent: 0.73,
        });
      }}
      textLabel={`For example, if you no longer need it, you might stop using Progressive Muscle Relaxation. Or, if your sleep is rock-solid, you can pick up reading in bed again - still no phones though.`}
      buttonLabel="What should I keep?"
      flexibleLayout
    >
      <TanBook width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const WhatToKeepOverview: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('ConsistentSchedule', {
          progressBarPercent: 0.77,
        });
      }}
      textLabel={
        'However, there are three things you should keep doing: Maintaining a consistent schedule, continuing to reserve the bedroom for sleeping, and not compensating for a bad night.'
      }
      buttonLabel="Consistent schedule?"
    >
      <ManInBed width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const ConsistentSchedule: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('MaintainSCT', {
          progressBarPercent: 0.8,
        });
      }}
      titleLabel="First off"
      textLabel={
        "...still maintain a consistent sleep & wake time. Of course, it doesn't need to be super strict - it took more than one night to fix your sleep, it'll take more than one to break it - but for the majority of your nights, you should maintain the same schedule, including on weekends if possible."
      }
      buttonLabel="Bedroom for sleep"
      flexibleLayout
    >
      <AlarmClock width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const MaintainSCT: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('DoNotCompensate', {
          progressBarPercent: 0.83,
        });
      }}
      titleLabel="Second:"
      textLabel={
        'You should continue to only use the bed and bedroom for sleep (or sex). TVs, phones, and other electronics (including podcasts) can cause problems with your sleep over time. To preserve your sleep quality, keep those things outside the bedroom, and preferably not too close to bedtime.'
      }
      buttonLabel="Don't compensate"
      flexibleLayout
    >
      <Rule3Illustration width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const DoNotCompensate: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('IfStopSleeping', {
          progressBarPercent: 0.87,
        });
      }}
      titleLabel="Third:"
      textLabel={
        "Avoid compensating for a bad night's sleep. That means when you sleep poorly, it's important to not spend more time in bed than normal (going to bed early, long naps, etc.). This kind of compensation can sometimes trigger a bout of short-term insomnia."
      }
      buttonLabel="Got it"
      flexibleLayout
    >
      <TiredFace width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const IfStopSleeping: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('IfSCTNotWork', {
          progressBarPercent: 0.9,
        });
      }}
      textLabel={
        "Finally, let's talk about what to do if you stop sleeping again. The first step you should take is to bring back the SCT rules - that is, to not be in bed when you're not sleeping. Once more do nothing in bed besides sleep, and get out of bed if unable to sleep (return later when sleepy again)."
      }
      buttonLabel="But what if that doesn't work?"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const IfSCTNotWork: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SummarizeLearnings', {
          progressBarPercent: 0.93,
        });
      }}
      titleLabel="But what if I do that for a week and it doesn't work?"
      textLabel={
        "In that case, it's a good idea to return to a restricted sleep schedule. You can do this through the Dozy program again, or you can see a human specialist."
      }
      buttonLabel="Makes sense"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SummarizeLearnings: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('AccessAndFAQ', {
          progressBarPercent: 0.97,
        });
      }}
      titleLabel="To summarize:"
      textLabel={
        "Keep using what's useful, drop what's not. Remember to maintain a consistent schedule, use the bedroom only for sleep, and to avoid long naps or oversleeping in response to sleep deprivation."
      }
      buttonLabel="Got it"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const AccessAndFAQ: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res: string) => {
        if (res === 'I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'END',
          });
        } else {
          navigation.navigate('ENDEnd', {
            progressBarPercent: 0.99,
          });
        }
      }}
      textLabel={
        "We'll keep all of this information on your home page for easy access later. Have any questions in the meantime?"
      }
      buttonLabel="Nope, I'm good"
      bottomGreyButtonLabel="I have questions"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const ENDEnd: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  const { state, dispatch } = React.useContext(AuthContext);
  const { setShowingFeedbackPopup } = Feedback.useFeedback();

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
          checkinPostponed: false,
          nextCheckinDatetime: ENDState.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: GLOBAL.treatmentPlan.filter(
            // TODO: Make sure this doesn't crash if all modules are completed
            (v) => v.started === false && v.module !== 'END',
          )[0].module,
          lastCheckinModule: 'END',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed,
          additionalCheckinData: {
            ISI1: ENDState.ISI1,
            ISI2: ENDState.ISI2,
            ISI3: ENDState.ISI3,
            ISI4: ENDState.ISI4,
            ISI5: ENDState.ISI5,
            ISI6: ENDState.ISI6,
            ISI7: ENDState.ISI7,
            ISITotal: ENDState.ISITotal,
          },
        });
        navigation.navigate('App');
        refreshUserData(dispatch);
        setShowingFeedbackPopup(true);
      }}
      textLabel={`You're done! Press "finish" to mark this check-in as completed.`}
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
});
