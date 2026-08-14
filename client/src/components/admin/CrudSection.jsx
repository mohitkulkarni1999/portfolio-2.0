// CrudSection.jsx — reusable "add / edit / delete / hide / reorder" screen
// Used for: Experience, Expertise, Metrics, Achievements, Certifications,
// Testimonials, Articles and Gallery.
//
// It automatically shows:
//   - a visibility toggle  if the items have an `is_visible` field
//   - up/down reorder buttons if the items have a `sort_order` field

import { useState } from 'react'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, GripVertical, FileText } from 'lucide-react'
import Modal from './Modal'
import FormField from './FormField'
import ImageUpload from './ImageUpload'
import FileUpload from './FileUpload'
import Toggle from './Toggle'

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i

export default function CrudSection({
  title, columns, items, setItems, token,
  create, update, remove, emptyMessage, hint,
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [dragIndex, setDragIndex] = useState(null)

  const resetForm = () => {
    const blank = {}
    columns.forEach((c) => {
      if (c.type === 'number') blank[c.key] = 0
      else if (c.type === 'select' && c.options?.length) blank[c.key] = c.options[0].value
      else if (c.type === 'image' || c.type === 'file') blank[c.key] = ''
      else blank[c.key] = ''
    })
    setForm(blank)
  }

  const openCreate = () => {
    setEditing(null)
    resetForm()
    setOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setForm({ ...item })
    setOpen(true)
  }

  const handleField = (key, value) => setForm({ ...form, [key]: value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        const updated = await update(editing.id, form, token)
        setItems(items.map((i) => (i.id === updated.id ? updated : i)))
      } else {
        const created = await create(form, token)
        setItems([created, ...items])
      }
      setOpen(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const label = item.title || item.name || item.value
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return
    try {
      await remove(item.id, token)
      setItems(items.filter((i) => i.id !== item.id))
    } catch (err) {
      alert(err.message)
    }
  }

  const toggleVisible = async (item) => {
    try {
      const updated = await update(item.id, { is_visible: !item.is_visible }, token)
      setItems(items.map((i) => (i.id === updated.id ? updated : i)))
    } catch (err) {
      alert(err.message)
    }
  }

  // move an item up/down by swapping sort_order with its neighbour
  const move = async (index, direction) => {
    const swapIndex = index + direction
    if (swapIndex < 0 || swapIndex >= items.length) return
    const a = items[index]
    const b = items[swapIndex]
    try {
      const [ua, ub] = await Promise.all([
        update(a.id, { sort_order: b.sort_order }, token),
        update(b.id, { sort_order: a.sort_order }, token),
      ])
      const next = [...items]
      next[index] = ub
      next[swapIndex] = ua
      setItems(next)
    } catch (err) {
      alert(err.message)
    }
  }

  // drag & drop reorder — the list updates live while dragging, then the new
  // order is saved to the database on drop
  const onDragStart = (index) => setDragIndex(index)

  const onDragEnter = (index) => {
    if (dragIndex === null || dragIndex === index) return
    const next = [...items]
    const [moved] = next.splice(dragIndex, 1)
    next.splice(index, 0, moved)
    setItems(next)
    setDragIndex(index)
  }

  const onDragEnd = async () => {
    const index = dragIndex
    setDragIndex(null)
    if (index === null || items.length < 2) return
    try {
      const ordered = await Promise.all(
        items.map((item, idx) => update(item.id, { sort_order: idx + 1 }, token))
      )
      setItems(ordered)
    } catch (err) {
      alert(err.message)
    }
  }

  const previewCol = columns.find((c) => c.type === 'image' || c.type === 'file')

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-ivory">{title}</h2>
          {hint && <p className="text-xs text-ivory/45 mt-1">{hint}</p>}
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={16} /> Add new
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragEnter={() => onDragEnter(index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => e.preventDefault()}
            className={`card p-4 flex items-center gap-3 transition-all ${
              dragIndex === index ? 'opacity-40 border-gold/50' : ''
            }`}
          >
            <span
              className="w-8 h-12 shrink-0 cursor-grab active:cursor-grabbing select-none flex items-center justify-center rounded-lg border border-white/10 text-ivory/35 hover:text-gold-light hover:border-gold/40 transition-colors"
              title="Drag to reorder"
            >
              <GripVertical size={16} />
            </span>
            {previewCol && item[previewCol.key] && (
              IMAGE_RE.test(item[previewCol.key]) ? (
                <img src={item[previewCol.key]} alt="" className="w-14 h-14 rounded-lg object-cover border border-white/10 shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gold-light shrink-0" title="Document file">
                  <FileText size={18} />
                </div>
              )
            )}
            <div className="flex-1 min-w-0">
              <p className={`font-semibold truncate ${item.is_visible === false ? 'text-ivory/40' : 'text-ivory'}`}>
                {item.title || item.name || item.value}
              </p>
              <p className="text-xs text-ivory/45 truncate">
                {[item.company, item.designation, item.category, item.organization, item.role, item.description, item.label]
                  .filter(Boolean).join(' · ') || '—'}
              </p>
            </div>

            {item.is_visible !== undefined && (
              <Toggle
                on={item.is_visible}
                onChange={() => toggleVisible(item)}
                label={`Show ${item.title || item.name || 'item'}`}
              />
            )}

            <div className="flex flex-col gap-0.5 shrink-0">
              <button onClick={() => move(index, -1)} disabled={index === 0} className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move up">
                <ChevronUp size={15} />
              </button>
              <button onClick={() => move(index, 1)} disabled={index === items.length - 1} className="icon-btn disabled:opacity-30 disabled:cursor-not-allowed" aria-label="Move down">
                <ChevronDown size={15} />
              </button>
            </div>

            <div className="flex gap-2 shrink-0">
              <button onClick={() => openEdit(item)} className="icon-btn" aria-label="Edit">
                <Pencil size={15} />
              </button>
              <button onClick={() => handleDelete(item)} className="icon-btn text-rose-400 hover:text-rose-300 hover:border-rose-400" aria-label="Delete">
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="text-center text-ivory/40 py-10">{emptyMessage}</p>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${title.slice(0, -1)}` : `Add new ${title.slice(0, -1).toLowerCase()}`}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {columns.map((col) => {
            const value = form[col.key] ?? ''
            if (col.type === 'image') {
              return (
                <ImageUpload
                  key={col.key}
                  token={token}
                  value={value}
                  onChange={(url) => handleField(col.key, url)}
                  label={col.label}
                />
              )
            }
            if (col.type === 'file') {
              return (
                <FileUpload
                  key={col.key}
                  token={token}
                  value={value}
                  onChange={(url) => handleField(col.key, url)}
                  label={col.label}
                />
              )
            }
            return (
              <FormField
                key={col.key}
                label={col.label}
                type={col.type === 'textarea' ? 'textarea' : col.type === 'select' ? 'select' : col.type === 'number' ? 'number' : 'text'}
                options={col.options}
                value={value}
                required={col.required}
                onChange={(e) => handleField(col.key, e.target.value)}
              />
            )
          })}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : editing ? 'Save changes' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
