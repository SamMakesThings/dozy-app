import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScreenContainer } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { NavigationProp } from '@react-navigation/native';
import { TreatmentPlanCard } from '../components/TreatmentPlanCard';
import { LinkCard } from '../components/LinkCard';
import { dozy_theme } from '../config/Themes';
import { CardContainer } from '../components/CardContainer';
import treatments from '../constants/Treatments';
import { AuthContext } from '../context/AuthContext';
import GLOBAL from '../utilities/global';

const theme = dozy_theme;

const TreatmentPlanScreen: React.FC<{
  navigation: NavigationProp<any>;
  route: { params: { completionPercentProgress: number } };
}> = ({ navigation, route }) => {
  const { state } = React.useContext(AuthContext);
  const treatmentPlan = GLOBAL.treatmentPlan;

  // Calculate flex value for the vertical progress bar
  const vProgBarFillFlex = treatmentPlan.filter(
    (module) => module.started === true,
  ).length;

  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={true}
      style={styles.ScreenContainer_Root}
    >
      <View style={styles.View_ContentContainer}>
        <TreatmentPlanCard
          completionPercentProgress={route.params.completionPercentProgress}
          nextCheckinDate={state.userData.nextCheckin.nextCheckinDatetime}
          title={'Progress so far'}
          titleOpacity={0.6}
        />
        <CardContainer>
          <View style={styles.View_CardHeaderContainer}>
            <View
              style={[
                styles.View_CardHeaderContainer,
                styles.yourCarePlanContainer,
              ]}
            >
              <Text
                style={{
                  ...theme.typography.cardTitle,
                  ...styles.Text_CardTitle,
                }}
              >
                Your care plan
              </Text>
            </View>
          </View>
          <View style={styles.View_CardContentContainer}>
            <View style={styles.View_VerticalProgBarContainer}>
              <View style={styles.View_VerticalProgBarBg}>
                <View
                  style={{
                    ...styles.View_VerticalProgBarFill,
                    flex: vProgBarFillFlex,
                  }}
                />
                <View
                  style={{
                    ...styles.View_VerticalProgBarBlank,
                    flex: treatmentPlan.length - vProgBarFillFlex,
                  }}
                />
              </View>
            </View>
            <View style={styles.View_PlanModulesContainer}>
              {treatmentPlan.map((module) => {
                return (
                  <View key={module.module}>
                    <Text
                      style={[theme.typography.headline6, styles.moduleESTDate]}
                    >
                      {module.estDate.toLocaleString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                    <LinkCard
                      style={styles.ItemMargin}
                      bgImage={treatments[module.module].image}
                      titleLabel={treatments[module.module].title}
                      subtitleLabel={treatments[module.module].subTitle}
                      onPress={() => {
                        navigation.navigate('TreatmentReview', {
                          module: module.module,
                        });
                      }}
                      overlayColor={
                        module.started ? 'rgba(0, 129, 138, 0.8)' : undefined
                      }
                      disabled={!module.started}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        </CardContainer>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  ScreenContainer_Root: {
    paddingTop: scale(55),
  },
  ItemMargin: {
    marginTop: scale(1),
    marginBottom: scale(17),
  },
  View_CardHeaderContainer: {},
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    flex: 1,
    paddingLeft: scale(10),
    paddingRight: scale(10),
  },
  View_CardContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  View_VerticalProgBarContainer: {
    marginTop: scale(6),
    width: scale(10),
    marginRight: scale(12),
  },
  View_VerticalProgBarBg: {
    backgroundColor: theme.colors.background,
    flex: 1,
    borderRadius: 100,
  },
  View_VerticalProgBarFill: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 100,
  },
  View_VerticalProgBarBlank: {
    flex: 1,
  },
  View_PlanModulesContainer: {
    flex: 1,
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
    fontSize: scale(25),
    marginBottom: scale(12),
  },
  yourCarePlanContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  moduleESTDate: {
    color: theme.colors.light,
    fontSize: scale(13),
    width: '100%',
  },
});

export default TreatmentPlanScreen;
