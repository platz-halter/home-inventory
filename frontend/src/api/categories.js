import api from './axios'

export const categoriesApi = {
    getAll: () => api.get('/api/categories/').then(r => r.data),
    create: (data) => api.post('/api/categories/', data).then(r => r.data),
    delete: (id) => api.delete(`/api/categories/${id}`).then(r => r.data),
}