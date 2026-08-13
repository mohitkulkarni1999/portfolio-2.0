// SectionHeading.jsx — eyebrow label + serif title for each section
import Reveal from './Reveal'

export default function SectionHeading({ kicker, title, center = false, light = false }) {
  const titleClass = `mt-3 font-display text-3xl md:text-4xl lg:text-[2.6rem] font-semibold leading-tight ${
    light ? 'text-ivory' : 'text-ink'
  }`

  if (center) {
    return (
      <Reveal className="text-center flex flex-col items-center">
        <span className="eyebrow justify-center text-center">{kicker}</span>
        <h2 className={titleClass}>{title}</h2>
        <span className="mt-5 w-16 h-1 gold-gradient rounded-full" />
      </Reveal>
    )
  }

  return (
    <Reveal>
      <span className="eyebrow">{kicker}</span>
      <h2 className={titleClass}>{title}</h2>
      <span className="mt-5 w-16 h-1 gold-gradient rounded-full" />
    </Reveal>
  )
}
