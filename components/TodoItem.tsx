import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import { dozy_theme } from '../config/Themes';

export const TodoItem = (props: { label: string }) => {
  const theme = dozy_theme;
  return (
    <View style={styles.View_TodoItem}>
      <MaterialIcons
        name={'check-box-outline-blank'}
        size={scale(21)}
        color={theme.colors.secondary}
      />
      <Text style={{ ...theme.typography.body2, ...styles.Text_TodoItem }}>
        {props.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  View_TodoItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  Text_TodoItem: {
    color: dozy_theme.colors.secondary,
    marginLeft: scale(8)
  }
});

export default withTheme(TodoItem);
