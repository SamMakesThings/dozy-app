import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { withTheme, ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { WebView } from 'react-native-webview';
import BottomNavButtons from '../BottomNavButtons';
import { Theme } from '../../types/theme';
import { FAQData } from '../../types/faq';

export interface AnswerScreenProps {
  theme: Theme;
  faq: FAQData;
  bottomBackButton?: () => void;
  style?: StyleProp<ViewStyle>;
}

const AnswerScreen: React.FC<AnswerScreenProps> = ({
  faq,
  theme,
  bottomBackButton,
  style,
}) => {
  const dimensions = useWindowDimensions();
  console.log('faq: ', faq);
  return (
    <ScreenContainer hasSafeArea={true} scrollable={false} style={style}>
      <Container
        style={styles.View_ContentContainer}
        elevation={0}
        useThemeGutterPadding={true}
      >
        {faq.answer?.type === 'plain_text' ? (
          <>
            <View style={styles.flexibleContent} />
            {!!(faq.question.content || faq.answer.content) && (
              <View style={styles.View_TextContainer}>
                {!!faq.question.content && (
                  <Text
                    style={[
                      styles.Text_Explainer,
                      theme.typography.headline5,
                      {
                        color: theme.colors.secondary,
                        marginBottom: scale(10),
                      },
                    ]}
                  >
                    {faq.question.content}
                  </Text>
                )}
                <Text
                  style={[
                    styles.Text_Explainer,
                    styles.textLabel,
                    theme.typography.body1,
                    {
                      color: theme.colors.secondary,
                    },
                  ]}
                >
                  {faq.answer.content}
                </Text>
              </View>
            )}
          </>
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: faq.answer?.content as string }}
            startInLoadingState
            style={[
              styles.webView,
              {
                width: dimensions.width * 0.9,
                backgroundColor: theme.colors.background,
              },
            ]}
            renderLoading={() => (
              <ActivityIndicator
                size="large"
                color={theme.colors.primary}
                style={styles.webViewLoader}
              />
            )}
          />
        )}
      </Container>
      <BottomNavButtons
        bottomBackButton={bottomBackButton}
        bottomBackButtonLabel="Back"
        onlyBackButton
        theme={theme}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  View_ContentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  View_TextContainer: {
    width: '90%',
  },
  Text_Explainer: {
    textAlign: 'left',
    alignItems: 'flex-start',
  },
  flexibleContent: {
    height: scale(20),
  },
  textLabel: {
    marginBottom: 10,
  },
  webView: {
    flex: 1,
  },
  webViewLoader: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
});

export default withTheme<AnswerScreenProps, React.FC<AnswerScreenProps>>(
  AnswerScreen,
);
