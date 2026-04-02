import api from './axios'

export const tagsApi = {
    getAll: () => api.get('/api/tags/').then(r => r.data),
    create: (data) => api.post('/api/tags/', data).then(r => r.data),
    delete: (id) => api.delete(`/api/tags/${id}`)
}