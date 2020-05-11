import React from "react"
import {
  withTheme,
} from "@draftbit/ui"
import TimePickerScreen from '../../components/TimePickerScreen'
import GLOBAL from '../../global'

const LogEntry1Screen = props => {
  const { theme } = props
  return (
    <TimePickerScreen
      theme={theme}
      onQuestionSubmit={value => {
        GLOBAL.bedTime = value;
        props.navigation.navigate("LogEntry2Screen");
      }}
      navigation={props.navigation}
      progressBar
      progressBarPercent={0.13}
      questionLabel="What time did you go to bed last night?"
      inputLabel="Bedtime"
    />
  )
}

export default withTheme(LogEntry1Screen)
