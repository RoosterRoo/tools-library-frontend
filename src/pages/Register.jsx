import { useState } from 'react';
import { useRegister } from '../hooks/useRegister';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Destructure our custom hook
  const { register, error, isLoading } = useRegister();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Call the signup function from our hook
    await register(name, email, password);
  };

  return (
    <div className="auth-form-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h3>Sign Up for Tool Library</h3>

        <label>Name:</label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />

        <label>Email address:</label>
        <input
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
        />

        {/* Disable button while the network request is loading */}
        <button disabled={isLoading} type="submit">
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>

        {/* Display the validation error from MongoDB/Mongoose if it exists */}
        {error && (
          <div
            className="error-message"
            style={{ color: 'red', marginTop: '10px' }}
          >
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default Register;
