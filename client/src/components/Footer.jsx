// Footer.jsx — elegant dark footer
import { Lock, Mail, MapPin, Phone } from 'lucide-react'
import SocialIcons from './SocialIcons'

const anchor = (key) => (key === 'hero' ? '#home' : '#' + key)

export default function Footer({ profile, sections }) {
  const { name, email, phone, location, github, linkedin, twitter, instagram } = profile || {}

  const explore = (sections || [])
    .filter((s) => s.is_visible && s.section_key !== 'hero')
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((s) => [anchor(s.section_key), s.label])

  const socials = [
    { type: 'github', href: github },
    { type: 'linkedin', href: linkedin },
    { type: 'twitter', href: twitter },
    { type: 'instagram', href: instagram },
  ].filter((s) => s.href)

  const contact = [
    { icon: Phone, text: phone },
    { icon: Mail, text: email },
    { icon: MapPin, text: location },
  ].filter((c) => c.text)

  return (
    <footer className="bg-[#090b0e] text-white/60">
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* brand */}
          <div>
            <a href="#home" className="font-display text-2xl font-semibold text-white">
              {name || 'Portfolio'}<span className="text-gold">.</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed">
              Trusted guidance for every step of your property journey — from first viewing to
              final possession.
            </p>
          </div>

          {/* explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-light mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {(explore.length > 0 ? explore : [['#about', 'About'], ['#contact', 'Contact']]).map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="hover:text-white transition-colors">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-light mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              {contact.map((c) => (
                <li key={c.text} className="flex items-center gap-2.5">
                  <c.icon size={14} className="text-gold shrink-0" />
                  <span className="break-all">{c.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* socials + admin */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-light mb-4">Follow</h4>
            <SocialIcons socials={socials} dark />
            <a
              href="/admin/login"
              className="mt-6 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-gold-light transition-colors"
            >
              <Lock size={12} /> Admin
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {name || 'Portfolio'}. All rights reserved.</p>
          <p>Professional services · {location || 'India'}</p>
        </div>
      </div>
    </footer>
  )
}
