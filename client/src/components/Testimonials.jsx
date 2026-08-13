// Testimonials.jsx — client words on a rich dark band
import { Quote, Star } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

function Stars({ rating }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={15}
          className={n <= (rating || 0) ? 'text-gold-light fill-gold-light' : 'text-white/20'}
        />
      ))}
    </div>
  )
}

export default function Testimonials({ testimonials }) {
  if (testimonials.length === 0) return null

  return (
    <section id="testimonials" className="relative py-20 md:py-28 bg-onyx overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Testimonials" title="What clients & partners say" center light />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-7">
          {testimonials.map((t, i) => (
            <Reveal key={t.id} delay={(i % 3) * 110}>
              <figure className="bg-white/[0.06] backdrop-blur border border-white/10 rounded-2xl p-8 h-full flex flex-col relative hover:border-gold/40 transition-colors">
                <Quote className="text-gold/40 absolute top-6 right-6" size={30} />
                <Stars rating={t.rating} />
                <blockquote className="mt-5 font-display italic text-[1.05rem] leading-relaxed text-ivory/85 flex-1">
                  &ldquo;{t.content}&rdquo;
                </blockquote>
                <figcaption className="mt-7 flex items-center gap-4 pt-5 border-t border-white/10">
                  <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-white font-display font-semibold text-sm overflow-hidden shrink-0">
                    {t.avatar_url ? (
                      <img src={t.avatar_url} alt={t.name} className="w-full h-full object-cover" />
                    ) : (
                      t.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ivory">{t.name}</p>
                    <p className="text-xs text-ivory/50">
                      {t.role}{t.company ? ` · ${t.company}` : ''}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
