import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scale } from 'react-native-size-matters';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { dozy_theme } from '../config/Themes';
import { Chat } from '../types/custom';

export function ChatMessage(item: Chat, index: number) {
  const theme = dozy_theme;

  // Shorten type check to be able to handle fb timestamps or JS dates
  const firebaseTime = item.time as FirebaseFirestoreTypes.Timestamp;

  return (
    <View
      style={{
        ...styles.View_MsgContainer,
        alignItems: item.sentByUser ? 'flex-end' : 'flex-start'
      }}
      key={index}
    >
      <Text style={styles.Text_MetaMsg}>
        {item.sender}{' '}
        {(firebaseTime.toDate != undefined
          ? firebaseTime.toDate()
          : (item.time as Date)
        ).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric'
        })}
      </Text>
      <View
        style={Object.assign(
          { ...styles.View_MsgBubble },
          item.sentByUser ? styles.SentMsg : styles.ReceivedMsg
        )}
      >
        <Text style={{ ...theme.typography.body2, ...styles.Text_Msg }}>
          {item.message}
        </Text>
      </View>
    </View>
  );
}

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
