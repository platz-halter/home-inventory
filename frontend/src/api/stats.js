import api from './axios'

export const statsApi = {
    get: () => api.get('/api/stats/').then(r => r.data),
    
}