import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { initiateRegister, verifyRegister, getProfile } from '../../api/auth';
import { useAuth } from './AuthContext';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInitiate = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await initiateRegister(phone, displayName, password, passwordConfirm);
      setStep(2);
    } catch (err) {
      const data = err.response?.data;
      setError(data?.message || JSON.stringify(data) || 'Registration failed');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await verifyRegister(phone, code);
      localStorage.setItem('token', res.data.token);
      const profileRes = await getProfile();
      login(res.data.token, profileRes.data.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: 400 }}>
      <div className="card">
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}

        {step === 1 && (
          <form onSubmit={handleInitiate}>
            <input className="input" placeholder="Phone number (09xxxxxxxxx)"
              value={phone} onChange={(e) => setPhone(e.target.value)} />
            <input className="input" placeholder="Display name"
              value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            <input className="input" type="password" placeholder="Password"
              value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="input" type="password" placeholder="Confirm password"
              value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
            <button className="btn" type="submit">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerify}>
            <p style={{ marginBottom: 12 }}>Enter the code sent to {phone}</p>
            <input className="input" placeholder="6-digit code"
              value={code} onChange={(e) => setCode(e.target.value)} />
            <button className="btn" type="submit">Verify & Register</button>
          </form>
        )}

        <p style={{ marginTop: 12 }}>
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}