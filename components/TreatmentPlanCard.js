import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { withTheme, ProgressBar } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { CardContainer } from './CardContainer';
import HighlightedText from './HighlightedText';
import { dozy_theme } from '../config/Themes';

export const TreatmentPlanCard = (props) => {
  const theme = dozy_theme;

  return (
    <CardContainer>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={props.onPress}
        disabled={!props.onPress}
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
                ...styles.Text_CardTitle,
                opacity: props.titleOpacity
              }}
            >
              {props.title ? props.title : 'My treatment plan'}
            </Text>
            <Text
              style={{
                ...theme.typography.body2,
                ...styles.Text_CardSubtitle
              }}
            >
              Next weekly checkin:{' '}
              {props.nextCheckinDate.toDate().toLocaleString('en-US', {
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
          <Entypo
            name={'chevron-right'}
            size={scale(28)}
            color={theme.colors.secondary}
            style={{ display: props.onPress ? 'flex' : 'none' }}
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
                progress={props.completionPercentProgress}
                borderWidth={0}
                borderRadius={scale(9)}
                animationType="spring"
                unfilledColor={theme.colors.background}
              />
            </View>
            <HighlightedText
              label={props.completionPercentProgress * 100 + '% done'}
              textColor={theme.colors.primary}
              bgColor={theme.colors.secondary}
              style={{ maxWidth: '32%' }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </CardContainer>
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
  Text_CardTitle: {
    color: dozy_theme.colors.secondary
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
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

export default withTheme(TreatmentPlanCard);
