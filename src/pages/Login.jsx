import { useState } from 'react';
import { useLogin } from '../hooks/useLogin';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Destructure our refactored login hook
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fire the login function using our custom hook
    await login(email, password);
  };

  return (
    <div className="auth-form-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h3>Log In to Tool Library</h3>

        <label>Email address:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          autoComplete="username"
          required
        />

        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          autoComplete="current-password"
          required
        />

        <button disabled={isLoading} type="submit">
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>

        {/* This will cleanly catch and display any "Incorrect password" or "Incorrect email" strings thrown from your schema.statics.login method */}
        {error && <div className="error-message">{error}</div>}
      </form>
    </div>
  );
};

export default Login;
