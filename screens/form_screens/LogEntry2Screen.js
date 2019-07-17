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
import GLOBAL from '../../global';

class LogEntry2Screen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    minsToFallAsleep: 25,
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  onQuestionSubmit (value) {
    GLOBAL.minsToFallAsleep = value;
    console.log(GLOBAL.minsToFallAsleep);
    this.props.navigation.navigate("LogEntry3Screen");
  }

  render() {
    const { theme } = this.props;
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_n3a}>
        <Container style={styles.Container_nh7} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_nmh}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_nzw} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_neb}
              color={theme.colors.primary}
              progress={0.25}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_nfw} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_nlz,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            Roughly how long did it take you to fall asleep?
          </Text>
          <TextField
            style={styles.TextField_nw8}
            type="underline"
            label="(in minutes)"
            keyboardType="number-pad"
            leftIconMode="inset"
            onChangeText={minsToFallAsleep => this.setState({ minsToFallAsleep })}
            onSubmitEditing={(event)=>{
                this.onQuestionSubmit(event.nativeEvent.text)
            }}
          />
        </Container>
        <Container style={styles.Container_nrj} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_nqa}
            type="solid"
            onPress={() => {
              this.onQuestionSubmit(this.state.minsToFallAsleep)
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
  Button_nqa: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_nfw: {
    height: "72%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_nh7: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nrj: {
    height: "15%"
  },
  Container_nzw: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  IconButton_nmh: {
    paddingRight: 0
  },
  ProgressBar_neb: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_n3a: {
  },
  TextField_nw8: {},
  Text_nlz: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(LogEntry2Screen)
