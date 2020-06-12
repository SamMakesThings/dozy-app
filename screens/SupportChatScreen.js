import React from 'react';
import { SafeAreaView } from 'react-native';
import { scale } from 'react-native-size-matters';
import { WebView } from 'react-native-webview';
import { slumber_theme } from '../config/Themes';

const SupportChatScreen = () => {
  const theme = slumber_theme;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.medium }}>
      <WebView
        source={{
          uri:
            'https://secure.livechatinc.com/licence/12002154/v2/open_chat.cgi'
        }}
        style={{ marginTop: scale(10) }}
      />
    </SafeAreaView>
  );
};

export default SupportChatScreen;
