import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ViewProps,
  TouchableOpacity,
  TouchableOpacityProps,
  ListRenderItemInfo,
} from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Theme } from '../types/theme';

interface QuestionProps extends TouchableOpacityProps {
  text: string;
  theme: Theme;
}

const Question: React.FC<QuestionProps> = ({
  text,
  theme,
  style,
  ...props
}) => (
  <TouchableOpacity style={[styles.questionContainer, style]} {...props}>
    <Text style={[theme.typography.body1, { color: theme.colors.surface }]}>
      {text}
    </Text>
  </TouchableOpacity>
);

export interface FAQsProps extends ViewProps {
  theme: Theme;
  title: string;
  questions: string[];
  onQuestionClick: (questionIndex: number) => void;
}

export const FAQs: React.FC<FAQsProps> = ({
  theme,
  title,
  questions,
  onQuestionClick,
  style,
  ...props
}) => {
  const renderItem = useCallback(
    ({ item, index }: ListRenderItemInfo<string>) => (
      <Question
        text={item}
        theme={theme}
        onPress={() => onQuestionClick(index)}
      />
    ),
    [theme, onQuestionClick],
  );

  return (
    <View style={[styles.container, style]} {...props}>
      <Text
        style={[
          styles.title,
          theme.typography.headline5,
          {
            color: theme.colors.secondary,
          },
        ]}
      >
        {title}
      </Text>
      <FlatList
        style={styles.list}
        data={questions}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginHorizontal: -6,
  },
  title: {
    padding: 6,
  },
  list: {
    flex: 1,
    marginTop: scale(20),
  },
  // eslint-disable-next-line react-native/no-color-literals
  questionContainer: {
    paddingLeft: scale(36),
    paddingTop: scale(12),
    paddingRight: scale(21),
    paddingBottom: scale(10),
    backgroundColor: '#404b69',
    borderRadius: 3,
  },
  separator: {
    height: scale(12),
  },
});

export default withTheme(FAQs);
