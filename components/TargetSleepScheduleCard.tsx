import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { scale } from 'react-native-size-matters';
import { CardContainer } from './CardContainer';
import { dozy_theme } from '../config/Themes';
import CrescentMoon from '../assets/images/CrescentMoon.svg';
import TransRightArrow from '../assets/images/TransRightArrow.svg';
import YellowSun from '../assets/images/YellowSun.svg';

interface Props {
  styles?: ViewStyle;
  remainingDays: number;
  bedTime: string;
  wakeTime: string;
}

export const TargetSleepScheduleCard: React.FC<Props> = (props) => {
  const theme = dozy_theme;

  return (
    <CardContainer style={{ ...props.styles }}>
      <View style={styles.View_CardHeaderContainer}>
        <Text
          style={{
            ...theme.typography.cardTitle,
            ...styles.Text_CardTitle,
          }}
        >
          Target sleep schedule
        </Text>
        <Text
          style={{ ...theme.typography.body2, ...styles.Text_CardSubtitle }}
        >
          Maintain for{' '}
          {props.remainingDays
            ? 'another ' + props.remainingDays + ' days'
            : 'a week'}
        </Text>
      </View>
      <View style={styles.View_CardContentContainer}>
        <View style={styles.View_CenteredRowContainer}>
          <CrescentMoon width={scale(30)} height={scale(30)} />
          <View style={styles.View_TimeContainer}>
            <Text style={{ ...theme.typography.body1, ...styles.Text_Time }}>
              {props.bedTime}
            </Text>
            <Text
              style={{
                ...theme.typography.body1,
                ...styles.Text_TimeLabel,
              }}
            >
              bedtime
            </Text>
          </View>
          <TransRightArrow width={scale(25)} height={scale(15)} />
          <View style={styles.View_TimeContainer}>
            <Text style={{ ...theme.typography.body1, ...styles.Text_Time }}>
              {props.wakeTime}
            </Text>
            <Text
              style={{
                ...theme.typography.body1,
                ...styles.Text_TimeLabel,
              }}
            >
              wake time
            </Text>
          </View>
          <YellowSun width={scale(30)} height={scale(30)} />
        </View>
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  View_CardHeaderContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  View_CardContentContainer: {},
  View_CenteredRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(5),
  },
  View_TimeContainer: {
    marginTop: scale(8),
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5),
  },
  Text_Time: {
    textAlign: 'center',
    fontSize: scale(20),
    color: dozy_theme.colors.secondary,
  },
  Text_TimeLabel: {
    textAlign: 'center',
    fontSize: scale(12),
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-6),
  },
});

export default TargetSleepScheduleCard;
