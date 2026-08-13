// Experience.jsx — "Noir Luxe" career section with a company selector.
// Click a company name on the left to see that company's experience.
// Animations: staggered entrances, replay on company switch, hover shine, floating glows.
import { useEffect, useRef, useState } from 'react'
import { Briefcase, Building2, Calendar, Users, Trophy, Check, Sparkles } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const lines = (text) =>
  (text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

function DetailList({ title, items, Icon, inView }) {
  if (items.length === 0) return null
  const anim = (cls) => (inView ? cls : '')
  return (
    <div className={anim('anim-rise d4')}>
      <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold-light">
        <Icon size={13} /> {title}
      </p>
      <ul className="mt-3 space-y-2.5">
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`${anim(`anim-rise d${(idx % 7) + 1}`)} flex items-start gap-2.5 text-sm text-ivory/70 leading-relaxed`}
          >
            <span className={`${anim('anim-pop')} w-5 h-5 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 mt-0.5`}>
              <Icon size={10} className="text-gold-light" />
            </span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Experience({ experiences }) {
  const [active, setActive] = useState(experiences[0]?.company || '')
  const [inView, setInView] = useState(false)
  const sectionRef = useRef(null)

  // flip `inView` once the section scrolls into view — this gates the CSS
  // animations so they fire on scroll AND replay every time the company changes
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  if (experiences.length === 0) return null

  // unique companies, in the admin-defined order
  const companies = [...new Set(experiences.map((e) => e.company))]
  const visible = experiences.filter((e) => e.company === active)

  const anim = (cls) => (inView ? cls : '')

  return (
    <section id="experience" ref={sectionRef} className="relative py-20 md:py-28 bg-noir overflow-hidden">
      {/* ambient gold glows (slow drift) */}
      <div className="anim-glow absolute -top-32 -left-32 w-[30rem] h-[30rem] rounded-full bg-gold/10 blur-3xl" />
      <div
        className="anim-glow absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-gold/10 blur-3xl"
        style={{ animationDelay: '-4.5s' }}
      />
      {/* faint grid texture */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgb(244 239 230 / 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgb(244 239 230 / 0.03) 1px, transparent 1px)',
          backgroundSize: '52px 52px',
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Career" title="Professional experience" center light />

        <div className="mt-14 md:mt-16 grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-12 items-start">
          {/* company selector */}
          <div className="lg:sticky lg:top-24 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-6 px-6 lg:mx-0 lg:px-0">
            {companies.map((company, i) => {
              const first = experiences.find((e) => e.company === company)
              const isActive = active === company
              return (
                <button
                  key={company}
                  onClick={() => setActive(company)}
                  className={`${anim('anim-rise')} d${(i % 7) + 1} relative text-left rounded-2xl px-5 py-4 shrink-0 w-60 lg:w-full border transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${
                    isActive
                      ? 'bg-gold/10 border-gold/50 shadow-[0_0_24px_rgba(201,162,39,0.18)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-gold/30 hover:bg-white/[0.06]'
                  }`}
                >
                  {isActive && (
                    <span key={active} className={`${anim('anim-rail')} absolute inset-y-0 left-0 w-1 gold-gradient rounded-l-2xl`} />
                  )}
                  <span className="flex items-center gap-3">
                    <span
                      key={isActive ? 'on' : 'off'}
                      className={`${isActive && inView ? 'anim-pop' : ''} w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive ? 'gold-gradient text-noir' : 'bg-white/5 text-gold-light border border-gold/20'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0">
                      <span className={`block text-sm font-semibold truncate transition-colors ${isActive ? 'text-ivory' : 'text-ivory/80'}`}>
                        {company}
                      </span>
                      <span className="block text-[0.65rem] uppercase tracking-wider text-fog mt-0.5 truncate">
                        {first?.designation || first?.start_date || ''}
                      </span>
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          {/* selected company's experience — keyed by company so animations replay on switch */}
          <div key={active} className="min-w-0 space-y-6">
            {visible.map((job) => {
              const responsibilities = lines(job.responsibilities)
              const achievements = lines(job.achievements)

              return (
                <div key={job.id} className={`group relative transition-transform duration-300 hover:-translate-y-1.5 ${anim('anim-rise')}`}>
                  {/* gradient border wrapper */}
                  <article className="relative rounded-2xl p-px bg-gradient-to-b from-white/12 via-white/5 to-white/[0.02] hover:from-gold/70 hover:via-gold/25 hover:to-gold/10 transition-all duration-300 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)]">
                    <div className="relative rounded-[calc(1rem-1px)] bg-coal/90 backdrop-blur px-6 py-7 md:px-8 md:py-8 h-full overflow-hidden">
                      {/* gold shine sweep on hover */}
                      <div className="card-shine" />

                      {/* soft inner top light */}
                      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

                      {/* header */}
                      <div className={`flex flex-wrap items-center justify-between gap-3 ${anim('anim-rise d1')}`}>
                        <p className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold-light">
                          <Building2 size={13} /> {job.company}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-ivory/50 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                          <Calendar size={11} /> {job.start_date} — {job.end_date || 'Present'}
                        </span>
                      </div>

                      <h3 className={`mt-3 font-display text-2xl md:text-[1.7rem] font-semibold text-ivory leading-snug ${anim('anim-rise d2')}`}>
                        {job.designation}
                      </h3>

                      {job.description && (
                        <p className={`mt-3 text-sm md:text-[0.95rem] text-fog leading-relaxed ${anim('anim-rise d3')}`}>
                          {job.description}
                        </p>
                      )}

                      {/* scope chips */}
                      {(job.team_handled || job.business_handled) && (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {job.team_handled && (
                            <span className={`${anim('anim-pop d1')} inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold-light font-medium`}>
                              <Users size={12} /> {job.team_handled}
                            </span>
                          )}
                          {job.business_handled && (
                            <span className={`${anim('anim-pop d2')} inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold-light font-medium`}>
                              <Briefcase size={12} /> {job.business_handled}
                            </span>
                          )}
                        </div>
                      )}

                      {/* detail columns */}
                      {(responsibilities.length > 0 || achievements.length > 0) && (
                        <div className="mt-6 pt-6 border-t border-white/10 grid sm:grid-cols-2 gap-7">
                          <DetailList title="Responsibilities" items={responsibilities} Icon={Check} inView={inView} />
                          <DetailList title="Key achievements" items={achievements} Icon={Trophy} inView={inView} />
                        </div>
                      )}
                    </div>
                  </article>
                </div>
              )
            })}
          </div>
        </div>

        {/* closing line */}
        <Reveal delay={100}>
          <p className="mt-14 flex items-center justify-center gap-2 text-sm text-fog">
            <Sparkles size={14} className="text-gold-light" />
            Always open to new challenges
          </p>
        </Reveal>
      </div>
    </section>
  )
}
