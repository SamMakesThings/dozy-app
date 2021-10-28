import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  TextInput,
  LayoutAnimation,
  ViewStyle,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { withTheme, Container, Button } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Rating } from 'react-native-ratings';
import { Theme } from '../types/theme';
import { CardContainer } from './CardContainer';
import { dozy_theme } from '../config/Themes';

export interface FeedbackWidgetProps extends ViewProps {
  theme: Theme;
  rate: number;
  submitted?: boolean;
  defaultValue?: string;
  onRateChange?: (rate: number) => void;
  onFeedbackChange?: (value: string) => void;
  onSubmit: () => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  theme,
  rate,
  submitted = false,
  defaultValue,
  onRateChange,
  onFeedbackChange,
  onSubmit,
  ...props
}) => {
  const prevRate = useRef(rate);
  const [showingInputbox, setShowingInputbox] = useState(rate !== 0);

  const onFeedbackSubmitEditing = useCallback(
    (event: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      if (onFeedbackChange) {
        onFeedbackChange(event.nativeEvent.text);
      }
    },
    [onFeedbackChange],
  );

  useEffect((): void => {
    if (prevRate.current === 0 && rate) {
      LayoutAnimation.configureNext({
        ...LayoutAnimation.Presets.easeInEaseOut,
        duration: 300,
      });
      setShowingInputbox(true);
    }
    prevRate.current = rate;
  }, [rate]);

  return (
    <CardContainer {...props}>
      {submitted ? (
        <Text
          testID="Thanks"
          style={[theme.typography.body2, styles.Text_CardSubtitle]}
        >
          Thanks for your feedback!
        </Text>
      ) : (
        <>
          <View style={styles.View_CardHeaderContainer}>
            <View style={styles.View_CardHeaderSubContainer}>
              <Text
                style={{
                  ...theme.typography.cardTitle,
                  ...styles.Text_CardTitle,
                }}
              >
                Quick question
              </Text>
              {!!rate && (
                <Text
                  style={{
                    ...theme.typography.cardTitle,
                    ...styles.Text_RightSubHeader,
                  }}
                >
                  {`${rate}/5`}
                </Text>
              )}
            </View>
            <Text
              style={{ ...theme.typography.body2, ...styles.Text_CardSubtitle }}
            >
              How likely is it that you would recommend Dozy to a friend?
            </Text>
          </View>
          <View style={styles.View_CardContentContainer}>
            <Rating
              fractions={1}
              ratingTextColor={theme.colors.secondary}
              tintColor={theme.colors.medium}
              jumpValue={0.5}
              minValue={0.5}
              startingValue={0}
              readonly={submitted}
              showReadOnlyText={false}
              onFinishRating={onRateChange}
              style={styles.Rating}
            />
            <View
              testID="Footer"
              style={showingInputbox ? styles.View_InputBox : styles.hidden}
            >
              <Container
                style={{
                  ...styles.View_InputContainer,
                  borderColor: theme.colors.light,
                }}
              >
                <TextInput
                  style={styles.TextInput}
                  placeholder={'Why did you give that rating? (optional)'}
                  placeholderTextColor={theme.colors.light}
                  keyboardType="default"
                  keyboardAppearance="dark"
                  returnKeyType="done"
                  defaultValue={defaultValue}
                  enablesReturnKeyAutomatically={true}
                  onChangeText={onFeedbackChange}
                  onSubmitEditing={onFeedbackSubmitEditing}
                />
              </Container>
              <Button
                style={[theme.buttonLayout as ViewStyle, styles.Button_Submit]}
                type="solid"
                onPress={onSubmit}
                color={theme.colors.primary}
              >
                Submit feedback
              </Button>
            </View>
          </View>
        </>
      )}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
  View_InputBox: {
    width: '100%',
  },
  View_CardHeaderContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  View_CardHeaderSubContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  View_CardContentContainer: {
    alignItems: 'flex-start',
    paddingTop: scale(30),
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
  },
  Text_RightSubHeader: {
    fontFamily: 'RubikRegular',
    fontSize: scale(17),
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(0),
    lineHeight: scale(15),
  },
  Rating: {
    flexDirection: 'column-reverse',
    paddingBottom: scale(23),
  },
  View_InputContainer: {
    marginTop: scale(-18),
    marginBottom: scale(18),
    width: '100%',
    borderBottomWidth: 1.5,
  },
  // eslint-disable-next-line react-native/no-color-literals
  TextInput: {
    color: '#ffffff',
    fontSize: scale(15),
    height: scale(45),
  },
  Button_Submit: {
    marginTop: scale(25),
  },
});

export default withTheme(FeedbackWidget);
