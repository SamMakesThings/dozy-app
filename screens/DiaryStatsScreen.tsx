import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis,
  VictoryScatter
} from 'victory-native';
import { CardContainer } from '../components/CardContainer';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../utilities/authContext';
import { SleepLog } from '../types/custom';
import { chartStyles } from '../constants/diaryChartStyles';

// Return true if date2 is the day before date1 (or same day)
function isPreviousDay(date1: Date, date2: Date) {
  const [date1day, date1month, date2day, date2month] = [
    date1.getDate(),
    date1.getMonth(),
    date2.getDate(),
    date2.getMonth()
  ];
  return (
    (Math.abs(date1day - date2day) <= 1 && // True if same month and day is 1 or 0 away
      Math.abs(date1month - date2month) === 0) ||
    (date1month !== date2month && // OR true if different month and date1's day is 1
      date1day === 1)
  );
}

export const DiaryStatsScreen = () => {
  const { state } = React.useContext(AuthContext);
  let allSleepLogs: Array<SleepLog> = state.sleepLogs;

  // Calculate the current diary streak length
  let streakLength = 0;
  while (true) {
    // Check that most recent log is yesterday or today. If not, break here at streak 0
    if (
      !allSleepLogs.length ||
      !isPreviousDay(new Date(), allSleepLogs[0].upTime.toDate())
    ) {
      break;
    }

    // Increment streak to start, since zero indexed
    streakLength++;

    // Check if current log day is the day after previous log day. If not, break
    if (
      allSleepLogs.length === 1 ||
      !isPreviousDay(
        allSleepLogs[streakLength].upTime.toDate(),
        allSleepLogs[streakLength + 1].upTime.toDate()
      )
    ) {
      break;
    }
  }

  // Filter sleepLogs to only show selected month
  let selectedSleepLogs = allSleepLogs.filter(
    (s) =>
      s.upTime.toDate().getMonth() === state.selectedDate.month &&
      s.upTime.toDate().getFullYear() === state.selectedDate.year
  );

  return (
    <ScreenContainer
      style={{ backgroundColor: '#232B3F' }}
      hasSafeArea={true}
      scrollable={true}
    >
      {selectedSleepLogs.length < 2 && ( // Suggest user add sleep log if no data for selected month
        <Container
          elevation={0}
          useThemeGutterPadding={true}
          style={styles.Container_Screen}
        >
          <View
            style={{
              height: scale(150),
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}
          >
            <Entypo
              name={'arrow-with-circle-up'}
              size={scale(51)}
              color={dozy_theme.colors.medium}
              style={{ alignSelf: 'flex-start', marginLeft: scale(50) }}
            />
            <Text
              style={[
                dozy_theme.typography.smallLabel,
                {
                  color: dozy_theme.colors.medium,
                  textAlign: 'center',
                  width: '100%',
                  fontSize: scale(16),
                  marginTop: scale(17)
                }
              ]}
            >
              Not enough data for this month. Add sleep logs from the entries
              screen!
            </Text>
          </View>
        </Container>
      )}
      <Container
        elevation={0}
        useThemeGutterPadding={true}
        style={{
          ...styles.Container_Screen,
          opacity: selectedSleepLogs.length < 2 ? 0.3 : 1
        }}
      >
        <CardContainer style={styles.CardContainer}>
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle
            }}
          >
            Sleep log streak: {streakLength}{' '}
            {streakLength > 0 ? '\u270C' : '\u2b55'}
          </Text>
        </CardContainer>
        <CardContainer
          style={{ ...styles.CardContainer, paddingBottom: scale(5) }}
        >
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle
            }}
          >
            Sleep efficiency (%)
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginTop: scale(-25),
              marginLeft: scale(17)
            }}
          >
            <VictoryChart
              width={chartStyles.chart.width}
              height={chartStyles.chart.height}
              theme={VictoryTheme.material}
              scale={{ x: 'time' }}
              domainPadding={chartStyles.chart.domainPadding}
            >
              <VictoryAxis
                dependentAxis
                tickFormat={(tick) => tick.toFixed(3) * 100 + '%'}
                style={chartStyles.axis}
                tickCount={5}
              />
              <VictoryAxis
                style={chartStyles.axis}
                tickFormat={(tick) => {
                  return tick.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                }}
                tickCount={7}
              />
              <VictoryLine
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="sleepEfficiency"
                style={chartStyles.line}
                interpolation="monotoneX"
              />
              <VictoryScatter
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="sleepEfficiency"
                style={chartStyles.scatter}
                size={scale(5)}
              />
            </VictoryChart>
          </View>
        </CardContainer>
        <CardContainer
          style={{ ...styles.CardContainer, paddingBottom: scale(5) }}
        >
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle
            }}
          >
            Sleep duration (hours)
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginTop: scale(-25),
              marginLeft: scale(17)
            }}
          >
            <VictoryChart
              width={chartStyles.chart.width}
              height={chartStyles.chart.height}
              theme={VictoryTheme.material}
              scale={{ x: 'time' }}
              domainPadding={chartStyles.chart.domainPadding}
              domain={{
                y: [
                  0,
                  !selectedSleepLogs.length
                    ? 300
                    : Math.max.apply(
                        Math,
                        selectedSleepLogs.map(function (o) {
                          return o.sleepDuration;
                        })
                      )
                ]
              }}
            >
              <VictoryAxis
                dependentAxis
                style={chartStyles.axis}
                tickFormat={(tick) => tick.toFixed(0)}
                tickCount={5}
              />
              <VictoryAxis
                style={chartStyles.axis}
                tickFormat={(tick) => {
                  return tick.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                }}
                tickCount={7}
              />
              <VictoryLine
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="sleepDuration"
                style={chartStyles.line}
                interpolation="monotoneX"
              />
              <VictoryScatter
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="sleepDuration"
                style={chartStyles.scatter}
                size={scale(5)}
              />
            </VictoryChart>
          </View>
        </CardContainer>
        <CardContainer
          style={{ ...styles.CardContainer, paddingBottom: scale(5) }}
        >
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle
            }}
          >
            Sleep onset (minutes)
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginTop: scale(-25),
              marginLeft: scale(17)
            }}
          >
            <VictoryChart
              width={chartStyles.chart.width}
              height={chartStyles.chart.height}
              theme={VictoryTheme.material}
              scale={{ x: 'time' }}
              domainPadding={chartStyles.chart.domainPadding}
              domain={{
                y: [
                  0,
                  !selectedSleepLogs.length
                    ? 100
                    : Math.max.apply(
                        Math,
                        selectedSleepLogs.map(function (o) {
                          return o.minsToFallAsleep;
                        })
                      )
                ]
              }}
            >
              <VictoryAxis
                dependentAxis
                style={chartStyles.axis}
                tickCount={5}
                tickFormat={(t) => t.toFixed(0)}
              />
              <VictoryAxis
                style={chartStyles.axis}
                tickFormat={(tick) => {
                  return tick.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                }}
                tickCount={7}
              />
              <VictoryLine
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="minsToFallAsleep"
                style={chartStyles.line}
                interpolation="monotoneX"
              />
              <VictoryScatter
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="minsToFallAsleep"
                style={chartStyles.scatter}
                size={scale(5)}
              />
            </VictoryChart>
          </View>
        </CardContainer>
        <CardContainer
          style={{ ...styles.CardContainer, paddingBottom: scale(5) }}
        >
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle
            }}
          >
            Mins awake after 1st sleep
          </Text>
          <View
            style={{
              alignItems: 'center',
              marginTop: scale(-25),
              marginLeft: scale(17)
            }}
          >
            <VictoryChart
              width={chartStyles.chart.width}
              height={chartStyles.chart.height}
              theme={VictoryTheme.material}
              scale={{ x: 'time' }}
              domainPadding={chartStyles.chart.domainPadding}
              domain={{
                y: [
                  0,
                  !selectedSleepLogs.length
                    ? 60
                    : Math.max.apply(
                        Math,
                        selectedSleepLogs.map(function (o) {
                          return o.nightMinsAwake;
                        })
                      )
                ]
              }}
            >
              <VictoryAxis
                dependentAxis
                style={chartStyles.axis}
                tickCount={5}
              />
              <VictoryAxis
                style={chartStyles.axis}
                tickFormat={(tick) => {
                  return tick.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  });
                }}
                tickCount={7}
              />
              <VictoryLine
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="nightMinsAwake"
                style={chartStyles.line}
                interpolation="monotoneX"
              />
              <VictoryScatter
                data={selectedSleepLogs}
                x={(d) => d.upTime.toDate()}
                y="nightMinsAwake"
                style={chartStyles.scatter}
                size={scale(5)}
              />
            </VictoryChart>
          </View>
        </CardContainer>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    padding: scale(20)
  },
  Container_Screen: {
    marginTop: scale(25)
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  }
});
