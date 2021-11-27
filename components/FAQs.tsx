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
import { FAQContent } from '../types/faq';

interface QuestionProps extends TouchableOpacityProps {
  content: string;
  theme: Theme;
}

const Question: React.FC<QuestionProps> = ({
  content,
  theme,
  style,
  ...props
}) => (
  <TouchableOpacity style={[styles.questionContainer, style]} {...props}>
    <Text style={[theme.typography.body1, { color: theme.colors.surface }]}>
      {content}
    </Text>
  </TouchableOpacity>
);

export interface FAQsProps extends ViewProps {
  theme: Theme;
  title: string;
  questions: { id: string; question: FAQContent }[];
  onQuestionClick: (questionId: string) => void;
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
    ({ item }: ListRenderItemInfo<{ id: string; question: FAQContent }>) => (
      <Question
        content={item.question.content}
        theme={theme}
        onPress={() => onQuestionClick(item.id)}
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
        keyExtractor={(item) => item.id}
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
