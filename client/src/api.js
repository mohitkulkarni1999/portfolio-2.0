// api.js — a small helper for talking to the backend
// The Vite dev server forwards /api and /uploads to http://localhost:5000

async function request(path, options = {}) {
  const res = await fetch(path, options)
  if (!res.ok) {
    let message = 'Something went wrong'
    try {
      const data = await res.json()
      message = data.message || message
    } catch {}
    throw new Error(message)
  }
  return res.json()
}

// build options for JSON requests (adds the admin token if we have one)
function jsonOptions(method, body, token) {
  return {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: JSON.stringify(body),
  }
}

// build standard CRUD helpers for any content resource (experience, metrics, ...)
// -> list(token?), create(data), update(id, data), remove(id)
// Passing a token to list() also returns hidden/unpublished items (admin view).
function resource(name) {
  return {
    list: (token) => request('/api/' + name, token ? { headers: { Authorization: 'Bearer ' + token } } : {}),
    create: (data, token) => request('/api/' + name, jsonOptions('POST', data, token)),
    update: (id, data, token) => request('/api/' + name + '/' + id, jsonOptions('PUT', data, token)),
    remove: (id, token) => request('/api/' + name + '/' + id, jsonOptions('DELETE', {}, token)),
  }
}

export const api = {
  // --- public ---
  getProfile: () => request('/api/profile'),
  getSections: () => request('/api/sections'),
  sendMessage: (data) => request('/api/messages', jsonOptions('POST', data)),

  // --- auth ---
  login: (data) => request('/api/auth/login', jsonOptions('POST', data)),
  changePassword: (data, token) => request('/api/auth/change-password', jsonOptions('POST', data, token)),

  // --- admin: profile ---
  updateProfile: (data, token) => request('/api/profile', jsonOptions('PUT', data, token)),
  uploadImage: (file, token) => {
    const form = new FormData()
    form.append('photo', file)
    return request('/api/profile/upload', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + token },
      body: form,
    })
  },

  // --- admin: sections (order + visibility) ---
  sections: {
    list: () => request('/api/sections'),
    update: (key, data, token) => request('/api/sections/' + key, jsonOptions('PUT', data, token)),
    reorder: (order, token) => request('/api/sections/reorder', jsonOptions('PUT', { order }, token)),
  },

  // --- admin: content resources (add / edit / delete / hide / order) ---
  experiences: resource('experiences'),
  expertise: resource('expertise'),
  metrics: resource('metrics'),
  achievements: resource('achievements'),
  certifications: resource('certifications'),
  articles: resource('articles'),
  gallery: resource('gallery'),
  testimonials: resource('testimonials'),

  // --- admin: messages ---
  getMessages: (token) => request('/api/messages', {
    headers: { Authorization: 'Bearer ' + token },
  }),
  markMessageRead: (id, isRead, token) =>
    request('/api/messages/' + id + '/read', jsonOptions('PUT', { is_read: isRead }, token)),
  deleteMessage: (id, token) => request('/api/messages/' + id, jsonOptions('DELETE', {}, token)),
}
