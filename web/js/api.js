'use strict';

const TOKEN_KEY = 'ms_token';
const USER_KEY  = 'ms_user';

const Auth = {
  save(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  token()  { return localStorage.getItem(TOKEN_KEY); },
  user()   { try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; } },
  clear()  { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); },
  isAdmin(){ const u = this.user(); return u && u.role === 'admin'; },
  check()  {
    if (!this.token()) { window.location.href = '/login.html'; return false; }
    return true;
  },
  checkAdmin() {
    if (!this.check()) return false;
    if (!this.isAdmin()) { window.location.href = '/dashboard.html'; return false; }
    return true;
  },
  logout() { this.clear(); window.location.href = '/login.html'; },
};

async function apiFetch(path, opts = {}) {
  const token = Auth.token();
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch('/api' + path, { ...opts, headers });

  if (res.status === 401) { Auth.logout(); throw new Error('Non autorizzato'); }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

const API = {
  login: (email, password)       => apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  // members
  getMembers:   ()               => apiFetch('/members'),
  getMember:    (id)             => apiFetch(`/members/${id}`),
  createMember: (data)           => apiFetch('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id, data)       => apiFetch(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id)             => apiFetch(`/members/${id}`, { method: 'DELETE' }),
  renewMember:  (id)             => apiFetch(`/members/${id}/renew`, { method: 'POST' }),

  // events
  getEvents:    ()               => apiFetch('/events'),
  getEvent:     (id)             => apiFetch(`/events/${id}`),
  createEvent:  (data)           => apiFetch('/events', { method: 'POST', body: JSON.stringify(data) }),
  updateEvent:  (id, data)       => apiFetch(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteEvent:  (id)             => apiFetch(`/events/${id}`, { method: 'DELETE' }),
  joinEvent:    (id)             => apiFetch(`/events/${id}/join`, { method: 'POST' }),
  leaveEvent:   (id)             => apiFetch(`/events/${id}/leave`, { method: 'POST' }),

  // rides
  getRides:     ()               => apiFetch('/rides'),
  addRide:      (data)           => apiFetch('/rides', { method: 'POST', body: JSON.stringify(data) }),

  // notifications
  getPending:   ()               => apiFetch('/notifications/pending'),
  getNotifLog:  ()               => apiFetch('/notifications'),
  sendNotif:    (member_id, type)=> apiFetch('/notifications/send', { method: 'POST', body: JSON.stringify({ member_id, type }) }),
  sendAll:      ()               => apiFetch('/notifications/send-all', { method: 'POST' }),
  getSettings:  ()               => apiFetch('/notifications/settings'),
  saveSettings: (data)           => apiFetch('/notifications/settings', { method: 'PUT', body: JSON.stringify(data) }),

  // admin
  getStats:     ()               => apiFetch('/admin/stats'),
  getLeaderboard: ()             => apiFetch('/admin/leaderboard'),
};

// Utility UI
function flash(msg, type = 'ok') {
  const el = document.getElementById('flash');
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 4000);
}

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('it-IT');
}

function daysUntil(d) {
  if (!d) return null;
  return Math.floor((new Date(d) - new Date()) / 86400000);
}

function expiryBadge(d) {
  if (!d) return '<span class="badge badge-grey">—</span>';
  const days = daysUntil(d);
  if (days < 0)  return `<span class="badge badge-err">Scaduta (${fmtDate(d)})</span>`;
  if (days <= 15) return `<span class="badge badge-warn">${fmtDate(d)} (${days}gg)</span>`;
  return `<span class="badge badge-ok">${fmtDate(d)}</span>`;
}

function levelBadge(l) {
  const map = { beginner: ['badge-grey','Principiante'], intermediate: ['badge-ok','Intermedio'], advanced: ['badge-admin','Avanzato'] };
  const [cls, label] = map[l] || ['badge-grey', l];
  return `<span class="badge ${cls}">${label}</span>`;
}

function renderSidebar(activePage) {
  const user = Auth.user();
  const isAdmin = user && user.role === 'admin';
  const prefix = window.location.pathname.includes('/admin/') || window.location.pathname.includes('/member/') ? '../' : '';

  let nav = '';
  if (isAdmin) {
    nav = `
      <div class="nav-section">Admin</div>
      <a href="${prefix}admin/index.html" class="${activePage==='dashboard'?'active':''}">📊 Dashboard</a>
      <a href="${prefix}admin/soci.html" class="${activePage==='soci'?'active':''}">👥 Soci</a>
      <a href="${prefix}admin/tessere.html" class="${activePage==='tessere'?'active':''}">🎫 Tessere</a>
      <a href="${prefix}admin/eventi.html" class="${activePage==='eventi'?'active':''}">🗓 Eventi</a>
      <a href="${prefix}admin/notifiche.html" class="${activePage==='notifiche'?'active':''}">📧 Notifiche</a>
      <div class="nav-section">Personale</div>
      <a href="${prefix}member/profilo.html" class="${activePage==='profilo'?'active':''}">👤 Profilo</a>
    `;
  } else {
    nav = `
      <div class="nav-section">Area Personale</div>
      <a href="${prefix}member/index.html" class="${activePage==='home'?'active':''}">🏠 Home</a>
      <a href="${prefix}member/eventi.html" class="${activePage==='eventi'?'active':''}">🗓 Eventi</a>
      <a href="${prefix}member/km.html" class="${activePage==='km'?'active':''}">🚴 Chilometri</a>
      <a href="${prefix}member/profilo.html" class="${activePage==='profilo'?'active':''}">👤 Profilo</a>
    `;
  }

  return `
    <div class="sidebar">
      <div class="sidebar-brand">
        <h2>I Muli Stracchi</h2>
        <span>ASD Ciclismo</span>
      </div>
      <nav class="sidebar-nav">${nav}</nav>
      <div class="sidebar-footer">
        <div>${user ? user.name : ''}</div>
        <div><span class="badge badge-${isAdmin ? 'admin' : 'ok'}" style="margin:4px 0">${isAdmin ? 'Admin' : 'Socio'}</span></div>
        <button onclick="Auth.logout()">⬅ Esci</button>
      </div>
    </div>
  `;
}
