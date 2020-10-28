import React from 'react';
import { Text } from 'react-native';
import { Container } from '@draftbit/ui';
import PropTypes from 'prop-types';
import '@firebase/firestore';
import * as firebase from 'firebase';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';
import HighlightedText from './HighlightedText';
import { formatDateAsTime } from '../utilities/formatDateAsTime';

interface SleepLog {
  bedTime: firebase.firestore.Timestamp;
  fallAsleepTime: firebase.firestore.Timestamp;
  wakeTime: firebase.firestore.Timestamp;
  upTime: firebase.firestore.Timestamp;
  sleepDuration: number;
  sleepEfficiency: number;
}

interface Props {
  sleepLog: SleepLog;
}

const SleepLogEntryCard: React.FC<Props> = ({ sleepLog }) => {
  const theme = dozy_theme;
  return (
    <Container
      style={{
        marginTop: scale(18)
      }}
      elevation={0}
      useThemeGutterPadding={false}
    >
      <Container
        style={{
          paddingLeft: 0,
          marginLeft: scale(24),
          marginBottom: scale(2)
        }}
        elevation={0}
        useThemeGutterPadding={false}
      >
        <Text
          style={[
            theme.typography.headline6,
            {
              color: theme.colors.light,

              width: '100%'
            }
          ]}
        >
          {sleepLog.upTime.toDate().toLocaleString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
      </Container>
      <Container
        style={{
          minHeight: scale(170),
          alignContent: 'flex-start',
          flexDirection: 'row',
          paddingVertical: scale(9),
          borderRadius: theme.borderRadius.global,
          overflow: 'hidden'
        }}
        elevation={2}
        backgroundColor={theme.colors.medium}
        useThemeGutterPadding={true}
      >
        <Container
          style={{
            width: '33%',
            justifyContent: 'space-between',
            alignItems: 'space-between'
          }}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <HighlightedText
            textColor={theme.colors.secondary}
            label={formatDateAsTime(sleepLog.bedTime.toDate())}
            bgColor={theme.colors.primary}
          />
          <Text
            style={{
              color: theme.colors.light,
              textAlign: 'center',
              width: '100%',
              paddingLeft: scale(42),
              paddingTop: 1,
              paddingBottom: 0
            }}
          >
            {sleepLog.fallAsleepTime
              .toDate()
              .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
              .slice(0, -3)}
          </Text>
          <Text
            style={{
              color: theme.colors.light,
              textAlign: 'center',
              width: '100%',
              paddingLeft: scale(42),
              paddingTop: scale(10),
              marginLeft: 0
            }}
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
          style={{
            width: '27%',
            justifyContent: 'space-between',
            alignItems: 'space-between',
            paddingVertical: scale(7)
          }}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',
                width: '100%'
              }
            ]}
          >
            bedtime
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',
                width: '100%'
              }
            ]}
          >
            fell asleep
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',
                width: '100%'
              }
            ]}
          >
            woke up
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'left',

                width: '100%'
              }
            ]}
          >
            got up
          </Text>
        </Container>
        <Container
          style={{
            width: '40%',
            alignItems: 'space-between',
            alignSelf: 'stretch',
            alignContent: 'space-between'
          }}
          elevation={0}
          useThemeGutterPadding={false}
        >
          <Text
            style={[
              theme.typography.headline5,
              {
                color: theme.colors.secondary,
                textAlign: 'right',

                width: '100%',
                position: 'absolute'
              }
            ]}
          >
            {+(sleepLog.sleepDuration / 60).toFixed(1)} hours
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'right',

                width: '100%',
                paddingTop: 0,
                marginTop: scale(19)
              }
            ]}
          >
            duration
          </Text>
          <Text
            style={[
              theme.typography.headline5,
              {
                color: theme.colors.secondary,
                textAlign: 'right',

                width: '100%',
                paddingBottom: 0,
                marginTop: 0,
                marginBottom: scale(16),
                bottom: 0,
                position: 'absolute'
              }
            ]}
          >
            {(sleepLog.sleepEfficiency * 100).toFixed(0).toString()}%
          </Text>
          <Text
            style={[
              theme.typography.subtitle2,
              {
                color: theme.colors.light,
                textAlign: 'right',

                width: '100%',
                bottom: 0,
                position: 'absolute'
              }
            ]}
          >
            sleep efficiency
          </Text>
        </Container>
      </Container>
    </Container>
  );
};

export default SleepLogEntryCard;
