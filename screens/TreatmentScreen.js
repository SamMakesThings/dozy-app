import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { withTheme, ScreenContainer, Icon } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../utilities/authContext';
import { LinkCard } from '../components/LinkCard';
import CurrentTreatmentsCard from '../components/CurrentTreatmentsCard';
import { TargetSleepScheduleCard } from '../components/TargetSleepScheduleCard';
import IconTitleSubtitleButton from '../components/IconTitleSubtitleButton';
import { TreatmentPlanCard } from '../components/TreatmentPlanCard';
import { dozy_theme } from '../config/Themes';
import treatments from '../constants/Treatments';
import planTreatmentModules from '../utilities/planTreatmentModules';
import GLOBAL from '../utilities/global';

export const TreatmentScreen = ({ navigation }) => {
  const theme = dozy_theme;
  const { state } = React.useContext(AuthContext);

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
    (modulesCompleted / treatmentPlan.length).toFixed(2) * 1;

  // Strip time from next checkin datetime to determine whether to show checkin button
  let nextCheckinDate = state.userData.currentTreatments.nextCheckinDatetime.toDate();
  nextCheckinDate.setHours(0);

  return (
    <ScreenContainer
      hasSafeArea={
        false /* Turning this off b/c it added bottom padding on iOS. Added styles to fix, remove if patched */
      }
      scrollable={true}
      style={styles.Root}
    >
      <View style={styles.View_ContentContainer}>
        <Icon
          style={styles.Icon_Clipboard}
          name="Ionicons/ios-clipboard"
          size={scale(80)}
          color={theme.colors.primary}
        />
        {nextCheckinDate < new Date() && (
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
            onPress={() => navigation.navigate('SCTSRT')}
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
          state.userData.currentTreatments.bedTime && (
            <TargetSleepScheduleCard
              remainingDays={Math.round(
                (state.userData.nextCheckin.checkinDatetime.toDate().getTime() -
                  Date.now()) /
                  1000 /
                  60 /
                  60 /
                  24
              )}
              bedTime={state.userData.currentTreatments.bedTime
                .toDate()
                .toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric'
                })}
              wakeTime={state.userData.currentTreatments.wakeTime
                .toDate()
                .toLocaleString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric'
                })}
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
};

const styles = StyleSheet.create({
  Root: {
    marginTop: Platform.OS === 'ios' ? scale(40) : scale(20) // TODO: Does this work ok on non-notch iPhones?
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
  View_NoCard: {
    flex: 1,
    marginTop: scale(15),
    marginBottom: scale(15)
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  },
  Icon_Clipboard: {
    margin: scale(20),
    alignSelf: 'center'
  }
});

export default withTheme(TreatmentScreen);
