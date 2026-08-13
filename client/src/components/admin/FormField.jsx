// FormField.jsx — one labeled form input (text / textarea / number / select)
export default function FormField({ label, type = 'text', options = [], ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/45 mb-1.5">
        {label}
      </label>

      {type === 'textarea' && (
        <textarea {...props} rows={props.rows || 4} className="input resize-none" />
      )}

      {type === 'select' && (
        <select {...props} className="input">
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}

      {type !== 'textarea' && type !== 'select' && (
        <input type={type} {...props} className="input" />
      )}
    </div>
  )
}
