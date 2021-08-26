import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { withTheme, ScreenContainer } from '@draftbit/ui';
import { Entypo } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DiaryEntriesScreen from './DiaryEntriesScreen';
import { DiaryStatsScreen } from './DiaryStatsScreen';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import { getLogStreakLength } from '../utilities/getLogStreakLength';

// Create tab nav for switching between entries and stats
const Tab = createMaterialTopTabNavigator();

function DiaryScreen() {
  const theme = dozy_theme;
  const { dispatch, state } = React.useContext(AuthContext);
  const allSleepLogs = state.sleepLogs;
  const [streakLength, setStreakLength] = React.useState(0);

  const route = useRoute();

  // console.log('current route index:', route.state.index)

  // Set date value from selected month
  const selectedDate = new Date();
  selectedDate.setMonth(state.selectedDate.month, 15);
  selectedDate.setFullYear(state.selectedDate.year);

  const currentMonthString = selectedDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  React.useEffect(() => {
    const streakLengthValue = getLogStreakLength(allSleepLogs);
    setStreakLength(streakLengthValue);
  }, [route]);
  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.ScreenContainer}
    >
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
            backgroundColor: theme.colors.medium
          },
          indicatorStyle: {
            backgroundColor: theme.colors.secondary
          },
          labelStyle: {
            fontSize: scale(13)
          },
          tabStyle: {
            paddingBottom: scale(12),
            paddingTop: scale(10)
          }
        }}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Tab.Screen name="Entries" component={DiaryEntriesScreen} />
        <Tab.Screen name="Stats">
          {() => <DiaryStatsScreen streakLength={streakLength} />}
        </Tab.Screen>
      </Tab.Navigator>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  View_MonthSelectContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: scale(17),
    paddingTop: scale(24),
    paddingBottom: scale(5)
  },
  ScreenContainer: {
    backgroundColor: dozy_theme.colors.medium
  },
  Text_MonthSelect: {
    color: dozy_theme.colors.secondary
  },
  Touchable_Chevron: {
    padding: scale(5)
  }
});

export default withTheme(DiaryScreen);
