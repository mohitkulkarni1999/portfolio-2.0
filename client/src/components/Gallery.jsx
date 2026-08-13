// Gallery.jsx — photo gallery with a lightbox (content from the admin dashboard)
import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function Gallery({ images }) {
  const [index, setIndex] = useState(null)

  if (images.length === 0) return null

  const close = () => setIndex(null)
  const prev = () => setIndex((index + images.length - 1) % images.length)
  const next = () => setIndex((index + 1) % images.length)

  return (
    <section id="gallery" className="relative py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        <SectionHeading kicker="Gallery" title="Moments & milestones" center />

        <div className="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {images.map((g, i) => (
            <Reveal key={g.id} delay={(i % 3) * 90}>
              <button
                onClick={() => setIndex(i)}
                className="group relative w-full overflow-hidden rounded-2xl border border-white/10 aspect-[4/3] cursor-zoom-in"
              >
                <img
                  src={g.image_url}
                  alt={g.title || g.category || 'Gallery photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {(g.title || g.category) && (
                  <div className="absolute bottom-0 inset-x-0 p-4 text-left opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-semibold text-white">{g.title}</p>
                    {g.category && <p className="text-xs text-white/70">{g.category}</p>}
                  </div>
                )}
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* lightbox */}
      {index !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-noir/90 backdrop-blur-sm" onClick={close} />
          <button onClick={close} className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white" aria-label="Close">
            <X size={18} />
          </button>
          <button onClick={prev} className="absolute left-3 md:left-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white" aria-label="Previous">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-3 md:right-6 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white" aria-label="Next">
            <ChevronRight size={20} />
          </button>

          <figure className="relative max-w-4xl w-full">
            <img
              src={images[index].image_url}
              alt={images[index].title || 'Gallery photo'}
              className="w-full max-h-[75svh] object-contain rounded-xl"
            />
            {(images[index].title || images[index].description) && (
              <figcaption className="mt-4 text-center">
                <p className="font-display text-lg text-white">{images[index].title}</p>
                {images[index].description && (
                  <p className="text-sm text-white/60 mt-1">{images[index].description}</p>
                )}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </section>
  )
}
