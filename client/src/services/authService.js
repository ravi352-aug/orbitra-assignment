import axios from 'axios'

// ── Axios Instance ──────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
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
