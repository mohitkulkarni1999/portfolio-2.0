// AboutForm.jsx — edit the About section content shown on the landing page
import { useState } from 'react'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../../api'
import FormField from './FormField'
import ImageUpload from './ImageUpload'

export default function AboutForm({ profile, setProfile, token }) {
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
        <h2 className="font-display text-2xl font-semibold text-ivory">About section</h2>
        <p className="text-sm text-ivory/50 mt-1">
          Your story. The highlights become a bullet list on the landing page (one per line).
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Section title" value={form.about_title || ''} onChange={(e) => handleField('about_title', e.target.value)} />
          <ImageUpload token={token} value={form.about_image || ''} onChange={(url) => handleField('about_image', url)} label="About image" />
        </div>
        <FormField label="Description" type="textarea" rows={8} value={form.bio || ''} onChange={(e) => handleField('bio', e.target.value)} />
        <FormField label="Highlights (one per line)" type="textarea" rows={6} value={form.highlights || ''} onChange={(e) => handleField('highlights', e.target.value)} />
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? 'Saving...' : 'Save about'}
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
