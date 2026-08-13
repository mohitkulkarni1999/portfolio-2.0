// Contact.jsx — contact info + message form (saves to the admin inbox)
import { useState } from 'react'
import { Mail, MapPin, Phone, Send, CheckCircle, AlertCircle } from 'lucide-react'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'
import SocialIcons from './SocialIcons'
import { api } from '../api'

const emptyForm = { name: '', email: '', subject: '', message: '' }

export default function Contact({ profile }) {
  const { email, phone, location, github, linkedin, twitter, instagram } = profile || {}
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const socials = [
    { type: 'github', href: github },
    { type: 'linkedin', href: linkedin },
    { type: 'twitter', href: twitter },
    { type: 'instagram', href: instagram },
  ].filter((s) => s.href)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await api.sendMessage(form)
      setStatus('ok')
      setForm(emptyForm)
      setTimeout(() => setStatus(null), 4000)
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  const infoRows = [
    { icon: Phone, label: 'Phone', value: phone, href: phone ? `tel:${phone.replace(/[^+\d]/g, '')}` : null },
    { icon: Mail, label: 'Email', value: email, href: email ? `mailto:${email}` : null },
    { icon: MapPin, label: 'Location', value: location, href: null },
  ].filter((r) => r.value)

  return (
    <section id="contact" className="relative py-20 md:py-28 bg-paper overflow-hidden">
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="max-w-6xl mx-auto px-6 relative">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* left: info */}
          <Reveal className="lg:col-span-2">
            <SectionHeading kicker="Contact" title="Let's find your perfect property" />
            <p className="mt-6 text-ink/65 leading-relaxed">
              Whether you&apos;re buying, selling, investing or just exploring, I&apos;m happy to
              help. Send a message and I&apos;ll get back to you quickly.
            </p>

            <div className="mt-9 space-y-5">
              {infoRows.map((r) => (
                <a
                  key={r.label}
                  href={r.href}
                  className={`flex items-center gap-4 ${r.href ? 'hover:opacity-80 transition-opacity' : 'cursor-default'}`}
                >
                  <span className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center shadow-gold shrink-0">
                    <r.icon className="text-white" size={19} />
                  </span>
                  <span>
                    <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-ink/40">{r.label}</span>
                    <span className="text-sm font-semibold text-ink">{r.value}</span>
                  </span>
                </a>
              ))}
            </div>

            {socials.length > 0 && (
              <div className="mt-9">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/40 mb-3">Follow me</p>
                <SocialIcons socials={socials} />
              </div>
            )}
          </Reveal>

          {/* right: form */}
          <Reveal delay={150} className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-onyx rounded-2xl border border-white/10 shadow-card p-7 md:p-9 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/45 mb-2">Name</label>
                  <input name="name" required value={form.name} onChange={handleChange} className="input" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ink/45 mb-2">Email</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/45 mb-2">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} className="input" placeholder="e.g. 3BHK in Baner" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink/45 mb-2">Message</label>
                <textarea name="message" required rows="5" value={form.message} onChange={handleChange} className="input resize-none" placeholder="Tell me what you're looking for..." />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button type="submit" disabled={status === 'sending'} className="btn-primary !px-8 !py-4">
                  {status === 'sending' ? 'Sending...' : <>Send message <Send size={16} /></>}
                </button>
                {status === 'ok' && (
                  <p className="flex items-center gap-2 text-sm text-emerald-400">
                    <CheckCircle size={16} /> Message sent! I&apos;ll reply soon.
                  </p>
                )}
                {status === 'error' && (
                  <p className="flex items-center gap-2 text-sm text-rose-400">
                    <AlertCircle size={16} /> {error}
                  </p>
                )}
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
