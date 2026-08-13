// SettingsAdmin.jsx — admin account settings (currently: change password)
import { useState } from 'react'
import { KeyRound, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../../api'
import FormField from './FormField'

export default function SettingsAdmin({ token }) {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleField = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match')
      return
    }
    setSaving(true)
    try {
      await api.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword }, token)
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="font-display text-2xl font-semibold text-ivory">Settings</h2>
      <p className="text-sm text-ivory/50 mt-1">Manage the admin account used to log in to this dashboard.</p>

      <form onSubmit={handleSubmit} className="mt-8 card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-xl bg-gold/15 text-gold-light flex items-center justify-center shrink-0">
            <KeyRound size={20} />
          </span>
          <div>
            <p className="font-semibold text-ivory">Change password</p>
            <p className="text-xs text-ivory/45">Use at least 6 characters</p>
          </div>
        </div>

        <FormField label="Current password" type="password" value={form.currentPassword} onChange={(e) => handleField('currentPassword', e.target.value)} />
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="New password" type="password" value={form.newPassword} onChange={(e) => handleField('newPassword', e.target.value)} />
          <FormField label="Confirm new password" type="password" value={form.confirmPassword} onChange={(e) => handleField('confirmPassword', e.target.value)} />
        </div>

        <div className="flex items-center gap-4 pt-1">
          <button type="submit" disabled={saving} className="btn-primary">
            <Save size={16} /> {saving ? 'Saving...' : 'Update password'}
          </button>
          {saved && (
            <p className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle size={16} /> Password updated
            </p>
          )}
          {error && (
            <p className="flex items-center gap-2 text-sm text-rose-400">
              <AlertCircle size={16} /> {error}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}
