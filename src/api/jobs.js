import client from './client';

export const searchJobs = ({ tags, query }) =>
  client.post('/api/jobs/search', { tags, query });

export const getSearchConfig = () =>
  client.get('/api/jobs/search/config');
