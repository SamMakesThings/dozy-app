import React from "react"
import { StatusBar, StyleSheet, Text } from "react-native"
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  TextField,
  Button
} from "@draftbit/ui"
import { slumber_theme } from "../../config/slumber_theme";

class Root extends React.Component {
  state = {}

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  static navigationOptions = {
    header: null,
  };

  render() {
    const theme = slumber_theme;
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_nnz}>
        <Container style={styles.Container_n1a} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_nq9}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_nfa} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_n15}
              color={theme.colors.primary}
              progress={0.63}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_njd} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_nzz,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            What time did you wake up?
          </Text>
          <Container style={styles.Container_njh} elevation={0} useThemeGutterPadding={true}>
            <TextField
              style={styles.TextField_n66}
              type="underline"
              label="Hour (e.g. 23)"
              keyboardType="number-pad"
              leftIconMode="inset"
            />
            <Text
              style={[
                styles.Text_njq,
                theme.typography.headline4,
                {
                  color: theme.colors.secondary
                }
              ]}
            >
              :
            </Text>
            <TextField
              style={styles.TextField_n2o}
              type="underline"
              label="Minute (e.g. 30)"
              keyboardType="number-pad"
              leftIconMode="inset"
            />
          </Container>
        </Container>
        <Container style={styles.Container_n0v} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_nxx}
            type="solid"
            onPress={() => {
              this.props.navigation.navigate("LogEntry6Screen")
            }}
          >
            Next
          </Button>
        </Container>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  Button_nxx: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n0v: {
    height: "15%"
  },
  Container_n1a: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nfa: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Container_njd: {
    height: "75%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_njh: {
    justifyContent: "space-between",
    flexDirection: "row"
  },
  IconButton_nq9: {
    paddingRight: 0
  },
  ProgressBar_n15: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_nnz: {
    backgroundColor: slumber_theme.colors.background
  },
  TextField_n2o: {
    minWidth: "40%",
    maxWidth: "46%"
  },
  TextField_n66: {
    minWidth: "40%",
    maxWidth: "46%"
  },
  Text_njq: {
    textAlign: "center",
    alignSelf: "flex-end"
  },
  Text_nzz: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(Root)
