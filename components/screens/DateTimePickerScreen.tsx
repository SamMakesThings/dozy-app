import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  DatePicker
} from '@draftbit/ui';
import BottomNavButtons from '../BottomNavButtons';

// Define types for theme (define it here, eventually make a file for it)
interface Theme {
  colors: {
    background: string;
    secondary: string;
    error: string;
  };
  typography: {
    body1: object;
    headline5: object;
  };
}

// Define types for props
interface Props {
  defaultValue: Date;
  questionLabel: string;
  questionSubtitle?: string;
  inputLabel: string;
  onQuestionSubmit: Function;
  buttonLabel?: string;
  bottomBackButton: boolean;
  bottomGreyButtonLabel: string;
  mode: string;
  theme: Theme;
  validInputChecker?: Function;
}

// Define possible states w/a TypeScript enum
enum States {
  Empty = 0,
  Invalid = 1,
  Valid = 2
}

// A unified date, time, and datetime picker screen. Has a label and input.
const DateTimePickerScreen: React.FC<Props> = (props) => {
  // Create state to manage input value(s)
  const [selectedTime, setSelectedTime] = React.useState(
    props.defaultValue || new Date()
  );

  // Create state to manage possible screen states
  const [screenState, setScreenState] = React.useState(States.Valid);
  const [errorMsg, setErrorMsg] = React.useState('Error');

  // Function to update screen state when data changes
  function checkDataValidity(val: Date) {
    // Use a passed-in function to validate input value.
    // If no function passed, all is valid
    // If valid, passed function should return true.
    // If invalid, function should return an error string to display.

    if (
      props.validInputChecker === undefined ||
      props.validInputChecker(val) === true
    ) {
      setScreenState(States.Valid);
    } else {
      setErrorMsg(props.validInputChecker(val));
      setScreenState(States.Invalid);
    }
  }

  const { theme } = props;
  return (
    <ScreenContainer
      style={{ backgroundColor: theme.colors.background }}
      hasSafeArea={true}
      scrollable={false}
    >
      <Container
        style={styles.View_HeaderContainer}
        elevation={0}
        useThemeGutterPadding={true}
      ></Container>
      <Container
        style={styles.View_ContentContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <View style={{ flex: 4, justifyContent: 'center' }}>
          <Text
            style={[
              styles.Text_QuestionLabel,
              theme.typography.headline5,
              {
                color: theme.colors.secondary
              }
            ]}
          >
            {props.questionLabel}
          </Text>
          {(props.questionSubtitle || screenState === States.Invalid) && ( // If invalid input, replace subtitle with error message
            <Text
              style={[
                styles.Text_QuestionLabel,
                theme.typography.body1,
                styles.Text_QuestionSubtitle,
                {
                  color:
                    screenState === States.Invalid
                      ? theme.colors.error
                      : theme.colors.secondary
                }
              ]}
            >
              {screenState === States.Invalid
                ? errorMsg
                : props.questionSubtitle}
            </Text>
          )}
        </View>
        {props.mode === 'datetime' && Platform.OS === 'android' ? (
          <View style={styles.View_DateTimeAndroidContainer}>
            <DatePicker
              style={styles.DatePickerHalf}
              mode="date"
              type="underline"
              error={screenState === States.Invalid}
              label="Date"
              disabled={false}
              leftIconMode="inset"
              format="dddd, mmmm dS"
              date={selectedTime}
              onDateChange={(selectedTime: Date) => {
                setSelectedTime(selectedTime);
                checkDataValidity(selectedTime);
              }}
            />
            <DatePicker
              style={styles.DatePickerHalf}
              mode="time"
              type="underline"
              error={screenState === States.Invalid}
              label="Time"
              disabled={false}
              leftIconMode="inset"
              format="h:MM TT"
              date={selectedTime}
              onDateChange={(selectedTime: Date) => {
                setSelectedTime(selectedTime);
                checkDataValidity(selectedTime);
              }}
            />
          </View>
        ) : (
          <DatePicker
            style={styles.DatePicker}
            mode={props.mode}
            type="underline"
            error={screenState === States.Invalid}
            label={props.inputLabel}
            disabled={false}
            leftIconMode="inset"
            format={
              props.mode === 'datetime' ? 'dddd, mmmm dS, h:MM TT' : 'h:MM TT'
            }
            date={selectedTime}
            onDateChange={(selectedTime: Date) => {
              setSelectedTime(selectedTime);
              checkDataValidity(selectedTime);
            }}
          />
        )}
      </Container>
      <BottomNavButtons
        theme={theme}
        onPress={(value: string) => {
          if (value && value == props.bottomGreyButtonLabel) {
            props.onQuestionSubmit(false);
          } else {
            props.onQuestionSubmit(selectedTime);
          }
        }}
        bottomBackButton={props.bottomBackButton || null}
        bottomGreyButtonLabel={props.bottomGreyButtonLabel}
        buttonLabel={props.buttonLabel}
        disabled={screenState !== States.Valid}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  DatePicker: {
    flex: 2,
    alignItems: 'center',
    marginTop: -60
  },
  DatePickerHalf: {
    margin: 15
  },
  View_DateTimeAndroidContainer: {
    flex: 3,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  View_ContentContainer: {
    flex: 1,
    justifyContent: 'space-around',
    marginTop: 20
  },
  View_ProgressBarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  View_HeaderContainer: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  Text_QuestionLabel: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  Text_QuestionSubtitle: {
    fontWeight: 'normal',
    opacity: 0.7
  }
});

export default withTheme(DateTimePickerScreen);
