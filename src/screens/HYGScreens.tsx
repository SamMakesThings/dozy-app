import React from 'react';
import { useWindowDimensions } from 'react-native';
import moment from 'moment';
import { NavigationProp } from '@react-navigation/native';
import IconExplainScreen from '../components/screens/IconExplainScreen';
import WizardContentScreen from '../components/screens/WizardContentScreen';
import MultiButtonScreen from '../components/screens/MultiButtonScreen';
import DateTimePickerScreen from '../components/screens/DateTimePickerScreen';
import GLOBAL from '../utilities/global';
import { dozy_theme } from '../config/Themes';
import FemaleDoctor from '../../assets/images/FemaleDoctor.svg';
import BarChart from '../../assets/images/BarChart.svg';
import TanBook from '../../assets/images/TanBook.svg';
import ThumbsUp from '../../assets/images/ThumbsUp.svg';
import Clipboard from '../../assets/images/Clipboard.svg';
import RaisedHands from '../../assets/images/RaisedHands.svg';
import submitCheckinData from '../utilities/submitCheckinData';
import refreshUserData from '../utilities/refreshUserData';
import { ErrorObj } from '../types/error';
import Feedback from '../utilities/feedback.service';
import Auth from '../utilities/auth.service';
import { useSleepLogsStore } from '../utilities/sleepLogsStore';
import { useUserDataStore } from '../utilities/userDataStore';

const theme: any = dozy_theme; // Define the theme for the file globally
// 'any' type for now since it's getting an expected something from Draftbit that's breaking.

// Define an interface for HYG flow state (SHI score & next checkin info)
const HYGState = {
  nextCheckinTime: new Date(),
  treatmentPlan: [{ started: false, module: 'deleteme' }],
  SHI1: 0,
  SHI2: 0,
  SHI3: 0,
  SHI4: 0,
  SHI4a: 'none',
  SHI5: 0,
  SHI6: 0,
  SHI7: 0,
  SHI8: 0,
  SHI9: 0,
  SHIScore: 0,
};

const hygLabels = {
  SHI2: {
    inSentence: 'late night exercise',
  },
  SHI4: {
    inSentence: 'substance use',
  },
  SHI5: {
    inSentence: 'other nighttime activities',
  },
  SHI7: {
    inSentence: 'uncomfortable bed',
  },
  SHI8: {
    inSentence: 'uncomfortable bedroom environment',
  },
  SHI9: {
    inSentence: 'doing important work before bedtime',
  },
};

let hygModulesToVisit: string[] = [];
const visitedBedroomEnvSections: string[] = [];

const imgSizePercent = 0.4; // Define square image size defaults as a percent of width
let imgSize = 0; // This value is replaced on the first screen to adjust for window width

interface Props {
  // Define Props type for all screens in this flow
  navigation: NavigationProp<any>;
}

function goToNextCateogry(navigation: NavigationProp<any>) {
  // Function to navigate to the next category of HYG screens
  const nextModule = hygModulesToVisit.shift();
  if (nextModule) {
    navigation.navigate(nextModule + 'Begin', { progressBarPercent: 0.6 });
  } else {
    navigation.navigate('HYGReview', { progressBarPercent: 0.95 });
  }
}

export const Welcome: React.FC<Props> = ({ navigation }) => {
  imgSize = imgSizePercent * useWindowDimensions().width;

  return (
    <IconExplainScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      image={<FemaleDoctor width={imgSize} height={imgSize * 1.2} />}
      onQuestionSubmit={() => {
        navigation.navigate('SRTTitrationStart', {
          progressBarPercent: 0.08,
        });
      }}
      textLabel="Welcome back! This week we'll address some of your sleep hygiene-related issues - things like light, temperature, and partners/pets. But first, let's review your sleep and how Dozy has been going for you so far."
    />
  );
};

// SRT titration screens are defined in the navigator file for modularity.
// First screen to navigate to is 'SRTTitrationStart'
// Screen it targets for return navigation is 'TreatmentPlan'

export const TreatmentPlan: React.FC<Props> = ({ navigation }) => {
  const sleepLogs = useSleepLogsStore((state) => state.sleepLogs);

  // Trim sleepLogs to only show most recent 12
  const recentSleepLogs = sleepLogs.slice(0, 12);

  // Find top 3 sleep disturbance tags.
  const logTagsFrequencyObject: {
    [key: string]: number;
  } = recentSleepLogs.reduce(
    (
      tagsObject: { [key: string]: number },
      sleepLog: { tags: Array<string> },
    ) => {
      const newTagsObject = tagsObject;
      sleepLog.tags.map((tag) => {
        newTagsObject[tag] = newTagsObject[tag] ? newTagsObject[tag] + 1 : 1; // if exists, increment. Otherwise, start with 1
      });
      return newTagsObject;
    },
    { nothing: -20 },
  ); // Add nothing way negative so it's excluded from the highest frequency
  // Then find the 3 highest from the object. Put them in an array as strings.
  const mostCommonTags = Object.keys(logTagsFrequencyObject)
    .sort(function (a, b) {
      return logTagsFrequencyObject[b] - logTagsFrequencyObject[a];
    })
    .slice(0, 3);
  // Turn it into a nice string for this screen
  const tagsString =
    mostCommonTags.length === 3
      ? `${mostCommonTags[0]}, ${mostCommonTags[1]}, and ${mostCommonTags[2]}`
      : `light, heat, noise, and other issues`;

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('HYGIntro', {
          progressBarPercent: 0.4,
        });
      }}
      titleLabel="This week: Sleep hygiene improvements"
      textLabel={`Today we'll be addressing your sleep problems caused by ${tagsString}.`}
      buttonLabel="Next"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const HYGIntro: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('HYGBenefits', {
          progressBarPercent: 0.44,
        });
      }}
      titleLabel="You've probably heard of sleep hygiene before."
      textLabel="You might've even tried some tricks from it (reduce caffeine, reduce nightly electronics use, etc). However, as you may have learned, sleep hygiene tips on their own aren't usually enough to fix insomnia."
      buttonLabel="Why talk about it then?"
      flexibleLayout
    >
      <TanBook width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const HYGBenefits: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHIIntro', {
          progressBarPercent: 0.48,
        });
      }}
      textLabel="Fortunately, making strategic sleep hygiene improvements can improve sleep quality, help prevent relapse, and boost the efficacy of other techniques at the same time!"
      buttonLabel="Got it"
      flexibleLayout
    >
      <ThumbsUp width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHIIntro: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHI1', {
          progressBarPercent: 0.52,
        });
      }}
      textLabel={`To get started, we'll ask a few lifestyle questions to get a better idea of how to help you.
      
Please answer each question with how true the statement has been for you over the last week.`}
      buttonLabel="Begin"
      flexibleLayout
    >
      <Clipboard width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI1: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI1 = value as number;
        navigation.navigate('SHI2', { progressBarPercent: 0.56 });
      }}
      questionLabel="I think, plan, or worry when I am in bed."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI2: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI2 = value as number;
        navigation.navigate('SHI3', { progressBarPercent: 0.6 });
      }}
      questionLabel="I exercise to the point of sweating within 1 hr of going to bed."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI3: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI3 = value as number;
        navigation.navigate('SHI4', { progressBarPercent: 0.64 });
      }}
      questionLabel="I stay in bed longer than I should two or three times a week."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI4: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI4 = value as number;
        if ((value as number) >= 2) {
          // If uses substance more than rarely, ask which
          navigation.navigate('SHI4a', { progressBarPercent: 0.68 });
        } else {
          HYGState.SHI4a = 'none';
          navigation.navigate('SHI5', { progressBarPercent: 0.72 });
        }
      }}
      questionLabel="I use alcohol, tobacco/nicotine, or caffeine within 4hrs of going to bed or after going to bed."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI4a: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI4a = value as string;
        navigation.navigate('SHI5', { progressBarPercent: 0.72 });
      }}
      questionLabel="Which would you say you use most often before going to bed?"
      buttonValues={[
        { label: 'Alcohol', value: 'alcohol', solidColor: false },
        { label: 'Caffeine', value: 'caffeine', solidColor: false },
        { label: 'Tobacco/Nicotine', value: 'nicotine', solidColor: false },
      ]}
    />
  );
};

export const SHI5: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI5 = value as number;
        navigation.navigate('SHI6', { progressBarPercent: 0.76 });
      }}
      questionLabel="I do something that may wake me up before bedtime."
      questionSubtitle="(for example: play video games, use social media, clean intensely)."
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI6: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI6 = value as number;
        navigation.navigate('SHI7', { progressBarPercent: 0.8 });
      }}
      questionLabel="I go to bed feeling stressed, angry, upset, or nervous."
      questionSubtitle="Please rate how true each statement has been for you over the last week."
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI7: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI7 = value as number;
        navigation.navigate('SHI8', { progressBarPercent: 0.84 });
      }}
      questionLabel="I sleep on an uncomfortable bed."
      questionSubtitle="(for example: poor mattress or pillow, too many or not enough blankets)"
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI8: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI8 = value as number;
        navigation.navigate('SHI9', { progressBarPercent: 0.88 });
      }}
      questionLabel="I sleep in an uncomfortable bedroom."
      questionSubtitle="(for example: too bright, too stuffy, too hot, too cold, or too noisy)"
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHI9: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        HYGState.SHI9 = value as number;
        navigation.navigate('SHIResult', { progressBarPercent: 0.92 });
      }}
      questionLabel="I do important work before bedtime."
      questionSubtitle="(for example: pay bills, plan, or study)"
      buttonValues={[
        { label: 'Never', value: 0, solidColor: false },
        { label: 'Rarely', value: 1, solidColor: false },
        { label: 'Sometimes', value: 2, solidColor: false },
        { label: 'Frequently', value: 3, solidColor: false },
        { label: 'Always', value: 4, solidColor: false },
      ]}
    />
  );
};

export const SHIResult: React.FC<Props> = ({ navigation }) => {
  // If nothing is undefined (shouldn't be), add answers for the total SHI score
  HYGState.SHIScore =
    HYGState.SHI1 +
    HYGState.SHI2 +
    HYGState.SHI3 +
    HYGState.SHI4 +
    HYGState.SHI5 +
    HYGState.SHI6 +
    HYGState.SHI7 +
    HYGState.SHI8 +
    HYGState.SHI9;

  // Filter out any keys from hygstate where the numerical value is 2 or lower
  hygModulesToVisit = Object.keys(HYGState).filter((key) => {
    const keyVal = HYGState[key as keyof typeof HYGState];

    // Exclude unused values from category navigation
    if (Object.keys(hygLabels).includes(key) === false) {
      return false;
    }

    return typeof keyVal == 'number' && keyVal > 2;
  });

  // If there aren't any modules 3 or higher, lower to 2
  if (hygModulesToVisit.length == 0) {
    hygModulesToVisit = Object.keys(HYGState).filter((key) => {
      const keyVal = HYGState[key as keyof typeof HYGState];

      // Exclude these four values from category navigation
      if (Object.keys(hygLabels).includes(key) === false) {
        return false;
      }

      return typeof keyVal == 'number' && keyVal > 1;
    });
  }

  // Create an in-sentence string reviewing the modules to visit, separated by commas, based on hygModulesToVisit, using hygLabels
  const sentenceLabelForAllHygModules = hygModulesToVisit
    .map((key, index) => {
      if (Object.keys(hygLabels).includes(key) === false) {
        return '';
      }

      // Add an "and" if last item
      if (hygModulesToVisit.length === 1) {
        return hygLabels[key as keyof typeof hygLabels].inSentence;
      } else if (index === hygModulesToVisit.length - 1) {
        return `and ${hygLabels[key as keyof typeof hygLabels].inSentence}`;
      }

      return hygLabels[key as keyof typeof hygLabels].inSentence;
    })
    .join(hygModulesToVisit.length === 2 ? ' ' : ', ');

  if (hygModulesToVisit.length === 0) {
    return (
      <WizardContentScreen
        theme={theme}
        bottomBackButton={() => navigation.goBack()}
        onQuestionSubmit={() => {
          navigation.navigate('CheckinScheduling', {
            progressBarPercent: 0.985,
          });
        }}
        titleLabel="You've finished the sleep hygiene index!"
        textLabel={`You got a total score of ${HYGState.SHIScore} out of 36. That's pretty good! It's unlikely sleep hygiene is a major contributor to your sleep issues. Let's finish the module for this week and schedule your next checkin.`}
        buttonLabel="OK"
        flexibleLayout
      >
        <BarChart width={imgSize} height={imgSize} />
      </WizardContentScreen>
    );
  } else {
    return (
      <WizardContentScreen
        theme={theme}
        bottomBackButton={() => navigation.goBack()}
        onQuestionSubmit={() => {
          goToNextCateogry(navigation);
        }}
        titleLabel={`You've finished the sleep hygiene index!`}
        textLabel={`There are some improvements to be made, but we can help. Let's spend the next few minutes addressing your ${sentenceLabelForAllHygModules}.`}
        buttonLabel="Continue"
        flexibleLayout
      >
        <BarChart width={imgSize} height={imgSize} />
      </WizardContentScreen>
    );
  }

  // return (
  //   <WizardContentScreen
  //     theme={theme}
  //     bottomBackButton={() => navigation.goBack()}
  //     onQuestionSubmit={() => {
  //       navigation.navigate('HYGReview', {
  //         progressBarPercent: 0.96,
  //       });
  //     }}
  //     titleLabel={`You scored a ${HYGState.SHIScore} on the shortened Sleep Hygiene Index (out of 36).`}
  //     textLabel="There are some improvements to be made, but we can help. Send us a message after you've scheduled your next checkin and we'll work out a plan together."
  //     buttonLabel="OK"
  //     flexibleLayout
  //   >
  //     <BarChart width={imgSize} height={imgSize} />
  //   </WizardContentScreen>
  // );
};

/*

SHI2 - late night exercise flow

*/

export const SHI2Begin: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHI2CommitAsk', {
          progressBarPercent: 0.96,
        });
      }}
      titleLabel="So you're a late night exerciser."
      textLabel="First off, good on you for staying in shape! But you should consider changing the timing of your exercise. By working out so close to bedtime, you could be making it harder to fall asleep."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI2CommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI2Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI2NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Are you willing to change the timing of your exercise routine?"
      textLabel="To avoid waking your body up too close to bedtime."
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI2Commit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Great!"
      textLabel="Let's continue to track how late-night exercise affects your sleep in the meantime."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI2NoCommit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Ok, no worries."
      textLabel="We'll continue tracking how late-night exercise affects your sleep in the meantime and will follow up with you if necessary."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

/*

SHI4 - substance use - alcohol, caffeine, nicotene

*/

export const SHI4Begin: React.FC<Props> = ({ navigation }) => {
  let textLabel;

  switch (HYGState.SHI4a) {
    case 'alcohol':
      textLabel = `It's true that alcohol can make you fall asleep faster. And that's great! However, there's a catch: alcohol is one of the most powerful suppressors of REM sleep there is.`;
      break;
    case 'caffeine':
      textLabel = `Caffeine works by temporarily blocking some of the sleep-inducing circuits in your brain. This is great in the morning when you need to be awake for work, but less so when you're struggling with insomnia.`;
      break;
    case 'nicotine':
      textLabel = `Nicotine can help you relax, and it's certainly not something you can just stop doing on a whim. Nor is it necessarily a good idea to stop cold turkey - suddenly quitting smoking can actually make insomnia worse.`;
      break;
    default:
      textLabel = ``;
      break;
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHI4Explain', {
          progressBarPercent: 0.96,
        });
      }}
      titleLabel={`Using ${HYGState.SHI4a} close to bedtime isn't great for sleep.`}
      textLabel={textLabel}
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI4Explain: React.FC<Props> = ({ navigation }) => {
  let titleLabel;
  let textLabel;

  switch (HYGState.SHI4a) {
    case 'alcohol':
      titleLabel = `REM sleep is critical for good sleep quality.`;
      textLabel = `So yes, alcohol will make you fall asleep faster, but your sleep quality will be lower, and you'll be far less rested the next day. To maximize restful sleep, it's helpful to avoid acohol within a few hours of bedtime.`;
      break;
    case 'caffeine':
      titleLabel = `Even if you're quite tolerant to caffeine,`;
      textLabel = `...having it in your system at bedtime can make it harder to fall asleep and even reduce your sleep quality, without you being aware of it!`;
      break;
    case 'nicotine':
      titleLabel = `Avoiding nicotene for 2+ hours before bed`;
      textLabel = `...and not smoking during the night, will help avoid any nicotene-related sleep disruptions or hurt your nighttime restfulness.`;
      break;
    default:
      titleLabel = ``;
      textLabel = ``;
      break;
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHI4CommitAsk', {
          progressBarPercent: 0.96,
        });
      }}
      titleLabel={titleLabel}
      textLabel={textLabel}
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI4CommitAsk: React.FC<Props> = ({ navigation }) => {
  let titleLabel;
  let textLabel;

  switch (HYGState.SHI4a) {
    case 'alcohol':
      titleLabel = `Think you can try reducing late-night drinks this week?`;
      textLabel = `By reducing late-night alcohol or moving it earlier in the day (3+ hours before bedtime), we can make it easier for your brain to sleep well.`;
      break;
    case 'caffeine':
      titleLabel = `Think you can try reducing late-night caffeine this week?`;
      textLabel = `A night of late caffeine-induced wakefulness once in a rare while is ok, but as a habit it's damaging to your circadian rhythm.`;
      break;
    case 'nicotine':
      titleLabel = `Think you can try reducing late-night nicotine this week?`;
      textLabel = `By adjusting the timing of nicotene to 2+ hours before bedtime, we can make it easier for an insomnia-prone brain to fall asleep.`;
      break;
    default:
      titleLabel = ``;
      textLabel = ``;
      break;
  }

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI4Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI4NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel={titleLabel}
      textLabel={textLabel}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI4Commit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Great!"
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI4NoCommit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Ok, no worries."
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

/*

SHI5 - late night exercise flow

*/

export const SHI5Begin: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHI5CommitAsk', {
          progressBarPercent: 0.96,
        });
      }}
      titleLabel="Seems you do some kind of wakeful activity before bed."
      textLabel={`Doing mentally or physically active things around bedtime (like video games, social media, or cleaning) can make it harder for you to fall asleep. \n\nThose activities can get your brain stuck in "productive mode". Without some natural wind-down time, your brain might still be in "productive mode" even when you're trying to sleep.`}
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI5CommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI5Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI5NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Think you can try reducing evening activity this week?"
      textLabel={`By reducing these activities or moving them away from bedtime, we can make the rest of your program more effective. For 10-30 minutes before bedtime, try activities that stimulate the brain less (like reading a book, watching a movie, or journaling) instead of things like like social media, video games, or doing work. `}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI5Commit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Great!"
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI5NoCommit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Ok, no worries."
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

/*

SHI7 - uncomfortable bed

*/

export const SHI7Begin: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        // HYGState.SHI6 = value as number;
        switch (value) {
          case 'mattress':
            navigation.navigate('SHI7MattressCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          case 'pillow':
            navigation.navigate('SHI7PillowCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          case 'blankets':
            navigation.navigate('SHI7BlanketsCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          default:
            navigation.navigate('SHI7OtherCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
        }
        navigation.navigate('SHI7MattressCommitAsk', {
          progressBarPercent: 0.8,
        });
      }}
      questionLabel="What about your bed is making you most uncomfortable?"
      questionSubtitle={`So your bed is uncomfortable. It makes sense that having an uncomfortable bed can interfere with quality sleep. Buying new gear can be expensive, but helpful. `}
      buttonValues={[
        { label: 'My mattress', value: 'mattress', solidColor: false },
        { label: 'My pillow', value: 'pillow', solidColor: false },
        { label: 'My blankets', value: 'blankets', solidColor: false },
        { label: 'Something else', value: 'other', solidColor: false },
      ]}
    />
  );
};

export const SHI7MattressCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI7Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI7NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to getting a new mattress this week?"
      textLabel={`A bad mattress can be stiff, arch your back, and more. New foam mattresses can be pretty cheap too.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI7PillowCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI7Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI7NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to getting a new pillow this week?"
      textLabel={`A bad pillow can certainly cause a sore neck, among other things. New pillows can be pretty cheap on Amazon too.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI7BlanketsCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI7Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI7NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to getting a new blanket this week?"
      textLabel={`A bad blanket (or bad quantity of blankets) can leave you too cold, too hot, or too itchy.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI7OtherCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI7Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI7NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to improving your comfort in bed this week?"
      textLabel={`Depends on what your issues involve. Definitely consult Google or ChatGPT for ideas, but don't take what they say as medical advice.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI7Commit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Great!"
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI7NoCommit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Ok, no worries."
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

/*

SHI8 - uncomfortable bedroom environment

*/

export const SHI8Begin: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHI8Disambiguate', {
          progressBarPercent: 0.8,
        });
      }}
      titleLabel="Your bedroom environment might be a problem."
      textLabel={`Insomnia is primarily psychological. However, a poor sleep environment can perpetuate insomnia or even make it worse. \n\nYour bedroom environment likely isn't the sole cause of your issues, but it may make it harder to get back to sleeping well.`}
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI8Disambiguate: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        // HYGState.SHI6 = value as number;
        switch (value) {
          case 'light':
            navigation.navigate('SHI8LightCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          case 'noise':
            navigation.navigate('SHI8NoiseCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          case 'temp':
            navigation.navigate('SHI8TempCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          case 'partner':
            navigation.navigate('SHI8PartnerCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          case 'pets':
            navigation.navigate('SHI8PetsCommitAsk', {
              progressBarPercent: 0.8,
            });
            break;
          case 'continue':
            goToNextCateogry(navigation);
            break;
        }
        navigation.navigate('SHI8LightCommitAsk', {
          progressBarPercent: 0.8,
        });
      }}
      questionLabel="Which of these has been causing you the most issues?"
      buttonValues={[
        {
          label: 'Light',
          value: 'light',
          solidColor: false,
          disabled: visitedBedroomEnvSections.includes('light'),
        },
        {
          label: 'Noise',
          value: 'noise',
          solidColor: false,
          disabled: visitedBedroomEnvSections.includes('noise'),
        },
        {
          label: 'Temperature',
          value: 'temp',
          solidColor: false,
          disabled: visitedBedroomEnvSections.includes('temp'),
        },
        {
          label: 'Partner',
          value: 'partner',
          solidColor: false,
          disabled: visitedBedroomEnvSections.includes('partner'),
        },
        {
          label: 'Pets',
          value: 'pets',
          solidColor: false,
          disabled: visitedBedroomEnvSections.includes('pets'),
        },
        {
          label: 'Continue to next section',
          value: 'continue',
          solidColor: true,
        },
      ]}
    />
  );
};

export const SHI8LightBegin: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        navigation.navigate('SHI8LightCommitAsk', {
          progressBarPercent: 0.96,
        });
      }}
      textLabel={`Light in your bedroom can make it harder to fall asleep and cause you to wake up way too early. Conversely, a darker room can help you fall asleep and stay asleep.`}
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI8LightDisambiguation: React.FC<Props> = ({ navigation }) => {
  return (
    <MultiButtonScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(value?: string | number | boolean) => {
        // HYGState.SHI6 = value as number;
        switch (value) {
          case 'light':
            navigation.navigate('SHI8LightCommitAsk', {
              progressBarPercent: 0.96,
            });
            break;
          case 'dark':
            navigation.navigate('SHI8LightCommitAsk', {
              progressBarPercent: 0.96,
            });
            break;
        }
      }}
      questionLabel="Which of these sounds most appealing to you?"
      questionSubtitle="You can darken your bedroom environment (by getting blackout curtains, covering LEDs, etc.) or reduce light entering your eyes via a sleep mask."
      buttonValues={[
        {
          label: 'Darken bedroom via curtains',
          value: 'curtains',
          solidColor: false,
        },
        {
          label: 'Try a sleep mask',
          value: 'mask',
          solidColor: false,
        },
      ]}
    />
  );
};

export const SHI8LightCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        // Mark as visited
        visitedBedroomEnvSections.push('light');

        if (res === undefined) {
          navigation.navigate('SHI8Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI8NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to getting a new mattress this week?"
      textLabel={`A bad mattress can be stiff, arch your back, and more. New foam mattresses can be pretty cheap too.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI8PillowCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI8Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI8NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to getting a new pillow this week?"
      textLabel={`A bad pillow can certainly cause a sore neck, among other things. New pillows can be pretty cheap on Amazon too.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI8BlanketsCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI8Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI8NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to getting a new blanket this week?"
      textLabel={`A bad blanket (or bad quantity of blankets) can leave you too cold, too hot, or too itchy.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI8OtherCommitAsk: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === undefined) {
          navigation.navigate('SHI8Commit', {
            progressBarPercent: 0.96,
          });
        } else {
          navigation.navigate('SHI8NoCommit', {
            progressBarPercent: 0.96,
          });
        }
      }}
      titleLabel="Can you commit to improving your comfort in bed this week?"
      textLabel={`Depends on what your issues involve. Definitely consult Google or ChatGPT for ideas, but don't take what they say as medical advice.`}
      buttonLabel="Yes"
      bottomGreyButtonLabel="No"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI8Commit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Great!"
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const SHI8NoCommit: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        goToNextCateogry(navigation);
      }}
      titleLabel="Ok, no worries."
      textLabel="Let's move on to the next category."
      buttonLabel="Continue"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

/* 

Final meta flows

*/

export const HYGReview: React.FC<Props> = ({ navigation }) => {
  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={(res?: string) => {
        if (res === 'Wait, I have questions') {
          navigation.navigate('TreatmentReview', {
            module: 'HYG',
          });
        } else {
          navigation.navigate('CheckinScheduling', {
            progressBarPercent: 0.985,
          });
        }
      }}
      titleLabel="So, here's the plan this week:"
      textLabel="Message us (in the Support tab) and we'll give you 1:1 advice on improving your sleep hygiene. Stick to your target sleep schedule, and continue any other techniques you've learned. Can you recommit to following the care plan this week?"
      buttonLabel="Ok, I can do it this week"
      bottomGreyButtonLabel="Wait, I have questions"
      flexibleLayout
    >
      <FemaleDoctor width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};

export const CheckinScheduling: React.FC<Props> = ({ navigation }) => {
  return (
    <DateTimePickerScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      defaultValue={
        new Date(
          new Date().getTime() + 86400000 * 7,
        ) /* Default date of 7 days from today */
      }
      onQuestionSubmit={(value: Date | boolean) => {
        HYGState.nextCheckinTime = value as Date;
        navigation.navigate('HYGEnd', { progressBarPercent: 1 });
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
      questionLabel="Last step: When would you like your next weekly check-in?"
      questionSubtitle="Check-ins take 5-10 minutes and adjust care based on your sleep patterns. A new technique is usually introduced weekly."
      buttonLabel="I've picked a date 7+ days from today"
      mode="datetime"
    />
  );
};

export const HYGEnd: React.FC<Props> = ({ navigation }) => {
  const { state, dispatch } = Auth.useAuth();
  const userData = useUserDataStore((userState) => userState.userData);
  const { setShowingFeedbackWidget } = Feedback.useFeedback();

  // Create reminder object for next checkin
  const reminderObject = {
    expoPushToken: userData.reminders.expoPushToken,
    title: 'Next check-in is ready',
    body: 'Open the app now to get started',
    type: 'CHECKIN_REMINDER',
    time: HYGState.nextCheckinTime,
    enabled: true,
  };

  return (
    <WizardContentScreen
      theme={theme}
      bottomBackButton={() => navigation.goBack()}
      onQuestionSubmit={() => {
        // Submit checkin data, refresh app state
        if (!state.userId) throw new Error();
        submitCheckinData({
          userId: state.userId,
          checkinPostponed: false,
          nextCheckinDatetime: HYGState.nextCheckinTime,
          lastCheckinDatetime: new Date(),
          nextCheckinModule: GLOBAL.treatmentPlan.filter(
            (v: { started: boolean; module: string }) =>
              v.started === false && v.module !== 'HYG',
          )[0].module,
          lastCheckinModule: 'HYG',
          targetBedTime: GLOBAL.targetBedTime,
          targetWakeTime: GLOBAL.targetWakeTime,
          targetTimeInBed: GLOBAL.targetTimeInBed,
          additionalCheckinData: {
            SHI1: HYGState.SHI1,
            SHI2: HYGState.SHI2,
            SHI3: HYGState.SHI3,
            SHI4: HYGState.SHI4,
            SHI4a: HYGState.SHI4a,
            SHI5: HYGState.SHI5,
            SHI6: HYGState.SHI6,
            SHI7: HYGState.SHI7,
            SHI8: HYGState.SHI8,
            SHI9: HYGState.SHI9,
            SHIScore: HYGState.SHIScore,
          },
          reminderObject: reminderObject,
        });
        navigation.navigate('App');
        refreshUserData(dispatch);
        setShowingFeedbackWidget(true);
      }}
      textLabel="Well done! You've taken one more step towards sleeping through the night."
      buttonLabel="Finish"
    >
      <RaisedHands width={imgSize} height={imgSize} />
    </WizardContentScreen>
  );
};
