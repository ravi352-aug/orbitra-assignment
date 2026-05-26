import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import InputField from '../components/InputField'
import LeftPanel from '../components/LeftPanel'

const validate = ({ email, password }) => {
  const errors = {}
  if (!email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  return errors
}

const MailIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const LockIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

export default function Login() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (touched[name]) {
      const newErrors = validate({ ...form, [name]: value })
      setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const newErrors = validate(form)
    setErrors(prev => ({ ...prev, [name]: newErrors[name] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const data = await authService.login(form)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user?.name || 'traveler'}! 🌍`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex noise-overlay"
      style={{ background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 60%, #061428 100%)' }}>

      {/* Left side */}
      <div className="lg:w-[55%] xl:w-[60%]">
        <LeftPanel />
      </div>

      {/* Right side — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 flex items-center gap-2.5 lg:hidden">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #63d3db, #4f8ef7)' }}>
            <span>✈</span>
          </div>
          <span className="font-display text-base font-bold text-white">
            Voyage<span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #63d3db, #a78bfa)' }}>AI</span>
          </span>
        </div>

        <div className="w-full max-w-md animate-slide-right">
          {/* Card */}
          <div className="glass-card rounded-3xl p-8 sm:p-10"
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}>

            <div className="mb-8 animate-fade-up">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to continue planning your adventures
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div className="animate-fade-up stagger-1">
                <InputField
                  label="Email address"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="hello@example.com"
                  error={errors.email}
                  icon={MailIcon}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="animate-fade-up stagger-2">
                <InputField
                  label="Password"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter your password"
                  error={errors.password}
                  icon={LockIcon}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-end animate-fade-up stagger-3">
                <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl font-display font-semibold text-sm text-white tracking-wide flex items-center justify-center gap-2.5 animate-fade-up stagger-4"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4 animate-fade-up stagger-5">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <p className="text-center text-sm text-slate-500 animate-fade-up stagger-5">
              New to VoyageAI?{' '}
              <Link to="/register"
                className="font-medium text-transparent bg-clip-text hover:opacity-80 transition-opacity"
                style={{ backgroundImage: 'linear-gradient(135deg, #63d3db, #a78bfa)' }}>
                Create an account
              </Link>
            </p>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-slate-600 animate-fade-up stagger-5">
            Protected by enterprise-grade security. Your data is encrypted.
          </p>
        </div>
      </div>
    </div>
  )
}
