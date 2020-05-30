import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Icon } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { LinkCard } from '../components/LinkCard';
import { TodoItem } from '../components/TodoItem';
import { CardContainer } from '../components/CardContainer';
import { slumber_theme } from '../config/Themes';
import Images from '../config/Images';
import CrescentMoon from '../assets/images/CrescentMoon.svg';
import TransRightArrow from '../assets/images/TransRightArrow.svg';
import YellowSun from '../assets/images/YellowSun.svg';

export const TreatmentScreen = () => {
  const theme = slumber_theme;
  return (
    <ScreenContainer
      hasSafeArea={true}
      scrollable={false}
      style={styles.Root_n5}
    >
      <View style={styles.View_ContentContainer}>
        <Icon
          style={styles.Icon_Clipboard}
          name="Ionicons/ios-clipboard"
          size={scale(80)}
          color={theme.colors.primary}
        />
        <CardContainer>
          <View style={styles.View_CardHeaderContainer}>
            <Text
              style={{
                ...theme.typography.cardTitle,
                ...styles.Text_CardTitle
              }}
            >
              In progress
            </Text>
            <Text
              style={{
                ...theme.typography.cardTitle,
                ...styles.Text_RightSubHeader
              }}
            >
              50% complete
            </Text>
          </View>
          <View style={styles.View_CardContentContainer}>
            <LinkCard
              style={styles.ItemMargin}
              bgImage={Images.WomanInBed}
              titleLabel="Stimulus Control Therapy & SRT"
              subtitleLabel="Training your brain to sleep in bed"
              onPress={() => console.log('Pressed the link card')}
            />
            <View
              style={{ ...styles.ItemMargin, ...styles.View_TodoContainer }}
            >
              <TodoItem
                completed={false}
                label="Avoid electronics for an hour before bed"
              />
            </View>
          </View>
        </CardContainer>
        <CardContainer>
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
              Target sleep schedule
            </Text>
            <Text
              style={{ ...theme.typography.body2, ...styles.Text_CardSubtitle }}
            >
              Maintain for another 6 days
            </Text>
          </View>
          <View style={styles.View_CardContentContainer}>
            <View style={styles.View_CenteredRowContainer}>
              <CrescentMoon width={scale(30)} height={scale(30)} />
              <View style={styles.View_TimeContainer}>
                <Text
                  style={{ ...theme.typography.body1, ...styles.Text_Time }}
                >
                  11:00 pm
                </Text>
                <Text
                  style={{
                    ...theme.typography.body1,
                    ...styles.Text_TimeLabel
                  }}
                >
                  bedtime
                </Text>
              </View>
              <TransRightArrow width={scale(25)} height={scale(15)} />
              <View style={styles.View_TimeContainer}>
                <Text
                  style={{ ...theme.typography.body1, ...styles.Text_Time }}
                >
                  7:00 am
                </Text>
                <Text
                  style={{
                    ...theme.typography.body1,
                    ...styles.Text_TimeLabel
                  }}
                >
                  wake time
                </Text>
              </View>
              <YellowSun width={scale(30)} height={scale(30)} />
            </View>
          </View>
        </CardContainer>
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
            <View style={styles.View_CenteredRowContainer}>
              <Text>Progbar</Text>
              <Text>TimeIndicator</Text>
            </View>
          </View>
        </CardContainer>
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
  View_TimeContainer: {
    marginTop: scale(8)
  },
  Text_CardTitle: {
    color: slumber_theme.colors.secondary
  },
  Text_RightSubHeader: {
    fontFamily: 'RubikRegular',
    fontSize: scale(17),
    color: slumber_theme.colors.secondary,
    opacity: 0.5
  },
  Text_CardSubtitle: {
    color: slumber_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5)
  },
  Text_Time: {
    textAlign: 'center',
    fontSize: scale(20),
    color: slumber_theme.colors.secondary
  },
  Text_TimeLabel: {
    textAlign: 'center',
    fontSize: scale(12),
    color: slumber_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-6)
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default withTheme(TreatmentScreen);
