import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Chat } from '../types/custom';

export default async function sendChatMessage(
  db: FirebaseFirestoreTypes.Module,
  userId: string,
  msg: Chat,
): Promise<void> {
  // Check for user id validation errors
  let userDocRef;
  if (typeof userId === 'string') {
    userDocRef = db.collection('users').doc(userId);
  } else {
    console.error('ERROR IN SENDCHATMESSAGE: Invalid UserID');
    return;
  }
  // Check message validation.
  if (
    userId === undefined ||
    !('message' in msg) ||
    ('message' in msg && msg.message.trim().length === 0)
  ) {
    console.log('ERROR IN SENDCHATMESSAGE: Invalid chat message');
    return;
  }

  // Add message to convo, also add to user document (for easy browsing)
  userDocRef
    .collection('supportMessages')
    .add(msg)
    .catch(function (error) {
      console.error('Error pushing chat message data:', error);
    });
  userDocRef
    .update({
      lastChat: msg,
    })
    .catch((err) => {
      console.error('Error pushing chat message data to user doc:', err);
    });
  return;
}
