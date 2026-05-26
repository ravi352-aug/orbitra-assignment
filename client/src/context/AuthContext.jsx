import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('travelai_token') || localStorage.getItem('token')
    const storedUser = localStorage.getItem('travelai_user') || localStorage.getItem('user')
    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch {
        localStorage.removeItem('travelai_token')
        localStorage.removeItem('travelai_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    localStorage.setItem('travelai_token', jwtToken)
    localStorage.setItem('travelai_user', JSON.stringify(userData))
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
    navigate('/dashboard')
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('travelai_token')
    localStorage.removeItem('travelai_user')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
