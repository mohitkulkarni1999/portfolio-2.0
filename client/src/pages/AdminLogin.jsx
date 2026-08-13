// AdminLogin.jsx — the private login page
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Building2 } from 'lucide-react'
import { api } from '../api'

export default function AdminLogin() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { token } = await api.login(form)
      localStorage.setItem('token', token)
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gold/15 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-gold/60 via-gold-light/40 to-gold/60 opacity-50 blur-lg" />
        <form onSubmit={handleSubmit} className="relative rounded-3xl bg-onyx border border-white/10 shadow-card p-8 space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl gold-gradient flex items-center justify-center mb-4 shadow-gold">
              <Building2 className="text-noir" size={24} />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ivory">Admin login</h1>
            <p className="text-sm text-ivory/50 mt-1">Sign in to manage your property site</p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/45 mb-1.5">Username</label>
            <input name="username" className="input" placeholder="admin" value={form.username} onChange={handleChange} required autoComplete="username" />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/45 mb-1.5">Password</label>
            <input name="password" type="password" className="input" placeholder="••••••••" value={form.password} onChange={handleChange} required autoComplete="current-password" />
          </div>

          {error && (
            <p className="flex items-center gap-2 text-sm text-rose-400">
              <AlertCircle size={15} /> {error}
            </p>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full !py-4">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <Link to="/" className="flex items-center justify-center gap-1.5 text-xs text-ivory/40 hover:text-gold-light transition-colors">
            <ArrowLeft size={12} /> Back to website
          </Link>
        </form>
      </div>
    </div>
  )
}
