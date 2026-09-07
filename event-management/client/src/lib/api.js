const BASE = '/api';

async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.error) message = data.error;
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getEvents: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return fetch(`${BASE}/events${query ? `?${query}` : ''}`).then(handleResponse);
  },
  getEvent: (id) => fetch(`${BASE}/events/${id}`).then(handleResponse),
  getCategories: () => fetch(`${BASE}/events/categories`).then(handleResponse),
  createEvent: (payload) =>
    fetch(`${BASE}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),
  updateEvent: (id, payload) =>
    fetch(`${BASE}/events/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),
  deleteEvent: (id) =>
    fetch(`${BASE}/events/${id}`, { method: 'DELETE' }).then(handleResponse),
  registerForEvent: (id, payload) =>
    fetch(`${BASE}/events/${id}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(handleResponse),
  getRegistrations: (id) => fetch(`${BASE}/events/${id}/registrations`).then(handleResponse),
  getStats: () => fetch(`${BASE}/stats`).then(handleResponse),
};
