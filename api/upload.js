const { requireAuth } = require('./_auth');
const { getFile, putFile } = require('./_github');

function sanitizeFilename(name) {
  const parts = name.split('.');
  const ext = parts.length > 1 ? parts.pop() : 'jpg';
  const base = parts.join('.')
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';
  return `${Date.now()}-${base}.${ext.toLowerCase()}`;
}

module.exports = async (req, res) => {
  if (!requireAuth(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { filename, dataBase64 } = req.body || {};
    if (!filename || !dataBase64) {
      res.status(400).json({ error: 'Missing filename or dataBase64' });
      return;
    }

    const safeName = sanitizeFilename(filename);
    const path = `assets/uploads/${safeName}`;
    const existing = await getFile(path);

    await putFile(path, dataBase64, `Upload image via admin panel: ${safeName}`, existing ? existing.sha : undefined);
    res.status(200).json({ ok: true, path });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
