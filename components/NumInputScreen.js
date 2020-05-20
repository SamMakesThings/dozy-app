import React from 'react';
import { StyleSheet, Text, TextInput } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  ProgressBar
} from '@draftbit/ui';
import BottomNavButtons from './BottomNavButtons';

const NumInputScreen = (props) => {
  const [selectedNum, setSelectedNum] = React.useState(-1);

  const { theme } = props;
  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_n3a}
    >
      <Container
        style={styles.View_HeaderContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <Container
          style={styles.View_ProgressBarContainer}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={{
              ...styles.ProgressBar_neb,
              ...{ display: props.progressBarPercent ? 'flex' : 'none' }
            }}
            color={theme.colors.primary}
            progress={props.progressBarPercent}
            borderWidth={0}
            borderRadius={10}
            animationType="spring"
            unfilledColor={theme.colors.medium}
          />
        </Container>
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
            keyboardType="number-pad"
            keyboardAppearance="dark"
            returnKeyType="done"
            enablesReturnKeyAutomatically={true}
            onChangeText={(inputValue) => setSelectedNum(inputValue)}
            onSubmitEditing={(event) => {
              props.onQuestionSubmit(event.nativeEvent.text);
            }}
          />
        </Container>
      </Container>
      <BottomNavButtons
        theme={theme}
        bottomBackButton={
          props.bottomBackButton ? props.bottomBackButton : null
        }
        onPress={() => {
          props.onQuestionSubmit(selectedNum);
        }}
        disabled={(!props.optional && selectedNum < 0) || selectedNum === ''}
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
    marginTop: 20
  },
  View_InputContainer: {
    marginTop: 65,
    marginBottom: 30,
    width: '50%',
    alignSelf: 'center',
    borderBottomWidth: 1.5
  },
  TextInput: {
    color: '#ffffff',
    fontSize: 21,
    paddingBottom: 12
  },
  Text_Question: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(NumInputScreen);
