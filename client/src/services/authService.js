import axios from 'axios'
import API_URL from '../config/api'

// ── Axios Instance ──────────────────────────────────────────────
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
})

// Attach JWT token to every request if present
// For JSON requests, axios will still set the correct header automatically.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('travelai_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// Normalize error messages from the server
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Something went wrong. Please try again.'

    // Global 401 handling: clear auth and redirect to login
    if (error.response?.status === 401) {
      try {
        localStorage.removeItem('travelai_token')
        localStorage.removeItem('travelai_user')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      } catch (e) {}
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(new Error(message))
  }
)

// ── Auth Endpoints ──────────────────────────────────────────────
export const authService = {
  register: async ({ name, email, password }) => {
    const { data } = await api.post('/auth/register', { name, email, password })
    return data // expects { token, user }
  },

  login: async ({ email, password }) => {
    const { data } = await api.post('/auth/login', { email, password })
    return data // expects { token, user }
  },
}

export default api
