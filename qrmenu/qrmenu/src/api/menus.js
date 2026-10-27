import client from './client';

export const getMenus = () => client.get('/api/v1/menu/menus/');
export const getMenu = (id) => client.get(`/api/v1/menu/menus/${id}/`);
export const createMenu = (data) => client.post('/api/v1/menu/menus/', data);
export const updateMenu = (id, data) => client.patch(`/api/v1/menu/menus/${id}/`, data);
export const deleteMenu = (id) => client.delete(`/api/v1/menu/menus/${id}/`);
export const getMenuPreview = (id) => client.get(`/api/v1/menu/menus/${id}/preview/`);
export const getAnalytics = (id, days = 7) =>
  client.get(`/api/v1/menu/menus/${id}/analytics/?days=${days}`);