// src/hooks/useLogout.jsx
import { useAuth } from './useAuth';

export const useLogout = () => {
  const { dispatch } = useAuth();

  const logout = () => {
    // Remove user from storage
    localStorage.removeItem('user');

    // Execute logout action
    dispatch({ type: 'LOGOUT' });
  };

  return { logout };
};
