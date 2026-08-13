// Metrics.jsx — the key numbers band (content from the admin dashboard)
// Flex + centered so any number of metrics fills the band evenly (no empty columns).
import Reveal from './Reveal'
import { iconByName } from './icons'

export default function Metrics({ metrics }) {
  if (metrics.length === 0) return null

  return (
    <section id="metrics" className="relative py-16 md:py-20 bg-onyx overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-gold/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-10 md:gap-x-14">
          {metrics.map((m, i) => {
            const Icon = iconByName(m.icon)
            return (
              <Reveal key={m.id} delay={(i % 4) * 100} className="w-full sm:w-auto">
                <div className="sm:w-56 md:w-60 text-center">
                  <div className="mx-auto w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gold-light mb-4">
                    <Icon size={20} />
                  </div>
                  <p className="font-display text-4xl md:text-5xl font-semibold text-ivory">
                    {m.value}
                  </p>
                  <p className="mt-2 text-[0.65rem] md:text-xs uppercase tracking-[0.2em] text-gold-light font-semibold">
                    {m.label}
                  </p>
                  {m.description && (
                    <p className="mt-2 text-xs md:text-sm text-ivory/55 leading-relaxed">
                      {m.description}
                    </p>
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
