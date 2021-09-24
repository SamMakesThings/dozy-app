import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { withTheme } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Rating } from 'react-native-ratings';
import { Theme } from '../types/theme';

export interface FeedbackWidgetProps extends ViewProps {
  theme: Theme;
  rate: number;
  hasShadow?: boolean;
  onRateChange?: (rate: number) => void;
  onFeedbackChange?: (value: string) => void;
  onSubmit?: () => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  theme,
  style,
  rate,
  hasShadow = false,
  onRateChange,
  onFeedbackChange,
  onSubmit,
  ...props
}) => (
  <View
    style={[
      hasShadow && theme.elevation[3],
      styles.container,
      hasShadow && styles.containerShadow,
      {
        borderRadius: theme.borderRadius.global,
        backgroundColor: theme.colors.medium,
      },
      style,
    ]}
    {...props}
  >
    <Rating
      showRating
      fractions={1}
      ratingTextColor={theme.colors.primary}
      tintColor={theme.colors.medium}
      jumpValue={0.5}
      minValue={0.5}
      startingValue={0}
      onFinishRating={onRateChange}
    />
    <Text
      style={[
        theme.typography.headline6,
        { color: theme.colors.primary },
        styles.feedbackTitle,
      ]}
    >
      Please tell us why you gave this rating.
    </Text>
    <TextInput
      style={[
        styles.feedback,
        theme.typography.body2,
        {
          backgroundColor: theme.colors.background,
          color: theme.colors.strong,
        },
      ]}
      multiline
      numberOfLines={5}
      onChangeText={onFeedbackChange}
    />
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: theme.colors.primary },
        rate === 0 && styles.disabledButton,
      ]}
      disabled={rate === 0}
      onPress={onSubmit}
    >
      <Text
        style={[theme.typography.button, { color: theme.colors.secondary }]}
      >
        Submit
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    alignSelf: 'stretch',
    alignItems: 'center',
    padding: 20,
  },
  containerShadow: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 3,
  },
  feedbackTitle: {
    marginTop: scale(16),
  },
  feedback: {
    alignSelf: 'stretch',
    height: scale(100),
    marginTop: scale(8),
    padding: scale(8),
    textAlignVertical: 'top',
    borderRadius: scale(8),
  },
  button: {
    marginTop: scale(24),
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(8),
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default withTheme(FeedbackWidget);
