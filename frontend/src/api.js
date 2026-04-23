// Base URL — uses env variable in production, falls back to Render URL
const BASE = process.env.REACT_APP_API_URL || 'https://college-event-backend-hwj1.onrender.com/api';

// Get token
const getToken = () => localStorage.getItem('cem_token');

// Common request function
async function req(url, opts = {}) {
  const token = getToken();

  const res = await fetch(`${BASE}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...opts,
    ...(opts.body && typeof opts.body === 'object'
      ? { body: JSON.stringify(opts.body) }
      : {})
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');

  return data;
}

// Auth APIs
export const authAPI = {
  signup:         (body)       => req('/auth/signup',              { method: 'POST', body }),
  login:          (body)       => req('/auth/login',               { method: 'POST', body }),
  me:             ()           => req('/auth/me'),
  pendingAdmins:  ()           => req('/auth/pending-admins'),
  approveAdmin:   (id, action) => req(`/auth/approve-admin/${id}`, { method: 'PUT', body: { action } }),
  students:       ()           => req('/auth/students'),
};

// Event APIs
export const eventsAPI = {
  getAll:         ()         => req('/events'),
  create:         (body)     => req('/events',            { method: 'POST', body }),
  update:         (id, body) => req(`/events/${id}`,      { method: 'PUT',  body }),
  remove:         (id)       => req(`/events/${id}`,      { method: 'DELETE' }),
  register:       (id)       => req(`/events/${id}/register`,  { method: 'POST' }),
  submitFeedback: (id, body) => req(`/events/${id}/feedback`,  { method: 'POST', body }),
  getFeedback:    (id)       => req(`/events/${id}/feedback`),

  // Excel download
  download: async (id, title) => {
    const token = getToken();

    const res = await fetch(`${BASE}/events/${id}/download`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    });

    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message);
    }

    const blob = await res.blob();
    const url  = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title}_Registrations.xlsx`;

    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  }
};