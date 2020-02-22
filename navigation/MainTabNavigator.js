import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import TabBarIcon from '../components/TabBarIcon';
import DiaryScreen from '../screens/DiaryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import TreatmentPlaceholderScreen from '../screens/TreatmentPlaceholderScreen';

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
    <Tab.Navigator tabBarOptions={{
      activeTintColor: '#ffffff',
      inactiveTintColor: '#7FC0C4',
      style: {
        backgroundColor: '#00818A',
      },
    }}>
      {/* Main treatment info & check-in screen */}
      <Tab.Screen
        name="Sleep"
        component={DiaryScreen}
        options={{
          tabBarLabel: 'Sleep',
          // eslint-disable-next-line react/display-name
          tabBarIcon: (focused) => (
            <TabBarIcon
              focused={focused}
              name={Platform.OS === 'ios' ? 'ios-journal' : 'md-journal'} />
          ),
        }} />

      {/* Main treatment info & check-in screen */}
      <Tab.Screen
        name="Home"
        component={TreatmentPlaceholderScreen}
        options={{
          tabBarLabel: 'Home',
          // eslint-disable-next-line react/display-name
          tabBarIcon: (focused) => (
            <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-medical' : 'md-medical'} />
          ),
        }} />

      {/* Support & FAQ screen */}
      <Tab.Screen
        name="Support"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Support',
          // eslint-disable-next-line react/display-name
          tabBarIcon: (focused) => (
            <TabBarIcon
            focused={focused}
            name={Platform.OS === 'ios' ? 'ios-text' : 'md-text'} />
          ),
        }} />
    </Tab.Navigator>
  );
}

/*

HomeStack.navigationOptions = {
  tabBarLabel: 'Sleep',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-journal`
          : 'md-journal'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: TreatmentPlaceholderScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-medical' : 'md-medical'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Support',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-text' : 'md-text'}
    />
  ),
};
*/

/*
export default createBottomTabNavigator({
  HomeStack,
  LinksStack,
  SettingsStack,
}, {
  tabBarOptions: {
    activeTintColor: '#ffffff',
    inactiveTintColor: '#7FC0C4',
    style: {
      backgroundColor: '#00818A',
    },
  }
}); */
