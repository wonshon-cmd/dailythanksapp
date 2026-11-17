import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pickProvider, tidyTranscript, transcribe } from '../server/sermons/stt.js';
import { sermonKeywords } from '../server/sermons/keywords.js';
import { loadConfig } from '../server/config.js';

test('stt: the engine follows the sermon language', () => {
  const all = { provider: 'auto', openaiKey: 'k', clovaInvokeUrl: 'u', clovaSecret: 's', rtzrClientId: 'i', rtzrClientSecret: 's' };
  assert.equal(pickProvider('ko', all), 'clova');
  assert.equal(pickProvider('en', all), 'openai');
  assert.equal(pickProvider('es', all), 'openai');
  assert.equal(pickProvider('ko', { provider: 'auto', openaiKey: 'k', rtzrClientId: 'i', rtzrClientSecret: 's' }), 'rtzr');
  assert.equal(pickProvider('ko', { provider: 'auto', openaiKey: 'k' }), 'openai');
  assert.throws(() => pickProvider('es', { provider: 'auto', clovaInvokeUrl: 'u', clovaSecret: 's' }), e => e.code === 'stt_not_configured');
  assert.equal(pickProvider('es', { provider: 'mock' }), 'mock');
});

test('stt: config picks auto when a key exists, mock otherwise', () => {
  assert.equal(loadConfig({}).stt.provider, 'mock');
  assert.equal(loadConfig({ OPENAI_API_KEY: 'x' }).stt.provider, 'auto');
  assert.equal(loadConfig({ OPENAI_API_KEY: 'x' }).stt.openaiModel, 'gpt-4o-transcribe');
});

test('stt: sermon words in each language', () => {
  assert.ok(sermonKeywords('ko').includes('요한복음') && sermonKeywords('ko').includes('니고데모'));
  assert.ok(sermonKeywords('en').includes('John') && sermonKeywords('en').includes('Nicodemus'));
  assert.ok(sermonKeywords('es').includes('Juan') && sermonKeywords('es').includes('Nicodemo') && sermonKeywords('es').includes('Apocalipsis'));
});

test('stt: lines invented during silence are dropped once repeated', () => {
  assert.equal(tidyTranscript('말씀을 봅니다.\n감사합니다.\n감사합니다.\n감사합니다.\n아멘.'), '말씀을 봅니다.\n감사합니다.\n아멘.');
  assert.equal(tidyTranscript('Thank you. Thank you. Thank you. Let us pray.'), 'Thank you. Let us pray.');
});

test('stt: long recordings are cleaned and split into 10-minute pieces (ffmpeg)', async t => {
  try { execFileSync('ffmpeg', ['-version']); } catch { return t.skip('ffmpeg not installed'); }
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stt-'));
  const src = path.join(dir, 'long.m4a');
  execFileSync('ffmpeg', ['-loglevel', 'error', '-f', 'lavfi', '-i', 'sine=frequency=220:duration=1250', '-ac', '2', '-ar', '44100', '-c:a', 'aac', '-b:a', '32k', src]);
  const seen = [];
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, init) => { const f = init.body.get('file'); seen.push({ size: f.size, prompt: init.body.get('prompt'), lang: init.body.get('language'), model: init.body.get('model') });
    return new Response(JSON.stringify({ text: `조각 ${seen.length}` }), { status: 200, headers: { 'content-type': 'application/json' } }); };
  try {
    const out = await transcribe({ filePath: src, mimeType: 'audio/mp4', language: 'es' }, { provider: 'openai', openaiKey: 'k', openaiModel: 'gpt-4o-transcribe' });
    assert.equal(out.provider, 'openai');
    assert.equal(seen.length, 3);                       // 1250 s → 600 + 600 + 50
    assert.ok(seen.every(s => s.lang === 'es' && s.model === 'gpt-4o-transcribe'));
    assert.match(seen[0].prompt, /sermón/);
    assert.match(seen[1].prompt, /조각 1$/);           // previous piece carried over as context
    assert.equal(out.text, '조각 1\n조각 2\n조각 3');
  } finally { globalThis.fetch = realFetch; fs.rmSync(dir, { recursive: true, force: true }); }
});
