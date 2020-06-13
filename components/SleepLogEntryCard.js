import React from 'react';
import { Text } from 'react-native';
import { Container } from '@draftbit/ui';
import PropTypes from 'prop-types';
import '@firebase/firestore';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';
import HighlightedText from './HighlightedText';

const SleepLogEntryCard = (props) => {
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
          {props.sleepLog.upTime.toDate().toLocaleString('en-US', {
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
            label={props.sleepLog.bedTime.toDate().toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric'
            })}
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
            {props.sleepLog.fallAsleepTime
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
            {props.sleepLog.wakeTime
              .toDate()
              .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
              .slice(0, -3)}
          </Text>
          <HighlightedText
            textColor={theme.colors.primary}
            label={props.sleepLog.upTime.toDate().toLocaleString('en-US', {
              hour: 'numeric',
              minute: 'numeric'
            })}
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
            {+(props.sleepLog.sleepDuration / 60).toFixed(1)} hours
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
            {props.sleepLog.sleepEfficiency.toString().slice(2)}%
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

SleepLogEntryCard.propTypes = {
  sleepLog: PropTypes.object
};

export default SleepLogEntryCard;
