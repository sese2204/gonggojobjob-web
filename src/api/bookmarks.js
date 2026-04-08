import client from './client';

export const createBookmark = (body) =>
  client.post('/api/bookmarks', body);

export const createCustomBookmark = (body) =>
  client.post('/api/bookmarks/custom', body);

export const getBookmarks = (params) =>
  client.get('/api/bookmarks', { params });

export const updateBookmark = (id, body) =>
  client.patch(`/api/bookmarks/${id}`, body);

export const deleteBookmark = (id) =>
  client.delete(`/api/bookmarks/${id}`);
