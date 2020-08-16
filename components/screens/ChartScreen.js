import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis,
  VictoryLabel
} from 'victory-native';
import { scale } from 'react-native-size-matters';
import BottomNavButtons from '../BottomNavButtons';

// Screen with a chart - mostly for sleep analysis
const ChartScreen = (props) => {
  const { theme, sleepLogs } = props;

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.RootContainer}
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
        <View style={{ flex: 1 }} />
        <View style={styles.View_ImageContainer}>
          <VictoryChart
            width={props.chartWidth ? props.chartWidth : scale(300)}
            height={props.chartHeight ? props.chartHeight : scale(300)}
            theme={VictoryTheme.material}
            style={{
              labels: {
                fontSize: 30,
                fill: theme.colors.primary
              }
            }}
            scale={{ x: 'time' }}
          >
            <VictoryAxis
              dependentAxis
              tickFormat={(tick) => tick * 100 + '%'}
              style={{
                tickLabels: {
                  angle: -45,
                  fontSize: scale(11)
                },
                grid: {
                  stroke: theme.colors.medium
                }
              }}
              tickCount={5}
            />
            <VictoryAxis
              style={{
                tickLabels: {
                  angle: -45,
                  fontSize: scale(11)
                },
                grid: {
                  stroke: theme.colors.medium
                }
              }}
              tickFormat={(tick) => {
                return tick.toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
              tickCount={7}
            />
            <VictoryLine
              data={sleepLogs}
              x={(d) => d.upTime.toDate()}
              y="sleepEfficiency"
              style={{
                data: {
                  stroke: theme.colors.primary,
                  strokeWidth: scale(4),
                  strokeLinejoin: 'round'
                }
              }}
              interpolation="monotoneX"
            />
          </VictoryChart>
        </View>
        <Text
          style={[
            styles.Text_Explainer,
            theme.typography.body1,
            {
              color: theme.colors.secondary,
              flex: props.longText ? null : 3,
              marginBottom: 10
            }
          ]}
        >
          {props.textLabel}
        </Text>
      </Container>
      <BottomNavButtons
        onPress={props.onQuestionSubmit}
        buttonLabel={props.buttonLabel}
        bottomGreyButtonLabel={props.bottomGreyButtonLabel}
        bottomBackButton={props.bottomBackButton}
        bbbDisabled={props.bbbDisabled}
        onlyBackButton={props.onlyBackButton}
        theme={theme}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  View_ImageContainer: {
    flex: 5,
    justifyContent: 'center'
  },
  View_ContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  View_BarContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  Nav_BackButton: {
    paddingRight: 0
  },
  Text_Explainer: {
    textAlign: 'left',
    width: '90%',
    alignItems: 'flex-start',
    alignSelf: 'center'
  }
});

export default withTheme(ChartScreen);
