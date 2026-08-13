// AdminDashboard.jsx — the private admin area (login required)
// The single source of truth for the whole public website.
// Sidebar on the left (scrollable tabs on mobile), content on the right.

import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, User, Image as ImageIcon, FileText, Briefcase, Lightbulb,
  BarChart3, Trophy, Award, MessageSquare, Newspaper, Images, Mail,
  Layout, Settings, ExternalLink, LogOut, Building2,
} from 'lucide-react'
import { api } from '../api'
import { ICON_OPTIONS } from '../components/icons'
import Overview from '../components/admin/Overview'
import ProfileForm from '../components/admin/ProfileForm'
import HeroForm from '../components/admin/HeroForm'
import AboutForm from '../components/admin/AboutForm'
import CrudSection from '../components/admin/CrudSection'
import MessagesAdmin from '../components/admin/MessagesAdmin'
import SectionsAdmin from '../components/admin/SectionsAdmin'
import SettingsAdmin from '../components/admin/SettingsAdmin'

const yesNo = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
]

// --- field definitions for each content type ---------------------------------
const experienceColumns = [
  { key: 'company', label: 'Company', required: true },
  { key: 'designation', label: 'Designation (e.g. AVP)' },
  { key: 'start_date', label: 'Start date (e.g. May 2023)' },
  { key: 'end_date', label: 'End date (or "Present")' },
  { key: 'description', label: 'Short description', type: 'textarea' },
  { key: 'responsibilities', label: 'Responsibilities (one per line)', type: 'textarea' },
  { key: 'achievements', label: 'Key achievements (one per line)', type: 'textarea' },
  { key: 'team_handled', label: 'Team handled (e.g. 15 presales executives)' },
  { key: 'business_handled', label: 'Business handled (e.g. Pune west region)' },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

const expertiseColumns = [
  { key: 'name', label: 'Skill name', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'category', label: 'Category (e.g. Sales, Tech, Leadership)' },
  { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

const metricColumns = [
  { key: 'value', label: 'Number / value (e.g. 12+)', required: true },
  { key: 'label', label: 'Label (e.g. Years Experience)', required: true },
  { key: 'description', label: 'Description' },
  { key: 'icon', label: 'Icon', type: 'select', options: ICON_OPTIONS },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

const achievementColumns = [
  { key: 'title', label: 'Achievement title', required: true },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'image_url', label: 'Photo / certificate', type: 'image' },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

const certificationColumns = [
  { key: 'name', label: 'Certificate name', required: true },
  { key: 'organization', label: 'Organization' },
  { key: 'date', label: 'Date (e.g. Mar 2024)' },
  { key: 'image_url', label: 'Certificate image', type: 'image' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

const testimonialColumns = [
  { key: 'name', label: 'Name', required: true },
  { key: 'role', label: 'Role' },
  { key: 'company', label: 'Company' },
  { key: 'content', label: 'What they said', type: 'textarea', required: true },
  { key: 'avatar_url', label: 'Profile photo', type: 'image' },
  {
    key: 'rating', label: 'Rating', type: 'select',
    options: [1, 2, 3, 4, 5].map((n) => ({ value: String(n), label: `${n} star${n > 1 ? 's' : ''}` })),
  },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

const articleColumns = [
  { key: 'title', label: 'Title', required: true },
  { key: 'category', label: 'Category (e.g. Sales, Leadership)' },
  { key: 'article_date', label: 'Date (e.g. 12 Aug 2026)' },
  { key: 'cover_image', label: 'Cover image', type: 'image' },
  { key: 'content', label: 'Content (plain text, one paragraph per line)', type: 'textarea', required: true },
  { key: 'published', label: 'Published?', type: 'select', options: yesNo },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

const galleryColumns = [
  { key: 'image_url', label: 'Image', type: 'image', required: true },
  { key: 'title', label: 'Title' },
  { key: 'description', label: 'Description' },
  { key: 'category', label: 'Category' },
  { key: 'sort_order', label: 'Order (lower = first)', type: 'number' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const [tab, setTab] = useState('overview')
  const [profile, setProfile] = useState(null)
  const [experiences, setExperiences] = useState([])
  const [expertise, setExpertise] = useState([])
  const [metrics, setMetrics] = useState([])
  const [achievements, setAchievements] = useState([])
  const [certifications, setCertifications] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [articles, setArticles] = useState([])
  const [gallery, setGallery] = useState([])
  const [sections, setSections] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  // load all site content from the backend in one go
  const loadAll = useCallback(async () => {
    try {
      const [p, ex, eo, me, ac, ce, te, ar, ga, se, ms] = await Promise.all([
        api.getProfile(),
        api.experiences.list(token),
        api.expertise.list(token),
        api.metrics.list(token),
        api.achievements.list(token),
        api.certifications.list(token),
        api.testimonials.list(token),
        api.articles.list(token),
        api.gallery.list(token),
        api.getSections(),
        api.getMessages(token),
      ])
      setProfile(p)
      setExperiences(ex)
      setExpertise(eo)
      setMetrics(me)
      setAchievements(ac)
      setCertifications(ce)
      setTestimonials(te)
      setArticles(ar)
      setGallery(ga)
      setSections(se)
      setMessages(ms)
    } catch (err) {
      if (/token/i.test(err.message)) {
        localStorage.removeItem('token')
        navigate('/admin/login')
      } else {
        alert(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [token, navigate])

  // guard: no token -> send to login page
  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }
    loadAll()
  }, [token, navigate, loadAll])

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/admin/login')
  }

  const unread = messages.filter((m) => !m.is_read).length

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'hero', label: 'Hero', icon: ImageIcon },
    { id: 'about', label: 'About', icon: FileText },
    { id: 'experience', label: 'Experience', icon: Briefcase, count: experiences.length },
    { id: 'expertise', label: 'Expertise', icon: Lightbulb, count: expertise.length },
    { id: 'metrics', label: 'Metrics', icon: BarChart3, count: metrics.length },
    { id: 'achievements', label: 'Achievements', icon: Trophy, count: achievements.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: certifications.length },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, count: testimonials.length },
    { id: 'articles', label: 'Articles', icon: Newspaper, count: articles.length },
    { id: 'gallery', label: 'Gallery', icon: Images, count: gallery.length },
    { id: 'messages', label: 'Messages', icon: Mail, count: unread, accent: unread > 0 },
    { id: 'sections', label: 'Website Sections', icon: Layout },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  if (loading || !profile) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-noir">
        <div className="w-10 h-10 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    )
  }

  const navClass = (item) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shrink-0 ${
      tab === item.id
        ? 'gold-gradient text-white shadow-gold'
        : 'text-ivory/60 hover:text-ivory hover:bg-white/5'
    }`

  return (
    <div className="min-h-svh bg-noir lg:flex">
      {/* sidebar */}
      <aside className="lg:w-64 lg:min-h-svh lg:flex-shrink-0 bg-onyx border-b lg:border-b-0 lg:border-r border-white/10">
        <div className="p-5 lg:flex-col lg:h-full flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 font-display font-semibold text-ivory shrink-0">
            <span className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
              <Building2 size={15} className="text-noir" />
            </span>
            {profile.name}<span className="text-gold">.</span>
          </a>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => setTab(item.id)} className={navClass(item)}>
                <item.icon size={17} className="shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
                {item.count > 0 && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                      item.accent
                        ? tab === item.id ? 'bg-white/25 text-white' : 'bg-gold/15 text-gold-light'
                        : tab === item.id ? 'bg-white/25 text-white' : 'bg-white/5 text-ivory/45'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="flex lg:flex-col gap-1.5 shrink-0">
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-ivory/60 hover:text-ivory hover:bg-white/5 transition-all">
              <ExternalLink size={16} /> <span className="hidden sm:inline">View site</span>
            </a>
            <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-white/5 transition-all">
              <LogOut size={16} /> <span className="hidden sm:inline">Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* content */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl">
        {tab === 'overview' && (
          <Overview
            profile={profile}
            stats={{
              experiences: experiences.length,
              expertise: expertise.length,
              metrics: metrics.length,
              achievements: achievements.length,
              certifications: certifications.length,
              testimonials: testimonials.length,
              articles: articles.length,
              gallery: gallery.length,
              unread,
            }}
          />
        )}

        {tab === 'profile' && (
          <ProfileForm profile={profile} setProfile={setProfile} token={token} />
        )}

        {tab === 'hero' && (
          <HeroForm profile={profile} setProfile={setProfile} token={token} />
        )}

        {tab === 'about' && (
          <AboutForm profile={profile} setProfile={setProfile} token={token} />
        )}

        {tab === 'experience' && (
          <CrudSection
            title="Experience"
            columns={experienceColumns}
            items={experiences}
            setItems={setExperiences}
            token={token}
            create={api.experiences.create}
            update={api.experiences.update}
            remove={api.experiences.remove}
            emptyMessage="No experience yet. Add your first role!"
            hint="The list order (top to bottom) is how it appears in the career timeline."
          />
        )}

        {tab === 'expertise' && (
          <CrudSection
            title="Expertise"
            columns={expertiseColumns}
            items={expertise}
            setItems={setExpertise}
            token={token}
            create={api.expertise.create}
            update={api.expertise.update}
            remove={api.expertise.remove}
            emptyMessage="No skills yet. Add your first skill!"
            hint="Group skills with a category like Sales, Leadership or Operations."
          />
        )}

        {tab === 'metrics' && (
          <CrudSection
            title="Key metrics"
            columns={metricColumns}
            items={metrics}
            setItems={setMetrics}
            token={token}
            create={api.metrics.create}
            update={api.metrics.update}
            remove={api.metrics.remove}
            emptyMessage="No metrics yet. Add your first number!"
            hint="Use real numbers only — e.g. 12+ Years Experience, ₹40 Cr+ Business handled."
          />
        )}

        {tab === 'achievements' && (
          <CrudSection
            title="Achievements"
            columns={achievementColumns}
            items={achievements}
            setItems={setAchievements}
            token={token}
            create={api.achievements.create}
            update={api.achievements.update}
            remove={api.achievements.remove}
            emptyMessage="No achievements yet. Add your first one!"
            hint="Add a certificate or milestone photo for extra impact."
          />
        )}

        {tab === 'certifications' && (
          <CrudSection
            title="Certifications"
            columns={certificationColumns}
            items={certifications}
            setItems={setCertifications}
            token={token}
            create={api.certifications.create}
            update={api.certifications.update}
            remove={api.certifications.remove}
            emptyMessage="No certifications yet. Add your first one!"
            hint="Remember to enable the Certifications section under Website Sections when you have entries."
          />
        )}

        {tab === 'testimonials' && (
          <CrudSection
            title="Testimonials"
            columns={testimonialColumns}
            items={testimonials}
            setItems={setTestimonials}
            token={token}
            create={api.testimonials.create}
            update={api.testimonials.update}
            remove={api.testimonials.remove}
            emptyMessage="No testimonials yet. Add your first one!"
          />
        )}

        {tab === 'articles' && (
          <CrudSection
            title="Articles & insights"
            columns={articleColumns}
            items={articles}
            setItems={setArticles}
            token={token}
            create={api.articles.create}
            update={api.articles.update}
            remove={api.articles.remove}
            emptyMessage="No articles yet. Write your first insight!"
            hint="Only published articles appear on the public site. Use Published = No to keep a draft."
          />
        )}

        {tab === 'gallery' && (
          <CrudSection
            title="Gallery"
            columns={galleryColumns}
            items={gallery}
            setItems={setGallery}
            token={token}
            create={api.gallery.create}
            update={api.gallery.update}
            remove={api.gallery.remove}
            emptyMessage="No gallery images yet. Add your first photo!"
            hint="Landscape photos look best. Add images, then enable the Gallery section under Website Sections."
          />
        )}

        {tab === 'messages' && (
          <MessagesAdmin
            messages={messages}
            setMessages={setMessages}
            token={token}
            markRead={api.markMessageRead}
            deleteMessage={api.deleteMessage}
          />
        )}

        {tab === 'sections' && (
          <SectionsAdmin sections={sections} setSections={setSections} token={token} />
        )}

        {tab === 'settings' && (
          <SettingsAdmin token={token} />
        )}
      </main>
    </div>
  )
}
