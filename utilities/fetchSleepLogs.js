import '@firebase/firestore';

async function fetchSleepLogs(db, userId) {
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
      .then((res) => {
        let sleepLogs = [];

        // Check that theres >1 entry. If no, set state accordingly
        if (res.size === 0) {
          resolve(res);
        }

        // Otherwise, arrange data and update state
        res.forEach(function (doc) {
          sleepLogs.push(doc.data());
        });
        resolve(sleepLogs);
      })
      .catch(function (error) {
        console.log('Error getting sleep logs:', error);
      });
  });
}

export default fetchSleepLogs;
