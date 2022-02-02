import React, { useMemo, useCallback, ComponentProps } from 'react';
import {
  View,
  Text,
  FlatList,
  FlatListProps,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';
import { RGB2RGBA } from '../utilities/common';
import { LogState } from '../utilities/diaryEntryFlow.service';

export interface SleepLogSummaryCardProps
  extends Partial<FlatListProps<SummaryItem>> {
  sleepLog?: LogState;
}

interface SummaryItem {
  icon: ComponentProps<typeof Ionicons>['name'];
  name: string;
  value: string;
}

const textColor = '#dbedf3';

const SleepLogSummaryCard: React.FC<SleepLogSummaryCardProps> = ({
  sleepLog,
  style,
  ...props
}) => {
  const data = useMemo(
    (): SummaryItem[] => [
      {
        icon: 'ios-bed',
        name: 'Bedtime',
        value: sleepLog ? moment(sleepLog.bedTime).format('hh:mm A') : '???',
      },
      {
        icon: 'ios-cloudy-night',
        name: 'Mins to fall asleep',
        value: sleepLog
          ? moment(sleepLog.fallAsleepTime).format('hh:mm A')
          : '???',
      },
      {
        icon: 'ios-eye',
        name: 'How many wakes',
        value: sleepLog ? sleepLog.wakeCount?.toString() : '???',
      },
      {
        icon: 'ios-bonfire',
        name: 'Mins awake',
        value: sleepLog ? sleepLog.minsAwakeInBedTotal?.toString() : '???',
      },
      {
        icon: 'ios-alarm',
        name: 'Wake time',
        value: sleepLog ? moment(sleepLog.wakeTime).format('hh:mm A') : '???',
      },
    ],
    [sleepLog],
  );

  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<SummaryItem>) => (
      <View style={styles.itemContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={item.icon} size={scale(24)} color={textColor} />
        </View>
        <View style={[styles.itemRight, index === 0 && styles.noBorder]}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      </View>
    ),
    [],
  );

  return (
    <View>
      <FlatList
        {...props}
        style={[styles.container, style]}
        contentContainerStyle={styles.contentContainer}
        data={data}
        bounces={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: dozy_theme.colors.medium,
    borderRadius: scale(10),
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: scale(13),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  noBorder: {
    borderTopWidth: 0,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RGB2RGBA(textColor, 0.12),
    width: scale(48),
    height: scale(48),
    borderRadius: scale(48) / 2,
  },
  itemRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: scale(60),
    marginLeft: scale(14),
    paddingRight: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: dozy_theme.colors.light,
  },
  name: {
    flex: 1,
    color: textColor,
    fontSize: scale(16),
  },
  value: {
    color: dozy_theme.colors.light,
    fontSize: scale(16),
  },
});

export default SleepLogSummaryCard;
