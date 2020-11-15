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
import RaisedHands from '../assets/images/RaisedHands.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';

// TODO: Update percentage values

const theme: any = dozy_theme; // Define the theme for the file globally
// 'any' type for now since it's getting an expected something from Draftbit that's breaking.

// Define an interface for HYG flow state (SHI score & next checkin info)
let COG1State = {
  nextCheckinTime: new Date(),
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
  DBASScore: 0,
  DBASF1: 0,
  DBASF2: 0,
  DBASF3: 0,
  DBASF4: 0,
  highestAvgCategoryLabel: 'ERROR'
};

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
          progressBarPercent: 0.07
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
          progressBarPercent: 0.32
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
        navigation.navigate('DBAS2', { progressBarPercent: 0.36 });
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
        navigation.navigate('DBAS3', { progressBarPercent: 0.39 });
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
        navigation.navigate('DBAS4', { progressBarPercent: 0.43 });
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
        navigation.navigate('DBAS5', { progressBarPercent: 0.46 });
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
        navigation.navigate('DBAS6', { progressBarPercent: 0.5 });
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
        navigation.navigate('DBAS7', { progressBarPercent: 0.54 });
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
        navigation.navigate('DBAS8', { progressBarPercent: 0.57 });
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
        navigation.navigate('DBAS9', { progressBarPercent: 0.61 });
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
        navigation.navigate('DBAS10', { progressBarPercent: 0.64 });
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
        navigation.navigate('DBAS11', { progressBarPercent: 0.68 });
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
        navigation.navigate('DBAS12', { progressBarPercent: 0.71 });
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
        navigation.navigate('DBAS13', { progressBarPercent: 0.75 });
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
        navigation.navigate('DBAS14', { progressBarPercent: 0.79 });
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
        navigation.navigate('DBAS15', { progressBarPercent: 0.82 });
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
        navigation.navigate('DBAS16', { progressBarPercent: 0.86 });
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
        navigation.navigate('DBASResult', { progressBarPercent: 0.89 });
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
  // Add answers for the total DBAS score
  const {
    DBAS1,
    DBAS2,
    DBAS3,
    DBAS4,
    DBAS5,
    DBAS6,
    DBAS7,
    DBAS8,
    DBAS9,
    DBAS10,
    DBAS11,
    DBAS12,
    DBAS13,
    DBAS14,
    DBAS15,
    DBAS16
  } = COG1State;
  COG1State.DBASScore =
    DBAS1 +
    DBAS2 +
    DBAS3 +
    DBAS4 +
    DBAS5 +
    DBAS6 +
    DBAS7 +
    DBAS8 +
    DBAS9 +
    DBAS10 +
    DBAS11 +
    DBAS12 +
    DBAS13 +
    DBAS14 +
    DBAS15 +
    DBAS16;

  // Calculate category average scores as well
  COG1State.DBASF1 = (DBAS5 + DBAS7 + DBAS9 + DBAS12 + DBAS16) / 5;
  COG1State.DBASF2 = (DBAS3 + DBAS4 + DBAS8 + DBAS10 + DBAS11) / 5;
  COG1State.DBASF3 = (DBAS1 + DBAS2) / 2;
  COG1State.DBASF4 = (DBAS6 + DBAS13 + DBAS15) / 3;

  // Find the highest average scoring category, label it
  const categoryAvgScores: { [key: string]: number } = {
    DBASF1: COG1State.DBASF1,
    DBASF2: COG1State.DBASF2,
    DBASF3: COG1State.DBASF3,
    DBASF4: COG1State.DBASF4
  };
  const highestAvgCategory = Object.keys(categoryAvgScores).sort(
    (a, b) => categoryAvgScores[b] - categoryAvgScores[a]
  )[0];
  switch (highestAvgCategory) {
    case 'DBASF1':
      COG1State.highestAvgCategoryLabel = 'perceived consequences of insomnia';
      break;
    case 'DBASF2':
      COG1State.highestAvgCategoryLabel = 'worry about insomnia';
      break;
    case 'DBASF3':
      COG1State.highestAvgCategoryLabel = 'sleep expectations';
      break;
    case 'DBASF4':
      COG1State.highestAvgCategoryLabel = 'views on medication';
      break;
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('COG1Review', {
          progressBarPercent: 0.93
        });
      }}
      titleLabel={`Seems like your most difficult area is with ${COG1State.highestAvgCategoryLabel}.`}
      textLabel="The results say you've got some views on sleep that could be perpetuating your insomnia. By challenging these views, we can improve your thinking & improve your sleep. Send us a message after you've scheduled your next checkin and we'll work out a plan together."
      buttonLabel="OK"
      flexibleLayout
    >
      <BarChart width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const COG1Review: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res: string) => {
        if (res === 'Wait, I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'COG1'
          });
        } else {
          navigation.navigate('CheckinScheduling', {
            progressBarPercent: 0.96
          });
        }
      }}
      titleLabel="So, here's the plan this week:"
      textLabel={`Message us (in the Support tab) and we'll talk 1:1 re: ${COG1State.highestAvgCategoryLabel}. Stick to your target sleep schedule, and continue any other techniques you've learned. Can you recommit to following the treatment plan this week?`}
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
        navigation.navigate('COG1End', { progressBarPercent: 1 });
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

export const COG1End: React.FC<Props> = ({ navigation }) => {
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
          nextCheckinModule: GLOBAL.treatmentPlan.filter(
            (v: { started: boolean; module: string }) =>
              v.started === false && v.module !== 'COG1'
          )[0].module,
          lastCheckinModule: 'COG1',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed,
          additionalCheckinData: {
            DBAS1: COG1State.DBAS1,
            DBAS2: COG1State.DBAS2,
            DBAS3: COG1State.DBAS3,
            DBAS4: COG1State.DBAS4,
            DBAS5: COG1State.DBAS5,
            DBAS6: COG1State.DBAS6,
            DBAS7: COG1State.DBAS7,
            DBAS8: COG1State.DBAS8,
            DBAS9: COG1State.DBAS9,
            DBAS10: COG1State.DBAS10,
            DBAS11: COG1State.DBAS11,
            DBAS12: COG1State.DBAS12,
            DBAS13: COG1State.DBAS13,
            DBAS14: COG1State.DBAS14,
            DBAS15: COG1State.DBAS15,
            DBAS16: COG1State.DBAS16,
            DBASScore: COG1State.DBASScore,
            DBASF1: COG1State.DBASF1,
            DBASF2: COG1State.DBASF2,
            DBASF3: COG1State.DBASF3,
            DBASF4: COG1State.DBASF4
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
