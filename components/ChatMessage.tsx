import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

export const ChatMessage: React.FC<{
  name: string;
  message: string;
  time: Date;
  sentByUser: boolean;
}> = ({ name, message, time, sentByUser }) => {
  const theme = dozy_theme;
  return (
    <View
      style={{
        ...styles.View_MsgContainer,
        alignItems: sentByUser ? 'flex-end' : 'flex-start'
      }}
    >
      <Text style={styles.Text_MetaMsg}>
        {name}{' '}
        {time.toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })}
      </Text>
      <View
        style={Object.assign(
          { ...styles.View_MsgBubble },
          sentByUser ? styles.SentMsg : styles.ReceivedMsg
        )}
      >
        <Text style={{ ...theme.typography.body2, ...styles.Text_Msg }}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  View_MsgContainer: {
    marginTop: scale(15),
    alignSelf: 'stretch'
  },
  View_MsgBubble: {
    padding: scale(12),
    borderRadius: scale(6)
  },
  SentMsg: {
    backgroundColor: dozy_theme.colors.primary,
    marginLeft: scale(10)
  },
  ReceivedMsg: {
    backgroundColor: dozy_theme.colors.medium,
    marginRight: scale(10)
  },
  Text_Msg: {
    color: dozy_theme.colors.secondary
  },
  Text_MetaMsg: {
    color: dozy_theme.colors.secondary,
    opacity: 0.8,
    marginBottom: scale(2)
  }
});

export default ChatMessage;
