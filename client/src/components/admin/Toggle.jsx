// Toggle.jsx — a small on/off switch used for visibility controls
export default function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative rounded-full transition-colors shrink-0 ${on ? 'gold-gradient' : 'bg-white/15'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-1 left-1 bg-white rounded-full shadow transition-transform ${on ? '' : ''}`}
        style={{ height: '14px', width: '14px', transform: on ? 'translateX(18px)' : 'translateX(0)' }}
      />
    </button>
  )
}
