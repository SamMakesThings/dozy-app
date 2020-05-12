import React from 'react';
import { withTheme } from '@draftbit/ui';
import NumInputScreen from '../../components/NumInputScreen';
import GLOBAL from '../../global';

const LogEntry2Screen = (props) => {
  const { theme } = props;
  return (
    <NumInputScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.minsToFallAsleep = value;
        props.navigation.navigate('LogEntry3Screen');
      }}
      navigation={props.navigation}
      progressBar
      progressBarPercent={0.26}
      questionLabel="Roughly how long did it take you to fall asleep?"
      inputLabel="(in minutes)"
    />
  );
};

export default withTheme(LogEntry2Screen);
