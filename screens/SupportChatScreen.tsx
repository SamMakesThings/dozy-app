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
  TextInput,
  Platform,
  TouchableOpacity
} from 'react-native';
import { FbLib } from '../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { scale } from 'react-native-size-matters';
import { AuthContext } from '../utilities/authContext';
import { dozy_theme } from '../config/Themes';
import Images from '../config/Images';
import fetchChats from '../utilities/fetchChats';
import { ChatMessage } from '../components/ChatMessage';
import { Chat } from '../types/custom';

export const SupportChatScreen: React.FC = () => {
  // Get global state & dispatch
  const { state, dispatch } = React.useContext(AuthContext);

  let colRef: firebase.firestore.CollectionReference;
  let db: firebase.firestore.Firestore;

  // Set Firebase DB references if userToken is defined
  if (state.userToken) {
    db = FbLib.firestore();
    colRef = db
      .collection('users')
      .doc(state.userToken)
      .collection('supportMessages');
  }

  // Function to fetch chats from Firebase and put them in global state
  async function setChats() {
    async function fetchData() {
      fetchChats(db, state.userToken)
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
            <View style={styles.View_ChatInput}>
              <TextInput
                style={{ ...theme.typography.body2, ...styles.TextInput }}
                placeholder={'Ask a question...'}
              />
              <TouchableOpacity>
                <Ionicons
                  name={'send'}
                  size={scale(25)}
                  style={styles.SendIcon}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    );
  } else {
    // If chats haven't loaded, show indicator
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
