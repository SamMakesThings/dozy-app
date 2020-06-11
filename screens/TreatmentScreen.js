import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Icon } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import { LinkCard } from '../components/LinkCard';
import CurrentTreatmentsCard from '../components/CurrentTreatmentsCard';
import TargetSleepScheduleCard from '../components/TargetSleepScheduleCard';
import { TreatmentPlanCard } from '../components/TreatmentPlanCard';
import { slumber_theme } from '../config/Themes';
import treatments from '../constants/Treatments';

export const TreatmentScreen = ({ navigation }) => {
  const theme = slumber_theme;
  const { state } = React.useContext(AuthContext);

  // Get current treatment module string from state
  const currentModule = state.userData.currentTreatments.currentModule;

  // Compute current module's progress percent based on dates
  const nextCheckinTime = state.userData.nextCheckin.checkinDatetime
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

  // Estimate treatment completion date based on 1 week per module
  const estModulesRemaining =
    10 - Object.keys(state.userData.currentTreatments).length;
  const estCompletionSeconds =
    new Date().getTime() + estModulesRemaining * 604800000;
  const estCompletionDate = new Date(estCompletionSeconds).toLocaleString(
    'en-US',
    {
      month: 'short',
      day: 'numeric'
    }
  );

  // Compute progress percent based on above estimate
  const estCompletionDuration = 10 * 604800000; // 10 modules duration
  const completionPercentProgress = ~~(
    (100 * (estCompletionSeconds - Date.now())) /
    estCompletionDuration
  );

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={true}
      style={styles.Root_n5}
    >
      <View style={styles.View_ContentContainer}>
        <Icon
          style={styles.Icon_Clipboard}
          name="Ionicons/ios-clipboard"
          size={scale(80)}
          color={theme.colors.primary}
        />
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
          estCompletionDate={estCompletionDate}
          completionPercentProgress={completionPercentProgress}
          onPress={() => {
            navigation.navigate('TreatmentPlan');
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
  ItemMargin: {
    marginTop: scale(10)
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  View_NoCard: {
    width: '92%',
    marginTop: scale(15),
    marginBottom: scale(15)
  },
  Text_CardTitle: {
    color: slumber_theme.colors.secondary
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default withTheme(TreatmentScreen);
