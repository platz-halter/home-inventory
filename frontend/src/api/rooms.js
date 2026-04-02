import api from './axios'

export const roomsApi = {
    getAll: () => api.get('/api/rooms/').then(r => r.data),
    create: (data) => api.post('/api/rooms/', data).then(r => r.data),
    delete: (id) => api.delete(`/api/rooms/${id}`).then(r => r.data),
}
