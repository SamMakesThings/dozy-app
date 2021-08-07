import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import { dozy_theme } from '../config/Themes';
import Images from '../config/Images';
import fetchChats from '../utilities/fetchChats';
import sendChatMessage from '../utilities/sendChatMessage';
import { ChatMessage } from '../components/ChatMessage';
import { ChatTextInput } from '../components/ChatTextInput';
import { Chat, Navigation } from '../types/custom';
import { Analytics } from '../utilities/analytics.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';

export const SupportChatScreen: React.FC<{ navigation: Navigation }> = ({
  navigation
}) => {
  // Get global state & dispatch
  const { state, dispatch } = React.useContext(AuthContext);

  // Set Firebase DB references if userId is defined
  let colRef: FirebaseFirestoreTypes.CollectionReference;
  if (state.userId) {
    colRef = firestore()
      .collection('users')
      .doc(state.userId)
      .collection('supportMessages');
  }

  useFocusEffect(
    React.useCallback(() => {
      // If LiveChat has a msg marked as unread, mark it as read in Firebase
      if (state.userData?.livechatUnreadMsg) {
        firestore().collection('users').doc(state.userId).update({
          livechatUnreadMsg: false
        });
      }
    }, [])
  );

  // Function to fetch chats from Firebase and put them in global state
  async function setChats() {
    async function fetchData() {
      fetchChats(firestore(), state.userId)
        .then((chats: Array<Chat>) => {
          // Check that theres >1 entry. If no, set state accordingly
          if (chats.length === 0) {
            dispatch({ type: 'SET_CHATS', chats: [] });
          } else {
            dispatch({ type: 'SET_CHATS', chats: chats });
          }

          return;
        })
        .catch(function (error) {
          console.log('Error getting chats:', error);
        });
    }

    // Setup a listener to fetch new chats from Firebase
    colRef.onSnapshot(function () {
      fetchData();
    });
  }

  // Set chats once upon loading
  React.useEffect(() => {
    setChats();
  }, []);

  const theme = dozy_theme;

  // If state is available, show screen. Otherwise, show loading indicator.
  if (state.chats && state.userData?.currentTreatments) {
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
            <TouchableOpacity
              onPress={() => navigation.navigate('TreatmentReview')}
              style={{ flex: 1, alignItems: 'flex-end' }}
            >
              <AntDesign
                name="questioncircle"
                size={scale(25)}
                color={theme.colors.secondary}
              />
              <Text style={{ ...theme.typography.body2, ...styles.Text_FAQ }}>
                FAQ
              </Text>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView
            behavior={Platform.select({ ios: 'padding' })}
            keyboardVerticalOffset={Platform.select({ ios: scale(60) })}
            style={styles.KbAvoidingView}
          >
            <FlatList
              contentContainerStyle={styles.View_ContentContainer}
              renderItem={({ item, index }) => ChatMessage(item, index)}
              keyExtractor={(item, index) => {
                return index.toString();
              }}
              inverted={true}
              data={state.chats}
            />
            <ChatTextInput
              onSend={(typedMsg: string) => {
                sendChatMessage(firestore(), state.userId, {
                  sender: state.profileData.name,
                  message: typedMsg,
                  time: new Date(),
                  sentByUser: true
                });
                Analytics.logEvent(AnalyticsEvents.sendMessage);
              }}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  } else {
    // If chats haven't loaded, show indicator
    return (
      <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
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
  KbAvoidingView: {
    flex: 1
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: scale(10),
    paddingTop: scale(10)
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
  Text_FAQ: {
    color: dozy_theme.colors.secondary,
    marginBottom: -7
  },
  View_ChatInput: {
    backgroundColor: dozy_theme.colors.secondary,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  TextInput: {
    paddingLeft: scale(15),
    paddingVertical: scale(15),
    paddingBottom: Platform.OS == 'ios' ? scale(18) : scale(15),
    flex: 1
  },
  SendIcon: {
    padding: scale(10)
  }
});
