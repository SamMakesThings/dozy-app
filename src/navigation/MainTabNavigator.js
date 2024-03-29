import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import TabBarIcon from '../components/TabBarIcon';
import DiaryScreen from '../screens/DiaryScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { TreatmentScreen } from '../screens/TreatmentScreen';
import { SupportChatScreen } from '../screens/SupportChatScreen';
import treatments from '../constants/Treatments';
import Auth from '../utilities/auth.service';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const { state } = Auth.useAuth();

  // Strip time from next checkin datetime to determine whether to show checkin badge
  // If userData isn't defined yet, set an old date so things don't break
  // TODO: Rig state so it's never undefined. Maybe store a version in async?
  const nextCheckinDate = useMemo(() => {
    const nextCheckinAsDate =
      state.userData?.currentTreatments?.nextCheckinDatetime?.toDate() ||
      new Date(0);
    return moment(nextCheckinAsDate).startOf('date');
  }, [state.userData?.currentTreatments?.nextCheckinDatetime]);

  const nextCheckinReady =
    !!treatments[state.userData?.nextCheckin?.treatmentModule]?.ready;

  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#ffffff',
        inactiveTintColor: '#7FC0C4',
        style: {
          backgroundColor: '#00818A',
          borderTopWidth: 0,
        },
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
          ),
        }}
      />

      {/* Main treatment info & check-in screen */}
      <Tab.Screen
        name="Home"
        component={TreatmentScreen}
        options={{
          tabBarLabel: 'Home',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name={Platform.OS === 'ios' ? 'ios-medical' : 'md-medical'}
              badge={nextCheckinDate.isBefore(moment()) && nextCheckinReady}
            />
          ),
        }}
      />

      {/* Support & FAQ screen */}
      <Tab.Screen
        name="Support"
        component={SupportChatScreen}
        options={{
          tabBarLabel: 'Support',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name={
                Platform.OS === 'ios' ? 'ios-chatbubbles' : 'md-chatbubbles'
              }
              badge={state.userData?.livechatUnreadMsg}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          // eslint-disable-next-line react/display-name
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon
              focused={focused}
              color={color}
              name={Platform.OS === 'ios' ? 'ios-settings' : 'md-settings'}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

BottomTabs.propTypes = {
  color: PropTypes.string,
  focused: PropTypes.bool,
};
