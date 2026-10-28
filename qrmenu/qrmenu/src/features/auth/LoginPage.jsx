import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginWithPassword, getProfile, sendLoginOTP, verifyLoginOTP } from '../../api/auth';
import { useAuth } from '../../features/auth/useAuth';


export default function LoginPage() {
  const [method, setMethod] = useState('password'); // 'password' or 'otp'
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle Password Login
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginWithPassword(phone, password);
      localStorage.setItem('token', res.data.token);
      const profileRes = await getProfile();
      login(res.data.token, profileRes.data.data);
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.message || 'ورود ناموفق بود. شماره موبایل یا رمز عبور اشتباه است.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sending OTP
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendLoginOTP(phone);
      setOtpSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'خطا در ارسال کد. شماره موبایل را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Verifying OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await verifyLoginOTP(phone, code);
      localStorage.setItem('token', res.data.token);
      const profileRes = await getProfile();
      login(res.data.token, profileRes.data.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'کد وارد شده صحیح نیست یا منقضی شده است.');
    } finally {
      setLoading(false);
    }
  };

  const switchMethod = (newMethod) => {
    setMethod(newMethod);
    setError('');
    setOtpSent(false);
    setCode('');
  };

  return (
    <div className="auth-page" dir="rtl">
      <header className="auth-header">
        <Link to="/" className="auth-brand" aria-label="QRMenu - صفحه اصلی">
          <span aria-hidden="true">☕</span> QRMenu
        </Link>
      </header>

      <main className="auth-content">
        <div className="container-narrow">
          <div className="card auth-card">
            
            <div className="auth-heading text-center">
              <h2>ورود به حساب</h2>
              <p className="text-muted">
                {method === 'password' ? 'با شماره موبایل و رمز عبور وارد شوید' : 'با کد یکبار مصرف وارد شوید'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-4" style={{ background: 'var(--surface-input)', padding: 4, borderRadius: 'var(--radius-sm)' }}>
              <button 
                type="button"
                className={`btn ${method === 'password' ? '' : 'btn-ghost'}`} 
                style={{ flex: 1, border: 'none' }}
                onClick={() => switchMethod('password')}
              >
                رمز عبور
              </button>
              <button 
                type="button"
                className={`btn ${method === 'otp' ? '' : 'btn-ghost'}`} 
                style={{ flex: 1, border: 'none' }}
                onClick={() => switchMethod('otp')}
              >
                کد یکبار مصرف
              </button>
            </div>

            {error && <div className="error auth-error">{error}</div>}

            {/* Password Login Form */}
            {method === 'password' && (
              <form onSubmit={handlePasswordLogin}>
                <div className="form-group">
                  <label className="label" htmlFor="phone">شماره موبایل</label>
                  <input
                    id="phone"
                    className="input"
                    type="tel"
                    placeholder="۰۹xxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoComplete="tel"
                    required
                  />
                </div>

                <div className="form-group">
                  <div className="flex justify-between items-center mb-2">
                    <label className="label" htmlFor="password" style={{ marginBottom: 0 }}>رمز عبور</label>
                    {/* Forgot Password button switches to OTP */}
                    <button 
                      type="button" 
                      onClick={() => switchMethod('otp')} 
                      style={{ background: 'none', border: 'none', color: 'var(--color-primary-light)', fontSize: 12, cursor: 'pointer' }}
                    >
                      رمز عبور را فراموش کرده‌اید؟
                    </button>
                  </div>
                  <input
                    id="password"
                    className="input"
                    type="password"
                    placeholder="رمز عبور خود را وارد کنید"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <button className="btn btn-block mt-4" type="submit" disabled={loading}>
                  {loading ? 'در حال ورود...' : 'ورود'}
                </button>
              </form>
            )}

            {/* OTP Login Form */}
            {method === 'otp' && (
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOTP}>
                    <div className="form-group">
                      <label className="label" htmlFor="phoneOtp">شماره موبایل</label>
                      <input
                        id="phoneOtp"
                        className="input"
                        type="tel"
                        placeholder="۰۹xxxxxxxxx"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        required
                      />
                    </div>
                    <button className="btn btn-block mt-4" type="submit" disabled={loading}>
                      {loading ? 'در حال ارسال...' : 'ارسال کد ورود'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOTP}>
                    <div className="form-group">
                      <label className="label" htmlFor="code">کد ارسال شده به {phone}</label>
                      <input
                        id="code"
                        className="input"
                        type="text"
                        placeholder="۱۲۳۴۵۶"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        autoComplete="one-time-code"
                        maxLength={6}
                        required
                      />
                    </div>
                    <button className="btn btn-block mt-4" type="submit" disabled={loading}>
                      {loading ? 'در حال بررسی...' : 'ورود به حساب'}
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-ghost btn-block mt-2"
                      onClick={() => setOtpSent(false)}
                    >
                      تغییر شماره موبایل
                    </button>
                  </form>
                )}
              </div>
            )}

            <hr className="auth-divider" />

            <p className="auth-register text-center text-muted">
              حساب ندارید؟{' '}
              <Link to="/register">ثبت‌نام کنید</Link>
            </p>
          </div>

          <p className="auth-footer text-center text-muted">
            ☕ ساخته شده با Django و React
          </p>
        </div>
      </main>
    </div>
  );
}