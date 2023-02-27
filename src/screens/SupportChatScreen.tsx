import React, { useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { dozy_theme } from '../config/Themes';
import fetchChats from '../utilities/fetchChats';
import sendChatMessage from '../utilities/sendChatMessage';
import { ChatMessage } from '../components/ChatMessage';
import { ChatTextInput } from '../components/ChatTextInput';
import { Chat, Navigation } from '../types/custom';
import Analytics from '../utilities/analytics.service';
import AnalyticsEvents from '../constants/AnalyticsEvents';
import FocusAwareStatusBar from '../components/FocusAwareStatusBar';
import Auth from '../utilities/auth.service';
import Notification from '../utilities/notification.service';
import { useChatsStore } from '../utilities/chatsStore';
import { useUserDataStore } from '../utilities/userDataStore';

export const SupportChatScreen: React.FC<{ navigation: Navigation }> = ({
  navigation,
}) => {
  // Get global state
  const { state } = Auth.useAuth();
  const chats = useChatsStore((chatsState) => chatsState.chats);
  const { coach, userData } = useUserDataStore((state) => ({
    coach: state.coach,
    userData: state.userData,
  }));
  const setChatsInState = useChatsStore((chatsState) => chatsState.setChats);
  const coachNameString = `${coach.firstName} ${coach.lastName}`;
  // Set Firebase DB references if userId is defined
  let colRef: FirebaseFirestoreTypes.CollectionReference;
  if (state.userId) {
    colRef = firestore()
      .collection('users')
      .doc(state.userId)
      .collection('supportMessages');
  }

  useFocusEffect(
    useCallback(() => {
      // If LiveChat has a msg marked as unread, mark it as read in Firebase
      if (userData?.livechatUnreadMsg) {
        firestore().collection('users').doc(state.userId).update({
          livechatUnreadMsg: false,
        });
        // Update the app icon's badge
        Notification.calculateBadgeNumber(
          state.userId!,
          true,
          true,
          false,
        ).then((badgeNumber) => {
          Notification.setBadgeNumber(badgeNumber);
        });
      }
    }, []),
  );

  // Function to fetch chats from Firebase and put them in global state
  async function setChats() {
    async function fetchData() {
      if (!state.userId) throw new Error();
      fetchChats(firestore(), state.userId)
        .then((chats: Array<Chat>) => {
          // Check that theres >1 entry. If no, set state accordingly
          if (chats.length === 0) {
            setChatsInState([]);
          } else {
            setChatsInState(chats);
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
  useEffect(() => {
    setChats();
    // Maybe remove CHAT_MESSAGE push notification
    Notification.removeNotificationsFromTrayByType('CHAT_MESSAGE');
  }, []);

  const theme = dozy_theme;

  // If state is available, show screen. Otherwise, show loading indicator.
  if (chats && userData?.currentTreatments) {
    return (
      <SafeAreaView style={styles.SafeAreaView} edges={['top']}>
        <FocusAwareStatusBar backgroundColor={dozy_theme.colors.medium} />
        <View style={styles.Root}>
          <View style={styles.View_HeaderContainer}>
            {!!coach.image && (
              <Image source={coach.image} style={styles.Img_Profile} />
            )}
            <View style={styles.View_ChatNameContainer}>
              <Text
                style={{
                  ...theme.typography.headline5,
                  ...styles.Text_CoachName,
                }}
              >
                {coach}
              </Text>
              <Text
                style={{ ...theme.typography.body2, ...styles.Text_CoachTitle }}
              >
                {coach.title}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('TreatmentReview')}
              style={styles.faqButton}
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
              renderItem={({ item }) => (
                <ChatMessage
                  message={item.message}
                  time={(
                    item.time as FirebaseFirestoreTypes.Timestamp
                  ).toDate()}
                  sentByUser={item.sentByUser}
                  coach={coachNameString}
                  pending={item.pending}
                />
              )}
              keyExtractor={(item, index) => `${item.message}${index}`}
              inverted={true}
              data={chats}
            />
            <ChatTextInput
              onSend={(typedMsg: string) => {
                if (state.userId && typedMsg?.trim().length) {
                  const newMessage: Chat = {
                    sender:
                      state.profileData.name || userData.userInfo?.displayName,
                    message: typedMsg,
                    time: firestore.Timestamp.fromDate(new Date()),
                    sentByUser: true,
                    pending: true,
                  };
                  setChatsInState([newMessage, ...chats]);
                  sendChatMessage(firestore(), state.userId, newMessage);
                  Analytics.logEvent(AnalyticsEvents.sendMessage);
                }
              }}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  } else {
    // If chats haven't loaded, show indicator
    return (
      <View
        style={[
          { backgroundColor: theme.colors.background },
          styles.loaderContainer,
        ]}
      >
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
          style={styles.loader}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  Root: {
    marginTop: scale(
      Platform.select({
        ios: dozy_theme.spacing.medium,
        android: dozy_theme.spacing.large,
      }) as number,
    ),
    flex: 1,
    backgroundColor: dozy_theme.colors.background,
  },
  SafeAreaView: {
    backgroundColor: dozy_theme.colors.medium,
    flex: 1,
  },
  View_HeaderContainer: {
    backgroundColor: dozy_theme.colors.medium,
    flexDirection: 'row',
    padding: scale(14),
    paddingTop: 0,
  },
  View_ChatNameContainer: {
    flexDirection: 'column',
    marginLeft: scale(10),
    marginTop: scale(-2),
    justifyContent: 'flex-start',
  },
  KbAvoidingView: {
    flex: 1,
  },
  View_ContentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    paddingHorizontal: scale(10),
    paddingTop: scale(10),
  },
  Img_Profile: {
    width: scale(40),
    height: scale(40),
    borderRadius: 500,
  },
  Text_CoachName: {
    color: dozy_theme.colors.secondary,
    fontSize: scale(15),
  },
  Text_CoachTitle: {
    color: dozy_theme.colors.secondary,
    marginTop: scale(-5),
  },
  Text_FAQ: {
    color: dozy_theme.colors.secondary,
    marginBottom: -7,
  },
  faqButton: { flex: 1, alignItems: 'flex-end' },
  loaderContainer: { flex: 1 },
  loader: {
    width: scale(45),
    height: scale(45),
    marginTop: '45%',
    alignSelf: 'center',
  },
});
