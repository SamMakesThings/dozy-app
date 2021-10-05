import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewProps,
  TextInput,
  LayoutAnimation,
  ViewStyle,
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
  hasShadow?: boolean;
  submitted?: boolean;
  onRateChange?: (rate: number) => void;
  onFeedbackChange?: (value: string) => void;
  onSubmit?: () => void;
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({
  theme,
  style,
  rate,
  hasShadow = false,
  submitted = false,
  onRateChange,
  onFeedbackChange,
  onSubmit,
  ...props
}) => {
  const prevRate = useRef(rate);
  const [showingInputbox, setShowingInputbox] = useState(rate !== 0);

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

  /* return (
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
      <Text
        style={[
          theme.typography.body2,
          { color: theme.colors.secondary },
          styles.feedbackTitle,
        ]}
      >
        How likely is it that you would recommend Dozy to a friend?
      </Text>
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
        style={{flexDirection: 'column-reverse'}}
      />
      {submitted ? (
        <Text
          style={[
            theme.typography.body2,
            { color: theme.colors.secondary },
            styles.feedbackTitle,
          ]}
        >
          Thanks for your feedback!
        </Text>
      ) : (
        <>
          {showingInputbox && (
            <>
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
                placeholder="Optional explanation"
                placeholderTextColor={theme.colors.lightInverse}
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
                  style={[
                    theme.typography.button,
                    { color: theme.colors.secondary },
                  ]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </>
          )}
        </>
      )}
    </View>
  ); */

  return (
    <CardContainer>
      <View style={styles.View_CardHeaderContainer}>
        <View style={styles.View_CardHeaderSubContainer}>
          <Text
            style={{
              ...theme.typography.cardTitle,
              ...styles.Text_CardTitle
            }}
          >
            Quick question
          </Text>
          <Text
            style={{
              ...theme.typography.cardTitle,
              ...styles.Text_RightSubHeader
            }}
          >
            6/10
          </Text>
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
          style={{flexDirection: 'column-reverse', paddingBottom: scale(23)}}
        />
        <View style={{display: 'flex', width: '100%'}}>
          <Container
            style={{
              ...styles.View_InputContainer,
              borderColor: theme.colors.light,
            }}
          >
            <TextInput
              style={styles.TextInput}
              placeholder={"Why did you give that rating? (optional)"}
              placeholderTextColor={theme.colors.light}
              keyboardType="default"
              keyboardAppearance="dark"
              returnKeyType="done"
              defaultValue={props.defaultValue || undefined}
              enablesReturnKeyAutomatically={true}
              onChangeText={onFeedbackChange}
              onSubmitEditing={(event) => {
                if (screenState !== States.Valid) {
                  setTextContent(event.nativeEvent.text);
                } else {
                  setTextContent(event.nativeEvent.text);
                  props.onQuestionSubmit(event.nativeEvent.text);
                }
              }}
            />
          </Container>
          <Button
            style={[
              theme.buttonLayout as ViewStyle,
              styles.Button_Submit,
            ]}
            type="solid"
            onPress={onSubmit}
            color={theme.colors.primary}
          >
            Submit feedback
          </Button>
        </View>
      </View>
    </CardContainer>
  );
};

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
    marginBottom: scale(16),
    textAlign: 'center',
  },
  feedback: {
    alignSelf: 'stretch',
    height: scale(100),
    marginTop: scale(8),
    padding: scale(8),
    textAlignVertical: 'top',
    borderRadius: scale(6),
  },
  button: {
    marginTop: scale(24),
    paddingHorizontal: scale(16),
    paddingTop: scale(11),
    paddingBottom: scale(8),
    borderRadius: scale(50),
  },
  disabledButton: {
    opacity: 0.5,
  },
  ItemMargin: {
    marginTop: scale(10)
  },
  View_CardHeaderContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  View_CardHeaderSubContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  View_CardContentContainer: {
    alignItems: 'flex-start',
    paddingTop: scale(30),
  },
  View_TextInputContainer: {
    width: '100%',
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  },
  Text_RightSubHeader: {
    fontFamily: 'RubikRegular',
    fontSize: scale(17),
    color: dozy_theme.colors.secondary,
    opacity: 0.5
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(0),
    lineHeight: scale(15)
  },
  View_InputContainer: {
    marginTop: scale(-18),
    marginBottom: scale(18),
    width: '100%',
    borderBottomWidth: 1.5,
  },
  KeyboardAvoidingView: {
    flex: 1,
  },
  // eslint-disable-next-line react-native/no-color-literals
  TextInput: {
    color: '#ffffff',
    fontSize: scale(15),
  },
  Button_Submit: {
    marginTop: scale(25),
  },
});

export default withTheme(FeedbackWidget);
