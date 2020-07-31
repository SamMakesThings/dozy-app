import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

export const CardContainer = (props) => {
  return <View style={styles.View_CardContainer}>{props.children}</View>;
};

const styles = StyleSheet.create({
  View_CardContainer: {
    backgroundColor: dozy_theme.colors.medium,
    flex: 1,
    padding: scale(12),
    borderRadius: dozy_theme.borderRadius.global,
    marginBottom: scale(15)
  }
});

export default withTheme(CardContainer);
