import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 50%, #061428 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-14 h-14">
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-violet-400 animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          </div>
          <p className="text-slate-400 text-sm font-display tracking-widest uppercase">Loading</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
