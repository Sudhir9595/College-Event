// All backend API calls are here
// "proxy": "http://localhost:5000" in package.json handles the URL

const getToken = () => localStorage.getItem('cem_token');

async function req(url, opts = {}) {
  const token = getToken();
  const res = await fetch(`/api${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    ...opts,
    ...(opts.body && typeof opts.body === 'object' ? { body: JSON.stringify(opts.body) } : {})
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const authAPI = {
  signup:         (body)       => req('/auth/signup',              { method: 'POST', body }),
  login:          (body)       => req('/auth/login',               { method: 'POST', body }),
  me:             ()           => req('/auth/me'),
  pendingAdmins:  ()           => req('/auth/pending-admins'),
  approveAdmin:   (id, action) => req(`/auth/approve-admin/${id}`, { method: 'PUT', body: { action } }),
  students:       ()           => req('/auth/students'),
};

export const eventsAPI = {
  getAll:          ()        => req('/events'),
  create:          (body)    => req('/events',            { method: 'POST',   body }),
  update:          (id, body)=> req(`/events/${id}`,      { method: 'PUT',    body }),
  remove:          (id)      => req(`/events/${id}`,      { method: 'DELETE'       }),
  register:        (id)      => req(`/events/${id}/register`,  { method: 'POST' }),
  submitFeedback:  (id, body)=> req(`/events/${id}/feedback`,  { method: 'POST', body }),
  getFeedback:     (id)      => req(`/events/${id}/feedback`),

  // Excel download — uses raw fetch for blob
  download: async (id, title) => {
    const token = getToken();
    const res   = await fetch(`/api/events/${id}/download`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      const d = await res.json();
      throw new Error(d.message);
    }
    const blob = await res.blob();
    const url  = window.URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `${title}_Registrations.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }
};
