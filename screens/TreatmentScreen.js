import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Icon } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { LinkCard } from '../components/LinkCard';
import { TodoItem } from '../components/TodoItem';
import { slumber_theme } from '../config/Themes';
import Images from '../config/Images';

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
        <View style={styles.View_CardContainer}>
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
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  ItemMargin: {
    marginTop: 11
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  View_CardContainer: {
    backgroundColor: slumber_theme.colors.medium,
    width: '92%',
    padding: scale(12),
    borderRadius: slumber_theme.borderRadius.global
  },
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default withTheme(TreatmentScreen);
