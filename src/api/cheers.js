import client from './client';

export const getCheers = (params) =>
  client.get('/api/cheers', { params });

export const postCheer = ({ nickname, content }) =>
  client.post('/api/cheers', { nickname, content });
