import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { withTheme, ProgressBar } from '@draftbit/ui';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { CardContainer } from './CardContainer';
import HighlightedText from './HighlightedText';
import { dozy_theme } from '../config/Themes';

export const BaselineProgressCard = (props) => {
  const theme = dozy_theme;

  const baselineLogsRequired = 7;

  return (
    <CardContainer style={{ marginBottom: 0 }}>
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
                opacity: 0.8
              }}
            >
              Baseline data collection
            </Text>
            <Text
              style={{
                ...theme.typography.body2,
                ...styles.Text_CardSubtitle
              }}
            >
              {baselineLogsRequired - props.nightsLogged} sleep logs remaining
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
                color={theme.colors.primary}
                progress={props.nightsLogged / baselineLogsRequired}
                borderWidth={0}
                borderRadius={scale(9)}
                animationType="spring"
                unfilledColor={theme.colors.background}
              />
            </View>
            <HighlightedText
              label={props.nightsLogged + '/' + baselineLogsRequired}
              textColor={theme.colors.primary}
              bgColor={theme.colors.secondary}
              style={{ maxWidth: '22%' }}
            />
          </View>
        </View>
      </TouchableOpacity>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
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
    width: scale(200)
  },
  Icon_Clipboard: {
    margin: scale(20)
  }
});

export default withTheme(BaselineProgressCard);
