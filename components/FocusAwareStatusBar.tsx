import React from 'react';
import { StatusBar, StatusBarProps } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

export type FocusAwareStatusBarProps = StatusBarProps;

const FocusAwareStatusBar: React.FC<FocusAwareStatusBarProps> = ({
  barStyle = 'light-content',
  ...props
}) => {
  const isFocused = useIsFocused();

  return isFocused ? <StatusBar barStyle={barStyle} {...props} /> : null;
};

export default FocusAwareStatusBar;
