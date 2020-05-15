import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import {
  withTheme,
  ScreenContainer,
  Container,
  IconButton,
  ProgressBar,
  DatePicker,
  Button
} from '@draftbit/ui';
import { useNavigation } from '@react-navigation/native';

// A unified date, time, and datetime picker screen. Has a label and input.
const DateTimePickerScreen = (props) => {
  const [selectedTime, setSelectedTime] = React.useState(
    props.defaultValue ? props.defaultValue : new Date()
  );

  const { theme } = props;
  const navigation = useNavigation();
  return (
    <ScreenContainer
      style={{ backgroundColor: theme.colors.background }}
      hasSafeArea={true}
      scrollable={false}
    >
      <Container
        style={styles.Container_nt5}
        elevation={0}
        useThemeGutterPadding={true}
      >
        <IconButton
          style={styles.IconButton_nei}
          icon="Ionicons/md-arrow-back"
          size={32}
          color={theme.colors.secondary}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <Container
          style={styles.Container_ngt}
          elevation={0}
          useThemeGutterPadding={true}
        >
          <ProgressBar
            style={{
              ...styles.ProgressBar_nv3,
              ...{ display: props.progressBar ? 'flex' : 'none' }
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
            format="dddd, mmmm dS, h:MM TT"
            date={selectedTime}
            onDateChange={(selectedTime) => setSelectedTime(selectedTime)}
          />
        )}
      </Container>
      <Container elevation={0} useThemeGutterPadding={true}>
        <Button
          style={styles.Button_Next}
          type="solid"
          onPress={() => {
            props.onQuestionSubmit(selectedTime);
          }}
          disabled={false}
          color={theme.colors.primary}
        >
          Next
        </Button>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  DatePicker: {
    flex: 2
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
  Button_Next: {
    paddingTop: 0,
    marginTop: 8,
    marginBottom: 15
  },
  Container_n1m: {
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  View_ContentContainer: {
    flex: 1,
    justifyContent: 'space-around',
    marginTop: 20
  },
  Container_ngt: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Container_nno: {},
  Container_nt5: {
    width: '100%',
    height: '10%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 20
  },
  IconButton_nei: {
    paddingRight: 0
  },
  ProgressBar_nv3: {
    width: 250,
    height: 7,
    paddingRight: 0,
    marginRight: 0
  },
  TextField_n6f: {
    minWidth: '40%',
    maxWidth: '46%'
  },
  TextField_nrw: {
    minWidth: '40%',
    maxWidth: '46%'
  },
  Text_QuestionLabel: {
    textAlign: 'center',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center'
  },
  Text_nct: {
    textAlign: 'center',
    alignSelf: 'flex-end'
  }
});

export default withTheme(DateTimePickerScreen);
