const REPO = process.env.GITHUB_REPO || 'webkyprofesional/villa-amara';
const BRANCH = process.env.GITHUB_BRANCH || 'main';
const API_BASE = `https://api.github.com/repos/${REPO}/contents`;

function headers() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error('Missing GITHUB_TOKEN environment variable');
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
    'User-Agent': 'villa-amara-admin',
  };
}

async function getFile(path) {
  const res = await fetch(`${API_BASE}/${path}?ref=${BRANCH}`, { headers: headers() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return {
    sha: data.sha,
    content: Buffer.from(data.content, 'base64').toString('utf-8'),
  };
}

async function putFile(path, contentBase64, message, sha) {
  const body = {
    message,
    content: contentBase64,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT ${path} failed: ${res.status} ${await res.text()}`);
  return res.json();
}

module.exports = { getFile, putFile };
