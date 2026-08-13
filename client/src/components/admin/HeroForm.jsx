// HeroForm.jsx — edit the Hero section content shown on the landing page
import { useState } from 'react'
import { Save, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../../api'
import FormField from './FormField'
import ImageUpload from './ImageUpload'

export default function HeroForm({ profile, setProfile, token }) {
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
        <h2 className="font-display text-2xl font-semibold text-ivory">Hero section</h2>
        <p className="text-sm text-ivory/50 mt-1">
          The first thing visitors see. Leave a field blank to use your profile as the fallback.
        </p>
      </div>

      <div className="card p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Heading" value={form.hero_heading || ''} onChange={(e) => handleField('hero_heading', e.target.value)} />
          <FormField label="Subheading" value={form.hero_subheading || ''} onChange={(e) => handleField('hero_subheading', e.target.value)} />
        </div>
        <FormField label="Description" type="textarea" rows={4} value={form.hero_description || ''} onChange={(e) => handleField('hero_description', e.target.value)} />
      </div>

      <div className="card p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ivory/45">Images</p>
        <ImageUpload token={token} value={form.cover_image || ''} onChange={(url) => handleField('cover_image', url)} label="Background image (or video URL)" />
        <ImageUpload token={token} value={form.photo_url || ''} onChange={(url) => handleField('photo_url', url)} label="Profile image" />
      </div>

      <div className="card p-6 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-ivory/45">Buttons</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Primary button text" value={form.btn_primary_text || ''} onChange={(e) => handleField('btn_primary_text', e.target.value)} />
          <FormField label="Primary button link (e.g. #experience)" value={form.btn_primary_link || ''} onChange={(e) => handleField('btn_primary_link', e.target.value)} />
          <FormField label="Secondary button text" value={form.btn_secondary_text || ''} onChange={(e) => handleField('btn_secondary_text', e.target.value)} />
          <FormField label="Secondary button link (e.g. #contact)" value={form.btn_secondary_link || ''} onChange={(e) => handleField('btn_secondary_link', e.target.value)} />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? 'Saving...' : 'Save hero'}
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
