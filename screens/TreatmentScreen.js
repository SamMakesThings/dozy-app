import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { withTheme, ScreenContainer, Icon } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { MaterialIcons } from '@expo/vector-icons';
import { LinkCard } from '../components/LinkCard';
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
              bgImage={Images.WomanInBed}
              titleLabel="Stimulus Control Therapy & SRT"
              subtitleLabel="Training your brain to sleep in bed"
              onPress={() => console.log('Pressed the link card')}
            />
            <View style={styles.View_TodoContainer}>
              <View style={styles.View_TodoItem}>
                <MaterialIcons
                  name={'check-box-outline-blank'}
                  size={scale(18)}
                  color={theme.colors.secondary}
                />
                <Text
                  style={{ ...theme.typography.body2, ...styles.Text_TodoItem }}
                >
                  Avoid electronics for an hour before bed
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  View_CardContainer: {
    backgroundColor: slumber_theme.colors.medium,
    width: '92%',
    padding: scale(15),
    borderRadius: slumber_theme.borderRadius.global
  },
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  View_TodoItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
  Text_TodoItem: {
    color: slumber_theme.colors.secondary,
    marginLeft: scale(8)
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default withTheme(TreatmentScreen);
