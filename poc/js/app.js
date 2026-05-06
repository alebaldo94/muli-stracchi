'use strict';

const SEED_VERSION = '3';

// ── SEED DATA ────────────────────────────────────────────────────────────────

const SEED_MEMBERS = [
  {
    id: 1, role: "member",
    name: "Mario Rossi", email: "mario.rossi@muli.it", password: "muli2024",
    birthDate: "1985-06-15", taxCode: "RSSMRA85H15A271Z", phone: "333 123 4567",
    address: "Via Roma 12", cap: "60121", city: "Ancona", province: "AN",
    memberNumber: "ASD-2024-001", memberType: "ordinario",
    joinDate: "2023-03-15", membershipExpiry: "2026-12-31",
    insurance: true, insuranceType: "FCI", insuranceExpiry: "2026-12-31", insuranceNumber: "FCI-2026-00123",
    level: "intermediate", km_year: 2340, km_month: 450, rides_count: 47,
    notes: ""
  },
  {
    id: 2, role: "member",
    name: "Laura Bianchi", email: "laura.bianchi@muli.it", password: "muli2024",
    birthDate: "1990-03-22", taxCode: "BNCLRA90C62A271Y", phone: "347 987 6543",
    address: "Via Garibaldi 45", cap: "60035", city: "Jesi", province: "AN",
    memberNumber: "ASD-2022-008", memberType: "ordinario",
    joinDate: "2022-01-10", membershipExpiry: "2026-12-31",
    insurance: true, insuranceType: "FCI", insuranceExpiry: "2026-12-31", insuranceNumber: "FCI-2026-00089",
    level: "advanced", km_year: 4210, km_month: 620, rides_count: 89,
    notes: ""
  },
  {
    id: 3, role: "member",
    name: "Luca Ferretti", email: "luca.ferretti@muli.it", password: "muli2024",
    birthDate: "1998-11-08", taxCode: "FRRLCU98S08A271X", phone: "320 555 6789",
    address: "Via Mazzini 3", cap: "60019", city: "Senigallia", province: "AN",
    memberNumber: "ASD-2024-015", memberType: "ordinario",
    joinDate: "2024-01-20", membershipExpiry: "2026-05-20",
    insurance: false, insuranceType: null, insuranceExpiry: null, insuranceNumber: null,
    level: "beginner", km_year: 780, km_month: 120, rides_count: 23,
    notes: "Prima stagione agonistica"
  },
  {
    id: 4, role: "member",
    name: "Giulia Marchi", email: "giulia.marchi@muli.it", password: "muli2024",
    birthDate: "1993-07-30", taxCode: "MRCGLI93L70A271W", phone: "348 444 3210",
    address: "Corso Italia 78", cap: "60044", city: "Fabriano", province: "AN",
    memberNumber: "ASD-2023-022", memberType: "sostenitore",
    joinDate: "2023-06-08", membershipExpiry: "2026-05-25",
    insurance: true, insuranceType: "UISP", insuranceExpiry: "2026-12-31", insuranceNumber: "UISP-2026-00456",
    level: "intermediate", km_year: 1890, km_month: 380, rides_count: 41,
    notes: ""
  },
  {
    id: 5, role: "member",
    name: "Roberto Conti", email: "roberto.conti@muli.it", password: "muli2024",
    birthDate: "1978-04-12", taxCode: "CNTRRT78D12A271V", phone: "338 777 8901",
    address: "Via delle Querce 15", cap: "62012", city: "Civitanova M.", province: "MC",
    memberNumber: "ASD-2021-003", memberType: "ordinario",
    joinDate: "2021-09-22", membershipExpiry: "2026-12-31",
    insurance: true, insuranceType: "FCI", insuranceExpiry: "2026-12-31", insuranceNumber: "FCI-2026-00067",
    level: "advanced", km_year: 5670, km_month: 890, rides_count: 112,
    notes: "Istruttore MTB"
  },
  {
    id: 6, role: "member",
    name: "Sofia Romano", email: "sofia.romano@muli.it", password: "muli2024",
    birthDate: "1995-09-18", taxCode: "RMNSFO95P58A271U", phone: "366 222 3344",
    address: "Via Leopardi 22", cap: "61121", city: "Pesaro", province: "PU",
    memberNumber: "ASD-2023-031", memberType: "ordinario",
    joinDate: "2023-09-01", membershipExpiry: "2026-03-01",
    insurance: false, insuranceType: null, insuranceExpiry: null, insuranceNumber: null,
    level: "intermediate", km_year: 1540, km_month: 290, rides_count: 35,
    notes: "Tessera scaduta — da rinnovare"
  },
  {
    id: 7, role: "member",
    name: "Andrea Vitali", email: "andrea.vitali@muli.it", password: "muli2024",
    birthDate: "1982-01-25", taxCode: "VTLNDR82A25A271T", phone: "329 999 8877",
    address: "Via del Porto 5", cap: "61032", city: "Fano", province: "PU",
    memberNumber: "ASD-2020-001", memberType: "sostenitore",
    joinDate: "2020-04-12", membershipExpiry: "2026-12-31",
    insurance: true, insuranceType: "FCI", insuranceExpiry: "2026-12-31", insuranceNumber: "FCI-2026-00012",
    level: "advanced", km_year: 6210, km_month: 980, rides_count: 134,
    notes: "Fondatore del gruppo"
  },
  {
    id: 99, role: "admin",
    name: "Admin", email: "admin@muli.it", password: "admin2024",
    birthDate: null, taxCode: null, phone: null, address: null, cap: null, city: "", province: null,
    memberNumber: null, memberType: null, joinDate: "2020-01-01", membershipExpiry: null,
    insurance: false, insuranceType: null, insuranceExpiry: null, insuranceNumber: null,
    level: "", km_year: 0, km_month: 0, rides_count: 0, notes: ""
  }
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
  if (localStorage.getItem('ms_version') !== SEED_VERSION) {
    localStorage.setItem('ms_members', JSON.stringify(SEED_MEMBERS));
    localStorage.setItem('ms_events', JSON.stringify(SEED_EVENTS));
    localStorage.setItem('ms_rides', JSON.stringify(SEED_RIDES));
    localStorage.removeItem('ms_notifications');
    localStorage.removeItem('ms_email_settings');
    localStorage.setItem('ms_version', SEED_VERSION);
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
    const id = Math.max(0, ...all.map(m => m.id < 99 ? m.id : 0)) + 1;
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

  renewMembership(id, expiry) {
    this.updateMember(id, { membershipExpiry: expiry });
  },

  setInsurance(id, enabled, type, expiry, number) {
    this.updateMember(id, {
      insurance: enabled,
      insuranceType: enabled ? type : null,
      insuranceExpiry: enabled ? expiry : null,
      insuranceNumber: enabled ? number : null
    });
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
    rides.push({ ...data, id, userId: Number(userId), source: 'manual' });
    this._set('ms_rides', rides);
    const all = this._get('ms_members').map(m => {
      if (m.id == userId) return { ...m, km_month: (m.km_month || 0) + Number(data.km), km_year: (m.km_year || 0) + Number(data.km), rides_count: (m.rides_count || 0) + 1 };
      return m;
    });
    this._set('ms_members', all);
  },

  joinEvent(eventId, userId) {
    const events = this._get('ms_events').map(e => {
      if (e.id == eventId) { const p = e.participants || []; if (!p.includes(Number(userId))) p.push(Number(userId)); return { ...e, participants: p }; }
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
  },

  getNotifications() { return JSON.parse(localStorage.getItem('ms_notifications') || '[]'); },
  addNotification(entry) {
    const list = this.getNotifications();
    list.unshift({ ...entry, id: Date.now(), sentAt: new Date().toISOString() });
    if (list.length > 200) list.splice(200);
    localStorage.setItem('ms_notifications', JSON.stringify(list));
  },
  clearNotifications() { localStorage.removeItem('ms_notifications'); },

  getEmailSettings() {
    return JSON.parse(localStorage.getItem('ms_email_settings') || JSON.stringify({
      senderName: 'I Muli Stracchi ASD',
      senderEmail: 'segreteria@muliastracchi.it',
      remindDays: [30, 15, 7],
      autoSend: false
    }));
  },
  saveEmailSettings(s) { localStorage.setItem('ms_email_settings', JSON.stringify(s)); }
};

// ── NOTIFICATIONS ────────────────────────────────────────────────────────────

const REMINDER_LABELS = {
  tessera_expiring:   'Scadenza tessera imminente',
  tessera_expired:    'Tessera scaduta — rinnovo urgente',
  insurance_missing:  'Nessuna assicurazione registrata',
  insurance_expiring: 'Scadenza assicurazione imminente',
  insurance_expired:  'Assicurazione scaduta'
};

function sendReminder(memberId, type) {
  const m = DB.getMember(memberId);
  if (!m) return;
  DB.addNotification({
    memberId: m.id,
    memberName: m.name,
    email: m.email,
    type,
    typeLabel: REMINDER_LABELS[type] || type,
    status: 'sent'
  });
  toast(`Email inviata a ${m.name}`);
}

function getPendingReminders() {
  const members = DB.getMembers();
  const pending = [];
  members.forEach(m => {
    const ms = membershipStatus(m.membershipExpiry);
    if (ms.status === 'expired')
      pending.push({ member: m, type: 'tessera_expired',    label: 'Tessera scaduta',            urgent: true });
    else if (ms.status === 'expiring')
      pending.push({ member: m, type: 'tessera_expiring',   label: `Tessera scade in ${ms.days}g`, urgent: ms.days <= 15 });
    if (!m.insurance) {
      pending.push({ member: m, type: 'insurance_missing',  label: 'Nessuna assicurazione',      urgent: true });
    } else {
      const is = membershipStatus(m.insuranceExpiry);
      if (is.status === 'expired')
        pending.push({ member: m, type: 'insurance_expired',  label: 'Assicurazione scaduta',    urgent: true });
      else if (is.status === 'expiring')
        pending.push({ member: m, type: 'insurance_expiring', label: `Assicurazione scade in ${is.days}g`, urgent: is.days <= 15 });
    }
  });
  return pending.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
}

// ── AUTH ─────────────────────────────────────────────────────────────────────

const Auth = {
  login(email, password) {
    const user = DB.getAllUsers().find(m => m.email === email && m.password === password);
    if (!user) return null;
    localStorage.setItem('ms_session', JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role }));
    return user;
  },
  logout() { localStorage.removeItem('ms_session'); window.location.href = _base() + 'login.html'; },
  current() { const s = localStorage.getItem('ms_session'); return s ? JSON.parse(s) : null; },
  require(role) {
    const user = this.current();
    if (!user) { window.location.href = _base() + 'login.html'; return null; }
    if (role && user.role !== role) { window.location.href = _base() + (role === 'admin' ? 'dashboard.html' : 'login.html'); return null; }
    return user;
  }
};

function _base() { return window.location.pathname.includes('/admin/') ? '../' : ''; }

// ── TESSERE / MEMBERSHIP HELPERS ─────────────────────────────────────────────

function membershipStatus(expiryDate) {
  if (!expiryDate) return { status: 'none', label: 'Non tesserato', color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  const today = new Date(); today.setHours(0,0,0,0);
  const exp = new Date(expiryDate);
  const diff = Math.floor((exp - today) / 86400000);
  if (diff < 0)  return { status: 'expired',  label: 'Scaduta',          color: 'bg-red-100 text-red-700',    dot: 'bg-red-500',    days: diff };
  if (diff <= 30) return { status: 'expiring', label: `Scade in ${diff}g`, color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-500', days: diff };
  return             { status: 'valid',    label: 'Valida',           color: 'bg-green-100 text-green-700', dot: 'bg-green-500',  days: diff };
}

function insuranceStatus(member) {
  if (!member.insurance) return { ok: false, label: 'Non assicurato', color: 'bg-red-100 text-red-700' };
  const ms = membershipStatus(member.insuranceExpiry);
  if (ms.status === 'expired')  return { ok: false, label: 'Assic. scaduta', color: 'bg-red-100 text-red-700' };
  if (ms.status === 'expiring') return { ok: true,  label: `${member.insuranceType} – scade presto`, color: 'bg-yellow-100 text-yellow-800' };
  return { ok: true, label: `${member.insuranceType} – valida`, color: 'bg-green-100 text-green-700' };
}

// ── UI HELPERS ────────────────────────────────────────────────────────────────

function initials(name) { return (name || '?').split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2); }

function avatarBg(id) {
  const c = ['bg-yellow-400 text-yellow-900','bg-red-500 text-white','bg-blue-600 text-white','bg-green-600 text-white','bg-purple-500 text-white','bg-orange-500 text-white','bg-teal-500 text-white'];
  return c[id % c.length];
}

function levelBadge(level) {
  return { beginner:'bg-green-100 text-green-800', intermediate:'bg-yellow-100 text-yellow-800', advanced:'bg-red-100 text-red-700', hard:'bg-red-200 text-red-900' }[level] || 'bg-gray-100 text-gray-700';
}

function levelLabel(level) {
  return { beginner:'Principiante', intermediate:'Intermedio', advanced:'Avanzato', hard:'Difficile' }[level] || level;
}

function categoryLabel(cat) { return { strada:'Strada', mtb:'MTB', gravel:'Gravel' }[cat] || cat; }

function memberTypeLabel(t) { return { ordinario:'Ordinario', sostenitore:'Sostenitore', juniores:'Juniores' }[t] || t || '—'; }

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('it-IT', { day:'2-digit', month:'short', year:'numeric' });
}

function age(birthDate) {
  if (!birthDate) return null;
  const today = new Date(); const b = new Date(birthDate);
  let a = today.getFullYear() - b.getFullYear();
  if (today.getMonth() < b.getMonth() || (today.getMonth() === b.getMonth() && today.getDate() < b.getDate())) a--;
  return a;
}

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `fixed top-4 right-4 z-[9999] px-6 py-3 shadow-xl font-semibold text-sm rounded ${type === 'success' ? 'bg-yellow-400 text-yellow-900 border-b-4 border-yellow-600' : 'bg-red-600 text-white border-b-4 border-red-900'}`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ── SIDEBARS ──────────────────────────────────────────────────────────────────

const TW_HEAD = `
  <script src="https://cdn.tailwindcss.com?plugins=forms"><\/script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Lexend:wght@700;800;900&display=swap" rel="stylesheet"/>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>`;

function renderSidebar(activePage) {
  const base = _base();
  const user = Auth.current();
  const nav = [
    { id:'dashboard',   icon:'dashboard',     label:'Dashboard',    href:`${base}dashboard.html` },
    { id:'events',      icon:'event',         label:'Events',       href:`${base}events.html` },
    { id:'km',          icon:'directions_bike',label:'Registra KM', href:`${base}km.html` },
    { id:'leaderboard', icon:'emoji_events',  label:'Classifiche',  href:`${base}leaderboard.html` },
    { id:'profile',     icon:'account_circle',label:'Il Mio Profilo',href:`${base}profile.html` },
    { id:'regolamento', icon:'menu_book',     label:'Regolamento',  href:`${base}regolamento.html` },
  ];
  const links = nav.map(item => {
    const a = activePage === item.id;
    return `<a class="${a ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' : 'text-on-surface-variant font-medium hover:bg-surface-container'} px-md py-sm flex items-center gap-xs transition-all duration-200" href="${item.href}">
      <span class="material-symbols-outlined text-xl">${item.icon}</span>
      <span class="font-label-bold text-sm">${item.label}</span>
    </a>`;
  }).join('');
  const adminLink = user?.role === 'admin'
    ? `<a class="text-secondary font-medium px-md py-xs flex items-center gap-xs hover:bg-surface-container transition-all" href="${base}admin/index.html"><span class="material-symbols-outlined text-xl">admin_panel_settings</span><span class="font-label-bold text-sm">Admin</span></a>` : '';

  return `<aside class="fixed left-0 top-0 h-screen w-64 border-r-2 border-outline-variant bg-surface-container-lowest flex flex-col py-lg z-50 shadow-sm">
    <div class="px-md mb-lg">
      <h1 class="text-headline-md font-headline-md font-extrabold uppercase italic text-primary leading-none">I Muli Stracchi</h1>
      <p class="text-on-surface-variant font-label-bold text-xs tracking-widest mt-xs uppercase">Endurance &amp; Grit</p>
    </div>
    <nav class="flex-1 space-y-xs overflow-y-auto">${links}</nav>
    <div class="px-md mb-md mt-md">
      <a href="${base}km.html" class="w-full bg-primary-container text-on-primary-container font-label-bold py-sm flex items-center justify-center gap-xs border-b-4 border-primary hover:brightness-95 transition-all uppercase text-xs tracking-tight">
        <span class="material-symbols-outlined text-sm">add_circle</span> New Ride
      </a>
    </div>
    <div class="border-t border-outline-variant pt-sm space-y-xs">
      ${adminLink}
      <button onclick="Auth.logout()" class="text-on-surface-variant font-medium px-md py-sm flex items-center gap-xs hover:bg-surface-container transition-all w-full text-left">
        <span class="material-symbols-outlined text-xl">logout</span><span class="font-label-bold text-sm">Logout</span>
      </button>
    </div>
  </aside>`;
}

function renderAdminSidebar(activePage) {
  const base = _base();
  const nav = [
    { id:'dashboard',  icon:'dashboard',        label:'Dashboard',       href:`${base}admin/index.html` },
    { id:'members',    icon:'group',           label:'Gestione Soci',   href:`${base}admin/members.html` },
    { id:'tessere',    icon:'card_membership', label:'Tessere',         href:`${base}admin/tessere.html` },
    { id:'notifiche',  icon:'notifications',   label:'Notifiche Email', href:`${base}admin/notifiche.html` },
    { id:'events',     icon:'event',           label:'Gestione Eventi', href:`${base}admin/events.html` },
  ];
  const links = nav.map(item => {
    const a = activePage === item.id;
    return `<a class="${a ? 'text-primary-fixed font-bold bg-white/20 border-r-4 border-primary-container' : 'text-tertiary-fixed-dim font-medium hover:bg-white/10'} px-md py-sm flex items-center gap-xs transition-all duration-200" href="${item.href}">
      <span class="material-symbols-outlined text-xl">${item.icon}</span>
      <span class="font-label-bold text-sm">${item.label}</span>
    </a>`;
  }).join('');
  return `<aside class="fixed left-0 top-0 h-screen w-64 border-r-2 border-white/10 bg-inverse-surface flex flex-col py-lg z-50 shadow-xl">
    <div class="px-md mb-lg">
      <h1 class="text-headline-md font-headline-md font-extrabold uppercase italic text-primary-fixed leading-none">I Muli Stracchi</h1>
      <p class="text-primary-fixed-dim font-label-bold text-xs tracking-widest mt-xs uppercase">Admin Panel</p>
    </div>
    <nav class="flex-1 space-y-xs">${links}</nav>
    <div class="border-t border-white/20 pt-sm space-y-xs">
      <a href="${base}dashboard.html" class="text-tertiary-fixed-dim font-medium px-md py-sm flex items-center gap-xs hover:bg-white/10 transition-all">
        <span class="material-symbols-outlined text-xl">arrow_back</span><span class="font-label-bold text-sm">Back to App</span>
      </a>
      <button onclick="Auth.logout()" class="text-tertiary-fixed-dim font-medium px-md py-sm flex items-center gap-xs hover:bg-white/10 transition-all w-full text-left">
        <span class="material-symbols-outlined text-xl">logout</span><span class="font-label-bold text-sm">Logout</span>
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
      <a href="${_base()}profile.html" class="flex items-center gap-xs pl-md border-l border-outline-variant hover:opacity-80 transition-opacity">
        <div class="w-8 h-8 rounded-full bg-primary-container text-on-primary-container font-label-bold flex items-center justify-center text-xs">${initials(user?.name)}</div>
        <span class="font-label-bold text-on-surface text-sm hidden lg:block">${user?.name?.split(' ')[0] || ''}</span>
      </a>
    </div>
  </header>`;
}

function renderFooter() {
  return `<footer class="ml-64 border-t border-outline-variant bg-inverse-surface text-primary-fixed py-lg px-margin flex flex-col md:flex-row justify-between items-center">
    <div>
      <h5 class="text-headline-md font-headline-md italic font-black uppercase">I Muli Stracchi</h5>
      <p class="font-body-md text-tertiary-fixed-dim text-sm">© 2026 I Muli Stracchi ASD. Built for Endurance.</p>
    </div>
    <div class="flex gap-lg mt-md md:mt-0 font-label-bold text-sm">
      <a class="text-tertiary-fixed-dim hover:text-primary-fixed transition-colors" href="${_base()}regolamento.html">Regolamento</a>
      <a class="text-tertiary-fixed-dim hover:text-primary-fixed transition-colors" href="#">Privacy Policy</a>
    </div>
  </footer>`;
}
