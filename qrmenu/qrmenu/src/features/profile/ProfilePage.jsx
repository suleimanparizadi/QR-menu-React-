import { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { changeDisplayName, getProfile, changePhoneSendOTP, changePhoneVerifyOTP } from '../../api/auth';



export default function ProfilePage() {
  const { user, login } = useAuth();
  
  // Name state
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMessage, setNameMessage] = useState('');
  
  // Phone state
  const [step, setStep] = useState(1);
  const [newPhone, setNewPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState('');

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameMessage('');
    setNameLoading(true);
    try {
      await changeDisplayName(displayName); // <-- Uses the new function
      const res = await getProfile(); // Refresh user data
      login(localStorage.getItem('token'), res.data.data); // Update context
      setNameMessage('نام با موفقیت تغییر کرد.');
    } catch (err) {
      setNameMessage(err.response?.data?.message || 'خطا در تغییر نام.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setPhoneMessage('');
    setPhoneLoading(true);
    try {
      await changePhoneSendOTP(newPhone);
      setStep(2);
    } catch (err) {
      setPhoneMessage(err.response?.data?.message || 'خطا در ارسال کد. شماره را بررسی کنید.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setPhoneMessage('');
    setPhoneLoading(true);
    try {
      await changePhoneVerifyOTP(newPhone, otpCode);
      const res = await getProfile(); // Refresh user data
      login(localStorage.getItem('token'), res.data.data); // Update context
      setPhoneMessage('شماره موبایل با موفقیت تغییر کرد.');
      setStep(1);
      setNewPhone('');
      setOtpCode('');
    } catch (err) {
      setPhoneMessage(err.response?.data?.message || 'کد وارد شده صحیح نیست یا منقضی شده است.');
    } finally {
      setPhoneLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container" dir="rtl" style={{ paddingTop: 32, paddingBottom: 64, maxWidth: 600 }}>
      <div className="section-header mb-4">
        <h1 style={{ fontSize: '1.6rem' }}>پروفایل کاربری</h1>
      </div>

      <div className="card mb-4">
        <h3 className="mb-3" style={{ fontSize: '1.2rem' }}>اطلاعات حساب</h3>
        
        <div className="mb-3">
          <label className="label">شماره موبایل فعلی</label>
          <input className="input" value={user.phone_number} disabled style={{ opacity: 0.6 }} />
        </div>

        <form onSubmit={handleUpdateName}>
          <div className="mb-3">
            <label className="label">نام نمایشی (نام کافه)</label>
            <input 
              className="input" 
              value={displayName} 
              onChange={(e) => setDisplayName(e.target.value)} 
              required 
            />
          </div>
          {nameMessage && <div className={`mb-3 ${nameMessage.includes('موفقیت') ? 'success' : 'error'}`}>{nameMessage}</div>}
          <button className="btn" type="submit" disabled={nameLoading}>
            {nameLoading ? 'در حال ذخیره...' : 'ذخیره نام'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="mb-3" style={{ fontSize: '1.2rem' }}>تغییر شماره موبایل</h3>
        
        {phoneMessage && <div className={`mb-3 ${phoneMessage.includes('موفقیت') ? 'success' : 'error'}`}>{phoneMessage}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="mb-3">
              <label className="label">شماره موبایل جدید</label>
              <input 
                className="input" 
                type="tel"
                placeholder="۰۹xxxxxxxxx"
                value={newPhone} 
                onChange={(e) => setNewPhone(e.target.value)} 
                required 
              />
            </div>
            <button className="btn" type="submit" disabled={phoneLoading}>
              {phoneLoading ? 'در حال ارسال...' : 'ارسال کد تایید'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-3">
              <label className="label">کد ارسال شده به {newPhone}</label>
              <input 
                className="input" 
                placeholder="۱۲۳۴۵۶"
                value={otpCode} 
                onChange={(e) => setOtpCode(e.target.value)} 
                required 
              />
            </div>
            <button className="btn" type="submit" disabled={phoneLoading}>
              {phoneLoading ? 'در حال تایید...' : 'تایید و تغییر شماره'}
            </button>
            <button 
              type="button" 
              className="btn btn-ghost mt-2" 
              onClick={() => { setStep(1); setOtpCode(''); setPhoneMessage(''); }}
            >
              بازگشت
            </button>
          </form>
        )}
      </div>
    </div>
  );
}