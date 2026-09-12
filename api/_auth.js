const crypto = require('crypto');

const COOKIE_NAME = 'va_session';
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function sign(value) {
  const secret = process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || '';
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function createSessionCookie() {
  const expiry = Date.now() + SESSION_TTL_MS;
  const token = `${expiry}.${sign(String(expiry))}`;
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;
}

function clearSessionCookie() {
  return `${COOKIE_NAME}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  return Object.fromEntries(
    header.split(';').filter(Boolean).map(pair => {
      const idx = pair.indexOf('=');
      return [pair.slice(0, idx).trim(), decodeURIComponent(pair.slice(idx + 1).trim())];
    })
  );
}

function isAuthenticated(req) {
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME];
  if (!token || !token.includes('.')) return false;

  const [expiryStr, sig] = token.split('.');
  const expiry = Number(expiryStr);
  if (!expiry || Date.now() > expiry) return false;

  const expected = sign(expiryStr);
  const a = Buffer.from(sig || '');
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function requireAuth(req, res) {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

module.exports = { createSessionCookie, clearSessionCookie, isAuthenticated, requireAuth };
