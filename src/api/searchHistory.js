import client from './client';

export const getSearchHistories = (params) =>
  client.get('/api/search-history', { params });

export const getSearchDetail = (searchId) =>
  client.get(`/api/search-history/${searchId}`);

export const getRecommendedJobs = (params) =>
  client.get('/api/search-history/recommended-jobs', { params });

export const deleteRecommendedJob = (recommendedJobId) =>
  client.delete(`/api/search-history/recommended-jobs/${recommendedJobId}`);
