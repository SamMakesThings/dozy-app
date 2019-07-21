import React from "react"
import { StatusBar, StyleSheet, Text } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  DatePicker,
  Button
} from "@draftbit/ui"
import GLOBAL from '../../global';

class LogEntry6Screen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    upTime: new Date()
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }



  onQuestionSubmit (value) {
    GLOBAL.upTime = value;
    console.log(GLOBAL.upTime);
    this.props.navigation.navigate("LogEntry7Screen");
  }

  render() {
    const { theme } = this.props
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_nh4}>
        <Container style={styles.Container_n3l} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_nsn}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_nas} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_n1h}
              color={theme.colors.primary}
              progress={0.75}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_n3b} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_nrr,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            What time did you get up?
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
            date={this.state.upTime}
            onDateChange={upTime => this.setState({ upTime })}
          />
        </Container>
        <Container style={styles.Container_nu4} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_nw3}
            type="solid"
            onPress={() => {
                this.onQuestionSubmit(this.state.upTime)
            }}
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
  Button_nw3: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n3b: {
    height: "72%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_n3l: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nas: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Container_npb: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  Container_nu4: {
    height: "15%"
  },
  IconButton_nsn: {
    paddingRight: 0
  },
  ProgressBar_n1h: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_nh4: {
  },
  TextField_nkw: {
    minWidth: "40%",
    maxWidth: "46%"
  },
  TextField_nrr: {
    minWidth: "40%",
    maxWidth: "46%"
  },
  Text_n23: {
    textAlign: "center",
    alignSelf: "flex-end"
  },
  Text_nrr: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(LogEntry6Screen)
