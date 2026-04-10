import client from './client';

export const searchActivities = ({ tags, query }) =>
  client.post('/api/activities/search', { tags, query });
