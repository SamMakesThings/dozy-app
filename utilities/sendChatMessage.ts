import firebase from 'firebase/app';
import { Chat } from '../types/custom';

export default async function sendChatMessage(
  db: firebase.firestore.Firestore,
  userId: string,
  msg: Chat
) {
  // Check for errors
  let userDocRef;
  if (typeof userId === 'string') {
    userDocRef = db.collection('users').doc(userId);
  } else if (
    userId === undefined ||
    !('message' in msg) ||
    ('message' in msg && msg.message === '')
  ) {
    console.log('ERROR IN SENDCHATMESSAGE: Invalid chat message');
    return;
  } else {
    console.error('ERROR IN SENDCHATMESSAGE: Invalid UserID');
    return;
  }

  // Add message to convo, also add to user document (for easy browsing)
  userDocRef
    .collection('supportMessages')
    .add(msg)
    .catch(function (error: object) {
      console.error('Error pushing chat message data:', error);
    });
  userDocRef
    .update({
      lastChat: msg
    })
    .catch((err) => {
      console.error('Error pushing chat message data to user doc:', err);
    });
  return;
}
