// Hero.jsx — full-screen hero, fully driven by the admin (heading, buttons, image)
import { ArrowRight, ChevronDown, Phone } from 'lucide-react'
import Reveal from './Reveal'

const FALLBACK_BG =
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2200&q=80'

const isVideo = (url) => /\.(mp4|webm|mov)(\?|$)/i.test(url || '')

export default function Hero({ profile }) {
  const {
    name, title, headline, intro,
    hero_heading, hero_subheading, hero_description,
    photo_url, cover_image, phone,
    btn_primary_text, btn_primary_link,
    btn_secondary_text, btn_secondary_link,
  } = profile || {}

  const heading = hero_heading || name || 'Your Name'
  const subheading = hero_subheading || headline || title
  const description = hero_description || intro
  const bg = cover_image || FALLBACK_BG

  const primary = {
    text: btn_primary_text || 'Explore my work',
    href: btn_primary_link || '#about',
  }
  const secondary = {
    text: btn_secondary_text || 'Contact me',
    href: btn_secondary_link || '#contact',
  }

  return (
    <section id="home" className="relative min-h-svh flex flex-col overflow-hidden">
      {/* background image / video + overlay */}
      <div className="absolute inset-0">
        {isVideo(bg) ? (
          <video src={bg} autoPlay muted loop playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={bg} alt="" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-noir/85 via-noir/55 to-noir/95" />
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-28 pb-12">
        <Reveal>
          <p className="text-gold-light tracking-[0.35em] uppercase text-xs md:text-sm font-medium">
            {subheading ? subheading.toUpperCase() : 'WELCOME'}
          </p>
        </Reveal>

        {photo_url && (
          <Reveal delay={80}>
            <div className="mt-7">
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-1.5 gold-gradient mx-auto">
                <img
                  src={photo_url}
                  alt={name || 'Profile'}
                  className="w-full h-full rounded-full object-cover border-4 border-noir"
                />
              </div>
            </div>
          </Reveal>
        )}

        <Reveal delay={160}>
          <h1 className="mt-5 font-display text-white text-[2.6rem] leading-[1.08] sm:text-6xl md:text-7xl font-semibold">
            {heading}
          </h1>
        </Reveal>

        {subheading && (
          <Reveal delay={260}>
            <p className="mt-5 text-white/90 font-display italic text-lg md:text-2xl">{subheading}</p>
          </Reveal>
        )}

        {description && (
          <Reveal delay={340}>
            <p className="mt-6 max-w-2xl text-white/75 leading-relaxed text-sm md:text-base">{description}</p>
          </Reveal>
        )}

        <Reveal delay={440}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href={primary.href} className="btn-primary !px-8 !py-4 text-base">
              {primary.text} <ArrowRight size={17} />
            </a>
            <a
              href={secondary.href}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/50 text-white font-semibold text-base hover:bg-white/10 transition-all"
            >
              {secondary.text}
            </a>
            {phone && (
              <a
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/50 text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                <Phone size={16} /> Call me
              </a>
            )}
          </div>
        </Reveal>
      </div>

      <div className="relative hidden md:flex justify-center pb-10">
        <a href="#about" aria-label="Scroll down" className="text-white/50 hover:text-white transition-colors">
          <ChevronDown size={22} className="animate-bounce" />
        </a>
      </div>
    </section>
  )
}
