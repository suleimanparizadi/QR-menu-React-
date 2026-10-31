import client from './client';

export const loginWithPassword = (phone_number, password) =>
  client.post('/api/v1/accounts/login/password/', { phone_number, password });

export const logout = () => client.post('/api/v1/accounts/logout/');

export const getProfile = () => client.get('/api/v1/accounts/profile/');

export const changeDisplayName = (display_name) => 
  client.post('/api/v1/accounts/change/name/', { display_name });

export const changePhoneSendOTP = (new_phone_number) => 
  client.post('/api/v1/accounts/change/phone/send_otp/', { new_phone_number });

export const changePhoneVerifyOTP = (phone_number, code) => 
  client.post('/api/v1/accounts/change/phone/verify_otp/', { phone_number, code });

export const initiateRegister = (phone_number, display_name, password, password_confirm) =>
  client.post('/api/v1/accounts/register/', {
    phone_number,
    display_name,
    password,
    password_confirm,
  });

export const sendLoginOTP = (phone_number) =>
  client.post('/api/v1/accounts/login/send_otp/', { phone_number });

export const verifyLoginOTP = (phone_number, code) =>
  client.post('/api/v1/accounts/login/verify/', { phone_number, code });

export const verifyRegister = (phone_number, code) =>
  client.post('/api/v1/accounts/register/verify/', {phone_number, code });