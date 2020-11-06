import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  ProgressBar
} from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';

interface Props {
  questionLabel: string;
  questionSubtitle?: string;
  inputLabel: string;
  progressBarPercent?: number;
  onQuestionSubmit: Function;
  optional?: boolean;
  bottomBackButton?: Function;
  validInputChecker?: Function;
  theme: Theme;
}

// Define possible states w/a TypeScript enum
enum States {
  Empty = 0,
  Invalid = 1,
  Valid = 2
}

const TextInputScreen: React.FC<Props> = (props) => {
  const [textContent, setTextContent] = React.useState('');

  // Create state to manage possible screen states
  const [screenState, setScreenState] = React.useState(States.Empty);
  const [errorMsg, setErrorMsg] = React.useState('Error');

  // Function to update screen state when data changes
  function checkDataValidity(val: string) {
    // Use a passed-in function to validate input value.
    // If no function passed, all is valid
    // If valid, passed function should return true.
    // If invalid, function should return an error string to display.

    if (!val && !props.optional) {
      setScreenState(States.Empty);
    } else if (
      (props.validInputChecker && props.validInputChecker(val) === true) ||
      props.validInputChecker === undefined ||
      (!val && props.optional)
    ) {
      setScreenState(States.Valid);
    } else {
      setScreenState(States.Invalid);
      setErrorMsg(
        props.validInputChecker ? props.validInputChecker(val) : 'Error'
      );
    }
  }

  const { theme } = props;
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
            {screenState === States.Invalid ? errorMsg : props.questionSubtitle}
          </Text>
        )}
        <Container
          style={{
            ...styles.View_InputContainer,
            borderColor: theme.colors.medium
          }}
        >
          <TextInput
            style={styles.TextInput}
            placeholder={props.inputLabel}
            placeholderTextColor={theme.colors.light}
            keyboardType="default"
            keyboardAppearance="dark"
            returnKeyType="done"
            enablesReturnKeyAutomatically={true}
            onChangeText={(inputValue) => {
              setTextContent(inputValue);
              checkDataValidity(inputValue);
            }}
            onSubmitEditing={(event) => {
              if (screenState !== States.Valid) {
                setTextContent(event.nativeEvent.text);
              } else {
                setTextContent(event.nativeEvent.text);
                props.onQuestionSubmit(event.nativeEvent.text);
              }
            }}
          />
        </Container>
      </Container>
      <BottomNavButtons
        theme={theme}
        bottomBackButton={props.bottomBackButton || undefined}
        onPress={() => {
          props.onQuestionSubmit(textContent);
        }}
        disabled={screenState !== States.Valid}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  View_ContentContainer: {
    flex: 6,
    justifyContent: 'center'
  },
  View_HeaderContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: scale(16)
  },
  View_InputContainer: {
    marginTop: scale(60),
    marginBottom: scale(27),
    width: '60%',
    alignSelf: 'center',
    borderBottomWidth: 1.5
  },
  TextInput: {
    color: '#ffffff',
    fontSize: scale(17),
    paddingBottom: scale(9)
  },
  Text_Question: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
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

export default withTheme(TextInputScreen);
