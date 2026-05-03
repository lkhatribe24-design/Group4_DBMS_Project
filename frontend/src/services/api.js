const API_BASE = 'http://localhost:3000/api';

const getHeaders = () => {
  const role = localStorage.getItem('role');
  const headers = { 'Content-Type': 'application/json' };
  
  if (role === 'USER') {
    headers['x-user-id'] = localStorage.getItem('userId');
  } else if (role === 'ADMIN') {
    headers['x-admin-id'] = localStorage.getItem('adminId');
  }
  return headers;
};

export const api = {
  // AUTH
  register: async (data) => {
    const res = await fetch(`${API_BASE}/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    return res.json();
  },
  loginUser: async (email) => {
    const res = await fetch(`${API_BASE}/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    return res.json();
  },
  loginAdmin: async (email) => {
    const res = await fetch(`${API_BASE}/admin/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    return res.json();
  },

  // USER
  reportLost: async (data) => {
    const res = await fetch(`${API_BASE}/lost`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return res.json();
  },
  reportFound: async (data) => {
    const res = await fetch(`${API_BASE}/found`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return res.json();
  },
  getUserReports: async () => {
    const res = await fetch(`${API_BASE}/reports`, { headers: getHeaders() });
    return res.json();
  },
  getMatches: async () => {
    const res = await fetch(`${API_BASE}/matches`, { headers: getHeaders() });
    return res.json();
  },
  submitClaim: async (data) => {
    const res = await fetch(`${API_BASE}/claim`, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
    return res.json();
  },
  getMyClaims: async () => {
    const res = await fetch(`${API_BASE}/my-claims`, { headers: getHeaders() });
    return res.json();
  },

  // ADMIN
  getClaims: async () => {
    const res = await fetch(`${API_BASE}/claims`, { headers: getHeaders() });
    return res.json();
  },
  approveClaim: async (id) => {
    const res = await fetch(`${API_BASE}/approve/${id}`, { method: 'PUT', headers: getHeaders() });
    return res.json();
  },
  rejectClaim: async (id) => {
    const res = await fetch(`${API_BASE}/reject/${id}`, { method: 'PUT', headers: getHeaders() });
    return res.json();
  }
};
