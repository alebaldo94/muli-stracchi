'use strict';
const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const db     = require('../db');
const auth   = require('../middleware/auth');

const CLIENT_ID     = process.env.STRAVA_CLIENT_ID;
const CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const REDIRECT_URI  = process.env.STRAVA_REDIRECT_URI || 'https://asd.appartiene.org/api/strava/callback';

function formatDuration(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}:${String(m).padStart(2, '0')}`;
}

async function refreshTokenIfNeeded(member) {
  if (member.strava_token_expires_at * 1000 > Date.now()) {
    return member.strava_access_token;
  }
  const resp = await fetch('https://www.strava.com/oauth/token', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      client_id:     CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type:    'refresh_token',
      refresh_token: member.strava_refresh_token,
    }),
  });
  const tokens = await resp.json();
  if (tokens.errors) throw new Error('Refresh token Strava non valido — riconnetti l\'account');
  await db.query(
    `UPDATE members SET strava_access_token=$1, strava_refresh_token=$2, strava_token_expires_at=$3 WHERE id=$4`,
    [tokens.access_token, tokens.refresh_token, tokens.expires_at, member.id]
  );
  return tokens.access_token;
}

// GET /api/strava/auth-url — restituisce l'URL OAuth (richiede auth)
router.get('/auth-url', auth, (req, res) => {
  if (!CLIENT_ID) return res.status(500).json({ error: 'STRAVA_CLIENT_ID non configurato' });
  const state = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '10m' });
  const url = `https://www.strava.com/oauth/authorize`
    + `?client_id=${CLIENT_ID}`
    + `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    + `&response_type=code`
    + `&scope=activity:read_all`
    + `&approval_prompt=auto`
    + `&state=${state}`;
  res.json({ url });
});

// GET /api/strava/callback — Strava reindirizza qui dopo l'autorizzazione
router.get('/callback', async (req, res) => {
  const { code, state, error } = req.query;
  if (error) return res.redirect('/member/profilo.html?strava=denied');
  if (!code || !state) return res.redirect('/member/profilo.html?strava=error');

  let memberId;
  try {
    memberId = jwt.verify(state, process.env.JWT_SECRET).id;
  } catch {
    return res.redirect('/member/profilo.html?strava=error');
  }

  try {
    const resp = await fetch('https://www.strava.com/oauth/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        client_id:     CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await resp.json();
    if (tokens.errors) throw new Error(JSON.stringify(tokens.errors));

    await db.query(`
      UPDATE members SET
        strava_athlete_id        = $1,
        strava_access_token      = $2,
        strava_refresh_token     = $3,
        strava_token_expires_at  = $4
      WHERE id = $5
    `, [tokens.athlete.id, tokens.access_token, tokens.refresh_token, tokens.expires_at, memberId]);

    res.redirect('/member/profilo.html?strava=connected');
  } catch (err) {
    console.error('[strava] callback error:', err.message);
    res.redirect('/member/profilo.html?strava=error');
  }
});

// POST /api/strava/sync — importa le uscite da Strava
router.post('/sync', auth, async (req, res) => {
  try {
    const { rows: [member] } = await db.query(
      `SELECT id, join_date, strava_access_token, strava_refresh_token, strava_token_expires_at
       FROM members WHERE id = $1`, [req.user.id]
    );
    if (!member?.strava_access_token)
      return res.status(400).json({ error: 'Account Strava non connesso. Vai al profilo e connetti Strava.' });

    const accessToken = await refreshTokenIfNeeded(member);
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const joinDate    = member.join_date ? new Date(member.join_date) : null;
    const after       = Math.floor(Math.min(startOfYear.getTime(), (joinDate ?? startOfYear).getTime()) / 1000);

    let page = 1, imported = 0, skipped = 0;
    console.log(`[strava] sync member=${member.id} after=${after} token_ok=${!!accessToken}`);

    while (true) {
      const r = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=200&page=${page}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const activities = await r.json();
      console.log(`[strava] page=${page} isArray=${Array.isArray(activities)} count=${Array.isArray(activities) ? activities.length : 'N/A'}`);
      if (!Array.isArray(activities)) {
        console.error('[strava] risposta non valida:', JSON.stringify(activities));
        throw new Error(activities?.message || 'Risposta Strava non valida — riconnetti l\'account');
      }
      if (!activities.length) break;

      const rides = activities.filter(a => a.type === 'Ride' || a.sport_type === 'Ride');
      console.log(`[strava] rides on page=${page}: ${rides.length}/${activities.length}`);
      for (const a of activities) {
        if (a.type !== 'Ride' && a.sport_type !== 'Ride') continue;
        const km = (a.distance / 1000).toFixed(2);
        const date = a.start_date_local?.substring(0, 10) || a.start_date?.substring(0, 10);
        try {
          const { rowCount } = await db.query(`
            INSERT INTO rides (user_id, title, date, km, duration, elevation, source, strava_activity_id)
            VALUES ($1,$2,$3,$4,$5,$6,'strava',$7)
            ON CONFLICT (strava_activity_id) DO NOTHING
          `, [member.id, a.name, date, km, formatDuration(a.moving_time), Math.round(a.total_elevation_gain), a.id]);
          rowCount ? imported++ : skipped++;
        } catch (e) {
          console.error('[strava] insert error:', e.message);
          skipped++;
        }
      }

      if (activities.length < 200) break;
      page++;
    }

    // Aggiorna contatori km sul profilo
    await db.query(`
      UPDATE members SET
        km_month = (
          SELECT COALESCE(SUM(km),0) FROM rides
          WHERE user_id=$1
            AND date_trunc('month', date) = date_trunc('month', CURRENT_DATE)
        ),
        km_year = (
          SELECT COALESCE(SUM(km),0) FROM rides
          WHERE user_id=$1
            AND date_part('year', date) = date_part('year', CURRENT_DATE)
        ),
        rides_count = (SELECT COUNT(*) FROM rides WHERE user_id=$1)
      WHERE id=$1
    `, [member.id]);

    res.json({ imported, skipped });
  } catch (err) {
    console.error('[strava] sync error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/strava/status — è connesso?
router.get('/status', auth, async (req, res) => {
  const { rows: [m] } = await db.query(
    'SELECT strava_athlete_id, strava_token_expires_at FROM members WHERE id=$1', [req.user.id]
  );
  res.json({
    connected: !!m?.strava_athlete_id,
    athlete_id: m?.strava_athlete_id || null,
  });
});

// DELETE /api/strava/disconnect
router.delete('/disconnect', auth, async (req, res) => {
  await db.query(
    `UPDATE members SET strava_athlete_id=NULL, strava_access_token=NULL,
     strava_refresh_token=NULL, strava_token_expires_at=NULL WHERE id=$1`,
    [req.user.id]
  );
  res.json({ ok: true });
});

module.exports = router;
