import React from "react"
import { StatusBar, StyleSheet, Text } from "react-native"
import { withTheme, ScreenContainer, Container, Icon, Switch, DatePicker } from "@draftbit/ui"
import { slumber_theme } from "../config/slumber_theme";

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
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_nd}>
        <Container style={styles.Container_nz} elevation={0} useThemeGutterPadding={true}>
          <Icon
            style={styles.Icon_ny}
            name="Ionicons/ios-person"
            size={200}
            color={theme.colors.primary}
          />
          <Text
            style={[
              styles.Text_n1,
              theme.typography.headline3,
              {
                color: theme.colors.strong
              }
            ]}
          >
            User
          </Text>
          <Text
            style={[
              styles.Text_nc,
              theme.typography.subtitle2,
              {
                color: theme.colors.light
              }
            ]}
          >
            @slumberapp
          </Text>
        </Container>
        <Container style={styles.Container_ns} elevation={0} useThemeGutterPadding={true}>
          <Container style={styles.Container_ni} elevation={0} useThemeGutterPadding={true}>
            <Text
              style={[
                styles.Text_nv,
                theme.typography.body1,
                {
                  color: theme.colors.strong
                }
              ]}
            >
              Sleep Log Reminders
            </Text>
            <Switch
              style={styles.Switch_n9}
              color={theme.colors.primary}
              disabled={false}
              onValueChange={pushNotificationsToggle => this.setState({ pushNotificationsToggle })}
              value={this.state.pushNotificationsToggle}
            />
          </Container>
          <Container style={styles.Container_nw} elevation={0} useThemeGutterPadding={true}>
            <Text
              style={[
                styles.Text_nb,
                theme.typography.body1,
                {
                  color: theme.colors.strong
                }
              ]}
            >
              Reminder Time (soon)
            </Text>
            <DatePicker
              style={styles.DatePicker_nl}
              mode="time"
              type="solid"
              error={false}
              label="Date"
              disabled={true}
              leftIconMode="inset"
              onDateChange={this.onDateChange}
            />
          </Container>
        </Container>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  Container_ni: {
    minWidth: 0,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 15
  },
  Container_ns: {
    alignItems: "flex-start"
  },
  Container_nw: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row"
  },
  Container_nz: {
    alignItems: "center",
    marginTop: 20,
  },
  DatePicker_nl: {
    minWidth: 100,
    paddingLeft: 0,
    marginLeft: 0
  },
  Root_nd: {
    justifyContent: "space-around",
    backgroundColor: slumber_theme.colors.background,
  },
  Text_n1: {
    textAlign: "center",
    width: "100%"
  },
  Text_nc: {
    textAlign: "center",
    width: "100%"
  }
})

export default withTheme(Root)
