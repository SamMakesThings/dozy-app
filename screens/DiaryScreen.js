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
import { withTheme, ScreenContainer, Container } from "@draftbit/ui";
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
            <Container elevation={0} useThemeGutterPadding={true}>
            <Container elevation={0} useThemeGutterPadding={true}>
                <Text
                style={[
                    theme.typography.headline4,
                    {
                    color: theme.colors.secondary,
                    textAlign: "center",

                    width: "100%",
                    marginTop: 30
                    }
                ]}
                >
                April 2019
                </Text>
            </Container>
            </Container>
            <Container elevation={0} useThemeGutterPadding={true}>
            <ScrollView horizontal={false}>
                <Container
                style={{
                    marginTop: 2
                }}
                elevation={0}
                useThemeGutterPadding={false}
                >
                <Container
                    style={{
                    paddingLeft: 0,
                    marginLeft: 28,
                    marginBottom: 2
                    }}
                    elevation={0}
                    useThemeGutterPadding={false}
                >
                    <Text
                    style={[
                        theme.typography.headline6,
                        {
                        color: theme.colors.light,

                        width: "100%"
                        }
                    ]}
                    >
                    Monday, April 15
                    </Text>
                </Container>
                <Container
                    style={{
                    minHeight: 200,
                    alignContent: "flex-start",
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderRadius: theme.borderRadius.global,
                    overflow: "hidden"
                    }}
                    elevation={2}
                    backgroundColor={theme.colors.medium}
                    useThemeGutterPadding={true}
                >
                    <Container
                    style={{
                        width: "33%",
                        justifyContent: "space-between",
                        alignItems: "space-between"
                    }}
                    elevation={0}
                    useThemeGutterPadding={false}
                    >
                    <Container
                        style={{
                        width: "94%",
                        alignSelf: "flex-start",
                        marginHorizontal: 0,
                        borderRadius: theme.borderRadius.global,
                        overflow: "hidden"
                        }}
                        elevation={0}
                        backgroundColor={theme.colors.primary}
                        useThemeGutterPadding={false}
                    >
                        <Text
                        style={[
                            theme.typography.headline6,
                            {
                            color: theme.colors.secondary,
                            textAlign: "center",

                            width: "100%",
                            paddingVertical: 8,
                            paddingHorizontal: 2
                            }
                        ]}
                        >
                        11:03 PM
                        </Text>
                    </Container>
                    <Text
                        style={{
                        color: theme.colors.light,
                        textAlign: "left",

                        width: "100%",
                        paddingLeft: 50,
                        paddingTop: 1,
                        paddingBottom: 0
                        }}
                    >
                        11:56
                    </Text>
                    <Text
                        style={{
                        color: theme.colors.light,
                        textAlign: "left",

                        width: "100%",
                        paddingLeft: 50,
                        paddingTop: 12,
                        marginLeft: 0
                        }}
                    >
                        7:44
                    </Text>
                    <Container
                        style={{
                        width: "94%",
                        alignSelf: "flex-start",
                        borderRadius: theme.borderRadius.global,
                        overflow: "hidden"
                        }}
                        elevation={0}
                        backgroundColor={theme.colors.secondary}
                        useThemeGutterPadding={false}
                    >
                        <Text
                        style={[
                            theme.typography.headline6,
                            {
                            color: theme.colors.primary,
                            textAlign: "center",

                            width: "100%",
                            paddingVertical: 8,
                            paddingHorizontal: 2
                            }
                        ]}
                        >
                        9:05 AM
                        </Text>
                    </Container>
                    </Container>
                    <Container
                    style={{
                        width: "27%",
                        justifyContent: "space-between",
                        alignItems: "space-between",
                        paddingVertical: 8
                    }}
                    elevation={0}
                    useThemeGutterPadding={false}
                    >
                    <Text
                        style={[
                        theme.typography.subtitle2,
                        {
                            color: theme.colors.light,
                            textAlign: "left",

                            width: "100%"
                        }
                        ]}
                    >
                        bedtime
                    </Text>
                    <Text
                        style={[
                        theme.typography.subtitle2,
                        {
                            color: theme.colors.light,
                            textAlign: "left",

                            width: "100%"
                        }
                        ]}
                    >
                        fell asleep
                    </Text>
                    <Text
                        style={[
                        theme.typography.subtitle2,
                        {
                            color: theme.colors.light,
                            textAlign: "left",

                            width: "100%"
                        }
                        ]}
                    >
                        woke up
                    </Text>
                    <Text
                        style={[
                        theme.typography.subtitle2,
                        {
                            color: theme.colors.light,
                            textAlign: "left",

                            width: "100%"
                        }
                        ]}
                    >
                        got up
                    </Text>
                    </Container>
                    <Container
                    style={{
                        width: "40%",
                        alignItems: "space-between",
                        alignSelf: "stretch",
                        alignContent: "space-between"
                    }}
                    elevation={0}
                    useThemeGutterPadding={false}
                    >
                    <Text
                        style={[
                        theme.typography.headline4,
                        {
                            color: theme.colors.secondary,
                            textAlign: "right",

                            width: "100%",
                            position: "absolute"
                        }
                        ]}
                    >
                        6h 30m
                    </Text>
                    <Text
                        style={[
                        theme.typography.subtitle2,
                        {
                            color: theme.colors.light,
                            textAlign: "right",

                            width: "100%",
                            paddingTop: 0,
                            marginTop: 23
                        }
                        ]}
                    >
                        duration
                    </Text>
                    <Text
                        style={[
                        theme.typography.headline4,
                        {
                            color: theme.colors.secondary,
                            textAlign: "right",

                            width: "100%",
                            paddingBottom: 0,
                            marginTop: 0,
                            marginBottom: 13,
                            bottom: 0,
                            position: "absolute"
                        }
                        ]}
                    >
                        65%
                    </Text>
                    <Text
                        style={[
                        theme.typography.subtitle2,
                        {
                            color: theme.colors.light,
                            textAlign: "right",

                            width: "100%",
                            bottom: 0,
                            position: "absolute"
                        }
                        ]}
                    >
                        sleep efficiency
                    </Text>
                    </Container>
                </Container>
                </Container>
            </ScrollView>
            </Container>
        </ScreenContainer>
    );
  }
}

export default withTheme(Root);
