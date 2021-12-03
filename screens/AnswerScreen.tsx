import React, { useMemo, useEffect } from 'react';
import {
  useWindowDimensions,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { ScreenContainer, Container } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { NavigationProp } from '@react-navigation/native';
import { find } from 'lodash';
import { WebView } from 'react-native-webview';
import FAQ from '../utilities/faq.service';
import { FAQData } from '../types/faq';
import { Theme } from '../types/theme';
import { dozy_theme } from '../config/Themes';
import BottomNavButtons from '../components/BottomNavButtons';

export interface AnswerScreenProps {
  navigation: NavigationProp<any>;
  route: {
    params: {
      faqId: string;
      theme: Theme;
    };
  };
}

export const AnswerScreen: React.FC<AnswerScreenProps> = ({
  navigation,
  route,
}) => {
  const { faqs, setFAQAsRead } = FAQ.useFAQ();
  const dimensions = useWindowDimensions();

  const faq = useMemo(
    () => find(faqs, { id: route.params.faqId }) as FAQData,
    [faqs, route.params.faqId],
  );

  useEffect((): void => {
    setFAQAsRead(route.params.faqId);
  }, [route.params.faqId, setFAQAsRead]);

  return (
    <ScreenContainer hasSafeArea={true} scrollable={false}>
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
                      dozy_theme.typography.headline5,
                      {
                        color: dozy_theme.colors.secondary,
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
                    dozy_theme.typography.body1,
                    {
                      color: dozy_theme.colors.secondary,
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
                backgroundColor: dozy_theme.colors.background,
              },
            ]}
            renderLoading={() => (
              <ActivityIndicator
                size="large"
                color={dozy_theme.colors.primary}
                style={styles.webViewLoader}
              />
            )}
          />
        )}
      </Container>
      <BottomNavButtons
        bottomBackButton={() => navigation.goBack()}
        bottomBackButtonLabel="Back"
        onlyBackButton
        theme={dozy_theme}
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

export default AnswerScreen;
