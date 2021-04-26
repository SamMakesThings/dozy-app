import * as firebase from 'firebase';
import { Chat } from '../types/custom';

export default async function sendChatMessage(
  db: firebase.firestore.Firestore,
  userId: string,
  msg: Chat
) {
  // If userId is a string, set Firebase ref. If not, mark an error
  let chatsRef =
    typeof userId === 'string'
      ? db.collection('users').doc(userId).collection('supportMessages')
      : db
          .collection('users')
          .doc('ERRORDELETEME')
          .collection('supportMessages');

  if (userId === undefined) {
    console.log('ERROR IN SENDCHATMESSAGE: userId is undefined');
    return;
  } else if (!('message' in msg)) {
    console.log('ERROR IN SENDCHATMESSAGE: msg is empty');
    return;
  } else if ('message' in msg && msg.message === '') {
    console.log('ERROR IN SENDCHATMESSAGE: Cannot send blank message');
    return;
  }

  chatsRef.add(msg).catch(function (error: object) {
    console.error('Error pushing chat message data:', error);
  });
  return;
}
