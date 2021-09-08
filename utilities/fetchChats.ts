import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Chat } from '../types/custom';

async function fetchChats(
  db: FirebaseFirestoreTypes.Module,
  userId: string,
): Promise<Chat[]> {
  // Retrieving chats from Firestore
  return new Promise((resolve) => {
    if (userId === undefined) {
      console.error('ERROR: userId passed to fetchChats is undefined');
    }

    // Pull the chats collection from Firestore, array it
    const colRef = db
      .collection('users')
      .doc(userId)
      .collection('supportMessages');

    colRef
      .orderBy('time', 'desc')
      .get()
      .then((res: FirebaseFirestoreTypes.QuerySnapshot) => {
        const chats: Array<Chat> = [];

        // Check that theres >1 entry. If no, set state accordingly
        if (res.size === 0) {
          resolve([]);
        }

        // Otherwise, arrange data and update state
        res.forEach(function (
          doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
        ) {
          const docData = doc.data();
          const currentChat = {
            sender: docData.sender,
            message: docData.message,
            sentByUser: docData.sentByUser,
            time: docData.time,
          };
          chats.push({ chatId: doc.id, ...currentChat });
        });
        resolve(chats);
      })
      .catch(function (error) {
        console.log('Error getting chats:', error);
      });
  });
}

export default fetchChats;
