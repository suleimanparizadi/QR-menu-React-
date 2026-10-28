import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithPassword, getProfile } from '../../api/auth';
import { useAuth } from './AuthContext';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    try {
      const res = await loginWithPassword(phone, password);
      localStorage.setItem('token', res.data.token);

      const profileRes = await getProfile();
      login(res.data.token, profileRes.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'ورود ناموفق بود. لطفاً شماره موبایل و رمز عبور خود را بررسی کنید.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page" dir="rtl">
      <main className="container-narrow auth-content">
        <section className="card auth-card" aria-labelledby="login-title">
          <div className="auth-heading text-center">
            <h2 id="login-title">ورود به حساب کاربری</h2>
            <p className="text-muted">
              برای مدیریت منوی دیجیتال خود وارد شوید.
            </p>
          </div>

          {error && (
            <div className="error auth-error" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label" htmlFor="login-phone">
                شماره موبایل
              </label>
              <input
                id="login-phone"
                className="input w-full"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="شماره موبایل خود را وارد کنید"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="login-password">
                رمز عبور
              </label>
              <input
                id="login-password"
                className="input w-full"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="رمز عبور خود را وارد کنید"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <button
              className="btn btn-accent btn-block btn-lg"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ورود...' : 'ورود به حساب'}
            </button>
          </form>

          <hr className="auth-divider" />

          <p className="auth-register text-center text-muted">
            هنوز حساب کاربری ندارید؟ <Link to="/register">ثبت‌نام کنید</Link>
          </p>
        </section>

        <p className="auth-footer text-center text-muted">
          ☕ ساخته شده با Django و React
        </p>
      </main>
    </div>
  );
}
