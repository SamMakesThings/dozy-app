import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
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
import { Navigation, SleepLog } from '../types/custom';

// Define default chart styles
const chartStyles = {
  chart: {
    width: scale(335),
    height: scale(220),
    domainPadding: { x: 3, y: 35 }
  },
  axis: {
    tickLabels: {
      angle: -45,
      fontSize: scale(11),
      fill: dozy_theme.colors.light
    },
    grid: {
      stroke: dozy_theme.colors.medium
    }
  },
  line: {
    data: {
      stroke: dozy_theme.colors.primary,
      strokeWidth: scale(4),
      strokeLinejoin: 'round'
    }
  },
  scatter: {
    data: {
      fill: dozy_theme.colors.primary
    }
  }
};

export const DiaryStatsScreen = () => {
  const { state } = React.useContext(AuthContext);
  let allSleepLogs: Array<SleepLog> = state.sleepLogs;

  // Trim sleepLogs to only show most recent 10
  let selectedSleepLogs = allSleepLogs.filter(
    (s) =>
      s.bedTime.toDate().getMonth() === state.selectedDate.month &&
      s.bedTime.toDate().getFullYear() === state.selectedDate.year
  );
  console.log(selectedSleepLogs);

  return (
    <ScreenContainer
      style={{ backgroundColor: '#232B3F' }}
      hasSafeArea={true}
      scrollable={true}
    >
      <Container
        elevation={0}
        useThemeGutterPadding={true}
        style={styles.Container_Screen}
      >
        <CardContainer style={styles.CardContainer}>
          <Text
            style={{
              ...dozy_theme.typography.headline5,
              ...styles.Text_CardTitle
            }}
          >
            Sleep log streak: 20
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
            >
              <VictoryAxis
                dependentAxis
                tickFormat={(tick) => tick * 100 + '%'}
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
      </Container>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    marginTop: scale(5),
    padding: scale(20)
  },
  Container_Screen: {
    marginTop: scale(25)
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  }
});
