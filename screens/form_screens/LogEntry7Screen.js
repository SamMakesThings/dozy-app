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

class LogEntry7Screen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    sleepRating: 3
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  onQuestionSubmit (value) {
    GLOBAL.sleepRating = value;
    console.log(GLOBAL.sleepRating);
    this.props.navigation.navigate("LogEntry8Screen");
  }

  render() {
    const { theme } = this.props
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_ngy}>
        <Container style={styles.Container_n9t} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_ncb}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_n78} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_neb}
              color={theme.colors.primary}
              progress={0.87}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_ncd} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_nkc,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            On a scale of 1-5, how would you rate the quality of your sleep last night?
          </Text>
        </Container>
        <Container style={styles.Container_nco} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_n9n}
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
            style={styles.Button_nae}
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
            style={styles.Button_nr6}
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
            style={styles.Button_nq5}
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
            style={styles.Button_n0m}
            type="outline"
            color={theme.colors.secondary}
            loading={false}
            onPress={() => {
                this.onQuestionSubmit(5)
            }}
            disabled={false}
          >
            5
          </Button>
        </Container>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  Button_n0m: {},
  Button_n9n: {},
  Button_nae: {},
  Button_nq5: {},
  Button_nr6: {},
  Container_n78: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Container_n9t: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_ncd: {
    height: "20%",
    justifyContent: "flex-end",
    marginTop: 20
  },
  Container_nco: {
    height: "45%",
    justifyContent: "space-around",
    marginBottom: 10
  },
  IconButton_ncb: {
    paddingRight: 0
  },
  ProgressBar_neb: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_ngy: {
    justifyContent: "space-between",
  },
  Text_nkc: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(LogEntry7Screen)
