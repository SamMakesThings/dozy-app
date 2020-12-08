import '@firebase/firestore';
import * as firebase from 'firebase';
import { SleepLog } from '../types/custom';

async function fetchSleepLogs(
  db: firebase.firestore.Firestore,
  userId: string
): Promise<SleepLog[]> {
  // Retrieving sleep logs from Firestore
  return new Promise((resolve) => {
    if (userId === undefined) {
      console.log('ERROR: userId passed to fetchSleepLogs is undefined');
    }

    // Pull the sleep diary collection from Firestore, array it
    let colRef = db.collection('users').doc(userId).collection('sleepLogs');

    colRef
      .orderBy('upTime', 'desc')
      .get()
      .then((res: firebase.firestore.QuerySnapshot) => {
        let sleepLogs: Array<SleepLog> = [];

        // Check that theres >1 entry. If no, set state accordingly
        if (res.size === 0) {
          resolve([]);
        }

        // Otherwise, arrange data and update state
        res.forEach(function (doc: firebase.firestore.QueryDocumentSnapshot) {
          sleepLogs.push(doc.data());
        });
        resolve(sleepLogs);
      })
      .catch(function (error: object) {
        console.log('Error getting sleep logs:', error);
      });
  });
}

export default fetchSleepLogs;
