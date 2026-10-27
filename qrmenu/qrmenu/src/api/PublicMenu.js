import client from './client';

export const getPublicMenu = (id) =>
  client.get(`/menu/${id}/`);