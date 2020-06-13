/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions } from 'react-native';
import IconExplainScreen from '../components/IconExplainScreen';
import { dozy_theme } from '../config/Themes';
import LabCoat from '../assets/images/LabCoat.svg';

const theme = dozy_theme;

export const TreatmentReviewScreen = ({ navigation }) => {
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
      textLabel="Placeholder for educational treatment content review"
      buttonLabel="Next"
    />
  );
};
