import React from 'react';
import { StatusBar, StyleSheet, Text } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  DatePicker,
  Button
} from '@draftbit/ui';
import GLOBAL from '../../global';

class LogEntry5Screen extends React.Component {
  static navigationOptions = {
    header: null
  };

  state = {
    wakeTime: new Date()
  };

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

  onQuestionSubmit(value) {
    GLOBAL.wakeTime = value;
    console.log(GLOBAL.wakeTime);
    this.props.navigation.navigate('LogEntry6Screen');
  }

  render() {
    const { theme } = this.props;
    return (
      <ScreenContainer
        hasSafeArea={true}
        scrollable={false}
        style={styles.Root_nnz}
      >
        <Container
          style={styles.Container_n1a}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <IconButton
            style={styles.IconButton_nq9}
            icon="Ionicons/md-arrow-back"
            size={32}
            color={theme.colors.secondary}
            onPress={() => {
              this.props.navigation.goBack();
            }}
          />
          <Container
            style={styles.Container_nfa}
            elevation={0}
            useThemeGutterPadding={true}
          >
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
        <Container
          style={styles.Container_njd}
          elevation={0}
          useThemeGutterPadding={true}
        >
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
          <DatePicker
            style={styles.DatePicker_nd}
            mode="time"
            type="underline"
            error={false}
            label="Date"
            disabled={false}
            leftIconMode="inset"
            format="h:mm tt"
            date={this.state.wakeTime}
            onDateChange={(wakeTime) => this.setState({ wakeTime })}
          />
        </Container>
        <Container
          style={styles.Container_n0v}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <Button
            style={styles.Button_nxx}
            type="solid"
            onPress={() => {
              this.onQuestionSubmit(this.state.wakeTime);
            }}
            color={theme.colors.primary}
          >
            Next
          </Button>
        </Container>
      </ScreenContainer>
    );
  }
}

const styles = StyleSheet.create({
  Button_nxx: {
    paddingTop: 0,
    marginTop: 8
  },
  Container_n0v: {
    height: '15%'
  },
  Container_n1a: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  Container_nfa: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Container_njd: {
    height: '72%',
    justifyContent: 'center',
    marginTop: 20
  },
  Container_njh: {
    justifyContent: 'space-between',
    flexDirection: 'row'
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
  Root_nnz: {},
  TextField_n2o: {
    minWidth: '40%',
    maxWidth: '46%'
  },
  TextField_n66: {
    minWidth: '40%',
    maxWidth: '46%'
  },
  Text_njq: {
    textAlign: 'center',
    alignSelf: 'flex-end'
  },
  Text_nzz: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(LogEntry5Screen);
