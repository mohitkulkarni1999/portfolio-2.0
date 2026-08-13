// ProfileForm.jsx — edit your personal info: name, designation, photo + contact details
import { useState } from 'react'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../../api'
import FormField from './FormField'
import ImageUpload from './ImageUpload'

export default function ProfileForm({ profile, setProfile, token }) {
  const [form, setForm] = useState(profile || {})
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleField = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const updated = await api.updateProfile(form, token)
      setProfile(updated)
      setForm(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-ivory">Personal profile</h2>
        <p className="text-sm text-ivory/50 mt-1">
          Your name, designation and contact details. The Hero and About content live in their own tabs.
        </p>
      </div>

      <div className="card p-6">
        <ImageUpload token={token} value={form.photo_url || ''} onChange={(url) => handleField('photo_url', url)} label="Profile photo" />
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Name" value={form.name || ''} onChange={(e) => handleField('name', e.target.value)} />
          <FormField label="Designation (e.g. VP – Sales & Strategy)" value={form.title || ''} onChange={(e) => handleField('title', e.target.value)} />
        </div>
        <FormField label="Headline (one-liner shown under your name)" value={form.headline || ''} onChange={(e) => handleField('headline', e.target.value)} />
        <FormField label="Short intro" type="textarea" rows={3} value={form.intro || ''} onChange={(e) => handleField('intro', e.target.value)} />
      </div>

      <div className="card p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ivory/45">Contact details (used in the Contact section)</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Email" value={form.email || ''} onChange={(e) => handleField('email', e.target.value)} />
          <FormField label="Phone" value={form.phone || ''} onChange={(e) => handleField('phone', e.target.value)} />
          <FormField label="Location (e.g. Pune, India)" value={form.location || ''} onChange={(e) => handleField('location', e.target.value)} />
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ivory/45">Social links (leave blank to hide)</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="LinkedIn URL" value={form.linkedin || ''} onChange={(e) => handleField('linkedin', e.target.value)} />
          <FormField label="GitHub URL" value={form.github || ''} onChange={(e) => handleField('github', e.target.value)} />
          <FormField label="Twitter / X URL" value={form.twitter || ''} onChange={(e) => handleField('twitter', e.target.value)} />
          <FormField label="Instagram URL" value={form.instagram || ''} onChange={(e) => handleField('instagram', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? 'Saving...' : 'Save profile'}
        </button>
        {saved && (
          <p className="flex items-center gap-2 text-sm text-emerald-400">
            <CheckCircle size={16} /> Saved!
          </p>
        )}
        {error && (
          <p className="flex items-center gap-2 text-sm text-rose-400">
            <AlertCircle size={16} /> {error}
          </p>
        )}
      </div>
    </form>
  )
}
