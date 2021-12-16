import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
} from 'react-native';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { scale } from 'react-native-size-matters';
import { Entypo } from '@expo/vector-icons';
import { CardContainer } from './CardContainer';
import HighlightedText from './HighlightedText';
import { ProgressBar } from './ProgressBar';
import { dozy_theme } from '../config/Themes';

interface Props {
  onPress?: (event: GestureResponderEvent) => void;
  title?: string;
  titleOpacity?: number;
  nextCheckinDate: FirebaseFirestoreTypes.Timestamp;
  completionPercentProgress: number;
}

export const TreatmentPlanCard: React.FC<Props> = (props) => {
  const theme = dozy_theme;

  return (
    <CardContainer>
      <TouchableOpacity
        style={styles.container}
        onPress={props.onPress}
        disabled={!props.onPress}
      >
        <View style={styles.View_CardHeaderContainer}>
          <View style={styles.headerContent}>
            <Text
              style={{
                ...theme.typography.cardTitle,
                ...styles.Text_CardTitle,
                opacity: props.titleOpacity || undefined,
              }}
            >
              {props.title || 'My care plan'}
            </Text>
            <Text
              style={{
                ...theme.typography.body2,
                ...styles.Text_CardSubtitle,
              }}
            >
              Next weekly checkin:{' '}
              {props.nextCheckinDate.toDate().toLocaleString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <Entypo
            name={'chevron-right'}
            size={scale(28)}
            color={theme.colors.secondary}
            style={props.onPress ? undefined : styles.hidden}
          />
        </View>
        <View style={styles.View_CardContentContainer}>
          <View
            style={{
              ...styles.View_CenteredRowContainer,
              marginTop: scale(12),
            }}
          >
            <View>
              <ProgressBar
                style={styles.ProgressBar}
                color={theme.colors.secondary}
                progress={props.completionPercentProgress}
                borderRadius={scale(9)}
                unfilledColor={theme.colors.background}
              />
            </View>
            <HighlightedText
              label={
                Math.round(props.completionPercentProgress * 100) + '% done'
              }
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
  container: { flex: 1 },
  View_CardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  View_CardContentContainer: {},
  View_CenteredRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: scale(5),
  },
  Text_CardTitle: {
    color: dozy_theme.colors.secondary,
  },
  Text_CardSubtitle: {
    color: dozy_theme.colors.secondary,
    opacity: 0.5,
    marginTop: scale(-5),
  },
  ProgressBar: {
    width: scale(185),
  },
  hidden: { display: 'none' },
  highlightedText: { maxWidth: '32%' },
});

export default TreatmentPlanCard;
