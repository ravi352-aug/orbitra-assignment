import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'
import InputField from '../components/InputField'
import LeftPanel from '../components/LeftPanel'

const validate = ({ name, email, password, confirmPassword }) => {
  const errors = {}
  if (!name) errors.name = 'Name is required'
  else if (name.trim().length < 2) errors.name = 'Name must be at least 2 characters'
  if (!email) errors.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address'
  if (!password) errors.password = 'Password is required'
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters'
  else if (!/(?=.*[A-Z])/.test(password)) errors.password = 'Include at least one uppercase letter'
  if (!confirmPassword) errors.confirmPassword = 'Please confirm your password'
  else if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'
  return errors
}

const UserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)
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

function PasswordStrength({ password }) {
  if (!password) return null
  const checks = [
    { label: 'Min 6 chars', pass: password.length >= 6 },
    { label: 'Uppercase', pass: /[A-Z]/.test(password) },
    { label: 'Number', pass: /\d/.test(password) },
    { label: 'Special char', pass: /[^A-Za-z0-9]/.test(password) },
  ]
  const strength = checks.filter(c => c.pass).length
  const colors = ['', '#f87171', '#fb923c', '#facc15', '#4ade80']
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="space-y-2 mt-2">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500"
            style={{ background: i <= strength ? colors[strength] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="flex gap-2 flex-wrap">
          {checks.map(c => (
            <span key={c.label} className="text-xs flex items-center gap-1"
              style={{ color: c.pass ? '#4ade80' : '#475569' }}>
              {c.pass ? '✓' : '○'} {c.label}
            </span>
          ))}
        </div>
        {strength > 0 && (
          <span className="text-xs font-medium" style={{ color: colors[strength] }}>
            {labels[strength]}
          </span>
        )}
      </div>
    </div>
  )
}

export default function Register() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})
  const [agreed, setAgreed] = useState(false)

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
    setTouched({ name: true, email: true, password: true, confirmPassword: true })
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    if (!agreed) {
      toast.error('Please agree to the Terms of Service')
      return
    }

    setLoading(true)
    try {
      const { name, email, password } = form
      const data = await authService.register({ name: name.trim(), email, password })
      login(data.user, data.token)
      toast.success(`Account created! Welcome, ${data.user?.name || 'traveler'}! 🎉`)
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

      {/* Right side */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 relative overflow-y-auto">
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

        <div className="w-full max-w-md animate-slide-right py-16 lg:py-0">
          <div className="glass-card rounded-3xl p-8 sm:p-10"
            style={{ boxShadow: '0 0 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}>

            <div className="mb-7 animate-fade-up">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
                Start exploring
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Create your account and let AI plan your next adventure
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="animate-fade-up stagger-1">
                <InputField
                  label="Full name"
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Jane Doe"
                  error={errors.name}
                  icon={UserIcon}
                  required
                  autoComplete="name"
                />
              </div>

              <div className="animate-fade-up stagger-2">
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

              <div className="animate-fade-up stagger-3">
                <InputField
                  label="Password"
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Min 6 chars, one uppercase"
                  error={errors.password}
                  icon={LockIcon}
                  required
                  autoComplete="new-password"
                />
                <PasswordStrength password={form.password} />
              </div>

              <div className="animate-fade-up stagger-4">
                <InputField
                  label="Confirm password"
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Re-enter your password"
                  error={errors.confirmPassword}
                  icon={LockIcon}
                  required
                  autoComplete="new-password"
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-3 pt-1 animate-fade-up stagger-4">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className={`mt-0.5 w-5 h-5 rounded-md flex-shrink-0 border flex items-center justify-center transition-all ${
                    agreed
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  {agreed && (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="#63d3db" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
                </button>
                <p className="text-xs text-slate-400 leading-relaxed">
                  I agree to the{' '}
                  <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                    Privacy Policy
                  </button>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 rounded-xl font-display font-semibold text-sm text-white tracking-wide flex items-center justify-center gap-2.5 animate-fade-up stagger-5 mt-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Creating account…
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-xs text-slate-600">or</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login"
                className="font-medium text-transparent bg-clip-text hover:opacity-80 transition-opacity"
                style={{ backgroundImage: 'linear-gradient(135deg, #63d3db, #a78bfa)' }}>
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Protected by enterprise-grade security. Your data is encrypted.
          </p>
        </div>
      </div>
    </div>
  )
}
