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
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_n3a}>
        <Container style={styles.Container_n0n} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_ngl}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_nd1} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_nuc}
              color={theme.colors.primary}
              progress={0.5}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_n57} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_nvx,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            Roughly how many minutes were you awake in the night in total?
          </Text>
          <TextField
            style={styles.TextField_nan}
            type="underline"
            label="(in minutes)"
            keyboardType="number-pad"
            leftIconMode="inset"
          />
        </Container>
        <Container style={styles.Container_nrt} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_n09}
            type="solid"
            onPress={() => {
              this.props.navigation.navigate("LogEntry5Screen")
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
  Button_n09: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n0n: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_n57: {
    height: "75%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_nd1: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Container_nrt: {
    height: "15%"
  },
  IconButton_ngl: {
    paddingRight: 0
  },
  ProgressBar_nuc: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_n3a: {
    backgroundColor: slumber_theme.colors.background
  },
  TextField_nan: {},
  Text_nvx: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(Root)
