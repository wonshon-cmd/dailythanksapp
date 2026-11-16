/* Daily Thanks — full-stack add-on, loaded only when the app is served by fullstack/server.
   1) Syncs the app's records to the server (/api/state) instead of living only in this browser.
   2) Adds feature-flagged sections to "내 감사 / My Thanks". With the flags off (default) nothing is shown. */
(() => {
  'use strict';
  const DT = window.DailyThanks;
  if (!DT) return;

  const USER = 'demo'; // TODO(auth): replace with the signed-in user's session
  const api = async (method, url, body, headers = {}) => {
    const res = await fetch(url, {
      method, headers: { 'x-user-id': USER, ...(body && !(body instanceof Blob) ? { 'Content-Type': 'application/json' } : {}), ...headers },
      body: body instanceof Blob ? body : body ? JSON.stringify(body) : undefined
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw Object.assign(new Error(data.error || res.statusText), { code: data.error, status: res.status });
    return data;
  };

  const S = {
    ko: {
      passageTitle: '오늘의 본문', passageHint: '오늘 묵상할 본문 범위를 직접 적거나, 소그룹 리더가 정한 본문을 확인해요.',
      passagePh: '예: 요한복음 3:1~15', add: '추가', show: '본문 보기', remove: '삭제', translation: '번역본',
      licenseRequired: '이 번역본은 사용 허가가 필요해요.', notInstalled: '이 번역본의 본문 데이터가 아직 없어요.', badRef: '본문 범위를 알아보지 못했어요. 예: 요 3:16',
      none: '아직 오늘의 본문이 없어요.', disclaimer: '본문 범위는 사용자가 입력합니다. 특정 출판사의 본문 일정·해설은 제공하지 않습니다.',
      sermonTitle: '설교 노트', sermonHint: '설교 녹음 파일이나 받아쓴 글을 올리면 요약 노트를 만들어요. 요약은 나만 볼 수 있어요.',
      upload: '녹음 파일 올리기', paste: '받아쓴 글로 요약', titleField: '설교 제목 (선택)', preacher: '설교자 (선택)', transcript: '설교 내용',
      summarize: '요약 만들기', processing: '요약하는 중…', failed: '요약하지 못했어요', open: '노트 보기',
      main: '핵심 메시지', points: '말씀 요점', apply: '삶의 적용', prayer: '기도 제목', questions: '나눔 질문', passages: '본문',
      status: { queued: '대기 중', transcribing: '받아쓰는 중', summarizing: '요약하는 중', done: '완료', error: '실패' }
    },
    en: {
      passageTitle: 'Today’s passage', passageHint: 'Type the passage you’re reading today, or see the one your group leader set.',
      passagePh: 'e.g. John 3:1–15', add: 'Add', show: 'Read', remove: 'Remove', translation: 'Translation',
      licenseRequired: 'This translation needs a licence.', notInstalled: 'Text for this translation isn’t installed yet.', badRef: 'Couldn’t read that reference. e.g. John 3:16',
      none: 'No passage for today yet.', disclaimer: 'Passages are entered by users. No publisher’s reading plan or commentary is provided.',
      sermonTitle: 'Sermon notes', sermonHint: 'Upload a recording or a transcript to get summary notes. Only you can see them.',
      upload: 'Upload recording', paste: 'Summarise a transcript', titleField: 'Sermon title (optional)', preacher: 'Preacher (optional)', transcript: 'Sermon text',
      summarize: 'Create summary', processing: 'Summarising…', failed: 'Couldn’t summarise', open: 'Open notes',
      main: 'Main message', points: 'Points', apply: 'Application', prayer: 'Prayer', questions: 'Discussion', passages: 'Passages',
      status: { queued: 'Queued', transcribing: 'Transcribing', summarizing: 'Summarising', done: 'Done', error: 'Failed' }
    }
  };
  const s = k => (S[DT.lang()] || S.ko)[k];
  const esc = DT.esc;
  const today = () => new Date().toLocaleDateString('en-CA');
  let features = { passage: false, sermon: false };

  /* ---------- 1) server sync ---------- */
  let syncTimer;
  document.addEventListener('dt:save', e => {
    clearTimeout(syncTimer);
    syncTimer = setTimeout(() => api('PUT', '/api/state', { state: e.detail }).catch(() => DT.toast('Server sync failed')), 400);
  });

  // Appeals ("wrongly flagged") go to the moderator review queue. On boot, decisions are applied to the post.
  document.addEventListener('dt:review', e => { api('POST', '/api/reviews', e.detail).catch(() => {}); });
  async function applyReviewDecisions() {
    const { reviews } = await api('GET', '/api/reviews');
    const data = DT.getData(); let changed = false;
    for (const r of reviews) {
      const p = data.posts.find(x => x.id === r.postId);
      if (!p || p.status !== 'review' || r.status === 'pending') continue;
      if (r.status === 'approved') delete p.status; else p.status = 'rejected';
      changed = true;
    }
    if (changed) DT.replaceData(data);
  }

  // Account deletion removes server data too.
  document.addEventListener('dt:delete-account', () => { api('DELETE', '/api/account').catch(() => {}); });

  // Reports go to the server's moderation queue.
  document.addEventListener('dt:report', e => { const { postId, author, reason, note } = e.detail; api('POST', '/api/reports', { postId, author, reason, note }).catch(() => {}); });

  // After sign-in, attach what the guest wrote before signing in to the account.
  document.addEventListener('dt:session', e => { if (e.detail) api('PUT', '/api/state', { state: DT.getData() }).catch(() => {}); });

  async function boot() {
    try {
      const [{ features: f }, { state }] = await Promise.all([api('GET', '/api/config'), api('GET', '/api/state')]);
      features = f;
      if (state) DT.replaceData(state); else await api('PUT', '/api/state', { state: DT.getData() });
      await applyReviewDecisions().catch(() => {});
      DT.render();
    } catch { /* server unreachable: the app keeps working on local data */ }
  }

  /* ---------- 2) hidden features ---------- */
  document.addEventListener('dt:render', e => {
    if (e.detail.tab !== 'journal') return;
    const slot = document.getElementById('slot-journal');
    if (!slot) return;
    slot.innerHTML = (features.passage ? '<div id="fs-passage"></div>' : '') + (features.sermon ? '<div id="fs-sermon"></div>' : '');
    if (features.passage) renderPassage();
    if (features.sermon) renderSermons();
  });

  async function renderPassage() {
    const box = document.getElementById('fs-passage'); if (!box) return;
    const [{ passages }, { translations }] = await Promise.all([api('GET', `/api/passages?date=${today()}`), api('GET', '/api/bible/translations')]);
    const lang = DT.lang();
    const options = translations.filter(t => t.lang === lang).concat(translations.filter(t => t.lang !== lang))
      .map(t => `<option value="${esc(t.id)}" ${t.available ? '' : 'disabled'}>${esc(t.name)}${t.available ? '' : ' 🔒'}</option>`).join('');
    box.innerHTML = `<section class="panel">
      <h3>${s('passageTitle')}</h3><p>${s('passageHint')}</p>
      ${passages.length ? passages.map(p => `<div class="row" style="margin:10px 0"><span>${esc(p.label[lang] || p.label.ko)}${p.source === 'leader' ? ' · 리더' : ''}</span>
        <span class="btn-row"><button class="secondary" data-fs="read" data-ref="${esc(p.label.en)}">${s('show')}</button><button class="secondary" data-fs="del" data-id="${esc(p.id)}">${s('remove')}</button></span></div>`).join('') : `<p>${s('none')}</p>`}
      <form id="fs-passage-form" class="btn-row" style="margin-top:10px"><input id="fs-ref" class="field" style="flex:1;min-width:160px" placeholder="${esc(s('passagePh'))}" required><button class="primary" type="submit">${s('add')}</button></form>
      <label class="field-label" for="fs-translation">${s('translation')}</label><select id="fs-translation">${options}</select>
      <p class="fine-print">${s('disclaimer')}</p></section>`;
    box.querySelector('#fs-passage-form').addEventListener('submit', async e => {
      e.preventDefault();
      try { await api('POST', '/api/passages', { reference: box.querySelector('#fs-ref').value, date: today() }); renderPassage(); }
      catch { DT.toast(s('badRef')); }
    });
  }

  async function readPassage(ref) {
    const tr = document.getElementById('fs-translation')?.value || (DT.lang() === 'en' ? 'web' : 'krv');
    try {
      const r = await api('GET', `/api/bible/passage?ref=${encodeURIComponent(ref)}&translation=${tr}&lang=${DT.lang()}`);
      DT.showSheet({ title: esc(r.label), body: `<p class="muted">${esc(r.translation.name)}</p>${r.verses.map(v => `<p style="font-size:17px;font-weight:300;line-height:1.85"><sup class="muted">${v.verse}</sup> ${esc(v.text)}</p>`).join('')}` });
    } catch (err) {
      DT.toast(err.code === 'license_required' ? s('licenseRequired') : s('notInstalled'));
    }
  }

  async function renderSermons() {
    const box = document.getElementById('fs-sermon'); if (!box) return;
    const { sermons } = await api('GET', '/api/sermons');
    box.innerHTML = `<section class="panel"><h3>${s('sermonTitle')}</h3><p>${s('sermonHint')}</p>
      ${sermons.map(x => `<div class="row" style="margin:10px 0"><span>${esc(x.summary?.title || x.title || '—')} <span class="muted">· ${esc(s('status')[x.status] || x.status)}</span></span>
        ${x.status === 'done' ? `<button class="secondary" data-fs="sermon" data-id="${esc(x.id)}">${s('open')}</button>` : ''}</div>`).join('')}
      <div class="btn-row" style="margin-top:10px"><label class="secondary" style="cursor:pointer">${s('upload')}<input id="fs-audio" type="file" accept="audio/*" hidden></label>
      <button class="secondary" data-fs="paste">${s('paste')}</button></div></section>`;
    box.querySelector('#fs-audio').addEventListener('change', async e => {
      const file = e.target.files[0]; if (!file) return;
      await api('POST', `/api/sermons/audio?title=${encodeURIComponent(file.name)}`, file, { 'Content-Type': file.type || 'audio/mpeg' });
      DT.toast(s('processing')); poll();
    });
    if (sermons.some(x => !['done', 'error'].includes(x.status))) poll();
  }

  let pollTimer;
  function poll() { clearTimeout(pollTimer); pollTimer = setTimeout(() => renderSermons(), 3000); }

  function pasteSheet() {
    DT.showSheet({ title: s('paste'), body: `<form id="fs-paste-form">
      <label class="field-label" for="fs-title">${s('titleField')}</label><input id="fs-title" class="field" maxlength="120">
      <label class="field-label" for="fs-preacher">${s('preacher')}</label><input id="fs-preacher" class="field" maxlength="60">
      <label class="field-label" for="fs-transcript">${s('transcript')}</label><textarea id="fs-transcript" required></textarea>
      <button class="primary block" type="submit" style="margin-top:14px">${s('summarize')}</button></form>` });
    document.getElementById('fs-paste-form').addEventListener('submit', async e => {
      e.preventDefault();
      try {
        await api('POST', '/api/sermons/text', { title: fsVal('fs-title'), preacher: fsVal('fs-preacher'), transcript: fsVal('fs-transcript') });
        DT.close(); DT.toast(s('processing')); renderSermons();
      } catch { DT.toast(s('failed')); }
    });
  }
  const fsVal = id => document.getElementById(id).value;

  async function openSermon(id) {
    const { sermon } = await api('GET', `/api/sermons/${id}`);
    const m = sermon.summary;
    const list = items => `<ul style="padding-left:18px;line-height:1.8">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
    DT.showSheet({ title: esc(m.title), body: `
      ${m.passages.length ? `<p class="muted">${s('passages')} · ${esc(m.passages.join(', '))}</p>` : ''}
      <div class="panel panel-muted"><h3>${s('main')}</h3><p style="color:var(--ink)">${esc(m.main_message)}</p></div>
      <h3>${s('points')}</h3>${m.points.map((p, i) => `<p><strong>${i + 1}. ${esc(p.heading)}</strong><br>${esc(p.detail)}</p>`).join('')}
      <h3>${s('apply')}</h3>${list(m.application)}<h3>${s('prayer')}</h3>${list(m.prayer_topics)}<h3>${s('questions')}</h3>${list(m.discussion_questions)}` });
  }

  document.addEventListener('click', e => {
    const b = e.target.closest('[data-fs]'); if (!b) return;
    const act = b.dataset.fs;
    if (act === 'read') readPassage(b.dataset.ref);
    else if (act === 'del') api('DELETE', `/api/passages/${b.dataset.id}`).then(renderPassage);
    else if (act === 'paste') pasteSheet();
    else if (act === 'sermon') openSermon(b.dataset.id);
  });

  boot();
})();
