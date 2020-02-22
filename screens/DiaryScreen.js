import React, { Component } from "react";
import {
  StatusBar,
  ScrollView,
  Text,
  Platform
} from "react-native";
import * as SecureStore from 'expo-secure-store';
import { withTheme, ScreenContainer, Container, Button } from "@draftbit/ui";
import '@firebase/firestore';
import Intl from 'intl';
import { FbLib } from "../config/firebaseConfig";
import { slumber_theme } from "../config/slumber_theme";
import GLOBAL from '../global';

if (Platform.OS === 'android') {
  require('intl/locale-data/jsonp/en-US');
  require('intl/locale-data/jsonp/tr-TR');
  require('date-time-format-timezone');
  Intl.__disableRegExpRestore();/*For syntaxerror invalid regular expression unmatched parentheses*/
}

class SleepLogEntryCard extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        const theme = slumber_theme;
        return (
            <Container
            style={{
                marginTop: 20
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
                        {this.props.sleepLog.upTime.toDate().toLocaleString('en-US', { weekday: 'long', month:'long', day:'numeric' })}
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
                        borderRadius: theme.borderRadius.button,
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
                        {this.props.sleepLog.bedTime.toDate().toLocaleString('en-US', {hour:'numeric',minute:'numeric'})}
                        </Text>
                    </Container>
                    <Text
                        style={{
                        color: theme.colors.light,
                        textAlign: "center",

                        width: "100%",
                        paddingLeft: 50,
                        paddingTop: 1,
                        paddingBottom: 0
                        }}
                    >
                        {this.props.sleepLog.fallAsleepTime.toDate().toLocaleString('en-US', {hour:'numeric',minute:'numeric'}).slice(0,-3)}
                    </Text>
                    <Text
                        style={{
                        color: theme.colors.light,
                        textAlign: "center",

                        width: "100%",
                        paddingLeft: 50,
                        paddingTop: 12,
                        marginLeft: 0
                        }}
                    >
                        {this.props.sleepLog.wakeTime.toDate().toLocaleString('en-US', {hour:'numeric',minute:'numeric'}).slice(0,-3)}
                    </Text>
                    <Container
                        style={{
                        width: "94%",
                        alignSelf: "flex-start",
                        borderRadius: theme.borderRadius.button,
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
                        {this.props.sleepLog.upTime.toDate().toLocaleString('en-US', {hour:'numeric',minute:'numeric'})}
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
                        {+(this.props.sleepLog.sleepDuration / 60).toFixed(1)} hours
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
                        {(this.props.sleepLog.sleepEfficiency).toString().slice(2)}%
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
        )
    }
}

class SleepLogsView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const theme = slumber_theme;
        if (this.props.sleepLogs) {
            var sleepLogs = Object.keys(this.props.sleepLogs).map((key) => {
                return this.props.sleepLogs[key];
            });
            sleepLogs.sort((a,b) => {
                return b.wakeTime.seconds - a.wakeTime.seconds;
            })
            return(
                <ScrollView horizontal={false}>
                    <Button
                    icon="Ionicons/ios-add-circle"
                    type="solid"
                    color={theme.colors.primary}
                    style={{
                        marginTop: 35,
                    }}
                    onPress={() => this.props.logEntryRedirect()}
                    >
                        How did you sleep last night?
                    </Button>
                    {sleepLogs.map((log, index) => {
                        return (
                            <SleepLogEntryCard sleepLog={log} key={log.upTime.seconds}/>
                        )
                        })}
                </ScrollView>
            );
        } else { //
            const theme = slumber_theme;
            return (
                <ScrollView horizontal={false}>
                    <Button
                    icon="Ionicons/ios-add-circle"
                    type="solid"
                    color={theme.colors.primary}
                    style={{
                        marginTop: 35,
                    }}
                    onPress={() => this.props.logEntryRedirect()}
                    >
                        How did you sleep last night?
                    </Button>
                    <Text
                        style={[
                        theme.typography.headline6,
                        {
                            color: theme.colors.secondary,
                            textAlign: "right",

                            width: "100%",
                            position: "absolute"
                        }
                        ]}
                    >
                        Seems like you have not logged any data yet.
                    </Text>
                </ScrollView>
            )
        }
    }
}

class Root extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            sleepLogs: null
        }
    }

    static navigationOptions = {
        header: null,
    };
    
    _fetchUidFromAsync = async () => {
        userId = await SecureStore.getItemAsync('userData');
        this.fetchSleepLogs();
        return userId;
    }

    componentDidMount = () => {
        StatusBar.setBarStyle("light-content");
        this._fetchUidFromAsync();
    };

    fetchSleepLogs = async () => {
        // Retrieving sleep logs from Firestore
        
        var db = FbLib.firestore();

        userId = await SecureStore.getItemAsync('userData');

        var docRef = db.collection("sleep-logs").doc(userId); //CHANGE THIS CALL

        docRef.get().then((doc) => {
            if (doc.exists) {
                this.setState({ sleepLogs: doc.data() });
                // console.log("Sleep logs:", this.state.sleepLogs);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such log!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    };

    goToLogEntry = () => {
        this.props.navigation.navigate('SleepDiaryEntry');
    }

    render() {
        const theme = slumber_theme;
        return (
            <ScreenContainer style={{backgroundColor: "#232B3F"}} hasSafeArea={true} scrollable={true}>
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
                        Sleep diary
                        </Text>
                    </Container>
                </Container>
                <Container elevation={0} useThemeGutterPadding={true}>
                    <SleepLogsView sleepLogs={this.state.sleepLogs} logEntryRedirect={this.goToLogEntry}></SleepLogsView>
                </Container>
            </ScreenContainer>
        );
    }
}

export default withTheme(Root);
