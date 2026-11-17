import fs from 'node:fs';
import path from 'node:path';

/**
 * Tiny JSON-file store so the sample runs with zero setup.
 * Swap for Postgres/Supabase/Firestore in production (tables listed in docs/PRODUCT_BRIEF_KO.md §6):
 * the route handlers only call the methods below.
 */
export function createStore(file) {
  const empty = { states: {}, passages: [], sermons: [], reports: [], reviews: [], groups: [], nudges: [], plans: {} };
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
    deleteSermon: (id, userId) => { const before = db.sermons.length; db.sermons = db.sermons.filter(s => !(s.id === id && s.ownerId === userId)); persist(); return db.sermons.length < before; },
    countSermons: (userId, since) => db.sermons.filter(s => s.ownerId === userId && (!since || s.createdAt >= since)).length,
    // Subscription per user: { plan: 'monthly' | 'yearly', until: ISO date, source }
    getPlan: userId => { const p = db.plans[userId]; return p && p.until > new Date().toISOString() ? p : null; },
    setPlan: (userId, plan) => { db.plans[userId] = plan; persist(); return plan; },
    addReport: r => { db.reports.push(r); persist(); return r; },
    listReports: ({ status } = {}) => db.reports.filter(r => !status || r.status === status),
    updateReport: (id, patch) => { const r = db.reports.find(x => x.id === id); if (r) { Object.assign(r, patch); persist(); } return r; },
    addReview: r => { db.reviews.push(r); persist(); return r; },
    listReviews: ({ status, userId } = {}) => db.reviews.filter(r => (!status || r.status === status) && (!userId || r.userId === userId)),
    updateReview: (id, patch) => { const r = db.reviews.find(x => x.id === id); if (r) { Object.assign(r, patch); persist(); } return r; },
    // Groups and invite codes: anyone with the code can join (the code is the invitation).
    addNudge: n => { db.nudges.push(n); persist(); return n; },
    addGroup: g => { db.groups.push(g); persist(); return g; },
    groupByCode: code => db.groups.find(g => g.inviteCode === code) || null,
    listGroups: userId => db.groups.filter(g => g.members.includes(userId)),
    joinGroup: (code, userId) => {
      const g = db.groups.find(x => x.inviteCode === code); if (!g) return null;
      if (!g.members.includes(userId)) { g.members.push(userId); persist(); }
      return g;
    },
    deleteUser: userId => {
      db.groups.forEach(g => { g.members = g.members.filter(m => m !== userId); });
      delete db.states[userId];
      db.passages = db.passages.filter(p => p.createdBy !== userId);
      db.sermons = db.sermons.filter(x => x.ownerId !== userId);
      delete db.plans[userId];
      db.reviews = db.reviews.filter(x => x.userId !== userId);
      db.reports = db.reports.map(r => r.reporter === userId ? { ...r, reporter: 'deleted' } : r);
      persist();
    },
    flush: () => new Promise(r => setTimeout(r, 80))
  };
}
