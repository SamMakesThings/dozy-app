import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { ProgressBar } from './ProgressBar';
import { CardContainer } from './CardContainer';
import HighlightedText from './HighlightedText';
import { dozy_theme } from '../config/Themes';

interface Props {
  nightsLogged: number;
  onPress?: (event: GestureResponderEvent) => void;
}

export const BaselineProgressCard: React.FC<Props> = (props) => {
  const theme = dozy_theme;

  const baselineLogsRequired = 7;

  return (
    <CardContainer style={styles.container}>
      <TouchableOpacity onPress={props.onPress} disabled={!props.onPress}>
        <View style={styles.View_CardHeaderContainer}>
          <View style={styles.cardHeaderContent}>
            <Text style={[theme.typography.cardTitle, styles.Text_CardTitle]}>
              Baseline data collection
            </Text>
            <Text
              style={{
                ...theme.typography.body2,
                ...styles.Text_CardSubtitle,
              }}
            >
              {baselineLogsRequired - props.nightsLogged} sleep logs remaining
            </Text>
          </View>
          <Entypo
            name={'chevron-right'}
            size={scale(28)}
            color={theme.colors.secondary}
            style={props.onPress ? undefined : styles.hidden}
          />
        </View>
        <View>
          <View
            style={{
              ...styles.View_CenteredRowContainer,
              marginTop: scale(12),
            }}
          >
            <View>
              <ProgressBar
                style={styles.ProgressBar}
                color={theme.colors.primary}
                progress={props.nightsLogged / baselineLogsRequired}
                borderRadius={scale(9)}
                unfilledColor={theme.colors.background}
              />
            </View>
            <HighlightedText
              label={props.nightsLogged + '/' + baselineLogsRequired}
              textColor={theme.colors.primary}
              bgColor={theme.colors.secondary}
              style={styles.highlightedText}
            />
          </View>
        </View>
      </TouchableOpacity>
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  View_CenteredRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(5),
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.8,
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5),
  },
  ProgressBar: {
    width: scale(200),
  },
  container: { marginBottom: 0 },
  cardHeaderContent: { justifyContent: 'space-between' },
  hidden: { display: 'none' },
  highlightedText: { maxWidth: '22%' },
});

export default BaselineProgressCard;
