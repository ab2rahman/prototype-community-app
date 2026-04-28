// Mock Authentication — accepts any email/password
// With proper listener notification so Header updates after login/logout

const listeners = [];

function notifyAll(user) {
  listeners.forEach(cb => {
    try { cb(user); } catch (e) { console.error('Auth listener error:', e); }
  });
}

const MOCK_USERS = {
  'pengurus@prototype.local': { uid: 'pengurus-001', role: 'pengurus', roleType: 'ketua', displayName: 'Admin Demo', mustChangePassword: false, googleLinked: false },
  'warga@prototype.local': { uid: 'warga-001', role: 'warga', roleType: 'member', displayName: 'Warga Demo', mustChangePassword: false, googleLinked: false },
};

function getDefaultUser(email) {
  return {
    uid: 'demo-' + Date.now(),
    role: 'warga',
    roleType: 'member',
    displayName: 'Demo User',
    email: email,
    mustChangePassword: false,
    googleLinked: false,
  };
}

function saveUserRoleToLocal(role, roleType) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userRole', JSON.stringify({ role, roleType }));
  }
}

export const mockAuth = {
  currentUser: null,

  signIn(email, password) {
    const userData = MOCK_USERS[email] || getDefaultUser(email);
    const user = { uid: userData.uid, email, displayName: userData.displayName || 'Demo User' };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockUserData', JSON.stringify(userData));
    saveUserRoleToLocal(userData.role, userData.roleType);
    mockAuth.currentUser = user;
    // Notify all listeners so Header/useAuth updates
    notifyAll(user);
    return Promise.resolve({ user });
  },

  signOut() {
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockUserData');
    localStorage.removeItem('userRole');
    mockAuth.currentUser = null;
    // Notify all listeners so Header/useAuth updates
    notifyAll(null);
    return Promise.resolve();
  },

  signInWithPopup() {
    const userData = MOCK_USERS['warga@prototype.local'];
    const user = { uid: userData.uid, email: 'warga@prototype.local', displayName: 'Warga Demo' };
    localStorage.setItem('mockUser', JSON.stringify(user));
    localStorage.setItem('mockUserData', JSON.stringify(userData));
    saveUserRoleToLocal(userData.role, userData.roleType);
    mockAuth.currentUser = user;
    notifyAll(user);
    return Promise.resolve({ user });
  },

  onAuthStateChanged(callback) {
    // Register listener for future notifications
    listeners.push(callback);
    // Call immediately with current state
    const stored = localStorage.getItem('mockUser');
    if (stored) {
      mockAuth.currentUser = JSON.parse(stored);
      callback(mockAuth.currentUser);
    } else {
      callback(null);
    }
    // Return unsubscribe function
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  },
};

export function getMockUserData() {
  try {
    const data = localStorage.getItem('mockUserData');
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function updateMockUserData(updates) {
  const data = getMockUserData();
  if (data) {
    Object.assign(data, updates);
    localStorage.setItem('mockUserData', JSON.stringify(data));
  }
}
