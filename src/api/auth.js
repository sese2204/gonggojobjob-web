import client from './client';

export const getMe = () => client.get('/api/auth/me');

export const refreshToken = (token) =>
  client.post('/api/auth/refresh', { refreshToken: token });
