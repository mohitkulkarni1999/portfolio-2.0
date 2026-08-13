// Overview.jsx — dashboard home: quick numbers about your site
import { Briefcase, Lightbulb, BarChart3, Trophy, Award, MessageSquare, Newspaper, Images, ExternalLink } from 'lucide-react'

export default function Overview({ profile, stats }) {
  const cards = [
    { label: 'Roles', value: stats.experiences, icon: Briefcase },
    { label: 'Skills', value: stats.expertise, icon: Lightbulb },
    { label: 'Metrics', value: stats.metrics, icon: BarChart3 },
    { label: 'Achievements', value: stats.achievements, icon: Trophy },
    { label: 'Certifications', value: stats.certifications, icon: Award },
    { label: 'Testimonials', value: stats.testimonials, icon: MessageSquare },
    { label: 'Articles', value: stats.articles, icon: Newspaper },
    { label: 'Photos', value: stats.gallery, icon: Images },
  ]

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ivory">Welcome back</h2>
      <p className="text-sm text-ivory/50 mt-1">
        Here&apos;s what&apos;s happening on {profile?.name || 'your site'}. Everything you change
        shows up on the public site instantly.
      </p>

      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="stat-card">
            <div className="w-11 h-11 rounded-xl bg-gold/15 text-gold-light flex items-center justify-center shrink-0">
              <c.icon size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-ivory">{c.value}</p>
              <p className="text-xs text-ivory/45">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <div className="card p-5">
          <p className="text-sm text-ivory/45">Unread messages</p>
          <p className={`text-3xl font-bold mt-1 ${stats.unread > 0 ? 'text-gold-light' : 'text-ivory'}`}>{stats.unread}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-ivory/45">Sections on the public site</p>
          <p className="text-3xl font-bold mt-1 text-ivory">manage under “Website Sections”</p>
        </div>
      </div>

      <div className="mt-8 card p-6 border-gold/30">
        <h3 className="font-display font-semibold text-ivory">Quick tip</h3>
        <p className="text-sm text-ivory/55 mt-2">
          Use the menu on the left to manage every part of the site — profile, hero, about,
          experience, skills, metrics, achievements, certifications, testimonials, articles and
          gallery. Toggle whole sections on/off under <b>Website Sections</b>. All changes go live
          on the public website immediately — no code changes, no redeploy.
        </p>
        <a href="/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold-light hover:text-gold">
          View public site <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
