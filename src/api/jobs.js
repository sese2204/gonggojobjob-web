import client from './client';

export const searchJobs = ({ tags, query }, { signal } = {}) =>
  client.post('/api/jobs/search', { tags, query }, { signal });

export const getSearchConfig = () =>
  client.get('/api/jobs/search/config');

export const getStats = () =>
  client.get('/api/stats');
