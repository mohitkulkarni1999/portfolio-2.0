// Achievements.jsx — milestones and wins (content from the admin dashboard)
import { Trophy } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Achievements({ achievements }) {
  if (achievements.length === 0) return null

  return (
    <section id="achievements" className="relative py-20 md:py-28 bg-paper overflow-hidden">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Achievements" title="Milestones I'm proud of" center />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {achievements.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 110}>
              <div className="card overflow-hidden h-full group hover:border-gold/40 transition-colors">
                {a.image_url ? (
                  <div className="h-52 overflow-hidden">
                    <img
                      src={a.image_url}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-gold/10 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center">
                      <Trophy size={26} className="text-noir" />
                    </span>
                  </div>
                )}
                <div className="p-7">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">Achievement</p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-ink">{a.title}</h3>
                  {a.description && (
                    <p className="mt-3 text-sm text-ink/60 leading-relaxed">{a.description}</p>
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
