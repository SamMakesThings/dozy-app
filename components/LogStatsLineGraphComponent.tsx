import React from 'react';
import { scale } from 'react-native-size-matters';
import {
  VictoryChart,
  VictoryTheme,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
} from 'victory-native';
import { DomainPropType } from 'victory-core';
import { SleepLog } from '../types/custom';
import { chartStyles } from '../constants/diaryChartStyles';

export const LogStatsLineGraph: React.FC<{
  sleepLogs: SleepLog[];
  yAxis: string;
  yTickFormat: (tick: any, index: number, ticks: any[]) => string | number;
  domain?: DomainPropType;
}> = ({ sleepLogs, yAxis, yTickFormat, domain }) => (
  <VictoryChart
    width={chartStyles.chart.width}
    height={chartStyles.chart.height}
    theme={VictoryTheme.material}
    scale={{ x: 'time' }}
    domainPadding={chartStyles.chart.domainPadding}
    domain={domain}
  >
    <VictoryAxis
      dependentAxis
      tickFormat={yTickFormat}
      style={chartStyles.axis}
      tickCount={5}
    />
    <VictoryAxis
      style={chartStyles.axis}
      tickFormat={(tick) => {
        return tick.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }}
      tickCount={7}
    />
    <VictoryLine
      data={sleepLogs}
      x={(d) => d.upTime.toDate()}
      y={yAxis}
      style={chartStyles.line}
      interpolation="monotoneX"
    />
    <VictoryScatter
      data={sleepLogs}
      x={(d) => d.upTime.toDate()}
      y={yAxis}
      style={chartStyles.scatter}
      size={scale(5)}
    />
  </VictoryChart>
);
