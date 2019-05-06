import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
// import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LoginScreen';
// import SettingsScreen from '../screens/MobXTest';
import DiaryScreen from '../screens/DiaryScreen';
import DiaryEntryScreen from '../screens/DiaryEntryScreen';

const HomeStack = createStackNavigator({
  Home: DiaryScreen,
},   
{
  headerMode: 'screen',
  cardStyle: { backgroundColor: '#222222' },
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Sleep',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-journal${focused ? '' : '-outline'}`
          : 'md-journal'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
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
  Settings: DiaryEntryScreen,
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
});
