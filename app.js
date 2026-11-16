/* Daily Thanks — dependency-free offline prototype (Korean / English).
   No accounts, server, push, Kakao or Instagram integration. Data lives in this browser's localStorage. */
(() => {
'use strict';

const KEY = 'daily-thanks-v2';

/* ---------------- strings ---------------- */
const STR = {
  ko: {
    'save': '저장', 'saved.on': '저장했어요. 내 감사 › 저장에서 볼 수 있어요.', 'saved.off': '저장을 취소했어요.', 'j.saved': '저장', 'j.savedEmpty': '저장한 감사가 없어요. 마음에 남는 글에서 저장을 눌러 보세요.',
    'more': '더 보기', 'menu.report': '신고하기', 'menu.hide': '이 글 숨기기', 'menu.block': '이 사람 차단하기', 'menu.unsave': '저장 취소',
    'report.title': '신고', 'report.q': '이 글을 신고하는 이유를 골라 주세요.', 'report.anon': '신고한 사람은 상대방에게 알리지 않아요.',
    'report.spam': '스팸 또는 광고', 'report.hate': '혐오 표현 또는 괴롭힘', 'report.violence': '폭력적이거나 위험한 내용', 'report.sexual': '성적인 내용', 'report.false': '거짓 정보', 'report.privacy': '다른 사람의 개인정보 노출', 'report.selfharm': '자해 또는 자살 관련', 'report.other': '기타',
    'report.otherPh': '어떤 점이 문제인지 알려 주세요 (선택)', 'report.send': '신고하기',
    'report.done': '신고가 접수되었어요', 'report.doneSub': '검토 후 운영 정책에 따라 조치할게요. 함께 이 공간을 지켜 주셔서 고마워요.',
    'report.help': '지금 위험한 상황이라면 바로 도움을 받을 수 있어요.', 'report.help1': '자살예방상담전화 109 (24시간)', 'report.help2': '긴급 상황 112 · 119',
    'hidden.done': '이 글을 숨겼어요.', 'blocked.done': '{name} 님을 차단했어요. 이 사람의 글이 더 이상 보이지 않아요.', 'block.confirm': '{name} 님을 차단할까요? 이 사람의 글이 보이지 않게 되고, 상대방에게는 알리지 않아요.', 'block.ok': '차단',
    's.blocked': '숨긴 글 · 차단 관리', 'blocked.none': '숨긴 글이나 차단한 사람이 없어요.', 'blocked.users': '차단한 사람', 'blocked.posts': '숨긴 글', 'unblock': '해제', 'restore': '다시 보기', 'done': '완료',
    'note.delete': '삭제',
    'note.reflect': '돌아보며 감사 쓰기',
    'note.share': '공유',
    's.about': '이 시안은 기록을 이 기기에만 저장해요. 친구 초대, 실시간 동기화, 푸시 알림은 출시 버전에서 연결돼요.',
    's.guest': '로그인 전',
    's.account': '계정',
    'send.pick': '어느 소그룹에 나눌까요?',
    'share.note': '공개된 글이나 허락받은 글만 공유해 주세요.',
    'share.toGroup': '소그룹에 나누기',
    'compose.publicNote': '모두의 감사는 누구나 읽고 공유할 수 있어요.',
    'scope.all': '모두',
    'scope.groupShort': '소그룹',
    'scope.me': '나만',
    'kind.aheadShort': '미리 감사',
    'gr.count': '감사 {n}개',
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
    'compose.title': '감사 한 줄',
    'compose.qToday': '오늘 고마웠던 순간은?', 'compose.qAhead': '미리 감사하며 하나님께 맡기는 일은?',
    'compose.phToday': '오늘 감사했던 순간을 적어보세요.', 'compose.phAhead': '하나님, 이번 한 주도…',
    'compose.samples': '문장을 눌러 수정해 보세요',
    'sample.work': '직장에서', 'sample.relationship': '관계에서', 'sample.everyday': '일상에서',
    'compose.who': '누구와 나눌까요?', 'compose.private': '나만 보기 (기본)', 'compose.group': '내 소그룹', 'compose.public': '전체 공개',
    'compose.groupLabel': '소그룹',
    'compose.hint': '개인적인 기도는 나만 보기로 안전하게 남길 수 있어요. 공개하면 다른 사람도 읽고 공유할 수 있습니다.',
    'compose.submit': '남기기', 'toast.saved': '감사가 저장되었어요.',
    'reflect.title': '돌아보며 감사 쓰기', 'reflect.before': '그때 드린 미리 감사', 'reflect.q': '이번 주에 실제로 발견한 감사는?', 'reflect.ph': '작은 순간도 좋아요.', 'reflect.submit': '덧붙이기', 'toast.reflected': '한 주의 감사가 더해졌어요.',
    'share.title': '감사 공유', 'share.hint': '실제 카카오톡·인스타그램 연결 전 미리보기입니다. 공개 또는 본인이 허락한 내용만 공유하세요.', 'share.copy': '텍스트 복사', 'share.native': '다른 앱으로 공유', 'share.hint2': '카카오톡·인스타그램 공유는 휴대폰의 기본 공유 기능을 사용할 수 있지만, 플랫폼별 전용 카드·게시 기능은 별도 연동이 필요합니다.', 'toast.copied': '글을 복사했어요.', 'toast.noShare': '이 환경에서는 기기 공유를 사용할 수 없어요.',
    'send.title': '소그룹에 나누기', 'send.hint': '원작자가 공유한 글은 작성자 표시를 유지하세요. 비공개 글은 다른 사람에게 보내기 전에 허락을 받으세요.', 'send.target': '공유할 소그룹', 'send.submit': '이 그룹에 나누기', 'toast.sent': '그룹에 나누었어요.',
    'ch.kicker': '7 DAYS TOGETHER', 'ch.title': '함께 7일', 'ch.desc': '친구나 소그룹과 일곱 번의 감사를 채워요. 하루 쉬어도 이어갈 수 있어요.', 'ch.new': '새 챌린지', 'ch.write': '오늘의 감사 쓰기', 'ch.detail': '자세히 보기', 'ch.day': '일',
    'ch.fine': '오프라인 시안에서는 참여 인원과 완료 상태가 이 브라우저에만 저장됩니다. 실제 친구 초대는 서버와 사용자 계정 연동이 필요합니다.',
    'ch.createTitle': '7일 감사 챌린지 만들기', 'ch.name': '챌린지 이름', 'ch.defaultName': '함께 채우는 7일', 'ch.with': '누구와 함께하나요?', 'ch.pair': '친구와 둘이 (초대 링크는 출시 이후)', 'ch.pairShort': '친구와 둘이',
    'ch.createHint': '한 주 중 하루를 놓쳐도 시작부터 다시 하지 않아요. 실제 친구 초대·실시간 동기화는 백엔드 구현 후 이용할 수 있습니다.', 'ch.start': '시작하기', 'toast.chStarted': '새로운 7일 챌린지가 시작되었어요.',
    'ch.question': '오늘, 고마웠던 사람은 누구인가요?', 'ch.detailHint': '한 사람이 글을 썼을 때 모든 참가자의 참여로 계산하지 않도록, 실제 서비스에서는 사용자별 체크인 기록이 필요합니다.', 'ch.rest': '하루 쉬어도, 다시 이어가요.',
    'gr.kicker': 'SMALL GROUPS', 'gr.title': '소그룹', 'gr.desc': '가까운 사람들과만 나누는 감사예요.', 'gr.new': '새 소그룹', 'gr.posts': '개의 감사', 'gr.open': '피드 보기',
    'gr.createTitle': '새 소그룹', 'gr.name': '소그룹 이름', 'gr.ph': '예: 수요 성경공부', 'gr.create': '만들기', 'toast.grCreated': '소그룹이 만들어졌어요.', 'gr.fine': '실제 초대·가입·권한 관리는 서버 연동 후 제공됩니다.',
    'j.kicker': 'MY GRATITUDE', 'j.title': '내 감사', 'j.desc': '오늘의 감사와 미리 드린 감사가 여기에 쌓여요.', 'j.all': '전체', 'j.new': '＋ 새로운 감사 쓰기', 'j.empty': '아직 기록된 감사가 없어요.', 'j.reflect': '돌아보며 감사 쓰기', 'j.delete': '삭제', 'j.confirmDelete': '이 감사 기록을 삭제할까요?',
    'n.title': '나의 감사 시간', 'n.hint': '매일 부담 없이 한 줄을 남기도록, 내가 정한 시간에 한 번만 알려주는 흐름을 설계했어요.', 'n.time': '감사 알림 시간', 'n.enable': '매일 감사 알림', 'n.group': '그룹 소식 모아 받기', 'n.example': '잠금 화면 알림 예시', 'n.ex1': '오늘 고마웠던 순간 하나', 'n.ex2': '작은 일도 좋아요. 한 줄로 남겨볼까요?', 'n.save': '저장', 'n.fine': '이 화면은 기기에 실제 푸시 알림을 예약하지 않습니다. 실제 알림은 권한 요청 및 네이티브 앱/웹 푸시 설정이 필요합니다.', 'toast.nSaved': '데모 설정이 저장되었어요.',
    'w.title': '홈 화면 위젯', 'w.desc': '실제 iPhone 위젯이 아닌 홈 화면 디자인 미리보기예요.', 'w.today': '오늘의 감사', 'w.q': '오늘 나를 웃게 한 일은?', 'w.write': '＋ 한 줄 쓰기', 'w.sub': '함께하는 7일', 'w.view': '챌린지 보기', 'w.fine': '실제 위젯 설치·위젯에서 앱 열기는 iOS/Android 네이티브 개발 단계에서 구현해야 합니다.',
    's.title': '설정', 's.lang': '언어 · Language', 's.notify': '알림 시간', 's.widget': '홈 위젯 미리보기', 's.export': '내 데모 데이터 JSON 복사', 'cancel': '취소', 's.reset': '데모 초기화', 'fs.enter': '전체 화면', 'fs.exit': '전체 화면 끄기', 'fs.close': '닫기', 'fs.closeAria': '전체 화면 닫기',
    'nudge': '아래로 넘겨 보기', 'gate.kicker': '오늘의 감사', 'gate.q': '오늘 고마웠던 순간은?', 'gate.ph': '한 줄이면 충분해요.', 'gate.private': '나만 보기', 'gate.public': '모두의 감사', 'gate.save': '감사 남기기', 'gate.later': '나중에 쓸게요',
    'gate.saved': '오늘의 감사가 저장되었어요.', 'gate.savedSub': '위로 넘겨 다른 사람들의 감사를 계속 보세요.',
    'login.title': '계속 보려면<br>로그인해 주세요.', 'login.sub': '한 번만 로그인하면 다음부터는 바로 열려요. 오늘 쓴 감사도 안전하게 보관돼요.',
    'login.apple': 'Apple로 계속하기', 'login.google': 'Google로 계속하기', 'login.phone': '휴대폰 번호로 계속하기',
    'login.demo': '시안에서는 실제 계정에 연결하지 않고 로그인 상태만 이 기기에 저장해요.', 'login.done': '로그인했어요. 다음부터는 바로 열려요.',
    'phone.title': '휴대폰 번호로 로그인', 'phone.number': '휴대폰 번호', 'phone.send': '인증번호 받기', 'phone.code': '인증번호 6자리', 'phone.verify': '확인',
    'phone.sent': '인증번호를 보냈어요.', 'phone.demo': '시안에서는 문자가 가지 않아요. 아무 6자리 숫자나 입력하세요.', 'phone.bad': '번호를 다시 확인해 주세요.', 'phone.badCode': '6자리 숫자를 입력해 주세요.',
    'acct.signedIn': '로그인됨', 'acct.logout': '로그아웃', 'acct.loggedOut': '로그아웃했어요.', 'fs.ios': '아이폰에서는 Safari 공유 버튼 → 「홈 화면에 추가」로 열면 앱처럼 전체 화면으로 보여요.', 'fs.blocked': '이 환경에서는 전체 화면을 쓸 수 없어요.', 's.fine': '현재의 기록은 이 브라우저에만 저장됩니다. 새 브라우저나 기기로 자동 동기화되지 않습니다.', 's.confirmReset': '데모에서 추가한 기록과 설정을 모두 초기화할까요?', 'toast.reset': '데모가 초기화되었어요.', 'toast.noStore': '현재 브라우저에 저장할 수 없어요.'
  },
  en: {
    'save': 'Save', 'saved.on': 'Saved. Find it in My Thanks › Saved.', 'saved.off': 'Removed from saved.', 'j.saved': 'Saved', 'j.savedEmpty': 'Nothing saved yet. Tap Save on a post that stays with you.',
    'more': 'More', 'menu.report': 'Report', 'menu.hide': 'Hide this post', 'menu.block': 'Block this person', 'menu.unsave': 'Remove from saved',
    'report.title': 'Report', 'report.q': 'Why are you reporting this post?', 'report.anon': 'The person won’t be told who reported them.',
    'report.spam': 'Spam or advertising', 'report.hate': 'Hate speech or bullying', 'report.violence': 'Violent or dangerous content', 'report.sexual': 'Sexual content', 'report.false': 'False information', 'report.privacy': 'Someone’s private information', 'report.selfharm': 'Self-harm or suicide', 'report.other': 'Something else',
    'report.otherPh': 'Tell us what’s wrong (optional)', 'report.send': 'Report',
    'report.done': 'Thanks for letting us know', 'report.doneSub': 'We’ll review it and act under our community rules. Thank you for helping keep this space kind.',
    'report.help': 'If someone is in danger right now, help is available.', 'report.help1': 'Call or text 988 (US) · 109 (Korea)', 'report.help2': 'In an emergency, call your local emergency number',
    'hidden.done': 'Post hidden.', 'blocked.done': 'You blocked {name}. Their posts won’t appear anymore.', 'block.confirm': 'Block {name}? You won’t see their posts, and they won’t be told.', 'block.ok': 'Block',
    's.blocked': 'Hidden posts & blocked people', 'blocked.none': 'No hidden posts or blocked people.', 'blocked.users': 'Blocked people', 'blocked.posts': 'Hidden posts', 'unblock': 'Unblock', 'restore': 'Show again', 'done': 'Done',
    'note.delete': 'Delete',
    'note.reflect': 'Look back with thanks',
    'note.share': 'Share',
    's.about': 'This prototype keeps your notes on this device only. Invites, live sync and push notifications arrive in the release version.',
    's.guest': 'Not signed in',
    's.account': 'Account',
    'send.pick': 'Which group?',
    'share.note': 'Only share public posts or ones you have permission to share.',
    'share.toGroup': 'Share with a group',
    'compose.publicNote': 'Anyone can read and share posts to Everyone.',
    'scope.all': 'Everyone',
    'scope.groupShort': 'Group',
    'scope.me': 'Only me',
    'kind.aheadShort': 'Thanks ahead',
    'gr.count': '{n} thanks',
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
    'compose.title': 'A line of thanks',
    'compose.qToday': 'What were you grateful for today?', 'compose.qAhead': 'What are you entrusting to God with thanks?',
    'compose.phToday': 'Write down a moment you were thankful for.', 'compose.phAhead': 'God, this week too…',
    'compose.samples': 'Tap a sentence and make it yours',
    'sample.work': 'At work', 'sample.relationship': 'In relationships', 'sample.everyday': 'In everyday life',
    'compose.who': 'Who will you share it with?', 'compose.private': 'Only me (default)', 'compose.group': 'My group', 'compose.public': 'Everyone',
    'compose.groupLabel': 'Group',
    'compose.hint': 'Keep personal prayers safe with “Only me.” Public posts can be read and shared by others.',
    'compose.submit': 'Save', 'toast.saved': 'Your thanks has been saved.',
    'reflect.title': 'Look back with thanks', 'reflect.before': 'The thanks you gave ahead', 'reflect.q': 'What grace did you actually find this week?', 'reflect.ph': 'Small moments count too.', 'reflect.submit': 'Add', 'toast.reflected': 'A week of thanks, added.',
    'share.title': 'Share thanks', 'share.hint': 'A preview before KakaoTalk/Instagram integration. Only share public posts or ones the author allowed.', 'share.copy': 'Copy text', 'share.native': 'Share to another app', 'share.hint2': 'You can use your phone’s share sheet for KakaoTalk or Instagram; dedicated cards and posting need separate integration.', 'toast.copied': 'Copied.', 'toast.noShare': 'Device sharing isn’t available here.',
    'send.title': 'Share with a group', 'send.hint': 'Keep the original author’s name on shared posts. Ask before sending someone’s private note.', 'send.target': 'Group to share with', 'send.submit': 'Share with this group', 'toast.sent': 'Shared with the group.',
    'ch.kicker': '7 DAYS TOGETHER', 'ch.title': '7 Days', 'ch.desc': 'Fill seven days of thanks with a friend or group. Miss a day and simply pick it back up.', 'ch.new': 'New challenge', 'ch.write': 'Write today’s thanks', 'ch.detail': 'Details', 'ch.day': 'Day ',
    'ch.fine': 'In this offline demo, members and progress are saved only in this browser. Real invitations need a server and user accounts.',
    'ch.createTitle': 'Start a 7-day challenge', 'ch.name': 'Challenge name', 'ch.defaultName': 'Seven days together', 'ch.with': 'Who’s joining you?', 'ch.pair': 'Just a friend and me (invite links after launch)', 'ch.pairShort': 'A friend and me',
    'ch.createHint': 'Missing a day won’t reset your week. Real invites and live sync arrive once the backend is built.', 'ch.start': 'Start', 'toast.chStarted': 'Your new 7-day challenge has begun.',
    'ch.question': 'Who are you thankful for today?', 'ch.detailHint': 'So one person’s post doesn’t count for everyone, the real service needs per-member check-ins.', 'ch.rest': 'Rest a day, then carry on.',
    'gr.kicker': 'SMALL GROUPS', 'gr.title': 'Groups', 'gr.desc': 'Thanks shared only with people close to you.', 'gr.new': 'New group', 'gr.posts': ' posts', 'gr.open': 'Open feed',
    'gr.createTitle': 'New group', 'gr.name': 'Group name', 'gr.ph': 'e.g. Wednesday Bible study', 'gr.create': 'Create', 'toast.grCreated': 'Group created.', 'gr.fine': 'Real invites, joining and permissions come with the server.',
    'j.kicker': 'MY GRATITUDE', 'j.title': 'My Thanks', 'j.desc': 'Your thanks for today and thanks offered ahead, all in one place.', 'j.all': 'All', 'j.new': '＋ Write new thanks', 'j.empty': 'No thanks recorded yet.', 'j.reflect': 'Look back with thanks', 'j.delete': 'Delete', 'j.confirmDelete': 'Delete this note?',
    'n.title': 'My time for thanks', 'n.hint': 'One gentle reminder a day, at the time you choose, so a single line never feels like a chore.', 'n.time': 'Reminder time', 'n.enable': 'Daily reminder', 'n.group': 'Bundle group updates', 'n.example': 'Lock-screen preview', 'n.ex1': 'One moment you were thankful for', 'n.ex2': 'Small things count. Leave a single line?', 'n.save': 'Save', 'n.fine': 'This screen does not schedule real push notifications. That needs permission and native/web push setup.', 'toast.nSaved': 'Demo settings saved.',
    'w.title': 'Home screen widget', 'w.desc': 'A design preview — not a real iPhone widget.', 'w.today': 'Today’s thanks', 'w.q': 'What made you smile today?', 'w.write': '＋ Write a line', 'w.sub': '7 days together', 'w.view': 'View challenge', 'w.fine': 'Installing a real widget and opening the app from it is built in the native iOS/Android phase.',
    's.title': 'Settings', 's.lang': 'Language · 언어', 's.notify': 'Reminder time', 's.widget': 'Home widget preview', 's.export': 'Copy my demo data (JSON)', 'cancel': 'Cancel', 's.reset': 'Reset demo', 'fs.enter': 'Full screen', 'fs.exit': 'Exit full screen', 'fs.close': 'Close', 'fs.closeAria': 'Close full screen',
    'nudge': 'Scroll for more', 'gate.kicker': 'Today’s thanks', 'gate.q': 'What were you grateful for today?', 'gate.ph': 'One line is enough.', 'gate.private': 'Only me', 'gate.public': 'Everyone', 'gate.save': 'Save my thanks', 'gate.later': 'Maybe later',
    'gate.saved': 'Your thanks for today is saved.', 'gate.savedSub': 'Swipe up to keep reading others’ thanks.',
    'login.title': 'Sign in<br>to keep reading.', 'login.sub': 'Sign in once and the app opens straight in next time. Your thanks stays safe too.',
    'login.apple': 'Continue with Apple', 'login.google': 'Continue with Google', 'login.phone': 'Continue with phone number',
    'login.demo': 'In this prototype nothing connects to a real account; only the signed-in state is saved on this device.', 'login.done': 'You’re signed in. Next time it opens straight in.',
    'phone.title': 'Sign in with your phone', 'phone.number': 'Phone number', 'phone.send': 'Send code', 'phone.code': '6-digit code', 'phone.verify': 'Verify',
    'phone.sent': 'Code sent.', 'phone.demo': 'No text is sent in this prototype. Enter any 6 digits.', 'phone.bad': 'Please check the number.', 'phone.badCode': 'Enter the 6-digit code.',
    'acct.signedIn': 'Signed in', 'acct.logout': 'Sign out', 'acct.loggedOut': 'Signed out.', 'fs.ios': 'On iPhone, open it from Safari’s Share button → “Add to Home Screen” to see it full screen like an app.', 'fs.blocked': 'Full screen isn’t available here.', 's.fine': 'Your notes are stored only in this browser and don’t sync to other browsers or devices.', 's.confirmReset': 'Reset all notes and settings added in this demo?', 'toast.reset': 'Demo reset.', 'toast.noStore': 'This browser can’t save data right now.'
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
  reset: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8M3 3v5h5"/>',
  apple: '<path fill="currentColor" stroke="none" d="M16.4 12.6c0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.5-.2-3 .9-3.8.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.1 2.5-1.8 3.1-.5 7.6 1.3 10.1.8 1.2 1.8 2.6 3.1 2.5 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8 0 0-2.4-1-2.4-4.1zM14 5.1c.7-.8 1.1-1.9 1-3.1-1 0-2.2.7-2.9 1.5-.6.7-1.2 1.9-1 3 1.1.1 2.2-.6 2.9-1.4z"/>',
  google: '<path fill="#4285F4" stroke="none" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" stroke="none" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" stroke="none" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" stroke="none" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>',
  phoneMsg: '<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M11 18h2"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
  eyeOff: '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20"/>',
  ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  more: '<circle cx="5" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  chevron: '<path d="m9 6 6 6-6 6"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  upload: '<path d="M12 3v12M7 8l5-5 5 5M5 14v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/>',
  trash: '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
  pencil: '<path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
  languages: '<path d="m5 8 6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
  maximize: '<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',
  minimize: '<path d="M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3"/>'
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
  liked: [], saved: [], hidden: [], blocked: [], reports: [],
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
for (const k of ['liked', 'saved', 'hidden', 'blocked', 'reports']) if (!Array.isArray(data[k])) data[k] = [];
if (!data.settings.lang) data.settings.lang = (navigator.language || 'ko').toLowerCase().startsWith('ko') ? 'ko' : 'en';

/* Sign-in session. Saved once, kept until the user signs out ("always signed in").
   In the prototype only the state is stored; see fullstack/README.md for wiring real Apple / Google / SMS auth. */
const SESSION_KEY = 'daily-thanks-session';
let session = null;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { session = null; }
function setSession(next) {
  session = next;
  try { next ? localStorage.setItem(SESSION_KEY, JSON.stringify(next)) : localStorage.removeItem(SESSION_KEY); } catch {}
  document.dispatchEvent(new CustomEvent('dt:session', { detail: next }));
}
const GATE_AFTER = 3; // posts shown before the "write today's thanks" card and the sign-in card

const state = { tab: 'feed', feed: 'public', group: data.groups[0]?.id, composeKind: 'today', challenge: null, filter: 'all', immersive: true, justWrote: false, composeScope: 'private' }; // immersive: the app opens on a full-screen feed of people's thanks

const $ = s => document.querySelector(s);
const main = $('#main'), sheet = $('#sheet'), backdrop = $('#backdrop');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lang = () => data.settings.lang;
const t = k => STR[lang()][k] ?? STR.ko[k] ?? k;
const L = v => (v && typeof v === 'object') ? (v[lang()] ?? v.ko ?? v.en) : (v ?? '');
const today = () => new Date().toLocaleDateString('en-CA');

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { toast(t('toast.noStore')); }
  document.dispatchEvent(new CustomEvent('dt:save', { detail: data }));
}
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
  sheet.innerHTML = `<div class="sheet-top"><h2>${title}</h2><button class="close" data-action="close" aria-label="${t('aria.close')}">${icon('x')}</button></div>${body}`;
  sheet.setAttribute('aria-label', title);
  sheet.hidden = false; backdrop.hidden = false;
  if (!sheet.dataset.keepToast) { clearTimeout(toast.timer); $('#toast').hidden = true; }
  setTimeout(() => sheet.querySelector('textarea, input.field')?.focus(), 30); // only text fields get focus
}
function close() { sheet.hidden = true; backdrop.hidden = true; sheet.innerHTML = ''; }

function dayRow(ch) {
  const next = Math.min(ch.days.length + 1, 7);
  return `<div class="days">${Array.from({ length: 7 }, (_, i) => {
    const n = i + 1, done = ch.days.includes(n);
    return `<div class="day ${done ? 'done' : ''} ${n === next && !done ? 'today' : ''}"><span>${done ? icon('check') : n}</span>${lang() === 'ko' ? n + t('ch.day') : t('ch.day') + n}</div>`;
  }).join('')}</div>`;
}

/* ---------------- screens ---------------- */
const wroteToday = () => data.posts.some(p => p.mine && p.date === today());
/* Public feed order: 3 posts → "write today's thanks" card (until written today) → sign-in card (until signed in) → the rest. */
function feedSequence(posts) {
  const items = posts.slice(0, GATE_AFTER).map(p => ({ type: 'post', p }));
  if (posts.length > GATE_AFTER || !session) {
    if (!wroteToday() || state.justWrote) items.push({ type: 'compose' });
    if (!session) return items.concat({ type: 'login' });
  }
  return items.concat(posts.slice(GATE_AFTER).map(p => ({ type: 'post', p })));
}
function composeCard() {
  if (state.justWrote) return `<article class="post card-page" id="compose-card"><div class="card-inner">
    <div class="post-kind">${icon('sun')}<span>${t('gate.kicker')}</span></div>
    <p class="card-title">${t('gate.saved')}</p><p class="card-sub">${t('gate.savedSub')}</p>
    <p class="card-hint">${icon('chevrons')}</p></div></article>`;
  return `<article class="post card-page" id="compose-card"><form class="card-inner" id="gate-compose">
    <div class="post-kind">${icon('sun')}<span>${t('gate.kicker')}</span></div>
    <label class="card-title" for="gate-text">${t('gate.q')}</label>
    <textarea id="gate-text" class="card-input" maxlength="1500" rows="3" placeholder="${esc(t('gate.ph'))}"></textarea>
    ${seg([['private', t('gate.private'), 'lock'], ['public', t('gate.public'), 'globe']], 'gate-scope', state.composeScope)}
    <div class="card-actions"><button class="primary" type="submit">${t('gate.save')}</button><button class="subtle-link" type="button" data-action="gate-later">${t('gate.later')}</button></div>
  </form></article>`;
}
function loginCard() {
  return `<article class="post card-page" id="login-card"><div class="card-inner">
    <span class="wordmark card-mark">daily <em>thanks</em></span>
    <p class="card-title">${t('login.title')}</p><p class="card-sub">${t('login.sub')}</p>
    <div class="login-buttons">
      <button class="login-btn apple" data-action="login" data-id="apple">${icon('apple')}<span>${t('login.apple')}</span></button>
      <button class="login-btn" data-action="login" data-id="google">${icon('google')}<span>${t('login.google')}</span></button>
      <button class="login-btn" data-action="login" data-id="phone">${icon('phoneMsg')}<span>${t('login.phone')}</span></button>
    </div>
    <p class="fine-print">${t('login.demo')}</p></div></article>`;
}
const cardFor = item => item.type === 'compose' ? composeCard() : loginCard();
function bindGateForm() {
  const f = $('#gate-compose'); if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const text = $('#gate-text').value.trim(); if (!text) { $('#gate-text').focus(); return; }
    data.posts.unshift({ id: 'p' + Date.now(), mine: true, scope: state.composeScope, kind: 'today', text, date: today(), likes: 0 });
    state.justWrote = true; save(); renderKeep('#compose-card'); toast(t('toast.saved'));
  });
}
// Re-render and keep the given card in view (its index can shift when posts change).
function renderKeep(selector) {
  render();
  const sc = $('#feed-scroll'), el = selector && $(selector);
  if (sc && el) sc.scrollTop = el.offsetTop;
}

// Posts the viewer hid, or whose author they blocked, never appear in any feed.
const authorKey = p => p.mine ? 'me' : String(L(p.name) && (p.name.ko || p.name));
const visible = p => !data.hidden.includes(p.id) && !data.blocked.includes(authorKey(p));
function feedPosts() {
  return data.posts.filter(visible).filter(p => state.feed === 'public' ? p.scope === 'public' : p.scope === 'group' && p.group === state.group);
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
      <button class="rail-btn ${data.saved.includes(p.id) ? 'saved' : ''}" data-action="save-post" data-id="${esc(p.id)}" aria-pressed="${data.saved.includes(p.id)}" aria-label="${t('save')}">${icon('bookmark')}</button>
      <button class="rail-btn" data-action="share" data-id="${esc(p.id)}">${icon('share')}<span>${t('act.share')}</span></button>
      <button class="rail-btn rail-more" data-action="post-menu" data-id="${esc(p.id)}" aria-label="${t('more')}">${icon('more')}</button>
    </aside>
    <footer class="post-foot">
      <div class="post-author"><div><div class="author-name">${esc(name)}${p.sharedFrom ? ' · ' + esc(L(p.sharedFrom)) : ''}</div><div class="author-meta">${esc(meta)} · ${esc(p.date)}</div></div></div>
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
      ${posts.length ? (isGroup ? posts.map((p, i) => postTemplate(p, i, posts.length)).join('')
        : feedSequence(posts).map(it => it.type === 'post' ? postTemplate(it.p, posts.indexOf(it.p), posts.length) : cardFor(it)).join(''))
        : `<div class="empty">${t('feed.empty')}<br><br><button class="primary" data-action="compose">${t('top.write')}</button></div>`}
    </div>
    ${posts.length > 1 ? `<button class="next-fab" data-action="next" aria-label="${t('aria.next')}">${icon('down')}</button>` : ''}`;
  const sc = $('#feed-scroll');
  if (keepIndex && sc) sc.scrollTop = keepIndex * sc.clientHeight;
  bindGateForm();
}

const pageHead = (title, desc, tools = '') => `<header class="page-head"><h1 class="page-title">${title}</h1>${tools ? `<div class="page-tools">${tools}</div>` : ''}</header>${desc ? `<p class="page-desc">${desc}</p>` : ''}`;
const roundBtn = (action, ic, label) => `<button class="round-btn" data-action="${action}" aria-label="${esc(label)}">${icon(ic)}</button>`;

function renderGroups() {
  main.innerHTML = `<div class="screen"><div class="page">
    ${pageHead(t('gr.title'), t('gr.desc'), roundBtn('new-group', 'plus', t('gr.new')))}
    <div class="list">${data.groups.map(g => {
      const n = data.posts.filter(p => p.scope === 'group' && p.group === g.id).length;
      return `<button class="list-row" data-action="open-group" data-id="${esc(g.id)}">
        <span class="row-icon">${icon('people')}</span>
        <span class="row-main"><span class="row-title">${esc(L(g.name))}</span><span class="row-sub">${t('gr.count').replace('{n}', n)}</span></span>
        <span class="row-end">${icon('chevron')}</span></button>`;
    }).join('')}</div>
  </div></div>`;
}

function renderChallenges() {
  main.innerHTML = `<div class="screen"><div class="page">
    ${pageHead(t('ch.title'), t('ch.desc'), roundBtn('new-challenge', 'plus', t('ch.new')))}
    ${data.challenges.map(ch => `<section class="ch-card">
      <button class="ch-head" data-action="challenge-detail" data-id="${esc(ch.id)}">
        <span class="row-main"><span class="row-sub">${esc(groupName(ch.group))} · ${Math.min(7, ch.days.length)}/7</span><span class="ch-name">${esc(L(ch.name))}</span></span>
        <span class="row-end">${icon('chevron')}</span></button>
      ${dayRow(ch)}
      <button class="primary block" data-action="challenge-write" data-id="${esc(ch.id)}">${t('ch.write')}</button>
    </section>`).join('')}
  </div></div>`;
}

function renderJournal() {
  const savedView = state.filter === 'saved';
  let mine = savedView ? data.saved.map(id => data.posts.find(p => p.id === id)).filter(p => p && visible(p)) : data.posts.filter(p => p.mine);
  if (!savedView && state.filter !== 'all') mine = mine.filter(p => p.kind === state.filter);
  main.innerHTML = `<div class="screen"><div class="page">
    ${pageHead(t('j.title'), t('j.desc'), roundBtn('settings', 'more', t('aria.settings')))}
    <div class="seg seg-page">${[['all', t('j.all')], ['today', t('kind.today')], ['ahead', t('kind.aheadShort')], ['saved', t('j.saved')]].map(([k, label]) => `<button class="${state.filter === k ? 'active' : ''}" data-action="journal-filter" data-id="${k}">${label}</button>`).join('')}</div>
    ${mine.length ? `<div class="notes">${mine.map(p => `<button class="note" data-action="${savedView ? 'post-menu' : 'note'}" data-id="${esc(p.id)}">
      <span class="note-meta">${icon(kindIcon(p))}<span>${savedView ? esc(authorName(p)) + ' · ' : ''}${esc(kindLabel(p))}</span><span class="dot">·</span><span>${esc(p.date)}</span><span class="note-scope">${icon(scopeIcon(p))}</span></span>
      <span class="note-text">${esc(L(p.text))}</span>
      ${p.reflection ? `<span class="note-reflect">${t('reflect.prefix')} · ${esc(p.reflection)}</span>` : ''}
    </button>`).join('')}</div>`
      : savedView ? `<div class="empty-state">${icon('bookmark')}<p>${t('j.savedEmpty')}</p></div>`
      : `<div class="empty-state">${icon('pencil')}<p>${t('j.empty')}</p><button class="primary" data-action="compose">${t('top.write')}</button></div>`}
    <div id="slot-journal"></div>
  </div></div>`;
}

/* Full-screen feed: only the gratitude text, with ♡ count, share and close on the right. */
function renderImmersive(keepIndex = 0) {
  const posts = data.posts.filter(p => p.scope === 'public' && !p.mine && visible(p));
  main.innerHTML = `<div class="feed-scroll imm-scroll" id="feed-scroll">${feedSequence(posts).map(it => {
    if (it.type !== 'post') return cardFor(it);
    const p = it.p, liked = data.liked.includes(p.id), text = L(p.text);
    return `<article class="post imm" data-post="${esc(p.id)}">
      <div class="post-body"><p class="post-text ${textClass(text)}">${esc(text)}</p>
        <p class="imm-by">${esc(L(p.name))} · ${esc(kindLabel(p))}</p></div>
      <aside class="post-rail">
        <button class="rail-btn ${liked ? 'liked' : ''}" data-action="like" data-id="${esc(p.id)}" aria-pressed="${liked}">${icon('heart')}<span>${p.likes + (liked ? 1 : 0)}</span></button>
        <button class="rail-btn ${data.saved.includes(p.id) ? 'saved' : ''}" data-action="save-post" data-id="${esc(p.id)}" aria-pressed="${data.saved.includes(p.id)}" aria-label="${t('save')}">${icon('bookmark')}</button>
      <button class="rail-btn" data-action="share" data-id="${esc(p.id)}">${icon('share')}<span>${t('act.share')}</span></button>
      <button class="rail-btn rail-more" data-action="post-menu" data-id="${esc(p.id)}" aria-label="${t('more')}">${icon('more')}</button>
        <button class="rail-btn" data-action="fullscreen" aria-label="${t('fs.closeAria')}">${icon('minimize')}<span>${t('fs.close')}</span></button>
      </aside></article>`;
  }).join('')}</div>
  <div class="imm-brand" aria-hidden="true"><span class="wordmark">daily <em>thanks</em></span></div>
  ${showNudge() ? `<div class="imm-nudge" id="imm-nudge" aria-hidden="true">${icon('down')}<span>${t('nudge')}</span></div>` : ''}`;
  const sc = $('#feed-scroll');
  if (keepIndex && sc) sc.scrollTop = keepIndex * sc.clientHeight;
  bindGateForm();
  if (sc && $('#imm-nudge')) sc.addEventListener('scroll', hideNudge, { passive: true });
}

/* First visit only: a faint "scroll for more" hint that goes away after the first scroll, for good. */
const NUDGE_KEY = 'daily-thanks-nudged';
let nudged = false;
try { nudged = localStorage.getItem(NUDGE_KEY) === '1'; } catch {}
const showNudge = () => !nudged;
function hideNudge() {
  const sc = $('#feed-scroll');
  if (!sc || sc.scrollTop < 40 || nudged) return;
  nudged = true;
  try { localStorage.setItem(NUDGE_KEY, '1'); } catch {}
  const n = $('#imm-nudge'); if (n) { n.classList.add('out'); setTimeout(() => n.remove(), 500); }
  sc.removeEventListener('scroll', hideNudge);
}

function render(keepIndex) {
  $('#app').classList.toggle('immersive', state.immersive);
  if (state.immersive) { renderImmersive(keepIndex); document.dispatchEvent(new CustomEvent('dt:render', { detail: { tab: 'immersive' } })); return; }
  document.querySelectorAll('[data-tab]').forEach(b => {
    const on = b.dataset.tab === state.tab;
    b.classList.toggle('active', on);
    on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
  });
  ({ feed: () => renderFeed(keepIndex), group: renderGroups, challenges: renderChallenges, journal: renderJournal })[state.tab]();
  document.dispatchEvent(new CustomEvent('dt:render', { detail: { tab: state.tab } }));
}

/* ---------------- sheets ---------------- */
const seg = (items, action, current, extra = '') => `<div class="seg ${extra}">${items.map(([id, label, ic]) => `<button type="button" class="${current === id ? 'active' : ''}" data-action="${action}" data-id="${id}">${ic ? icon(ic) : ''}<span>${label}</span></button>`).join('')}</div>`;

function compose(kind = state.composeKind, chId = state.challenge, keepText = '') {
  state.composeKind = kind; state.challenge = chId;
  state.sheetScope = state.sheetScope || 'private';
  state.sheetGroup = state.sheetGroup || data.groups[0]?.id;
  const ahead = kind === 'ahead';
  showSheet({ title: t('compose.title'), body: `<form id="compose-form" class="sheet-form">
    ${seg([['today', t('kind.today'), 'sun'], ['ahead', t('kind.aheadShort'), 'sunrise']], 'pick-kind', kind)}
    <textarea id="gratitude-text" class="big-input" maxlength="1500" rows="4" placeholder="${esc(ahead ? t('compose.phAhead') : t('compose.qToday'))}" aria-label="${esc(ahead ? t('compose.qAhead') : t('compose.qToday'))}">${esc(keepText)}</textarea>
    ${ahead ? `<div class="chips">${['work', 'relationship', 'everyday'].map(k => `<button type="button" class="chip" data-action="sample" data-id="${k}">${t('sample.' + k)}</button>`).join('')}</div>` : ''}
    <p class="field-label">${t('compose.who')}</p>
    ${seg([['private', t('scope.me'), 'lock'], ['group', t('scope.groupShort'), 'people'], ['public', t('scope.all'), 'globe']], 'pick-scope', state.sheetScope)}
    <div class="chips" id="group-chips" ${state.sheetScope === 'group' ? '' : 'hidden'}>${data.groups.map(g => `<button type="button" class="chip ${state.sheetGroup === g.id ? 'active' : ''}" data-action="pick-group" data-id="${esc(g.id)}">${esc(L(g.name))}</button>`).join('')}</div>
    <p class="hint" id="public-note" ${state.sheetScope === 'public' ? '' : 'hidden'}>${t('compose.publicNote')}</p>
    <button class="primary block" type="submit">${t('compose.submit')}</button>
  </form>` });
  $('#compose-form').addEventListener('submit', e => {
    e.preventDefault();
    const text = $('#gratitude-text').value.trim(); if (!text) { $('#gratitude-text').focus(); return; }
    const scope = state.sheetScope;
    data.posts.unshift({ id: 'p' + Date.now(), mine: true, scope, group: scope === 'group' ? state.sheetGroup : undefined, kind: state.composeKind, text, date: today(), likes: 0 });
    if (state.challenge) {
      const ch = data.challenges.find(c => c.id === state.challenge);
      const next = ch && Math.min(ch.days.length + 1, 7);
      if (ch && !ch.days.includes(next)) ch.days.push(next);
    }
    state.challenge = null;
    save(); close(); state.immersive = false; state.tab = 'journal'; render(); toast(t('toast.saved'));
  });
}

function noteSheet(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('j.title'), body: `<p class="quote">${esc(L(p.text))}</p>
    <div class="list">
      <button class="list-row" data-action="share" data-id="${esc(p.id)}"><span class="row-icon">${icon('upload')}</span><span class="row-main"><span class="row-title">${t('note.share')}</span></span></button>
      ${p.kind === 'ahead' ? `<button class="list-row" data-action="reflect" data-id="${esc(p.id)}"><span class="row-icon">${icon('pencil')}</span><span class="row-main"><span class="row-title">${t('note.reflect')}</span></span></button>` : ''}
      <button class="list-row danger" data-action="delete" data-id="${esc(p.id)}"><span class="row-icon">${icon('trash')}</span><span class="row-main"><span class="row-title">${t('note.delete')}</span></span></button>
    </div>` });
}

function reflect(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('reflect.title'), body: `<form id="reflect-form" class="sheet-form"><p class="quote">${esc(L(p.text))}</p>
    <textarea id="reflect-text" class="big-input" rows="4" placeholder="${esc(t('reflect.q'))}" aria-label="${esc(t('reflect.q'))}">${esc(p.reflection || '')}</textarea>
    <button class="primary block" type="submit">${t('reflect.submit')}</button></form>` });
  $('#reflect-form').addEventListener('submit', e => { e.preventDefault(); p.reflection = $('#reflect-text').value.trim(); save(); close(); renderJournal(); toast(t('toast.reflected')); });
}

function share(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('share.title'), body: `<div class="share-preview"><span class="wordmark">daily <em>thanks</em></span><p>${esc(L(p.text))}</p><small>${esc(authorName(p))} · ${esc(kindLabel(p))}</small></div>
    <div class="list">
      <button class="list-row" data-action="copy-share" data-id="${esc(id)}"><span class="row-icon">${icon('copy')}</span><span class="row-main"><span class="row-title">${t('share.copy')}</span></span></button>
      <button class="list-row" data-action="send-group" data-id="${esc(id)}"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${t('share.toGroup')}</span></span><span class="row-end">${icon('chevron')}</span></button>
      <button class="list-row" data-action="native-share" data-id="${esc(id)}"><span class="row-icon">${icon('upload')}</span><span class="row-main"><span class="row-title">${t('share.native')}</span></span></button>
    </div><p class="hint">${t('share.note')}</p>` });
}

function sendToGroup(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('share.toGroup'), body: `<p class="quote">${esc(L(p.text))}</p><p class="field-label">${t('send.pick')}</p>
    <div class="list">${data.groups.map(g => `<button class="list-row" data-action="send-to" data-id="${esc(id)}|${esc(g.id)}"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${esc(L(g.name))}</span></span><span class="row-end">${icon('chevron')}</span></button>`).join('')}</div>` });
}

function createGroup() {
  showSheet({ title: t('gr.createTitle'), body: `<form id="group-form" class="sheet-form">
    <input id="group-name" class="field" maxlength="30" placeholder="${esc(t('gr.ph'))}" aria-label="${esc(t('gr.name'))}" required>
    <button class="primary block" type="submit">${t('gr.create')}</button></form>` });
  $('#group-form').addEventListener('submit', e => {
    e.preventDefault(); const name = $('#group-name').value.trim(); if (!name) return;
    data.groups.push({ id: 'g' + Date.now(), name }); save(); close(); renderGroups(); toast(t('toast.grCreated'));
  });
}

function createChallenge() {
  state.sheetWith = state.sheetWith || 'pair';
  showSheet({ title: t('ch.createTitle'), body: `<form id="challenge-form" class="sheet-form">
    <input id="challenge-name" class="field" value="${esc(t('ch.defaultName'))}" maxlength="50" aria-label="${esc(t('ch.name'))}" required>
    <p class="field-label">${t('ch.with')}</p>
    <div class="chips">${[['pair', t('ch.pairShort')], ...data.groups.map(g => [g.id, L(g.name)])].map(([id, label]) => `<button type="button" class="chip ${state.sheetWith === id ? 'active' : ''}" data-action="pick-with" data-id="${esc(id)}">${esc(label)}</button>`).join('')}</div>
    <p class="hint">${t('ch.rest')}</p>
    <button class="primary block" type="submit">${t('ch.start')}</button></form>` });
  $('#challenge-form').addEventListener('submit', e => {
    e.preventDefault(); const name = $('#challenge-name').value.trim(); if (!name) return;
    data.challenges.unshift({ id: 'ch' + Date.now(), name, group: state.sheetWith, members: [{ ko: '나', en: 'Me' }], start: today(), days: [] });
    save(); close(); state.tab = 'challenges'; render(); toast(t('toast.chStarted'));
  });
}

function challengeDetail(id) {
  const ch = data.challenges.find(c => c.id === id); if (!ch) return;
  showSheet({ title: esc(L(ch.name)), body: `<p class="hint">${esc(groupName(ch.group))} · ${esc(ch.members.map(L).join(', '))}</p>${dayRow(ch)}
    <p class="quote center">${t('ch.question')}</p>
    <button class="primary block" data-action="challenge-write" data-id="${esc(ch.id)}">${t('ch.write')}</button>
    <p class="hint center">${t('ch.rest')}</p>` });
}

function notifications() {
  const s = data.settings;
  showSheet({ title: t('n.title'), body: `<div class="sheet-form">
    <div class="list">
      <label class="list-row"><span class="row-icon">${icon('bell')}</span><span class="row-main"><span class="row-title">${t('n.enable')}</span></span><input id="notify-enabled" class="switch" type="checkbox" ${s.notificationEnabled ? 'checked' : ''}></label>
      <label class="list-row"><span class="row-icon">${icon('sun')}</span><span class="row-main"><span class="row-title">${t('n.time')}</span></span><input id="notify-time" class="time-input" type="time" value="${esc(s.notificationTime)}"></label>
      <label class="list-row"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${t('n.group')}</span></span><input id="notify-group" class="switch" type="checkbox" ${s.groupUpdates ? 'checked' : ''}></label>
    </div>
    <div class="lock-preview"><span class="row-sub">Daily Thanks</span><strong>${t('n.ex1')}</strong><span>${t('n.ex2')}</span></div>
    <button class="primary block" data-action="save-notifications">${t('n.save')}</button></div>` });
}

function widget() {
  const ch = data.challenges[0];
  showSheet({ title: t('w.title'), body: `<div class="widget-surface">
    <div class="widget-card"><h3>${icon('sun')}${t('w.today')}</h3><div class="question">${t('w.q')}</div><button class="primary block" data-action="compose">${t('w.write')}</button></div>
    ${ch ? `<div class="widget-card"><h3>${icon('people')}${esc(groupName(ch.group))}</h3>${dayRow(ch)}</div>` : ''}
    </div><p class="hint">${t('w.desc')}</p>` });
}

function settings() {
  const row = (action, ic, title, end = icon('chevron'), cls = '') => `<button class="list-row ${cls}" data-action="${action}"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${title}</span></span><span class="row-end">${end}</span></button>`;
  showSheet({ title: t('s.title'), body: `
    ${seg([['ko', '한국어'], ['en', 'English']], 'set-lang', lang())}
    <div class="list">
      ${session
        ? row('logout', 'user', `${t('s.account')} · ${esc(methodName(session.method))}${session.phone ? ' ' + esc(session.phone) : ''}`, `<span class="row-link">${t('acct.logout')}</span>`)
        : `<div class="list-row static"><span class="row-icon">${icon('user')}</span><span class="row-main"><span class="row-title">${t('s.account')}</span></span><span class="row-end row-sub">${t('s.guest')}</span></div>`}
      ${row('notification', 'bell', t('s.notify'), `<span class="row-sub">${esc(data.settings.notificationTime)}</span>${icon('chevron')}`)}
      ${row('blocked', 'eyeOff', t('s.blocked'))}
      ${row('widget', 'phone', t('s.widget'))}
      ${row('fullscreen', 'maximize', t('fs.enter'))}
      ${row('export', 'copy', t('s.export'), '')}
      ${row('reset', 'reset', t('s.reset'), '', 'danger')}
    </div>
    <p class="about">${icon('info')}<span>${t('s.about')}</span></p>` });
}

/* ---------------- save · report · hide · block ---------------- */
const listRow = (action, id, ic, title, cls = '', end = '') => `<button class="list-row ${cls}" data-action="${action}" data-id="${esc(id)}"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${title}</span></span>${end ? `<span class="row-end">${end}</span>` : ''}</button>`;

function keepPlace() { const sc = $('#feed-scroll'); return sc ? Math.round(sc.scrollTop / sc.clientHeight) : 0; }

function toggleSave(id) {
  const i = data.saved.indexOf(id);
  i >= 0 ? data.saved.splice(i, 1) : data.saved.unshift(id);
  save(); render(keepPlace()); toast(t(i >= 0 ? 'saved.off' : 'saved.on'));
}

function postMenu(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  if (p.mine) return noteSheet(id);
  const saved = data.saved.includes(id);
  showSheet({ title: esc(L(p.name)), body: `<p class="quote">${esc(L(p.text))}</p>
    <div class="list">
      ${listRow('save-post', id, 'bookmark', saved ? t('menu.unsave') : t('save'))}
      ${listRow('share', id, 'upload', t('note.share'))}
      ${listRow('hide-post', id, 'eyeOff', t('menu.hide'))}
      ${listRow('block-author', id, 'ban', t('menu.block'), 'danger')}
      ${listRow('report', id, 'flag', t('menu.report'), 'danger', icon('chevron'))}
    </div>` });
}

const REPORT_REASONS = ['spam', 'hate', 'violence', 'sexual', 'false', 'privacy', 'selfharm', 'other'];
function reportSheet(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('report.title'), body: `<p class="page-desc" style="margin:0 0 6px">${t('report.q')}</p>
    <div class="list">${REPORT_REASONS.map(r => listRow('report-reason', `${id}|${r}`, r === 'selfharm' ? 'info' : 'flag', t('report.' + r), '', icon('chevron'))).join('')}</div>
    <p class="hint">${t('report.anon')}</p>` });
}
function reportReason(pair) {
  const [id, reason] = pair.split('|');
  if (reason !== 'other') return submitReport(id, reason, '');
  showSheet({ title: t('report.other'), body: `<form id="report-form" class="sheet-form">
    <textarea id="report-text" class="big-input" rows="4" maxlength="500" placeholder="${esc(t('report.otherPh'))}"></textarea>
    <button class="primary block" type="submit">${t('report.send')}</button></form>` });
  $('#report-form').addEventListener('submit', e => { e.preventDefault(); submitReport(id, 'other', $('#report-text').value.trim()); });
}
function submitReport(id, reason, note) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  const report = { id: 'r' + Date.now(), postId: id, author: authorKey(p), reason, note, at: new Date().toISOString() };
  data.reports.push(report); save();
  document.dispatchEvent(new CustomEvent('dt:report', { detail: report })); // full-stack client forwards this to the server
  showSheet({ title: t('report.title'), body: `<div class="report-done">${icon('check')}<p class="row-title">${t('report.done')}</p><p class="hint">${t('report.doneSub')}</p></div>
    ${reason === 'selfharm' ? `<div class="help-box"><p>${t('report.help')}</p><strong>${t('report.help1')}</strong><span>${t('report.help2')}</span></div>` : ''}
    <div class="list">
      ${listRow('hide-post', id, 'eyeOff', t('menu.hide'))}
      ${listRow('block-author', id, 'ban', t('menu.block'), 'danger')}
    </div>
    <button class="secondary block" data-action="close" style="margin-top:12px">${t('done')}</button>` });
}
function hidePost(id) {
  if (!data.hidden.includes(id)) data.hidden.push(id);
  save(); close(); render(keepPlace()); toast(t('hidden.done'));
}
function blockAuthor(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  const name = L(p.name);
  confirmSheet(t('menu.block'), esc(t('block.confirm').replace('{name}', name)), t('block.ok'), () => {
    const key = authorKey(p);
    if (!data.blocked.includes(key)) data.blocked.push(key);
    save(); render(keepPlace()); toast(t('blocked.done').replace('{name}', name));
  });
}
function blockedSheet() {
  const posts = data.hidden.map(id => data.posts.find(p => p.id === id)).filter(Boolean);
  const nameOf = key => { const p = data.posts.find(x => authorKey(x) === key); return p ? L(p.name) : key; };
  showSheet({ title: t('s.blocked'), body: !posts.length && !data.blocked.length ? `<p class="hint">${t('blocked.none')}</p>` : `
    ${data.blocked.length ? `<p class="field-label">${t('blocked.users')}</p><div class="list">${data.blocked.map(k => `<div class="list-row static"><span class="row-icon">${icon('user')}</span><span class="row-main"><span class="row-title">${esc(nameOf(k))}</span></span><button class="secondary" data-action="unblock" data-id="${esc(k)}">${t('unblock')}</button></div>`).join('')}</div>` : ''}
    ${posts.length ? `<p class="field-label">${t('blocked.posts')}</p><div class="list">${posts.map(p => `<div class="list-row static"><span class="row-main"><span class="row-title clamp">${esc(L(p.text))}</span><span class="row-sub">${esc(L(p.name))}</span></span><button class="secondary" data-action="unhide" data-id="${esc(p.id)}">${t('restore')}</button></div>`).join('')}</div>` : ''}` });
}

/* ---------------- sign-in ---------------- */
function completeLogin(method, extra = {}) {
  setSession({ method, since: new Date().toISOString(), ...extra });
  const hadCompose = !!$('#compose-card');
  close(); render(); toast(t('login.done'));
  const sc = $('#feed-scroll'); // land on the post that comes right after the cards
  if (sc && state.tab === 'feed' && state.feed === 'public') sc.scrollTop = (GATE_AFTER + (hadCompose ? 1 : 0)) * sc.clientHeight;
}
function phoneLogin() {
  showSheet({ title: t('phone.title'), body: `<form id="phone-form">
    <label class="field-label" for="phone-number">${t('phone.number')}</label>
    <input id="phone-number" class="field" type="tel" inputmode="tel" autocomplete="tel" placeholder="010-1234-5678" required>
    <div id="code-step" hidden><label class="field-label" for="phone-code">${t('phone.code')}</label>
    <input id="phone-code" class="field" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"></div>
    <p class="hint">${t('phone.demo')}</p>
    <button class="primary block" type="submit" id="phone-submit">${t('phone.send')}</button></form>` });
  let step = 1;
  $('#phone-form').addEventListener('submit', e => {
    e.preventDefault();
    const digits = $('#phone-number').value.replace(/\D/g, '');
    if (step === 1) {
      if (digits.length < 9) { toast(t('phone.bad')); return; }
      step = 2; $('#code-step').hidden = false; $('#phone-submit').textContent = t('phone.verify'); $('#phone-code').focus(); toast(t('phone.sent'));
    } else {
      if (!/^\d{6}$/.test($('#phone-code').value)) { toast(t('phone.badCode')); return; }
      completeLogin('phone', { phone: digits.slice(0, 3) + '****' + digits.slice(-4) });
    }
  });
}
const methodName = m => ({ apple: 'Apple', google: 'Google', phone: lang() === 'ko' ? '휴대폰' : 'Phone' })[m] || m;

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
  next: () => { const sc = $('#feed-scroll'); sc?.scrollBy({ top: sc.clientHeight, behavior: 'smooth' }); },
  settings, notification: notifications, widget, close,
  'toggle-lang': () => setLang(lang() === 'ko' ? 'en' : 'ko'),
  'set-lang': id => setLang(id),
  like, share, 'send-group': sendToGroup, reflect,
  'pick-kind': id => compose(id, state.challenge, $('#gratitude-text')?.value || ''),
  'pick-scope': id => {
    state.sheetScope = id;
    document.querySelectorAll('[data-action="pick-scope"]').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    $('#group-chips').hidden = id !== 'group'; $('#public-note').hidden = id !== 'public';
  },
  'pick-group': id => { state.sheetGroup = id; document.querySelectorAll('[data-action="pick-group"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  'pick-with': id => { state.sheetWith = id; document.querySelectorAll('[data-action="pick-with"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  note: noteSheet,
  'save-post': toggleSave,
  'post-menu': postMenu,
  report: reportSheet,
  'report-reason': reportReason,
  'hide-post': hidePost,
  'block-author': blockAuthor,
  blocked: blockedSheet,
  unblock: key => { data.blocked = data.blocked.filter(k => k !== key); save(); render(); blockedSheet(); },
  unhide: id => { data.hidden = data.hidden.filter(x => x !== id); save(); render(); blockedSheet(); },
  'send-to': pair => {
    const [id, g] = pair.split('|'); const p = data.posts.find(x => x.id === id); if (!p) return;
    data.posts.unshift({ ...clone(p), id: 'repost' + Date.now(), scope: 'group', group: g, mine: false, name: p.mine ? { ko: '나', en: 'Me' } : p.name, sharedFrom: { ko: '공유', en: 'shared' }, likes: 0 });
    save(); close(); state.immersive = false; state.tab = 'feed'; state.feed = 'group'; state.group = g; render(); toast(t('toast.sent'));
  },
  sample: id => { const ta = $('#gratitude-text'); ta.value = SAMPLES[lang()][id]; ta.focus(); },
  'journal-filter': id => { state.filter = id; renderJournal(); },
  delete: id => confirmSheet(t('j.delete'), t('j.confirmDelete'), t('j.delete'), () => { data.posts = data.posts.filter(p => p.id !== id); save(); render(); }),
  'copy-share': id => { const p = data.posts.find(x => x.id === id); if (p) copyText(`${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks`); },
  'native-share': id => {
    const p = data.posts.find(x => x.id === id);
    if (navigator.share && p) navigator.share({ title: 'Daily Thanks', text: `${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks` }).catch(() => {});
    else toast(t('toast.noShare'));
  },
  'new-group': createGroup,
  'open-group': id => { state.tab = 'feed'; state.feed = 'group'; state.group = id; render(); },
  'new-challenge': createChallenge,
  'challenge-write': id => { close(); compose('today', id); },
  compose: () => compose('today', null),
  'challenge-detail': challengeDetail,
  'save-notifications': () => {
    Object.assign(data.settings, { notificationTime: $('#notify-time').value, notificationEnabled: $('#notify-enabled').checked, groupUpdates: $('#notify-group').checked });
    save(); close(); toast(t('toast.nSaved'));
  },
  export: exportData,
  fullscreen: toggleFullscreen,
  login: id => id === 'phone' ? phoneLogin() : completeLogin(id),
  logout: () => { setSession(null); close(); render(); toast(t('acct.loggedOut')); },
  'gate-scope': id => { state.composeScope = id; document.querySelectorAll('[data-action="gate-scope"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  'gate-later': () => { const sc = $('#feed-scroll'), card = $('#compose-card'); if (sc && card) sc.scrollTo({ top: card.offsetTop + sc.clientHeight, behavior: 'smooth' }); },
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

/* Extension hook for optional add-ons (e.g. fullstack/public/client.js): server sync and
   feature-flagged screens. The plain front-end app never uses it, so nothing changes visually. */
window.DailyThanks = {
  getData: () => data,
  replaceData: next => { if (next && Array.isArray(next.posts)) { data = next; try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} applyStatic(); render(); } },
  lang, t, esc, icon, showSheet, close, toast, render: () => render(), getSession: () => session
};

/* Full screen: hides the browser's bars (Fullscreen API). iPhone Safari has no API for pages,
   so there we explain "Add to Home Screen", which opens the app full screen. */
const fsElement = () => document.fullscreenElement || document.webkitFullscreenElement;
const isFull = () => !!fsElement();
const fsSupported = () => !!(document.fullscreenEnabled || document.webkitFullscreenEnabled);
// "Full screen" = the in-app full-screen feed; where the browser allows it, the browser bars hide too.
async function toggleFullscreen() {
  close();
  const sc = $('#feed-scroll'), idx = sc ? Math.round(sc.scrollTop / sc.clientHeight) : 0;
  const entering = !state.immersive;
  state.immersive = entering;
  if (entering) { state.tab = 'feed'; state.feed = 'public'; }
  render(state.tab === 'feed' && state.feed === 'public' ? idx : 0);
  if (!fsSupported()) return;
  const root = document.documentElement;
  try {
    if (!entering && isFull()) await (document.exitFullscreen || document.webkitExitFullscreen).call(document);
    else if (entering && !isFull()) await (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
  } catch { /* browser full screen is optional; the in-app full screen already applies */ }
}
function updateFsButton() {
  const b = $('#fs-btn'); if (!b) return;
  b.hidden = false;
  b.innerHTML = `${icon(state.immersive ? 'minimize' : 'maximize')}<span>${state.immersive ? t('fs.exit') : t('fs.enter')}</span>`;
  b.setAttribute('aria-pressed', String(state.immersive));
}
// Leaving browser full screen with Esc also closes the in-app full-screen feed.
const onFsChange = () => { if (!isFull() && state.immersive && fsWasOn) { state.immersive = false; render(); } fsWasOn = isFull(); updateFsButton(); };
let fsWasOn = false;
document.addEventListener('fullscreenchange', onFsChange);
document.addEventListener('webkitfullscreenchange', onFsChange);
document.addEventListener('dt:render', updateFsButton);

applyStatic();
render();

/* Splash: white screen with the wordmark only, then fades into the app (tap to skip). */
const splash = $('#splash');
if (splash) {
  let gone = false;
  const hide = () => {
    if (gone) return; gone = true; splash.classList.add('out'); setTimeout(() => splash.remove(), 600);
    ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(ev => window.removeEventListener(ev, hide, true));
  };
  // The splash never blocks input (pointer-events: none): the first swipe or wheel scrolls the feed
  // underneath right away, and any touch, scroll or key press fades the splash out immediately.
  ['pointerdown', 'touchstart', 'wheel', 'keydown'].forEach(ev => window.addEventListener(ev, hide, { capture: true, passive: true }));
  setTimeout(hide, 1800);
}
})();
