import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { withTheme } from '@draftbit/ui';
import { Entypo } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DiaryEntriesScreen from './DiaryEntriesScreen';
import { DiaryStatsScreen } from './DiaryStatsScreen';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../context/AuthContext';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';

// Create tab nav for switching between entries and stats
const Tab = createMaterialTopTabNavigator();

function DiaryScreen() {
  const theme = dozy_theme;
  const { dispatch, state } = React.useContext(AuthContext);

  // Set date value from selected month
  const selectedDate = new Date();
  selectedDate.setMonth(state.selectedDate.month, 15);
  selectedDate.setFullYear(state.selectedDate.year);

  const currentMonthString = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <SafeAreaView style={styles.ScreenContainer} edges={['top']}>
      <FocusAwareStatusBar backgroundColor={dozy_theme.colors.medium} />
      <View style={styles.View_MonthSelectContainer}>
        <TouchableOpacity
          onPress={() =>
            dispatch({ type: 'CHANGE_SELECTED_MONTH', changeMonthBy: -1 })
          }
        >
          <Entypo
            name="chevron-left"
            size={scale(24)}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
        <Text
          style={{ ...theme.typography.headline5, ...styles.Text_MonthSelect }}
          allowFontScaling={true}
        >
          {currentMonthString}
        </Text>
        <TouchableOpacity
          onPress={() =>
            dispatch({ type: 'CHANGE_SELECTED_MONTH', changeMonthBy: 1 })
          }
        >
          <Entypo
            name="chevron-right"
            size={scale(24)}
            color={theme.colors.secondary}
          />
        </TouchableOpacity>
      </View>
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: theme.colors.secondary,
          style: {
            backgroundColor: theme.colors.medium,
          },
          indicatorStyle: {
            backgroundColor: theme.colors.secondary,
          },
          labelStyle: {
            fontSize: scale(13),
          },
          tabStyle: {
            paddingBottom: scale(12),
            paddingTop: scale(10),
          },
        }}
        lazy
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Tab.Screen name="Entries" component={DiaryEntriesScreen} />
        <Tab.Screen name="Stats" component={DiaryStatsScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  View_MonthSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: scale(17),
    paddingTop: scale(
      Platform.select({
        ios: dozy_theme.spacing.small,
        android: dozy_theme.spacing.medium,
      }),
    ),
    paddingBottom: scale(5),
  },
  ScreenContainer: {
    flex: 1,
    backgroundColor: dozy_theme.colors.medium,
  },
  Text_MonthSelect: {
    color: dozy_theme.colors.secondary,
  },
});

export default withTheme(DiaryScreen);
