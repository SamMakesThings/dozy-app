import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  DatePicker
} from '@draftbit/ui';
import BottomNavButtons from './BottomNavButtons';

// A unified date, time, and datetime picker screen. Has a label and input.
const DateTimePickerScreen = (props) => {
  const [selectedTime, setSelectedTime] = React.useState(
    props.defaultValue ? props.defaultValue : new Date()
  );

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
        </View>
        {props.mode === 'datetime' && Platform.OS === 'android' ? (
          <View style={styles.View_DateTimeAndroidContainer}>
            <DatePicker
              style={styles.DatePickerHalf}
              mode="date"
              type="underline"
              error={false}
              label="Date"
              disabled={false}
              leftIconMode="inset"
              format="dddd, mmmm dS"
              date={selectedTime}
              onDateChange={(selectedTime) => setSelectedTime(selectedTime)}
            />
            <DatePicker
              style={styles.DatePickerHalf}
              mode="time"
              type="underline"
              error={false}
              label="Time"
              disabled={false}
              leftIconMode="inset"
              format="h:MM TT"
              date={selectedTime}
              onDateChange={(selectedTime) => setSelectedTime(selectedTime)}
            />
          </View>
        ) : (
          <DatePicker
            style={styles.DatePicker}
            mode={props.mode}
            type="underline"
            error={false}
            label={props.inputLabel}
            disabled={false}
            leftIconMode="inset"
            format={
              props.mode === 'datetime' ? 'dddd, mmmm dS, h:MM TT' : 'h:MM TT'
            }
            date={selectedTime}
            onDateChange={(selectedTime) => setSelectedTime(selectedTime)}
          />
        )}
      </Container>
      <BottomNavButtons
        theme={theme}
        onPress={(value) => {
          if (value && value == props.bottomGreyButtonLabel) {
            props.onQuestionSubmit(false);
          } else {
            props.onQuestionSubmit(selectedTime);
          }
        }}
        bottomBackButton={
          props.bottomBackButton ? props.bottomBackButton : null
        }
        bottomGreyButtonLabel={props.bottomGreyButtonLabel}
        buttonLabel={props.buttonLabel}
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
  }
});

export default withTheme(DateTimePickerScreen);
