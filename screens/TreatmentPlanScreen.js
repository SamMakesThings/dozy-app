/* eslint-disable import/prefer-default-export */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { ScreenContainer } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { TreatmentPlanCard } from '../components/TreatmentPlanCard';
import { LinkCard } from '../components/LinkCard';
import { dozy_theme } from '../config/Themes';
import { CardContainer } from '../components/CardContainer';
import treatments from '../constants/Treatments';

const theme = dozy_theme;

function TreatmentPlanScreen({ route }) {
  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={true}
      style={styles.ScreenContainer_Root}
    >
      <View style={styles.View_ContentContainer}>
        <TreatmentPlanCard
          estCompletionDate={route.params.estCompletionDate}
          completionPercentProgress={route.params.completionPercentProgress}
          title={'Progress so far'}
        />
        <CardContainer>
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
                Your treatment plan
              </Text>
            </View>
          </View>
          <View style={styles.View_CardContentContainer}>
            <View style={styles.View_VerticalProgBarContainer}>
              <View style={styles.View_VerticalProgBarBg}>
                <View style={styles.View_VerticalProgBarFill} />
                <View style={styles.View_VerticalProgBarBlank} />
              </View>
            </View>
            <View style={styles.View_PlanModulesContainer}>
              <View>
                <Text
                  style={[
                    theme.typography.headline6,
                    {
                      color: theme.colors.light,
                      fontSize: scale(13),
                      width: '100%'
                    }
                  ]}
                >
                  {new Date().toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
                <LinkCard
                  style={styles.ItemMargin}
                  bgImage={treatments['SCTSRT'].image}
                  titleLabel={treatments['SCTSRT'].title}
                  subtitleLabel={treatments['SCTSRT'].subTitle}
                  onPress={() => {
                    // navigation.navigate('TreatmentReview', { module: item })
                  }}
                  overlayColor={'rgba(0, 129, 138, 0.8)'}
                />
              </View>
            </View>
          </View>
        </CardContainer>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  ScreenContainer_Root: {
    paddingTop: scale(55)
  },
  ItemMargin: {
    marginTop: scale(1)
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
  View_CardContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  View_VerticalProgBarContainer: {
    marginTop: scale(6),
    width: scale(10),
    marginRight: scale(12)
  },
  View_VerticalProgBarBg: {
    backgroundColor: theme.colors.background,
    flex: 1,
    borderRadius: 100
  },
  View_VerticalProgBarFill: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    borderRadius: 100
  },
  View_VerticalProgBarBlank: {
    flex: 1
  },
  View_PlanModulesContainer: {
    flex: 1
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
    fontSize: scale(25)
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default TreatmentPlanScreen;
