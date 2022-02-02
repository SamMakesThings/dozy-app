import React from 'react';
import {
  Text,
  TouchableOpacity,
  GestureResponderEvent,
  View,
  Alert,
  StyleSheet,
} from 'react-native';
import { Container } from '@draftbit/ui';
import firestore from '@react-native-firebase/firestore';
import { scale } from 'react-native-size-matters';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { dozy_theme } from '../config/Themes';
import HighlightedText from './HighlightedText';
import { formatDateAsTime } from '../utilities/formatDateAsTime';
import Auth from '../utilities/auth.service';
import { RGB2RGBA } from '../utilities/common';
import { SleepLog } from '../types/custom';

interface Props {
  sleepLog: SleepLog;
  onEdit?: (event: GestureResponderEvent) => void;
}

const SleepLogEntryCard: React.FC<Props> = ({ sleepLog, onEdit }) => {
  const theme = dozy_theme;
  const { state } = Auth.useAuth();
  const userId = state.userId;
  const openDeleteSleepLogAlert = () =>
    Alert.alert(
      'Delete sleep diary entry?',
      "Are you sure you want to permanently delete this night's record?",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'OK', onPress: handleDeleteSleepLog },
      ],
    );
  const handleDeleteSleepLog = () => {
    const sleepLogId = sleepLog.logId;

    if (!sleepLogId)
      console.error(
        'There is no sleeplogid in handleDeleteSleeping of SleepingLogEntryCard',
      );
    firestore()
      .collection('users')
      .doc(userId)
      .collection('sleepLogs')
      .doc(sleepLogId)
      .delete();
  };
  return (
    <Container
      style={{
        marginTop: scale(18),
      }}
      elevation={0}
      useThemeGutterPadding={false}
    >
      <Container
        style={styles.headerContainer}
        elevation={0}
        useThemeGutterPadding={false}
      >
        <Text
          style={[
            theme.typography.headline6,
            styles.upTimeText,
            { color: theme.colors.light },
          ]}
        >
          {sleepLog.upTime.toDate().toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
        <View style={styles.buttonContainer}>
          {!sleepLog.isDraft && (
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.editButton, !onEdit && styles.hidden]}
            >
              <Entypo
                name="pencil"
                size={scale(18)}
                color={theme.colors.light}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={openDeleteSleepLogAlert}>
            <Entypo name="trash" size={scale(16)} color={theme.colors.light} />
          </TouchableOpacity>
        </View>
      </Container>
      <Container
        style={[
          styles.content,
          {
            borderRadius: theme.borderRadius.global,
          },
        ]}
        elevation={2}
        backgroundColor={theme.colors.medium}
        useThemeGutterPadding={true}
      >
        <Container
          style={styles.fallAsleepTimeContainer}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <HighlightedText
            textColor={theme.colors.secondary}
            label={formatDateAsTime(sleepLog.bedTime.toDate())}
            bgColor={theme.colors.primary}
          />
          <Text
            style={[
              styles.fallAsleepTimeText,
              {
                color: theme.colors.light,
              },
            ]}
          >
            {sleepLog.fallAsleepTime
              .toDate()
              .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
              .slice(0, -3)}
          </Text>
          <Text
            style={[
              styles.wakeTimeText,
              {
                color: theme.colors.light,
              },
            ]}
          >
            {sleepLog.wakeTime
              .toDate()
              .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
              .slice(0, -3)}
          </Text>
          <HighlightedText
            textColor={theme.colors.primary}
            label={formatDateAsTime(sleepLog.upTime.toDate())}
            bgColor={theme.colors.secondary}
          />
        </Container>
        <Container
          style={styles.timeListContainer}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <Text
            style={[
              theme.typography.subtitle2,
              styles.bedTimeLabel,
              {
                color: theme.colors.light,
              },
            ]}
          >
            bedtime
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              styles.fallAsleepTimeLabel,
              {
                color: theme.colors.light,
              },
            ]}
          >
            fell asleep
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              styles.wakeTimeLabel,
              {
                color: theme.colors.light,
              },
            ]}
          >
            woke up
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              styles.getTimeLabel,
              {
                color: theme.colors.light,
              },
            ]}
          >
            got up
          </Text>
        </Container>
        <Container
          style={styles.resultContainer}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <Text
            style={[
              theme.typography.headline5,
              styles.sleepDurationText,
              {
                color: theme.colors.secondary,
              },
            ]}
          >
            {+(sleepLog.sleepDuration / 60).toFixed(1)} hours
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              styles.durationText,
              {
                color: theme.colors.light,
              },
            ]}
          >
            duration
          </Text>
          <Text
            style={[
              theme.typography.headline5,
              styles.sleepEfficiencyText,
              {
                color: theme.colors.secondary,
              },
            ]}
          >
            {((sleepLog.sleepEfficiency || 0) * 100).toFixed(0).toString()}%
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              styles.sleepEfficiencyLabel,
              {
                color: theme.colors.light,
              },
            ]}
          >
            sleep efficiency
          </Text>
        </Container>
        {sleepLog.isDraft && (
          <TouchableOpacity style={styles.overlay} onPress={onEdit}>
            <Ionicons
              name="ios-add-circle"
              size={scale(35)}
              color={theme.colors.secondary}
            />
            <View style={styles.overlayDescriptionContainer}>
              <Text style={styles.overlayTitle}>Complete sleep log?</Text>
              <Text style={styles.overlayDescription}>
                Data imported from Oura
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </Container>
    </Container>
  );
};

export default SleepLogEntryCard;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    opacity: 0.3,
  },
  headerContainer: {
    paddingLeft: scale(24),
    marginBottom: scale(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  upTimeText: { flex: 1 },
  editButton: { marginRight: 8 },
  hidden: { display: 'none' },
  content: {
    minHeight: scale(170),
    alignContent: 'flex-start',
    flexDirection: 'row',
    paddingVertical: scale(9),
    overflow: 'hidden',
  },
  fallAsleepTimeContainer: {
    width: '33%',
    justifyContent: 'space-between',
  },
  fallAsleepTimeText: {
    textAlign: 'center',
    width: '100%',
    paddingLeft: scale(42),
    paddingTop: 1,
    paddingBottom: 0,
  },
  wakeTimeText: {
    textAlign: 'center',
    width: '100%',
    paddingLeft: scale(42),
    paddingTop: scale(10),
    marginLeft: 0,
  },
  timeListContainer: {
    width: '27%',
    justifyContent: 'space-between',
    paddingVertical: scale(7),
  },
  bedTimeLabel: {
    textAlign: 'left',
    width: '100%',
  },
  fallAsleepTimeLabel: {
    textAlign: 'left',
    width: '100%',
  },
  wakeTimeLabel: {
    textAlign: 'left',
    width: '100%',
  },
  getTimeLabel: {
    textAlign: 'left',
    width: '100%',
  },
  resultContainer: {
    width: '40%',
    alignSelf: 'stretch',
    alignContent: 'space-between',
  },
  sleepDurationText: {
    textAlign: 'right',
    width: '100%',
    position: 'absolute',
  },
  durationText: {
    textAlign: 'right',
    width: '100%',
    paddingTop: 0,
    marginTop: scale(19),
  },
  sleepEfficiencyText: {
    textAlign: 'right',
    width: '100%',
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: scale(16),
    bottom: 0,
    position: 'absolute',
  },
  sleepEfficiencyLabel: {
    textAlign: 'right',
    width: '100%',
    bottom: 0,
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RGB2RGBA(dozy_theme.colors.primary, 0.7),
  },
  overlayTitle: {
    fontSize: scale(16),
    color: dozy_theme.colors.secondary,
  },
  overlayDescription: {
    fontSize: scale(13),
    color: RGB2RGBA(dozy_theme.colors.secondary, 0.7),
  },
  overlayDescriptionContainer: {
    marginLeft: scale(14),
  },
});
