import React, { useCallback, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { scale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import { dozy_theme } from '../config/Themes';
import Analytics from '../utilities/analytics.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';

export interface TodoItemProps {
  label: string;
  completed?: boolean;
  disabled?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = (props) => {
  const theme = dozy_theme;

  const [checked, setChecked] = React.useState(props.completed);

  const onPress = useCallback((): void => {
    setChecked(!checked);
    Analytics.logEvent(AnalyticsEvents.updateTreatmentTask, {
      completed: !checked,
    });
  }, [checked]);

  useEffect(() => {
    setChecked(props.completed);
  }, [props.completed]);

  return (
    <TouchableOpacity
      style={styles.View_TodoItem}
      onPress={onPress}
      disabled={props.disabled}
    >
      <MaterialIcons
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={scale(21)}
        color={theme.colors.secondary}
      />
      <Text style={[theme.typography.body2, styles.Text_TodoItem]}>
        {props.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  View_TodoItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Text_TodoItem: {
    flex: 1,
    color: dozy_theme.colors.secondary,
    marginLeft: scale(8),
  },
});

export default TodoItem;
