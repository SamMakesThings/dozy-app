import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { CardContainer } from '../components/CardContainer';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../context/AuthContext';
import { SleepLog } from '../types/custom';
import { getLogStreakLength } from '../utilities/getLogStreakLength';
import { LogStatsLineGraph } from '../components/LogStatsLineGraphComponent';

export const DiaryStatsScreen: React.FC = () => {
  const { state } = React.useContext(AuthContext);
  const allSleepLogs: Array<SleepLog> = state.sleepLogs;

  // Calculate the current diary streak length
  const streakLength = getLogStreakLength(allSleepLogs);

  // Filter sleepLogs to only show selected month
  const selectedSleepLogs = allSleepLogs.filter(
    (s) =>
      s.upTime.toDate().getMonth() === state.selectedDate.month &&
      s.upTime.toDate().getFullYear() === state.selectedDate.year,
  );

  return (
    <ScreenContainer
      style={styles.container}
      hasSafeArea={true}
      scrollable={true}
    >
      {selectedSleepLogs.length < 2 && ( // Suggest user add sleep log if no data for selected month
        <Container
          elevation={0}
          useThemeGutterPadding={true}
          style={styles.Container_Screen}
        >
          <View style={styles.View_WarningContainer}>
            <Entypo
              name={'arrow-with-circle-up'}
              size={scale(51)}
              color={dozy_theme.colors.medium}
              style={styles.arrowIcon}
            />
            <Text
              style={[dozy_theme.typography.smallLabel, styles.Text_Warning]}
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
        style={[
          styles.Container_Screen,
          selectedSleepLogs.length < 2 && styles.contentInactive,
        ]}
      >
        <CardContainer style={styles.CardContainer}>
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle,
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
              ...styles.Text_CardTitle,
            }}
          >
            Sleep efficiency (%)
          </Text>
          <View style={styles.logStatsLineGraph}>
            <LogStatsLineGraph
              sleepLogs={selectedSleepLogs}
              yAxis="sleepEfficiency"
              yTickFormat={(tick: any) => tick.toFixed(3) * 100 + '%'}
            />
          </View>
        </CardContainer>
        <CardContainer
          style={{ ...styles.CardContainer, paddingBottom: scale(5) }}
        >
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle,
            }}
          >
            Sleep duration (hours)
          </Text>
          <View style={styles.logStatsLineGraph}>
            <LogStatsLineGraph
              sleepLogs={selectedSleepLogs}
              yAxis="sleepDuration"
              yTickFormat={(tick) => tick.toFixed(0)}
              domain={{
                y: [
                  0,
                  !selectedSleepLogs.length
                    ? 300
                    : Math.max.apply(
                        Math,
                        selectedSleepLogs.map(function (o) {
                          return o.sleepDuration;
                        }),
                      ),
                ],
              }}
            />
          </View>
        </CardContainer>
        <CardContainer
          style={{ ...styles.CardContainer, paddingBottom: scale(5) }}
        >
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle,
            }}
          >
            Sleep onset (minutes)
          </Text>
          <View style={styles.logStatsLineGraph}>
            <LogStatsLineGraph
              sleepLogs={selectedSleepLogs}
              yAxis="minsToFallAsleep"
              yTickFormat={(tick) => tick.toFixed(0)}
              domain={{
                y: [
                  0,
                  !selectedSleepLogs.length
                    ? 100
                    : Math.max.apply(
                        Math,
                        selectedSleepLogs.map(function (o) {
                          return o.minsToFallAsleep;
                        }),
                      ),
                ],
              }}
            />
          </View>
        </CardContainer>
        <CardContainer
          style={{ ...styles.CardContainer, paddingBottom: scale(5) }}
        >
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle,
            }}
          >
            Mins awake after 1st sleep
          </Text>
          <View style={styles.logStatsLineGraph}>
            <LogStatsLineGraph
              sleepLogs={selectedSleepLogs}
              yAxis="nightMinsAwake"
              yTickFormat={(tick) => tick.toFixed(0)}
              domain={{
                y: [
                  0,
                  !selectedSleepLogs.length
                    ? 60
                    : Math.max.apply(
                        Math,
                        selectedSleepLogs.map(function (o) {
                          return o.nightMinsAwake;
                        }),
                      ),
                ],
              }}
            />
          </View>
        </CardContainer>
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    padding: scale(20),
  },
  Container_Screen: {
    marginTop: scale(25),
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
  },
  View_WarningContainer: {
    height: scale(150),
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  Text_Warning: {
    color: dozy_theme.colors.medium,
    textAlign: 'center',
    width: '100%',
    fontSize: scale(16),
    marginTop: scale(17),
  },
  // eslint-disable-next-line react-native/no-color-literals
  container: { backgroundColor: '#232B3F' },
  arrowIcon: { alignSelf: 'flex-start', marginLeft: scale(50) },
  contentInactive: {
    opacity: 0.3,
  },
  logStatsLineGraph: {
    alignItems: 'center',
    marginTop: scale(-25),
    marginLeft: scale(17),
  },
});
