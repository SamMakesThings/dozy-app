import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  DatePicker
} from '@draftbit/ui';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';

// Define types for props
interface Props {
  defaultValue?: Date;
  questionLabel: string;
  questionSubtitle?: string;
  inputLabel?: string;
  onQuestionSubmit: Function;
  buttonLabel?: string;
  bottomBackButton: Function;
  bottomGreyButtonLabel?: string;
  mode: string;
  theme: Theme;
  validInputChecker?: Function;
}

// Define possible states w/a TypeScript enum
enum States {
  Empty = 0,
  Invalid = 1,
  Warning = 2,
  Valid = 3
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
  const checkDataValidity = (val: Date) => {
    // Use a passed-in function to validate input value.
    // If no function passed, all is valid
    // If valid, passed function should return true.
    // If invalid, function should return an error object, with a severity prop and a message prop.
    // Severity can be either "WARNING" or "ERROR"

    interface ErrorObj {
      severity: string;
      errorMsg: string;
    }
    const validationResult:
      | ErrorObj
      | boolean
      | undefined = props.validInputChecker
      ? props.validInputChecker(val)
      : undefined;

    if (validationResult === undefined || validationResult === true) {
      setScreenState(States.Valid);
    } else if (validationResult === false) {
      console.error('Validation function should never return false');
    } else if (validationResult.severity === 'WARNING') {
      setErrorMsg(validationResult.errorMsg);
      setScreenState(States.Warning);
    } else if (validationResult.severity === 'ERROR') {
      setErrorMsg(validationResult.errorMsg);
      setScreenState(States.Invalid);
    } else {
      console.error('Validation function did something unexpected');
    }
  };

  React.useEffect(() => {
    checkDataValidity(selectedTime);
  }, []);

  const { theme } = props;
  const displayErrorMsg =
    screenState === States.Invalid || screenState === States.Warning;
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
          {(props.questionSubtitle || displayErrorMsg) && ( // If invalid input, replace subtitle with error message
            <Text
              style={[
                styles.Text_QuestionLabel,
                theme.typography.body1,
                styles.Text_QuestionSubtitle,
                {
                  color: displayErrorMsg
                    ? theme.colors.error
                    : theme.colors.secondary
                }
              ]}
            >
              {displayErrorMsg ? errorMsg : props.questionSubtitle}
            </Text>
          )}
        </View>
        {props.mode === 'datetime' && Platform.OS === 'android' ? (
          <View style={styles.View_DateTimeAndroidContainer}>
            <DatePicker
              style={styles.DatePickerHalf}
              mode="date"
              type="underline"
              error={displayErrorMsg}
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
              error={displayErrorMsg}
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
            error={displayErrorMsg}
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
        disabled={screenState === States.Invalid}
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
