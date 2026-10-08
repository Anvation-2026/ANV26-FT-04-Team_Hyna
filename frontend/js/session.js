// session.js
const SessionManager = {
  createSession: (userProfile) => {
    sessionStorage.setItem('geotrust_session', JSON.stringify(userProfile));
  },
  
  getSession: () => {
    const session = sessionStorage.getItem('geotrust_session');
    return session ? JSON.parse(session) : null;
  },
  
  clearSession: () => {
    sessionStorage.removeItem('geotrust_session');
  },
  
  isAuthenticated: () => {
    return SessionManager.getSession() !== null;
  }
};
