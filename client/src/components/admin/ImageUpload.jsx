// ImageUpload.jsx — pick an image, upload to the server, show a live preview
import { useState } from 'react'
import { Upload, ImageOff } from 'lucide-react'
import { api } from '../../api'

export default function ImageUpload({ token, value, onChange, label = 'Image' }) {
  const [uploading, setUploading] = useState(false)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { url } = await api.uploadImage(file, token)
      onChange(url)
    } catch (err) {
      alert(err.message)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/45 mb-1.5">
        {label}
      </label>

      <div className="flex items-center gap-4">
        {value ? (
          <img src={value} alt="preview" className="w-24 h-24 rounded-xl object-cover border border-white/10" />
        ) : (
          <div className="w-24 h-24 rounded-xl bg-white/5 border border-dashed border-white/20 flex items-center justify-center text-ivory/30">
            <ImageOff size={22} />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/15 text-sm text-ivory hover:border-gold transition-all">
            <Upload size={14} />
            {uploading ? 'Uploading...' : 'Choose image'}
            <input type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </label>
          {value && (
            <button type="button" onClick={() => onChange('')} className="text-xs text-rose-400 text-left hover:text-rose-300">
              Remove image
            </button>
          )}
          <p className="text-xs text-ivory/40">JPG, PNG, WEBP — max 5MB</p>
        </div>
      </div>
    </div>
  )
}
