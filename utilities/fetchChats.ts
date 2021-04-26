import '@firebase/firestore';
import * as firebase from 'firebase';
import { Chat } from '../types/custom';

async function fetchChats(
  db: firebase.firestore.Firestore,
  userId: string
): Promise<Chat[]> {
  // Retrieving chats from Firestore
  return new Promise((resolve) => {
    if (userId === undefined) {
      console.error('ERROR: userId passed to fetchChats is undefined');
    }

    // Pull the chats collection from Firestore, array it
    let colRef = db
      .collection('users')
      .doc(userId)
      .collection('supportMessages');

    colRef
      .orderBy('time', 'desc')
      .get()
      .then((res: firebase.firestore.QuerySnapshot) => {
        let chats: Array<Chat> = [];

        // Check that theres >1 entry. If no, set state accordingly
        if (res.size === 0) {
          resolve([]);
        }

        // Otherwise, arrange data and update state
        res.forEach(function (doc: firebase.firestore.QueryDocumentSnapshot) {
          let docData = doc.data();
          chats.push({ chatId: doc.id, ...doc.data() });
        });
        resolve(chats);
      })
      .catch(function (error: object) {
        console.log('Error getting chats:', error);
      });
  });
}

export default fetchChats;
