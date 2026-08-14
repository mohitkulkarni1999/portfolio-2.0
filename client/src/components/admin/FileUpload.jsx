// FileUpload.jsx — upload an image OR a document (PDF, Word, Excel).
// Shows a live preview: thumbnail for images, a file chip for documents.
import { useState } from 'react'
import { Upload, FileText, FileX } from 'lucide-react'
import { api } from '../../api'

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i

const fileName = (url) => {
  try {
    const clean = url.split('?')[0]
    const name = decodeURIComponent(clean.split('/').pop() || '')
    return name || 'File'
  } catch {
    return 'File'
  }
}

export default function FileUpload({ token, value, onChange, label = 'File' }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.uploadFile(file, token)
      onChange(url)
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const isImage = IMAGE_RE.test(value || '')

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/45 mb-1.5">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {value ? (
          isImage ? (
            <img src={value} alt="preview" className="w-24 h-24 rounded-xl object-cover border border-white/10" />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1 text-center px-1">
              <FileText size={22} className="text-gold-light" />
              <span className="text-[0.6rem] text-ivory/50 leading-tight max-w-full truncate">{fileName(value)}</span>
            </div>
          )
        ) : (
          <div className="w-24 h-24 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-ivory/30">
            <FileX size={22} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm text-ivory hover:border-gold transition-all">
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Choose file'}
            <input
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-xs text-rose-400 text-left hover:text-rose-300">
              Remove file
            </button>
          )}
          <p className="text-xs text-ivory/40">Image, PDF, Word, Excel — max 15MB</p>
        </div>
      </div>
    </div>
  )
}
