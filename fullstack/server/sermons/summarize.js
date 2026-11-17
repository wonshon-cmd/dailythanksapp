import Anthropic from '@anthropic-ai/sdk';
import { findSpokenReferences } from '../bible/spoken.js';

const MODEL = 'claude-opus-5-5';

// Fixed sermon-note layout. Structured outputs guarantee the response matches this schema.
export const SUMMARY_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['title', 'passages', 'main_message', 'points', 'application', 'prayer_topics', 'discussion_questions'],
  properties: {
    title: { type: 'string', description: 'Sermon title as stated, or a short descriptive title if none was given' },
    passages: { type: 'array', items: { type: 'string' }, description: 'Bible passages preached on, e.g. "요한복음 3:1~15"' },
    main_message: { type: 'string', description: 'The core message in one sentence' },
    points: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['heading', 'detail'],
        properties: { heading: { type: 'string' }, detail: { type: 'string' } }
      }
    },
    application: { type: 'array', items: { type: 'string' } },
    prayer_topics: { type: 'array', items: { type: 'string' } },
    discussion_questions: { type: 'array', items: { type: 'string' } }
  }
};

const SYSTEM = `You turn a sermon transcript into personal sermon notes for the listener.
Write in the language the sermon was preached in (usually Korean).
Stay faithful to what the preacher actually said: do not add theology, illustrations or Bible verses that are not in the transcript.
The transcript comes from speech recognition, so names and verse numbers can be misheard; where the provided normalised references disagree with the transcript, prefer the normalised ones.
- points: the sermon's main points in the preacher's order (usually 2-4), each with a short heading and a 1-3 sentence explanation.
- application: concrete ways to live this out this week, drawn from the sermon.
- prayer_topics: short prayer points that follow from the sermon.
- discussion_questions: 2-3 open questions a small group could discuss.`;

/**
 * Summarise a transcript into structured sermon notes.
 * Returns { summary, references, model } or throws (err.code === 'refused' when Claude declines).
 */
export async function summarizeSermon({ transcript, title, preacher, context: about }, client = new Anthropic()) {
  const references = findSpokenReferences(transcript);
  const context = [
    title ? `Title given by the listener: ${title}` : null,
    preacher ? `Preacher: ${preacher}` : null,
    about ? `What the listener said about this sermon (church, passage, topic): ${about}` : null,
    references.length ? `Bible references detected in the transcript (normalised): ${[...new Set(references.map(r => r.label))].join(', ')}` : null
  ].filter(Boolean).join('\n');

  const response = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default', // if a safety classifier declines, the API retries on Anthropic's recommended model
    system: SYSTEM,
    output_config: { effort: 'medium', format: { type: 'json_schema', schema: SUMMARY_SCHEMA } },
    messages: [{ role: 'user', content: `${context}\n\n<transcript>\n${transcript}\n</transcript>` }]
  });

  if (response.stop_reason === 'refusal') {
    const err = new Error('The model declined to summarise this transcript.');
    err.code = 'refused';
    err.details = response.stop_details ?? null;
    throw err;
  }
  if (response.stop_reason === 'max_tokens') {
    const err = new Error('The summary was cut off before it finished.');
    err.code = 'truncated';
    throw err;
  }
  const text = response.content.filter(b => b.type === 'text').map(b => b.text).join('');
  return { summary: JSON.parse(text), references, model: response.model };
}
