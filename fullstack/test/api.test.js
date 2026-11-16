import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadConfig } from '../server/config.js';
import { createStore } from '../server/store.js';
import { createApp } from '../server/app.js';
import { MOCK_TRANSCRIPT } from '../server/sermons/stt.js';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dt-'));
const servers = [];
async function start(env) {
  const config = loadConfig({ ...env, DATA_FILE: path.join(tmp, `${servers.length}.json`), UPLOAD_DIR: path.join(tmp, 'up') });
  const store = createStore(config.dataFile);
  // Stub summariser: tests never call the Claude API.
  const summarize = async ({ transcript }) => ({ summary: { title: '거듭남', passages: ['요한복음 3:1~15'], main_message: transcript.slice(0, 20), points: [], application: [], prayer_topics: [], discussion_questions: [] }, references: [], model: 'stub' });
  const server = http.createServer(createApp({ config, store, summarize }));
  await new Promise(r => server.listen(0, r));
  servers.push(server);
  const base = `http://127.0.0.1:${server.address().port}`;
  return async (method, url, body, headers = {}) => {
    const res = await fetch(base + url, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: body && typeof body !== 'string' && !(body instanceof Uint8Array) ? JSON.stringify(body) : body });
    const type = res.headers.get('content-type') || '';
    return { status: res.status, body: type.includes('json') ? await res.json() : await res.text() };
  };
}
after(() => { servers.forEach(s => s.close()); fs.rmSync(tmp, { recursive: true, force: true }); });

test('features are hidden by default', async () => {
  const call = await start({});
  assert.deepEqual((await call('GET', '/api/config')).body.features, { passage: false, sermon: false, moderation: false });
  assert.equal((await call('GET', '/api/passages')).status, 404);
  assert.equal((await call('POST', '/api/sermons/text', { transcript: MOCK_TRANSCRIPT })).status, 404);
  const html = (await call('GET', '/')).body;
  assert.match(html, /fullstack\/client\.js/);
  assert.equal((await call('GET', '/../README.md')).status, 404);
});

test('state sync is per user', async () => {
  const call = await start({});
  assert.equal((await call('PUT', '/api/state', { state: { posts: [{ id: 'a' }] } }, { 'x-user-id': 'u1' })).status, 200);
  assert.deepEqual((await call('GET', '/api/state', null, { 'x-user-id': 'u1' })).body.state.posts, [{ id: 'a' }]);
  assert.equal((await call('GET', '/api/state', null, { 'x-user-id': 'u2' })).body.state, null);
  assert.equal((await call('PUT', '/api/state', { state: {} })).status, 400);
});

test('passages: user-entered references with licence checks', async () => {
  const call = await start({ FEATURE_PASSAGE: '1' });
  const add = await call('POST', '/api/passages', { reference: '요 3:1-15', date: '2026-11-16' });
  assert.equal(add.status, 200);
  assert.equal(add.body.label.ko, '요한복음 3:1~15');
  assert.equal((await call('GET', '/api/passages?date=2026-11-16')).body.passages.length, 1);
  assert.equal((await call('POST', '/api/passages', { reference: 'nonsense' })).status, 422);
  const text = await call('GET', '/api/bible/passage?ref=' + encodeURIComponent('John 3:16') + '&translation=web');
  assert.match(text.body.verses[0].text, /God so loved/);
  assert.equal((await call('GET', '/api/bible/passage?ref=John%203:16&translation=niv')).status, 403);
});

test('sermons: transcript -> summary, private by default', async () => {
  const call = await start({ FEATURE_SERMON: '1' });
  const created = await call('POST', '/api/sermons/text', { transcript: MOCK_TRANSCRIPT, title: '주일 설교' });
  assert.equal(created.status, 202);
  let sermon;
  for (let i = 0; i < 20; i++) {
    sermon = (await call('GET', `/api/sermons/${created.body.id}`)).body.sermon;
    if (sermon.status === 'done') break;
    await new Promise(r => setTimeout(r, 20));
  }
  assert.equal(sermon.status, 'done');
  assert.equal(sermon.summary.title, '거듭남');
  assert.equal((await call('GET', `/api/sermons/${created.body.id}`, null, { 'x-user-id': 'other' })).status, 404);
  assert.equal((await call('PATCH', `/api/sermons/${created.body.id}/visibility`, { visibility: 'group' })).status, 409);
  assert.equal((await call('POST', '/api/sermons/audio', 'abc', { 'Content-Type': 'text/plain' })).status, 415);
});

test('sermons: audio upload goes through STT (mock provider)', async () => {
  const call = await start({ FEATURE_SERMON: '1', STT_PROVIDER: 'mock' });
  const up = await call('POST', '/api/sermons/audio?title=test', new Uint8Array([1, 2, 3]), { 'Content-Type': 'audio/mpeg' });
  assert.equal(up.status, 202);
  let sermon;
  for (let i = 0; i < 20; i++) {
    sermon = (await call('GET', `/api/sermons/${up.body.id}`)).body.sermon;
    if (sermon.status === 'done') break;
    await new Promise(r => setTimeout(r, 20));
  }
  assert.equal(sermon.status, 'done');
  assert.match(sermon.transcript, /니고데모/);
});

test('reports: queued, self-harm first, moderation API hidden by default', async () => {
  const call = await start({ FEATURE_MODERATION: '1' });
  assert.equal((await call('POST', '/api/reports', { postId: 'pub1', reason: 'nonsense' })).status, 422);
  assert.equal((await call('POST', '/api/reports', { postId: 'pub1', reason: 'spam', author: '서연' })).status, 200);
  assert.equal((await call('POST', '/api/reports', { postId: 'pub3', reason: 'selfharm' })).status, 200);
  const queue = (await call('GET', '/api/moderation/reports')).body.reports;
  assert.deepEqual(queue.map(r => r.reason), ['selfharm', 'spam']);
  assert.equal((await call('PATCH', `/api/moderation/reports/${queue[0].id}`, { status: 'actioned' })).status, 200);
  assert.equal((await call('GET', '/api/moderation/reports')).body.reports.length, 1);
  const off = await start({});
  assert.equal((await off('GET', '/api/moderation/reports')).status, 404);
  assert.equal((await off('POST', '/api/reports', { postId: 'x', reason: 'spam' })).status, 200);
});
