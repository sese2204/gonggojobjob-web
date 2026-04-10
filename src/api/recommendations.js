import client from './client';

export const getRecommendations = () =>
  client.get('/api/recommendations');
