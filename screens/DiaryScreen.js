import React from 'react';
import { StyleSheet } from 'react-native';
import { withTheme, ScreenContainer } from '@draftbit/ui';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import DiaryEntriesScreen from './DiaryEntriesScreen';
import TreatmentPlaceholderScreen from './TreatmentPlaceholderScreen';
import { dozy_theme } from '../config/Themes';

// Create tab nav for switching between entries and stats
const Tab = createMaterialTopTabNavigator();

function DiaryScreen() {
  const theme = dozy_theme;

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_nd}
    >
      <Tab.Navigator
        tabBarOptions={{
          activeTintColor: theme.colors.secondary,
          style: {
            backgroundColor: theme.colors.medium
          },
          indicatorStyle: {
            backgroundColor: theme.colors.secondary
          }
        }}
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Tab.Screen name="Entries" component={DiaryEntriesScreen} />
        <Tab.Screen name="Stats" component={TreatmentPlaceholderScreen} />
      </Tab.Navigator>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  Container_nf: {}
});

export default withTheme(DiaryScreen);
