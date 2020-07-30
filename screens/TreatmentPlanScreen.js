/* eslint-disable import/prefer-default-export */
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { withTheme, ScreenContainer, Icon } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { TreatmentPlanCard } from '../components/TreatmentPlanCard';
import { LinkCard } from '../components/LinkCard';
import { dozy_theme } from '../config/Themes';
import { CardContainer } from '../components/CardContainer';
import treatments from '../constants/Treatments';

function TreatmentPlanScreen({ route }) {
  const theme = dozy_theme;

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
              <Text>ProgBar</Text>
            </View>
            <View style={styles.View_PlanModulesContainer}>
              <View>
                <Text>Date here</Text>
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
  View_CardContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  View_VerticalProgBarContainer: {
    width: scale(20),
    marginRight: scale(10)
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default TreatmentPlanScreen;
