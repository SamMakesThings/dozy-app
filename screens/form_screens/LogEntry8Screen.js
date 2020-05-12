import React from "react"
import {
  withTheme,
} from "@draftbit/ui"
import TagSelectScreen from '../../components/TagSelectScreen'
import GLOBAL from '../../global'

const LogEntry8Screen = props => {
  const { theme } = props
  return (
    <TagSelectScreen
      theme={theme}
      navigation={props.navigation}
      progressBar
      progressBarPercent={0.95}
      questionLabel="What, if anything, disturbed your sleep last night?"
      inputLabel="(e.g. The cat woke me up)"
    />
  )
}

export default withTheme(LogEntry8Screen)
