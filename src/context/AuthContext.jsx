import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../lib/services';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, if we have a stored token, verify it's still valid by
  // fetching the current admin profile. Prevents a "flash of logged out"
  // state on refresh while also catching expired tokens.
  useEffect(() => {
    const token = localStorage.getItem('vh_token');
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .me()
      .then((data) => setAdmin(data))
      .catch(() => {
        localStorage.removeItem('vh_token');
        localStorage.removeItem('vh_admin');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const { token, ...adminData } = data;
    localStorage.setItem('vh_token', token);
    localStorage.setItem('vh_admin', JSON.stringify(adminData));
    setAdmin(adminData);
    return adminData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('vh_token');
    localStorage.removeItem('vh_admin');
    setAdmin(null);
  }, []);

  const value = {
    admin,
    loading,
    isAuthenticated: Boolean(admin),
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
