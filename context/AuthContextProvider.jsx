import { useEffect, useReducer } from 'react';
import AuthContext from './AuthContext';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, authIsReady: true };
    case 'LOGOUT':
      return { user: null, authIsReady: true };
    case 'AUTH_READY':
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    dispatch({ type: 'AUTH_READY', payload: user });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
