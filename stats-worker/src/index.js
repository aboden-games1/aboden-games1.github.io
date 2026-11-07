// Owner-only stats for abodengames.com (owner request 2026-10-27: «لوحة تحكم ونشوف كم عدد زيارات العابنا وكم لاعب حاليا داخلها»).
// The site's app.js sends a beacon per page view and a heartbeat every minute while a page is visible; one Durable Object
// keeps the counts in SQLite. No cookies, no IP addresses, no persistent ids: a random id per browser tab (sessionStorage).
// /dashboard and /api/summary are behind HTTP Basic auth (user «aboden», password = the DASHBOARD_PASSWORD secret).
import { DurableObject } from 'cloudflare:workers';
import robloxData from '../../src/data/roblox-maps.json' with { type: 'json' };
import { dashboardHtml } from './dashboard.js';
import { ORIGINS, LIVE_WINDOW, dayOf, daysAgo, games, clean, deviceOf } from './lib.js';

export class Stats extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.sql = ctx.storage.sql;
    this.sql.exec(`CREATE TABLE IF NOT EXISTS views(day TEXT, route TEXT, views INTEGER, visits INTEGER, PRIMARY KEY(day, route));
      CREATE TABLE IF NOT EXISTS dims(day TEXT, kind TEXT, value TEXT, n INTEGER, PRIMARY KEY(day, kind, value));
      CREATE TABLE IF NOT EXISTS presence(id TEXT PRIMARY KEY, route TEXT, t INTEGER);
      CREATE TABLE IF NOT EXISTS playtime(day TEXT, route TEXT, seconds INTEGER, PRIMARY KEY(day, route));
      CREATE TABLE IF NOT EXISTS events(day TEXT, name TEXT, route TEXT, n INTEGER, PRIMARY KEY(day, name, route));
      CREATE TABLE IF NOT EXISTS peak(day TEXT PRIMARY KEY, n INTEGER);
      CREATE TABLE IF NOT EXISTS cache(k TEXT PRIMARY KEY, t INTEGER, v TEXT);`);
  }

  record(r, meta, now = Date.now()) {
    const day = dayOf(now), sec = Math.floor(now / 1000);
    if (r.t === 'v') {
      this.sql.exec('INSERT INTO views VALUES(?,?,1,?) ON CONFLICT DO UPDATE SET views=views+1, visits=visits+excluded.visits', day, r.route, r.isNew ? 1 : 0);
      const dims = [['country', meta.country || '??'], ['device', meta.device], ['lang', r.lang]];
      if (r.isNew) dims.push(['ref', r.ref || '(مباشر)']);
      for (const [k, v] of dims) this.sql.exec('INSERT INTO dims VALUES(?,?,?,1) ON CONFLICT DO UPDATE SET n=n+1', day, k, v);
    }
    if (r.t === 'e') this.sql.exec('INSERT INTO events VALUES(?,?,?,1) ON CONFLICT DO UPDATE SET n=n+1', day, r.event, r.route);
    if (r.t === 'v' || r.t === 'p') {
      const prev = this.sql.exec('SELECT route, t FROM presence WHERE id=?', r.id).toArray()[0];
      this.sql.exec('INSERT INTO presence VALUES(?,?,?) ON CONFLICT DO UPDATE SET route=excluded.route, t=excluded.t', r.id, r.route, sec);
      // Time on a play page: the gap since this tab's last signal on the same route (capped, so a sleeping tab adds nothing).
      if (r.t === 'p' && r.route.startsWith('/play/') && prev && prev.route === r.route) {
        const gap = Math.min(sec - prev.t, 90);
        if (gap > 0) this.sql.exec('INSERT INTO playtime VALUES(?,?,?) ON CONFLICT DO UPDATE SET seconds=seconds+excluded.seconds', day, r.route, gap);
      }
      const live = this.sql.exec('SELECT COUNT(*) AS n FROM presence WHERE t>?', sec - LIVE_WINDOW).one().n;
      this.sql.exec('INSERT INTO peak VALUES(?,?) ON CONFLICT DO UPDATE SET n=excluded.n WHERE excluded.n>peak.n', day, live);
      if (Math.random() < 0.02) this.sql.exec('DELETE FROM presence WHERE t<?', sec - 3600);
    }
  }

  async summary(now = Date.now()) {
    const sec = Math.floor(now / 1000), today = dayOf(now), d7 = daysAgo(now, 6), d30 = daysAgo(now, 29);
    const q = (s, ...a) => this.sql.exec(s, ...a).toArray();
    const live = q('SELECT route, COUNT(*) AS n FROM presence WHERE t>? GROUP BY route', sec - LIVE_WINDOW);
    const range = from => q('SELECT COALESCE(SUM(views),0) AS views, COALESCE(SUM(visits),0) AS visits FROM views WHERE day>=?', from)[0];
    const routes = from => Object.fromEntries(q('SELECT route, SUM(views) AS v FROM views WHERE day>=? GROUP BY route', from).map(x => [x.route, x.v]));
    const play = from => Object.fromEntries(q('SELECT route, SUM(seconds) AS s FROM playtime WHERE day>=? GROUP BY route', from).map(x => [x.route, x.s]));
    const ev = from => q('SELECT name, route, SUM(n) AS n FROM events WHERE day>=? GROUP BY name, route', from);
    const top = (kind, from, n = 8) => q('SELECT value, SUM(n) AS n FROM dims WHERE kind=? AND day>=? GROUP BY value ORDER BY n DESC LIMIT ?', kind, from, n);
    const r1 = routes(today), r7 = routes(d7), r30 = routes(d30), p1 = play(today), p7 = play(d7), p30 = play(d30), e1 = ev(today), e7 = ev(d7), e30 = ev(d30);
    const liveAt = r => live.filter(x => x.route === r).reduce((s, x) => s + x.n, 0);
    const clicks = (list, name, route) => list.filter(x => x.name === name && x.route === route).reduce((s, x) => s + x.n, 0);
    const daily = [];
    const byDay = Object.fromEntries(q('SELECT day, SUM(views) AS views, SUM(visits) AS visits FROM views WHERE day>=? GROUP BY day', d30).map(x => [x.day, x]));
    for (let i = 29; i >= 0; i--) { const d = daysAgo(now, i); daily.push({ day: d, views: byDay[d]?.views || 0, visits: byDay[d]?.visits || 0 }); }
    return {
      now,
      live: { total: live.reduce((s, x) => s + x.n, 0), playing: live.filter(x => x.route.startsWith('/play/')).reduce((s, x) => s + x.n, 0) },
      peak: { today: q('SELECT n FROM peak WHERE day=?', today)[0]?.n || 0, week: q('SELECT MAX(n) AS n FROM peak WHERE day>=?', d7)[0]?.n || 0 },
      totals: { today: range(today), week: range(d7), month: range(d30) },
      daily,
      games: games().map(g => ({
        ...g,
        liveNow: g.play ? liveAt(g.play) : 0,
        onPage: liveAt(g.page),
        pageViews: { today: r1[g.page] || 0, week: r7[g.page] || 0, month: r30[g.page] || 0 },
        // a play = a «العب الآن» press (games open in their own tab since 2026-11-07) or an old /play/ page view
        plays: g.play ? { today: (r1[g.play] || 0) + clicks(e1, 'play', g.play), week: (r7[g.play] || 0) + clicks(e7, 'play', g.play), month: (r30[g.play] || 0) + clicks(e30, 'play', g.play) } : null,
        minutes: g.play ? { today: Math.round((p1[g.play] || 0) / 60), week: Math.round((p7[g.play] || 0) / 60), month: Math.round((p30[g.play] || 0) / 60) } : null,
        storeClicks: g.platform === 'quest' ? { week: clicks(e7, 'store', g.page), month: clicks(e30, 'store', g.page) } : null,
      })),
      pages: q('SELECT route, SUM(views) AS n FROM views WHERE day>=? GROUP BY route ORDER BY n DESC LIMIT 10', d7),
      countries: top('country', d7), devices: top('device', d7), refs: top('ref', d7), langs: top('lang', d7),
      roblox: await this.roblox(now),
    };
  }

  // Roblox's public numbers for the experiences in roblox-maps.json that have a placeId; cached 5 minutes.
  async roblox(now) {
    const items = (robloxData.items || []).filter(x => x.placeId);
    if (!items.length) return [];
    const hit = this.sql.exec('SELECT t, v FROM cache WHERE k=?', 'roblox').toArray()[0];
    if (hit && now - hit.t < 300000) return JSON.parse(hit.v);
    let out;
    try {
      const universes = await Promise.all(items.map(async x => {
        const r = await fetch(`https://apis.roblox.com/universes/v1/places/${x.placeId}/universe`);
        return r.ok ? (await r.json()).universeId : null;
      }));
      const ids = universes.filter(Boolean).join(',');
      const [games, votes] = await Promise.all([`https://games.roblox.com/v1/games?universeIds=${ids}`, `https://games.roblox.com/v1/games/votes?universeIds=${ids}`].map(u => fetch(u).then(r => r.ok ? r.json() : { data: [] })));
      out = items.map((x, i) => {
        const g = games.data.find(d => d.id === universes[i]) || {}, v = votes.data.find(d => d.id === universes[i]) || {};
        return { title: x.title, titleEn: x.titleEn, image: x.image, playing: g.playing ?? null, visits: g.visits ?? null, favorites: g.favoritedCount ?? null, up: v.upVotes ?? null, down: v.downVotes ?? null };
      });
    } catch {
      return hit ? JSON.parse(hit.v) : items.map(x => ({ title: x.title, titleEn: x.titleEn, image: x.image, error: true }));
    }
    this.sql.exec('INSERT INTO cache VALUES(?,?,?) ON CONFLICT DO UPDATE SET t=excluded.t, v=excluded.v', 'roblox', now, JSON.stringify(out));
    return out;
  }
}

async function authorized(request, env) {
  if (!env.DASHBOARD_PASSWORD) return false;
  const h = request.headers.get('Authorization') || '';
  if (!h.startsWith('Basic ')) return false;
  let given;
  try { given = atob(h.slice(6)); } catch { return false; }
  const enc = new TextEncoder(), a = enc.encode(given), b = enc.encode(`aboden:${env.DASHBOARD_PASSWORD}`);
  return a.byteLength === b.byteLength && crypto.subtle.timingSafeEqual(a, b);
}

const PRIVATE = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'no-referrer' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url), stub = env.STATS.get(env.STATS.idFromName('main'));
    if (url.pathname === '/c') {
      const origin = request.headers.get('Origin') || '', allowed = env.DEV_ORIGIN ? [...ORIGINS, env.DEV_ORIGIN] : ORIGINS;
      const cors = { 'Access-Control-Allow-Origin': allowed.includes(origin) ? origin : ORIGINS[0], 'Vary': 'Origin' };
      if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Max-Age': '86400' } });
      if (request.method !== 'POST' || !allowed.includes(origin)) return new Response(null, { status: 403, headers: cors });
      const text = await request.text();
      let body;
      try { body = text.length < 1000 ? JSON.parse(text) : null; } catch { body = null; }
      const r = clean(body);
      if (!r) return new Response(null, { status: 400, headers: cors });
      await stub.record(r, { country: request.cf?.country, device: deviceOf(request.headers.get('User-Agent') || '') });
      return new Response(null, { status: 204, headers: cors });
    }
    if (url.pathname === '/dashboard' || url.pathname === '/api/summary') {
      if (!(await authorized(request, env))) return new Response('يلزم الدخول', { status: 401, headers: { ...PRIVATE, 'WWW-Authenticate': 'Basic realm="Aboden Games stats", charset="UTF-8"', 'Content-Type': 'text/plain; charset=utf-8' } });
      if (url.pathname === '/api/summary') return Response.json(await stub.summary(), { headers: PRIVATE });
      return new Response(dashboardHtml, { headers: { ...PRIVATE, 'Content-Type': 'text/html; charset=utf-8', 'Content-Security-Policy': "default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'unsafe-inline'; connect-src 'self'; img-src data: https://abodengames.com; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" } });
    }
    if (url.pathname === '/') return Response.redirect(`${url.origin}/dashboard`, 302);
    return new Response('Not found', { status: 404 });
  },
};
