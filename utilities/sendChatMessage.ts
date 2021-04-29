import * as firebase from 'firebase';
import { Chat } from '../types/custom';

export default async function sendChatMessage(
  db: firebase.firestore.Firestore,
  userId: string,
  msg: Chat
) {
  // Check for errors
  let chatsRef;
  if (typeof userId === 'string') {
    chatsRef = db.collection('users').doc(userId).collection('supportMessages');
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

  chatsRef.add(msg).catch(function (error: object) {
    console.error('Error pushing chat message data:', error);
  });
  return;
}
