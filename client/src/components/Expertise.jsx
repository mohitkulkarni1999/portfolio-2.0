// Expertise.jsx — skills grid (content from the admin dashboard)
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import { iconByName } from './icons'

export default function Expertise({ skills }) {
  if (skills.length === 0) return null

  return (
    <section id="expertise" className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Expertise" title="What I bring to the table" center />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, i) => {
            const Icon = iconByName(skill.icon)
            return (
              <Reveal key={skill.id} delay={(i % 4) * 90}>
                <div className="card p-7 h-full group hover:border-gold/40 hover:-translate-y-1 transition-all">
                  <span className="w-13 h-13 flex items-center justify-center rounded-xl gold-gradient text-noir group-hover:shadow-gold transition-shadow" style={{ width: '52px', height: '52px' }}>
                    <Icon size={22} />
                  </span>
                  {skill.category && (
                    <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">{skill.category}</p>
                  )}
                  <h3 className="mt-1.5 font-display text-lg font-semibold text-ink">{skill.name}</h3>
                  {skill.description && (
                    <p className="mt-2 text-sm text-ink/60 leading-relaxed">{skill.description}</p>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
