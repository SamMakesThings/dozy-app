import React from 'react';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { DatePicker, ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
import { CardContainer } from '../components/CardContainer';
import NumInputScreen from '../components/screens/NumInputScreen';
import TextInputScreen from '../components/screens/TextInputScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import TagSelectScreen from '../components/screens/TagSelectScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import submitSleepDiaryData from '../utilities/submitSleepDiaryData';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../utilities/authContext';
import { Navigation, SleepLog } from '../types/custom';

export const DiaryStatsScreen = () => {
  return (
    <ScreenContainer
      style={{ backgroundColor: '#232B3F' }}
      hasSafeArea={true}
      scrollable={true}
    >
      <Container elevation={0} useThemeGutterPadding={true}>
        <CardContainer style={styles.CardContainer}>
          <Text>Streak</Text>
        </CardContainer>
        <CardContainer style={styles.CardContainer}>
          <Text>Sleep duration (hours)</Text>
        </CardContainer>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    marginTop: scale(25)
  }
});
