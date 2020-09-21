import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

interface Props {
  style?: object;
}

export const CardContainer: React.FC<Props> = (props) => {
  return (
    <View style={{ ...styles.View_CardContainer, ...props.style }}>
      {props.children}
    </View>
  );
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
