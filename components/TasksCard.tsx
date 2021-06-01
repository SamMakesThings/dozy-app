import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  ImageSourcePropType
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { LinkCard } from './LinkCard';
import { TodoItem } from './TodoItem';
import { CardContainer } from './CardContainer';
import { dozy_theme } from '../config/Themes';

interface Props {
  todosArray: Array<string>;
}

const TasksCard: React.FC<Props> = (props) => {
  const theme = dozy_theme;

  return (
    <CardContainer>
      <View style={styles.View_CardHeaderContainer}>
        <Text
          style={{
            ...theme.typography.cardTitle,
            ...styles.Text_CardTitle
          }}
        >
          To do:
        </Text>
      </View>
      <View style={styles.View_CardContentContainer}>
        <View style={{ ...styles.ItemMargin, ...styles.View_TodoContainer }}>
          {
            // Pull todos from treatments object, map them out
            props.todosArray.map((todo) => {
              return <TodoItem key={todo} completed={false} label={todo} />;
            })
          }
        </View>
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  ItemMargin: {
    marginTop: scale(10)
  },
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  View_CardContentContainer: {},
  View_TodoContainer: {},
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  },
  Text_RightSubHeader: {
    fontFamily: 'RubikRegular',
    fontSize: scale(17),
    color: dozy_theme.colors.secondary,
    opacity: 0.5
  }
});

export default TasksCard;
