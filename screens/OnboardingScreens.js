/* eslint-disable import/prefer-default-export */
import React from 'react';
import IconExplainScreen from '../components/IconExplainScreen';
import NumInputScreen from '../components/NumInputScreen';
import MultiButtonScreen from '../components/MultiButtonScreen';
import TagSelectScreen from '../components/TagSelectScreen';
import DateTimePickerScreen from '../components/DateTimePickerScreen';
import submitSleepDiaryData from '../utilities/submitSleepDiaryData';
import GLOBAL from '../utilities/global';
import { slumber_theme } from '../config/Themes';
import Images from '../config/Images';

// Define the theme for the file globally
const theme = slumber_theme;

export const Welcome = ({ navigation }) => {
  return (
    <IconExplainScreen
      theme={theme}
      image={Images.WaveHello}
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
