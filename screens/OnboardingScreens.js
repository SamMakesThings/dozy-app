/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useWindowDimensions, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import GLOBAL from '../utilities/global';
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
import submitOnboardingData from '../utilities/submitOnboardingData';
import registerForPushNotificationsAsync from '../utilities/pushNotifications';

// Define the theme for the file globally
const theme = dozy_theme;

// Define square image size defaults as a percent of width
const imgSizePercent = 0.4;

export const Welcome = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      bbbDisabled
      image={<WaveHello width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('Overview', {
          progressBarPercent: null
        });
      }}
      textLabel="Welcome to Dozy! We'll get you sleeping better in no time."
      buttonLabel="Next"
    />
  );
};

export const Overview = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<LabCoat width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('Asks', {
          progressBarPercent: null
        });
      }}
      textLabel="We use a proven therapy treatment to get you sleeping again. It's drug-free, takes from 4-8 weeks, and is permanent."
      buttonLabel="Next"
    />
  );
};

export const Asks = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Clipboard width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('ISIIntro', {
          progressBarPercent: null
        });
      }}
      textLabel="For this to work, we'll help you maintain a once-daily sleep log and a checkup once per week."
      buttonLabel="Next"
    />
  );
};

export const ISIIntro = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('ISI1', {
          progressBarPercent: 0.14
        });
      }}
      textLabel="To get started, we'll ask you 7 questions to determine the size of your insomnia problem."
      buttonLabel="Next"
    />
  );
};

export const ISI1 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI1 = value;
        navigation.navigate('ISI2', { progressBarPercent: 0.28 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true }
      ]}
      questionLabel="How much difficulty do you have falling asleep?"
    />
  );
};

export const ISI2 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI2 = value;
        navigation.navigate('ISI3', { progressBarPercent: 0.42 });
      }}
      buttonValues={[
        { label: 'No difficulty', value: 0, solidColor: true },
        { label: 'Mild difficulty', value: 1, solidColor: true },
        { label: 'Moderate difficulty', value: 2, solidColor: true },
        { label: 'Severe difficulty', value: 3, solidColor: true },
        { label: 'Extreme difficulty', value: 4, solidColor: true }
      ]}
      questionLabel="How much difficulty do you have *staying* asleep?"
    />
  );
};

export const ISI3 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI3 = value;
        navigation.navigate('ISI4', { progressBarPercent: 0.56 });
      }}
      buttonValues={[
        { label: 'Not a problem', value: 0, solidColor: true },
        { label: 'I rarely wake up too early', value: 1, solidColor: true },
        { label: 'I sometimes wake up too early', value: 2, solidColor: true },
        {
          label: 'I often wake up too early',
          value: 3,
          solidColor: true
        },
        { label: 'I always wake up too early', value: 4, solidColor: true }
      ]}
      questionLabel="How much of a problem do you have with waking up too early?"
    />
  );
};

export const ISI4 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI4 = value;
        navigation.navigate('ISI5', { progressBarPercent: 0.7 });
      }}
      buttonValues={[
        { label: 'Very satisfied', value: 0, solidColor: true },
        { label: 'Satisfied', value: 1, solidColor: true },
        {
          label: 'Could be better, could be worse',
          value: 2,
          solidColor: true
        },
        { label: 'Dissatisfied', value: 3, solidColor: true },
        { label: 'Very dissatisfied', value: 4, solidColor: true }
      ]}
      questionLabel="How satisfied/dissatisfied are you with your current sleep pattern?"
    />
  );
};

export const ISI5 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI5 = value;
        navigation.navigate('ISI6', { progressBarPercent: 0.84 });
      }}
      buttonValues={[
        { label: 'Not at all noticeable', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much noticeable', value: 4, solidColor: true }
      ]}
      questionLabel="How noticeable to others do you think your sleep problem is? (in terms of impairing the quality of your life)"
    />
  );
};

export const ISI6 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.ISI6 = value;
        navigation.navigate('ISI7', { progressBarPercent: 0.95 });
      }}
      buttonValues={[
        { label: 'Not at all worried', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much worried', value: 4, solidColor: true }
      ]}
      questionLabel="How worried are you about your current sleep pattern?"
    />
  );
};

export const ISI7 = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        // Sum ISI scores, store value & navigate accordingly
        const { ISI1, ISI2, ISI3, ISI4, ISI5, ISI6 } = GLOBAL;
        GLOBAL.ISI7 = value;
        GLOBAL.ISITotal = ISI1 + ISI2 + ISI3 + ISI4 + ISI5 + ISI6 + value;
        navigation.navigate('ISIResults', { progressBarPercent: null });
      }}
      buttonValues={[
        { label: 'Not at all interfering', value: 0, solidColor: true },
        { label: 'A little', value: 1, solidColor: true },
        { label: 'Somewhat', value: 2, solidColor: true },
        { label: 'Much', value: 3, solidColor: true },
        { label: 'Very much interfering', value: 4, solidColor: true }
      ]}
      questionLabel="How much does your sleep problem interfere with your daily life? (e.g. tiredness, mood, ability to function at work, concentration, etc.)?"
    />
  );
};

export const ISIResults = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  const severityText = () => {
    if (GLOBAL.ISITotal <= 7) {
      return 'no clinically significant insomnia';
    } else if (GLOBAL.ISITotal <= 14) {
      return 'clinically mild insomnia';
    } else if (GLOBAL.ISITotal <= 21) {
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
          GLOBAL.ISITotal > 7 ? 'ISISignificant' : 'ISINoSignificant',
          {
            progressBarPercent: null
          }
        );
      }}
      textLabel={
        <Text>
          Done! According to the Insomnia Severity Index, you’ve got
          {GLOBAL.ISITotal >= 7 ? '\n' : ' '}
          <Text style={styles.BoldLabelText}>{severityText()}</Text>
        </Text>
      }
      buttonLabel="What's that mean?"
    />
  );
};

export const ISISignificant = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyIntro', {
          progressBarPercent: null
        });
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>
            Clinically significant insomnia{'\n'}
          </Text>
          <Text style={{ lineHeight: scale(18) }}>
            Your insomnia is {GLOBAL.ISITotal >= 14 ? 'definitely' : 'likely'}{' '}
            interfering with your life. However, there&apos;s good news:
            You&apos;re exactly the person our app was designed to help! With
            your support, Dozy can take you from severe insomnia to no insomnia.
          </Text>
        </>
      }
      buttonLabel="Let's get started"
    />
  );
};

export const ISINoSignificant = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Expressionless width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyIntro', {
          progressBarPercent: null
        });
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>No significant insomna{'\n'}</Text>
          <Text style={{ lineHeight: scale(18) }}>
            We&apos;re glad to tell you that you don&apos;t have serious
            problems with insomnia. However, our app isn&apos;t designed for
            you. Our techniques will disrupt your sleep and may not improve it
            much. If you&apos;d still like to use it, be our guest, just be
            warned that it&apos;s designed to help people with severe sleep
            problems, and you may not get much out of it.
          </Text>
        </>
      }
      buttonLabel="Whatever, I'll use it anyway"
    />
  );
};

export const SafetyIntro = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<MonocleEmoji width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetyPills', {
          progressBarPercent: null
        });
      }}
      textLabel="Now let’s check whether it’s safe for you to use this therapy."
      buttonLabel="Next"
    />
  );
};

export const SafetyPills = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.pills = value;
        navigation.navigate(
          value == 'none' ? 'SafetySnoring' : 'SafetyPillsStop',
          { progressBarPercent: null }
        );
      }}
      buttonValues={[
        { label: 'Nope', value: 'none', solidColor: true },
        {
          label: 'Yes, Benzodiazepines (e.g. Xanax)',
          value: 'benzo',
          solidColor: true
        },
        {
          label: 'Yes, non-Benzodiazepines (e.g. Ambien, Lunesta)',
          value: 'nonBenzo',
          solidColor: true
        },
        { label: 'Yes, other or not sure', value: 'other', solidColor: true }
      ]}
      questionLabel="Are you currently taking any sleeping pills?"
    />
  );
};

export const SafetyPillsStop = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<Stop width={imgSize} height={imgSize} />}
      onQuestionSubmit={(result) => {
        navigation.navigate(
          result === 'Continue anyway' ? 'SafetySnoring' : 'SafetyPillsBye',
          {
            progressBarPercent: null
          }
        );
      }}
      longText
      textLabel={
        <>
          <Text style={styles.BoldLabelText}>Hold on there{'\n'}</Text>
          <Text style={{ lineHeight: scale(18) }}>
            For Dozy to work best, it&apos; strongly recommended to stop taking
            sleeping pills before treatment. DON&apos;T DO THIS ON YOUR OWN, as
            stopping use can have withdrawal effects. Talk with your physician
            to plan tapering it off. Once you&apos;ve done that, we can get
            started with fixing your insomnia permanently.
          </Text>
        </>
      }
      buttonLabel="I’ll contact my doctor - follow up w/me"
      bottomGreyButtonLabel="Continue anyway"
    />
  );
};

export const SafetyPillsBye = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<WaveHello width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetySnoring', {
          progressBarPercent: null
        });
      }}
      textLabel="Great! We’ll email & ping you again in four weeks. If you’re off sleeping pills before that, come back anytime and we’ll pick up where we left off."
      onlyBackButton
    />
  );
};

export const SafetySnoring = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.snoring = value;
        navigation.navigate(!value ? 'SafetyLegs' : 'SafetyIllnessWarning', {
          warnAbout: 'sleep apneas',
          nextScreen: 'SafetyLegs'
        });
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true }
      ]}
      questionLabel="Do you snore heavily? Has anyone witnessed prolonged pauses in breathing (apnoeas)?"
    />
  );
};

export const SafetyLegs = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.rls = value;
        navigation.navigate(!value ? 'SafetyParas' : 'SafetyIllnessWarning', {
          warnAbout: 'Restless Leg Syndrome',
          nextScreen: 'SafetyParas'
        });
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true }
      ]}
      questionLabel="Do you have unpleasant tingling or discomfort in the legs, which makes you need to kick or to move? (restless body rather than a racing mind)"
    />
  );
};

export const SafetyParas = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.parasomnias = value;
        navigation.navigate(
          !value ? 'SafetyCatchall' : 'SafetyIllnessWarning',
          { warnAbout: 'parasomnias', nextScreen: 'SafetyCatchall' }
        );
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true }
      ]}
      questionLabel="Do you have any history of nightmares, acting out of dreams, sleepwalking out of the bedroom?"
    />
  );
};

export const SafetyCatchall = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.otherCondition = value;
        navigation.navigate(!value ? 'BaselineIntro' : 'SafetyIllnessWarning', {
          warnAbout: 'such conditions',
          nextScreen: 'BaselineIntro'
        });
      }}
      buttonValues={[
        { label: 'Yes', value: true, solidColor: true },
        { label: 'No', value: false, solidColor: true }
      ]}
      questionLabel="Do you have epilepsy, bipolar disorder, parasomnias, obstructive sleep apnea, or other illnesses that cause excessive daytime sleepiness on their own?"
    />
  );
};

export const SafetyIllnessWarning = ({ navigation, route }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TiredFace width={imgSize} height={imgSize} />}
      onQuestionSubmit={(result) => {
        navigation.navigate(
          result === 'I understand the risks, continue anyway'
            ? route.params.nextScreen
            : 'SafetyPillsBye',
          {
            progressBarPercent: null
          }
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

export const BaselineIntro = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<WarningTriangle width={imgSize} height={imgSize} />}
      onQuestionSubmit={(result) => {
        navigation.navigate(
          result === 'My sleep will be unusual, let’s postpone'
            ? 'BaselineBye'
            : 'DiaryIntro',
          {
            progressBarPercent: null
          }
        );
      }}
      longText
      textLabel={
        <Text
          style={{
            fontSize: 0.05 * useWindowDimensions().width,
            lineHeight: 20
          }}
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

export const BaselineBye = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<WaveHello width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('SafetySnoring', {
          progressBarPercent: null
        });
      }}
      textLabel="No worries! We’ll follow up with you in a week. If you’re ready to start before that, come back anytime and we’ll pick up where we left off."
      onlyBackButton
    />
  );
};

export const DiaryIntro = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<TanBook width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('DiaryHabit', {
          progressBarPercent: 0.2
        });
      }}
      textLabel="Almost there! During treatment, we’ll be tracking your sleep with a sleep diary. It’s critical that you fill this out each morning."
      buttonLabel="Got it - let’s make it easy to remember"
    />
  );
};

export const DiaryHabit = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        GLOBAL.diaryHabitTrigger = value;
        navigation.navigate('DiaryReminder', { progressBarPercent: 0.4 });
      }}
      buttonValues={[
        { label: 'After waking up', value: 'onWake', solidColor: true },
        {
          label: 'After brushing my teeth',
          value: 'onBrushTeeth',
          solidColor: true
        },
        {
          label: 'After eating breakfast',
          value: 'onBreakfast',
          solidColor: true
        },
        { label: 'After taking a shower', value: 'onShower', solidColor: true }
      ]}
      questionLabel="When would you like to log your sleep in the morning?"
    />
  );
};

export const DiaryReminder = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value) => {
        // TODO: Can I just make the arrow function async instead of below
        async function setPushToken() {
          GLOBAL.expoPushToken = await registerForPushNotificationsAsync();
        }
        if (value != false) {
          GLOBAL.diaryReminderTime = value;
          setPushToken();
        } else {
          null;
        }
        navigation.navigate('CheckinScheduling', { progressBarPercent: 0.6 });
      }}
      questionLabel="What time do you usually do that? (we'll send you a gentle reminder)"
      bottomGreyButtonLabel="Don't set a reminder"
      mode="time"
    />
  );
};

export const CheckinScheduling = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={new Date(new Date().getTime() + 86400000 * 7)}
      onQuestionSubmit={(value) => {
        // TODO: Add validation to ensure date is far out enough for data colleciton
        // Another option - wait until 7 sleep logs are collected before allowing continue
        GLOBAL.firstCheckinTime = value;
        navigation.navigate('PaywallPlaceholder', { progressBarPercent: 0.8 });
      }}
      questionLabel="When would you like to schedule your first weekly check-in? (Check-ins take 5-10 minutes and introduce you to new treatment techniques based on your sleep patterns.)"
      buttonLabel="I've picked a date 7+ days from today"
      mode="datetime"
    />
  );
};

export const PaywallPlaceholder = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<MonocleEmoji width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        navigation.navigate('OnboardingEnd', {
          progressBarPercent: 1
        });
      }}
      textLabel="...so this is where I'll put the 'get a subscription' message, but you don't need to pay that.  :)"
      buttonLabel="Nice"
    />
  );
};

export const OnboardingEnd = ({ navigation }) => {
  let imgSize = imgSizePercent * useWindowDimensions().width;
  const { dispatch, finishOnboarding } = React.useContext(AuthContext);
  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<RaisedHands width={imgSize} height={imgSize} />}
      onQuestionSubmit={() => {
        submitOnboardingData(dispatch);
        finishOnboarding();
      }}
      textLabel="You made it!! We won’t let you down. Let’s get started and record how you slept last night."
      buttonLabel="Continue"
    />
  );
};

const styles = StyleSheet.create({
  BoldLabelText: {
    fontFamily: 'RubikBold',
    fontSize: scale(20)
  }
});
