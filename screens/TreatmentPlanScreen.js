/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions } from 'react-native';
import IconExplainScreen from '../components/IconExplainScreen';
import { slumber_theme } from '../config/Themes';
import LabCoat from '../assets/images/LabCoat.svg';

const theme = slumber_theme;

export const TreatmentPlanScreen = ({ navigation }) => {
  let imgSize = 0.4 * useWindowDimensions().width;
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
      textLabel="Placeholder for treatment plan. Come back later for an overview of your custom insomnia recovery recipe!"
      buttonLabel="Next"
    />
  );
};
