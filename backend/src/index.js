'use strict';
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const cron     = require('node-cron');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/members',       require('./routes/members'));
app.use('/api/events',        require('./routes/events'));
app.use('/api/rides',         require('./routes/rides'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/admin',         require('./routes/admin'));

const { router: cronRouter, runReminders } = require('./routes/cron');
app.use('/api/cron', cronRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// Cron giornaliero alle 09:00 (solo in production)
if (process.env.NODE_ENV === 'production') {
  cron.schedule('0 9 * * *', async () => {
    console.log('[cron] avvio reminder giornalieri...');
    try {
      const results = await runReminders();
      const sent = results.filter(r => r.ok).length;
      console.log(`[cron] completato: ${sent}/${results.length} email inviate`);
    } catch (err) {
      console.error('[cron] errore:', err.message);
    }
  }, { timezone: 'Europe/Rome' });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Muli Stracchi backend :${PORT}`));
