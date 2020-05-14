import React from 'react';
import { Text } from 'react-native';
import { Container } from '@draftbit/ui';
import PropTypes from 'prop-types';
import '@firebase/firestore';
import { slumber_theme } from '../config/Themes';

const SleepLogEntryCard = (props) => {
  const theme = slumber_theme;
  return (
    <Container
      style={{
        marginTop: 20
      }}
      elevation={0}
      useThemeGutterPadding={false}
    >
      <Container
        style={{
          paddingLeft: 0,
          marginLeft: 28,
          marginBottom: 2
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
          minHeight: 200,
          alignContent: 'flex-start',
          flexDirection: 'row',
          paddingVertical: 10,
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
          <Container
            style={{
              width: '94%',
              alignSelf: 'flex-start',
              marginHorizontal: 0,
              borderRadius: theme.borderRadius.button,
              overflow: 'hidden'
            }}
            elevation={0}
            backgroundColor={theme.colors.primary}
            useThemeGutterPadding={false}
          >
            <Text
              style={[
                theme.typography.smallLabel,
                {
                  color: theme.colors.secondary,
                  textAlign: 'center',

                  width: '100%',
                  paddingVertical: 8,
                  paddingHorizontal: 2
                }
              ]}
            >
              {props.sleepLog.bedTime.toDate().toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              })}
            </Text>
          </Container>
          <Text
            style={{
              color: theme.colors.light,
              textAlign: 'center',

              width: '100%',
              paddingLeft: 50,
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
              paddingLeft: 50,
              paddingTop: 12,
              marginLeft: 0
            }}
          >
            {props.sleepLog.wakeTime
              .toDate()
              .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric' })
              .slice(0, -3)}
          </Text>
          <Container
            style={{
              width: '94%',
              alignSelf: 'flex-start',
              borderRadius: theme.borderRadius.button,
              overflow: 'hidden'
            }}
            elevation={0}
            backgroundColor={theme.colors.secondary}
            useThemeGutterPadding={false}
          >
            <Text
              style={[
                theme.typography.smallLabel,
                {
                  color: theme.colors.primary,
                  textAlign: 'center',

                  width: '100%',
                  paddingVertical: 8,
                  paddingHorizontal: 2
                }
              ]}
            >
              {props.sleepLog.upTime.toDate().toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric'
              })}
            </Text>
          </Container>
        </Container>
        <Container
          style={{
            width: '27%',
            justifyContent: 'space-between',
            alignItems: 'space-between',
            paddingVertical: 8
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
                marginTop: 20
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
                marginBottom: 17,
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
