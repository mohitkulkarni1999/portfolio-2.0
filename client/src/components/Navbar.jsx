// Navbar.jsx — elegant sticky bar: transparent over the hero, frosted white when scrolled
// Links are built from the sections enabled in the admin dashboard.
import { useEffect, useState } from 'react'
import { Menu, X, Lock } from 'lucide-react'

const anchor = (key) => (key === 'hero' ? '#home' : '#' + key)

export default function Navbar({ name, sections }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = (sections || [])
    .filter((s) => s.is_visible)
    .filter((s) => s.section_key !== 'hero')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => ({ href: anchor(s.section_key), label: s.label }))

  // over the hero we need light text; once scrolled, dark text on white
  const solid = scrolled || open
  const linkClass = solid ? 'text-ink/70 hover:text-ink' : 'text-white/80 hover:text-white'

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        solid ? 'bg-noir backdrop-blur-lg shadow-sm border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 h-16 md:h-[4.5rem]">
        <a href="#home" className={`font-display text-2xl font-bold transition-colors ${solid ? 'text-ink' : 'text-white'}`}>
          {name || 'Portfolio'}<span className="text-gold">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`text-sm font-medium transition-colors ${linkClass}`}>
              {l.label}
            </a>
          ))}
          <a
            href="/admin/login"
            className={`flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full border transition-all ${
              solid
                ? 'border-white/20 text-ivory hover:border-gold/70 hover:text-gold-light'
                : 'border-white/40 text-white hover:border-white'
            }`}
          >
            <Lock size={13} /> Admin
          </a>
        </div>

        <button
          className={`md:hidden p-1 transition-colors ${solid ? 'text-ink' : 'text-white'}`}
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-noir px-6 pb-5 pt-2 flex flex-col gap-3 shadow-lg border-t border-white/5">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-sm font-medium text-ivory/80 hover:text-ivory">
              {l.label}
            </a>
          ))}
          <a href="/admin/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-gold-light">
            Admin login
          </a>
        </div>
      )}
    </header>
  )
}
