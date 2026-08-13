// SectionsAdmin.jsx — control which sections appear on the public site and in what order
// Toggle a section OFF and it disappears from the landing page instantly.

import { useState } from 'react'
import { ChevronUp, ChevronDown, Save, CheckCircle, AlertCircle } from 'lucide-react'
import { api } from '../../api'
import Toggle from './Toggle'

export default function SectionsAdmin({ sections, setSections, token }) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const ordered = [...sections].sort((a, b) => a.sort_order - b.sort_order)

  const toggle = async (section) => {
    try {
      const updated = await api.sections.update(section.section_key, { is_visible: !section.is_visible }, token)
      setSections(sections.map((s) => (s.section_key === updated.section_key ? updated : s)))
    } catch (err) {
      alert(err.message)
    }
  }

  const reorder = async (index, direction) => {
    const target = index + direction
    if (target < 0 || target >= ordered.length) return
    const next = [...ordered]
    const [a] = next.splice(index, 1)
    next.splice(target, 0, a)
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const updated = await api.sections.reorder(next.map((s) => s.section_key), token)
      setSections(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ivory">Website sections</h2>
          <p className="text-sm text-ivory/50 mt-1">
            Toggle sections on/off and set the order they appear on the landing page.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {saved && (
            <p className="flex items-center gap-2 text-sm text-emerald-400">
              <CheckCircle size={16} /> Order saved
            </p>
          )}
          {error && (
            <p className="flex items-center gap-2 text-sm text-rose-400">
              <AlertCircle size={16} /> {error}
            </p>
          )}
          {saving && (
            <p className="flex items-center gap-2 text-sm text-ivory/50">
              <Save size={16} /> Saving...
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2.5">
        {ordered.map((section, index) => (
          <div key={section.section_key} className="card p-4 flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-semibold text-ivory/50 shrink-0">
              {section.sort_order}
            </span>
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${section.is_visible ? 'text-ivory' : 'text-ivory/40'}`}>{section.label}</p>
              <p className="text-xs text-ivory/45">{section.is_visible ? 'Visible on site' : 'Hidden from site'}</p>
            </div>

            <div className="flex flex-col gap-0.5 shrink-0">
              <button onClick={() => reorder(index, -1)} disabled={index === 0 || saving} className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move section up">
                <ChevronUp size={15} />
              </button>
              <button onClick={() => reorder(index, 1)} disabled={index === ordered.length - 1 || saving} className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move section down">
                <ChevronDown size={15} />
              </button>
            </div>

            <Toggle on={section.is_visible} onChange={() => toggle(section)} label={`Show ${section.label}`} />
          </div>
        ))}
      </div>

      <div className="mt-6 card p-5 border-gold/30 bg-gold/5">
        <h3 className="font-display font-semibold text-ivory">How it works</h3>
        <p className="text-sm text-ivory/55 mt-1">
          The public page renders each section in the order above. Turn one off and it
          disappears automatically — no empty gaps, no code changes.
        </p>
      </div>
    </div>
  )
}
