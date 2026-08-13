// Articles.jsx — professional insights (content from the admin dashboard)
// Only published articles are returned by the backend.
import { useState } from 'react'
import { Calendar, Tag, X, ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const FALLBACK_COVER =
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80'

// turn plain text into simple headings / bullets / paragraphs
function RichText({ text }) {
  const lines = text.split(/\r?\n/)
  const blocks = []
  let bullets = []

  const flush = () => {
    if (bullets.length) {
      blocks.push({ type: 'ul', items: bullets })
      bullets = []
    }
  }

  lines.forEach((raw) => {
    const line = raw.trim()
    if (!line) { flush(); return }
    if (line.startsWith('### ')) { flush(); blocks.push({ type: 'h4', text: line.slice(4) }) }
    else if (line.startsWith('## ')) { flush(); blocks.push({ type: 'h3', text: line.slice(3) }) }
    else if (line.startsWith('# ')) { flush(); blocks.push({ type: 'h2', text: line.slice(2) }) }
    else if (/^[-*•]\s/.test(line)) { bullets.push(line.replace(/^[-*•]\s/, '')) }
    else { flush(); blocks.push({ type: 'p', text: line }) }
  })
  flush()

  return (
    <div className="space-y-4 text-[0.95rem] text-ink/75 leading-relaxed">
      {blocks.map((b, i) => {
        if (b.type === 'ul') {
          return (
            <ul key={i} className="space-y-1.5 pl-5 list-disc marker:text-gold">
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          )
        }
        if (b.type === 'h2') return <h2 key={i} className="font-display text-2xl font-semibold text-ink pt-2">{b.text}</h2>
        if (b.type === 'h3') return <h3 key={i} className="font-display text-xl font-semibold text-ink pt-1">{b.text}</h3>
        if (b.type === 'h4') return <h4 key={i} className="font-display text-lg font-semibold text-ink">{b.text}</h4>
        return <p key={i}>{b.text}</p>
      })}
    </div>
  )
}

export default function Articles({ articles }) {
  const [openArticle, setOpenArticle] = useState(null)

  if (articles.length === 0) return null

  return (
    <section id="articles" className="relative py-20 md:py-28 bg-paper overflow-hidden">
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Insights" title="Articles & professional insights" center />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
          {articles.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 110}>
              <article className="card overflow-hidden h-full group hover:border-gold/40 transition-colors flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={a.cover_image || FALLBACK_COVER}
                    alt={a.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {a.category && (
                    <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full gold-gradient text-white font-medium">
                      <Tag size={11} /> {a.category}
                    </span>
                  )}
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <p className="flex items-center gap-2 text-xs text-ink/45 uppercase tracking-wider">
                    <Calendar size={12} /> {a.article_date || 'Article'}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-semibold text-ink leading-snug">{a.title}</h3>
                  <button
                    onClick={() => setOpenArticle(a)}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold transition-colors mt-auto pt-4"
                  >
                    Read article <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>

      {/* reader modal */}
      {openArticle && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-noir/75 backdrop-blur-sm" onClick={() => setOpenArticle(null)} />
          <div className="relative bg-onyx w-full max-w-2xl max-h-[85svh] overflow-y-auto rounded-2xl shadow-card">
            <button
              onClick={() => setOpenArticle(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 shadow flex items-center justify-center text-ivory hover:text-gold-light"
              aria-label="Close"
            >
              <X size={17} />
            </button>
            {openArticle.cover_image && (
              <img src={openArticle.cover_image} alt="" className="w-full h-56 object-cover" />
            )}
            <div className="p-7 md:p-9">
              {openArticle.category && (
                <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-gold/10 text-gold-light font-medium">
                  <Tag size={11} /> {openArticle.category}
                </span>
              )}
              <h2 className="mt-4 font-display text-2xl md:text-3xl font-semibold text-ink leading-tight">
                {openArticle.title}
              </h2>
              <p className="mt-3 flex items-center gap-2 text-xs text-ink/45 uppercase tracking-wider">
                <Calendar size={12} /> {openArticle.article_date || 'Article'}
              </p>
              <div className="mt-6 pt-6 border-t border-white/10">
                <RichText text={openArticle.content} />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
