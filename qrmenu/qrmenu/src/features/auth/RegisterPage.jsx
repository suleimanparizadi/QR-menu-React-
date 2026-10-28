import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  initiateRegister,
  verifyRegister,
  getProfile,
} from '../../api/auth';
import { useAuth } from './useAuth';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInitiate = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');

    if (password !== passwordConfirm) {
      setError('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }

    setLoading(true);
    try {
      await initiateRegister(phone, displayName, password, passwordConfirm);
      setStep(2);
    } catch (err) {
      const data = err.response?.data;
      setError(
        data?.message ||
          data?.phone_number?.[0] ||
          data?.password?.[0] ||
          data?.password_confirm?.[0] ||
          'ثبت‌نام ناموفق بود. دوباره تلاش کنید.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    setLoading(true);
    try {
      const res = await verifyRegister(phone, code);
      localStorage.setItem('token', res.data.token);

      const profileRes = await getProfile();
      login(res.data.token, profileRes.data.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'کد وارد شده صحیح نیست.');
    } finally {
      setLoading(false);
    }
  };

  const returnToDetails = () => {
    if (loading) return;
    setStep(1);
    setError('');
  };

  return (
    <div className="auth-page" dir="rtl">
      <main className="container-narrow auth-content">
        <section className="card auth-card" aria-labelledby="register-title">
          <div className="auth-heading text-center">
            <h2 id="register-title">
              {step === 1 ? 'ایجاد حساب جدید' : 'تأیید شماره موبایل'}
            </h2>
            <p className="text-muted">
              {step === 1
                ? 'در چند ثانیه حسابتان را بسازید.'
                : `کد ۶ رقمی ارسال‌شده به ${phone} را وارد کنید.`}
            </p>
          </div>

          {error && (
            <div className="error auth-error" role="alert" aria-live="polite">
              {error}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleInitiate}>
              <div className="form-group">
                <label className="label" htmlFor="register-phone">
                  شماره موبایل
                </label>
                <input
                  id="register-phone"
                  className="input w-full"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="۰۹xxxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="register-display-name">
                  نام نمایشی
                </label>
                <input
                  id="register-display-name"
                  className="input w-full"
                  name="displayName"
                  type="text"
                  placeholder="نام کافه یا رستوران شما"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  autoComplete="organization"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="register-password">
                  رمز عبور
                </label>
                <input
                  id="register-password"
                  className="input w-full"
                  name="password"
                  type="password"
                  placeholder="حداقل ۶ کاراکتر شامل حرف و عدد"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label className="label" htmlFor="register-password-confirm">
                  تکرار رمز عبور
                </label>
                <input
                  id="register-password-confirm"
                  className="input w-full"
                  name="passwordConfirm"
                  type="password"
                  placeholder="رمز عبور را دوباره وارد کنید"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <button
                className="btn btn-accent btn-block btn-lg mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? 'در حال ارسال کد...' : 'ارسال کد تأیید'}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label className="label" htmlFor="register-code">
                  کد تأیید
                </label>
                <input
                  id="register-code"
                  className="input w-full"
                  name="code"
                  type="text"
                  inputMode="numeric"
                  placeholder="۱۲۳۴۵۶"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="one-time-code"
                  maxLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <button
                className="btn btn-accent btn-block btn-lg mt-4"
                type="submit"
                disabled={loading}
              >
                {loading ? 'در حال تأیید...' : 'تأیید و ساخت حساب'}
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-block mt-2"
                onClick={returnToDetails}
                disabled={loading}
              >
                بازگشت
              </button>
            </form>
          )}

          <hr className="auth-divider" />

          <p className="auth-register text-center text-muted">
            حساب دارید؟ <Link to="/login">وارد شوید</Link>
          </p>
        </section>

        <p className="auth-footer text-center text-muted">
          ☕ ساخته شده با Django و React
        </p>
      </main>
    </div>
  );
}
