import React from 'react';
import { withTheme } from '@draftbit/ui';
import MultiButtonScreen from '../../components/MultiButtonScreen';
import GLOBAL from '../../global';

const LogEntry3Screen = (props) => {
  const { theme } = props;
  return (
    <MultiButtonScreen
      theme={theme}
      onQuestionSubmit={(value) => {
        GLOBAL.wakeCount = value;
        props.navigation.navigate('LogEntry4Screen');
      }}
      navigation={props.navigation}
      buttonValues={[
        { label: "0 (didn't wake up)", value: 0 },
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5+', value: 5 }
      ]}
      progressBar
      progressBarPercent={0.38}
      questionLabel="After falling asleep, about how many times did you wake up in the night?"
    />
  );
};

export default withTheme(LogEntry3Screen);
