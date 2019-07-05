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
import GLOBAL from '../../global';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount() {
    StatusBar.setBarStyle("light-content")
  }

  static navigationOptions = {
    header: null,
  }

  onFormSubmit (value) {
    GLOBAL.sleepNotes = value;
    this.props.navigation.navigate("App");
  }

  render() {
    const theme = slumber_theme;
    return (
      <ScreenContainer hasSafeArea={true} scrollable={false} style={styles.Root_nb1}>
        <Container style={styles.Container_nof} elevation={0} useThemeGutterPadding={true}>
          <IconButton
            style={styles.IconButton_n9u}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
          <Container style={styles.Container_nuv} elevation={0} useThemeGutterPadding={true}>
            <ProgressBar
              style={styles.ProgressBar_nn5}
              color={theme.colors.primary}
              progress={0.95}
              borderWidth={0}
              borderRadius={10}
              animationType="spring"
              unfilledColor={theme.colors.medium}
            />
          </Container>
        </Container>
        <Container style={styles.Container_n8t} elevation={0} useThemeGutterPadding={true}>
          <Text
            style={[
              styles.Text_nqt,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            What, if anything, disturbed your sleep last night?
          </Text>
          <TextField
            style={styles.TextField_no0}
            type="underline"
            label="(e.g. noise, lights)"
            keyboardType="default"
            leftIconMode="inset"
            onChangeText={sleepNotes => this.setState({ sleepNotes })}
            onSubmitEditing={(event)=>{
                this.onFormSubmit(event.nativeEvent.text)
            }}
          />
        </Container>
        <Container style={styles.Container_nmw} elevation={0} useThemeGutterPadding={true}>
          <Button
            style={styles.Button_n5c}
            type="solid"
            onPress={() => {
                this.onFormSubmit(this.state.sleepNotes)
            }}
            color={theme.colors.primary}
          >
            Finish
          </Button>
        </Container>
      </ScreenContainer>
    )
  }
}

const styles = StyleSheet.create({
  Button_n5c: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n8t: {
    height: "72%",
    justifyContent: "center",
    marginTop: 20
  },
  Container_nmw: {
    height: "15%"
  },
  Container_nof: {
    width: "100%",
    height: "10%",
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20
  },
  Container_nuv: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  IconButton_n9u: {
    paddingRight: 0
  },
  ProgressBar_nn5: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  Root_nb1: {
    backgroundColor: slumber_theme.colors.background
  },
  TextField_no0: {},
  Text_nqt: {
    textAlign: "center",
    width: "100%",
    alignItems: "flex-start",
    alignSelf: "center"
  }
})

export default withTheme(Root)
