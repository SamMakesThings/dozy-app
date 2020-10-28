import React from 'react';
import { StyleSheet, View } from 'react-native';
import * as Icon from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import Colors from '../constants/Colors';
import { dozy_theme } from '../config/Themes';

const theme = dozy_theme;

interface Props {
  name: string;
  focused: boolean;
  badge: boolean;
}

export default class TabBarIcon extends React.Component<Props> {
  render() {
    return (
      <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <Icon.Ionicons
          name={this.props.name}
          size={scale(23)}
          style={{ marginBottom: -3 }}
          color={
            this.props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
          }
        />
        {this.props.badge && (
          <View
            style={
              styles.View_BadgeContainer // Display badge if passed in props
            }
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  View_BadgeContainer: {
    backgroundColor: 'red',
    padding: scale(4),
    width: scale(10),
    height: scale(10),
    marginLeft: scale(-5),
    borderRadius: scale(100),
    position: 'absolute',
    alignSelf: 'flex-start'
  }
});
