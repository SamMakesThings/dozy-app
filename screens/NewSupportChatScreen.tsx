import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image
} from 'react-native';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import { dozy_theme } from '../config/Themes';
import { Navigation } from '../types/custom';
import Images from '../config/Images';

export const NewSupportChatScreen: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  const theme = dozy_theme;
  const { state } = React.useContext(AuthContext);

  // If state is available, show screen. Otherwise, show loading indicator.
  if (state.sleepLogs && state.userData?.currentTreatments) {
    return (
      <SafeAreaView style={styles.SafeAreaView}>
        <View style={styles.Root}>
          <View style={styles.View_HeaderContainer}>
            <Image source={Images.SamProfile} style={styles.Img_Profile} />
            <View style={styles.View_ChatNameContainer}>
              <Text
                style={{
                  ...theme.typography.headline5,
                  ...styles.Text_CoachName
                }}
              >
                Sam Stowers
              </Text>
              <Text
                style={{ ...theme.typography.body2, ...styles.Text_CoachTitle }}
              >
                Founder & Sleep Coach
              </Text>
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.View_ContentContainer}>
            <View
              style={{ ...styles.View_MsgContainer, alignItems: 'flex-end' }}
            >
              <Text style={styles.Text_MetaMsg}>Sam Stowers 4:20 PM</Text>
              <View style={{ ...styles.View_MsgBubble, ...styles.SentMsg }}>
                <Text style={{ ...theme.typography.body2, ...styles.Text_Msg }}>
                  Message content{' '}
                </Text>
              </View>
            </View>
            <View
              style={{ ...styles.View_MsgContainer, alignItems: 'flex-start' }}
            >
              <Text style={styles.Text_MetaMsg}>Sam Stowers 4:20 PM</Text>
              <View style={{ ...styles.View_MsgBubble, ...styles.ReceivedMsg }}>
                <Text style={{ ...theme.typography.body2, ...styles.Text_Msg }}>
                  Message content longer and more message stuff here
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  } else {
    // If sleep logs haven't loaded, show indicator
    return (
      <View>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={{
            width: scale(45),
            height: scale(45),
            marginTop: '45%',
            alignSelf: 'center'
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Root: {
    marginTop: scale(20),
    paddingBottom: scale(25),
    flex: 1,
    backgroundColor: dozy_theme.colors.background
  },
  SafeAreaView: {
    backgroundColor: dozy_theme.colors.medium,
    flex: 1
  },
  View_HeaderContainer: {
    backgroundColor: dozy_theme.colors.medium,
    flexDirection: 'row',
    padding: scale(14),
    paddingTop: 0
  },
  View_ChatNameContainer: {
    flexDirection: 'column',
    marginLeft: scale(10),
    marginTop: scale(-2),
    justifyContent: 'flex-start'
  },
  ItemMargin: {
    marginTop: scale(10)
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: scale(10)
  },
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
  Img_Profile: {
    width: scale(40),
    height: scale(40),
    borderRadius: 500
  },
  Text_CoachName: {
    color: dozy_theme.colors.secondary,
    fontSize: scale(15)
  },
  Text_CoachTitle: {
    color: dozy_theme.colors.secondary,
    marginTop: scale(-5)
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

export default NewSupportChatScreen;
