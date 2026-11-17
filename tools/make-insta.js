// Instagram kit: profile image, 9-post launch grid (4:5), and a vertical short (Reel, 9:16 MP4).
// Usage: node tools/make-insta.js [outDir]   (default store/instagram). Needs ffmpeg for the video.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const out = path.resolve(process.argv[2] || 'store/instagram');
const FONTS = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;1,6..72,400&family=Noto+Sans+KR:wght@300;400&display=swap">';
const BASE = `*{box-sizing:border-box;margin:0}body{background:#FFFFFF;color:#303438;font-family:'Noto Sans KR',sans-serif;font-weight:300;-webkit-font-smoothing:antialiased}
.wm{font-family:Newsreader,serif;font-weight:400;letter-spacing:-.025em;line-height:1;white-space:nowrap}.wm em,.serif em{font-style:italic}.serif{font-family:Newsreader,serif}`;
const WM = 'daily <em>thanks</em>';

const T = {
  ko: {
    reads: [
      ['오늘 손주가 처음으로 "할머니 사랑해요"라고 또박또박 말해 줬어요. 평생 들은 말 중에 제일 예쁜 말이었어요.', '영숙 · 오늘의 감사'],
      ['잠깐 멈춰 보니, 집으로 돌아가는 길에도 예쁜 하늘이 있었어요.', '서연 · 오늘의 감사'],
      ['아버지와 오랜만에 둘이서 낚시를 갔어요. 고기는 못 잡았지만, 아버지의 젊은 시절 이야기를 처음 들었어요.', '태호 · 오늘의 감사'],
    ],
    q: '오늘 감사한 것은?', qsub: '댓글로 한 줄 남겨 주세요.',
    how: '하루 30초,<br>한 줄이면 충분해요.', steps: [['읽어요', '다른 사람들의 따뜻한 감사'], ['한 줄 남겨요', '오늘 감사한 것 하나'], ['나눠요', '문자 · WhatsApp · 카카오톡 · 인스타그램']],
    ch: '7일 감사 챌린지', chsub: '하루 한 줄, 일주일. 함께 시작해요.', days: ['월', '화', '수', '목', '금', '토', '일'],
    soon: '곧 만나요', soonsub: 'App Store · Google Play',
    reel: { q: '오늘 감사한 것은?', end: '곧 만나요 · App Store · Google Play' },
  },
  en: {
    reads: [
      ['Today my grandson said “Grandma, I love you” clearly for the first time. The most beautiful words I’ve ever heard.', 'Margaret · Today’s thanks'],
      ['I paused on my way home and found a lovely sky.', 'Olivia · Today’s thanks'],
      ['Went fishing with my dad for the first time in years. No fish, but he told me stories from his youth.', 'Daniel · Today’s thanks'],
    ],
    q: 'What are you thankful for today?', qsub: 'Leave one line in the comments.',
    how: 'Thirty seconds a day.<br>One line is enough.', steps: [['Read', 'warm thanks from others'], ['Write one line', 'one thing from today'], ['Share', 'text · WhatsApp · KakaoTalk · Instagram']],
    ch: '7-day gratitude challenge', chsub: 'One line a day, for one week. Start together.', days: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    soon: 'Coming soon', soonsub: 'App Store · Google Play',
    reel: { q: 'What are you thankful for today?', end: 'Coming soon · App Store · Google Play' },
  },
};

const page = (body, css = '') => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE}${css}</style></head><body>${body}</body></html>`;
const frame = (inner, css = '') => page(`<div class="f">${inner}<div class="foot serif">Give <em>thanks</em> daily.</div></div>`,
  `.f{position:relative;width:1080px;height:1350px;padding:150px 120px;display:flex;flex-direction:column;justify-content:center}
   .foot{position:absolute;left:120px;bottom:110px;font-size:34px;color:#B4B8BA}.mark{position:absolute;left:120px;top:110px;font-size:40px;color:#9BA0A3}${css}`);

function posts(t) {
  const card = ([text, by]) => frame(`<div class="mark wm">${WM}</div><p class="tx">${text}</p><p class="by">${by}</p>`,
    `.f{justify-content:flex-start;padding-top:${text.length > 70 ? 380 : 470}px}.tx{font-size:${text.length > 70 ? 56 : 62}px;line-height:1.72;letter-spacing:-.01em}.by{margin-top:44px;font-size:30px;color:#A9AEB1;font-weight:400}`);
  return [
    page(`<div class="c"><span class="wm">${WM}</span></div>`, `.c{width:1080px;height:1350px;display:grid;place-items:center}.wm{font-size:150px;color:#383D42}`),
    page(`<div class="c serif"><span>Give <em>thanks</em> daily.</span><span>Live abundantly.</span><span>Share the joy.</span></div>`,
      `.c{width:1080px;height:1350px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:22px;font-size:76px;color:#4E5459;letter-spacing:-.01em}`),
    card(t.reads[0]),
    frame(`<div class="mark wm">${WM}</div><p class="q">${t.q}</p><p class="qs">${t.qsub}</p><div class="line"></div>`,
      `.q{font-size:84px;line-height:1.3;color:#303438;letter-spacing:-.02em;font-weight:300}.qs{margin-top:36px;font-size:36px;color:#9BA0A3}.line{margin-top:80px;height:2px;width:100%;background:#EEEEEE}`),
    card(t.reads[1]),
    frame(`<div class="mark wm">${WM}</div><h2>${t.how}</h2><div class="st">${t.steps.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('')}</div>`,
      `h2{font-family:Newsreader,serif;font-weight:400;font-size:84px;line-height:1.25;color:#383D42;letter-spacing:-.02em}
       .st{margin-top:90px;display:flex;flex-direction:column;gap:44px}.st div{display:flex;flex-direction:column;gap:6px;padding-top:30px;border-top:2px solid #EEEEEE}
       .st b{font-weight:400;font-size:44px;color:#303438}.st span{font-size:32px;color:#8A9094}`),
    card(t.reads[2]),
    frame(`<div class="mark wm">${WM}</div><p class="h">${t.ch}</p><div class="d">${t.days.map((d, i) => `<div><i class="${i < 6 ? 'on' : ''}"></i><span>${d}</span></div>`).join('')}</div><p class="s">${t.chsub}</p>`,
      `.h{font-size:76px;letter-spacing:-.02em;line-height:1.3}.d{margin-top:90px;display:flex;justify-content:space-between}.d div{display:flex;flex-direction:column;align-items:center;gap:22px}
       .d i{width:74px;height:74px;border-radius:50%;background:#F1F1F1}.d i.on{background:#E4E6E7}.d div:last-child i{background:radial-gradient(circle,#F6D77A 0 9px,#FBE7A6aa 14px,#FFFFFF00 37px)}
       .d span{font-size:30px;color:#9BA0A3}.s{margin-top:80px;font-size:36px;color:#8A9094;line-height:1.6}`),
    page(`<div class="c"><span class="wm">${WM}</span><p>${t.soon}</p><div class="pills"><span>App Store</span><span>Google Play</span></div><small>dailyjourney.org</small></div>`,
      `.c{width:1080px;height:1350px;display:flex;flex-direction:column;align-items:center;justify-content:center}.wm{font-size:120px;color:#383D42}
       p{margin-top:70px;font-size:44px;color:#686E73}.pills{margin-top:50px;display:flex;gap:20px}.pills span{background:#F1F1F1;border-radius:999px;padding:22px 44px;font-size:34px;font-weight:400;color:#303438}
       small{margin-top:60px;font-size:30px;color:#A9AEB1}`),
  ];
}

// Reel: deterministic timeline; each scene fades in/out. Returns HTML whose window.at(t) draws time t (seconds).
function reel(t) {
  const scenes = [
    [0.0, 3.0, `<span class="wm big">${WM}</span>`],
    [3.0, 6.6, `<div class="tag serif"><span>Give <em>thanks</em> daily.</span><span data-d=".5">Live abundantly.</span><span data-d="1">Share the joy.</span></div>`],
    ...t.reads.map(([x, by], i) => [6.6 + i * 3.3, 6.6 + (i + 1) * 3.3, `<div class="rd"><p>${x}</p><small>${by}</small></div>`]),
    [16.5, 19.3, `<p class="q">${t.reel.q}</p>`],
    [19.3, 23.0, `<div class="end"><span class="wm">${WM}</span><small>${t.reel.end}</small></div>`],
  ];
  return { dur: 23.0, html: page(`<div id="s">${scenes.map(([a, b, h]) => `<section data-a="${a}" data-b="${b}">${h}</section>`).join('')}</div>
<script>(()=>{
const secs=[...document.querySelectorAll('section')];
const ease=x=>x<0?0:x>1?1:x*x*(3-2*x);
window.at=t=>{secs.forEach(s=>{const a=+s.dataset.a,b=+s.dataset.b,last=s===secs[secs.length-1];
  const o=Math.min(ease((t-a)/.7), last?1:ease((b-t)/.6));s.style.opacity=o;s.style.transform='translateY('+(1-ease((t-a)/.9))*24+'px)';
  s.querySelectorAll('[data-d]').forEach(e=>{e.style.opacity=ease((t-a-(+e.dataset.d))/.7)})})};
window.at(0);
})();</script>`,
    `#s{position:relative;width:1080px;height:1920px}section{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 130px;opacity:0}
     .big{font-size:150px;color:#383D42}.tag{display:flex;flex-direction:column;align-items:center;gap:20px;font-size:72px;color:#4E5459}
     .rd{width:100%;margin-top:-140px}.rd p{font-size:60px;line-height:1.75;letter-spacing:-.01em}.rd small{display:block;margin-top:40px;font-size:32px;color:#A9AEB1;font-weight:400}
     .q{font-size:84px;letter-spacing:-.02em;line-height:1.35;text-align:center}
     .end{display:flex;flex-direction:column;align-items:center;gap:60px}.end .wm{font-size:130px;color:#383D42}.end small{font-size:36px;color:#8A9094}`) };
}

function profile() {
  return [
    ['profile-wordmark', page(`<div class="c"><span class="wm">daily<br><em>thanks</em></span></div>`,
      `.c{width:1080px;height:1080px;display:grid;place-items:center}.wm{font-size:230px;line-height:.92;color:#383D42;text-align:center;white-space:normal}`)],
  ];
}

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const shot = async (html, file, w, h) => { await p.setViewportSize({ width: w, height: h }); await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300); await p.screenshot({ path: path.join(out, file) }); };
  for (const [name, html] of profile()) await shot(html, name + '.png', 1080, 1080);
  fs.copyFileSync(path.resolve('store/icons/appstore-1024.png'), path.join(out, 'profile-icon.png'));
  for (const lang of ['ko', 'en']) {
    const list = posts(T[lang]);
    for (let i = 0; i < list.length; i++) await shot(list[i], `feed-${lang}-${i + 1}.png`, 1080, 1350);
    // reel frames
    const { dur, html } = reel(T[lang]); const fps = 30, dir = path.join(out, `.frames-${lang}`);
    fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir);
    await p.setViewportSize({ width: 1080, height: 1920 }); await p.setContent(html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    for (let f = 0; f < dur * fps; f++) { await p.evaluate(t => window.at(t), f / fps); await p.screenshot({ path: path.join(dir, String(f).padStart(4, '0') + '.jpg'), type: 'jpeg', quality: 92 }); }
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(fps), '-i', path.join(dir, '%04d.jpg'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(out, `reel-${lang}.mp4`)]);
    await p.evaluate(() => window.at(5.6)); await p.screenshot({ path: path.join(out, `reel-${lang}-cover.png`) });
    fs.rmSync(dir, { recursive: true, force: true });
    console.log('done', lang);
  }
  await b.close();
})();
