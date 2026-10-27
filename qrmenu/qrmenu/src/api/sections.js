import client from './client';

export const createSection = (menuId, data) =>
  client.post(`/api/v1/menu/menus/${menuId}/sections/`, data);

export const updateSection = (sectionId, data) =>
  client.patch(`/api/v1/menu/sections/${sectionId}/`, data);

export const deleteSection = (sectionId) =>
  client.delete(`/api/v1/menu/sections/${sectionId}/`);