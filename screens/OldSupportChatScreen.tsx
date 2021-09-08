import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';
import firestore from '@react-native-firebase/firestore';
import { WebView } from 'react-native-webview';
import { dozy_theme } from '../config/Themes';
import { AuthContext } from '../context/AuthContext';
import refreshUserData from '../utilities/refreshUserData';

const SupportChatScreen: React.FC = () => {
  const theme = dozy_theme;
  const { state, dispatch } = React.useContext(AuthContext);

  const livechatJavascript = `
  setTimeout(function(){
    LC_API.set_visitor_name("${state.profileData.name}");
    LC_API.set_visitor_email("${state.profileData.email}");
    LC_API.update_custom_variables([
    {name: "userId", value: state.userId},
    {name: "currentTreatmentModule", value: state.userData.currentTreatments.currentModule}]);
    }, 6000);
  `;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.medium }]}
    >
      <WebView
        source={{
          uri: 'https://direct.lc.chat/12002154/',
        }}
        style={{ marginTop: scale(10) }}
        injectedJavaScript={livechatJavascript}
        onLoad={() => {
          // If LiveChat has a msg marked as unread, mark it as read in Firebase
          if (state.userData?.livechatUnreadMsg) {
            firestore().collection('users').doc(state.userId).update({
              livechatUnreadMsg: false,
            });
            refreshUserData(dispatch);
          }
        }}
        onMessage={() =>
          console.log(
            'Got a message from webview?? This should not happen. This is just here bc it is a required prop',
          )
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});

export default SupportChatScreen;
