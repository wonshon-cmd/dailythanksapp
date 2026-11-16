/* Daily Thanks — dependency-free offline prototype (Korean / English).
   No accounts, server, push, Kakao or Instagram integration. Data lives in this browser's localStorage. */
(() => {
'use strict';

const KEY = 'daily-thanks-v2';

/* ---------------- strings ---------------- */
const STR = {
  ko: {
    'doc.title': 'Daily Thanks · 감사가 이어지는 하루',
    'aria.home': 'Daily Thanks 홈', 'aria.settings': '설정', 'aria.nav': '주요 메뉴', 'aria.lang': 'Switch to English', 'aria.close': '닫기', 'aria.next': '다음 감사',
    'lang.other': 'EN',
    'top.write': '감사 쓰기',
    'nav.today': '오늘', 'nav.group': '소그룹', 'nav.challenge': '함께 7일', 'nav.journal': '내 감사',
    'feed.mygroup': '내 소그룹', 'feed.public': '모두의 감사',
    'feed.subPublic': '서로의 하루에서 발견한 감사', 'feed.subGroup': '우리 소그룹이 함께 나눈 감사',
    'feed.together': '함께 7일',
    'feed.empty': '아직 이곳에 올라온 감사가 없어요.<br>첫 번째 감사를 나눠보세요.',
    'feed.swipe': '위로 넘겨 다음 감사',
    'kind.today': '오늘의 감사', 'kind.ahead': '미리 감사 · 기도',
    'meta.today': '오늘의 기록', 'meta.ahead': '이번 주의 기도', 'meta.shared': '공유한 감사',
    'scope.public': '모두의 감사', 'scope.private': '나만 보기', 'scope.group': '소그룹',
    'act.share': '공유', 'act.group': '소그룹',
    'me': '나', 'reflect.prefix': '돌아보며',
    'toast.likeAhead': '함께 기도해요.', 'toast.likeToday': '함께 감사해요.',
    'compose.title': '감사 한 줄 남기기',
    'compose.qToday': '오늘 고마웠던 순간은?', 'compose.qAhead': '미리 감사하며 하나님께 맡기는 일은?',
    'compose.phToday': '오늘 감사했던 순간을 적어보세요.', 'compose.phAhead': '하나님, 이번 한 주도…',
    'compose.samples': '문장을 눌러 수정해 보세요',
    'sample.work': '직장에서', 'sample.relationship': '관계에서', 'sample.everyday': '일상에서',
    'compose.who': '누구와 나눌까요?', 'compose.private': '나만 보기 (기본)', 'compose.group': '내 소그룹', 'compose.public': '전체 공개',
    'compose.groupLabel': '소그룹',
    'compose.hint': '개인적인 기도는 나만 보기로 안전하게 남길 수 있어요. 공개하면 다른 사람도 읽고 공유할 수 있습니다.',
    'compose.submit': '감사 남기기', 'toast.saved': '감사가 저장되었어요.',
    'reflect.title': '돌아보며 감사 쓰기', 'reflect.before': '그때 드린 미리 감사', 'reflect.q': '이번 주에 실제로 발견한 감사는?', 'reflect.ph': '작은 순간도 좋아요.', 'reflect.submit': '기록에 덧붙이기', 'toast.reflected': '한 주의 감사가 더해졌어요.',
    'share.title': '감사 공유', 'share.hint': '실제 카카오톡·인스타그램 연결 전 미리보기입니다. 공개 또는 본인이 허락한 내용만 공유하세요.', 'share.copy': '텍스트 복사', 'share.native': '기기 공유', 'share.hint2': '카카오톡·인스타그램 공유는 휴대폰의 기본 공유 기능을 사용할 수 있지만, 플랫폼별 전용 카드·게시 기능은 별도 연동이 필요합니다.', 'toast.copied': '글을 복사했어요.', 'toast.noShare': '이 환경에서는 기기 공유를 사용할 수 없어요.',
    'send.title': '소그룹에 나누기', 'send.hint': '원작자가 공유한 글은 작성자 표시를 유지하세요. 비공개 글은 다른 사람에게 보내기 전에 허락을 받으세요.', 'send.target': '공유할 소그룹', 'send.submit': '이 그룹에 나누기', 'toast.sent': '그룹에 나누었어요.',
    'ch.kicker': '7 DAYS TOGETHER', 'ch.title': '함께 쌓아가는<br>일곱 번의 감사.', 'ch.desc': '친구 한 명이나 소그룹과 시작해요. 하루를 쉬어도 다시 이어갈 수 있어요.', 'ch.new': '＋ 새로운 7일 챌린지', 'ch.write': '오늘의 감사 쓰기', 'ch.detail': '자세히 보기', 'ch.day': '일',
    'ch.fine': '오프라인 시안에서는 참여 인원과 완료 상태가 이 브라우저에만 저장됩니다. 실제 친구 초대는 서버와 사용자 계정 연동이 필요합니다.',
    'ch.createTitle': '7일 감사 챌린지 만들기', 'ch.name': '챌린지 이름', 'ch.defaultName': '함께 채우는 7일', 'ch.with': '누구와 함께하나요?', 'ch.pair': '친구와 둘이 (초대 링크는 출시 이후)', 'ch.pairShort': '친구와 둘이',
    'ch.createHint': '한 주 중 하루를 놓쳐도 시작부터 다시 하지 않아요. 실제 친구 초대·실시간 동기화는 백엔드 구현 후 이용할 수 있습니다.', 'ch.start': '챌린지 시작하기', 'toast.chStarted': '새로운 7일 챌린지가 시작되었어요.',
    'ch.question': '오늘, 고마웠던 사람은 누구인가요?', 'ch.detailHint': '한 사람이 글을 썼을 때 모든 참가자의 참여로 계산하지 않도록, 실제 서비스에서는 사용자별 체크인 기록이 필요합니다.', 'ch.rest': '하루 쉬어도, 다시 이어가요.',
    'gr.kicker': 'SMALL GROUPS', 'gr.title': '가까운 사람들과<br>나누는 감사.', 'gr.desc': '소그룹의 감사는 그룹 구성원에게만 보여요. 가족, 친구, 교회 소그룹을 따로 만들 수 있어요.', 'gr.new': '＋ 새 소그룹 만들기', 'gr.posts': '개의 감사', 'gr.open': '피드 보기',
    'gr.createTitle': '새 소그룹', 'gr.name': '소그룹 이름', 'gr.ph': '예: 수요 성경공부', 'gr.create': '만들기', 'toast.grCreated': '소그룹이 만들어졌어요.', 'gr.fine': '실제 초대·가입·권한 관리는 서버 연동 후 제공됩니다.',
    'j.kicker': 'MY GRATITUDE', 'j.title': '나의 감사가<br>쌓이는 곳.', 'j.desc': '오늘 받은 은혜와 앞으로의 시간을 맡기며 드린 미리 감사를 함께 돌아봐요.', 'j.all': '전체', 'j.new': '＋ 새로운 감사 쓰기', 'j.empty': '아직 기록된 감사가 없어요.', 'j.reflect': '돌아보며 감사 쓰기', 'j.delete': '삭제', 'j.confirmDelete': '이 감사 기록을 삭제할까요?',
    'n.title': '나의 감사 시간', 'n.hint': '매일 부담 없이 한 줄을 남기도록, 내가 정한 시간에 한 번만 알려주는 흐름을 설계했어요.', 'n.time': '감사 알림 시간', 'n.enable': '매일 감사 알림 사용 (설정 시안)', 'n.group': '그룹 반응 모아 보기', 'n.example': '잠금 화면 알림 예시', 'n.ex1': '오늘 고마웠던 순간 하나', 'n.ex2': '작은 일도 좋아요. 한 줄로 남겨볼까요?', 'n.save': '알림 설정 저장', 'n.fine': '이 화면은 기기에 실제 푸시 알림을 예약하지 않습니다. 실제 알림은 권한 요청 및 네이티브 앱/웹 푸시 설정이 필요합니다.', 'toast.nSaved': '데모 설정이 저장되었어요.',
    'w.title': '홈 화면 위젯', 'w.desc': '실제 iPhone 위젯이 아닌 홈 화면 디자인 미리보기예요.', 'w.today': '오늘의 감사', 'w.q': '오늘 나를 웃게 한 일은?', 'w.write': '＋ 한 줄 쓰기', 'w.sub': '함께하는 7일', 'w.view': '챌린지 보기', 'w.fine': '실제 위젯 설치·위젯에서 앱 열기는 iOS/Android 네이티브 개발 단계에서 구현해야 합니다.',
    's.title': '설정', 's.lang': '언어 · Language', 's.notify': '알림 시간', 's.widget': '홈 위젯 미리보기', 's.export': '내 데모 데이터 JSON 복사', 'cancel': '취소', 's.reset': '데모 초기화', 's.fine': '현재의 기록은 이 브라우저에만 저장됩니다. 새 브라우저나 기기로 자동 동기화되지 않습니다.', 's.confirmReset': '데모에서 추가한 기록과 설정을 모두 초기화할까요?', 'toast.reset': '데모가 초기화되었어요.', 'toast.noStore': '현재 브라우저에 저장할 수 없어요.'
  },
  en: {
    'doc.title': 'Daily Thanks · A day that carries gratitude',
    'aria.home': 'Daily Thanks home', 'aria.settings': 'Settings', 'aria.nav': 'Main menu', 'aria.lang': '한국어로 보기', 'aria.close': 'Close', 'aria.next': 'Next',
    'lang.other': '한',
    'top.write': 'Write',
    'nav.today': 'Today', 'nav.group': 'Groups', 'nav.challenge': '7 Days', 'nav.journal': 'My Thanks',
    'feed.mygroup': 'My Group', 'feed.public': 'Everyone',
    'feed.subPublic': 'Gratitude found in each other’s days', 'feed.subGroup': 'Gratitude shared in our group',
    'feed.together': '7 Days',
    'feed.empty': 'No gratitude here yet.<br>Be the first to share one.',
    'feed.swipe': 'Swipe up for the next',
    'kind.today': 'Today’s thanks', 'kind.ahead': 'Thanks ahead · Prayer',
    'meta.today': 'Today’s note', 'meta.ahead': 'This week’s prayer', 'meta.shared': 'Shared',
    'scope.public': 'Everyone', 'scope.private': 'Only me', 'scope.group': 'Group',
    'act.share': 'Share', 'act.group': 'Group',
    'me': 'Me', 'reflect.prefix': 'Looking back',
    'toast.likeAhead': 'Praying with you.', 'toast.likeToday': 'Thankful with you.',
    'compose.title': 'Leave a line of thanks',
    'compose.qToday': 'What were you grateful for today?', 'compose.qAhead': 'What are you entrusting to God with thanks?',
    'compose.phToday': 'Write down a moment you were thankful for.', 'compose.phAhead': 'God, this week too…',
    'compose.samples': 'Tap a sentence and make it yours',
    'sample.work': 'At work', 'sample.relationship': 'In relationships', 'sample.everyday': 'In everyday life',
    'compose.who': 'Who will you share it with?', 'compose.private': 'Only me (default)', 'compose.group': 'My group', 'compose.public': 'Everyone',
    'compose.groupLabel': 'Group',
    'compose.hint': 'Keep personal prayers safe with “Only me.” Public posts can be read and shared by others.',
    'compose.submit': 'Save my thanks', 'toast.saved': 'Your thanks has been saved.',
    'reflect.title': 'Look back with thanks', 'reflect.before': 'The thanks you gave ahead', 'reflect.q': 'What grace did you actually find this week?', 'reflect.ph': 'Small moments count too.', 'reflect.submit': 'Add to this note', 'toast.reflected': 'A week of thanks, added.',
    'share.title': 'Share thanks', 'share.hint': 'A preview before KakaoTalk/Instagram integration. Only share public posts or ones the author allowed.', 'share.copy': 'Copy text', 'share.native': 'Share via device', 'share.hint2': 'You can use your phone’s share sheet for KakaoTalk or Instagram; dedicated cards and posting need separate integration.', 'toast.copied': 'Copied.', 'toast.noShare': 'Device sharing isn’t available here.',
    'send.title': 'Share with a group', 'send.hint': 'Keep the original author’s name on shared posts. Ask before sending someone’s private note.', 'send.target': 'Group to share with', 'send.submit': 'Share with this group', 'toast.sent': 'Shared with the group.',
    'ch.kicker': '7 DAYS TOGETHER', 'ch.title': 'Seven days of thanks,<br>built together.', 'ch.desc': 'Start with one friend or a small group. Miss a day? You can always pick it back up.', 'ch.new': '＋ New 7-day challenge', 'ch.write': 'Write today’s thanks', 'ch.detail': 'Details', 'ch.day': 'Day ',
    'ch.fine': 'In this offline demo, members and progress are saved only in this browser. Real invitations need a server and user accounts.',
    'ch.createTitle': 'Start a 7-day challenge', 'ch.name': 'Challenge name', 'ch.defaultName': 'Seven days together', 'ch.with': 'Who’s joining you?', 'ch.pair': 'Just a friend and me (invite links after launch)', 'ch.pairShort': 'A friend and me',
    'ch.createHint': 'Missing a day won’t reset your week. Real invites and live sync arrive once the backend is built.', 'ch.start': 'Start challenge', 'toast.chStarted': 'Your new 7-day challenge has begun.',
    'ch.question': 'Who are you thankful for today?', 'ch.detailHint': 'So one person’s post doesn’t count for everyone, the real service needs per-member check-ins.', 'ch.rest': 'Rest a day, then carry on.',
    'gr.kicker': 'SMALL GROUPS', 'gr.title': 'Gratitude shared<br>with those close by.', 'gr.desc': 'Group posts are visible only to members. Make separate groups for family, friends, or church.', 'gr.new': '＋ New group', 'gr.posts': ' posts', 'gr.open': 'Open feed',
    'gr.createTitle': 'New group', 'gr.name': 'Group name', 'gr.ph': 'e.g. Wednesday Bible study', 'gr.create': 'Create', 'toast.grCreated': 'Group created.', 'gr.fine': 'Real invites, joining and permissions come with the server.',
    'j.kicker': 'MY GRATITUDE', 'j.title': 'Where my thanks<br>gathers.', 'j.desc': 'Look back on today’s grace and the thanks you offered ahead for the days to come.', 'j.all': 'All', 'j.new': '＋ Write new thanks', 'j.empty': 'No thanks recorded yet.', 'j.reflect': 'Look back with thanks', 'j.delete': 'Delete', 'j.confirmDelete': 'Delete this note?',
    'n.title': 'My time for thanks', 'n.hint': 'One gentle reminder a day, at the time you choose, so a single line never feels like a chore.', 'n.time': 'Reminder time', 'n.enable': 'Daily reminder (design preview)', 'n.group': 'Bundle group reactions', 'n.example': 'Lock-screen preview', 'n.ex1': 'One moment you were thankful for', 'n.ex2': 'Small things count. Leave a single line?', 'n.save': 'Save reminder', 'n.fine': 'This screen does not schedule real push notifications. That needs permission and native/web push setup.', 'toast.nSaved': 'Demo settings saved.',
    'w.title': 'Home screen widget', 'w.desc': 'A design preview — not a real iPhone widget.', 'w.today': 'Today’s thanks', 'w.q': 'What made you smile today?', 'w.write': '＋ Write a line', 'w.sub': '7 days together', 'w.view': 'View challenge', 'w.fine': 'Installing a real widget and opening the app from it is built in the native iOS/Android phase.',
    's.title': 'Settings', 's.lang': 'Language · 언어', 's.notify': 'Reminder time', 's.widget': 'Home widget preview', 's.export': 'Copy my demo data (JSON)', 'cancel': 'Cancel', 's.reset': 'Reset demo', 's.fine': 'Your notes are stored only in this browser and don’t sync to other browsers or devices.', 's.confirmReset': 'Reset all notes and settings added in this demo?', 'toast.reset': 'Demo reset.', 'toast.noStore': 'This browser can’t save data right now.'
  }
};

/* ---------------- icons (line style) ---------------- */
const ICONS = {
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  sunrise: '<path d="M12 2v7M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M8 5l4-4 4 4M16 18a4 4 0 0 0-8 0"/>',
  people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  sparkle: '<path d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.13-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.13a.5.5 0 0 1 .96 0L14.06 8.5A2 2 0 0 0 15.5 9.94l6.13 1.58a.5.5 0 0 1 0 .96L15.5 14.06a2 2 0 0 0-1.44 1.44l-1.58 6.13a.5.5 0 0 1-.96 0z"/><path d="M20 3v4M22 5h-4"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/>',
  globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  chevrons: '<path d="M17 11l-5-5-5 5M17 18l-5-5-5 5"/>',
  down: '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  userplus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
  bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
  phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/>'
};
const icon = name => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ''}</svg>`;

/* ---------------- seed data (bilingual) ---------------- */
const seed = {
  posts: [
    { id: 'pub1', name: { ko: '다은', en: 'Daeun' }, scope: 'public', kind: 'ahead', date: '2026-11-16', likes: 8,
      text: { ko: '이번 한 주도 직장에서 기쁨으로 하루하루를 보내게 하심에 감사합니다.', en: 'Thank you for a week of joyful days at work.' } },
    { id: 'pub2', name: { ko: '서연', en: 'Seoyeon' }, scope: 'public', kind: 'today', date: '2026-11-16', likes: 24,
      text: { ko: '잠깐 멈춰 보니, 집으로 돌아가는 길에도 예쁜 하늘이 있었어요. 평범한 하루를 아름답게 하심에 감사합니다.', en: 'I paused on my way home and found a lovely sky. Thank you for a beautiful ordinary day.' } },
    { id: 'pub3', name: { ko: '지우', en: 'Jiwoo' }, scope: 'public', kind: 'ahead', date: '2026-11-16', likes: 17,
      text: { ko: '하나님, 이번 주 만나는 사람들을 사랑과 인내로 대하게 하심에 감사합니다.', en: 'God, thank you for love and patience with everyone I meet this week.' } },
    { id: 'pub4', name: { ko: '하은', en: 'Haeun' }, scope: 'public', kind: 'today', date: '2026-11-15', likes: 12,
      text: { ko: '오늘 마음이 무거웠는데 친구가 먼저 안부를 물어봐 주었어요. 함께할 사람이 있어 감사합니다.', en: 'My heart was heavy, but a friend checked in first. Thank you for people by my side.' } },
    { id: 'pub5', name: { ko: '준호', en: 'Junho' }, scope: 'public', kind: 'today', date: '2026-11-15', likes: 9,
      text: { ko: '사소하지만 당연하지 않았던 일. 따뜻한 물로 하루를 시작할 수 있었던 아침에 감사합니다.', en: 'Small, but never a given: thankful for a morning that began with warm water.' } },
    { id: 'pub6', name: { ko: '예린', en: 'Yerin' }, scope: 'public', kind: 'ahead', date: '2026-11-14', likes: 6,
      text: { ko: '하나님, 평범한 하루 가운데서 작은 은혜를 발견하게 하심에 감사합니다.', en: 'God, thank you for small graces in an ordinary day.' } },
    { id: 'gr1', name: { ko: '지은', en: 'Jieun' }, scope: 'group', group: 'g1', kind: 'today', date: '2026-11-16', likes: 8,
      text: { ko: '평범하게 식탁에 앉아 이야기 나눌 수 있었던 저녁이 감사했어요.', en: 'Grateful for a simple evening of talking around the table.' } },
    { id: 'gr2', name: { ko: '민서', en: 'Minseo' }, scope: 'group', group: 'g1', kind: 'ahead', date: '2026-11-15', likes: 5,
      text: { ko: '하나님, 이번 한 주도 서로를 이해하는 마음을 주심에 감사합니다.', en: 'God, thank you for hearts that understand each other this week.' } },
    { id: 'mine1', mine: true, scope: 'private', kind: 'today', date: '2026-11-15', likes: 0,
      text: { ko: '오늘도 새롭게 시작할 수 있는 아침을 주셔서 감사합니다.', en: 'Thank you for a morning to begin again today.' } }
  ],
  liked: [],
  groups: [{ id: 'g1', name: { ko: '은혜 소그룹', en: 'Grace Group' } }, { id: 'g2', name: { ko: '우리 가족', en: 'Our Family' } }],
  challenges: [{ id: 'ch1', name: { ko: '함께 발견하는 감사', en: 'Finding Thanks Together' }, group: 'g1',
    members: [{ ko: '나', en: 'Me' }, { ko: '지은', en: 'Jieun' }, { ko: '민서', en: 'Minseo' }], start: '2026-11-14', days: [1, 2] }],
  settings: { lang: null, notificationTime: '21:00', notificationEnabled: false, groupUpdates: false }
};

const SAMPLES = {
  ko: { work: '하나님, 이번 한 주도 직장에서 기쁨으로 하루하루를 보내게 하심에 감사합니다.', relationship: '하나님, 이번 주 만나는 사람들을 사랑과 인내로 대하게 하심에 감사합니다.', everyday: '하나님, 평범한 하루 가운데서 작은 은혜를 발견하게 하심에 감사합니다.' },
  en: { work: 'God, thank you for letting me spend each day at work this week with joy.', relationship: 'God, thank you for helping me meet everyone this week with love and patience.', everyday: 'God, thank you for helping me find small graces in an ordinary day.' }
};

/* ---------------- state ---------------- */
const clone = x => JSON.parse(JSON.stringify(x));
let data;
try { const stored = JSON.parse(localStorage.getItem(KEY)); data = stored && Array.isArray(stored.posts) ? stored : clone(seed); }
catch { data = clone(seed); }
if (!data.settings.lang) data.settings.lang = (navigator.language || 'ko').toLowerCase().startsWith('ko') ? 'ko' : 'en';

const state = { tab: 'feed', feed: 'public', group: data.groups[0]?.id, composeKind: 'today', challenge: null, filter: 'all' };

const $ = s => document.querySelector(s);
const main = $('#main'), sheet = $('#sheet'), backdrop = $('#backdrop');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lang = () => data.settings.lang;
const t = k => STR[lang()][k] ?? STR.ko[k] ?? k;
const L = v => (v && typeof v === 'object') ? (v[lang()] ?? v.ko ?? v.en) : (v ?? '');
const today = () => new Date().toLocaleDateString('en-CA');

function save() { try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { toast(t('toast.noStore')); } }
function toast(text) { const el = $('#toast'); el.textContent = text; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => el.hidden = true, 2600); }

/* ---------------- helpers ---------------- */
const groupName = id => id === 'pair' ? t('ch.pairShort') : L(data.groups.find(g => g.id === id)?.name) || id || '';
const authorName = p => p.mine ? t('me') : L(p.name);
const kindLabel = p => p.kind === 'ahead' ? t('kind.ahead') : t('kind.today');
const kindIcon = p => p.kind === 'ahead' ? 'sunrise' : 'sun';
const scopeLabel = p => p.scope === 'public' ? t('scope.public') : p.scope === 'private' ? t('scope.private') : groupName(p.group) || t('scope.group');
const scopeIcon = p => p.scope === 'public' ? 'globe' : p.scope === 'private' ? 'lock' : 'people';
// Same visual line count in both languages: Latin text holds roughly 1.4x the characters per line.
const textClass = s => { const k = lang() === 'en' ? 1.4 : 1; return s.length > 110 * k ? 'xlong' : s.length > 50 * k ? 'long' : ''; };

function applyStatic() {
  document.documentElement.lang = lang();
  document.title = t('doc.title');
  document.querySelectorAll('[data-i18n]').forEach(el => el.innerHTML = t(el.dataset.i18n));
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  document.querySelectorAll('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
}

function showSheet({ title, body }) {
  sheet.innerHTML = `<div class="sheet-top"><h2>${title}</h2><button class="close" data-action="close" aria-label="${t('aria.close')}">×</button></div>${body}`;
  sheet.setAttribute('aria-label', title);
  sheet.hidden = false; backdrop.hidden = false;
  setTimeout(() => sheet.querySelector('textarea,input:not([type=checkbox]),select,button:not(.close)')?.focus(), 30);
}
function close() { sheet.hidden = true; backdrop.hidden = true; sheet.innerHTML = ''; }

function dayRow(ch) {
  const next = Math.min(ch.days.length + 1, 7);
  return `<div class="days">${Array.from({ length: 7 }, (_, i) => {
    const n = i + 1, done = ch.days.includes(n);
    return `<div class="day ${done ? 'done' : ''} ${n === next && !done ? 'today' : ''}"><span>${done ? '✓' : n}</span>${lang() === 'ko' ? n + t('ch.day') : t('ch.day') + n}</div>`;
  }).join('')}</div>`;
}

/* ---------------- screens ---------------- */
function feedPosts() {
  return data.posts.filter(p => state.feed === 'public' ? p.scope === 'public' : p.scope === 'group' && p.group === state.group);
}

function postTemplate(p, i, count) {
  const liked = data.liked.includes(p.id), text = L(p.text), name = authorName(p);
  const meta = p.sharedFrom ? t('meta.shared') : (p.kind === 'ahead' ? t('meta.ahead') : t('meta.today'));
  return `<article class="post" data-post="${esc(p.id)}">
    <div class="post-body">
      <div class="post-kind">${icon(kindIcon(p))}<span>${esc(kindLabel(p))}</span></div>
      <p class="post-text ${textClass(text)}">${esc(text)}</p>
      ${p.reflection ? `<div class="post-reflect">${t('reflect.prefix')} · ${esc(p.reflection)}</div>` : ''}
    </div>
    <aside class="post-rail">
      <button class="rail-btn ${liked ? 'liked' : ''}" data-action="like" data-id="${esc(p.id)}" aria-pressed="${liked}">${icon('heart')}<span>${p.likes + (liked ? 1 : 0)}</span></button>
      <button class="rail-btn" data-action="share" data-id="${esc(p.id)}">${icon('share')}<span>${t('act.share')}</span></button>
    </aside>
    <footer class="post-foot">
      <div class="post-author"><span class="avatar">${esc(name[0] || '·')}</span><div><div class="author-name">${esc(name)}${p.sharedFrom ? ' · ' + esc(L(p.sharedFrom)) : ''}</div><div class="author-meta">${esc(meta)} · ${esc(p.date)}</div></div></div>
      <div class="post-scope">${icon(scopeIcon(p))}<span>${esc(scopeLabel(p))}</span></div>
      <div class="post-nav"><span>${icon('chevrons')}${t('feed.swipe')}</span><span class="count">${i + 1} / ${count} ${icon('down')}</span></div>
    </footer>
  </article>`;
}

function renderFeed(keepIndex = 0) {
  const posts = feedPosts();
  const isGroup = state.feed === 'group';
  main.innerHTML = `
    <div class="feed-tabs" role="tablist">
      <button role="tab" class="${isGroup ? 'active' : ''}" aria-selected="${isGroup}" data-action="feed-group">${t('feed.mygroup')}</button>
      <button role="tab" class="${!isGroup ? 'active' : ''}" aria-selected="${!isGroup}" data-action="feed-public">${t('feed.public')}</button>
    </div>
    <div class="feed-sub">
      ${isGroup
        ? `<select class="group-select" data-action="change-group" aria-label="${t('compose.groupLabel')}">${data.groups.map(g => `<option value="${esc(g.id)}" ${state.group === g.id ? 'selected' : ''}>${esc(L(g.name))}</option>`).join('')}</select>`
        : `<span>${t('feed.subPublic')}</span>`}
      <button class="link-btn" data-action="challenges">${icon('sparkle')}${t('feed.together')}</button>
    </div>
    <div class="feed-scroll" id="feed-scroll">
      ${posts.length ? posts.map((p, i) => postTemplate(p, i, posts.length)).join('')
        : `<div class="empty">${t('feed.empty')}<br><br><button class="primary" data-action="compose">${t('top.write')}</button></div>`}
    </div>
    ${posts.length > 1 ? `<button class="next-fab" data-action="next" aria-label="${t('aria.next')}">${icon('down')}</button>` : ''}`;
  const sc = $('#feed-scroll');
  if (keepIndex && sc) sc.scrollTop = keepIndex * sc.clientHeight;
}

function renderGroups() {
  main.innerHTML = `<div class="screen"><div class="section">
    <span class="section-kicker">${t('gr.kicker')}</span>
    <h1 class="section-title">${t('gr.title')}</h1>
    <p class="section-desc">${t('gr.desc')}</p>
    <button class="primary" data-action="new-group">${t('gr.new')}</button>
    ${data.groups.map(g => {
      const n = data.posts.filter(p => p.scope === 'group' && p.group === g.id).length;
      return `<section class="panel"><div class="row"><div><h3>${esc(L(g.name))}</h3><p>${n}${t('gr.posts')}</p></div><button class="secondary" data-action="open-group" data-id="${esc(g.id)}">${t('gr.open')}</button></div></section>`;
    }).join('')}
    <p class="fine-print">${t('gr.fine')}</p>
  </div></div>`;
}

function renderChallenges() {
  main.innerHTML = `<div class="screen"><div class="section">
    <span class="section-kicker">${t('ch.kicker')}</span>
    <h1 class="section-title">${t('ch.title')}</h1>
    <p class="section-desc">${t('ch.desc')}</p>
    <button class="primary" data-action="new-challenge">${t('ch.new')}</button>
    ${data.challenges.map(ch => `<section class="panel">
      <div class="row"><span class="tag">${esc(groupName(ch.group))}</span><span class="muted">${Math.min(7, ch.days.length)}/7</span></div>
      <h3 style="margin-top:12px">${esc(L(ch.name))}</h3>
      <p>${esc(ch.members.map(L).join(' · '))}</p>
      ${dayRow(ch)}
      <div class="btn-row"><button class="primary" data-action="challenge-write" data-id="${esc(ch.id)}">${t('ch.write')}</button><button class="secondary" data-action="challenge-detail" data-id="${esc(ch.id)}">${t('ch.detail')}</button></div>
    </section>`).join('')}
    <p class="fine-print">${t('ch.fine')}</p>
  </div></div>`;
}

function renderJournal() {
  let mine = data.posts.filter(p => p.mine);
  if (state.filter !== 'all') mine = mine.filter(p => p.kind === state.filter);
  main.innerHTML = `<div class="screen"><div class="section">
    <div class="section-head"><span class="section-kicker">${t('j.kicker')}</span><span class="section-tools"><button class="chip-btn" data-action="toggle-lang" aria-label="${t('aria.lang')}">${t('lang.other')}</button><button class="chip-btn" data-action="settings" aria-label="${t('aria.settings')}">⋯</button></span></div>
    <h1 class="section-title">${t('j.title')}</h1>
    <p class="section-desc">${t('j.desc')}</p>
    <div class="mini-tabs">${[['all', t('j.all')], ['today', t('kind.today')], ['ahead', t('kind.ahead')]].map(([k, label]) => `<button class="${state.filter === k ? 'active' : ''}" data-action="journal-filter" data-id="${k}">${label}</button>`).join('')}</div>
    <button class="primary" data-action="compose">${t('j.new')}</button>
    ${mine.length ? mine.map(p => `<section class="note-card">
      <div class="post-kind">${icon(kindIcon(p))}<span>${esc(kindLabel(p))} · ${esc(scopeLabel(p))}</span></div>
      <p class="note-text">${esc(L(p.text))}</p>
      ${p.reflection ? `<p class="muted">${t('reflect.prefix')}: ${esc(p.reflection)}</p>` : ''}
      <footer>${esc(p.date)}</footer>
      <div class="note-actions">
        <button data-action="share" data-id="${esc(p.id)}">${t('act.share')}</button>
        ${p.kind === 'ahead' ? `<button data-action="reflect" data-id="${esc(p.id)}">${t('j.reflect')}</button>` : ''}
        <button data-action="delete" data-id="${esc(p.id)}">${t('j.delete')}</button>
      </div></section>`).join('') : `<p class="empty">${t('j.empty')}</p>`}
  </div></div>`;
}

function render(keepIndex) {
  document.querySelectorAll('[data-tab]').forEach(b => {
    const on = b.dataset.tab === state.tab;
    b.classList.toggle('active', on);
    on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
  });
  ({ feed: () => renderFeed(keepIndex), group: renderGroups, challenges: renderChallenges, journal: renderJournal })[state.tab]();
}

/* ---------------- sheets ---------------- */
function compose(kind = state.composeKind, chId = null, keepText = '') {
  state.composeKind = kind; state.challenge = chId;
  const ahead = kind === 'ahead';
  showSheet({ title: t('compose.title'), body: `<form id="compose-form">
    <div class="radio-row">
      <button type="button" data-action="kind-today" class="${ahead ? '' : 'active'}">${icon('sun')}${t('kind.today')}</button>
      <button type="button" data-action="kind-ahead" class="${ahead ? 'active' : ''}">${icon('sunrise')}${t('kind.ahead')}</button>
    </div>
    <label class="field-label" for="gratitude-text">${ahead ? t('compose.qAhead') : t('compose.qToday')}</label>
    <textarea id="gratitude-text" maxlength="1500" placeholder="${esc(ahead ? t('compose.phAhead') : t('compose.phToday'))}" required>${esc(keepText)}</textarea>
    <div ${ahead ? '' : 'hidden'}><p class="field-label">${t('compose.samples')}</p><div class="sample-grid">
      ${['work', 'relationship', 'everyday'].map(k => `<button type="button" data-action="sample" data-id="${k}">${t('sample.' + k)}</button>`).join('')}
    </div></div>
    <label class="field-label" for="post-scope">${t('compose.who')}</label>
    <select id="post-scope"><option value="private">${t('compose.private')}</option><option value="group">${t('compose.group')}</option><option value="public">${t('compose.public')}</option></select>
    <div id="group-picker" hidden><label class="field-label" for="post-group">${t('compose.groupLabel')}</label>
      <select id="post-group">${data.groups.map(g => `<option value="${esc(g.id)}">${esc(L(g.name))}</option>`).join('')}</select></div>
    <p class="hint">${t('compose.hint')}</p>
    <button class="primary block" type="submit">${t('compose.submit')}</button>
  </form>` });
  $('#post-scope').addEventListener('change', () => $('#group-picker').hidden = $('#post-scope').value !== 'group');
  $('#compose-form').addEventListener('submit', e => {
    e.preventDefault();
    const text = $('#gratitude-text').value.trim(); if (!text) return;
    const scope = $('#post-scope').value;
    data.posts.unshift({ id: 'p' + Date.now(), mine: true, scope, group: scope === 'group' ? $('#post-group').value : undefined, kind: state.composeKind, text, date: today(), likes: 0 });
    if (state.challenge) {
      const ch = data.challenges.find(c => c.id === state.challenge);
      const next = ch && Math.min(ch.days.length + 1, 7);
      if (ch && !ch.days.includes(next)) ch.days.push(next);
    }
    save(); close(); state.tab = 'journal'; render(); toast(t('toast.saved'));
  });
}

function reflect(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('reflect.title'), body: `<p class="hint">${t('reflect.before')}</p><div class="panel panel-muted">${esc(L(p.text))}</div>
    <form id="reflect-form"><label class="field-label" for="reflect-text">${t('reflect.q')}</label>
    <textarea id="reflect-text" placeholder="${esc(t('reflect.ph'))}">${esc(p.reflection || '')}</textarea>
    <button class="primary block" type="submit" style="margin-top:14px">${t('reflect.submit')}</button></form>` });
  $('#reflect-form').addEventListener('submit', e => { e.preventDefault(); p.reflection = $('#reflect-text').value.trim(); save(); close(); renderJournal(); toast(t('toast.reflected')); });
}

function share(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('share.title'), body: `<p class="hint">${t('share.hint')}</p>
    <div class="share-preview"><span class="wordmark">daily <em>thanks</em></span><p>${esc(L(p.text))}</p><small>${esc(authorName(p))} · ${esc(kindLabel(p))}</small></div>
    <div class="btn-row"><button class="primary" data-action="copy-share" data-id="${esc(id)}">${t('share.copy')}</button><button class="secondary" data-action="send-group" data-id="${esc(id)}">${icon('userplus')} ${t('send.title')}</button><button class="secondary" data-action="native-share" data-id="${esc(id)}">${t('share.native')}</button></div>
    <p class="hint">${t('share.hint2')}</p>` });
}

function sendToGroup(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('send.title'), body: `<p class="hint">${t('send.hint')}</p><div class="panel panel-muted">${esc(L(p.text))}</div>
    <label class="field-label" for="send-target">${t('send.target')}</label>
    <select id="send-target">${data.groups.map(g => `<option value="${esc(g.id)}">${esc(L(g.name))}</option>`).join('')}</select>
    <button class="primary block" style="margin-top:16px" data-action="confirm-send" data-id="${esc(id)}">${t('send.submit')}</button>` });
}

function createGroup() {
  showSheet({ title: t('gr.createTitle'), body: `<form id="group-form"><label class="field-label" for="group-name">${t('gr.name')}</label>
    <input id="group-name" class="field" maxlength="30" placeholder="${esc(t('gr.ph'))}" required>
    <button class="primary block" type="submit" style="margin-top:18px">${t('gr.create')}</button></form>` });
  $('#group-form').addEventListener('submit', e => {
    e.preventDefault(); const name = $('#group-name').value.trim(); if (!name) return;
    data.groups.push({ id: 'g' + Date.now(), name }); save(); close(); renderGroups(); toast(t('toast.grCreated'));
  });
}

function createChallenge() {
  showSheet({ title: t('ch.createTitle'), body: `<form id="challenge-form">
    <label class="field-label" for="challenge-name">${t('ch.name')}</label><input id="challenge-name" class="field" value="${esc(t('ch.defaultName'))}" maxlength="50" required>
    <label class="field-label" for="challenge-group">${t('ch.with')}</label>
    <select id="challenge-group"><option value="pair">${t('ch.pair')}</option>${data.groups.map(g => `<option value="${esc(g.id)}">${esc(L(g.name))}</option>`).join('')}</select>
    <p class="hint">${t('ch.createHint')}</p>
    <button class="primary block" type="submit">${t('ch.start')}</button></form>` });
  $('#challenge-form').addEventListener('submit', e => {
    e.preventDefault(); const name = $('#challenge-name').value.trim(); if (!name) return;
    data.challenges.unshift({ id: 'ch' + Date.now(), name, group: $('#challenge-group').value, members: [{ ko: '나', en: 'Me' }], start: today(), days: [] });
    save(); close(); state.tab = 'challenges'; render(); toast(t('toast.chStarted'));
  });
}

function challengeDetail(id) {
  const ch = data.challenges.find(c => c.id === id); if (!ch) return;
  showSheet({ title: esc(L(ch.name)), body: `<span class="tag">${esc(groupName(ch.group))}</span>
    <p class="muted" style="margin-top:10px">${esc(ch.members.map(L).join(', '))}</p>${dayRow(ch)}
    <div class="panel" style="text-align:center"><p style="font-size:18px;font-weight:300;color:var(--ink);line-height:1.6">${t('ch.question')}</p>
    <button class="primary block" data-action="challenge-write" data-id="${esc(ch.id)}">${t('ch.write')}</button></div>
    <p class="hint" style="text-align:center">${t('ch.rest')}</p>
    <p class="fine-print">${t('ch.detailHint')}</p>` });
}

function notifications() {
  const s = data.settings;
  showSheet({ title: t('n.title'), body: `<p class="hint">${t('n.hint')}</p>
    <label class="field-label" for="notify-time">${t('n.time')}</label><input id="notify-time" class="field" type="time" value="${esc(s.notificationTime)}">
    <label class="check-label"><input id="notify-enabled" type="checkbox" ${s.notificationEnabled ? 'checked' : ''}> ${t('n.enable')}</label>
    <label class="check-label"><input id="notify-group" type="checkbox" ${s.groupUpdates ? 'checked' : ''}> ${t('n.group')}</label>
    <div class="panel panel-muted"><h3>${t('n.example')}</h3><p style="color:var(--ink)">${t('n.ex1')}</p><p>${t('n.ex2')}</p></div>
    <button class="primary block" data-action="save-notifications">${t('n.save')}</button>
    <p class="fine-print">${t('n.fine')}</p>` });
}

function widget() {
  const ch = data.challenges[0];
  showSheet({ title: t('w.title'), body: `<p class="hint">${t('w.desc')}</p><div class="widget-surface">
    <div class="widget-card"><h3>${icon('sun')}${t('w.today')}</h3><div class="question">${t('w.q')}</div><button class="primary block" data-action="compose">${t('w.write')}</button></div>
    ${ch ? `<div class="widget-card"><h3>${icon('people')}${esc(groupName(ch.group))}</h3><p class="muted">${t('w.sub')}</p>${dayRow(ch)}<button class="secondary block" data-action="challenges">${t('w.view')}</button></div>` : ''}
    </div><p class="fine-print">${t('w.fine')}</p>` });
}

function settings() {
  showSheet({ title: t('s.title'), body: `<p class="field-label" style="margin-top:0">${t('s.lang')}</p>
    <div class="seg"><button class="${lang() === 'ko' ? 'active' : ''}" data-action="set-lang" data-id="ko">한국어</button><button class="${lang() === 'en' ? 'active' : ''}" data-action="set-lang" data-id="en">English</button></div>
    <hr class="divider"><div class="menu-list">
      <button data-action="notification">${icon('bell')}${t('s.notify')}</button>
      <button data-action="widget">${icon('phone')}${t('s.widget')}</button>
      <button data-action="export">${icon('download')}${t('s.export')}</button>
      <button data-action="reset">${icon('reset')}${t('s.reset')}</button>
    </div><p class="fine-print">${t('s.fine')}</p>` });
}

/* ---------------- actions ---------------- */
function setLang(l) {
  data.settings.lang = l; save(); applyStatic();
  const wasSettings = !sheet.hidden && sheet.querySelector('.seg');
  render(); if (wasSettings) settings();
}

function like(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  const i = data.liked.indexOf(id); i >= 0 ? data.liked.splice(i, 1) : data.liked.push(id); save();
  const sc = $('#feed-scroll'), idx = sc ? Math.round(sc.scrollTop / sc.clientHeight) : 0;
  render(idx);
  if (i < 0) toast(p.kind === 'ahead' ? t('toast.likeAhead') : t('toast.likeToday'));
}

async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch { const el = document.createElement('textarea'); el.value = text; document.body.append(el); el.select(); document.execCommand('copy'); el.remove(); }
  toast(t('toast.copied'));
}

// Copies the demo data as JSON (file downloads are blocked in some embedded viewers).
function exportData() { copyText(JSON.stringify(data, null, 2)); }

// In-app confirmation (browser confirm() dialogs are suppressed in some embedded viewers).
function confirmSheet(title, message, okLabel, onOk) {
  showSheet({ title, body: `<p class="hint" style="font-size:14px">${message}</p>
    <div class="btn-row" style="margin-top:18px"><button class="primary" id="confirm-ok">${okLabel}</button><button class="secondary" data-action="close">${t('cancel')}</button></div>` });
  $('#confirm-ok').addEventListener('click', () => { close(); onOk(); });
}

const actions = {
  home: () => { state.tab = 'feed'; state.feed = 'public'; render(); },
  'feed-public': () => { state.feed = 'public'; renderFeed(); },
  'feed-group': () => { state.feed = 'group'; renderFeed(); },
  challenges: () => { close(); state.tab = 'challenges'; render(); },
  compose: () => compose('today'),
  next: () => { const sc = $('#feed-scroll'); sc?.scrollBy({ top: sc.clientHeight, behavior: 'smooth' }); },
  settings, notification: notifications, widget, close,
  'toggle-lang': () => setLang(lang() === 'ko' ? 'en' : 'ko'),
  'set-lang': id => setLang(id),
  like, share, 'send-group': sendToGroup, reflect,
  'kind-today': () => compose('today', state.challenge, $('#gratitude-text')?.value || ''),
  'kind-ahead': () => compose('ahead', state.challenge, $('#gratitude-text')?.value || ''),
  sample: id => { const ta = $('#gratitude-text'); ta.value = SAMPLES[lang()][id]; ta.focus(); },
  'journal-filter': id => { state.filter = id; renderJournal(); },
  delete: id => confirmSheet(t('j.delete'), t('j.confirmDelete'), t('j.delete'), () => { data.posts = data.posts.filter(p => p.id !== id); save(); render(); }),
  'copy-share': id => { const p = data.posts.find(x => x.id === id); if (p) copyText(`${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks`); },
  'native-share': id => {
    const p = data.posts.find(x => x.id === id);
    if (navigator.share && p) navigator.share({ title: 'Daily Thanks', text: `${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks` }).catch(() => {});
    else toast(t('toast.noShare'));
  },
  'confirm-send': id => {
    const p = data.posts.find(x => x.id === id); if (!p) return;
    const g = $('#send-target').value;
    data.posts.unshift({ ...clone(p), id: 'repost' + Date.now(), scope: 'group', group: g, mine: false, name: p.mine ? { ko: '나', en: 'Me' } : p.name, sharedFrom: { ko: '공유', en: 'shared' }, likes: 0 });
    save(); close(); state.tab = 'feed'; state.feed = 'group'; state.group = g; render(); toast(t('toast.sent'));
  },
  'new-group': createGroup,
  'open-group': id => { state.tab = 'feed'; state.feed = 'group'; state.group = id; render(); },
  'new-challenge': createChallenge,
  'challenge-write': id => { close(); compose('today', id); },
  'challenge-detail': challengeDetail,
  'save-notifications': () => {
    Object.assign(data.settings, { notificationTime: $('#notify-time').value, notificationEnabled: $('#notify-enabled').checked, groupUpdates: $('#notify-group').checked });
    save(); close(); toast(t('toast.nSaved'));
  },
  export: exportData,
  reset: () => confirmSheet(t('s.reset'), t('s.confirmReset'), t('s.reset'), () => {
    const l = lang(); data = clone(seed); data.settings.lang = l; state.group = data.groups[0].id;
    save(); state.tab = 'feed'; render(); toast(t('toast.reset'));
  })
};

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) { state.tab = tab.dataset.tab; if (state.tab === 'feed') state.feed = 'public'; close(); render(); return; }
  const b = e.target.closest('[data-action]');
  if (b && b.tagName !== 'SELECT') actions[b.dataset.action]?.(b.dataset.id);
});
document.addEventListener('change', e => {
  if (e.target.matches('[data-action="change-group"]')) { state.group = e.target.value; renderFeed(); }
});
backdrop.addEventListener('click', close);
document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

applyStatic();
render();

/* Splash: white screen with the wordmark only, then fades into the app (tap to skip). */
const splash = $('#splash');
if (splash) {
  let gone = false;
  const hide = () => { if (gone) return; gone = true; splash.classList.add('out'); setTimeout(() => splash.remove(), 600); };
  splash.addEventListener('click', hide);
  setTimeout(hide, 1800);
}
})();
