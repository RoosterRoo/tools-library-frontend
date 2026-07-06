import { useState } from 'react';
import { useAuth } from './useAuth';
import axios from 'axios';

export const useRegister = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuth();

  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password,
      });

      // Since your backend returns the user data and token on registration:
      // 1. Save user info & token to browser local storage
      localStorage.setItem('user', JSON.stringify(response.data));

      // 2. Update global auth context to log them in instantly
      dispatch({ type: 'LOGIN', payload: response.data });

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      // Grab the custom error message thrown by your mongoose schema validation
      setError(
        err.response?.data?.error || 'Something went wrong during signup',
      );
    }
  };

  return { register, isLoading, error };
};
