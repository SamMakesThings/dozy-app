import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Icon from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import Colors from '../constants/Colors';

interface Props {
  name: React.ComponentProps<typeof Icon.Ionicons>['name'];
  focused: boolean;
  badge: boolean;
}

const TabBarIcon: React.FC<Props> = ({ name, focused, badge }) => (
  <View style={styles.container}>
    <Icon.Ionicons
      name={name}
      size={scale(23)}
      style={styles.icon}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
    {badge && (
      <View
        style={
          styles.View_BadgeContainer // Display badge if passed in props
        }
      />
    )}
  </View>
);

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  View_BadgeContainer: {
    backgroundColor: 'red',
    padding: scale(4),
    width: scale(10),
    height: scale(10),
    marginLeft: scale(-5),
    borderRadius: scale(100),
    position: 'absolute',
    alignSelf: 'flex-start',
  },
  container: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  icon: { marginBottom: -3 },
});

export default TabBarIcon;
