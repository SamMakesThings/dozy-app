import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Task } from '../types/custom';

async function fetchTasks(
  db: FirebaseFirestoreTypes.Module,
  userId: string,
): Promise<Task[]> {
  // Retrieving tasks from Firestore
  return new Promise((resolve) => {
    if (userId === undefined) {
      console.error('ERROR: userId passed to fetchTasks is undefined');
    }

    // Pull the tasks collection from Firestore, array it
    const colRef = db.collection('users').doc(userId).collection('tasks');

    colRef
      .where('completedTimestamp', '==', null)
      .get()
      .then((res: FirebaseFirestoreTypes.QuerySnapshot) => {
        const tasks: Array<Task> = [];

        // Check that theres >1 entry. If no, set state accordingly
        if (res.size === 0) {
          resolve([]);
        }

        // Otherwise, arrange data and update state
        res.forEach(function (
          doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
        ) {
          const docData = doc.data();
          const currentTask = {
            label: docData.label,
            completedTimestamp: docData.completedTimestamp,
            dailyRecurring: docData.dailyRecurring,
            visibleAfterDate: docData.visibleAfterDate,
            source: docData.source,
            notification: docData.notification,
          };
          tasks.push({ taskId: doc.id, ...currentTask });
        });
        resolve(tasks);
      })
      .catch(function (error) {
        console.log('Error getting tasks:', error);
      });
  });
}

export default fetchTasks;
