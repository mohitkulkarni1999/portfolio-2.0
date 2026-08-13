// Home.jsx — the public website page.
// Everything is driven by the database:
//   1. fetch the profile + section list + all content
//   2. render only the sections that are enabled, in the admin-defined order
// Content components receive their data as props — no hardcoded text.

import { useEffect, useState } from 'react'
import { api } from '../api'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import About from '../components/About'
import Experience from '../components/Experience'
import Expertise from '../components/Expertise'
import Metrics from '../components/Metrics'
import Achievements from '../components/Achievements'
import Certifications from '../components/Certifications'
import Testimonials from '../components/Testimonials'
import Articles from '../components/Articles'
import Gallery from '../components/Gallery'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

export default function Home() {
  const [profile, setProfile] = useState(null)
  const [sections, setSections] = useState([])
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.getProfile(),
      api.getSections(),
      api.experiences.list(),
      api.expertise.list(),
      api.metrics.list(),
      api.achievements.list(),
      api.certifications.list(),
      api.testimonials.list(),
      api.articles.list(),
      api.gallery.list(),
    ])
      .then(([p, se, ex, sk, me, ac, ce, te, ar, ga]) => {
        setProfile(p)
        setSections(se)
        setData({ experiences: ex, expertise: sk, metrics: me, achievements: ac, certifications: ce, testimonials: te, articles: ar, gallery: ga })
        document.title = `${p?.name || 'Portfolio'} | Professional`
      })
      .catch((err) => console.error('Failed to load site data:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    )
  }

  // sections sorted exactly as saved in the admin dashboard
  const enabled = sections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order)

  // map each section key to its component
  const renderSection = (key) => {
    switch (key) {
      case 'hero': return <Hero profile={profile} />
      case 'about': return <About profile={profile} />
      case 'experience': return <Experience experiences={data.experiences} />
      case 'expertise': return <Expertise skills={data.expertise} />
      case 'metrics': return <Metrics metrics={data.metrics} />
      case 'achievements': return <Achievements achievements={data.achievements} />
      case 'certifications': return <Certifications certifications={data.certifications} />
      case 'testimonials': return <Testimonials testimonials={data.testimonials} />
      case 'articles': return <Articles articles={data.articles} />
      case 'gallery': return <Gallery images={data.gallery} />
      case 'contact': return <Contact profile={profile} />
      default: return null
    }
  }

  return (
    <div>
      <Navbar name={profile?.name} sections={sections} />
      {enabled.map((s) => (
        <div key={s.section_key}>{renderSection(s.section_key)}</div>
      ))}
      <Footer profile={profile} sections={sections} />
    </div>
  )
}
