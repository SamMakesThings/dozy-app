import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { withTheme, ScreenContainer, Icon, ProgressBar } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { AuthContext } from '../utilities/authContext';
import { LinkCard } from '../components/LinkCard';
import CurrentTreatmentsCard from '../components/CurrentTreatmentsCard';
import TargetSleepScheduleCard from '../components/TargetSleepScheduleCard';
import { CardContainer } from '../components/CardContainer';
import HighlightedText from '../components/HighlightedText';
import { slumber_theme } from '../config/Themes';
import Images from '../config/Images';
import treatments from '../constants/Treatments';

export const TreatmentScreen = ({ navigation }) => {
  const theme = slumber_theme;
  const { state } = React.useContext(AuthContext);

  // Get current treatment module string from state
  const currentModule = state.userData.currentTreatments.currentModule;
  console.log(treatments[currentModule].title);

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
            console.log('Ya pressed link');
            navigation.navigate('TreatmentReview');
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
        <CardContainer>
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => console.log('Pressed Treatment plan')}
          >
            <View style={styles.View_CardHeaderContainer}>
              <View
                style={{
                  ...styles.View_CardHeaderContainer,
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Text
                  style={{
                    ...theme.typography.cardTitle,
                    ...styles.Text_CardTitle
                  }}
                >
                  My treatment plan
                </Text>
                <Text
                  style={{
                    ...theme.typography.body2,
                    ...styles.Text_CardSubtitle
                  }}
                >
                  Next weekly checkin: May 28
                </Text>
              </View>
              <Entypo
                name={'chevron-right'}
                size={scale(28)}
                color={theme.colors.secondary}
              />
            </View>
            <View style={styles.View_CardContentContainer}>
              <View
                style={{
                  ...styles.View_CenteredRowContainer,
                  marginTop: scale(12)
                }}
              >
                <View>
                  <ProgressBar
                    style={styles.ProgressBar}
                    color={theme.colors.secondary}
                    progress={0.4}
                    borderWidth={0}
                    borderRadius={scale(9)}
                    animationType="spring"
                    unfilledColor={theme.colors.background}
                  />
                </View>
                <HighlightedText
                  label="33% done"
                  textColor={theme.colors.primary}
                  bgColor={theme.colors.secondary}
                  style={{ maxWidth: '32%' }}
                />
              </View>
            </View>
          </TouchableOpacity>
        </CardContainer>
        <View style={styles.View_NoCard}>
          <Text
            style={{
              ...theme.typography.cardTitle,
              ...styles.Text_CardTitle
            }}
          >
            Previous modules
          </Text>
          <LinkCard
            style={styles.ItemMargin}
            bgImage={Images.WomanInBed}
            titleLabel="Muscle Relaxation w/PMR"
            subtitleLabel="Relaxing muscles to relax the mind"
            onPress={() => console.log('Pressed the link card')}
            overlayColor={'rgba(0, 129, 138, 0.8)'}
          />
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
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  View_CenteredRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(5)
  },
  View_NoCard: {
    width: '92%',
    marginTop: scale(15),
    marginBottom: scale(15)
  },
  Text_CardTitle: {
    color: slumber_theme.colors.secondary
  },
  Text_CardSubtitle: {
    color: slumber_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5)
  },
  ProgressBar: {
    width: scale(185)
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default withTheme(TreatmentScreen);
