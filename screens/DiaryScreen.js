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
  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_nd}
    >
      <Tab.Navigator>
        <Tab.Screen name="Entries" component={DiaryEntriesScreen} />
        <Tab.Screen name="Stats" component={TreatmentPlaceholderScreen} />
      </Tab.Navigator>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  Container_nf: {
    minWidth: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 15
  },
  Container_ni: {
    minWidth: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: 15
  },
  Container_ns: {
    alignItems: 'flex-start'
  },
  Container_nw: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row'
  },
  Container_nz: {
    alignItems: 'center',
    marginTop: 20
  },
  DatePicker_nl: {
    minWidth: 100,
    paddingLeft: 0,
    marginLeft: 0
  },
  Root_nd: {
    justifyContent: 'space-around',
    backgroundColor: dozy_theme.colors.background
  },
  Text_n1: {
    textAlign: 'center',
    width: '100%'
  },
  Text_nl: {
    textAlign: 'center',
    width: '100%'
  },
  Text_nc: {
    textAlign: 'center',
    width: '100%'
  },
  Touchable_n0: {
    paddingBottom: 15
  },
  Icon_nf: {}
});

export default withTheme(DiaryScreen);
