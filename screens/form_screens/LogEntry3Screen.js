import React from "react"
import { StatusBar, StyleSheet, Text } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  Button
} from "@draftbit/ui"
import GLOBAL from '../../global';

class LogEntry3Screen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    wakeCount: 2
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  onQuestionSubmit (value) {
    GLOBAL.wakeCount = value;
    console.log(GLOBAL.wakeCount);
    this.props.navigation.navigate("LogEntry4Screen");
  }

  render() {
    const { theme } = this.props
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_ne0}>
        <Container style={styles.Container_n9i} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_not}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_n8l} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_nj7}
              color={theme.colors.primary}
              progress={0.38}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_nux} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_npp,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            After falling asleep, about how many times did you wake up in the night?
          </Text>
        </Container>
        <Container style={styles.Container_nh7} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_n5r}
            type="outline"
            color={theme.colors.secondary}
            loading={false}
            onPress={() => {
              this.onQuestionSubmit(0)
            }}
            disabled={false}
          >
            0 (didn't wake up)
          </Button>
          <Button
            style={styles.Button_nu5}
            type="outline"
            color={theme.colors.secondary}
            loading={false}
            onPress={() => {
              this.onQuestionSubmit(1)
            }}
            disabled={false}
          >
            1
          </Button>
          <Button
            style={styles.Button_nu5}
            type="outline"
            color={theme.colors.secondary}
            loading={false}
            onPress={() => {
              this.onQuestionSubmit(2)
            }}
            disabled={false}
          >
            2
          </Button>
          <Button
            style={styles.Button_nu5}
            type="outline"
            color={theme.colors.secondary}
            loading={false}
            onPress={() => {
              this.onQuestionSubmit(3)
            }}
            disabled={false}
          >
            3
          </Button>
          <Button
            style={styles.Button_nu5}
            type="outline"
            color={theme.colors.secondary}
            loading={false}
            onPress={() => {
              this.onQuestionSubmit(4)
            }}
            disabled={false}
          >
            4
          </Button>
          <Button
            style={styles.Button_nu5}
            type="outline"
            color={theme.colors.secondary}
            loading={false}
            onPress={() => {
              this.onQuestionSubmit(5)
            }}
            disabled={false}
          >
            5+
          </Button>
        </Container>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  Button_n5r: {},
  Button_nu5: {},
  Container_n8l: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Container_n9i: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nh7: {
    height: "54%",
    justifyContent: "space-around",
    marginBottom: 10
  },
  Container_nux: {
    height: "20%",
    justifyContent: "flex-end",
    marginTop: 20
  },
  IconButton_not: {
    paddingRight: 0
  },
  ProgressBar_nj7: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_ne0: {
    justifyContent: "space-between",
  },
  Text_npp: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(LogEntry3Screen)
