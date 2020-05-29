import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ImageBackground
} from 'react-native';
import { withTheme, ScreenContainer, Container, Icon } from '@draftbit/ui';
import { scale, verticalScale } from 'react-native-size-matters';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
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
            <View style={styles.View_ContentLinkCard}>
              <ImageBackground
                source={Images.WomanInBed}
                style={styles.Image_ContentLinkBackground}
              >
                <View style={styles.View_CardLinkImageOverlay}>
                  <View style={{ maxWidth: '90%' }}>
                    <Text
                      style={{
                        ...theme.typography.body1,
                        ...styles.Text_ContentLinkTitle
                      }}
                    >
                      Stimulus Control Therapy & SRT
                    </Text>
                    <Text
                      style={{
                        ...theme.typography.body1,
                        ...styles.Text_ContentLinkSubtitle
                      }}
                    >
                      Training your brain to sleep in bed
                    </Text>
                  </View>
                  <Entypo
                    name={'chevron-right'}
                    size={scale(25)}
                    color={theme.colors.secondary}
                  />
                </View>
              </ImageBackground>
            </View>
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
  View_ContentLinkCard: {
    height: scale(80),
    borderRadius: slumber_theme.borderRadius.global,
    overflow: 'hidden'
  },
  View_CardLinkImageOverlay: {
    backgroundColor: 'rgba(64, 75, 105, 0.8)',
    width: '100%',
    height: '100%',
    padding: scale(6),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  View_TodoItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  Image_ContentLinkBackground: {
    flex: 1,
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
  Text_ContentLinkTitle: {
    fontSize: scale(15),
    fontFamily: 'RubikMedium',
    color: slumber_theme.colors.secondary
  },
  Text_ContentLinkSubtitle: {
    fontSize: scale(15),
    color: slumber_theme.colors.secondary,
    opacity: 0.6,
    lineHeight: scale(14)
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
