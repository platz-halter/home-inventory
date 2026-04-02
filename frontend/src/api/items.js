import api from './axios'

export const itemsApi = {
  // params object maps directly to ?search=&category_id=&tag_id= etc.
  getAll: (params = {}) => api.get('/api/items/', { params }).then(r => r.data),
  getOne: (id) => api.get(`/api/items/${id}`).then(r => r.data),
  create: (data) => api.post('/api/items/', data).then(r => r.data),
  update: (id, data) => api.patch(`/api/items/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/api/items/${id}`).then(r => r.data),
  clone: (id) => api.post(`/api/items/${id}/clone`).then(r => r.data),
  bulkDelete: (ids) => api.delete('/api/items/bulk/delete', { data: ids }).then(r => r.data),
}