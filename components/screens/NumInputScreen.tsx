import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';

interface Props {
  questionLabel: string;
  questionSubtitle?: string;
  inputLabel: string;
  defaultValue?: string;
  progressBarPercent?: number;
  onQuestionSubmit: (value: number | string) => void;
  optional?: boolean;
  bottomBackButton?: () => void;
  validInputChecker?: (value: number) => boolean;
  theme: Theme;
}

// Define possible states w/a TypeScript enum
enum States {
  Empty = 0,
  Invalid = 1,
  Warning = 2,
  Valid = 3,
}

const NumInputScreen: React.FC<Props> = (props) => {
  const [selectedNum, setSelectedNum] = React.useState(props.defaultValue || 0);

  // Create state to manage possible screen states
  const [screenState, setScreenState] = React.useState(
    props.defaultValue ? States.Valid : States.Empty,
  );
  const [errorMsg, setErrorMsg] = React.useState('Error');

  // Function to update screen state when data changes
  function checkDataValidity(val: number) {
    // Use a passed-in function to validate input value.
    // If no function passed, all is valid
    // If valid, passed function should return true.
    // If invalid, function should return an error object, with a severity prop and a message prop.
    // Severity can be either "WARNING" or "ERROR"

    interface ErrorObj {
      severity: string;
      errorMsg: string;
    }
    const validationResult: ErrorObj | boolean | undefined =
      props.validInputChecker ? props.validInputChecker(val) : undefined;

    if (isNaN(val) && !props.optional) {
      setScreenState(States.Empty);
    } else if (
      validationResult === undefined ||
      validationResult === true ||
      (isNaN(val) && props.optional)
    ) {
      setScreenState(States.Valid);
    } else if (validationResult === false) {
      console.error('Validation function should never return false');
    } else if ((validationResult as ErrorObj)?.severity === 'WARNING') {
      setErrorMsg((validationResult as ErrorObj)?.errorMsg);
      setScreenState(States.Warning);
    } else if ((validationResult as ErrorObj)?.severity === 'ERROR') {
      setErrorMsg((validationResult as ErrorObj)?.errorMsg);
      setScreenState(States.Invalid);
    } else {
      console.error('Validation function did something unexpected');
    }
  }

  const { theme } = props;
  const displayErrorMsg =
    screenState === States.Invalid || screenState === States.Warning;
  return (
    <ScreenContainer hasSafeArea={true} scrollable={false}>
      <Container
        style={styles.View_HeaderContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Container elevation={0} useThemeGutterPadding={true}></Container>
      </Container>
      <Container
        style={styles.View_ContentContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Text
          style={[
            styles.Text_Question,
            theme.typography.headline5,
            {
              color: theme.colors.secondary,
            },
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
                  : theme.colors.secondary,
              },
            ]}
          >
            {displayErrorMsg ? errorMsg : props.questionSubtitle}
          </Text>
        )}
        <Container
          style={{
            ...styles.View_InputContainer,
            borderColor: theme.colors.medium,
          }}
        >
          <TextInput
            style={styles.TextInput}
            placeholder={props.inputLabel}
            placeholderTextColor={theme.colors.light}
            keyboardType="number-pad"
            keyboardAppearance="dark"
            returnKeyType="done"
            defaultValue={props.defaultValue?.toString() || undefined}
            enablesReturnKeyAutomatically={true}
            onChangeText={(inputValue) => {
              setSelectedNum(parseInt(inputValue));
              checkDataValidity(parseInt(inputValue));
            }}
            onSubmitEditing={(event) => {
              if (screenState !== States.Valid) {
                setSelectedNum(parseInt(event.nativeEvent.text));
              } else {
                setSelectedNum(parseInt(event.nativeEvent.text));
                props.onQuestionSubmit(parseInt(event.nativeEvent.text));
              }
            }}
          />
        </Container>
      </Container>
      <BottomNavButtons
        theme={theme}
        bottomBackButton={props.bottomBackButton}
        onPress={() => {
          props.onQuestionSubmit(selectedNum);
        }}
        disabled={
          screenState === States.Empty || screenState === States.Invalid
        }
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  View_ContentContainer: {
    flex: 6,
    justifyContent: 'center',
  },
  View_HeaderContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: scale(16),
  },
  View_InputContainer: {
    marginTop: scale(60),
    marginBottom: scale(27),
    width: '50%',
    alignSelf: 'center',
    borderBottomWidth: 1.5,
  },
  // eslint-disable-next-line react-native/no-color-literals
  TextInput: {
    color: '#ffffff',
    fontSize: scale(17),
    paddingBottom: scale(9),
  },
  Text_Question: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  Text_QuestionLabel: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  Text_QuestionSubtitle: {
    fontWeight: 'normal',
    opacity: 0.7,
  },
});

export default withTheme(NumInputScreen);
