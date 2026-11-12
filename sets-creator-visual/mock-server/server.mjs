// Makieta serwera sets-creator (mojzestaw.subtelnedetale.pl) do pracy bez dostępu do jego repozytorium.
// Bez zależności: tylko Node.js. Stan trzymany w pamięci, osobno dla każdej sesji (cookie).
//
//   GET    /api/goals                      lista celów
//   GET    /api/goals/:id                  dane strony zestawu
//   PATCH  /api/goals/:id/slots/:slotId    { product_id, quantity }
//   DELETE /api/goals/:id/slots/:slotId
//   POST   /api/goals/:id/cart             { replace_cart, confirm_incomplete }
//
// W prawdziwej aplikacji te same ścieżki istnieją bez prefiksu /api i odpowiadają przez Inertia.

import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findSlot, goalCard, pageState, validateSelection } from './state.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 8080;
const { goals, limits } = JSON.parse(await readFile(join(ROOT, 'mock-server/data/goals.json'), 'utf8'));

const sessions = new Map(); // sessionId → { [goalId]: { selection, sentAt } }
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json' };

function sessionFor(req, res, goalId) {
  let id = /(?:^|;\s*)mock_session=([\w-]+)/.exec(req.headers.cookie ?? '')?.[1];
  if (!id || !sessions.has(id)) {
    id = randomUUID();
    sessions.set(id, {});
    res.setHeader('Set-Cookie', `mock_session=${id}; Path=/; HttpOnly; SameSite=Lax`);
  }
  const store = sessions.get(id);
  store[goalId] ??= { selection: {}, sentAt: null };
  return store[goalId];
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 10_000) throw new Error('too large');
  }
  return raw ? JSON.parse(raw) : {};
}

async function api(req, res, path) {
  if (req.method === 'GET' && path === '/api/goals') return json(res, 200, { goals: goals.map(goalCard) });

  const match = /^\/api\/goals\/(\d+)(?:\/(slots\/(\d+)|cart))?$/.exec(path);
  const goal = match && goals.find((g) => g.id === Number(match[1]));
  if (!goal) return json(res, 404, { message: 'Not found' });

  const session = sessionFor(req, res, goal.id);
  const state = () => pageState(goal, session, limits);
  const [, , tail, slotId] = match;

  if (!tail && req.method === 'GET') return json(res, 200, { goal, ...state() });

  let body;
  try {
    body = req.method === 'DELETE' ? {} : await readJson(req);
  } catch {
    return json(res, 400, { message: 'Nieprawidłowe dane.' });
  }

  if (slotId && req.method === 'PATCH') {
    const result = validateSelection(goal, slotId, body, limits);
    if (!result.ok) return json(res, result.status, { message: 'Dane są nieprawidłowe.', errors: result.errors });
    session.selection[slotId] = result.value;
    return json(res, 200, state());
  }

  if (slotId && req.method === 'DELETE') {
    if (!findSlot(goal, slotId)) return json(res, 404, { message: 'Not found' });
    delete session.selection[slotId];
    return json(res, 200, state());
  }

  if (tail === 'cart' && req.method === 'POST') {
    const current = state();
    if (current.verdict.filledSlots === 0)
      return json(res, 422, { message: 'Zestaw jest pusty.', errors: { cart: ['Najpierw wybierz produkty.'] } });
    if (!current.verdict.complete && body.confirm_incomplete !== true)
      return json(res, 422, { message: 'Zestaw jest niekompletny.', errors: { cart: ['Potwierdź dodanie niekompletnego zestawu.'] } });
    session.sentAt = new Date().toISOString();
    // Prawdziwa aplikacja przekierowuje tu do koszyka WooCommerce przez wtyczkę „Sets Creator Cart”
    return json(res, 200, { ...state(), mock: { replaceCart: body.replace_cart === true, redirectTo: 'https://subtelnedetale.pl/koszyk/' } });
  }

  return json(res, 405, { message: 'Method not allowed' });
}

async function serveStatic(res, path) {
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, '');
  const file = join(DIST, safe === '/' ? 'index.html' : safe);
  try {
    const data = await readFile(file.startsWith(DIST) ? file : join(DIST, 'index.html'));
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    try {
      res.writeHead(200, { 'Content-Type': MIME['.html'] });
      res.end(await readFile(join(DIST, 'index.html')));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Brak zbudowanego interfejsu. Uruchom "npm run build" albo użyj "npm run dev".');
    }
  }
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, 'http://localhost');
  try {
    if (pathname.startsWith('/api/')) await api(req, res, pathname);
    else await serveStatic(res, pathname);
  } catch (err) {
    console.error(err);
    json(res, 500, { message: 'Błąd serwera makiety.' });
  }
}).listen(PORT, () => console.log(`Makieta sets-creator: http://localhost:${PORT}`));
