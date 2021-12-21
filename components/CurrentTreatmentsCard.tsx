import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  GestureResponderEvent,
  ImageSourcePropType,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { LinkCard } from './LinkCard';
import { TodoItem } from './TodoItem';
import { CardContainer } from './CardContainer';
import { dozy_theme } from '../config/Themes';

interface Props {
  progressPercent: number;
  linkImage: ImageSourcePropType;
  linkTitle: string;
  linkSubtitle: string;
  onPress: (event: GestureResponderEvent) => void;
  todosArray: { name: string; completed?: boolean }[];
}

const CurrentTreatmentsCard: React.FC<Props> = (props) => {
  const theme = dozy_theme;

  return (
    <CardContainer>
      <View style={styles.View_CardHeaderContainer}>
        <Text
          style={{
            ...theme.typography.cardTitle,
            ...styles.Text_CardTitle,
          }}
        >
          In progress
        </Text>
        <Text
          style={{
            ...theme.typography.cardTitle,
            ...styles.Text_RightSubHeader,
          }}
        >
          {props.progressPercent}% complete
        </Text>
      </View>
      <View style={styles.View_CardContentContainer}>
        <LinkCard
          style={styles.ItemMargin}
          bgImage={props.linkImage}
          titleLabel={props.linkTitle}
          subtitleLabel={props.linkSubtitle}
          onPress={props.onPress}
        />
        <View style={{ ...styles.ItemMargin, ...styles.View_TodoContainer }}>
          {
            // Pull todos from treatments object, map them out
            props.todosArray.map((todo) => {
              return (
                <TodoItem
                  key={todo.name}
                  completed={todo.completed}
                  label={todo.name}
                  disabled={todo.completed}
                />
              );
            })
          }
        </View>
      </View>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  ItemMargin: {
    marginTop: scale(10),
  },
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  View_CardContentContainer: {},
  View_TodoContainer: {},
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
  },
  Text_RightSubHeader: {
    fontFamily: 'RubikRegular',
    fontSize: scale(17),
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
  },
});

export default CurrentTreatmentsCard;
