// MessagesAdmin.jsx — the contact form inbox: read, mark read/unread, delete
import { Mail, MailOpen, Trash2 } from 'lucide-react'

export default function MessagesAdmin({ messages, setMessages, token, markRead, deleteMessage }) {
  const toggleRead = async (m) => {
    try {
      const updated = await markRead(m.id, !m.is_read, token)
      setMessages(messages.map((x) => (x.id === updated.id ? updated : x)))
    } catch (err) {
      alert(err.message)
    }
  }

  const remove = async (m) => {
    if (!confirm(`Delete message from ${m.name}?`)) return
    try {
      await deleteMessage(m.id, token)
      setMessages(messages.filter((x) => x.id !== m.id))
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ivory">Messages</h2>
      <p className="text-sm text-ivory/50 mt-1">Messages sent through the contact form.</p>

      <div className="mt-6 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`card p-5 ${m.is_read ? '' : 'border-gold/60'}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ivory">
                  {!m.is_read && <span className="mr-2 inline-block w-2 h-2 rounded-full bg-gold" />}
                  {m.name}
                  <span className="text-xs font-normal text-ivory/45"> &lt;{m.email}&gt;</span>
                </p>
                {m.subject && <p className="text-sm text-gold-light mt-0.5">{m.subject}</p>}
              </div>
              <span className="text-xs text-ivory/40">{new Date(m.created_at).toLocaleString()}</span>
            </div>

            <p className="text-sm text-ivory/70 mt-3 whitespace-pre-line">{m.message}</p>

            <div className="flex gap-2 mt-4">
              <button onClick={() => toggleRead(m)} className="btn-ghost !py-2 !px-4 text-xs">
                {m.is_read ? <Mail size={13} /> : <MailOpen size={13} />}
                {m.is_read ? 'Mark unread' : 'Mark read'}
              </button>
              <button
                onClick={() => remove(m)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 text-xs font-semibold text-rose-400 hover:border-rose-400 transition-all"
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <p className="text-center text-ivory/40 py-10">
            No messages yet. They will appear here when someone uses the contact form.
          </p>
        )}
      </div>
    </div>
  )
}
