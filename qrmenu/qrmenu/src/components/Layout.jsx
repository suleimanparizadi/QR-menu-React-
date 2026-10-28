import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <div className="nav">
        <div>
          <Link to="/dashboard">QR Menu</Link>
        </div>
        <div>
          {user ? (
            <>
              <span style={{ marginRight: 16 }}>
                {user.display_name || user.phone_number}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
      <div className="container">{children}</div>
    </>
  );
}