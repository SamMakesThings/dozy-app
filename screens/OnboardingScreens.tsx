import React, { useEffect } from 'react';
import {
  useWindowDimensions,
  Text,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import moment from 'moment';
import * as SecureStore from 'expo-secure-store';
import { AuthContext } from '../context/AuthContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import { dozy_theme } from '../config/Themes';
import WaveHello from '../assets/images/WaveHello.svg';
import LabCoat from '../assets/images/LabCoat.svg';
import Clipboard from '../assets/images/Clipboard.svg';
import TiredFace from '../assets/images/TiredFace.svg';
import BarChart from '../assets/images/BarChart.svg';
import Expressionless from '../assets/images/Expressionless.svg';
import MonocleEmoji from '../assets/images/MonocleEmoji.svg';
import Stop from '../assets/images/Stop.svg';
import WarningTriangle from '../assets/images/WarningTriangle.svg';
import TanBook from '../assets/images/TanBook.svg';
import RaisedHands from '../assets/images/RaisedHands.svg';
import { ChatMessage } from '../components/ChatMessage';
import { ChatTextInput } from '../components/ChatTextInput';
import submitOnboardingData, {
  submitISIResults,
  submitHealthHistoryData,
  submitDiaryReminderAndCheckinData,
  submitFirstChatMessage,
  OnboardingState,
} from '../utilities/submitOnboardingData';
import registerForPushNotificationsAsync, {
  updateExpoPushToken,
} from '../utilities/pushNotifications';
import { Navigation } from '../types/custom';
import { Analytics } from '../utilities/analytics.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';
import { ErrorObj } from '../types/error';

// Define the theme for the file globally
const theme = dozy_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

interface Props {
  navigation: Navigation;
  route: { params: { nextScreen: string; warnAbout: string } };
}

const onboardingState: OnboardingState = {
  ISI1: 0,
  ISI2: 0,
  ISI3: 0,
  ISI4: 0,
  ISI5: 0,
  ISI6: 0,
  ISI7: 0,
  ISITotal: 0,
  pills: '',
  snoring: false,
  rls: false,
  parasomnias: false,
  otherCondition: false,
  diaryHabitTrigger: 'ERROR',
  expoPushToken: 'No push token provided',
  diaryReminderTime: null,
  firstCheckinTime: null,
  firstChatMessageContent: 'Hi',
};

export const Welcome: React.FC<Props> = ({ navigation }) => {
  imgSize = imgSizePercent * useWindowDimensions().width;

  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingWelcome);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      bbbDisabled
      image={<WaveHello width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('Overview', {
          progressBarPercent: null,
        });
      }}
      textLabel="Welcome to Dozy! We'll get you sleeping better in no time."
      buttonLabel="Next"
    />
  );
};

export const Overview: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingOverview);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<LabCoat width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('Asks', {
          progressBarPercent: null,
        });
      }}
      textLabel="We use proven therapeutic techniques to get you sleeping again. It's drug-free, takes from 4-8 weeks, and the benefits are long-lasting."
      buttonLabel="Next"
    />
  );
};

export const Asks: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingAsks);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Clipboard width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('ISIIntro', {
          progressBarPercent: null,
        });
      }}
      textLabel="For this to work, we'll help you maintain a once-daily sleep log and a checkup once per week."
      buttonLabel="Next"
    />
  );
};

export const ISIIntro: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISIIntro);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('ISI1', {
          progressBarPercent: 0.14,
        });
      }}
      textLabel="To get started, we'll ask you 7 questions to determine the size of your insomnia problem."
      buttonLabel="Next"
    />
  );
};

export const ISI1: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISI1);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.ISI1 = value as number;
        navigation.navigate('ISI2', { progressBarPercent: 0.28 });
        Analytics.logEvent(
          AnalyticsEvents.onboardingQuestionFallingAsleepDifficulty,
          { answer: value },
        );
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true },
      ]}
      questionLabel="How much difficulty do you have falling asleep?"
    />
  );
};

export const ISI2: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISI2);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.ISI2 = value as number;
        navigation.navigate('ISI3', { progressBarPercent: 0.42 });
        Analytics.logEvent(
          AnalyticsEvents.onboardingQuestionStayingAsleepDifficulty,
          { answer: value },
        );
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true },
      ]}
      questionLabel="How much difficulty do you have *staying* asleep?"
    />
  );
};

export const ISI3: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISI3);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.ISI3 = value as number;
        navigation.navigate('ISI4', { progressBarPercent: 0.56 });
        Analytics.logEvent(AnalyticsEvents.onboardingQuestionWakingUpProblem, {
          answer: value,
        });
      }}
      buttonValues={[
        { label: 'Not a problem', value: 0, solidColor: true },
        { label: 'I rarely wake up too early', value: 1, solidColor: true },
        { label: 'I sometimes wake up too early', value: 2, solidColor: true },
        {
          label: 'I often wake up too early',
          value: 3,
          solidColor: true,
        },
        { label: 'I always wake up too early', value: 4, solidColor: true },
      ]}
      questionLabel="How much of a problem do you have with waking up too early?"
    />
  );
};

export const ISI4: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISI4);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.ISI4 = value as number;
        navigation.navigate('ISI5', { progressBarPercent: 0.7 });
        Analytics.logEvent(
          AnalyticsEvents.onboardingQuestionSleepPatternSatisfaction,
          { answer: value },
        );
      }}
      buttonValues={[
        { label: 'Very satisfied', value: 0, solidColor: true },
        { label: 'Satisfied', value: 1, solidColor: true },
        {
          label: 'Could be better, could be worse',
          value: 2,
          solidColor: true,
        },
        { label: 'Dissatisfied', value: 3, solidColor: true },
        { label: 'Very dissatisfied', value: 4, solidColor: true },
      ]}
      questionLabel="How satisfied/dissatisfied are you with your current sleep pattern?"
    />
  );
};

export const ISI5: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISI5);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.ISI5 = value as number;
        navigation.navigate('ISI6', { progressBarPercent: 0.84 });
        Analytics.logEvent(
          AnalyticsEvents.onboardingQuestionSleepProblemImpairness,
          { answer: value },
        );
      }}
      buttonValues={[
        { label: 'Not at all noticeable', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much noticeable', value: 4, solidColor: true },
      ]}
      questionLabel="How noticeable to others do you think your sleep problem is? (in terms of impairing the quality of your life)"
    />
  );
};

export const ISI6: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISI6);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.ISI6 = value as number;
        navigation.navigate('ISI7', { progressBarPercent: 0.95 });
        Analytics.logEvent(
          AnalyticsEvents.onboardingQuestionSleepPatternWorries,
          { answer: value },
        );
      }}
      buttonValues={[
        { label: 'Not at all worried', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much worried', value: 4, solidColor: true },
      ]}
      questionLabel="How worried are you about your current sleep pattern?"
    />
  );
};

export const ISI7: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISI7);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        // Sum ISI scores, store value & navigate accordingly
        onboardingState.ISI7 = value as number;
        onboardingState.ISITotal =
          onboardingState.ISI1 +
          onboardingState.ISI2 +
          onboardingState.ISI3 +
          onboardingState.ISI4 +
          onboardingState.ISI5 +
          onboardingState.ISI6 +
          (value as number);
        navigation.navigate('ISIResults', { progressBarPercent: null });
        Analytics.logEvent(
          AnalyticsEvents.onboardingQuestionSleepProblemInterference,
          { answer: value },
        );

        // Submit ISI results
        submitISIResults(onboardingState);
      }}
      buttonValues={[
        { label: 'Not at all interfering', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much interfering', value: 4, solidColor: true },
      ]}
      questionLabel="How much does your sleep problem interfere with your daily life? (e.g. tiredness, mood, ability to function at work, concentration, etc.)?"
    />
  );
};

export const ISIResults: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISIResults);
  }, []);

  const severityText = () => {
    if (onboardingState.ISITotal <= 7) {
      return 'no clinically significant insomnia';
    } else if (onboardingState.ISITotal <= 14) {
      return 'clinically mild insomnia';
    } else if (onboardingState.ISITotal <= 21) {
      return 'clinically moderate insomnia';
    } else {
      return 'clinically severe insomnia';
    }
  };

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<BarChart width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate(
          onboardingState.ISITotal > 7 ? 'ISISignificant' : 'ISINoSignificant',
          {
            progressBarPercent: null,
          },
        );
      }}
      textLabel={
        <Text>
          Done! According to the Insomnia Severity Index, you’ve got
          {onboardingState.ISITotal >= 7 ? '\n' : ' '}
          <Text style={styles.BoldLabelText}>{severityText()}</Text>
        </Text>
      }
      buttonLabel="What's that mean?"
    />
  );
};

export const ISISignificant: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISISignificant);
  }, []);

  const severityText = () => {
    if (onboardingState.ISITotal <= 7) {
      return 'no significant insomnia';
    } else if (onboardingState.ISITotal <= 14) {
      return 'Clinically mild insomnia';
    } else if (onboardingState.ISITotal <= 21) {
      return 'Clinically moderate insomnia';
    } else {
      return 'Clinically severe insomnia';
    }
  };

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyIntro', {
          progressBarPercent: null,
        });
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>
            {severityText()}
            {'\n'}
          </Text>
          <Text style={{ lineHeight: scale(18) }}>
            Your insomnia is{' '}
            {onboardingState.ISITotal >= 14 ? 'definitely' : 'likely'}{' '}
            interfering with your life. However, there&apos;s good news:
            You&apos;re exactly the person our app was designed to help! With
            your support, Dozy can take you from your current insomnia to no
            insomnia.
          </Text>
        </>
      }
      buttonLabel="Let's get started"
    />
  );
};

export const ISINoSignificant: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingISINoSignificant);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Expressionless width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyIntro', {
          progressBarPercent: null,
        });
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>
            No significant insomnia{'\n'}
          </Text>
          <Text style={{ lineHeight: scale(18) }}>
            We&apos;re glad to tell you that you don&apos;t have serious
            problems with insomnia. That said, this app is designed for people
            with more severe sleep problems. The techniques used may temporarily
            disrupt your sleep and may not improve it much. If you&apos;d still
            like to use the app, be our guest, just be aware that you may not
            get much out of it.
          </Text>
        </>
      }
      buttonLabel="Whatever, I'll use it anyway"
    />
  );
};

export const SafetyIntro: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyIntro);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<MonocleEmoji width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyPills', {
          progressBarPercent: null,
        });
      }}
      textLabel="Now let’s check whether it’s safe for you to use this therapy."
      buttonLabel="Next"
    />
  );
};

export const SafetyPills: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyPills);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.pills = value as string;
        navigation.navigate(
          value == 'none' ? 'SafetySnoring' : 'SafetyPillsStop',
          { progressBarPercent: null },
        );
        Analytics.logEvent(AnalyticsEvents.onboardingQuestionSafetyPills, {
          answer: value,
        });
        submitHealthHistoryData({ pills: value as string });
      }}
      buttonValues={[
        { label: 'Nope', value: 'none', solidColor: true },
        {
          label: 'Yes, Benzodiazepines (e.g. Xanax)',
          value: 'benzo',
          solidColor: true,
        },
        {
          label: 'Yes, non-Benzodiazepines (e.g. Ambien, Lunesta)',
          value: 'nonBenzo',
          solidColor: true,
        },
        { label: 'Yes, other or not sure', value: 'other', solidColor: true },
      ]}
      questionLabel="Are you currently taking any sleeping pills?"
    />
  );
};

export const SafetyPillsStop: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyPillsStop);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Stop width={imgSize} height={imgSize} />}
      onQuestionSubmit={(result?: string | number | boolean) => {
        navigation.navigate(
          result === 'Continue anyway' ? 'SafetySnoring' : 'SafetyPillsBye',
          {
            progressBarPercent: null,
          },
        );
        Analytics.logEvent(
          result === 'Continue anyway'
            ? AnalyticsEvents.onboardingSafetyPillsStopContinue
            : AnalyticsEvents.onboardingSafetyPillsStopContactDoctor,
        );
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>A note on pills{'\n'}</Text>
          <Text style={{ lineHeight: scale(18) }}>
            Dozy can improve your sleep whether you&apos;re taking sleeping
            pills or not. However, sleeping pills are generally not recommended
            for long-term use. If you&apos;d like to sleep without pills,
            it&apos;s best to stop before starting Dozy (after consulting with a
            doctor to avoid withdrawals). You&apos;ll see improvements in either
            case - so pick the option that sounds best to you.
          </Text>
        </>
      }
      buttonLabel="I’ll ask my doctor about stopping pills"
      bottomGreyButtonLabel="I'll continue with sleeping pills"
    />
  );
};

export const SafetyPillsBye: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyPillsBye);

    if (onboardingState.expoPushToken === 'No push token provided') {
      registerForPushNotificationsAsync().then(async (expoPushToken) => {
        if (expoPushToken) {
          onboardingState.expoPushToken = expoPushToken;
          const userId = await SecureStore.getItemAsync('userId');
          if (userId) {
            updateExpoPushToken(expoPushToken, userId);
          }
        }
      });
    }
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<WaveHello width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetySnoring', {
          progressBarPercent: null,
        });
      }}
      textLabel={
        onboardingState.otherCondition
          ? "Finding a human provider can be a bit challenging, and options vary per country. For some (free) help, email us at info@dozy.health. Or, if you'd like to continue with the app regardless, you can navigate back and select 'I understand the risks'."
          : 'Great! We’ll email & ping you again in four weeks. If you’re off sleeping pills before that, come back anytime and we’ll pick up where we left off.'
      }
      onlyBackButton
    />
  );
};

export const SafetySnoring: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetySnoring);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.snoring = value as boolean;
        navigation.navigate(!value ? 'SafetyLegs' : 'SafetyIllnessWarning', {
          warnAbout: 'sleep apneas',
          nextScreen: 'SafetyLegs',
        });
        Analytics.logEvent(AnalyticsEvents.onboardingQuestionSafetySnoring, {
          answer: value,
        });
        submitHealthHistoryData({ snoring: value as boolean });
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true },
      ]}
      questionLabel="Do you snore heavily? Has anyone witnessed prolonged pauses in breathing (apneas)?"
    />
  );
};

export const SafetyLegs: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyLegs);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.rls = value as boolean;
        navigation.navigate(!value ? 'SafetyParas' : 'SafetyIllnessWarning', {
          warnAbout: 'Restless Leg Syndrome',
          nextScreen: 'SafetyParas',
        });
        Analytics.logEvent(AnalyticsEvents.onboardingSafetyLegs, {
          answer: value,
        });
        submitHealthHistoryData({ rls: value as boolean });
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true },
      ]}
      questionLabel="Do you have unpleasant tingling or discomfort in the legs, which makes you need to kick or to move?"
      questionSubtitle="(restless body rather than a racing mind)"
    />
  );
};

export const SafetyParas: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyParas);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.parasomnias = value as boolean;
        navigation.navigate(
          !value ? 'SafetyCatchall' : 'SafetyIllnessWarning',
          { warnAbout: 'parasomnias', nextScreen: 'SafetyCatchall' },
        );
        Analytics.logEvent(AnalyticsEvents.onboardingQuestionSafetyParas, {
          answer: value,
        });
        submitHealthHistoryData({ parasomnias: value as boolean });
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true },
      ]}
      questionLabel="Do you have any history of nightmares, acting out of dreams, sleepwalking out of the bedroom?"
    />
  );
};

export const SafetyCatchall: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyCatchall);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.otherCondition = value as boolean;
        navigation.navigate(!value ? 'BaselineIntro' : 'SafetyIllnessWarning', {
          warnAbout: 'such conditions',
          nextScreen: 'BaselineIntro',
        });
        Analytics.logEvent(AnalyticsEvents.onboardingQuestionSafetyCatchall, {
          answer: value,
        });
        submitHealthHistoryData({ otherCondition: value as boolean });
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true },
      ]}
      questionLabel="Do you have epilepsy, bipolar disorder, parasomnias, obstructive sleep apnea, or other illnesses that cause excessive daytime sleepiness on their own?"
    />
  );
};

export const SafetyIllnessWarning: React.FC<Props> = ({
  navigation,
  route,
}) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSafetyIllnessWarning);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={(result?: string | number | boolean) => {
        navigation.navigate(
          result === 'I understand the risks, continue anyway'
            ? route.params.nextScreen
            : 'SafetyPillsBye',
          {
            progressBarPercent: null,
          },
        );
        Analytics.logEvent(
          result === 'I understand the risks, continue anyway'
            ? AnalyticsEvents.onboardingSafetyIllnessWarningSkipFinding
            : AnalyticsEvents.onboardingSafetyIllnessWarningFindHumanProvider,
        );
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>Risks of this therapy{'\n'}</Text>
          <Text style={{ lineHeight: scale(18) }}>
            This therapy (CBT-i) in combination with {route.params.warnAbout}{' '}
            can cause excessive daytime sleepiness to the degree that it becomes
            dangerous to drive, operate machinery, or make important decisions.
            We recommend you consult a human therapist instead of using the app.
          </Text>
        </>
      }
      buttonLabel="Help me find a human provider"
      bottomGreyButtonLabel="I understand the risks, continue anyway"
    />
  );
};

export const BaselineIntro: React.FC<Props> = ({ navigation }) => {
  const windowDimensions = useWindowDimensions();
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingBaselineIntro);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<WarningTriangle width={imgSize} height={imgSize} />}
      onQuestionSubmit={(result?: string | number | boolean) => {
        navigation.navigate(
          result === 'My sleep will be unusual, let’s postpone'
            ? 'BaselineBye'
            : 'DiaryIntro',
          {
            progressBarPercent: null,
          },
        );
        Analytics.logEvent(
          result === 'My sleep will be unusual, let’s postpone'
            ? AnalyticsEvents.onboardingBaselineIntroPostpone
            : AnalyticsEvents.onboardingBaselineIntroStartThisWeek,
        );
      }}
      longText
      textLabel={
        <Text
          style={[
            { fontSize: 0.05 * windowDimensions.width },
            styles.textLabel,
          ]}
        >
          An important note: This first week of sleep tracking is critical for
          getting a baseline of your normal sleep patterns. If you&apos;re
          traveling or doing some other unusual sleep-disturbing activity this
          week, you should start this diary next week.
        </Text>
      }
      buttonLabel="I’m ready - let’s start this week"
      bottomGreyButtonLabel="My sleep will be unusual, let’s postpone"
    />
  );
};

export const BaselineBye: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingBaselineBye);

    if (onboardingState.expoPushToken === 'No push token provided') {
      registerForPushNotificationsAsync().then(async (expoPushToken) => {
        if (expoPushToken) {
          onboardingState.expoPushToken = expoPushToken;
          const userId = await SecureStore.getItemAsync('userId');
          if (userId) {
            updateExpoPushToken(expoPushToken, userId);
          }
        }
      });
    }
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<WaveHello width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetySnoring', {
          progressBarPercent: null,
        });
      }}
      textLabel="No worries! We’ll follow up with you in a week. If you’re ready to start before that, come back anytime and we’ll pick up where we left off."
      onlyBackButton
    />
  );
};

export const DiaryIntro: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingDiaryIntro);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TanBook width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('DiaryHabit', {
          progressBarPercent: 0.2,
        });
      }}
      textLabel="Almost there! During the program, we’ll be tracking your sleep with a sleep diary. It’s critical that you fill this out each morning."
      buttonLabel="Got it - let’s make it easy to remember"
    />
  );
};

export const DiaryHabit: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingDiaryHabit);
  }, []);

  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        onboardingState.diaryHabitTrigger = value as string;
        navigation.navigate('DiaryReminder', { progressBarPercent: 0.4 });
        Analytics.logEvent(AnalyticsEvents.onboardingQuestionDiaryHabit, {
          answer: value,
        });
      }}
      buttonValues={[
        { label: 'After waking up', value: 'onWake', solidColor: true },
        {
          label: 'After brushing my teeth',
          value: 'onBrushTeeth',
          solidColor: true,
        },
        {
          label: 'After eating breakfast',
          value: 'onBreakfast',
          solidColor: true,
        },
        { label: 'After taking a shower', value: 'onShower', solidColor: true },
      ]}
      questionLabel="When would you like to log your sleep in the morning?"
    />
  );
};

export const DiaryReminder: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingDiaryReminder);
  }, []);

  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={moment().hour(9).minute(0).toDate()}
      onQuestionSubmit={(value: Date | boolean) => {
        // TODO: Can I just make the arrow function async instead of below
        async function setPushToken() {
          // TODO: Make less dumb
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            onboardingState.expoPushToken = pushToken;
          }
        }
        if (typeof value != 'boolean') {
          onboardingState.diaryReminderTime = value;
          setPushToken();
          Analytics.logEvent(AnalyticsEvents.onboardingDiaryReminderSet);
        } else {
          Analytics.logEvent(AnalyticsEvents.onboardingDiaryReminderUnset);
        }
        navigation.navigate('CheckinScheduling', { progressBarPercent: 0.6 });
      }}
      questionLabel="What time do you usually do that?"
      questionSubtitle="We'll send you a gentle reminder."
      bottomGreyButtonLabel="Don't set a reminder"
      mode="time"
    />
  );
};

export const CheckinScheduling: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingCheckinScheduling);

    // Ask push notification permission if user didn't allow to set a reminder
    if (onboardingState.expoPushToken === 'No push token provided') {
      registerForPushNotificationsAsync().then(async (expoPushToken) => {
        if (expoPushToken) {
          onboardingState.expoPushToken = expoPushToken;
        }
      });
    }
  }, []);

  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={moment().add(1, 'weeks').toDate()}
      onQuestionSubmit={(value: Date | boolean) => {
        onboardingState.firstCheckinTime = value as Date;
        navigation.navigate('SendFirstChat', { progressBarPercent: 0.8 });
        submitDiaryReminderAndCheckinData(onboardingState);
      }}
      validInputChecker={(val: Date): ErrorObj | boolean => {
        // Make sure the selected date is 7+ days from today
        // Make sure it's within 14 days
        // Otherwise, mark it valid by returning true
        if (moment().add(7, 'days').hour(0).toDate() > val) {
          return {
            severity: 'ERROR',
            errorMsg: 'Please select a day 7 or more days from today',
          };
        } else if (moment().add(14, 'days').hour(0).toDate() < val) {
          return {
            severity: 'WARNING',
            errorMsg: 'Please select a day within 14 days of today',
          };
        } else {
          return true;
        }
      }}
      questionLabel="When would you like to schedule your first weekly check-in?"
      questionSubtitle="Check-ins take 5-10 minutes and introduce you to new sleep improvement techniques based on your sleep patterns."
      buttonLabel="I've picked a date 7+ days from today"
      mode="datetime"
    />
  );
};

export const SendFirstChat: React.FC<Props> = ({ navigation }) => {
  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSendFirstChat);
  }, []);

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      textLabel="Your (real human) sleep coach will provide support and answer questions for you during the process. Let's send them a message now!"
      onQuestionSubmit={() => {
        navigation.navigate('SendFirstChatContd');
      }}
      buttonLabel="Continue"
    >
      <View>
        <ChatMessage
          sender="Sam Stowers"
          message="Welcome to Dozy! I'm Sam, I'll be your sleep coach."
          time={new Date()}
          sentByUser={false}
        />
        <ChatMessage
          sender="Sam Stowers"
          message="Why do you want to improve your sleep?"
          time={new Date()}
          sentByUser={false}
        />
      </View>
    </WizardContentScreen>
  );
};

export const SendFirstChatContd: React.FC<Props> = ({ navigation }) => {
  const { state } = React.useContext(AuthContext);
  const displayName = state.userData.userInfo.displayName;

  const [message, setMessage] = React.useState('');
  const [replyVisible, makeReplyVisible] = React.useState(false);

  const messageSent = message != '';

  if (messageSent) {
    // Send message after a delay to simulate actual reply
    setTimeout(() => makeReplyVisible(true), 1500);
  }

  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingSendFirstChatContd);
  }, []);

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('OnboardingEnd');
      }}
      buttonLabel="Continue"
      flexibleLayout
      onlyBackButton={!replyVisible}
    >
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding' })}
        keyboardVerticalOffset={Platform.select({ ios: scale(60) })}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.spacer6} />
        <ChatMessage
          sender="Sam Stowers"
          message="Welcome to Dozy! I'm Sam, I'll be your sleep coach."
          time={new Date()}
          sentByUser={false}
        />
        <ChatMessage
          sender="Sam Stowers"
          message="Why do you want to improve your sleep?"
          time={new Date()}
          sentByUser={false}
        />
        <View style={!messageSent && styles.none}>
          <ChatMessage
            sender="You"
            message={message}
            time={new Date()}
            sentByUser={true}
          />
        </View>
        <View style={!replyVisible && styles.none}>
          <ChatMessage
            sender="Sam Stowers"
            message="Thanks for sending! We usually reply within 24 hours. You can find our conversation in the Support tab of the app at any time. :)"
            time={new Date()}
            sentByUser={false}
          />
        </View>
        <View style={styles.spacer} />
        <ChatTextInput
          onSend={(typedMsg: string) => {
            onboardingState.firstChatMessageContent = typedMsg;
            setMessage(typedMsg);
            Keyboard.dismiss();
            submitFirstChatMessage(typedMsg, displayName);
          }}
          viewStyle={!!messageSent && styles.none}
        />
      </KeyboardAvoidingView>
    </WizardContentScreen>
  );
};

export const OnboardingEnd: React.FC<Props> = ({ navigation }) => {
  const { dispatch } = React.useContext(AuthContext);

  useEffect((): void => {
    Analytics.logEvent(AnalyticsEvents.onboardingOnboardingEnd);
  }, []);

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<RaisedHands width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        submitOnboardingData(onboardingState, dispatch);
      }}
      textLabel="You made it!! We won’t let you down. Let’s get started and record how you slept last night."
      buttonLabel="Continue"
    />
  );
};

const styles = StyleSheet.create({
  BoldLabelText: {
    fontFamily: 'RubikBold',
    fontSize: scale(20),
  },
  textLabel: {
    lineHeight: 20,
  },
  keyboardAvoidingView: { justifyContent: 'space-around' },
  spacer6: { flex: 0.6 },
  spacer: { flex: 1 },
  none: { display: 'none' },
});
