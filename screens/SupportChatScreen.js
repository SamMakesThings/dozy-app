import React from 'react';
import { SafeAreaView } from 'react-native';
import { scale } from 'react-native-size-matters';
import { WebView } from 'react-native-webview';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../utilities/authContext';

const SupportChatScreen = () => {
  const theme = dozy_theme;
  const { state } = React.useContext(AuthContext);

  const livechatJavascript = `
  setTimeout(function(){
    LC_API.set_visitor_name("${state.profileData.name}");
    LC_API.set_visitor_email("${state.profileData.email}");
    }, 6000);
  `;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.medium }}>
      <WebView
        source={{
          uri: 'https://direct.lc.chat/12002154/'
        }}
        style={{ marginTop: scale(10) }}
        injectedJavaScript={livechatJavascript}
      />
    </SafeAreaView>
  );
};

export default SupportChatScreen;
