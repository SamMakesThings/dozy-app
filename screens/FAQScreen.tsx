import React, { useMemo, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { scale } from 'react-native-size-matters';
import FAQ from '../utilities/faq.service';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import FAQs from '../components/FAQs';
import { dozy_theme } from '../config/Themes';
import ThinkingFace from '../assets/images/ThinkingFace.svg';

export type FAQScreenProps = StackScreenProps<any>;

export const FAQScreen: React.FC<FAQScreenProps> = ({ navigation }) => {
  const imgSize = 0.4 * useWindowDimensions().width;
  const { faqs } = FAQ.useFAQ();

  const questions = useMemo(
    () => faqs.map((it) => ({ id: it.id, question: it.question })),
    [faqs],
  );

  const onQuestionClick = useCallback(
    (faqId: string) => {
      navigation.push('Answer', { faqId });
    },
    [navigation],
  );

  return (
    <WizardContentScreen
      theme={dozy_theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(val?: string) => {
        if (val !== "My question isn't here...") {
          navigation.goBack();
        } else {
          navigation.goBack();
        }
      }}
      buttonLabel="Ok, I think that answers my questions"
      bottomGreyButtonLabel="My question isn't here..."
      bottomBackButtonLabel="Back"
      flexibleLayout
      contentContainerStyle={styles.faqListContentContainer}
    >
      <ThinkingFace width={imgSize} height={imgSize} />
      <FAQs
        style={styles.faqs}
        questions={questions}
        title="What would you like to know?"
        onQuestionClick={onQuestionClick}
      />
    </WizardContentScreen>
  );
};

const styles = StyleSheet.create({
  faqListContentContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  faqs: {
    marginTop: scale(40),
    maxHeight: Dimensions.get('window').height * 0.37,
  },
});

export default FAQScreen;
