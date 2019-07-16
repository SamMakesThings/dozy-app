import React from "react"
import { StatusBar, StyleSheet, Text } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  TextField,
  DatePicker,
  Button
} from "@draftbit/ui"

class LogEntry1Screen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    bedTime: new Date()
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  onQuestionSubmit (value) {
    GLOBAL.bedTime = value;
    console.log(GLOBAL.bedTime);
    this.props.navigation.navigate("LogEntry2Screen");
  }

  render() {
    const { theme } = this.props
    return (
      <ScreenContainer style={{ backgroundColor: theme.colors.background }} hasSafeArea={true} scrollable={false}>
        <Container style={styles.Container_nt5} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_nei}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_ngt} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_nv3}
              color={theme.colors.primary}
              progress={0.13}
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
            What time did you go to bed last night?
          </Text>
          <DatePicker
            style={styles.DatePicker_nd}
            mode="time"
            type="underline"
            error={false}
            label="Date"
            disabled={false}
            leftIconMode="inset"
            format="h:mm tt"
            date={this.state.bedTime}
            onDateChange={bedTime => this.setState({ bedTime })}
          />
        </Container>
        <Container style={styles.Container_nno} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_nso}
            type="solid"
            onPress={() => {
              this.onQuestionSubmit(this.state.bedTime)
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

export default withTheme(LogEntry1Screen)
