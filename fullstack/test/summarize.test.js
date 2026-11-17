import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarizeSermon, SUMMARY_SCHEMA } from '../server/sermons/summarize.js';

test('summary: the chosen passage goes to Claude, and verse checks come back', async () => {
  let req;
  const out = { title: '거듭남', passages: ['요한복음 3:1-15'], main_message: 'm', points: [], application: [], prayer_topics: [], discussion_questions: [],
    verse_checks: [{ reference: '요한복음 3:6', quoted: '바람이 임의로 불매', status: 'unsure', note: '3:8일 수 있어요' }] };
  const client = { beta: { messages: { create: async r => { req = r; return { stop_reason: 'end_turn', model: 'claude-opus-5-5', content: [{ type: 'text', text: JSON.stringify(out) }] }; } } } };
  const r = await summarizeSermon({ transcript: '요한복음 삼 장 일 절', title: 't', preacher: '김요한', church: '새생명교회', passage: '요한복음 3:1-15', passageText: '3:1 그런데 바리새인 중에 니고데모라' }, client);
  const msg = req.messages[0].content;
  assert.match(msg, /<passage ref="요한복음 3:1-15">/);
  assert.match(msg, /니고데모라/);
  assert.match(msg, /Church: 새생명교회/);
  assert.match(req.system, /verse_checks/);
  assert.ok(SUMMARY_SCHEMA.required.includes('verse_checks'));
  assert.deepEqual(SUMMARY_SCHEMA.properties.verse_checks.items.properties.status.enum, ['match', 'paraphrase', 'unsure']);
  assert.equal(r.summary.verse_checks[0].status, 'unsure');
});
