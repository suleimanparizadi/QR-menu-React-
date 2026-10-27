import client from './client';

export const addItems = (sectionId, items) =>
  client.post(`/api/v1/menu/sections/${sectionId}/items/`, { items });

export const updateItem = (itemId, data) =>
  client.patch(`/api/v1/menu/items/${itemId}/`, data);

export const deleteItem = (itemId) =>
  client.delete(`/api/v1/menu/items/${itemId}/`);