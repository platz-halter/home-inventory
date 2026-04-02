import { data } from 'autoprefixer'
import api from './axios'

export const categoriesAPI = {
    getAll: () => api.get('/api/categories/').then(r => r.data),
    create: (data) => api.post('/api/categories/', data).then(r => r.data),
    delete: (id) => api.delete(`/api/categories/${id}`).then(r => r.data),
}