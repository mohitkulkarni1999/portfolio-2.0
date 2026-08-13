// Certifications.jsx — certificates & courses (content from the admin dashboard)
import { Award, Calendar, Building2 } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Certifications({ certifications }) {
  if (certifications.length === 0) return null

  return (
    <section id="certifications" className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Certifications" title="Certifications & courses" center />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {certifications.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 110}>
              <div className="card overflow-hidden h-full group hover:border-gold/40 transition-colors">
                {c.image_url ? (
                  <div className="h-44 overflow-hidden">
                    <img
                      src={c.image_url}
                      alt={c.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-36 bg-gold/10 flex items-center justify-center">
                    <Award size={40} className="text-gold-light/70" />
                  </div>
                )}
                <div className="p-7">
                  <h3 className="font-display text-lg font-semibold text-ink">{c.name}</h3>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/50">
                    {c.organization && (
                      <span className="inline-flex items-center gap-1.5">
                        <Building2 size={12} /> {c.organization}
                      </span>
                    )}
                    {c.date && (
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={12} /> {c.date}
                      </span>
                    )}
                  </div>
                  {c.description && (
                    <p className="mt-3 text-sm text-ink/60 leading-relaxed">{c.description}</p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
