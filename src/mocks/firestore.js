// Mock Firestore — all data is local, no real Firebase
import { dummyUsers, dummyKas, dummyInfoPenting, dummyDokumen, dummyAssets, dummyPeminjaman, dummyVisiMisi } from './data';

// In-memory store initialized from dummy data
const store = {
  users: JSON.parse(JSON.stringify(dummyUsers)),
  kas: JSON.parse(JSON.stringify(dummyKas)),
  infoPenting: JSON.parse(JSON.stringify(dummyInfoPenting)),
  dokumen: JSON.parse(JSON.stringify(dummyDokumen)),
  assets: JSON.parse(JSON.stringify(dummyAssets)),
  peminjaman: JSON.parse(JSON.stringify(dummyPeminjaman)),
  visiMisi: JSON.parse(JSON.stringify(dummyVisiMisi)),
};

// Simulate async delay
const delay = (ms = 100) => new Promise(r => setTimeout(r, ms));

// Firestore-compatible mock
export function mockGetDoc(collection, id) {
  return delay().then(() => {
    const items = store[collection];
    if (!items) return { exists: false, data: () => null };
    const item = Array.isArray(items) ? items.find(i => i.uid === id || i.id === id) : items;
    return { exists: !!item, data: () => item };
  });
}

export function mockGetCollection(collection) {
  return delay().then(() => {
    const items = store[collection];
    return Array.isArray(items) ? items : [items];
  });
}

export function mockAddDoc(collection, data) {
  return delay().then(() => {
    const id = collection.slice(0, -1) + '-' + Date.now();
    const newItem = { id, ...data };
    if (Array.isArray(store[collection])) {
      store[collection].push(newItem);
    }
    return id;
  });
}

export function mockUpdateDoc(collection, id, data) {
  return delay().then(() => {
    if (Array.isArray(store[collection])) {
      const idx = store[collection].findIndex(i => i.uid === id || i.id === id);
      if (idx >= 0) Object.assign(store[collection][idx], data);
    }
  });
}

export function mockDeleteDoc(collection, id) {
  return delay().then(() => {
    if (Array.isArray(store[collection])) {
      store[collection] = store[collection].filter(i => (i.uid || i.id) !== id);
    }
  });
}

export function getStore() { return store; }

// Aliases matching Firestore API patterns
export const doc = (db, collection, id) => ({ collection, id });
export const getDoc = (ref) => mockGetDoc(ref.collection, ref.id);
export const getDocs = () => {};
export const setDoc = (ref, data) => mockUpdateDoc(ref.collection, ref.id, data);
export const addDoc = (ref, data) => mockAddDoc(ref.collection, ref.id);
export const updateDoc = (ref, data) => mockUpdateDoc(ref.collection, ref.id, data);
export const deleteDoc = (ref) => mockDeleteDoc(ref.collection, ref.id);
export const collection = (db, name) => name;
export const query = (...args) => args;
export const where = () => {};
export const orderBy = () => {};
export const onSnapshot = (ref, callback) => {
  // Return mock data immediately
  const colName = typeof ref === 'string' ? ref : (ref.collection || ref);
  const items = store[colName];
  callback({ docs: (Array.isArray(items) ? items : []).map(item => ({ id: item.uid || item.id, data: () => item, exists: true })) });
  return () => {};
};
