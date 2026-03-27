import client from './client';

export const getSearchHistories = (params) =>
  client.get('/api/search-history', { params });

export const getSearchDetail = (searchId) =>
  client.get(`/api/search-history/${searchId}`);

export const getRecommendedJobs = (params) =>
  client.get('/api/search-history/recommended-jobs', { params });
