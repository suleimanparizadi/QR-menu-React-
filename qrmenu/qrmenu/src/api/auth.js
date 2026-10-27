import client from './client';

export const loginWithPassword = (phone_number, password) =>
  client.post('/api/v1/accounts/login/password/', { phone_number, password });

export const logout = () => client.post('/api/v1/accounts/logout/');

export const getProfile = () => client.get('/api/v1/accounts/profile/');

export const initiateRegister = (phone_number, display_name, password, password_confirm) =>
  client.post('/api/v1/accounts/register/', {
    phone_number,
    display_name,
    password,
    password_confirm,
  });

export const verifyRegister = (phone_number, code) =>
  client.post('/api/v1/accounts/register/verify/', {phone_number, code });