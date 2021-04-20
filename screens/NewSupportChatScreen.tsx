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
            </View>
          </View>
          <ScrollView contentContainerStyle={styles.View_ContentContainer}>
            <Text>test</Text>
            <View style={styles.View_MsgContainer}>
              <Text>Sam Stowers 4:20 PM</Text>
              <View style={styles.View_MsgBubble}>
                <Text>Message content</Text>
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
    padding: scale(10),
    paddingTop: 0
  },
  View_ChatNameContainer: {
    flexDirection: 'column',
    marginLeft: scale(10)
  },
  ItemMargin: {
    marginTop: scale(10)
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingHorizontal: scale(10)
  },
  View_MsgContainer: {},
  View_MsgBubble: {
    backgroundColor: dozy_theme.colors.primary
  },
  SentMsg: {
    backgroundColor: dozy_theme.colors.primary
  },
  ReceivedMsg: {
    backgroundColor: dozy_theme.colors.medium
  },
  Img_Profile: {
    width: scale(55),
    height: scale(55),
    borderRadius: 500
  },
  Text_CoachName: {
    color: dozy_theme.colors.secondary,
    fontSize: scale(17)
  }
});

export default NewSupportChatScreen;
