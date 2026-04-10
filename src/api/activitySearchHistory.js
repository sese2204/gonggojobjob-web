import client from './client';

export const getActivitySearchHistories = (params) =>
  client.get('/api/activity-search-history', { params });

export const getActivitySearchDetail = (searchId) =>
  client.get(`/api/activity-search-history/${searchId}`);

export const getRecommendedActivities = (params) =>
  client.get('/api/activity-search-history/recommended-activities', { params });

export const deleteRecommendedActivity = (recommendedActivityId) =>
  client.delete(`/api/activity-search-history/recommended-activities/${recommendedActivityId}`);
