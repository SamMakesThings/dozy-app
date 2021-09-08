import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Keyboard,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';

export interface ChatTextInputProps {
  viewStyle?: ViewStyle;
  onSend: (value: string) => void;
}

export const ChatTextInput: React.FC<ChatTextInputProps> = (props) => {
  const theme = dozy_theme;

  // Set up local state for chat message
  const [typedMsg, setTypedMsg] = React.useState('');

  return (
    <View style={{ ...styles.View_ChatInput, ...props.viewStyle }}>
      <TextInput
        style={{ ...theme.typography.body2, ...styles.TextInput }}
        placeholder={'Ask a question...'}
        value={typedMsg}
        onChangeText={setTypedMsg}
        multiline
        returnKeyType={'done'}
        onKeyPress={(event) => {
          if (event.nativeEvent.key === 'Enter') {
            Keyboard.dismiss();
          }
        }}
      />
      <TouchableOpacity
        onPress={() => {
          props.onSend(typedMsg);
          setTypedMsg('');
        }}
      >
        <Ionicons
          name={'send'}
          size={scale(25)}
          style={styles.SendIcon}
          color={theme.colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  View_ChatInput: {
    backgroundColor: dozy_theme.colors.secondary,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  TextInput: {
    paddingLeft: scale(15),
    paddingVertical: scale(15),
    paddingBottom: Platform.OS == 'ios' ? scale(18) : scale(15),
    flex: 1,
  },
  SendIcon: {
    padding: scale(10),
  },
});
