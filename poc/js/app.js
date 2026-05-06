'use strict';

// ── SEED DATA ────────────────────────────────────────────────────────────────

const SEED_MEMBERS = [
  { id: 1, name: "Mario Rossi", email: "mario.rossi@muli.it", password: "muli2024", city: "Ancona", level: "intermediate", joinDate: "2023-03-15", km_year: 2340, km_month: 450, rides_count: 47, role: "member" },
  { id: 2, name: "Laura Bianchi", email: "laura.bianchi@muli.it", password: "muli2024", city: "Jesi", level: "advanced", joinDate: "2022-01-10", km_year: 4210, km_month: 620, rides_count: 89, role: "member" },
  { id: 3, name: "Luca Ferretti", email: "luca.ferretti@muli.it", password: "muli2024", city: "Senigallia", level: "beginner", joinDate: "2024-01-20", km_year: 780, km_month: 120, rides_count: 23, role: "member" },
  { id: 4, name: "Giulia Marchi", email: "giulia.marchi@muli.it", password: "muli2024", city: "Fabriano", level: "intermediate", joinDate: "2023-06-08", km_year: 1890, km_month: 380, rides_count: 41, role: "member" },
  { id: 5, name: "Roberto Conti", email: "roberto.conti@muli.it", password: "muli2024", city: "Civitanova", level: "advanced", joinDate: "2021-09-22", km_year: 5670, km_month: 890, rides_count: 112, role: "member" },
  { id: 6, name: "Sofia Romano", email: "sofia.romano@muli.it", password: "muli2024", city: "Pesaro", level: "intermediate", joinDate: "2023-09-01", km_year: 1540, km_month: 290, rides_count: 35, role: "member" },
  { id: 7, name: "Andrea Vitali", email: "andrea.vitali@muli.it", password: "muli2024", city: "Fano", level: "advanced", joinDate: "2020-04-12", km_year: 6210, km_month: 980, rides_count: 134, role: "member" },
  { id: 99, name: "Admin", email: "admin@muli.it", password: "admin2024", city: "", level: "", joinDate: "2020-01-01", km_year: 0, km_month: 0, rides_count: 0, role: "admin" }
];

const SEED_EVENTS = [
  { id: 1, title: "Gran Fondo del Mulo", date: "2026-09-24", location: "Ancona, Marche", distance: 145, elevation: 2800, category: "strada", level: "hard", description: "L'evento regina della stagione. 145km di pura adrenalina tra le strade delle Marche. Pianificati 2800m di dislivello.", participants: [1, 2, 5] },
  { id: 2, title: "Notturna in Collina", date: "2026-08-12", location: "Urbino (PU)", distance: 35, elevation: 600, category: "strada", level: "advanced", description: "Pedalata notturna tra i colli urbinati. Atmosfera unica, fari accesi e stelle sopra di te.", participants: [1, 3, 4] },
  { id: 3, title: "Cronoscalata delle Rocche", date: "2026-10-15", location: "San Benedetto del Tronto", distance: 15, elevation: 450, category: "strada", level: "intermediate", description: "La classica salita delle Rocche in modalità cronometro. Chi è il re della salita?", participants: [2, 5, 7] },
  { id: 4, title: "Fango & Gloria Cross", date: "2026-11-03", location: "Macerata", distance: 40, elevation: 900, category: "gravel", level: "hard", description: "Gravel puro nel cuore delle Marche. Fango garantito, gloria assicurata per chi finisce.", participants: [4, 5, 6, 7] },
  { id: 5, title: "Uscita Domenicale Colli", date: "2026-05-18", location: "Ancona", distance: 80, elevation: 1200, category: "strada", level: "intermediate", description: "L'uscita settimanale del gruppo. Rilassata ma non troppo. Caffè a metà percorso garantito.", participants: [1, 2, 3, 4, 6] },
  { id: 6, title: "MTB Trail Sibillini", date: "2026-06-22", location: "Monti Sibillini", distance: 30, elevation: 1500, category: "mtb", level: "advanced", description: "Trail tecnico sui Sibillini. Vista mozzafiato e discese adrenalinica. Solo per esperti MTB.", participants: [5, 7] }
];

const SEED_RIDES = [
  { id: 1, userId: 1, title: "Giro del Lago", date: "2026-05-01", km: 45, duration: "1:45", elevation: 320, source: "manual", note: "Bella uscita mattutina" },
  { id: 2, userId: 1, title: "Allenamento Crono", date: "2026-05-03", km: 60, duration: "2:10", elevation: 580, source: "strava", note: "" },
  { id: 3, userId: 1, title: "Uscita di Gruppo Colli", date: "2026-05-06", km: 85, duration: "3:20", elevation: 1100, source: "manual", note: "Con il gruppo, ottima serata" }
];

// ── STORAGE ──────────────────────────────────────────────────────────────────

function initStorage() {
  if (!localStorage.getItem('ms_initialized')) {
    localStorage.setItem('ms_members', JSON.stringify(SEED_MEMBERS));
    localStorage.setItem('ms_events', JSON.stringify(SEED_EVENTS));
    localStorage.setItem('ms_rides', JSON.stringify(SEED_RIDES));
    localStorage.setItem('ms_initialized', '1');
  }
}

const DB = {
  _get(key) { return JSON.parse(localStorage.getItem(key) || '[]'); },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  getMembers() { return this._get('ms_members').filter(m => m.role === 'member'); },
  getAllUsers() { return this._get('ms_members'); },
  getMember(id) { return this._get('ms_members').find(m => m.id == id); },

  addMember(data) {
    const all = this._get('ms_members');
    const id = Math.max(0, ...all.map(m => m.id)) + 1;
    const m = { ...data, id, role: 'member', km_year: 0, km_month: 0, rides_count: 0, joinDate: new Date().toISOString().split('T')[0] };
    all.push(m);
    this._set('ms_members', all);
    return m;
  },

  updateMember(id, data) {
    const all = this._get('ms_members').map(m => m.id == id ? { ...m, ...data } : m);
    this._set('ms_members', all);
  },

  deleteMember(id) {
    this._set('ms_members', this._get('ms_members').filter(m => m.id != id));
  },

  getEvents() { return this._get('ms_events'); },
  getEvent(id) { return this._get('ms_events').find(e => e.id == id); },

  addEvent(data) {
    const events = this._get('ms_events');
    const id = Math.max(0, ...events.map(e => e.id)) + 1;
    const e = { ...data, id, participants: [] };
    events.push(e);
    this._set('ms_events', events);
    return e;
  },

  updateEvent(id, data) {
    const events = this._get('ms_events').map(e => e.id == id ? { ...e, ...data } : e);
    this._set('ms_events', events);
  },

  deleteEvent(id) {
    this._set('ms_events', this._get('ms_events').filter(e => e.id != id));
  },

  getRides(userId) { return this._get('ms_rides').filter(r => r.userId == userId); },
  getAllRides() { return this._get('ms_rides'); },

  addRide(userId, data) {
    const rides = this._get('ms_rides');
    const id = Math.max(0, ...rides.map(r => r.id)) + 1;
    const r = { ...data, id, userId: Number(userId), source: 'manual' };
    rides.push(r);
    this._set('ms_rides', rides);
    const all = this._get('ms_members').map(m => {
      if (m.id == userId) return { ...m, km_month: (m.km_month || 0) + Number(data.km), km_year: (m.km_year || 0) + Number(data.km), rides_count: (m.rides_count || 0) + 1 };
      return m;
    });
    this._set('ms_members', all);
    return r;
  },

  joinEvent(eventId, userId) {
    const events = this._get('ms_events').map(e => {
      if (e.id == eventId) {
        const p = e.participants || [];
        if (!p.includes(Number(userId))) p.push(Number(userId));
        return { ...e, participants: p };
      }
      return e;
    });
    this._set('ms_events', events);
  },

  leaveEvent(eventId, userId) {
    const events = this._get('ms_events').map(e => {
      if (e.id == eventId) return { ...e, participants: (e.participants || []).filter(p => p != userId) };
      return e;
    });
    this._set('ms_events', events);
  }
};

// ── AUTH ─────────────────────────────────────────────────────────────────────

const Auth = {
  login(email, password) {
    const user = DB.getAllUsers().find(m => m.email === email && m.password === password);
    if (!user) return null;
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    localStorage.setItem('ms_session', JSON.stringify(session));
    return user;
  },
  logout() {
    localStorage.removeItem('ms_session');
    window.location.href = _base() + 'login.html';
  },
  current() {
    const s = localStorage.getItem('ms_session');
    return s ? JSON.parse(s) : null;
  },
  require(role) {
    const user = this.current();
    if (!user) { window.location.href = _base() + 'login.html'; return null; }
    if (role && user.role !== role) { window.location.href = _base() + (role === 'admin' ? 'dashboard.html' : 'login.html'); return null; }
    return user;
  }
};

function _base() {
  return window.location.pathname.includes('/admin/') ? '../' : '';
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────

function initials(name) {
  return (name || '?').split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2);
}

function avatarBg(id) {
  const c = ['bg-yellow-400 text-yellow-900', 'bg-red-500 text-white', 'bg-blue-600 text-white', 'bg-green-600 text-white', 'bg-purple-500 text-white', 'bg-orange-500 text-white', 'bg-teal-500 text-white'];
  return c[id % c.length];
}

function levelBadge(level) {
  const map = { beginner: 'bg-green-100 text-green-800', intermediate: 'bg-yellow-100 text-yellow-800', advanced: 'bg-red-100 text-red-700', hard: 'bg-red-200 text-red-900' };
  return map[level] || 'bg-gray-100 text-gray-700';
}

function levelLabel(level) {
  return { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzato', hard: 'Difficile' }[level] || level;
}

function categoryLabel(cat) {
  return { strada: 'Strada', mtb: 'MTB', gravel: 'Gravel' }[cat] || cat;
}

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `fixed top-4 right-4 z-[9999] px-6 py-3 shadow-xl font-semibold text-sm transition-all rounded ${type === 'success' ? 'bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600' : 'bg-red-600 text-white border-b-4 border-red-900'}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── TAILWIND CONFIG (inline per ogni pagina) ──────────────────────────────────
// Ogni pagina HTML deve avere questo config prima dello script src="app.js"

// ── SIDEBAR / TOPBAR / FOOTER ─────────────────────────────────────────────────

function renderSidebar(activePage) {
  const base = _base();
  const user = Auth.current();
  const nav = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', href: `${base}dashboard.html` },
    { id: 'events', icon: 'event', label: 'Events', href: `${base}events.html` },
    { id: 'km', icon: 'directions_bike', label: 'Registra KM', href: `${base}km.html` },
    { id: 'leaderboard', icon: 'emoji_events', label: 'Classifiche', href: `${base}leaderboard.html` },
  ];
  const links = nav.map(item => {
    const a = activePage === item.id;
    return `<a class="${a ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' : 'text-on-surface-variant font-medium hover:bg-surface-container'} px-md py-sm flex items-center gap-xs transition-all duration-200" href="${item.href}">
      <span class="material-symbols-outlined">${item.icon}</span>
      <span class="font-label-bold">${item.label}</span>
    </a>`;
  }).join('');
  const adminLink = user?.role === 'admin'
    ? `<a class="text-on-surface-variant font-medium px-md py-xs flex items-center gap-xs hover:bg-surface-container transition-all" href="${base}admin/index.html"><span class="material-symbols-outlined">admin_panel_settings</span><span class="font-label-bold">Admin</span></a>` : '';

  return `<aside class="fixed left-0 top-0 h-screen w-64 border-r-2 border-outline-variant bg-surface-container-lowest flex flex-col py-lg z-50 shadow-sm">
    <div class="px-md mb-xl">
      <h1 class="text-headline-md font-headline-md font-extrabold uppercase italic text-primary leading-none">I Muli Stracchi</h1>
      <p class="text-on-surface-variant font-label-bold text-xs tracking-widest mt-xs uppercase">Endurance &amp; Grit</p>
    </div>
    <nav class="flex-1 space-y-xs">${links}</nav>
    <div class="px-md mb-md mt-lg">
      <a href="${base}km.html" class="w-full bg-primary-container text-on-primary-container font-label-bold py-sm flex items-center justify-center gap-xs border-b-4 border-primary hover:brightness-95 transition-all uppercase tracking-tight">
        <span class="material-symbols-outlined">add_circle</span> New Ride
      </a>
    </div>
    <div class="border-t border-outline-variant pt-md space-y-xs">
      ${adminLink}
      <button onclick="Auth.logout()" class="text-on-surface-variant font-medium px-md py-sm flex items-center gap-xs hover:bg-surface-container transition-all w-full text-left">
        <span class="material-symbols-outlined">logout</span><span class="font-label-bold">Logout</span>
      </button>
    </div>
  </aside>`;
}

function renderAdminSidebar(activePage) {
  const base = _base();
  const nav = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard', href: `${base}admin/index.html` },
    { id: 'members', icon: 'group', label: 'Gestione Soci', href: `${base}admin/members.html` },
    { id: 'events', icon: 'event', label: 'Gestione Eventi', href: `${base}admin/events.html` },
  ];
  const links = nav.map(item => {
    const a = activePage === item.id;
    return `<a class="${a ? 'text-primary-fixed font-bold bg-white/20' : 'text-tertiary-fixed-dim font-medium hover:bg-white/10'} px-md py-sm flex items-center gap-xs transition-all duration-200" href="${item.href}">
      <span class="material-symbols-outlined">${item.icon}</span>
      <span class="font-label-bold">${item.label}</span>
    </a>`;
  }).join('');
  return `<aside class="fixed left-0 top-0 h-screen w-64 border-r-2 border-white/10 bg-inverse-surface flex flex-col py-lg z-50 shadow-xl">
    <div class="px-md mb-xl">
      <h1 class="text-headline-md font-headline-md font-extrabold uppercase italic text-primary-fixed leading-none">I Muli Stracchi</h1>
      <p class="text-primary-fixed-dim font-label-bold text-xs tracking-widest mt-xs uppercase">Admin Panel</p>
    </div>
    <nav class="flex-1 space-y-xs">${links}</nav>
    <div class="border-t border-white/20 pt-md space-y-xs">
      <a href="${base}dashboard.html" class="text-tertiary-fixed-dim font-medium px-md py-sm flex items-center gap-xs hover:bg-white/10 transition-all">
        <span class="material-symbols-outlined">arrow_back</span><span class="font-label-bold">Back to App</span>
      </a>
      <button onclick="Auth.logout()" class="text-tertiary-fixed-dim font-medium px-md py-sm flex items-center gap-xs hover:bg-white/10 transition-all w-full text-left">
        <span class="material-symbols-outlined">logout</span><span class="font-label-bold">Logout</span>
      </button>
    </div>
  </aside>`;
}

function renderTopBar(title) {
  const user = Auth.current();
  return `<header class="sticky top-0 z-40 ml-64 h-16 bg-surface/95 backdrop-blur-md border-b-2 border-outline-variant flex justify-between items-center px-gutter shadow-sm">
    <h2 class="font-headline-md text-on-surface">${title}</h2>
    <div class="flex items-center gap-md">
      <button class="p-xs text-on-surface-variant hover:text-primary transition-colors"><span class="material-symbols-outlined">notifications</span></button>
      <div class="flex items-center gap-xs pl-md border-l border-outline-variant">
        <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-label-bold flex items-center justify-center text-xs">${initials(user?.name)}</div>
        <span class="font-label-bold text-on-surface text-sm hidden lg:block">${user?.name?.split(' ')[0] || ''}</span>
      </div>
    </div>
  </header>`;
}

function renderFooter(offset = true) {
  return `<footer class="${offset ? 'ml-64' : ''} border-t border-outline-variant bg-inverse-surface text-primary-fixed py-lg px-margin flex flex-col md:flex-row justify-between items-center">
    <div>
      <h5 class="text-headline-md font-headline-md italic font-black uppercase">I Muli Stracchi</h5>
      <p class="font-body-md text-tertiary-fixed-dim text-sm">© 2026 I Muli Stracchi ASD. Built for Endurance.</p>
    </div>
    <div class="flex gap-lg mt-md md:mt-0 font-label-bold text-sm">
      <a class="text-tertiary-fixed-dim hover:text-primary-fixed transition-colors" href="#">Privacy Policy</a>
      <a class="text-tertiary-fixed-dim hover:text-primary-fixed transition-colors" href="#">Contatti</a>
    </div>
  </footer>`;
}

function mountLayout(sidebarHtml, topbarHtml) {
  document.getElementById('sidebar-mount').outerHTML = sidebarHtml;
  document.getElementById('topbar-mount').outerHTML = topbarHtml;
  document.getElementById('footer-mount').outerHTML = renderFooter();
}

function mountAdminLayout(sidebarHtml, topbarHtml) {
  document.getElementById('sidebar-mount').outerHTML = sidebarHtml;
  document.getElementById('topbar-mount').outerHTML = topbarHtml;
  document.getElementById('footer-mount').outerHTML = renderFooter();
}
