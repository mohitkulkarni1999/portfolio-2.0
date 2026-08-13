// SocialIcons.jsx — brand icons as inline SVGs (lucide removed brand icons)
// Each icon renders a small link. Pass socials as [{ href, type }]
// where type is one of: github, linkedin, twitter, instagram

function GitHub() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.16 1.18a11 11 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
    </svg>
  )
}

function LinkedIn() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

function Twitter() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.49 3.24H4.3l13.31 17.41Z" />
    </svg>
  )
}

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85C2.38 3.92 3.9 2.38 7.15 2.23c1.27-.06 1.65-.07 4.85-.07Zm0 2.16c-3.15 0-3.51.01-4.75.07-2.24.1-3.43 1.28-3.53 3.53-.06 1.24-.07 1.6-.07 4.75s.01 3.51.07 4.75c.1 2.25 1.29 3.43 3.53 3.53 1.24.06 1.6.07 4.75.07s3.51-.01 4.75-.07c2.24-.1 3.43-1.28 3.53-3.53.06-1.24.07-1.6.07-4.75s-.01-3.51-.07-4.75c-.1-2.25-1.29-3.43-3.53-3.53-1.24-.06-1.6-.07-4.75-.07Zm0 3.68a5.84 5.84 0 1 1 0 11.68 5.84 5.84 0 0 1 0-11.68Zm0 2.16a3.68 3.68 0 1 0 0 7.36 3.68 3.68 0 0 0 0-7.36Zm6.1-3.84a1.37 1.37 0 1 1 0 2.74 1.37 1.37 0 0 1 0-2.74Z" />
    </svg>
  )
}

const icons = { github: GitHub, linkedin: LinkedIn, twitter: Twitter, instagram: Instagram }

export default function SocialIcons({ socials = [], className = 'flex items-center gap-3', dark: _dark = false }) {
  const base = 'text-white/70 hover:text-white hover:border-white/50'

  return (
    <div className={className}>
      {socials.map((s) => {
        const Icon = icons[s.type]
        if (!Icon) return null
        return (
          <a
            key={s.type}
            href={s.href}
            target="_blank"
            rel="noreferrer"
            aria-label={s.type}
            className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all border-white/20 ${base}`}
          >
            <Icon />
          </a>
        )
      })}
    </div>
  )
}
