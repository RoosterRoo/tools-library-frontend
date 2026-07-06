import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLogout } from '../hooks/useLogout';

const Navbar = () => {
  const { user } = useAuth();
  const { logout } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <header>
      <div
        className="container"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '1rem',
          background: '#f4f4f4',
        }}
      >
        <Link to="/">
          <h2>🧰 Community Tool Library</h2>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Condition 1: If user is logged in, show their email and the logout button */}
          {user && (
            <div>
              <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
                {user.email}
              </span>
              <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
                Log Out
              </button>
            </div>
          )}

          {/* Condition 2: If user is NOT logged in, show Login and Register links */}
          {!user && (
            <div>
              <Link to="/login" style={{ marginRight: '10px' }}>
                Login
              </Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
