import fs from 'node:fs';
import path from 'node:path';

/**
 * Tiny JSON-file store so the sample runs with zero setup.
 * Swap for Postgres/Supabase/Firestore in production (tables listed in docs/PRODUCT_BRIEF_KO.md §6):
 * the route handlers only call the methods below.
 */
export function createStore(file) {
  const empty = { states: {}, passages: [], sermons: [], reports: [] };
  let db = empty;
  try { db = { ...empty, ...JSON.parse(fs.readFileSync(file, 'utf8')) }; } catch { /* first run */ }
  let timer = null;
  const persist = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file + '.tmp', JSON.stringify(db, null, 2));
      fs.renameSync(file + '.tmp', file);
    }, 50);
  };
  return {
    getState: userId => db.states[userId] || null,
    putState: (userId, state) => { db.states[userId] = state; persist(); },

    addPassage: p => { db.passages.push(p); persist(); return p; },
    listPassages: ({ date, groupId, userId }) => db.passages.filter(p =>
      (!date || p.date === date) && (groupId ? p.groupId === groupId : p.createdBy === userId && !p.groupId)),
    deletePassage: (id, userId) => {
      const before = db.passages.length;
      db.passages = db.passages.filter(p => !(p.id === id && p.createdBy === userId));
      persist(); return db.passages.length < before;
    },

    addSermon: s => { db.sermons.push(s); persist(); return s; },
    updateSermon: (id, patch) => { const s = db.sermons.find(x => x.id === id); if (s) { Object.assign(s, patch); persist(); } return s; },
    getSermon: id => db.sermons.find(x => x.id === id) || null,
    listSermons: userId => db.sermons.filter(s => s.ownerId === userId).map(({ transcript, ...rest }) => rest),
    addReport: r => { db.reports.push(r); persist(); return r; },
    listReports: ({ status } = {}) => db.reports.filter(r => !status || r.status === status),
    updateReport: (id, patch) => { const r = db.reports.find(x => x.id === id); if (r) { Object.assign(r, patch); persist(); } return r; },
    flush: () => new Promise(r => setTimeout(r, 80))
  };
}
