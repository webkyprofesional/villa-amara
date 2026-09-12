const crypto = require('crypto');
const { createSessionCookie } = require('./_auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD || '';
  const { password } = req.body || {};

  if (!adminPassword || !password) {
    res.status(400).json({ error: 'Missing password' });
    return;
  }

  const a = Buffer.from(String(password));
  const b = Buffer.from(adminPassword);
  const match = a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!match) {
    res.status(401).json({ error: 'Nesprávne heslo' });
    return;
  }

  res.setHeader('Set-Cookie', createSessionCookie());
  res.status(200).json({ ok: true });
};
