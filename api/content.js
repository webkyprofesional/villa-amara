const { requireAuth } = require('./_auth');
const { getFile, putFile } = require('./_github');

const PATH = 'data/content.json';

module.exports = async (req, res) => {
  if (!requireAuth(req, res)) return;

  try {
    if (req.method === 'GET') {
      const file = await getFile(PATH);
      if (!file) {
        res.status(404).json({ error: 'content.json not found' });
        return;
      }
      res.status(200).json({ content: JSON.parse(file.content) });
      return;
    }

    if (req.method === 'POST') {
      const { content } = req.body || {};
      if (!content) {
        res.status(400).json({ error: 'Missing content' });
        return;
      }
      const current = await getFile(PATH);
      const json = JSON.stringify(content, null, 2) + '\n';
      const contentBase64 = Buffer.from(json, 'utf-8').toString('base64');
      await putFile(PATH, contentBase64, 'Update content via admin panel', current ? current.sha : undefined);
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
