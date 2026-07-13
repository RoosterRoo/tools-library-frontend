// src/hooks/useLogin.jsx
import { useState } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';

const API_URL = 'https://tools-library-backend.onrender.com';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuth();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      // Save user & token to local storage
      localStorage.setItem('user', JSON.stringify(response.data));

      // Update global auth context
      dispatch({ type: 'LOGIN', payload: response.data });
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  return { login, isLoading, error };
};
