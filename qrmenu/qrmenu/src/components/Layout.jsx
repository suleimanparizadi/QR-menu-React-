import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/useAuth';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div className="nav" dir="rtl">
        {/* Brand - Links to Welcome Page and has the emoji back */}
        <Link to="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <span style={{ fontSize: '1.4rem' }}>☕</span> QRMenu
        </Link>
        
        <div className="nav-links">
          {user ? (
            <>
              <Link to="/dashboard" style={{ fontWeight: 600, color: 'var(--color-text)' }}>
                داشبورد
              </Link>
              
              <Link to="/profile" className="btn btn-sm btn-ghost" style={{ textTransform: 'none' }}>
                {user.display_name || user.phone_number}
              </Link>
              
              <button onClick={handleLogout} className="btn btn-sm btn-danger">
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">ورود</Link>
              <Link to="/register" className="btn btn-sm">ثبت‌نام</Link>
            </>
          )}
        </div>
      </div>
      <div className="container">{children}</div>
    </>
  );
}