/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions } from 'react-native';
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
      onQuestionSubmit={(value) => {
        GLOBAL.ISI1 = value;
        navigation.navigate('Welcome', { progressBarPercent: 0.28 });
      }}
      buttonValues={[
        { label: "0 (didn't wake up)", value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5+', value: 5 }
      ]}
      questionLabel="How much difficulty do you have falling asleep?"
    />
  );
};
