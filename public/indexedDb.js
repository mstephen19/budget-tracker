const checkIfIndexedDbSupported = () => {
  window.indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDb ||
    window.msIndexedDB;
  if (!window.indexedDB) return false;
  return true;
};

let db;

const request = indexedDB.open('budget', 1);

request.onupgradeneeded = ({ target: { result } }) => {
  const dataB = result;
  dataB.createObjectStore('budgetTracker', {
    autoIncrement: true,
  });
};

request.onerror = ({ target: { errorCode } }) => {
  console.error(new Error(`Error with code ${errorCode}`));
};

request.onsuccess = ({ target: { result } }) => {
  db = result;
  navigator.onLine && checkDb();
};

function saveRecord(data) {
  const transaction = db.transaction(['budgetTracker'], 'readwrite');
  const store = transaction.objectStore('budgetTracker');
  store.add(data);
}

function checkDb() {
  const transaction = db.transaction(['budgetTracker'], 'readwrite');
  const store = transaction.objectStore('budgetTracker');
  const allInDb = store.getAll();

  allInDb.onsuccess = async () => {
    if (allInDb.result.length === 0) return;
    const response = await fetch('/api/transaction/bulk', {
      method: 'POST',
      body: JSON.stringify(allInDb.result),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) return;
    const transaction = db.transaction(['budgetTracker'], 'readwrite');
    const store = transaction.objectStore('budgetTracker');
    store.clear();
  };
}

window.addEventListener('online', checkDb);
