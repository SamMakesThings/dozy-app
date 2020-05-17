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

// Define the theme for the file globally
const theme = slumber_theme;

// Define square image size defaults as a percent of width
const imgSize = 0.4;

export const Welcome = ({ navigation }) => {
  return (
    <IconExplainScreen
      theme={theme}
      backButton={() => navigation.goBack()}
      image={
        <WaveHello
          width={imgSize * useWindowDimensions().width}
          height={imgSize * useWindowDimensions().width}
        />
      }
      onQuestionSubmit={() => {
        navigation.navigate('MinsToFallAsleepInput', {
          progressBarPercent: null
        });
      }}
      textLabel="Welcome to Slumber! We'll get you sleeping better in no time."
      buttonLabel="Next"
    />
  );
};
