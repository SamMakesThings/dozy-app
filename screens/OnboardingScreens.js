/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions, Text, StyleSheet } from 'react-native';
import IconExplainScreen from '../components/IconExplainScreen';
import NumInputScreen from '../components/NumInputScreen';
import MultiButtonScreen from '../components/MultiButtonScreen';
import TagSelectScreen from '../components/TagSelectScreen';
import DateTimePickerScreen from '../components/DateTimePickerScreen';
import submitSleepDiaryData from '../utilities/submitSleepDiaryData';
import GLOBAL from '../utilities/global';
import { slumber_theme } from '../config/Themes';
import WaveHello from '../assets/images/WaveHello.svg';
import LabCoat from '../assets/images/LabCoat.svg';
import Clipboard from '../assets/images/Clipboard.svg';
import TiredFace from '../assets/images/TiredFace.svg';

// Define the theme for the file globally
const theme = slumber_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;

export const Welcome = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      bbbDisabled
      image={<WaveHello width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('Overview', {
          progressBarPercent: null
        });
      }}
      textLabel="Welcome to Slumber! We'll get you sleeping better in no time."
      buttonLabel="Next"
    />
  );
};

export const Overview = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<LabCoat width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('Asks', {
          progressBarPercent: null
        });
      }}
      textLabel="We use a proven therapy treatment to get you sleeping again. It's drug-free, takes from 4-8 weeks, and is permanent."
      buttonLabel="Next"
    />
  );
};

export const Asks = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Clipboard width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('ISIIntro', {
          progressBarPercent: null
        });
      }}
      textLabel="For this to work, we'll help you maintain a once-daily sleep log and a checkup once per week."
      buttonLabel="Next"
    />
  );
};

export const ISIIntro = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('ISI1', {
          progressBarPercent: 0.14
        });
      }}
      textLabel="To get started, we'll ask you 7 questions to determine the size of your insomnia problem."
      buttonLabel="Next"
    />
  );
};

export const ISI1 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI1 = value;
        navigation.navigate('ISI2', { progressBarPercent: 0.28 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true }
      ]}
      questionLabel="How much difficulty do you have falling asleep?"
    />
  );
};

export const ISI2 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI2 = value;
        navigation.navigate('ISI3', { progressBarPercent: 0.42 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true }
      ]}
      questionLabel="How much difficulty do you have *staying* asleep?"
    />
  );
};

export const ISI3 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI3 = value;
        navigation.navigate('ISI4', { progressBarPercent: 0.56 });
      }}
      buttonValues={[
        { label: 'Not a problem', value: 0, solidColor: true },
        { label: 'I sometimes wake up too early', value: 1, solidColor: true },
        { label: 'I often wake up too early', value: 2, solidColor: true },
        {
          label: 'I almost always wake up too early',
          value: 3,
          solidColor: true
        },
        { label: 'I always wake up too early', value: 4, solidColor: true }
      ]}
      questionLabel="How much of a problem do you have with waking up too early?"
    />
  );
};

export const ISI4 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI4 = value;
        navigation.navigate('ISI5', { progressBarPercent: 0.7 });
      }}
      buttonValues={[
        { label: 'Very satisfied', value: 0, solidColor: true },
        { label: 'Satisfied', value: 1, solidColor: true },
        { label: 'Moderately satisfied', value: 2, solidColor: true },
        { label: 'Dissatisfied', value: 3, solidColor: true },
        { label: 'Very dissatisfied', value: 4, solidColor: true }
      ]}
      questionLabel="How satisfied/dissatisfied are you with your current sleep pattern?"
    />
  );
};

export const ISI5 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI5 = value;
        navigation.navigate('ISI6', { progressBarPercent: 0.84 });
      }}
      buttonValues={[
        { label: 'Not at all noticeable', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much noticeable', value: 4, solidColor: true }
      ]}
      questionLabel="How noticeable to others do you think your sleep problem is? (in terms of impairing the quality of your life)"
    />
  );
};

export const ISI6 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI6 = value;
        navigation.navigate('ISI7', { progressBarPercent: 0.95 });
      }}
      buttonValues={[
        { label: 'Not at all worried', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much worried', value: 4, solidColor: true }
      ]}
      questionLabel="How worried are you about your current sleep pattern?"
    />
  );
};

export const ISI7 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        // Sum ISI scores, store value & navigate accordingly
        const { ISI1, ISI2, ISI3, ISI4, ISI5, ISI6 } = GLOBAL;
        GLOBAL.ISI7 = value;
        GLOBAL.ISITotal = ISI1 + ISI2 + ISI3 + ISI4 + ISI5 + ISI6 + value;
        navigation.navigate('ISIResults', { progressBarPercent: null });
      }}
      buttonValues={[
        { label: 'Not at all interfering', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much interfering', value: 4, solidColor: true }
      ]}
      questionLabel="How much does your sleep problem interfere with your daily life? (e.g. tiredness, mood, ability to function at work, concentration, etc.)?"
    />
  );
};

export const ISIResults = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  const severityText = () => {
    if (GLOBAL.ISITotal <= 7) {
      return 'no clinically significant insomnia';
    } else if (GLOBAL.ISITotal <= 14) {
      return 'clinically mild insomnia';
    } else if (GLOBAL.ISITotal <= 21) {
      return 'clinically moderate insomnia';
    } else {
      return 'clinically severe insomnia';
    }
  };
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('ISI1', {
          progressBarPercent: null
        });
      }}
      textLabel={
        <Text>
          Done! According to the Insomnia Severity Index, you’ve got{' '}
          {GLOBAL.ISITotal >= 7 ? '\n' : null}{' '}
          <Text style={styles.BoldLabelText}>{severityText()}</Text>
        </Text>
      }
      buttonLabel="What's that mean?"
    />
  );
};

const styles = StyleSheet.create({
  BoldLabelText: {
    fontFamily: 'RubikBold'
  }
});
