import React, { Component } from "react";
import {
  StatusBar,
  StyleSheet,
  View,
  WebView,
  ScrollView,
  KeyboardAvoidingView,
  ImageBackground,
  Text,
  TextInput,
  FlatList
} from "react-native";
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  TextField,
  Button
} from "@draftbit/ui";
import { slumber_theme } from "../config/slumber_theme";

class Root extends Component {
  state = {};

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    StatusBar.setBarStyle("light-content");
  }

  render() {
    const theme = slumber_theme;
    return (
      <ScreenContainer style={{backgroundColor: "#232B3F"}} hasSafeArea={true} scrollable={false}>
        <Container
          style={{
            height: "10%",
            alignItems: "flex-start",
            alignSelf: "stretch",
            flexDirection: "row",
            paddingTop: 35
          }}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <IconButton
            style={{
              alignSelf: "flex-start"
            }}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
          />
          <ProgressBar
            style={{
              minWidth: "50%",
              alignSelf: "stretch",
              paddingLeft: 0,
              marginLeft: 50,
              color: theme.colors.primary,
            }}
            progress={0.3}
          />
        </Container>
        <Container
          style={{
            width: "100%",
            height: "80%",
            justifyContent: "space-evenly"
          }}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Container elevation={0} useThemeGutterPadding={true}>
            <Text
              style={[
                theme.typography.headline4,
                {
                  color: theme.colors.secondary,

                  width: "100%"
                }
              ]}
            >
              Roughly how long did it take you to fall asleep?
            </Text>
            <TextField
              type="underline"
              onChange={formFallAsleepField =>
                this.setState({ formFallAsleepField })
              }
              value={this.state.formFallAsleepField}
              multiline={true}
              placeholder="(in minutes)"
              keyboardType="number-pad"
              leftIconMode="inset"
            />
          </Container>
        </Container>
        <Container
          style={{
            height: "10%"
          }}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Button type="solid" loading={false} disabled={false} color={theme.colors.primary}>
            Next
          </Button>
        </Container>
      </ScreenContainer>
    );
  }
}

export default withTheme(Root);
