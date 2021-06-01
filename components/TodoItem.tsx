import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import { dozy_theme } from '../config/Themes';

export const TodoItem = (props: { label: string; completed: boolean }) => {
  const theme = dozy_theme;

  const [checked, setChecked] = React.useState(false);

  return (
    <TouchableOpacity
      style={styles.View_TodoItem}
      onPress={() => {
        setChecked(!checked);
      }}
    >
      <MaterialIcons
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={scale(21)}
        color={theme.colors.secondary}
      />
      <Text style={{ ...theme.typography.body2, ...styles.Text_TodoItem }}>
        {props.label}
      </Text>
    </TouchableOpacity>
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

export default TodoItem;
