import axios from 'axios'

//Base URL reads from .env - localhost fallback for development
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  },  
})


// Centralized error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.detail ||
            error.message ||
            'An unexpected error occured'
        console.error('API Error:', message)
        return Promise.reject(new Error(message))
    }
)

export default api
