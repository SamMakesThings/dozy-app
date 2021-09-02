import firestore, {
  FirebaseFirestoreTypes
} from '@react-native-firebase/firestore';
import { omit } from 'lodash';
import { SleepLog } from '../types/custom';
import { decodeUTCTime } from '../utilities/time';

async function fetchSleepLogs(
  db: FirebaseFirestoreTypes.Module,
  userId: string
): Promise<SleepLog[]> {
  // Retrieving sleep logs from Firestore
  return new Promise((resolve) => {
    if (userId === undefined) {
      console.error('ERROR: userId passed to fetchSleepLogs is undefined');
    }

    // Pull the sleep diary collection from Firestore, array it
    const colRef = db.collection('users').doc(userId).collection('sleepLogs');

    colRef
      .orderBy('upTime', 'desc')
      .get()
      .then((res: FirebaseFirestoreTypes.QuerySnapshot) => {
        const sleepLogs: Array<SleepLog> = [];

        // Check that theres >1 entry. If no, set state accordingly
        if (res.size === 0) {
          resolve([]);
        }

        // Otherwise, arrange data and update state
        res.forEach(function (
          doc: FirebaseFirestoreTypes.QueryDocumentSnapshot
        ) {
          const log: SleepLog = {
            logId: doc.id,
            ...(omit(doc.data(), 'id') as Omit<SleepLog, 'logId'>)
          };
          log.bedTime = firestore.Timestamp.fromDate(
            decodeUTCTime(log.bedTime.toDate(), log.version)
          );
          log.fallAsleepTime = firestore.Timestamp.fromDate(
            decodeUTCTime(log.fallAsleepTime.toDate(), log.version)
          );
          log.wakeTime = firestore.Timestamp.fromDate(
            decodeUTCTime(log.wakeTime.toDate(), log.version)
          );
          log.upTime = firestore.Timestamp.fromDate(
            decodeUTCTime(log.upTime.toDate(), log.version)
          );
          sleepLogs.push(log);
        });
        resolve(sleepLogs);
      })
      .catch(function (error: object) {
        console.log('Error getting sleep logs:', error);
      });
  });
}

export default fetchSleepLogs;
