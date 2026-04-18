import client from './client';

export const searchActivities = ({ tags, query }, { signal } = {}) =>
  client.post('/api/activities/search', { tags, query }, { signal });
