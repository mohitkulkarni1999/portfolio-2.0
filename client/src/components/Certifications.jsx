// Certifications.jsx — certificates & courses (content from the admin dashboard)
import { Award, Calendar, Building2, FileText, ExternalLink } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const IMAGE_RE = /\.(jpe?g|png|webp|gif|avif|svg)(\?|$)/i

export default function Certifications({ certifications }) {
  const items = certifications || []

  return (
    <section id="certifications" className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Certifications" title="Certifications & courses" center />

        {items.length === 0 ? (
          <p className="mt-14 text-center text-sm text-ink/40">
            Certificates and courses will appear here.
          </p>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {items.map((c, i) => {
              const hasFile = Boolean(c.file_url)
              const hasImage = Boolean(c.image_url)
              const isPdf = /\.pdf(\?|$)/i.test(c.file_url || '')
              const openLink = hasFile ? c.file_url : hasImage ? c.image_url : ''

              return (
                <Reveal key={c.id} delay={(i % 3) * 110}>
                  <div className="card overflow-hidden h-full group hover:border-gold/40 transition-colors">
                    {isPdf ? (
                      <div className="h-60 overflow-hidden bg-black/20">
                        <iframe
                          src={c.file_url}
                          title={c.name}
                          className="w-full h-full border-0"
                          loading="lazy"
                        />
                      </div>
                    ) : hasImage && IMAGE_RE.test(c.image_url) ? (
                      <div className="h-44 overflow-hidden">
                        <img
                          src={c.image_url}
                          alt={c.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : hasFile ? (
                      <div className="h-36 bg-gold/10 flex flex-col items-center justify-center gap-2">
                        <FileText size={40} className="text-gold-light/80" />
                        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-light/70">
                          Certificate attached
                        </span>
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
                      {openLink && (
                        <a
                          href={openLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-gold-light hover:text-gold transition-colors"
                        >
                          {hasFile ? 'View certificate' : 'View image'} <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
