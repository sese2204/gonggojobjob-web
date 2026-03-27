import client from './client';

export const getConversations = () =>
  client.get('/api/chat/conversations');

export const createConversation = (title) =>
  client.post('/api/chat/conversations', title);

export const getMessages = (conversationId) =>
  client.get(`/api/chat/conversations/${conversationId}/messages`);

export const sendMessage = (conversationId, content) =>
  client.post(`/api/chat/conversations/${conversationId}/messages`, { content });
