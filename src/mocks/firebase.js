// Mock Firebase module — drop-in replacement for src/firebase.js
import { mockAuth } from './auth';

// Re-export role helpers (same logic, no Firebase needed)
export function saveUserRoleToLocal(role, roleType) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', JSON.stringify({ role, roleType }));
  }
}

export function getUserRoleFromLocal() {
  if (typeof window !== 'undefined') {
    try {
      const data = localStorage.getItem('userRole');
      return data ? JSON.parse(data) : { role: null, roleType: null };
    } catch {
      return { role: null, roleType: null };
    }
  }
  return { role: null, roleType: null };
}

// Mock auth object — delegates to mockAuth with listener support
export const auth = {
  get currentUser() { return mockAuth.currentUser; },
  signInWithEmailAndPassword: (email, password) => mockAuth.signIn(email, password),
  signInWithPopup: () => mockAuth.signInWithPopup(),
  signOut: () => mockAuth.signOut(),
  onAuthStateChanged: (callback) => mockAuth.onAuthStateChanged(callback),
};

export const googleProvider = {};
export const db = {};
export const messaging = null;

export const requestNotificationPermission = async () => {
  console.log('Mock: Notification permission requested');
  return null;
};

export const onForegroundMessage = () => {
  console.log('Mock: Foreground message listener registered');
  return () => {};
};

export const uploadBuktiToDrive = async (fileData, fileName) => {
  console.log('Mock: File upload simulated:', fileName);
  return 'https://drive.google.com/mock-upload/' + fileName;
};
