import React from "react"
import { StyleSheet, Text } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  DatePicker,
  Button
} from "@draftbit/ui"

const TimePickerScreen = props => {
    const [selectedTime, setSelectedTime] = React.useState(new Date());

    const { theme } = props
    return (
      <ScreenContainer style={{ backgroundColor: theme.colors.background }} hasSafeArea={true} scrollable={false}>
        <Container style={styles.Container_nt5} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_nei}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_ngt} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={{...styles.ProgressBar_nv3, ...{display: props.progressBar ? 'flex' : 'none'}}}
              color={theme.colors.primary}
              progress={props.progressBarPercent}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_nfe} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_n66,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            {props.questionLabel}
          </Text>
          <DatePicker
            style={styles.DatePicker_nd}
            mode="time"
            type="underline"
            error={false}
            label={props.inputLabel}
            disabled={false}
            leftIconMode="inset"
            format="h:MM tt"
            date={selectedTime}
            onDateChange={selectedTime => setSelectedTime( selectedTime )}
          />
        </Container>
        <Container style={styles.Container_nno} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_nso}
            type="solid"
            onPress={() => {
              props.onQuestionSubmit(selectedTime)
            }}
            disabled={false}
            color={theme.colors.primary}
          >
            Next
          </Button>
        </Container>
      </ScreenContainer>
    )
}

const styles = StyleSheet.create({
  Button_nso: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n1m: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  Container_nfe: {
    height: "72%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_ngt: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Container_nno: {
    height: "15%"
  },
  Container_nt5: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  IconButton_nei: {
    paddingRight: 0
  },
  ProgressBar_nv3: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  TextField_n6f: {
    minWidth: "40%",
    maxWidth: "46%"
  },
  TextField_nrw: {
    minWidth: "40%",
    maxWidth: "46%"
  },
  Text_n66: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  },
  Text_nct: {
    textAlign: "center",
    alignSelf: "flex-end"
  }
})

export default withTheme(TimePickerScreen)
