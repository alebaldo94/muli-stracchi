'use strict';
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db     = require('./index');

const hash = (pwd) => bcrypt.hash(pwd, 10);

async function seed() {
  console.log('Seeding members...');

  const members = [
    { role:'member',  name:'Mario Rossi',   email:'mario.rossi@muli.it',   pwd:'muli2024',   birth:'1985-06-15', cf:'RSSMRA85H15A271Z', phone:'333 123 4567', addr:'Via Roma 12',           cap:'60121', city:'Ancona',        prov:'AN', num:'ASD-2024-001', type:'ordinario',  join:'2023-03-15', exp:'2026-12-31', ins:true,  insT:'FCI',  insExp:'2026-12-31', insN:'FCI-2026-00123',  level:'intermediate', notes:'' },
    { role:'member',  name:'Laura Bianchi', email:'laura.bianchi@muli.it', pwd:'muli2024',   birth:'1990-03-22', cf:'BNCLRA90C62A271Y', phone:'347 987 6543', addr:'Via Garibaldi 45',       cap:'60035', city:'Jesi',          prov:'AN', num:'ASD-2022-008', type:'ordinario',  join:'2022-01-10', exp:'2026-12-31', ins:true,  insT:'FCI',  insExp:'2026-12-31', insN:'FCI-2026-00089',  level:'advanced',     notes:'' },
    { role:'member',  name:'Luca Ferretti', email:'luca.ferretti@muli.it', pwd:'muli2024',   birth:'1998-11-08', cf:'FRRLCU98S08A271X', phone:'320 555 6789', addr:'Via Mazzini 3',          cap:'60019', city:'Senigallia',    prov:'AN', num:'ASD-2024-015', type:'ordinario',  join:'2024-01-20', exp:'2026-05-20', ins:false, insT:null,   insExp:null,          insN:null,              level:'beginner',     notes:'Prima stagione agonistica' },
    { role:'member',  name:'Giulia Marchi', email:'giulia.marchi@muli.it', pwd:'muli2024',   birth:'1993-07-30', cf:'MRCGLI93L70A271W', phone:'348 444 3210', addr:'Corso Italia 78',        cap:'60044', city:'Fabriano',      prov:'AN', num:'ASD-2023-022', type:'sostenitore', join:'2023-06-08', exp:'2026-05-25', ins:true,  insT:'UISP', insExp:'2026-12-31', insN:'UISP-2026-00456', level:'intermediate', notes:'' },
    { role:'member',  name:'Roberto Conti', email:'roberto.conti@muli.it', pwd:'muli2024',   birth:'1978-04-12', cf:'CNTRRT78D12A271V', phone:'338 777 8901', addr:'Via delle Querce 15',    cap:'62012', city:'Civitanova M.', prov:'MC', num:'ASD-2021-003', type:'ordinario',  join:'2021-09-22', exp:'2026-12-31', ins:true,  insT:'FCI',  insExp:'2026-12-31', insN:'FCI-2026-00067',  level:'advanced',     notes:'Istruttore MTB' },
    { role:'member',  name:'Sofia Romano',  email:'sofia.romano@muli.it',  pwd:'muli2024',   birth:'1995-09-18', cf:'RMNSFO95P58A271U', phone:'366 222 3344', addr:'Via Leopardi 22',        cap:'61121', city:'Pesaro',        prov:'PU', num:'ASD-2023-031', type:'ordinario',  join:'2023-09-01', exp:'2026-03-01', ins:false, insT:null,   insExp:null,          insN:null,              level:'intermediate', notes:'Tessera scaduta — da rinnovare' },
    { role:'member',  name:'Andrea Vitali', email:'andrea.vitali@muli.it', pwd:'muli2024',   birth:'1982-01-25', cf:'VTLNDR82A25A271T', phone:'329 999 8877', addr:'Via del Porto 5',        cap:'61032', city:'Fano',          prov:'PU', num:'ASD-2020-001', type:'sostenitore', join:'2020-04-12', exp:'2026-12-31', ins:true,  insT:'FCI',  insExp:'2026-12-31', insN:'FCI-2026-00012',  level:'advanced',     notes:'Fondatore del gruppo' },
    { role:'admin',   name:'Admin',         email:'admin@muli.it',         pwd:'admin2024',  birth:null,         cf:null,               phone:null,           addr:null,                     cap:null,    city:'',              prov:null, num:null,           type:null,         join:'2020-01-01', exp:null,         ins:false, insT:null,   insExp:null,          insN:null,              level:'',             notes:'' },
  ];

  for (const m of members) {
    const h = await hash(m.pwd);
    await db.query(`
      INSERT INTO members
        (role, name, email, password_hash, birth_date, tax_code, phone, address, cap, city, province,
         member_number, member_type, join_date, membership_expiry,
         insurance, insurance_type, insurance_expiry, insurance_number, level, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
      ON CONFLICT (email) DO NOTHING
    `, [m.role, m.name, m.email, h, m.birth, m.cf, m.phone, m.addr, m.cap, m.city, m.prov,
        m.num, m.type, m.join, m.exp, m.ins, m.insT, m.insExp, m.insN, m.level || null, m.notes]);
  }

  console.log('Seeding events...');
  const events = [
    { title:'Gran Fondo del Mulo',      date:'2026-09-24', loc:'Ancona, Marche',          dist:145, elev:2800, cat:'strada', lvl:'hard',         desc:'L\'evento regina della stagione. 145km di pura adrenalina.' },
    { title:'Notturna in Collina',      date:'2026-08-12', loc:'Urbino (PU)',              dist:35,  elev:600,  cat:'strada', lvl:'advanced',     desc:'Pedalata notturna tra i colli urbinati.' },
    { title:'Cronoscalata delle Rocche',date:'2026-10-15', loc:'San Benedetto del Tronto', dist:15,  elev:450,  cat:'strada', lvl:'intermediate', desc:'La classica salita delle Rocche in modalità cronometro.' },
    { title:'Fango & Gloria Cross',     date:'2026-11-03', loc:'Macerata',                 dist:40,  elev:900,  cat:'gravel', lvl:'hard',         desc:'Gravel puro nel cuore delle Marche.' },
    { title:'Uscita Domenicale Colli',  date:'2026-05-18', loc:'Ancona',                   dist:80,  elev:1200, cat:'strada', lvl:'intermediate', desc:'L\'uscita settimanale del gruppo.' },
    { title:'MTB Trail Sibillini',      date:'2026-06-22', loc:'Monti Sibillini',           dist:30,  elev:1500, cat:'mtb',    lvl:'advanced',     desc:'Trail tecnico sui Sibillini.' },
  ];

  for (const e of events) {
    const { rows } = await db.query(`
      INSERT INTO events (title, date, location, distance, elevation, category, level, description)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING RETURNING id
    `, [e.title, e.date, e.loc, e.dist, e.elev, e.cat, e.lvl, e.desc]);
    if (rows[0]) {
      for (const email of ['mario.rossi@muli.it', 'laura.bianchi@muli.it', 'roberto.conti@muli.it']) {
        const { rows: [m] } = await db.query('SELECT id FROM members WHERE email=$1', [email]);
        if (m) await db.query(
          'INSERT INTO event_participants (event_id, member_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
          [rows[0].id, m.id]
        );
      }
    }
  }

  console.log('Seeding rides...');
  const { rows: [mario] } = await db.query('SELECT id FROM members WHERE email=$1', ['mario.rossi@muli.it']);
  if (mario) {
    for (const r of [
      { title:'Giro del Lago',          date:'2026-05-01', km:45, dur:'1:45', elev:320,  src:'manual', note:'Bella uscita mattutina' },
      { title:'Allenamento Crono',      date:'2026-05-03', km:60, dur:'2:10', elev:580,  src:'strava', note:'' },
      { title:'Uscita di Gruppo Colli', date:'2026-05-06', km:85, dur:'3:20', elev:1100, src:'manual', note:'Con il gruppo' },
    ]) {
      await db.query(
        'INSERT INTO rides (user_id, title, date, km, duration, elevation, source, note) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT DO NOTHING',
        [mario.id, r.title, r.date, r.km, r.dur, r.elev, r.src, r.note]
      );
    }
    await db.query('UPDATE members SET km_month=450, km_year=2340, rides_count=47 WHERE id=$1', [mario.id]);
  }

  console.log('Seed completed.');
  await db.end();
}

seed().catch((err) => { console.error(err); process.exit(1); });
