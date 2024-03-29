import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
  LayoutAnimation,
} from 'react-native';
import { ScreenContainer } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { LinkCard } from '../components/LinkCard';
import CurrentTreatmentsCard from '../components/CurrentTreatmentsCard';
// import TasksCard from '../components/TasksCard';
import { CardContainer } from '../components/CardContainer';
import { TargetSleepScheduleCard } from '../components/TargetSleepScheduleCard';
import IconTitleSubtitleButton from '../components/IconTitleSubtitleButton';
import { TreatmentPlanCard } from '../components/TreatmentPlanCard';
import FeedbackWidget from '../components/FeedbackWidget';
import { dozy_theme } from '../config/Themes';
import treatments from '../constants/Treatments';
import { formatDateAsTime } from '../utilities/formatDateAsTime';
import planTreatmentModules from '../utilities/planTreatmentModules';
import GLOBAL from '../utilities/global';
import Feedback from '../utilities/feedback.service';
import submitFeedback from '../utilities/submitFeedback';
import Notification from '../utilities/notification.service';
import { Navigation } from '../types/custom';
import Clipboard from '../../assets/images/Clipboard.svg';
import { useSleepLogsStore } from '../utilities/sleepLogsStore';
import { useUserDataStore } from '../utilities/userDataStore';

export const TreatmentScreen: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  const theme = dozy_theme;
  const { showingFeedbackWidget, isFeedbackSubmitted, setFeedbackSubmitted } =
    Feedback.useFeedback();
  const [rate, setRate] = useState(0);
  const [feedback, setFeedback] = useState('');
  const sleepLogs = useSleepLogsStore((logsState) => logsState.sleepLogs);
  const userData = useUserDataStore((userDataState) => userDataState.userData);

  const onSubmitFeedback = useCallback((): void => {
    submitFeedback(rate, feedback);
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 100,
    });
    setFeedbackSubmitted(true);
  }, [rate, feedback]);

  // If state is available, show screen. Otherwise, show loading indicator.
  if (sleepLogs && userData?.currentTreatments) {
    // Calculate the full treatment plan and store it in static global state
    const treatmentPlan = planTreatmentModules({
      sleepLogs: sleepLogs,
      currentTreatments: userData.currentTreatments,
    });
    GLOBAL.treatmentPlan = treatmentPlan;

    // Get current treatment module string from state
    const currentModule = userData.currentTreatments.currentModule;

    // Compute current module's progress percent based on dates
    // Make sure it doesn't go over 100%
    const nextCheckinTime = userData.nextCheckin.nextCheckinDatetime
      .toDate()
      .getTime();
    const lastCheckinTime = userData.currentTreatments.lastCheckinDatetime
      .toDate()
      .getTime();
    const countOfLogsInCurrentCheckin = sleepLogs.filter((it) =>
      moment(lastCheckinTime).isSameOrBefore(it.upTime.toDate()),
    ).length;
    let progressPercent =
      currentModule === 'BSL'
        ? Math.round((countOfLogsInCurrentCheckin / 7) * 100)
        : ~~(nextCheckinTime > lastCheckinTime
            ? (100 *
                (nextCheckinTime -
                  lastCheckinTime -
                  (nextCheckinTime - Date.now()))) /
              (nextCheckinTime - lastCheckinTime)
            : 100);
    progressPercent = Math.min(100, progressPercent);

    const todos = useMemo(
      () =>
        treatments[currentModule].todos.map((task) => ({
          name: task,
          completed:
            task === 'Record 7 nights of sleep in your sleep diary' &&
            countOfLogsInCurrentCheckin >= 7
              ? true
              : false,
        })),
      [currentModule, countOfLogsInCurrentCheckin],
    );

    // Estimate treatment completion date & % progress based on treatmentPlan
    // const estCompletionDate = treatmentPlan[treatmentPlan.length - 1].estDate;
    const modulesCompleted = treatmentPlan.filter(
      (module) => module.started === true,
    ).length;
    const percentTreatmentCompleted =
      parseFloat((modulesCompleted / treatmentPlan.length).toFixed(2)) * 1; // Parsefloat added to make TS happy

    // Strip time from next checkin datetime to determine whether to show checkin button
    const isCheckinDue =
      moment(userData?.currentTreatments.nextCheckinDatetime.toDate())
        .startOf('date')
        .isSameOrBefore(new Date()) && sleepLogs.length >= 7;

    // Maybe remove CHECKIN_REMINDER push notification
    useEffect(() => {
      if (!isCheckinDue) {
        Notification.removeNotificationsFromTrayByType('CHECKIN_REMINDER');
      }
    }, [isCheckinDue]);

    return (
      <ScreenContainer hasSafeArea={true} scrollable={true} style={styles.Root}>
        <View style={styles.View_ContentContainer}>
          <Clipboard
            style={styles.Icon_Clipboard}
            width={scale(80)}
            height={scale(80)}
          />
          {isCheckinDue &&
            treatments[userData.nextCheckin.treatmentModule]?.ready && (
              <IconTitleSubtitleButton
                titleLabel="Check in now!"
                subtitleLabel="Press here to begin the next module"
                backgroundColor={theme.colors.primary}
                icon={
                  <Ionicons
                    name="ios-clipboard"
                    size={scale(35)}
                    color={theme.colors.secondary}
                  />
                }
                badge
                onPress={() =>
                  navigation.navigate(userData.nextCheckin.treatmentModule)
                }
              />
            )}
          {showingFeedbackWidget && (
            <FeedbackWidget
              style={styles.FeedbackWidget}
              rate={rate}
              submitted={isFeedbackSubmitted}
              onRateChange={setRate}
              onFeedbackChange={setFeedback}
              onSubmit={onSubmitFeedback}
            />
          )}
          <CurrentTreatmentsCard
            progressPercent={progressPercent}
            linkTitle={treatments[currentModule].title}
            linkSubtitle={treatments[currentModule].subTitle}
            linkImage={treatments[currentModule].image}
            todosArray={todos}
            onPress={() => {
              if (currentModule == 'BSL') {
                // If user is collecting baseline, go to log entry instead of FAQ
                navigation.navigate('SleepDiaryEntry');
              } else {
                navigation.navigate('TreatmentReview', {
                  module: currentModule,
                });
              }
            }}
          />
          {/* Add new todo card */}
          {/* <TouchableOpacity
            disabled={currentModule !== 'BSL'}
            onPress={() => navigation.navigate('SleepDiaryEntry')}
          >
            <TasksCard todosArray={treatments[currentModule].todos} />
          </TouchableOpacity> */}
          {
            // Display target sleep schedule card if defined in backend
            userData.currentTreatments.targetBedTime && (
              <TargetSleepScheduleCard
                remainingDays={Math.round(
                  (userData.nextCheckin.nextCheckinDatetime.toDate().getTime() -
                    Date.now()) /
                    1000 /
                    60 /
                    60 /
                    24,
                )}
                bedTime={formatDateAsTime(
                  userData.currentTreatments.targetBedTime.toDate(),
                )}
                wakeTime={formatDateAsTime(
                  userData.currentTreatments.targetWakeTime.toDate(),
                )}
              />
            )
          }
          <TreatmentPlanCard
            completionPercentProgress={percentTreatmentCompleted}
            nextCheckinDate={userData.nextCheckin.nextCheckinDatetime}
            onPress={() => {
              navigation.navigate('TreatmentPlan', {
                completionPercentProgress: percentTreatmentCompleted,
              });
            }}
          />
          {
            // Display PMR video if module has been completed
            userData.currentTreatments.RLX && (
              <CardContainer>
                <View style={styles.View_CardHeaderContainer}>
                  <Text
                    style={{
                      ...theme.typography.cardTitle,
                      ...styles.Text_CardTitle,
                    }}
                  >
                    Progressive Muscle Relaxation
                  </Text>
                  <Text
                    style={{
                      ...theme.typography.body2,
                      ...styles.Text_CardSubtitle,
                    }}
                  >
                    Practice once daily and before sleeping
                  </Text>
                </View>
                <View style={styles.View_CardContentContainer}>
                  <WebView
                    source={{
                      uri: 'https://www.youtube.com/embed/1nZEdqcGVzo',
                    }}
                    style={styles.webView}
                  />
                </View>
              </CardContainer>
            )
          }
          <View style={styles.View_NoCard}>
            <Text
              style={{
                ...theme.typography.cardTitle,
                ...styles.Text_CardTitle,
              }}
            >
              Previous modules
            </Text>
            {Object.keys(userData.currentTreatments).map((item) => {
              if (treatments[item]) {
                return (
                  <LinkCard
                    key={item}
                    style={styles.ItemMargin}
                    bgImage={treatments[item].image}
                    titleLabel={treatments[item].title}
                    subtitleLabel={treatments[item].subTitle}
                    onPress={() =>
                      navigation.navigate('TreatmentReview', { module: item })
                    }
                    overlayColor={'rgba(0, 129, 138, 0.8)'}
                  />
                );
              }
            })}
          </View>
        </View>
      </ScreenContainer>
    );
  } else {
    // If sleep logs haven't loaded, show indicator
    return (
      <View>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Root: {
    marginTop: scale(
      Platform.select({
        ios: dozy_theme.spacing.small,
        android: dozy_theme.spacing.medium,
      }) as number,
    ),
    paddingBottom: scale(25),
  },
  ItemMargin: {
    marginTop: scale(10),
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: scale(10),
  },
  FeedbackWidget: {
    marginBottom: scale(15),
  },
  View_CardHeaderContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  View_CardContentContainer: {
    height: 200,
  },
  View_NoCard: {
    flex: 1,
    marginVertical: scale(15),
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5),
    marginBottom: scale(12),
  },
  Icon_Clipboard: {
    margin: scale(20),
    alignSelf: 'center',
  },
  webView: {
    width: '100%',
    opacity: 0.99,
    overflow: 'hidden',
  },
  loader: {
    width: scale(45),
    height: scale(45),
    marginTop: '45%',
    alignSelf: 'center',
  },
});

export default TreatmentScreen;
