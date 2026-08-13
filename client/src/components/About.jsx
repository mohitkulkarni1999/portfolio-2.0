// About.jsx — portrait, story and highlights (all content from the admin)
import { Mail, MapPin, Phone, ArrowRight, Check } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const PORTRAIT_PLACEHOLDER =
  'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80'

export default function About({ profile }) {
  const { name, bio, email, phone, location, photo_url, about_image, about_title, highlights } = profile || {}

  // highlights can be separated by new lines or commas
  const bullets = (highlights || '')
    .split(/\r?\n|,/)
    .map((h) => h.trim())
    .filter(Boolean)

  const facts = [
    { icon: Phone, label: 'Phone', value: phone, href: phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : null },
    { icon: Mail, label: 'Email', value: email, href: email ? `mailto:${email}` : null },
    { icon: MapPin, label: 'Based in', value: location, href: null },
  ].filter((f) => f.value)

  const image = about_image || photo_url || PORTRAIT_PLACEHOLDER
  const title = about_title || 'Helping you make the right move'

  return (
    <section id="about" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* portrait */}
          <Reveal className="order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="absolute -top-4 -left-4 w-full h-full rounded-[1.75rem] border-2 border-gold/50" />
              <div className="relative rounded-[1.75rem] overflow-hidden shadow-card aspect-[4/5]">
                <img src={image} alt={name || 'Profile'} className="w-full h-full object-cover" />
              </div>
            </div>
          </Reveal>

          {/* text */}
          <div className="order-1 lg:order-2 pt-4 lg:pt-0">
            <SectionHeading kicker="About me" title={title} />
            <Reveal delay={150}>
              <p className="mt-7 text-ink/70 leading-relaxed whitespace-pre-line">{bio}</p>
            </Reveal>

            {bullets.length > 0 && (
              <Reveal delay={230}>
                <ul className="mt-8 grid sm:grid-cols-2 gap-3">
                  {bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-ink/80">
                      <span className="w-5 h-5 rounded-full gold-gradient flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={11} className="text-white" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            <Reveal delay={300}>
              <div className="mt-8 space-y-3">
                {facts.map((f) => (
                  <a
                    key={f.label}
                    href={f.href}
                    className={`flex items-center gap-4 ${f.href ? 'hover:opacity-80 transition-opacity' : 'cursor-default'}`}
                  >
                    <span className="w-11 h-11 rounded-full bg-gold/15 text-gold-light flex items-center justify-center shrink-0">
                      <f.icon size={19} />
                    </span>
                    <span>
                      <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-ink/40">{f.label}</span>
                      <span className="text-sm font-semibold text-ink">{f.value}</span>
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={380}>
              <a href="#contact" className="btn-primary mt-9">
                Let&apos;s talk <ArrowRight size={16} />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
