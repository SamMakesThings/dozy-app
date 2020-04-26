import React from "react"
import {
  withTheme,
} from "@draftbit/ui"
import TimePickerScreen from '../../components/TimePickerScreen'
import GLOBAL from '../../global'

const LogEntry1Screen = props => {
  function onQuestionSubmit (value) {
    GLOBAL.bedTime = value;
    console.log(GLOBAL.bedTime);
    props.navigation.navigate("LogEntry2Screen");
  }

  const { theme } = props
  return (
    <TimePickerScreen
      theme={theme}
      onQuestionSubmit={value => onQuestionSubmit(value)}
      navigation={props.navigation}
      progressBar
      progressBarPercent={0.13}
      questionLabel="What time did you go to bed last night?"
      inputLabel="Bedtime"
      navigateTo="LogEntry2Screen"
    />
  )
}

export default withTheme(LogEntry1Screen)
