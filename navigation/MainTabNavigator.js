import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import PropTypes from 'prop-types';

import TabBarIcon from '../components/TabBarIcon';
import DiaryScreen from '../screens/DiaryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Treatment from '../screens/TreatmentScreen';

/*
const HomeStack = createStackNavigator({
  Home: DiaryScreen,
},
{
  headerMode: 'screen',
  cardStyle: { backgroundColor: '#222222' },
}); */

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#ffffff',
        inactiveTintColor: '#7FC0C4',
        style: {
          backgroundColor: '#00818A',
          borderTopWidth: 0
        }
      }}
    >
      {/* Sleep diary entries screen */}
      <Tab.Screen
        name="Sleep"
        component={DiaryScreen}
        options={{
          tabBarLabel: 'Sleep',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name={Platform.OS === 'ios' ? 'ios-journal' : 'md-journal'}
            />
          )
        }}
      />

      {/* Main treatment info & check-in screen */}
      <Tab.Screen
        name="Home"
        component={Treatment}
        options={{
          tabBarLabel: 'Home',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name={Platform.OS === 'ios' ? 'ios-medical' : 'md-medical'}
            />
          )
        }}
      />

      {/* Support & FAQ screen */}
      <Tab.Screen
        name="Support"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Support',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name={Platform.OS === 'ios' ? 'ios-text' : 'md-text'}
            />
          )
        }}
      />
    </Tab.Navigator>
  );
}

BottomTabs.propTypes = {
  color: PropTypes.string,
  focused: PropTypes.bool
};
