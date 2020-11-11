import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { withTheme, ScreenContainer, Icon } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../utilities/authContext';
import { LinkCard } from '../components/LinkCard';
import CurrentTreatmentsCard from '../components/CurrentTreatmentsCard';
import { CardContainer } from '../components/CardContainer';
import { TargetSleepScheduleCard } from '../components/TargetSleepScheduleCard';
import IconTitleSubtitleButton from '../components/IconTitleSubtitleButton';
import { TreatmentPlanCard } from '../components/TreatmentPlanCard';
import { dozy_theme } from '../config/Themes';
import treatmentsRaw from '../constants/Treatments';
import { formatDateAsTime } from '../utilities/formatDateAsTime';
import planTreatmentModules from '../utilities/planTreatmentModules';
import GLOBAL from '../utilities/global';

type Props = {
  navigation: {
    navigate: Function;
  };
};

const treatments: {
  [key: string]: {
    ready: boolean;
    title: string;
    subTitle: string;
    image: object;
    todos: Array<string>;
    optional: boolean;
  };
} = treatmentsRaw; // Give Treatments an iterable type

export const TreatmentScreen: React.FC<Props> = ({ navigation }) => {
  const theme = dozy_theme;
  const { state } = React.useContext(AuthContext);

  // If state is available, show screen. Otherwise, show loading indicator.
  if (state.sleepLogs && state.userData?.currentTreatments) {
    // Calculate the full treatment plan and store it in static global state
    const treatmentPlan = planTreatmentModules({
      sleepLogs: state.sleepLogs,
      currentTreatments: state.userData.currentTreatments
    });
    GLOBAL.treatmentPlan = treatmentPlan;

    // Get current treatment module string from state
    const currentModule = state.userData.currentTreatments.currentModule;

    // Compute current module's progress percent based on dates
    const nextCheckinTime = state.userData.nextCheckin.nextCheckinDatetime
      .toDate()
      .getTime();
    const lastCheckinTime = state.userData.currentTreatments.lastCheckinDatetime
      .toDate()
      .getTime();
    const progressPercent = ~~(
      (100 *
        (nextCheckinTime - lastCheckinTime - (nextCheckinTime - Date.now()))) /
      (nextCheckinTime - lastCheckinTime)
    );

    // Estimate treatment completion date & % progress based on treatmentPlan
    // const estCompletionDate = treatmentPlan[treatmentPlan.length - 1].estDate;
    const modulesCompleted = treatmentPlan.filter(
      (module) => module.started === true
    ).length;
    const percentTreatmentCompleted =
      parseFloat((modulesCompleted / treatmentPlan.length).toFixed(2)) * 1; // Parsefloat added to make TS happy

    // Strip time from next checkin datetime to determine whether to show checkin button
    let nextCheckinDate = state.userData.currentTreatments.nextCheckinDatetime.toDate();
    nextCheckinDate.setHours(0);

    return (
      <ScreenContainer hasSafeArea={true} scrollable={true} style={styles.Root}>
        <View style={styles.View_ContentContainer}>
          <Icon
            style={styles.Icon_Clipboard}
            name="Ionicons/ios-clipboard"
            size={scale(80)}
            color={theme.colors.primary}
          />
          {nextCheckinDate < new Date() &&
            treatments[state.userData.nextCheckin.treatmentModule].ready && (
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
                  navigation.navigate(
                    state.userData.nextCheckin.treatmentModule
                  )
                }
              />
            )}
          <CurrentTreatmentsCard
            progressPercent={progressPercent}
            linkTitle={treatments[currentModule].title}
            linkSubtitle={treatments[currentModule].subTitle}
            linkImage={treatments[currentModule].image}
            todosArray={treatments[currentModule].todos}
            onPress={() => {
              navigation.navigate('TreatmentReview', { module: currentModule });
            }}
          />
          {
            // Display target sleep schedule card if defined in backend
            state.userData.currentTreatments.targetBedTime && (
              <TargetSleepScheduleCard
                remainingDays={Math.round(
                  (state.userData.nextCheckin.nextCheckinDatetime
                    .toDate()
                    .getTime() -
                    Date.now()) /
                    1000 /
                    60 /
                    60 /
                    24
                )}
                bedTime={formatDateAsTime(
                  state.userData.currentTreatments.targetBedTime.toDate()
                )}
                wakeTime={formatDateAsTime(
                  state.userData.currentTreatments.targetWakeTime.toDate()
                )}
              />
            )
          }
          <TreatmentPlanCard
            completionPercentProgress={percentTreatmentCompleted}
            nextCheckinDate={state.userData.nextCheckin.nextCheckinDatetime}
            onPress={() => {
              navigation.navigate('TreatmentPlan', {
                completionPercentProgress: percentTreatmentCompleted
              });
            }}
          />
          {
            // Display PMR video if module has been completed
            state.userData.currentTreatments.RLX && (
              <CardContainer>
                <View style={styles.View_CardHeaderContainer}>
                  <Text
                    style={{
                      ...theme.typography.cardTitle,
                      ...styles.Text_CardTitle
                    }}
                  >
                    Progressive Muscle Relaxation
                  </Text>
                  <Text
                    style={{
                      ...theme.typography.body2,
                      ...styles.Text_CardSubtitle
                    }}
                  >
                    Practice once daily and before sleeping
                  </Text>
                </View>
                <View style={styles.View_CardContentContainer}>
                  <WebView
                    source={{
                      uri: 'https://www.youtube.com/embed/1nZEdqcGVzo'
                    }}
                    style={{ width: '100%' }}
                  />
                </View>
              </CardContainer>
            )
          }
          <View style={styles.View_NoCard}>
            <Text
              style={{
                ...theme.typography.cardTitle,
                ...styles.Text_CardTitle
              }}
            >
              Previous modules
            </Text>
            {Object.keys(state.userData.currentTreatments).map((item) => {
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
          style={{
            width: scale(45),
            height: scale(45),
            marginTop: '45%',
            alignSelf: 'center'
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Root: {
    marginTop: scale(20),
    paddingBottom: scale(25)
  },
  ItemMargin: {
    marginTop: scale(10)
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingLeft: scale(10),
    paddingRight: scale(10)
  },
  View_CardHeaderContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  View_CardContentContainer: {
    height: 200
  },
  View_NoCard: {
    flex: 1,
    marginTop: scale(15),
    marginBottom: scale(15)
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5),
    marginBottom: scale(12)
  },
  Icon_Clipboard: {
    margin: scale(20),
    alignSelf: 'center'
  }
});

export default withTheme(TreatmentScreen);