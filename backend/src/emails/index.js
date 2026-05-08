'use strict';

const TEMPLATES = {
  tessera_expiring: {
    subject: (data) => `[I Muli Stracchi] Tessera in scadenza tra ${data.days} giorni`,
    html: (data) => `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Tessera in scadenza</title></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <div style="background:#e8f4e8;border-left:4px solid #2d7a2d;padding:16px;margin-bottom:24px">
    <h2 style="margin:0;color:#2d7a2d">I Muli Stracchi ASD</h2>
  </div>
  <h3>Promemoria: tessera in scadenza</h3>
  <p>Ciao <strong>${data.name}</strong>,</p>
  <p>Ti ricordiamo che la tua tessera associativa scadrà tra <strong>${data.days} giorni</strong>
  (${data.expiry_date}).</p>
  <p>Per rinnovarla contatta la segreteria oppure accedi alla tua area personale.</p>
  <p style="margin-top:32px;color:#666;font-size:12px">
    I Muli Stracchi ASD — segreteria@muliastracchi.it
  </p>
</body></html>`,
    text: (data) => `Ciao ${data.name},\n\nLa tua tessera scadrà tra ${data.days} giorni (${data.expiry_date}).\nContatta la segreteria per rinnovarla.\n\nI Muli Stracchi ASD`,
  },

  tessera_expired: {
    subject: (_data) => '[I Muli Stracchi] Tessera scaduta — rinnovo urgente',
    html: (data) => `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Tessera scaduta</title></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <div style="background:#fde8e8;border-left:4px solid #c0392b;padding:16px;margin-bottom:24px">
    <h2 style="margin:0;color:#c0392b">I Muli Stracchi ASD</h2>
  </div>
  <h3 style="color:#c0392b">Tessera scaduta</h3>
  <p>Ciao <strong>${data.name}</strong>,</p>
  <p>La tua tessera associativa è <strong>scaduta il ${data.expiry_date}</strong>.</p>
  <p>Per continuare a partecipare alle attività del club è necessario rinnovarla al più presto.</p>
  <p style="margin-top:32px;color:#666;font-size:12px">
    I Muli Stracchi ASD — segreteria@muliastracchi.it
  </p>
</body></html>`,
    text: (data) => `Ciao ${data.name},\n\nLa tua tessera è scaduta il ${data.expiry_date}.\nRinnovala al più presto contattando la segreteria.\n\nI Muli Stracchi ASD`,
  },

  insurance_missing: {
    subject: (_data) => '[I Muli Stracchi] Assicurazione non registrata',
    html: (data) => `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Assicurazione mancante</title></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <div style="background:#fef9e7;border-left:4px solid #e67e22;padding:16px;margin-bottom:24px">
    <h2 style="margin:0;color:#e67e22">I Muli Stracchi ASD</h2>
  </div>
  <h3>Assicurazione non registrata</h3>
  <p>Ciao <strong>${data.name}</strong>,</p>
  <p>Non risulta nessuna assicurazione registrata per il tuo profilo.</p>
  <p>Per partecipare alle uscite ufficiali è obbligatorio essere in regola con la copertura assicurativa.
  Contatta la segreteria per regolarizzare la tua posizione.</p>
  <p style="margin-top:32px;color:#666;font-size:12px">
    I Muli Stracchi ASD — segreteria@muliastracchi.it
  </p>
</body></html>`,
    text: (data) => `Ciao ${data.name},\n\nNon risulta nessuna assicurazione registrata per il tuo profilo.\nContatta la segreteria per regolarizzare la tua posizione.\n\nI Muli Stracchi ASD`,
  },

  insurance_expiring: {
    subject: (data) => `[I Muli Stracchi] Assicurazione in scadenza tra ${data.days} giorni`,
    html: (data) => `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Assicurazione in scadenza</title></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <div style="background:#fef9e7;border-left:4px solid #e67e22;padding:16px;margin-bottom:24px">
    <h2 style="margin:0;color:#e67e22">I Muli Stracchi ASD</h2>
  </div>
  <h3>Assicurazione in scadenza</h3>
  <p>Ciao <strong>${data.name}</strong>,</p>
  <p>La tua assicurazione scadrà tra <strong>${data.days} giorni</strong> (${data.expiry_date}).</p>
  <p>Ricordati di rinnovarla per continuare a partecipare alle uscite ufficiali del club.</p>
  <p style="margin-top:32px;color:#666;font-size:12px">
    I Muli Stracchi ASD — segreteria@muliastracchi.it
  </p>
</body></html>`,
    text: (data) => `Ciao ${data.name},\n\nLa tua assicurazione scadrà tra ${data.days} giorni (${data.expiry_date}).\nRinnovala prima della scadenza.\n\nI Muli Stracchi ASD`,
  },

  insurance_expired: {
    subject: (_data) => '[I Muli Stracchi] Assicurazione scaduta',
    html: (data) => `<!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><title>Assicurazione scaduta</title></head>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px">
  <div style="background:#fde8e8;border-left:4px solid #c0392b;padding:16px;margin-bottom:24px">
    <h2 style="margin:0;color:#c0392b">I Muli Stracchi ASD</h2>
  </div>
  <h3 style="color:#c0392b">Assicurazione scaduta</h3>
  <p>Ciao <strong>${data.name}</strong>,</p>
  <p>La tua assicurazione è <strong>scaduta il ${data.expiry_date}</strong>.</p>
  <p>Non puoi partecipare alle uscite ufficiali finché la posizione assicurativa non è regolare.
  Contatta la segreteria al più presto.</p>
  <p style="margin-top:32px;color:#666;font-size:12px">
    I Muli Stracchi ASD — segreteria@muliastracchi.it
  </p>
</body></html>`,
    text: (data) => `Ciao ${data.name},\n\nLa tua assicurazione è scaduta il ${data.expiry_date}.\nContatta la segreteria al più presto.\n\nI Muli Stracchi ASD`,
  },
};

module.exports = TEMPLATES;
