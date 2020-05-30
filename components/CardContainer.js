import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { slumber_theme } from '../config/Themes';

export const CardContainer = (props) => {
  return <View style={styles.View_CardContainer}>{props.children}</View>;
};

const styles = StyleSheet.create({
  View_CardContainer: {
    backgroundColor: slumber_theme.colors.medium,
    width: '92%',
    padding: scale(12),
    borderRadius: slumber_theme.borderRadius.global,
    marginBottom: scale(15)
  }
});

export default withTheme(CardContainer);
