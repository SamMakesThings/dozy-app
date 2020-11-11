import React from 'react';
import { useWindowDimensions, Text, StyleSheet, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
import { AuthContext } from '../utilities/authContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../assets/images/FemaleDoctor.svg';
import BarChart from '../assets/images/BarChart.svg';
import TanBook from '../assets/images/TanBook.svg';
import ThumbsUp from '../assets/images/ThumbsUp.svg';
import Clipboard from '../assets/images/Clipboard.svg';
import RaisedHands from '../assets/images/RaisedHands.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';

const theme: any = dozy_theme; // Define the theme for the file globally
// 'any' type for now since it's getting an expected something from Draftbit that's breaking.

// Define an interface for HYG flow state (SHI score & next checkin info)
let COG1State = {
  nextCheckinTime: new Date(),
  treatmentPlan: [{ started: false, module: 'deleteme', estDate: new Date() }],
  DBAS1: 0,
  DBAS2: 0,
  DBAS3: 0,
  DBAS4: 0,
  DBAS5: 0,
  DBAS6: 0,
  DBAS7: 0,
  DBAS8: 0,
  DBAS9: 0,
  DBAS10: 0,
  DBAS11: 0,
  DBAS12: 0,
  DBAS13: 0,
  DBAS14: 0,
  DBAS15: 0,
  DBAS16: 0,
  DBASScore: 0
};

COG1State.treatmentPlan = GLOBAL.treatmentPlan; // Update treatmentPlan variable with global one
const imgSizePercent = 0.4; // Define square image size defaults as a percent of width
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

interface Props {
  // Define Props type for all screens in this flow
  navigation: {
    navigate: Function;
    goBack: Function;
  };
}

export const Welcome: React.FC<Props> = ({ navigation }) => {
  imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<FemaleDoctor width={imgSize} height={imgSize * 1.2} />}
      onQuestionSubmit={() => {
        navigation.navigate('SRTTitrationStart', {
          progressBarPercent: 0.08
        });
      }}
      textLabel="Welcome back! This week we'll help address some anxieties and beliefs that make sleep harder. But first, let's review your sleep and how treatment's been going for you so far."
    />
  );
};

// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'

export const TreatmentPlan: React.FC<Props> = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('DBAS1', {
          progressBarPercent: 0.4
        });
      }}
      titleLabel="This week's treatment: Addressing Dysfunctional Beliefs & Attitudes about Sleep (DBAS)"
      textLabel="We're going to get an idea of how you currently think about sleep. To get started, we'll ask you 16 questions. Rate how much you personally agree or disagree with each statement."
      buttonLabel="Next"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const DBAS1: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS1 = value;
        navigation.navigate('DBAS2', { progressBarPercent: 0.56 });
      }}
      questionLabel="I need 8 hours of sleep to feel refreshed and function well during the day."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS2: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS2 = value;
        navigation.navigate('DBAS3', { progressBarPercent: 0.56 });
      }}
      questionLabel="When I don't get the proper amount of sleep on a given night, I need to catch up the next day by napping or the next night by sleeping longer."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS3: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS3 = value;
        navigation.navigate('DBAS4', { progressBarPercent: 0.56 });
      }}
      questionLabel="I am concerned that chronic insomnia may have serious consequences on my physical health."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS4: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS4 = value;
        navigation.navigate('DBAS5', { progressBarPercent: 0.56 });
      }}
      questionLabel="I am worried that I may lose control over my ability to sleep."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS5: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS5 = value;
        navigation.navigate('DBAS6', { progressBarPercent: 0.56 });
      }}
      questionLabel="After a poor night's sleep, I know it will interfere with my activities the next day."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS6: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS6 = value;
        navigation.navigate('DBAS7', { progressBarPercent: 0.56 });
      }}
      questionLabel="To be alert and function well during the day, I believe I would be better off taking a sleeping pill rather than having a poor night's sleep."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS7: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS7 = value;
        navigation.navigate('DBAS8', { progressBarPercent: 0.56 });
      }}
      questionLabel="When I feel irritable, depressed, or anxious during the day, it is mostly because I did not sleep well the night before."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS8: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS8 = value;
        navigation.navigate('DBAS9', { progressBarPercent: 0.56 });
      }}
      questionLabel="When I sleep poorly one night, I know it will disturb my sleep schedule for the whole week."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS9: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS9 = value;
        navigation.navigate('DBAS10', { progressBarPercent: 0.56 });
      }}
      questionLabel="Without an adequate night's sleep, I can hardly function the next day."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS10: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS10 = value;
        navigation.navigate('DBAS11', { progressBarPercent: 0.56 });
      }}
      questionLabel="I can't ever predict whether I'll have a good or poor night's sleep."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS11: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS11 = value;
        navigation.navigate('DBAS12', { progressBarPercent: 0.56 });
      }}
      questionLabel="I have little ability to manage the negative consequences of disturbed sleep."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS12: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS12 = value;
        navigation.navigate('DBAS13', { progressBarPercent: 0.56 });
      }}
      questionLabel="When I feel tired, have no energy, or just seem to not function well during the day, it is generally because I did not sleep well the night before."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS13: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS13 = value;
        navigation.navigate('DBAS14', { progressBarPercent: 0.56 });
      }}
      questionLabel="I believe insomnia is the result of a chemical imbalance."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS14: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS14 = value;
        navigation.navigate('DBAS15', { progressBarPercent: 0.56 });
      }}
      questionLabel="I feel insomnia is ruining my ability to enjoy life and prevents me from doing what I want."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS15: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS15 = value;
        navigation.navigate('DBAS16', { progressBarPercent: 0.56 });
      }}
      questionLabel="Medication is probably the only solution to sleeplessness."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBAS16: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value: number) => {
        COG1State.DBAS16 = value;
        navigation.navigate('DBASResult', { progressBarPercent: 0.56 });
      }}
      questionLabel="I avoid or cancel obligations (social, family) after a poor night's sleep."
      questionSubtitle="Please rate how much you personally agree with each statement."
      buttonValues={[
        { label: 'Strongly disagree', value: 0, solidColor: false },
        { label: 'Disagree', value: 2.5, solidColor: false },
        { label: 'Neutral', value: 5, solidColor: false },
        { label: 'Agree', value: 7.5, solidColor: false },
        { label: 'Strongly agree', value: 10, solidColor: false }
      ]}
    />
  );
};

export const DBASResult: React.FC<Props> = ({ navigation }) => {
  // If nothing is undefined (shouldn't be), add answers for the total SHI score
  const { DBAS1, DBAS2 } = COG1State;
  COG1State.DBASScore = DBAS1 + DBAS2;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('HYGReview', {
          progressBarPercent: 0.96
        });
      }}
      titleLabel={`You scored a ${COG1State.DBASScore} on the shortened Sleep Hygiene Index (out of 36).`}
      textLabel="There are some improvements to be made, but we can help. Send us a message after you've scheduled your next checkin and we'll work out a plan together."
      buttonLabel="OK"
      flexibleLayout
    >
      <BarChart width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const HYGReview: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res: string) => {
        if (res === 'Wait, I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'HYG'
          });
        } else {
          navigation.navigate('CheckinScheduling', {
            progressBarPercent: 0.985
          });
        }
      }}
      titleLabel="So, here's the plan this week:"
      textLabel="Message us (in the Support tab) and we'll give you 1:1 advice on improving your sleep hygiene. Stick to your target sleep schedule, and continue any other techniques you've learned. Can you recommit to following the treatment plan this week?"
      buttonLabel="Ok, I can do it this week"
      bottomGreyButtonLabel="Wait, I have questions"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const CheckinScheduling: React.FC<Props> = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={
        new Date(
          new Date().getTime() + 86400000 * 7
        ) /* Default date of 7 days from today */
      }
      onQuestionSubmit={(value: Date) => {
        COG1State.nextCheckinTime = value;
        navigation.navigate('HYGEnd', { progressBarPercent: 1 });
      }}
      validInputChecker={(val: Date) => {
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

export const HYGEnd: React.FC<Props> = ({ navigation }) => {
  const { state, dispatch } = React.useContext(AuthContext);

  // Create reminder object for next checkin
  let reminderObject = {
    expoPushToken: state.userData.reminders.expoPushToken,
    title: 'Next checkin is ready',
    body: 'Open the app now to get started',
    type: 'CHECKIN_REMINDER',
    time: COG1State.nextCheckinTime,
    enabled: true
  };

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        submitCheckinData({
          userId: state.userToken,
          checkinPostponed: false,
          nextCheckinDatetime: COG1State.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: COG1State.treatmentPlan.filter(
            (v: { started: boolean; module: string }) =>
              v.started === false && v.module !== 'HYG'
          )[0].module,
          lastCheckinModule: 'HYG',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed,
          additionalCheckinData: {
            DBAS1: COG1State.DBAS1,
            DBAS2: COG1State.DBAS2,
            SHIScore: COG1State.DBASScore
          },
          reminderObject: reminderObject
        });
        navigation.navigate('App');
        refreshUserData(dispatch);
      }}
      textLabel="Well done! You've taken one more step towards sleeping through the night."
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
