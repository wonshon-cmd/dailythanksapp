/* Daily Thanks — dependency-free offline prototype (Korean / English).
   No accounts, server, push, Kakao or Instagram integration. Data lives in this browser's localStorage. */
(() => {
'use strict';
// The same code runs two apps: daily thanks, and daily bible (window.DT_APP = 'bible'), sharing one set of data.
const BIBLE_MODE = window.DT_APP === 'bible';

const KEY = 'daily-thanks-v4'; // v3: seeds include share/save counts and a week of my notes

/* ---------------- strings ---------------- */
const STR = {
  ko: {
    'snz.ok': "끄기", 'snz.title': "무엇을 끌까요?", 'snz.what': "끌 것", 'snz.all': "전부", 'snz.for': "얼마 동안", 'snz.until': "다시 켤 때까지", 'snz.hint': "설정 › 보기 설정에서 언제든 다시 켤 수 있어요.", 'mc.title': "내 공동체", 'mc.ph': "교회·소그룹·챕터·수련회 코드", 'mc.connect': "연결", 'mc.none': "받은 코드를 넣으면 공동체와 연결돼요.", 'mc.bad': "코드를 확인해 주세요.", 'mc.needSign': "공동체와 연결하려면 로그인해 주세요. 로그인하면 바로 연결돼요.", 'mc.joining': "연결 중…", 'mc.admin': "관리자", 'mc.quiet': "조용히", 'mc.loud': "알림 켜기", 'mc.quietOn': "조용히 · 새 글 표시와 알림 없음", 'mc.quietDone': "조용히 해 두었어요. 새 글 표시와 알림이 오지 않아요.", 'mc.loudDone': "다시 알려 드릴게요.", 'mc.leave': "나가기", 'mc.leaveQ': "‘{name}’에서 나갈까요? 다시 들어오려면 코드나 초대 링크가 필요해요.", 'mc.left': "공동체에서 나왔어요.", 'mc.ownerStay': "관리자는 나갈 수 없어요. 공동체 관리에서 정리해 주세요.", 'join.pendingShort': "승인 대기",
    'tour.k.verse': "오늘의 말씀", 'tour.k.prayer': "공동체 기도제목", 'tour.k.thanks': "감사", 'tour.s.verse': "밀어 올리며 성경을 읽어요", 'tour.s.prayer': "공동체의 기도제목을 바로 받아 봐요", 'tour.s.thanks': "나의 감사를 함께 나눠요", 'tour.f.title': "이런 것도 있어요", 'tour.f.read': "읽기", 'tour.f.readSub': "오늘의 본문, 이어 읽기, 함께 읽는 계획", 'tour.f.notes': "설교 노트", 'tour.f.notesSub': "설교를 녹음하면 노트로 정리돼요", 'tour.f.group': "공동체", 'tour.f.groupSub': "만들고, 초대 링크로 함께해요",
    'tour.skip': "건너뛰기", 'tour.done': "시작하기", 'tour.again': "둘러보기 다시 보기",
    'wl.title': "반가워요", 'wl.nameQ': "처음 오셨네요. 이름을 알려 주세요. 감사 카드와 공동체에서 이 이름이 보여요.", 'wl.next': "다음", 'wl.hi': "{name}님, 반가워요", 'wl.sub': "가입하면 기기를 바꿔도 이어서 쓰고, 공동체와 함께할 수 있어요.", 'wl.google': "Google로 계속하기", 'wl.ms': "Microsoft로 계속하기", 'wl.kakao': "카카오로 계속하기", 'wl.email': "메일로 계속하기", 'wl.phone': "휴대폰 문자로 계속하기", 'wl.notYet': "이 방법은 곧 열려요. 지금은 메일로 계속해 주세요.",
    'bp.thankSomeone': "감사 전하기",
    'adm.topLeaders': "순장도 ‘가장 꾸준한 사람’ 보기",
    'cl.title': "로그인", 'cl.name': "이름", 'cl.namePh': "감사 카드에 보내는 사람으로 보여요", 'cl.email': "메일 주소", 'cl.send': "로그인 링크 받기", 'cl.sending': "보내는 중…", 'cl.badEmail': "메일 주소를 확인해 주세요.", 'cl.sendFail': "메일을 보내지 못했어요. 잠시 뒤에 다시 해 주세요.", 'cl.tooMany': "메일을 너무 자주 보냈어요. 잠시 뒤에 다시 해 주세요.", 'cl.sentTitle': "메일을 확인해 주세요", 'cl.sentBody': "{email}로 로그인 링크를 보냈어요. 메일의 링크를 누르면 바로 로그인돼요.", 'cl.code': "메일에 숫자 코드가 있다면", 'cl.verify': "코드로 로그인", 'cl.codeBad': "코드가 맞지 않거나 시간이 지났어요.", 'cl.resend': "메일 다시 보내기", 'cl.resent': "메일을 다시 보냈어요.", 'cl.linkBad': "로그인 링크가 만료되었어요. 다시 받아 주세요.", 'cl.needGroup': "공동체를 만들려면 먼저 로그인해 주세요. 초대한 사람만 들어올 수 있어요.", 'cl.needJoin': "‘{name}’에 들어가려면 로그인해 주세요. 로그인하면 바로 참여돼요.", 'cl.badInvite': "초대 링크가 바뀌었거나 없어졌어요. 새 링크를 받아 주세요.", 'cl.fail': "저장하지 못했어요. 인터넷 연결을 확인해 주세요.", 'cl.waiting': "참여 요청", 'cl.approve': "승인", 'cl.decline': "거절", 'cl.approved': "승인했어요.", 'cl.removed': "공동체에서 내보냈어요.", 'cl.noName': "이름 없음", 'cl.signIn': "로그인",
    's.legal': '정보', 's.privacy': '개인정보처리방침', 's.terms': '이용약관', 's.support': '문의하기', 's.delete': '계정 삭제', 'del.body': '계정과 내가 쓴 감사, 저장·좋아요 기록이 모두 삭제돼요. 삭제하면 되돌릴 수 없어요.', 'del.ok': '삭제', 'del.done': '계정을 삭제했어요. 함께해 주셔서 고마웠어요.', 's.version': '버전',
    'card.feed': '피드 4:5', 'card.story': '스토리 9:16', 'card.shareImg': '이미지로 공유', 'card.noShare': '이 화면에서는 이미지 공유가 막혀 있어요. 앱에서는 바로 인스타그램·카카오톡으로 보낼 수 있어요.',
    'wg.title': '홈 화면 위젯', 'wg.sub': '오늘의 말씀 · 오늘의 감사 · 오늘의 묵상. 원하는 것을 홈 화면에 두고, 누르면 바로 쓸 수 있어요.',
    'wg.ios': '아이폰', 'wg.android': '안드로이드', 'wg.write': '한 줄 쓰기', 'wg.done': '오늘 감사 완료',
    'wg.iosSteps': '홈 화면 빈 곳을 길게 누르기|왼쪽 위 「+」 누르기|「Daily Thanks」 찾기|원하는 크기를 골라 「위젯 추가」',
    'wg.androidSteps': '홈 화면 빈 곳을 길게 누르기|「위젯」 누르기|「Daily Thanks」 찾기|위젯을 길게 눌러 홈 화면에 놓기',
    'wg.ok': '추가했어요', 'wg.later': '나중에 할게요', 'wg.okToast': '이제 홈 화면에서 바로 감사를 남길 수 있어요.', 'wg.laterToast': '설정 › 홈 위젯에서 언제든 다시 볼 수 있어요.',
    'wg.note': '시안에서는 미리보기예요. 실제 위젯은 앱을 설치하면 추가할 수 있어요.',
    'vis.public': '모두', 'vis.private': '비공개', 'vis.me': '나만 보기', 'vis.privateHint': "나만 보거나, 고른 공동체 사람들만 볼 수 있어요. 공동체는 여러 개 고를 수 있어요.",
    'inf.people': '{n}명에게 닿았어요', 'inf.peopleBig': '{n}명', 'inf.peopleSub': '나의 감사가 닿은 사람', 'inf.peopleNote': '좋아요·저장·공유로 마음을 표현한 사람 수예요. 실제 앱에서는 카카오톡·인스타그램으로 공유된 링크를 열어 본 사람도 더해져요.',
    'ft.title': '기능 (켜서 쓰기)', 'ft.hint': '기본은 감사만이에요. 필요한 기능만 켜서 쓰세요.',
    'ft.groupShare': '공동체 나눔', 'ft.groupShareSub': '공동체에서 이번 주 질문에 함께 답해요.',
    'ft.prayer': '기도제목 나눔', 'ft.prayerSub': '기도제목을 올리고 「기도했어요」로 함께 기도해요.',
    'ft.sermon': "설교 자동 요약", 'ft.sermonSub': '설교를 녹음하면 설교 노트로 정리해요.',
    'ft.on': '{name}을(를) 켰어요.', 'ft.off': '{name}을(를) 껐어요.',
    'kind.prayer': '기도제목', 'pr.ph': '함께 기도받고 싶은 것을 나눠 주세요.', 'pr.prayed': '기도했어요', 'pr.prayedToast': '함께 기도했어요.', 'pr.count': '{n}명이 기도했어요', 'pr.section': '기도제목', 'pr.empty': '아직 올라온 기도제목이 없어요.', 'pr.who': '기도한 사람',
    'gs.section': '이번 주 나눔', 'gs.answers': '나눔 {n}개', 'gs.write': '나눔 쓰기', 'gs.view': '나눔 보기', 'gs.ph': '이번 주 질문에 대한 나의 생각을 나눠 주세요.', 'gs.saved': '공동체에 나눴어요.', 'gs.empty': '아직 나눔이 없어요. 처음으로 나눠 보세요.',
    'sm.section': '설교 노트', 'sm.new': '새 설교 노트', 'sm.empty': '설교를 녹음하거나 받아쓴 글을 붙여 넣으면 노트로 정리해 드려요.', 'sm.record': '녹음 파일 올리기', 'sm.paste': '받아쓴 글 붙여 넣기', 'sm.title': '설교 제목 (선택)', 'sm.preacher': '설교자 (선택)', 'sm.make': '요약 만들기', 'sm.demo': "시안에서는 예시 요약을 보여드려요. 실제 앱에서는 녹음을 글로 옮기고 자동으로 요약해요.",
    'sm.passages': '본문', 'sm.main': '핵심 메시지', 'sm.points': '말씀 요점', 'sm.apply': '삶의 적용', 'sm.prayer': '기도제목', 'sm.questions': '나눔 질문', 'sm.toGroup': '공동체 나눔 질문으로 보내기',
    'np.title': '매일의 감사가<br>삶을 풍성하게 합니다.', 'np.sub': 'Daily gratitude makes life richer',
    'np.r1': '하루 한 번, 내가 고른 시간에만 알려드려요.', 'np.r2': '이미 감사를 쓴 날은 알리지 않아요.', 'np.r3': '공동체 소식은 모아서 조용히 전해요.',
    'np.when': '언제 알려드릴까요?', 'np.dawn': '새벽', 'np.morning': '아침', 'np.evening': '저녁', 'np.dawnSub': '하루를 맡기며', 'np.morningSub': '하루를 열며', 'np.eveningSub': '하루를 돌아보며', 'np.other': '다른 시간',
    'np.allow': '알림 받기', 'np.later': '나중에 할게요', 'np.on': '매일 {time}에 조용히 알려드릴게요.', 'np.blocked': '{time}로 저장했어요. 지금 화면에서는 알림 권한을 받을 수 없어서, 앱에서 다시 여쭤볼게요.', 'np.laterToast': '설정 › 알림 시간에서 언제든 켤 수 있어요.', 'np.test': '알림이 이렇게 와요. 오늘 감사한 것 하나를 남겨 볼까요?',
    'dq.label': '오늘의 질문',
    'cal.title': '{m}월 · 감사한 날 {n}일', 'cal.recap': '이번 주 돌아보기', 'cal.dayEmpty': '이 날은 기록이 없어요.',
    'mem.label': '다시 보는 감사', 'mem.ago': '{n}일 전', 'mem.week': '일주일 전 오늘', 'mem.month': '한 달 전 오늘', 'mem.year': '1년 전 오늘',
    'rc.title': '이번 주 돌아보기', 'rc.count': '이번 주 {n}일 감사했어요', 'rc.notes': '감사 {n}개', 'rc.empty': '이번 주에는 아직 기록이 없어요.', 'rc.share': '이번 주 감사 공유하기', 'rc.shareHead': '이번 주 나의 감사',
    'ms.title': '감사 {n}개를 모았어요', 'ms.body': '하나하나가 하루를 비춘 작은 빛이에요. 앞으로도 천천히 함께 쌓아가요.',
    'share.kakao': '카카오톡으로 보내기', 'share.insta': '인스타그램에 공유하기', 'share.outNote': '카카오톡·인스타그램 공유는 더 많은 사람에게 닿아서 영향력이 크게 올라가요.', 'share.copied': '복사했어요. 인스타그램에 붙여 넣어 공유해 보세요.',
    'inf.ext': '그중 카카오톡·인스타그램 공유 {n}번',
    'kind.thanks': '감사 전하기', 'ty.to': '받는 사람 이름', 'ty.ph': '전하고 싶은 감사 인사를 적어 보세요.', 'ty.make': '감사 카드 만들기', 'ty.card': '감사 카드', 'ty.send': '보내기',
    'ty.copy': '텍스트 복사', 'ty.toGroup': '공동체에 나누기', 'ty.saved': '감사 카드를 나의 감사에 남겨 두었어요.', 'ty.needName': '받는 사람 이름을 적어 주세요.',
    'inf.title': '나의 감사 영향력', 'inf.received': '받은 마음', 'inf.given': '건넨 마음', 'inf.likes': '좋아요', 'inf.shares': '공유', 'inf.saves': '저장', 'inf.score': '점',
    'inf.candle': '촛불', 'inf.lantern': '등불', 'inf.sunlight': '햇살', 'inf.starlight': '별빛', 'inf.glow': '감사가 퍼질수록 빛이 밝아져요.', 'inf.next': '{level}까지 {n}점', 'inf.max': '가장 높은 단계예요',
    'inf.top': '이번 주 많이 닿은 감사', 'inf.how': '내 글이 받은 좋아요 1점 · 저장 2점 · 앱 안 공유 3점 · 카카오톡·인스타그램 공유 5점으로 계산해요. 순위를 겨루기보다, 감사가 얼마나 멀리 퍼졌는지 보여주는 숫자예요.',
    'inf.week': '이번 주 감사', 'top.badge': '많이 닿은 감사',
    'cel.title': '일주일 동안 매일 감사했어요', 'cel.body': '작은 감사가 하루하루 쌓여 한 주가 되었어요. 정말 멋져요. 다음 한 주도 천천히 함께 걸어요.', 'cel.ok': '계속하기', 'cel.share': '공유하기',
    'cel.shareText': '일주일 동안 매일 감사를 남겼어요. — Daily Thanks', 'cel.mid': '{n}일째 감사를 이어가고 있어요. 멋져요!',
    'mod.title': '이대로는 올릴 수 없어요', 'mod.body': '다른 사람에게 상처가 될 수 있는 표현이 있어요.', 'mod.found': '걸린 표현', 'mod.edit': '고쳐 쓰기', 'mod.private': '나만 보기로 남기기',
    'mod.appeal': '잘못 걸렸다면 검토 요청하기', 'mod.appealNote': '관리자가 확인한 뒤 문제가 없으면 그대로 올라가요.', 'mod.appealed': '관리자에게 검토를 요청했어요. 결과는 나의 감사에서 볼 수 있어요.',
    'mod.review': '검토 중', 'mod.rejected': '올라가지 않음', 'mod.privateOk': '모든 글은 나만 보기로는 언제든 남길 수 있어요.',
    'size.title': '글자 크기', 'size.s': '작게', 'size.m': '보통', 'size.l': '크게', 'readMore': '더 보기',
    'save': '저장', 'saved.on': '저장했어요. 나의 감사 › 저장에서 볼 수 있어요.', 'saved.off': '저장을 취소했어요.', 'j.saved': '저장', 'j.savedEmpty': '저장한 감사가 없어요. 마음에 남는 글에서 저장을 눌러 보세요.',
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
    'send.pick': '어느 공동체에 나눌까요?',
    'share.note': '공개된 글이나 허락받은 글만 공유해 주세요.',
    'share.toGroup': '공동체에 나누기',
    'compose.publicNote': '모두의 감사는 누구나 읽고 공유할 수 있어요.',
    'scope.all': '모두',
    'scope.groupShort': '공동체',
    'scope.me': '나만',
    'kind.aheadShort': '미리 감사',
    'gr.count': '감사 {n}개',
    'doc.title': 'Daily Thanks · 감사가 이어지는 하루',
    'aria.home': 'Daily Thanks 홈', 'aria.settings': '설정', 'aria.nav': '주요 메뉴', 'aria.lang': 'Switch to English', 'aria.close': '닫기', 'aria.next': '다음 감사',
    'lang.other': 'EN',
    'top.write': '감사 쓰기',
    'nav.today': '오늘', 'nav.group': '공동체', 'nav.challenge': '함께 7일', 'nav.journal': '나의 감사',
    'feed.mygroup': '내 공동체', 'feed.public': '모두의 감사',
    'feed.subPublic': '서로의 하루에서 발견한 감사', 'feed.subGroup': '우리 공동체가 함께 나눈 감사',
    'feed.together': '함께 7일',
    'feed.empty': '아직 이곳에 올라온 감사가 없어요.<br>첫 번째 감사를 나눠보세요.',
    'feed.swipe': '위로 넘겨 다음 감사',
    'kind.today': '오늘의 감사', 'kind.ahead': '미리 감사 · 기도',
    'meta.today': '오늘의 기록', 'meta.ahead': '이번 주의 기도', 'meta.shared': '공유한 감사',
    'scope.public': '모두의 감사', 'scope.private': '나만 보기', 'scope.group': '공동체',
    'act.share': '공유', 'act.group': '공동체',
    'me': '나', 'reflect.prefix': '돌아보며',
    'toast.likeAhead': '함께 기도해요.', 'toast.likeToday': '함께 감사해요.',
    'compose.title': '감사 한 줄',
    'compose.qToday': '오늘 감사한 것은?', 'compose.qAhead': '미리 감사하며 하나님께 맡기는 일은?',
    'compose.phToday': '오늘 감사한 것을 적어보세요.', 'compose.phAhead': '하나님, 이번 한 주도…',
    'compose.samples': '문장을 눌러 수정해 보세요',
    'sample.work': '직장에서', 'sample.relationship': '관계에서', 'sample.everyday': '일상에서',
    'compose.who': '누구와 나눌까요?', 'compose.private': '나만 보기 (기본)', 'compose.group': '내 공동체', 'compose.public': '전체 공개',
    'compose.groupLabel': '공동체',
    'compose.hint': '개인적인 기도는 나만 보기로 안전하게 남길 수 있어요. 공개하면 다른 사람도 읽고 공유할 수 있습니다.',
    'compose.submit': '남기기', 'toast.saved': '감사가 저장되었어요.',
    'reflect.title': '돌아보며 감사 쓰기', 'reflect.before': '그때 드린 미리 감사', 'reflect.q': '이번 주에 실제로 발견한 감사는?', 'reflect.ph': '작은 순간도 좋아요.', 'reflect.submit': '덧붙이기', 'toast.reflected': '한 주의 감사가 더해졌어요.',
    'share.title': '감사 공유', 'share.hint': '실제 카카오톡·인스타그램 연결 전 미리보기입니다. 공개 또는 본인이 허락한 내용만 공유하세요.', 'share.copy': '텍스트 복사', 'share.native': '다른 앱으로 공유', 'share.hint2': '카카오톡·인스타그램 공유는 휴대폰의 기본 공유 기능을 사용할 수 있지만, 플랫폼별 전용 카드·게시 기능은 별도 연동이 필요합니다.', 'toast.copied': '글을 복사했어요.', 'toast.noShare': '이 환경에서는 기기 공유를 사용할 수 없어요.',
    'send.title': '공동체에 나누기', 'send.hint': '원작자가 공유한 글은 작성자 표시를 유지하세요. 비공개 글은 다른 사람에게 보내기 전에 허락을 받으세요.', 'send.target': '공유할 공동체', 'send.submit': '이 그룹에 나누기', 'toast.sent': '그룹에 나누었어요.',
    'ch.kicker': '7 DAYS TOGETHER', 'ch.title': '동행', 'ch.desc': '친구나 공동체와 일곱 번의 감사를 채워요. 하루 쉬어도 이어갈 수 있어요.', 'ch.new': '새 챌린지', 'ch.write': '오늘의 감사 쓰기', 'ch.detail': '자세히 보기', 'ch.day': '일',
    'ch.fine': '오프라인 시안에서는 참여 인원과 완료 상태가 이 브라우저에만 저장됩니다. 실제 친구 초대는 서버와 사용자 계정 연동이 필요합니다.',
    'ch.createTitle': '동행 시작하기', 'ch.name': '이름', 'ch.defaultName': '함께 걷는 동행', 'ch.with': '누구와 함께하나요?', 'ch.pair': '친구와 둘이 (초대 링크는 출시 이후)', 'ch.pairShort': '친구와 둘이',
    'ch.createHint': '한 주 중 하루를 놓쳐도 시작부터 다시 하지 않아요. 실제 친구 초대·실시간 동기화는 백엔드 구현 후 이용할 수 있습니다.', 'ch.start': '시작하기', 'toast.chStarted': '동행이 시작됐어요.',
    'ch.question': '오늘 감사하고 싶은 사람은 누구인가요?', 'ch.detailHint': '한 사람이 글을 썼을 때 모든 참가자의 참여로 계산하지 않도록, 실제 서비스에서는 사용자별 체크인 기록이 필요합니다.', 'ch.rest': '하루 쉬어도, 다시 이어가요.',
    'gr.kicker': 'SMALL GROUPS', 'gr.title': '공동체', 'gr.desc': '가까운 사람들과만 나누는 감사예요.', 'gr.new': '새 공동체', 'gr.posts': '개의 감사', 'gr.open': '피드 보기',
    'gr.createTitle': '새 공동체', 'gr.name': '공동체 이름', 'gr.ph': '예: 수요 성경공부', 'gr.create': '만들기', 'toast.grCreated': '공동체가 만들어졌어요.', 'gr.fine': '실제 초대·가입·권한 관리는 서버 연동 후 제공됩니다.',
    'j.kicker': 'MY GRATITUDE', 'j.title': '나의 감사', 'j.desc': '오늘의 감사와 미리 드린 감사가 여기에 쌓여요.', 'j.all': '전체', 'j.new': '＋ 새로운 감사 쓰기', 'j.empty': '아직 기록된 감사가 없어요.', 'j.reflect': '돌아보며 감사 쓰기', 'j.delete': '삭제', 'j.confirmDelete': '이 감사 기록을 삭제할까요?',
    'n.title': '나의 감사 시간', 'n.hint': '매일 부담 없이 한 줄을 남기도록, 내가 정한 시간에 한 번만 알려주는 흐름을 설계했어요.', 'n.time': '감사 알림 시간', 'n.enable': '매일 감사 알림', 'n.group': '그룹 소식 모아 받기', 'n.example': '잠금 화면 알림 예시', 'n.ex1': '오늘 감사한 것 하나', 'n.ex2': '작은 일도 좋아요. 한 줄로 남겨볼까요?', 'n.save': '저장', 'n.fine': '이 화면은 기기에 실제 푸시 알림을 예약하지 않습니다. 실제 알림은 권한 요청 및 네이티브 앱/웹 푸시 설정이 필요합니다.', 'toast.nSaved': '데모 설정이 저장되었어요.',
    'w.title': '홈 화면 위젯', 'w.desc': '실제 iPhone 위젯이 아닌 홈 화면 디자인 미리보기예요.', 'w.today': '오늘의 감사', 'w.q': '오늘 나를 웃게 한 일은?', 'w.write': '＋ 한 줄 쓰기', 'w.sub': '함께하는 7일', 'w.view': '챌린지 보기', 'w.fine': '실제 위젯 설치·위젯에서 앱 열기는 iOS/Android 네이티브 개발 단계에서 구현해야 합니다.',
    's.title': '설정', 's.lang': '언어 · Language', 's.notify': '알림 시간', 's.widget': '홈 위젯 미리보기', 's.export': '내 데모 데이터 JSON 복사', 'cancel': '취소', 's.reset': '처음 상태로 되돌리기', 'fs.enter': '전체 화면', 'fs.exit': '전체 화면 끄기', 'fs.close': '닫기', 'fs.closeAria': '전체 화면 닫기',
    'nudge': '아래로 넘겨 보기', 'gate.kicker': '오늘의 감사', 'gate.q': '오늘 감사한 것은?', 'gate.ph': '한 줄이면 충분해요.', 'gate.private': '나만 보기', 'gate.public': '모두의 감사', 'gate.save': '감사 남기기', 'gate.later': '나중에 쓸게요',
    'gate.saved': '오늘의 감사가 저장되었어요.', 'gate.savedSub': '위로 넘겨 다른 사람들의 감사를 계속 보세요.',
    'login.title': '계속 보려면<br>로그인해 주세요.', 'login.sub': '한 번만 로그인하면 다음부터는 바로 열려요. 오늘 쓴 감사도 안전하게 보관돼요.',
    'login.apple': 'Apple로 계속하기', 'login.google': 'Google로 계속하기', 'login.phone': '휴대폰 번호로 계속하기',
    'inv.copy': "링크 복사", 'inv.btn': "초대", 'inv.title': "초대 링크", 'inv.desc': "이 링크를 받은 사람은 ‘{name}’에 들어올 수 있어요.", 'inv.share': "링크 보내기", 'inv.msg': "‘{name}’ 공동체에서 함께 감사를 나눠요. daily thanks에서 참여하세요:", 'join.title': "공동체 초대", 'join.body': "‘{name}’ 공동체에 참여할까요? 공동체에 나눈 감사는 멤버들만 볼 수 있어요.", 'join.ok': "참여하기", 'join.done': "‘{name}’에 참여했어요.", 'join.already': "이미 참여한 공동체예요.", 'verse.kicker': "말씀 한 구절", 'verse.title': "말씀 구절", 'verse.freq': "얼마나 자주", 'verse.hint': "감사 글 사이에 성경 한 구절이 보여요. 얼마나 자주 볼지 골라 주세요.", 'verse.often': "자주", 'verse.normal': "보통", 'verse.rare': "가끔", 'verse.off': "끄기", 'verse.note.often': "감사 4개쯤마다 한 구절", 'verse.note.normal': "감사 8개쯤마다 한 구절", 'verse.note.rare': "감사 15개쯤마다 한 구절", 'verse.note.off': "말씀 구절을 보여 주지 않아요", 'verse.read': "통독 이어 읽기", 'rd.loading': "말씀을 불러오는 중…", 'rd.offline': "말씀을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.", 'rd.retry': "다시 시도", 'rd.end': "요한계시록까지 다 읽었어요. 정말 수고했어요.", 'rd.pick': "성경 통독", 'rd.progress': "통독 {n} / {total}장", 'rd.ot': "구약", 'rd.nt': "신약", 'devo.kicker': "오늘의 말씀", 'devo.sub': "말씀을 읽고, 받은 은혜를 공동체와 나눠요.", 'devo.count': "오늘 묵상 {n}개", 'devo.read': "말씀 읽기", 'devo.share': "묵상 나누기", 'devo.change': "본문 바꾸기", 'devo.none': "오늘 함께 읽을 본문을 정해 주세요", 'devo.noneSub': "정한 본문은 공동체 모두에게 보여요.", 'devo.set': "오늘 본문 정하기", 'devo.ph': "예: 요한복음 3:1-15", 'devo.hint': "책 이름과 장·절을 적어 주세요. 예: 시편 23, 빌 4:6-7", 'devo.bad': "본문을 알아보지 못했어요. 예: 요한복음 3:1-15", 'devo.save': "정하기", 'devo.ph2': "오늘 말씀에서 받은 은혜는?", 'kind.meditation': "묵상", 'ch.type': "무엇을 함께 할까요?", 'ch.t.thanks': "매일 감사", 'ch.q.meditation': "오늘 말씀에서 받은 은혜는?", 'ch.q.prayer': "오늘 함께 기도할 제목은?", 'share.link': "링크 복사", 'verse.saved': "저장했어요 · 나의 감사 › 저장", 'verse.unsaved': "저장을 취소했어요.", 'act.like': "좋아요", 'hint.swipeRead': "왼쪽으로 밀면 성경 읽기", 'hint.swipeBack': "오른쪽으로 밀면 감사로 돌아가기", 'day.today': "오늘", 'day.yesterday': "어제", 'j.month': "{m} · 감사한 날 {n}일", 'j.monthTitle': "이번 달", 'imm.all': "모두", 'imm.group': "공동체", 'gs.week': "이번 주", 'gs.people': "{n}명이 함께했어요", 'gs.quiet': "이번 주 첫 나눔을 기다려요", 'gs.counts': "감사 {t} · 묵상 {m} · 기도 제목 {p}", 'gs.chDay': "{n}일째", 'gs.write': "나누기", 'gs.nudge': "함께하자고 알리기", 'gs.nudged': "오늘 알렸어요", 'gs.nudgeDone': "공동체 모두에게 살짝 알렸어요.", 'gs.privacy': "누가 했는지는 보이지 않아요. 우리가 함께한 모습만 보여요.", 'pl.kicker': "기도 제목", 'pl.others': "다른 사람들의 기도 제목", 'pl.othersSub': "모르는 누군가를 위해서도 함께 기도해요.", 'pl.empty': "아직 나눈 기도 제목이 없어요", 'pl.back': "왼쪽으로 밀면 감사로 돌아가기", 'ct.title': "이 내용은 나눌 수 없어요", 'ct.body': "연락처, 팔로우·홍보, 돈 요청은 모두나 공동체에 올릴 수 없어요. 감사만 나눠 주세요.", 'ct.email': "이메일", 'ct.phone': "전화번호", 'ct.link': "링크", 'ct.social': "연락처·팔로우 요청", 'ct.money': "돈·후원 요청", 'gs.chToday': "오늘 쓰기", 'gs.chStart': "동행 시작", 'pl.caught': "공동체 기도 제목을 다 봤어요.", 'pl.ask': "다른 사람들의 기도 제목도 함께 볼까요?", 'pl.yes': "함께 기도하기", 'ch.t.bible': "성경 읽기", 'ch.len': "얼마 동안 할까요?", 'ch.days': "{n}일", 'ch.read': "오늘 읽기", 'gs.peopleShort': "이번 주 {n}명", 'gs.quietShort': "이번 주 조용해요", 'mp.load': "불러오기", 'share.sendLink': "링크 보내기", 'share.linkMsg': "daily thanks에서 감사를 나눠요", 'act.note': "노트", 'mp.addPrev': "＋ 앞 절", 'mp.addNext': "뒷 절 ＋", 'fs.open': "크게 보기", 'gs.today': "오늘 {total}명 중 {n}명이 함께했어요", 'gs.weekPeople': "이번 주 {total}명 중 {n}명이 함께했어요", 'col.line': "모아보기", 'col.title': "모아보기", 'col.month': "월", 'col.season': "계절", 'col.year': "한 해", 'col.mTitle': "{m}월의 {k}", 'col.sTitle': "{s}의 {k}", 'col.yTitle': "나의 {y}년", 'col.sub': "{n}개 · {d}일", 'col.spring': "봄", 'col.summer': "여름", 'col.autumn': "가을", 'col.winter': "겨울", 'col.post': "인스타그램에 올리기", 'col.save': "사진 저장", 'col.hint': "사진 {n}장 · 옆으로 넘겨 보세요. 비공개 감사와 기도 제목은 빠져요.", 'col.empty': "아직 모을 감사가 없어요.", 'col.saved': "사진을 저장했어요.", 'wg.label': "오늘의 말씀", 'gs.new': "새 글", 'gs.todayShort': "오늘", 'bp.title': "성경 고르기", 'bp.ok': "확인", 'bp.pick': "본문 고르기", 'bp.hintV': "절을 두 번 누르면 범위로 골라져요", 'bp.law': "율법서", 'bp.hist': "역사서", 'bp.poet': "시가서", 'bp.major': "대선지서", 'bp.minor': "소선지서", 'bp.gosp': "복음서", 'bp.acts': "역사서", 'bp.paul': "바울서신", 'bp.gen': "일반서신", 'bp.proph': "예언서", 'bp.ch': "{n}장", 'bp.v': "{n}절", 'f.thanks': "감사", 'f.med': "묵상", 'f.prayer': "기도", 'col.kAll': "모두", 'col.kTitle.thanks': "감사", 'col.kTitle.meditation': "묵상", 'col.kTitle.prayer': "기도", 'col.kTitle.all': "기록", 'col.hintP': "사진 {n}장 · 옆으로 넘겨 보세요. 비공개로 쓴 글은 빠져요.", 'draft.saved': "자동 저장됨", 'st.line': "{n}일 연속 감사", 'st.none': "오늘 감사로 연속 기록을 시작해요", 'gd.back': "공동체", 'gd.week': "이번 주", 'gd.thanks': "감사", 'gd.med': "묵상", 'gd.prayer': "기도 제목", 'gd.recent': "최근 나눔", 'gd.all': "모두 보기", 'gd.invite': "초대", 'gd.share': "나누기", 'gd.empty': "아직 나눈 글이 없어요", 'col.reel': "릴스 영상 만들기", 'col.reeling': "영상 만드는 중… {p}%", 'col.reelPost': "영상 올리기", 'col.reelSave': "영상 저장", 'col.photos': "사진", 'col.video': "영상", 'wg.thanksLabel': "오늘의 감사", 'wg.medLabel': "오늘의 묵상", 'wg.write2': "감사 쓰기", 'wg.medWrite': "묵상 쓰기", 'wg.medDone': "오늘 묵상 완료", 'wg.streak': "{n}일 연속", 'share.linkSub': "누르면 글을 바로 볼 수 있는 링크", 'ch.u.d': "일", 'ch.u.w': "주", 'ch.u.m': "개월", 'ch.total': "총 {n}일", 'ch.from': "어디부터", 'ch.to': "어디까지", 'ch.pace': "어떻게 나눌까요?", 'ch.byPeriod': "기간에 맞춰", 'ch.byChapters': "하루 장 수로", 'ch.perDay': "하루 {n}장", 'ch.sumBible': "{total}장 · {days}일 · 하루 약 {per}장", 'ch.sumBible2': "{total}장 · 하루 {per}장 · {days}일", 'ch.pick': "고르기", 'ch.today': "오늘 {r}", 'ch.chUnit': "장", 'chn.thanks': "감사 동행", 'chn.prayer': "기도 동행", 'chn.meditation': "묵상 동행", 'chn.bible': "성경 읽기 동행", 'vault.title': "기록 보호", 'vault.body': "내 기록은 이 기기에서 잠근 뒤에만 서버로 보내져요. 잠금 열쇠는 이 기기에만 있어서, 운영자도 내용을 열어볼 수 없어요. 모두에게 공개한 글만 그대로 보여요.", 'vault.code': "복구 키", 'vault.codeHint': "새 휴대폰에서 내 기록을 열 때 이 키가 필요해요. 안전한 곳에 적어 두세요. 잃어버리면 아무도 되찾을 수 없어요.", 'vault.copy': "복구 키 복사", 'vault.restore': "다른 기기의 복구 키 넣기", 'vault.restorePh': "복구 키", 'vault.restored': "복구 키를 넣었어요.", 'vault.bad': "복구 키가 맞지 않아요.", 'vault.locked': "이 기기에는 복구 키가 필요해요. 설정 › 기록 보호에서 넣어 주세요.", 'vault.group': "공동체 글은 그룹 열쇠로 잠가요. 열쇠는 초대 링크 안에만 담겨서 서버에는 가지 않아요.", 'prot.noShare': "공동체 글은 쓴 사람만 나눌 수 있어요.", 'prot.shot': "공동체 글은 캡처해서 나눌 수 없어요.", 'gend.title': "모두 봤어요", 'gend.sub': "이제 내 차례예요. 오늘의 마음을 공동체와 나눠요.", 'gend.thanks': "감사 나누기", 'gend.meditation': "묵상 나누기", 'gend.prayer': "기도 제목 나누기", 'off.title': "성경 오프라인 저장", 'off.body': "개역한글 · KJV · Reina-Valera 1909 전체(무료 공개 번역본)를 이 기기에 저장해요. 인터넷이 없어도 언제든 읽을 수 있어요. 앱에는 처음부터 들어 있어요.", 'off.go': "저장하기", 'off.doing': "저장하는 중… {n}/{t}", 'off.done': "성경 전체를 저장했어요.", 'off.fail': "일부를 저장하지 못했어요. 다시 해 주세요.", 'tile.ch': "{name} {n}/{t}", 'ch.counted': "{name} {n}일째로 기록돼요", 'j.bible': "성경 {n}장 읽음 · {p}%", 'j.bibleWeek': "이번 주 {n}장", 'j.bibleNone': "성경 읽기 시작하기", 'ty.from': "보내는 사람 (내 이름)", 'ty.reply': "{name}님에게 답장 감사", 'ls.title': "우리 공동체 시작하기", 'ls.sub': "세 가지만 하면 돼요.", 'ls.s1': "초대 링크 보내기", 'ls.s1b': "카톡이나 문자로 링크를 보내면 바로 들어와요.", 'ls.s2': "첫 동행 시작: 7일 감사", 'ls.s2b': "일주일 동안 함께 감사를 남겨요. 한 번 누르면 시작돼요.", 'ls.s3': "오늘 첫 감사 나누기", 'ls.s3b': "리더가 먼저 쓰면 다른 사람도 쉽게 따라와요.", 'ls.go': "시작", 'ls.done': "완료", 'ls.admin': "만든 사람이 관리자예요. ⋯ › 그룹 관리에서 초대 권한과 멤버를 정할 수 있어요.", 'adm.title': "그룹 관리", 'adm.invite': "멤버도 초대할 수 있어요", 'adm.inviteOff': "초대는 관리자만 할 수 있어요", 'adm.approve': "들어오기 전에 내가 승인해요", 'adm.newLink': "초대 링크 새로 만들기", 'adm.newLinkDone': "새 링크를 만들었어요. 예전 링크로는 더 들어올 수 없어요.", 'adm.members': "멤버", 'adm.remove': "내보내기", 'adm.removed': "{name}님을 그룹에서 내보냈어요.", 'adm.pending': "승인을 기다리는 사람이 없어요.", 'adm.only': "관리자만 할 수 있어요.", 'adm.you': "나 · 관리자", 'adm.row': "그룹 관리", 'join.pending': "리더가 승인하면 들어가요.", 'gr.pending': "승인 기다리는 중", 'cp.now': "지금 함께하는 중", 'cp.day': "오늘 {n}일째", 'cp.join': "함께하기", 'cp.withGroup': "공동체와 함께", 'cp.joined': "함께하고 있어요", 'cp.recap': "모아보기 만들기", 'cp.left': "{n}일 남음", 'rc.wkTitle': "이번 주 {n}개의 감사", 'rc.wkSub': "한 주를 카드로 모아 두었어요. 올려도 좋아요.", 'rc.wkGo': "카드 보기", 'col.week': "주", 'col.wTitle': "이번 주의 {k}", 'col.wTitle2': "{m}월 {d}일 주간", 'adm.sure': "정말 내보낼까요?", 'chr.done': "완료", 'chr.title': "{name} 완료!", 'chr.sub': "{n}일을 끝까지 함께했어요.", 'chr.mine': "나 {d}/{t}일", 'chr.group': "{g} · {n}명이 함께 {c}개를 나눴어요", 'chr.top': "가장 꾸준한 사람", 'chr.days': "{n}일", 'chr.toGroup': "공동체에 결과 나누기", 'chr.shareCard': "결과 카드 공유", 'chr.posted': "공동체에 결과를 나눴어요.", 'chr.postText': "{name}을 함께 마쳤어요! {n}명이 {c}개의 마음을 나눴어요. 고마워요.", 'chr.see': "결과 보기", 'qz.kicker': "감사 연구 퀴즈 {i}/{n}", 'qz.right': "맞았어요!", 'qz.wrong': "아쉬워요.", 'qz.score': "{r}/{n} 맞힘", 'qz.resTitle': "{n}문제 중 {r}개 맞혔어요", 'qz.resSub': "연구가 말하는 건 하나예요: 감사는 작게, 자주 할수록 오래 남아요.", 'qz.resGo': "오늘 감사 한 줄 쓰기", 'qz.q1': "10주 동안 매주 감사한 일을 적은 사람들은, 그렇지 않은 사람들보다 일주일에 운동을 얼마나 더 했을까요?", 'qz.o1': "약 30분|약 1시간 30분|약 3시간", 'qz.f1': "감사를 적은 그룹은 일주일에 약 1시간 30분 더 운동했고, 몸의 불편함도 덜 느꼈어요.", 'qz.s1': "Emmons & McCullough, 2003", 'qz.q2': "일주일 동안 매일 밤 ‘좋았던 일 세 가지’를 적었더니, 행복감이 높아진 효과는 얼마나 이어졌을까요?", 'qz.o2': "1주|1개월|6개월", 'qz.f2': "단 일주일 했을 뿐인데, 행복감은 높아지고 우울감은 낮아진 효과가 6개월까지 이어졌어요.", 'qz.s2': "Seligman 외, 2005", 'qz.q3': "고마운 사람에게 감사 편지를 쓴 사람들, 뇌의 변화는 얼마 뒤까지 관찰됐을까요?", 'qz.o3': "하루|일주일|3개월", 'qz.f3': "3개월 뒤 뇌 촬영에서도 감사와 관련된 뇌 활동이 더 크게 나타났어요.", 'qz.s3': "Kini 외, 2016", 'chu.title': "교회 관리", 'chu.make': "교회 관리자라면: 교회 만들기", 'chu.ph': "교회 이름", 'chu.create': "만들기", 'chu.stats': "공동체 {g}개 · 멤버 {m}명 · 오늘 {t}명 함께", 'chu.allCh': "모든 공동체에 동행 시작", 'chu.newGroup': "새 공동체", 'chu.leader': "리더: {name}", 'chu.noLeader': "리더 없음", 'chu.setLeader': "리더 세우기", 'chu.move': "멤버 옮기기", 'chu.open': "열기", 'chu.pickMember': "누구를 옮길까요?", 'chu.pickTarget': "어느 공동체로?", 'chu.moved': "{name}님을 {g}(으)로 옮겼어요.", 'chu.leaderSet': "{name}님을 {g} 리더로 세웠어요.", 'chu.today': "오늘 {n}/{t}", 'chu.shared': "모든 공동체에 같은 본문 (생명의 삶)", 'chu.allStarted': "모든 공동체에 동행을 시작했어요.", 'chu.entry': "교회 관리 · {name}", 'qz.answer': "정답", 'qz.why': "풀이", 'gh.left': "왼쪽으로 밀면 성경 읽기", 'gh.right': "오른쪽으로 밀면 기도 제목", 'gh.up': "위로 넘기면 다음 감사", 's.intro': "처음 안내 다시 보기", 'toast.intro': "처음 안내를 다시 보여드릴게요.", 'note.mine': "내 묵상", 'note.pickRange': "어디부터 어디까지 묵상할까요?", 'j.byBible': "성경 순서", 'nick.title': "멤버 이름", 'nick.hint': "내 화면에서만 바뀌어요. 다른 사람에게는 원래 이름으로 보여요.", 'nick.edit': "이름 바꾸기", 'nick.orig': "원래 이름 {name}", 'nick.ph': "예: 엄마, 아빠", 'nick.save': "저장", 'nick.reset': "원래 이름으로", 'nick.row': "멤버 이름 바꾸기", 'bb.title': "Daily Bible · 말씀을 매일", 'bb.read': "읽기", 'bb.notes': "설교 노트", 'bb.me': "나", 'bb.newNote': "설교 노트", 'bb.continue': "이어 읽기", 'bb.where': "마지막으로 읽은 곳", 'bb.start': "창세기 1장부터 시작해요", 'bb.pick': "성경 고르기", 'bb.today': "오늘의 본문", 'bb.readToday': "오늘 본문 읽기", 'bb.plan': "성경 읽기 동행", 'sn.title': "설교 노트", 'sn.sub': "들은 설교를 본문과 함께 적어 두세요.", 'sn.new': "새 설교 노트", 'sn.empty': "아직 설교 노트가 없어요.", 'sn.free': "무료 노트 {n}/{t}", 'sn.plan': "{plan} 이용 중 · 이번 달 {n}/{t}", 'sn.monthly': "월간", 'sn.yearly': "연간", 'sn.rec': "녹음", 'sn.file': "파일", 'sn.text': "글", 'sn.titleF': "설교 제목 (선택)", 'sn.preacher': "설교자 (선택)", 'sn.recStart': "녹음 시작", 'sn.recStop': "녹음 끝내기", 'sn.recOn': "녹음 중 {t}", 'sn.recDone': "녹음했어요 · {t}", 'sn.pickFile': "녹음 파일 고르기", 'sn.paste': "설교를 받아 적은 글을 붙여 넣어 주세요", 'sn.make': "저장", 'sn.need': "녹음, 파일, 글 중 하나를 넣어 주세요.", 'sn.short': "글이 너무 짧아요.", 'sn.queued': "정리를 기다리는 중", 'sn.working': "정리하는 중…", 'sn.failed': "정리하지 못했어요", 'sn.offline': "서버에 연결되면 정리해요", 'sn.example': "예시", 'sn.main': "핵심 메시지", 'sn.points': "말씀 요점", 'sn.apply': "삶의 적용", 'sn.prayer': "기도 제목", 'sn.questions': "나눔 질문", 'sn.passages': "본문", 'sn.transcript': "전체 받아쓰기", 'sn.share': "공유", 'sn.delete': "삭제", 'sn.deleteQ': "이 노트를 지울까요? 되돌릴 수 없어요.", 'sn.deleted': "노트를 지웠어요.", 'sn.back': "설교 노트", 'pw.title': "저장 공간이 가득 찼어요", 'pw.body': "녹음 몇 개를 지우면 다시 쓸 수 있어요. 공간을 늘리면 훨씬 넉넉하게 쓸 수 있어요.", 'pw.clean': "녹음 정리하기", 'pw.monthly': "월간", 'pw.yearly': "연간", 'pw.mPrice': "₩4,900 / 월", 'pw.yPrice': "₩39,000 / 년", 'pw.ySave': "월 ₩3,250 · 2개월 무료", 'pw.what': "저장 공간 100GB · 매달 설교 60편까지 자동 요약", 'pw.soon': "결제는 앱스토어 출시와 함께 열려요.", 'pw.done': "공간을 늘렸어요. 이제 마음껏 쓰세요.", 'me.title': "나", 'me.days': "{n}일 연속 말씀", 'me.saved': "저장한 구절", 'me.medi': "묵상 노트", 'me.planRow': "구독", 'me.free': "무료 (노트 {t}개)", 'me.thanks': "daily thanks 열기", 'me.none': "아직 없어요", 'rs.today': "오늘 {n}장", 'rs.min': "{n}분", 'rs.avg': "하루 평균 {n}장", 'rs.eta': "이 속도면 {d} 완독", 'rs.week': "이번 주 {n}장", 'rs.time': "이번 주 {n}분 읽음", 'sn.yt': "유튜브", 'sn.ytPh': "유튜브 설교 링크", 'sn.ytBad': "유튜브 링크를 확인해 주세요.", 'sn.ytNo': "유튜브 링크는 서버 설정 후 쓸 수 있어요.", 'sn.saving': "올리는 중… {n}", 'sn.toMed': "묵상 노트로 남기기", 'sn.recNote': "화면이 꺼지지 않게 해 주세요. 녹음은 30초마다 나눠서 올라가요.", 'sn.write': "직접 쓰기", 'sn.ref': "본문 고르기", 'sn.mainF': "핵심 메시지 (한 줄)", 'sn.bodyF': "설교 노트", 'sn.manual': "직접 쓴 노트", 'sn.toGroup': "공동체에 나누기", 'sn.shared': "공동체에 나눴어요.", 'sn.pickGroup': "어느 공동체에 나눌까요?", 'sn.body': "노트", 'db.title': "나의 말씀 기록", 'db.days': "이번 주 읽은 날", 'db.time': "이번 달 읽은 시간", 'db.chs': "이번 달 읽은 장", 'db.avg': "하루 평균", 'db.daysV': "{n}/7일", 'db.min': "{n}분", 'db.hm': "{h}시간 {m}분", 'db.chV': "{n}장", 'db.c30': "최근 30일 · 하루에 읽은 장", 'db.wd': "요일별 · 평균 몇 장", 'db.streak': "지금 {n}일 연속 · 가장 길게 {m}일", 'db.notes': "설교 노트 {s} · 묵상 {m}", 'db.tap': "막대를 누르면 그날 기록이 보여요", 'db.day': "{d} · {n}장 · {m}분", 'pp.title': "자주 보내는 사람", 'pp.add': "＋ 사람 저장", 'pp.name': "이름 (예: 엄마)", 'pp.phone': "휴대폰 번호", 'pp.save': "저장", 'pp.hint': "누르면 그 사람에게 보낼 문자가 바로 열려요. 보내기만 누르면 돼요.", 'pp.del': "지우기", 'med.felt': "느낀 점", 'med.prayer': "기도", 'med.prayerPh': "이 말씀으로 드리는 기도, 기도제목", 'med.asReq': "기도제목으로도 나누기", 'med.rec': "목소리로 남기기", 'med.recStop': "녹음 끝내기", 'med.recDel': "녹음 지우기", 'med.recNote': "녹음은 이 기기에만 잠가서 보관해요.", 'med.recFail': "마이크를 쓸 수 없어요. 설정에서 마이크를 허용해 주세요.", 'med.voice': "목소리 기록",
    'sn.aiOn': "자동으로 요약도 만들어요", 'sn.aiBtn': "요약 만들기", 'sn.aiBusy': "요약하고 있어요…", 'sn.aiLater': "서버에 연결되면 요약할 수 있어요.", 'sn.aiTag': "자동 요약", 'sn.aiShort': "요약하려면 조금 더 적어 주세요.",
    'rec.start': "설교 녹음 시작", 'rec.hintApp': "화면을 꺼도 계속 녹음돼요. 전화가 와도 받지 않으면 그대로 녹음되고, 받으면 잠시 멈췄다가 통화가 끝나면 이어서 녹음해요.", 'rec.hintWeb': "웹에서는 화면을 켜 두세요. 휴대폰 앱에서는 화면을 꺼도, 전화가 와도 계속 녹음돼요.", 'rec.on': "녹음 중", 'rec.paused': "잠시 멈춤", 'rec.call': "통화 중 · 끝나면 이어서 녹음해요", 'rec.pause': "잠시 멈춤", 'rec.resume': "이어서 녹음", 'rec.stop': "끝내기", 'rec.del': "녹음 지우기", 'rec.done': "녹음 {t}", 'rec.after': "저장하면 설교를 받아 적고 한 장으로 요약해요. 손으로 적은 노트도 함께 남아요.", 'rec.fgTitle': "설교 녹음 중", 'rec.fgText': "화면을 꺼도 계속 녹음돼요.", 'rec.nTitle': "녹음이 잠시 멈췄어요", 'rec.nText': "통화가 끝났다면 앱을 열어 주세요. 이어서 녹음해요.", 'rec.busy': "설교를 받아 적고 요약하고 있어요…", 'rec.pending': "인터넷에 연결되면 받아 적고 요약해요.", 'rec.retry': "다시 올리기", 'rec.upFail': "올리지 못했어요. 나중에 다시 올려 주세요.", 'rec.listen': "녹음", 'rec.bar': "녹음 중 {t} · 열기", 'rec.delQ': "녹음을 지울까요?", 'rec.typing': "녹음 중에도 필기하셔도 좋아요",
    'rec.kRec': "녹음", 'rec.kLive': "실시간", 'rec.kFile': "오디오 파일", 'rec.ctxPh': "설교 주제나 나올 이름(성경 인물, 행사, 사람 이름)을 적어 주면 받아쓰기가 훨씬 정확해져요. (선택)", 'rec.btn': "녹음 · 자동 요약", 'rec.pick': "오디오 파일 고르기", 'rec.liveHint': "말하는 대로 바로 글자로 보여 줘요. 저장하면 녹음으로 한 번 더 정확하게 받아 적어요.", 'rec.fileHint': "교회 영상이나 녹음 앱에서 받은 파일(m4a, mp3, wav, mp4)을 골라 주세요.", 'rec.liveWait': "듣고 있어요…", 'rec.file': "파일 {t}",
    'sn.refReq': "본문 고르기", 'sn.church': "교회", 'sn.pastor': "목사님", 'sn.placeNew': "＋ 새로 입력", 'sn.date': "날짜", 'rec.needRef': "본문을 먼저 골라 주세요. 고른 구절을 바탕으로 더 정확하게 받아 적고 요약해요.", 'nt.sum': "요약", 'nt.tr': "받아쓰기", 'nt.pass': "본문", 'nt.noTr': "받아 적은 글이 아직 없어요. 녹음하거나 오디오 파일로 노트를 만들면 여기에 전체 글이 나와요.", 'vc.title': "설교에 나온 구절 · 원문과 나란히", 'vc.none': "설교에 나온 구절을 아직 찾지 못했어요.", 'vc.match': "원문과 같아요", 'vc.para': "풀어서 말했어요", 'vc.unsure': "몇 절인지 봐 주세요", 'vc.ok': "맞다고 했어요", 'vc.said': "설교", 'vc.orig': "원문", 'vc.yes': "맞아요", 'vc.fix': "다른 구절이에요", 'vc.fixQ': "맞는 구절을 적어 주세요 (예: 요한복음 3:16)", 'vc.bad': "구절을 찾지 못했어요", 'vc.banner': "구절 번호가 맞는지 봐 주세요 ({n}개)", 'vc.noOrig': "원문을 불러오지 못했어요",
    'pl.title': "함께 읽기 계획", 'pl.new': "읽기 계획 만들기", 'pl.sub': "어디서부터 어디까지, 며칠 동안 — 날마다 읽을 만큼 나눠 드려요. 친구나 가족을 초대해 같은 날 같은 본문을 읽어요.", 'pl.invite': "초대", 'pl.invTitle': "함께 읽자고 초대하기", 'pl.invDesc': "이 링크를 받은 사람은 ‘{name}’ 계획에 같은 날짜로 함께해요.", 'pl.msg': "{by} 함께 성경 읽어요 · {name}\n{range} · {days}일\n", 'pl.joinTitle': "함께 읽기 초대", 'pl.joinBy': "{by}님이 함께 읽자고 초대했어요", 'pl.join': "함께 읽기", 'pl.joined': "계획에 함께했어요", 'pl.already': "이미 함께하고 있는 계획이에요", 'pl.today': "오늘", 'pl.someone': "친구",
    'bs.off': "꺼짐", 'bs.size': "성경 글자 크기", 'bs.remind': "읽기 알림", 'bs.places': "교회 · 목사님", 'bs.placesNone': "설교 노트를 쓰면서 처음 적은 교회와 목사님이 여기 저장돼요.", 'bs.placesHint': "설교 노트를 열면, 그 요일·그 시간에 자주 쓴 곳이 먼저 채워져요.", 'bs.usually': "주로 {when}", 'bs.sub': "저장 공간", 'bs.thanks': "daily thanks 열기", 'bs.sermon': "설교 노트", 'bs.reading': "읽기", 'bs.data': "내 기록", 'bs.deleted': "지웠어요",
    'rec.slang': "설교 언어", 'rec.slangSet': "설교 언어: {l}",
    'pv.open': "본문 크게 보기",
    'stk.n': "{n}일 연속", 'stk.sub': "매일 말씀 읽기", 'stk.todayDone': "오늘도 읽었어요", 'stk.todayNot': "오늘 한 장 읽으면 이어져요", 'stk.start': "오늘 한 장 읽으면 연속 기록이 시작돼요", 'stk.best': "최고 {n}일",
    'bs.almost': "거의 찼어요",
    'fc.prKick': "{g} 기도제목", 'fc.prTitle': "{n}명이 기도를 부탁했어요", 'fc.pray': "기도하러 가기", 'fc.readTitle': "오늘 읽을 곳", 'fc.read': "읽기 시작", 'fc.dayN': "{n}일째", 'fc.write': "오늘 쓰기", 'fc.group': "공동체",
    'ss.ph': "설교 노트 검색", 'ss.none': "‘{q}’ 검색 결과가 없어요", 'ss.count': "{n}개", 'ss.clear': "지우기", 'ss.inTr': "받아쓰기",
    'fp.kick': "{g} 기도제목 · {i}/{n}", 'fv.kick': "오늘 읽을 곳 · {r}", 'fv.count': "{i} / {n}", 'fv.doneTitle': "오늘 분량을 다 읽었어요", 'fv.done': "읽었어요", 'fv.doneSub': "{name} · {d}일째", 'fv.marked': "오늘 읽기를 채웠어요",
    'vw.row': "보기 설정", 'vw.rowSub': "앱 열 때 먼저 볼 것, 피드에 보일 것", 'vw.first': "앱을 열면 먼저", 'vw.fPr': "순원 기도제목", 'vw.fVerse': "오늘 읽을 말씀 (읽기 계획)", 'vw.fCh': "오늘의 챌린지", 'vw.howMany': "기도제목 몇 개까지", 'vw.all': "전부", 'vw.pause': "잠시 쉬기", 'vw.on': "켜기", 'vw.h24': "24시간", 'vw.w1': "일주일", 'vw.off': "끄기", 'vw.until': "{d}에 다시 켜져요", 'vw.feed': "피드에 보일 것", 'vw.thanks': "감사", 'vw.prayer': "기도제목", 'vw.med': "묵상", 'vw.strangers': "모르는 사람 글도 보기", 'vw.strangersSub': "끄면 내 글과 공동체·초대로 연결된 사람 글만 보여요", 'fo.off': "이 화면 끄기", 'fo.h24': "24시간 끄기", 'fo.offDone': "껐어요. 설정 › 보기 설정에서 다시 켤 수 있어요.", 'fo.snoozed': "24시간 동안 쉬어요", 'why.title': "이게 뭐예요?", 'why.pr': "‘{g}’에 새 기도제목이 올라와서, 앱을 열면 먼저 보여 드려요. 한 번 본 기도제목은 다시 맨 앞에 나오지 않아요.", 'why.plan': "‘{name}’ 계획의 오늘 분량이라 먼저 보여 드려요. ({d}/{t}일째)", 'why.settings': "보기 설정", 'emp.title': "아직 함께 나눌 사람이 없어요", 'emp.sub': "공동체를 만들거나 초대 링크로 사람들을 불러 보세요. 내 글과 연결된 사람 글만 여기 보여요.", 'emp.group': "공동체 만들기", 'emp.strangers': "모르는 사람 감사도 보기",
    'cu.kick': "읽기가 밀렸어요", 'cu.title': "{n}일 밀렸어요. 괜찮아요.", 'cu.sub': "남은 {d}일에 나눠서 하루 {per}장씩 읽을까요? 끝나는 날은 그대로예요.", 'cu.yes': "나눠서 읽기", 'cu.no': "그대로 둘게요", 'cu.done': "남은 날에 고르게 나눴어요. 오늘은 {r}", 'cu.short': "{n}일 밀림 · 남은 날에 나누기",
    'smd.title': "{n}님의 묵상", 'smd.someone': "누군가의 묵상", 'smd.read': "이 본문 읽기", 'smd.write': "나도 묵상 쓰기", 'smd.bad': "링크를 열지 못했어요",
    'ft.leader': "공동체 리더 도구", 'ft.leaderSub': "순모임 진행·녹음 요약, 출석, 순원 리포트, 다락방·교회 대시보드, 목사님 보기 링크", 'ld.tools': "순장 도구", 'ld.meet': "순모임 시작", 'ld.reports': "순원 리포트", 'ld.past': "지난 순모임", 'ld.live': "지금 순모임 중 · {r}", 'ld.join': "함께 보기", 'mt.title': "순모임 · {d}", 'mt.pass': "오늘 나눌 본문 (순원들이 함께 봐요)", 'mt.share': "순원들과 본문 함께 보기", 'mt.shared': "순원들 화면에 본문이 열려요", 'mt.attend': "출석", 'mt.me': "나 (순장)", 'mt.notes': "메모", 'mt.save': "순모임 저장", 'mt.view': "순모임 · {d}", 'mt.att': "출석 {n}/{t}", 'mt.absent': "불참: {names}", 'mt.byMember': "순원별 나눔", 'mt.shareL': "나눔", 'mt.prayL': "기도제목", 'mt.prayer': "함께 기도할 것", 'mt.next': "다음에", 'mt.busy': "순모임을 받아 적고 순원별로 정리하고 있어요…", 'mt.pending': "인터넷에 연결되면 받아 적고 순원별로 정리해요.", 'mt.none': "아직 순모임 기록이 없어요.", 'mt.saved': "순모임을 저장했어요", 'rp.title': "{name} 리포트", 'rp.attend': "순모임 출석", 'rp.shared': "순모임에서 나눈 것", 'rp.prayers': "기도제목", 'rp.notes': "순장 메모", 'rp.add': "메모 남기기", 'rp.ph': "이번 주 이 순원을 위해 기억할 것 (순장과 목사님만 봐요)", 'rp.pick': "누구의 리포트를 볼까요?", 'rp.none': "아직 없어요", 'cat.set': "다락방 · 분류", 'cat.ph': "예: 1다락방, 청년부", 'cat.none': "분류 없음", 'cat.rename': "이름 바꾸기", 'cat.namePh': "공동체 이름", 'ps.link': "목사님께 보기 링크", 'ps.desc': "지금 상태(출석, 이번 주 나눔, 순모임 요약, 순장 메모)를 담은 링크예요. 받은 분은 앱에서 대시보드로 봐요. 링크를 가진 사람은 누구나 볼 수 있으니 목사님께만 보내 주세요.", 'ps.title': "{c} 대시보드", 'ps.asof': "{d} 기준", 'ps.att4': "최근 출석", 'ps.lastMeet': "지난 순모임", 'ps.reports': "순장 메모", 'ps.members': "{n}명", 'dash.att': "출석 {p}%", 'dash.meet': "이번 달 순모임 {n}번",
    'us.title': "사용량", 'us.day': "오늘 자동 요약", 'us.week': "이번 주 자동 요약", 'us.space': "저장 공간", 'us.reset': "{t} 후 다시 채워져요", 'us.full': "다 썼어요", 'us.more': "공간 늘리기", 'us.h': "{n}시간", 'us.m': "{n}분", 'us.d': "{n}일", 'us.dayHit': "오늘 자동 요약을 다 썼어요. {t} 후에 이어서 정리해요. 녹음은 그대로 저장돼 있어요.", 'us.weekHit': "이번 주 자동 요약을 다 썼어요. {t} 후에 이어서 정리해요. 녹음은 그대로 저장돼 있어요.",
    'us.used': "{p}% 사용", 'us.at': "오늘 {t}에 다시 채워져요", 'us.atTom': "내일 {t}에 다시 채워져요", 'us.atDay': "{d} {t}에 다시 채워져요", 'us.reset2': "{w}", 'us.secSum': "자동 요약", 'us.secWeek': "주간 한도", 'us.secSpace': "저장 공간", 'us.secExtra': "추가 사용량", 'us.noExtra': "지금은 없어요", 'us.noExtraSub': "추가로 받으면 여기에 쓸 수 있는 날짜와 함께 보여요.", 'us.refresh': "새로고침",
    'us.spaceCard': "녹음 · 노트",
    'cel.today': "오늘 완료", 'cel.dayOf': "{name} · {d}/{t}일", 'cel.book': "{book} 다 읽었어요", 'cel.bible': "성경 전체를 다 읽었어요", 'cel.share': "나누기", 'size.xl': "아주 크게", 'size.btn': "글자 크기", 'stk.write': "{n}일 연속", 'stk.new': "새 글 {n}", 'np.noon': "점심", 'np.noonSub': "하루 중간에", 'np.planTitle': "오늘 읽을 말씀,<br>언제 알려드릴까요?", 'np.chTitle': "챌린지 하는 날,<br>언제 알려드릴까요?", 'np.multi': "여러 개 골라도 돼요", 'yr.btn': "올해 말씀 기록 나누기", 'yr.title': "{y}년 나의 말씀", 'yr.chapters': "{n}장", 'yr.read': "읽은 말씀", 'yr.days': "{n}일", 'yr.daysL': "말씀 읽은 날", 'yr.best': "가장 길게 {n}일 연속", 'yr.books': "다 읽은 책 {n}권", 'yr.pct': "성경의 {p}%", 'yr.feed': "피드 4:5", 'yr.story': "스토리 9:16", 'yr.reel': "영상 만들기", 'yr.post': "인스타그램에 올리기", 'yr.save': "저장하기", 'yr.making': "영상을 만드는 중… {p}%", 'sm.full': "한 절씩 보기",
    'np.cr1': "내가 고른 시간에만 알려드려요.", 'np.pr2': "오늘 분량을 읽은 날은 알리지 않아요.", 'np.cr2': "오늘 몫을 한 날은 알리지 않아요.",
    'bf.devo': "오늘의 말씀", 'bf.endTitle': "오늘도 말씀 앞에 머물렀어요", 'bf.endSub': "이어서 더 읽거나, 설교 노트를 남겨 보세요.", 'bf.cont': "이어 읽기", 'bf.home': "홈으로", 'bf.note': "설교 노트",
    'bn.feed': "피드", 'bn.group': "공동체", 'bn.plus': "남기기", 'bp.title2': "무엇을 남길까요?", 'bp.sermon': "설교 노트", 'bp.med': "묵상", 'bp.thanks': "감사", 'bp.prayer': "기도제목", 'bp.plan': "읽기 계획",
    'kk.thanks': "감사", 'sn.addRef': "+ 본문 추가", 'sn.rmRef': "본문 빼기", 'rt.done': "통독 {n}회 완료", 'rt.round': "{k}회차", 'rt.since': "{d}부터", 'rt.title': "통독 기록", 'rt.now': "지금 읽는 중", 'rt.nowLine': "{k}회차 · {d}부터 · {n}/{t}장", 'rt.notYet': "아직 시작 전이에요", 'rt.past': "다 읽은 기록", 'rt.item': "{k}회", 'rt.days': "{n}일", 'rt.none': "한 번 다 읽으면 여기에 남아요.", 'rt.recent': "최근에 읽은 장", 'rt.empty': "한 장씩 읽으면 날짜별로 여기에 쌓여요.", 'rt.cel': "성경 {n}독을 마쳤어요", 'rt.chs': "{n}장", 'upd.title': "새 버전이 있어요", 'upd.body': "더 나은 daily thanks를 위해 앱을 업데이트해 주세요.", 'upd.go': "업데이트", 'login.terms': "계속하면 <a href=\"{base}/terms\" target=\"_blank\" rel=\"noopener\">이용약관</a>과 <a href=\"{base}/privacy\" target=\"_blank\" rel=\"noopener\">개인정보처리방침</a>에 동의하는 것으로 봐요. 다른 사람을 해치거나 불쾌하게 하는 글은 허용되지 않아요.", 'login.demo': '시안에서는 실제 계정에 연결하지 않고 로그인 상태만 이 기기에 저장해요.', 'login.done': '로그인했어요. 다음부터는 바로 열려요.',
    'phone.title': '휴대폰 번호로 로그인', 'phone.number': '휴대폰 번호', 'phone.send': '인증번호 받기', 'phone.code': '인증번호 6자리', 'phone.verify': '확인',
    'phone.sent': '인증번호를 보냈어요.', 'phone.demo': '시안에서는 문자가 가지 않아요. 아무 6자리 숫자나 입력하세요.', 'phone.bad': '번호를 다시 확인해 주세요.', 'phone.badCode': '6자리 숫자를 입력해 주세요.',
    'acct.signedIn': '로그인됨', 'acct.logout': '로그아웃', 'acct.loggedOut': '로그아웃했어요.', 'fs.ios': '아이폰에서는 Safari 공유 버튼 → 「홈 화면에 추가」로 열면 앱처럼 전체 화면으로 보여요.', 'fs.blocked': '이 환경에서는 전체 화면을 쓸 수 없어요.', 's.fine': '현재의 기록은 이 브라우저에만 저장됩니다. 새 브라우저나 기기로 자동 동기화되지 않습니다.', 's.confirmReset': '내가 쓴 기록과 설정을 모두 지우고 처음 상태로 되돌릴까요? 되돌릴 수 없어요.', 'toast.reset': '데모가 초기화되었어요.', 'toast.noStore': '현재 브라우저에 저장할 수 없어요.'
  },
  en: {
    'snz.ok': "Turn off", 'snz.title': "What should we turn off?", 'snz.what': "Turn off", 'snz.all': "All of it", 'snz.for': "For how long", 'snz.until': "Until I turn it on", 'snz.hint': "Turn it back on any time in Settings › What you see.", 'mc.title': "My communities", 'mc.ph': "Code from your church, group, chapter or retreat", 'mc.connect': "Connect", 'mc.none': "Enter a code you were given to connect with a community.", 'mc.bad': "Please check the code.", 'mc.needSign': "Sign in to connect with a community. You’ll be connected right after.", 'mc.joining': "Connecting…", 'mc.admin': "Admin", 'mc.quiet': "Quiet", 'mc.loud': "Unmute", 'mc.quietOn': "Quiet · no new-post dots or alerts", 'mc.quietDone': "Quiet now. No new-post dots or alerts.", 'mc.loudDone': "You’ll hear from them again.", 'mc.leave': "Leave", 'mc.leaveQ': "Leave “{name}”? You’ll need a code or invite link to come back.", 'mc.left': "You left the community.", 'mc.ownerStay': "Admins can’t leave. Manage it from the group’s settings.", 'join.pendingShort': "Waiting for approval",
    'tour.k.verse': "Today’s verse", 'tour.k.prayer': "Group prayer request", 'tour.k.thanks': "Thanks", 'tour.s.verse': "Scroll to read the Bible", 'tour.s.prayer': "Get updated on your community’s prayer requests", 'tour.s.thanks': "Share your gratitude", 'tour.f.title': "Also here", 'tour.f.read': "Read", 'tour.f.readSub': "Today’s passage, where you left off, plans together", 'tour.f.notes': "Sermon notes", 'tour.f.notesSub': "Record a sermon and it becomes tidy notes", 'tour.f.group': "Community", 'tour.f.groupSub': "Make a group and invite people with a link",
    'tour.skip': "Skip", 'tour.done': "Get started", 'tour.again': "See the tour again",
    'wl.title': "Welcome", 'wl.nameQ': "First time here? What’s your name? It’s shown on thank-you cards and in your groups.", 'wl.next': "Next", 'wl.hi': "Welcome, {name}", 'wl.sub': "Sign up to keep going on any device and join a group.", 'wl.google': "Continue with Google", 'wl.ms': "Continue with Microsoft", 'wl.kakao': "Continue with Kakao", 'wl.email': "Continue with email", 'wl.phone': "Continue with a text message", 'wl.notYet': "This option opens soon. For now, please continue with email.",
    'bp.thankSomeone': "Thank someone",
    'adm.topLeaders': "Leaders can see “Most consistent” too",
    'cl.title': "Sign in", 'cl.name': "Name", 'cl.namePh': "Shown as the sender on thank-you cards", 'cl.email': "Email", 'cl.send': "Email me a sign-in link", 'cl.sending': "Sending…", 'cl.badEmail': "Please check the email address.", 'cl.sendFail': "Couldn’t send the email. Please try again shortly.", 'cl.tooMany': "Too many emails for now. Please try again shortly.", 'cl.sentTitle': "Check your email", 'cl.sentBody': "We sent a sign-in link to {email}. Tap the link in the email to sign in.", 'cl.code': "If the email has a number code", 'cl.verify': "Sign in with code", 'cl.codeBad': "That code is wrong or has expired.", 'cl.resend': "Send the email again", 'cl.resent': "Sent again.", 'cl.linkBad': "That sign-in link has expired. Please request a new one.", 'cl.needGroup': "Sign in first to create a group. Only people you invite can join.", 'cl.needJoin': "Sign in to join “{name}”. You’ll be in as soon as you do.", 'cl.badInvite': "This invite link has changed or no longer exists. Please ask for a new one.", 'cl.fail': "Couldn’t save. Please check your connection.", 'cl.waiting': "Waiting to join", 'cl.approve': "Approve", 'cl.decline': "Decline", 'cl.approved': "Approved.", 'cl.removed': "Removed from the group.", 'cl.noName': "No name", 'cl.signIn': "Sign in",
    's.legal': 'About', 's.privacy': 'Privacy Policy', 's.terms': 'Terms of Use', 's.support': 'Contact support', 's.delete': 'Delete account', 'del.body': 'Your account, your notes, and your saves and likes will be deleted. This can’t be undone.', 'del.ok': 'Delete', 'del.done': 'Your account was deleted. Thank you for being here.', 's.version': 'Version',
    'card.feed': 'Feed 4:5', 'card.story': 'Story 9:16', 'card.shareImg': 'Share as image', 'card.noShare': 'Image sharing is blocked on this screen. In the app it goes straight to Instagram or KakaoTalk.',
    'wg.title': 'Home screen widgets', 'wg.sub': 'Daily verse · Today’s thanks · Today’s reflection. Put the ones you like on your home screen and tap to write.',
    'wg.ios': 'iPhone', 'wg.android': 'Android', 'wg.write': 'Write a line', 'wg.done': 'Done for today',
    'wg.iosSteps': 'Touch and hold an empty spot on the Home Screen|Tap “+” at the top left|Find “Daily Thanks”|Pick a size and tap “Add Widget”',
    'wg.androidSteps': 'Touch and hold an empty spot on the home screen|Tap “Widgets”|Find “Daily Thanks”|Touch and hold the widget, then place it',
    'wg.ok': 'Added it', 'wg.later': 'Maybe later', 'wg.okToast': 'Now you can leave thanks right from your home screen.', 'wg.laterToast': 'You can find it anytime in Settings › Home widget.',
    'wg.note': 'This is a preview. The real widget can be added once the app is installed.',
    'vis.public': 'Everyone', 'vis.private': 'Private', 'vis.me': 'Only me', 'vis.privateHint': "Only you, or only the groups you pick. You can pick more than one group.",
    'inf.people': 'Reached {n} people', 'inf.peopleBig': '{n}', 'inf.peopleSub': 'people your thanks reached', 'inf.peopleNote': 'People who liked, saved or shared your posts. In the app, people who open your KakaoTalk / Instagram links are added too.',
    'ft.title': 'Features (turn on to use)', 'ft.hint': 'The app is just thanks by default. Turn on only what you need.',
    'ft.groupShare': 'Group sharing', 'ft.groupShareSub': 'Answer a weekly question together in your group.',
    'ft.prayer': 'Prayer requests', 'ft.prayerSub': 'Share prayer requests; others tap “I prayed”.',
    'ft.sermon': "Sermon summaries", 'ft.sermonSub': 'Record a sermon and get tidy notes.',
    'ft.on': '{name} is on.', 'ft.off': '{name} is off.',
    'kind.prayer': 'Prayer request', 'pr.ph': 'Share what you’d like prayer for.', 'pr.prayed': 'I prayed', 'pr.prayedToast': 'You prayed with them.', 'pr.count': '{n} people prayed', 'pr.section': 'Prayer requests', 'pr.empty': 'No prayer requests yet.', 'pr.who': 'Prayed',
    'gs.section': 'This week’s sharing', 'gs.answers': '{n} answers', 'gs.write': 'Share', 'gs.view': 'Read answers', 'gs.ph': 'Share your thoughts on this week’s question.', 'gs.saved': 'Shared with your group.', 'gs.empty': 'No answers yet. Be the first.',
    'sm.section': 'Sermon notes', 'sm.new': 'New sermon note', 'sm.empty': 'Record a sermon or paste a transcript and get tidy notes.', 'sm.record': 'Upload a recording', 'sm.paste': 'Paste a transcript', 'sm.title': 'Sermon title (optional)', 'sm.preacher': 'Preacher (optional)', 'sm.make': 'Make notes', 'sm.demo': "This prototype shows a sample. In the app, the recording is written out and summarized automatically.",
    'sm.passages': 'Passage', 'sm.main': 'Main message', 'sm.points': 'Points', 'sm.apply': 'Application', 'sm.prayer': 'Prayer', 'sm.questions': 'Discussion', 'sm.toGroup': 'Send questions to group sharing',
    'np.title': 'Daily gratitude<br>makes life richer.', 'np.sub': '',
    'np.r1': 'Once a day, only at the time you choose.', 'np.r2': 'No reminder on days you’ve already written.', 'np.r3': 'Group news is bundled and quiet.',
    'np.when': 'When should we remind you?', 'np.dawn': 'Dawn', 'np.morning': 'Morning', 'np.evening': 'Evening', 'np.dawnSub': 'Entrust the day', 'np.morningSub': 'Open the day', 'np.eveningSub': 'Look back', 'np.other': 'Other time',
    'np.allow': 'Turn on reminders', 'np.later': 'Maybe later', 'np.on': 'We’ll gently remind you at {time} each day.', 'np.blocked': 'Saved {time}. This screen can’t ask for notification permission, so the app will ask again.', 'np.laterToast': 'You can turn them on anytime in Settings › Reminder time.', 'np.test': 'This is how reminders look. Leave one thing you’re thankful for today?',
    'dq.label': 'Today’s question',
    'cal.title': '{mon} · {n} days of thanks', 'cal.recap': 'This week', 'cal.dayEmpty': 'Nothing written on this day.',
    'mem.label': 'Looking back', 'mem.ago': '{n} days ago', 'mem.week': 'A week ago today', 'mem.month': 'A month ago today', 'mem.year': 'A year ago today',
    'rc.title': 'Your week in thanks', 'rc.count': 'You gave thanks on {n} days this week', 'rc.notes': '{n} notes', 'rc.empty': 'Nothing written this week yet.', 'rc.share': 'Share my week', 'rc.shareHead': 'My thanks this week',
    'ms.title': '{n} notes of thanks', 'ms.body': 'Each one is a small light in a day. Let’s keep gathering them, gently.',
    'share.kakao': 'Send via KakaoTalk', 'share.insta': 'Share to Instagram', 'share.outNote': 'Sharing to KakaoTalk or Instagram reaches more people, so it raises your reach the most.', 'share.copied': 'Copied. Paste it into Instagram to share.',
    'inf.ext': '{n} of them on KakaoTalk / Instagram',
    'kind.thanks': 'Give thanks to', 'ty.to': 'Their name', 'ty.ph': 'Write your thank-you message.', 'ty.make': 'Make a thank-you card', 'ty.card': 'Thank-you card', 'ty.send': 'Send',
    'ty.copy': 'Copy text', 'ty.toGroup': 'Share with a group', 'ty.saved': 'Your card is kept in My Thanks.', 'ty.needName': 'Add their name.',
    'inf.title': 'My gratitude reach', 'inf.received': 'Received', 'inf.given': 'Given', 'inf.likes': 'Likes', 'inf.shares': 'Shares', 'inf.saves': 'Saves', 'inf.score': 'pts',
    'inf.candle': 'Candle', 'inf.lantern': 'Lantern', 'inf.sunlight': 'Sunlight', 'inf.starlight': 'Starlight', 'inf.glow': 'The further your thanks travels, the brighter it glows.', 'inf.next': '{n} pts to {level}', 'inf.max': 'Top level reached',
    'inf.top': 'Thanks that reached most this week', 'inf.how': 'Likes on your posts count 1, saves 2, in-app shares 3, KakaoTalk/Instagram shares 5. It isn’t a contest — it shows how far your thanks travelled.',
    'inf.week': 'This week', 'top.badge': 'Reached many',
    'cel.title': 'Seven days of thanks in a row', 'cel.body': 'Small thanks, day after day, became a whole week. That’s wonderful. Let’s walk gently into the next one too.', 'cel.ok': 'Keep going', 'cel.share': 'Share',
    'cel.shareText': 'I wrote down something I’m thankful for every day this week. — Daily Thanks', 'cel.mid': '{n} days of thanks in a row. Lovely!',
    'mod.title': 'This can’t be posted as is', 'mod.body': 'It includes language that could hurt others.', 'mod.found': 'Flagged', 'mod.edit': 'Edit', 'mod.private': 'Keep it to myself',
    'mod.appeal': 'Wrongly flagged? Ask for a review', 'mod.appealNote': 'A moderator will check it and post it if it’s fine.', 'mod.appealed': 'Sent to a moderator for review. You’ll see the result in My Thanks.',
    'mod.review': 'In review', 'mod.rejected': 'Not posted', 'mod.privateOk': 'You can always keep any note to yourself.',
    'size.title': 'Text size', 'size.s': 'Small', 'size.m': 'Medium', 'size.l': 'Large', 'readMore': 'Read more',
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
    'compose.qToday': 'What are you thankful for today?', 'compose.qAhead': 'What are you entrusting to God with thanks?',
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
    'ch.kicker': '7 DAYS TOGETHER', 'ch.title': 'Challenge', 'ch.desc': 'Fill seven days of thanks with a friend or group. Miss a day and simply pick it back up.', 'ch.new': 'New challenge', 'ch.write': 'Write today’s thanks', 'ch.detail': 'Details', 'ch.day': 'Day ',
    'ch.fine': 'In this offline demo, members and progress are saved only in this browser. Real invitations need a server and user accounts.',
    'ch.createTitle': 'Start a challenge', 'ch.name': 'Name', 'ch.defaultName': 'Walking together', 'ch.with': 'Who’s joining you?', 'ch.pair': 'Just a friend and me (invite links after launch)', 'ch.pairShort': 'A friend and me',
    'ch.createHint': 'Missing a day won’t reset your week. Real invites and live sync arrive once the backend is built.', 'ch.start': 'Start', 'toast.chStarted': 'Your challenge has begun.',
    'ch.question': 'Who are you thankful for today?', 'ch.detailHint': 'So one person’s post doesn’t count for everyone, the real service needs per-member check-ins.', 'ch.rest': 'Rest a day, then carry on.',
    'gr.kicker': 'SMALL GROUPS', 'gr.title': 'Groups', 'gr.desc': 'Thanks shared only with people close to you.', 'gr.new': 'New group', 'gr.posts': ' posts', 'gr.open': 'Open feed',
    'gr.createTitle': 'New group', 'gr.name': 'Group name', 'gr.ph': 'e.g. Wednesday Bible study', 'gr.create': 'Create', 'toast.grCreated': 'Group created.', 'gr.fine': 'Real invites, joining and permissions come with the server.',
    'j.kicker': 'MY GRATITUDE', 'j.title': 'My Thanks', 'j.desc': 'Your thanks for today and thanks offered ahead, all in one place.', 'j.all': 'All', 'j.new': '＋ Write new thanks', 'j.empty': 'No thanks recorded yet.', 'j.reflect': 'Look back with thanks', 'j.delete': 'Delete', 'j.confirmDelete': 'Delete this note?',
    'n.title': 'My time for thanks', 'n.hint': 'One gentle reminder a day, at the time you choose, so a single line never feels like a chore.', 'n.time': 'Reminder time', 'n.enable': 'Daily reminder', 'n.group': 'Bundle group updates', 'n.example': 'Lock-screen preview', 'n.ex1': 'One moment you were thankful for', 'n.ex2': 'Small things count. Leave a single line?', 'n.save': 'Save', 'n.fine': 'This screen does not schedule real push notifications. That needs permission and native/web push setup.', 'toast.nSaved': 'Demo settings saved.',
    'w.title': 'Home screen widget', 'w.desc': 'A design preview — not a real iPhone widget.', 'w.today': 'Today’s thanks', 'w.q': 'What made you smile today?', 'w.write': '＋ Write a line', 'w.sub': '7 days together', 'w.view': 'View challenge', 'w.fine': 'Installing a real widget and opening the app from it is built in the native iOS/Android phase.',
    's.title': 'Settings', 's.lang': 'Language · 언어', 's.notify': 'Reminder time', 's.widget': 'Home widget preview', 's.export': 'Copy my demo data (JSON)', 'cancel': 'Cancel', 's.reset': 'Start over', 'fs.enter': 'Full screen', 'fs.exit': 'Exit full screen', 'fs.close': 'Close', 'fs.closeAria': 'Close full screen',
    'nudge': 'Scroll for more', 'gate.kicker': 'Today’s thanks', 'gate.q': 'What are you thankful for today?', 'gate.ph': 'One line is enough.', 'gate.private': 'Only me', 'gate.public': 'Everyone', 'gate.save': 'Save my thanks', 'gate.later': 'Maybe later',
    'gate.saved': 'Your thanks for today is saved.', 'gate.savedSub': 'Swipe up to keep reading others’ thanks.',
    'login.title': 'Sign in<br>to keep reading.', 'login.sub': 'Sign in once and the app opens straight in next time. Your thanks stays safe too.',
    'login.apple': 'Continue with Apple', 'login.google': 'Continue with Google', 'login.phone': 'Continue with phone number',
    'inv.copy': "Copy link", 'inv.btn': "Invite", 'inv.title': "Invite link", 'inv.desc': "Anyone with this link can join “{name}”.", 'inv.share': "Send link", 'inv.msg': "Join “{name}” on daily thanks and share gratitude together:", 'join.title': "Group invite", 'join.body': "Join “{name}”? Thanks shared in a group are visible to its members only.", 'join.ok': "Join", 'join.done': "You joined “{name}”.", 'join.already': "You’re already in this group.", 'verse.kicker': "A verse", 'verse.title': "Bible verses", 'verse.freq': "How often", 'verse.hint': "A Bible verse appears between posts. Choose how often you’d like to see one.", 'verse.often': "Often", 'verse.normal': "Normal", 'verse.rare': "Rarely", 'verse.off': "Off", 'verse.note.often': "About one verse every 4 posts", 'verse.note.normal': "About one verse every 8 posts", 'verse.note.rare': "About one verse every 15 posts", 'verse.note.off': "No verses in the feed", 'verse.read': "Keep reading", 'rd.loading': "Loading…", 'rd.offline': "Couldn’t load the passage. Check your internet connection.", 'rd.retry': "Try again", 'rd.end': "You’ve read through to Revelation. Well done.", 'rd.pick': "Read through the Bible", 'rd.progress': "{n} of {total} chapters read", 'rd.ot': "Old Testament", 'rd.nt': "New Testament", 'devo.kicker': "Today’s passage", 'devo.sub': "Read it, then share what you received with your group.", 'devo.count': "{n} shared today", 'devo.read': "Read", 'devo.share': "Share a reflection", 'devo.change': "Change passage", 'devo.none': "Pick today’s passage for your group", 'devo.noneSub': "Everyone in the group will see it.", 'devo.set': "Set today’s passage", 'devo.ph': "e.g. John 3:1-15", 'devo.hint': "Type a book and chapter, e.g. Psalm 23 or Philippians 4:6-7.", 'devo.bad': "Couldn’t read that passage. e.g. John 3:1-15", 'devo.save': "Set", 'devo.ph2': "What did today’s passage give you?", 'kind.meditation': "Reflection", 'ch.type': "What will you do together?", 'ch.t.thanks': "Daily thanks", 'ch.q.meditation': "What did today’s passage give you?", 'ch.q.prayer': "What shall we pray for today?", 'share.link': "Copy link", 'verse.saved': "Saved · My Thanks › Saved", 'verse.unsaved': "Removed from saved.", 'act.like': "Like", 'hint.swipeRead': "Swipe left to read the Bible", 'hint.swipeBack': "Swipe right to go back to thanks", 'day.today': "Today", 'day.yesterday': "Yesterday", 'j.month': "{m} · {n} days of thanks", 'j.monthTitle': "This month", 'imm.all': "Everyone", 'imm.group': "Group", 'gs.week': "This week", 'gs.people': "{n} of us took part", 'gs.quiet': "Waiting for this week’s first share", 'gs.counts': "Thanks {t} · Reflections {m} · Prayer requests {p}", 'gs.chDay': "day {n}", 'gs.write': "Share", 'gs.nudge': "Nudge the group", 'gs.nudged': "Invited today", 'gs.nudgeDone': "A gentle note went to the whole group.", 'gs.privacy': "No one’s name is shown here, only what we did together.", 'pl.kicker': "Prayer requests", 'pl.others': "Prayer requests from others", 'pl.othersSub': "Pray for someone you have never met.", 'pl.empty': "No prayer requests yet", 'pl.back': "Swipe left to go back to thanks", 'ct.title': "This can’t be shared", 'ct.body': "Contact details, follow or promotion requests, and requests for money can’t be posted to Everyone or a group. Please share just the thanks.", 'ct.email': "Email", 'ct.phone': "Phone number", 'ct.link': "Link", 'ct.social': "Contact or follow request", 'ct.money': "Money request", 'gs.chToday': "Write today", 'gs.chStart': "Start a challenge", 'pl.caught': "You’re caught up on your groups.", 'pl.ask': "Would you like to pray for others too?", 'pl.yes': "Pray for others", 'ch.t.bible': "Bible reading", 'ch.len': "For how long?", 'ch.days': "{n} days", 'ch.read': "Read today", 'gs.peopleShort': "{n} this week", 'gs.quietShort': "Quiet this week", 'mp.load': "Load", 'share.sendLink': "Send link", 'share.linkMsg': "A line of thanks on daily thanks", 'act.note': "Note", 'mp.addPrev': "+ Earlier verse", 'mp.addNext': "Next verse +", 'fs.open': "Expand", 'gs.today': "{n} of {total} took part today", 'gs.weekPeople': "{n} of {total} took part this week", 'col.line': "Collections", 'col.title': "Collections", 'col.month': "Month", 'col.season': "Season", 'col.year': "Year", 'col.mTitle': "{m} {k}", 'col.sTitle': "{s} {k}", 'col.yTitle': "My {y}", 'col.sub': "{n} notes · {d} days", 'col.spring': "Spring", 'col.summer': "Summer", 'col.autumn': "Autumn", 'col.winter': "Winter", 'col.post': "Post to Instagram", 'col.save': "Save images", 'col.hint': "{n} images · swipe to see them. Private notes and prayer requests are left out.", 'col.empty': "Nothing to collect yet.", 'col.saved': "Images saved.", 'wg.label': "Daily verse", 'gs.new': "New", 'gs.todayShort': "Today", 'bp.title': "Choose a passage", 'bp.ok': "Done", 'bp.pick': "Choose a passage", 'bp.hintV': "Tap a second verse to pick a range", 'bp.law': "Law", 'bp.hist': "History", 'bp.poet': "Poetry", 'bp.major': "Major prophets", 'bp.minor': "Minor prophets", 'bp.gosp': "Gospels", 'bp.acts': "History", 'bp.paul': "Paul’s letters", 'bp.gen': "General letters", 'bp.proph': "Prophecy", 'bp.ch': "Ch. {n}", 'bp.v': "v. {n}", 'f.thanks': "Thanks", 'f.med': "Reflections", 'f.prayer': "Prayers", 'col.kAll': "All", 'col.kTitle.thanks': "thanks", 'col.kTitle.meditation': "reflections", 'col.kTitle.prayer': "prayers", 'col.kTitle.all': "moments", 'col.hintP': "{n} images · swipe to see them. Private notes are left out.", 'draft.saved': "Saved", 'st.line': "{n}-day streak", 'st.none': "Start a streak with today’s thanks", 'gd.back': "Groups", 'gd.week': "This week", 'gd.thanks': "Thanks", 'gd.med': "Reflections", 'gd.prayer': "Prayers", 'gd.recent': "Recent", 'gd.all': "See all", 'gd.invite': "Invite", 'gd.share': "Share", 'gd.empty': "Nothing shared yet", 'col.reel': "Make a reel", 'col.reeling': "Making the video… {p}%", 'col.reelPost': "Post the video", 'col.reelSave': "Save video", 'col.photos': "Photos", 'col.video': "Video", 'wg.thanksLabel': "Today’s thanks", 'wg.medLabel': "Today’s reflection", 'wg.write2': "Write", 'wg.medWrite': "Reflect", 'wg.medDone': "Reflected today", 'wg.streak': "{n}-day streak", 'share.linkSub': "A link that opens your thanks", 'ch.u.d': "Days", 'ch.u.w': "Weeks", 'ch.u.m': "Months", 'ch.total': "{n} days in all", 'ch.from': "From", 'ch.to': "To", 'ch.pace': "How to split it?", 'ch.byPeriod': "Over a time", 'ch.byChapters': "Chapters a day", 'ch.perDay': "{n} a day", 'ch.sumBible': "{total} chapters · {days} days · about {per} a day", 'ch.sumBible2': "{total} chapters · {per} a day · {days} days", 'ch.pick': "Choose", 'ch.today': "Today {r}", 'ch.chUnit': "ch.", 'chn.thanks': "Gratitude challenge", 'chn.prayer': "Prayer challenge", 'chn.meditation': "Reflection challenge", 'chn.bible': "Bible reading challenge", 'vault.title': "Privacy lock", 'vault.body': "Your notes are locked on this device before they go to the server. The key stays on your device, so not even the people running the service can read them. Only posts you share with everyone are readable.", 'vault.code': "Recovery key", 'vault.codeHint': "You’ll need this key to open your notes on a new phone. Write it down somewhere safe — if it’s lost, no one can recover it.", 'vault.copy': "Copy recovery key", 'vault.restore': "Enter a key from another device", 'vault.restorePh': "Recovery key", 'vault.restored': "Recovery key added.", 'vault.bad': "That key doesn’t match.", 'vault.locked': "This device needs your recovery key. Add it in Settings › Privacy lock.", 'vault.group': "Group posts are locked with the group’s own key. It travels only inside the invite link and never reaches the server.", 'prot.noShare': "Only the person who wrote a group post can share it.", 'prot.shot': "Group posts can’t be shared by screenshot.", 'gend.title': "You’re all caught up", 'gend.sub': "Your turn — share today with your group.", 'gend.thanks': "Share thanks", 'gend.meditation': "Share a reflection", 'gend.prayer': "Share a prayer request", 'off.title': "Save the Bible offline", 'off.body': "Saves the full 개역한글 · KJV · Reina-Valera 1909 (free, public-domain translations) on this device so you can read anytime, even offline. The phone app already includes them.", 'off.go': "Save", 'off.doing': "Saving… {n}/{t}", 'off.done': "The whole Bible is saved.", 'off.fail': "Some books didn’t save. Please try again.", 'tile.ch': "{name} {n}/{t}", 'ch.counted': "Counts as day {n} of your {name}", 'j.bible': "{n} Bible chapters read · {p}%", 'j.bibleWeek': "{n} this week", 'j.bibleNone': "Start reading the Bible", 'ty.from': "From (your name)", 'ty.reply': "Thanks back to {name}", 'ls.title': "Start your group", 'ls.sub': "Just three things.", 'ls.s1': "Send the invite link", 'ls.s1b': "Send it by text or chat — one tap and they’re in.", 'ls.s2': "First challenge: 7 days of thanks", 'ls.s2b': "Share thanks together for a week. One tap to start.", 'ls.s3': "Share the first thanks today", 'ls.s3b': "When the leader goes first, others follow.", 'ls.go': "Start", 'ls.done': "Done", 'ls.admin': "Whoever creates the group is its admin. Use ⋯ › Manage group to choose who can invite and who’s in.", 'adm.title': "Manage group", 'adm.invite': "Members can invite too", 'adm.inviteOff': "Only the admin can invite", 'adm.approve': "I approve new people first", 'adm.newLink': "Make a new invite link", 'adm.newLinkDone': "New link made. The old link no longer lets people in.", 'adm.members': "Members", 'adm.remove': "Remove", 'adm.removed': "{name} was removed from the group.", 'adm.pending': "No one is waiting for approval.", 'adm.only': "Only the admin can do this.", 'adm.you': "Me · admin", 'adm.row': "Manage group", 'join.pending': "You’ll be in once the leader approves.", 'gr.pending': "Waiting for approval", 'cp.now': "Happening now", 'cp.day': "Day {n} today", 'cp.join': "Join in", 'cp.withGroup': "With my group", 'cp.joined': "You’re in", 'cp.recap': "Make my recap", 'cp.left': "{n} days left", 'rc.wkTitle': "{n} thanks this week", 'rc.wkSub': "Your week, gathered into cards — ready to post if you like.", 'rc.wkGo': "See the cards", 'col.week': "Week", 'col.wTitle': "This week’s {k}", 'col.wTitle2': "Week of {mon} {d}", 'adm.sure': "Remove for sure?", 'chr.done': "Done", 'chr.title': "{name} complete!", 'chr.sub': "You made it all {n} days together.", 'chr.mine': "Me {d}/{t} days", 'chr.group': "{g} · {n} people shared {c} together", 'chr.top': "Most faithful", 'chr.days': "{n} days", 'chr.toGroup': "Share the result with the group", 'chr.shareCard': "Share result card", 'chr.posted': "Shared with your group.", 'chr.postText': "We finished {name} together! {n} of us shared {c}. Thank you, everyone.", 'chr.see': "See result", 'qz.kicker': "Gratitude research quiz {i}/{n}", 'qz.right': "Correct!", 'qz.wrong': "Not quite.", 'qz.score': "{r}/{n} right", 'qz.resTitle': "You got {r} of {n}", 'qz.resSub': "The research says one thing: small, frequent thanks lasts.", 'qz.resGo': "Write today’s thanks", 'qz.q1': "People who wrote down things they were grateful for each week for 10 weeks exercised how much more per week than others?", 'qz.o1': "About 30 minutes|About 1.5 hours|About 3 hours", 'qz.f1': "The gratitude group exercised about 1.5 hours more a week and reported fewer physical complaints.", 'qz.s1': "Emmons & McCullough, 2003", 'qz.q2': "People wrote “three good things” every night for one week. How long did the happiness boost last?", 'qz.o2': "1 week|1 month|6 months", 'qz.f2': "Just one week of practice — and higher happiness and fewer depressive symptoms lasted for six months.", 'qz.s2': "Seligman et al., 2005", 'qz.q3': "After writing gratitude letters, how long afterward did brain scans still show a difference?", 'qz.o3': "A day|A week|3 months", 'qz.f3': "Three months later, scans still showed greater gratitude-related brain activity.", 'qz.s3': "Kini et al., 2016", 'chu.title': "Church admin", 'chu.make': "Church admin? Create your church", 'chu.ph': "Church name", 'chu.create': "Create", 'chu.stats': "{g} groups · {m} members · {t} took part today", 'chu.allCh': "Start a challenge for every group", 'chu.newGroup': "New group", 'chu.leader': "Leader: {name}", 'chu.noLeader': "No leader yet", 'chu.setLeader': "Set leader", 'chu.move': "Move member", 'chu.open': "Open", 'chu.pickMember': "Who should move?", 'chu.pickTarget': "To which group?", 'chu.moved': "Moved {name} to {g}.", 'chu.leaderSet': "{name} now leads {g}.", 'chu.today': "Today {n}/{t}", 'chu.shared': "Same passage for every group (daily plan)", 'chu.allStarted': "Started a challenge in every group.", 'chu.entry': "Church admin · {name}", 'qz.answer': "Answer", 'qz.why': "Why", 'gh.left': "Swipe left to read the Bible", 'gh.right': "Swipe right for prayer requests", 'gh.up': "Swipe up for the next thanks", 's.intro': "Show the first-time tips again", 'toast.intro': "The first-time tips will show again.", 'note.mine': "My reflection", 'note.pickRange': "Which verses are you reflecting on?", 'j.byBible': "In Bible order", 'nick.title': "Member names", 'nick.hint': "Only changes on your screen. Others still see the original name.", 'nick.edit': "Rename", 'nick.orig': "Original name {name}", 'nick.ph': "e.g. Mom, Dad", 'nick.save': "Save", 'nick.reset': "Use original name", 'nick.row': "Rename members", 'bb.title': "Daily Bible · The Word, every day", 'bb.read': "Read", 'bb.notes': "Sermon notes", 'bb.me': "Me", 'bb.newNote': "Sermon note", 'bb.continue': "Continue reading", 'bb.where': "Where you left off", 'bb.start': "Start with Genesis 1", 'bb.pick': "Choose a passage", 'bb.today': "Today’s passage", 'bb.readToday': "Read today’s passage", 'bb.plan': "Bible reading challenge", 'sn.title': "Sermon notes", 'sn.sub': "Write down the sermon with its passage.", 'sn.new': "New sermon note", 'sn.empty': "No sermon notes yet.", 'sn.free': "Free notes {n}/{t}", 'sn.plan': "{plan} plan · this month {n}/{t}", 'sn.monthly': "Monthly", 'sn.yearly': "Yearly", 'sn.rec': "Record", 'sn.file': "File", 'sn.text': "Text", 'sn.titleF': "Sermon title (optional)", 'sn.preacher': "Preacher (optional)", 'sn.recStart': "Start recording", 'sn.recStop': "Stop recording", 'sn.recOn': "Recording {t}", 'sn.recDone': "Recorded · {t}", 'sn.pickFile': "Choose a recording", 'sn.paste': "Paste the sermon transcript here", 'sn.make': "Save", 'sn.need': "Add a recording, a file or a transcript.", 'sn.short': "That transcript is too short.", 'sn.queued': "Waiting to be summarized", 'sn.working': "Writing your notes…", 'sn.failed': "Couldn’t summarize", 'sn.offline': "Will be summarized once you’re online", 'sn.example': "Example", 'sn.main': "Main message", 'sn.points': "Points", 'sn.apply': "Application", 'sn.prayer': "Prayer", 'sn.questions': "Discussion", 'sn.passages': "Passages", 'sn.transcript': "Full transcript", 'sn.share': "Share", 'sn.delete': "Delete", 'sn.deleteQ': "Delete this note? This can’t be undone.", 'sn.deleted': "Note deleted.", 'sn.back': "Sermon notes", 'pw.title': "Your storage is full", 'pw.body': "Delete a few recordings to keep going, or get more space and stop worrying about it.", 'pw.clean': "Tidy up my recordings", 'pw.monthly': "Monthly", 'pw.yearly': "Yearly", 'pw.mPrice': "$3.99 / month", 'pw.yPrice': "$29.99 / year", 'pw.ySave': "$2.50/month · 2 months free", 'pw.what': "100 GB of space · up to 60 sermon summaries a month", 'pw.soon': "Subscriptions open when the app is in the stores.", 'pw.done': "You have more space now. Record freely.", 'me.title': "Me", 'me.days': "{n}-day reading streak", 'me.saved': "Saved verses", 'me.medi': "Reflections", 'me.planRow': "Subscription", 'me.free': "Free ({t} notes)", 'me.thanks': "Open daily thanks", 'me.none': "Nothing yet", 'rs.today': "{n} today", 'rs.min': "{n} min", 'rs.avg': "{n} a day on average", 'rs.eta': "At this pace you’ll finish {d}", 'rs.week': "{n} this week", 'rs.time': "{n} min this week", 'sn.yt': "YouTube", 'sn.ytPh': "YouTube sermon link", 'sn.ytBad': "Please check the YouTube link.", 'sn.ytNo': "YouTube links work once the server is set up.", 'sn.saving': "Uploading… {n}", 'sn.toMed': "Save as a reflection", 'sn.recNote': "Keep the screen on. The recording uploads in 30-second pieces.", 'sn.write': "Write", 'sn.ref': "Choose passage", 'sn.mainF': "Main message (one line)", 'sn.bodyF': "Sermon notes", 'sn.manual': "Written by you", 'sn.toGroup': "Share with a group", 'sn.shared': "Shared with your group.", 'sn.pickGroup': "Which group?", 'sn.body': "Notes", 'db.title': "My reading", 'db.days': "Days read this week", 'db.time': "Time this month", 'db.chs': "Chapters this month", 'db.avg': "Daily average", 'db.daysV': "{n}/7", 'db.min': "{n} min", 'db.hm': "{h}h {m}m", 'db.chV': "{n}", 'db.c30': "Last 30 days · chapters per day", 'db.wd': "By weekday · average chapters", 'db.streak': "{n}-day streak now · longest {m}", 'db.notes': "Sermon notes {s} · Reflections {m}", 'db.tap': "Tap a bar to see that day", 'db.day': "{d} · {n} ch · {m} min", 'pp.title': "People I send to", 'pp.add': "+ Save a person", 'pp.name': "Name (e.g. Mom)", 'pp.phone': "Phone number", 'pp.save': "Save", 'pp.hint': "Tap to open a text to them, ready to send.", 'pp.del': "Remove", 'med.felt': "What I felt", 'med.prayer': "Prayer", 'med.prayerPh': "A prayer from this passage, or a prayer request", 'med.asReq': "Also share as a prayer request", 'med.rec': "Record your voice", 'med.recStop': "Stop recording", 'med.recDel': "Delete recording", 'med.recNote': "Recordings stay locked on this device.", 'med.recFail': "Can’t use the microphone. Please allow it in Settings.", 'med.voice': "Voice note",
    'sn.aiOn': "Also make a summary automatically", 'sn.aiBtn': "Make a summary", 'sn.aiBusy': "Summarizing…", 'sn.aiLater': "You can summarize once you’re connected.", 'sn.aiTag': "Automatic summary", 'sn.aiShort': "Write a little more to summarize.",
    'rec.start': "Record the sermon", 'rec.hintApp': "Keeps recording with the screen off. If a call comes in and you don’t answer, recording continues; if you answer, it pauses and picks up again when the call ends.", 'rec.hintWeb': "On the web, keep the screen on. In the phone app it keeps recording with the screen off, even when a call comes in.", 'rec.on': "Recording", 'rec.paused': "Paused", 'rec.call': "On a call · continues when it ends", 'rec.pause': "Pause", 'rec.resume': "Resume", 'rec.stop': "Finish", 'rec.del': "Delete recording", 'rec.done': "Recording {t}", 'rec.after': "When you save, the sermon is transcribed and summarized on one page. Your own notes stay too.", 'rec.fgTitle': "Recording the sermon", 'rec.fgText': "Keeps recording with the screen off.", 'rec.nTitle': "Recording paused", 'rec.nText': "If your call has ended, open the app to keep recording.", 'rec.busy': "Transcribing and summarizing the sermon…", 'rec.pending': "It will be transcribed and summarized once you’re online.", 'rec.retry': "Upload again", 'rec.upFail': "Couldn’t upload. Please try again later.", 'rec.listen': "Recording", 'rec.bar': "Recording {t} · Open", 'rec.delQ': "Delete this recording?", 'rec.typing': "Feel free to take notes while recording",
    'rec.kRec': "Record", 'rec.kLive': "Real-time", 'rec.kFile': "Audio file", 'rec.ctxPh': "Adding the topic or names that will come up (Bible figures, events, people) makes the transcript much more accurate. (Optional)", 'rec.btn': "Record · auto summary", 'rec.pick': "Choose an audio file", 'rec.liveHint': "Shows the words as they’re spoken. When you save, the recording is transcribed again, more accurately.", 'rec.fileHint': "Pick a file from your church’s video or a recorder app (m4a, mp3, wav, mp4).", 'rec.liveWait': "Listening…", 'rec.file': "File {t}",
    'sn.refReq': "Choose the passage", 'sn.church': "Church", 'sn.pastor': "Pastor", 'sn.placeNew': "＋ Enter new", 'sn.date': "Date", 'rec.needRef': "Choose the passage first. The transcript and summary follow the verses you pick, so they come out more accurate.", 'nt.sum': "Summary", 'nt.tr': "Transcript", 'nt.pass': "Passage", 'nt.noTr': "No transcript yet. Record or use an audio file and the full text shows up here.", 'vc.title': "Verses in the sermon, next to the Bible text", 'vc.none': "No verses found in the sermon yet.", 'vc.match': "Matches the text", 'vc.para': "Paraphrased", 'vc.unsure': "Which verse is this?", 'vc.ok': "You confirmed it", 'vc.said': "Sermon", 'vc.orig': "Bible", 'vc.yes': "That’s right", 'vc.fix': "It’s a different verse", 'vc.fixQ': "Type the right verse (e.g. John 3:16)", 'vc.bad': "Couldn’t find that verse", 'vc.banner': "Check the verse numbers ({n})", 'vc.noOrig': "Couldn’t load the text",
    'pl.title': "Reading plans together", 'pl.new': "Make a reading plan", 'pl.sub': "From where to where, over how many days — split into a daily portion. Invite friends or family to read the same passage on the same day.", 'pl.invite': "Invite", 'pl.invTitle': "Invite to read together", 'pl.invDesc': "Anyone with this link joins ‘{name}’ on the same dates.", 'pl.msg': "{by} Let’s read the Bible together · {name}\n{range} · {days} days\n", 'pl.joinTitle': "Reading invite", 'pl.joinBy': "{by} invited you to read together", 'pl.join': "Read together", 'pl.joined': "You joined the plan", 'pl.already': "You’re already in this plan", 'pl.today': "Today", 'pl.someone': "A friend",
    'bs.off': "Off", 'bs.size': "Bible text size", 'bs.remind': "Reading reminder", 'bs.places': "Church & pastor", 'bs.placesNone': "The church and pastor you type in a sermon note are saved here.", 'bs.placesHint': "When you start a sermon note, the one you use most at that day and hour is filled in first.", 'bs.usually': "Usually {when}", 'bs.sub': "Storage", 'bs.thanks': "Open daily thanks", 'bs.sermon': "Sermon notes", 'bs.reading': "Reading", 'bs.data': "My records", 'bs.deleted': "Deleted",
    'rec.slang': "Sermon language", 'rec.slangSet': "Sermon language: {l}",
    'pv.open': "Read the passage full screen",
    'stk.n': "{n}-day streak", 'stk.sub': "Daily Bible reading", 'stk.todayDone': "Read today", 'stk.todayNot': "Read a chapter today to keep it going", 'stk.start': "Read a chapter today to start a streak", 'stk.best': "Best {n} days",
    'bs.almost': "Almost full",
    'fc.prKick': "{g} prayer requests", 'fc.prTitle': "{n} asked for prayer", 'fc.pray': "Go pray", 'fc.readTitle': "Today’s reading", 'fc.read': "Start reading", 'fc.dayN': "Day {n}", 'fc.write': "Write today’s", 'fc.group': "Group",
    'ss.ph': "Search sermon notes", 'ss.none': "Nothing found for “{q}”", 'ss.count': "{n} found", 'ss.clear': "Clear", 'ss.inTr': "Transcript",
    'fp.kick': "{g} prayer request · {i}/{n}", 'fv.kick': "Today’s reading · {r}", 'fv.count': "{i} / {n}", 'fv.doneTitle': "That’s today’s reading", 'fv.done': "I read it", 'fv.doneSub': "{name} · day {d}", 'fv.marked': "Today’s reading is done",
    'vw.row': "What you see", 'vw.rowSub': "What comes first when you open the app, and what’s in the feed", 'vw.first': "When the app opens, first show", 'vw.fPr': "Group prayer requests", 'vw.fVerse': "Today’s reading (plans)", 'vw.fCh': "Today’s challenge", 'vw.howMany': "How many prayer requests", 'vw.all': "All", 'vw.pause': "Take a break", 'vw.on': "On", 'vw.h24': "24 hours", 'vw.w1': "A week", 'vw.off': "Off", 'vw.until': "Back on {d}", 'vw.feed': "In the feed", 'vw.thanks': "Thanks", 'vw.prayer': "Prayer requests", 'vw.med': "Reflections", 'vw.strangers': "Also show people I don’t know", 'vw.strangersSub': "When off, you only see your posts and people you’re connected to through groups and invites", 'fo.off': "Turn this off", 'fo.h24': "Off for 24 hours", 'fo.offDone': "Turned off. Turn it back on in Settings › What you see.", 'fo.snoozed': "Taking a 24-hour break", 'why.title': "What’s this?", 'why.pr': "New prayer requests were shared in ‘{g}’, so they come first when you open the app. Once you’ve seen one, it won’t come first again.", 'why.plan': "It’s today’s part of your ‘{name}’ plan, so it comes first. (Day {d} of {t})", 'why.settings': "What you see", 'emp.title': "No one to share with yet", 'emp.sub': "Start a group or invite people with a link. Only your posts and people you’re connected to show here.", 'emp.group': "Start a group", 'emp.strangers': "Show thanks from people I don’t know",
    'cu.kick': "Fell behind", 'cu.title': "{n} days behind. That’s okay.", 'cu.sub': "Spread the rest over the {d} days left — about {per} chapters a day? The end date stays the same.", 'cu.yes': "Spread it out", 'cu.no': "Leave it", 'cu.done': "Spread evenly over the days left. Today: {r}", 'cu.short': "{n} days behind · spread the rest",
    'smd.title': "{n}’s reflection", 'smd.someone': "A reflection", 'smd.read': "Read this passage", 'smd.write': "Write my own", 'smd.bad': "Couldn’t open that link",
    'ft.leader': "Small-group leader tools", 'ft.leaderSub': "Run meetings (recorded and summarized), attendance, member reports, group and church dashboards, a view link for your pastor", 'ld.tools': "Leader tools", 'ld.meet': "Start a meeting", 'ld.reports': "Member reports", 'ld.past': "Past meetings", 'ld.live': "Meeting now · {r}", 'ld.join': "Read along", 'mt.title': "Meeting · {d}", 'mt.pass': "Today’s passage (everyone reads along)", 'mt.share': "Open the passage for everyone", 'mt.shared': "The passage opens on everyone’s screen", 'mt.attend': "Attendance", 'mt.me': "Me (leader)", 'mt.notes': "Notes", 'mt.save': "Save meeting", 'mt.view': "Meeting · {d}", 'mt.att': "Attended {n}/{t}", 'mt.absent': "Absent: {names}", 'mt.byMember': "By member", 'mt.shareL': "Shared", 'mt.prayL': "Prayer request", 'mt.prayer': "Pray together for", 'mt.next': "Next time", 'mt.busy': "Writing out the meeting and sorting it by member…", 'mt.pending': "It will be written out and sorted by member once you’re online.", 'mt.none': "No meetings yet.", 'mt.saved': "Meeting saved", 'rp.title': "{name} — report", 'rp.attend': "Meeting attendance", 'rp.shared': "What they shared", 'rp.prayers': "Prayer requests", 'rp.notes': "Leader notes", 'rp.add': "Add a note", 'rp.ph': "Something to remember for them this week (only you and your pastor see this)", 'rp.pick': "Whose report?", 'rp.none': "Nothing yet", 'cat.set': "Category", 'cat.ph': "e.g. Area 1, Young adults", 'cat.none': "No category", 'cat.rename': "Rename", 'cat.namePh': "Group name", 'ps.link': "View link for your pastor", 'ps.desc': "A link with where things stand now (attendance, this week’s sharing, meeting summaries, leader notes). It opens as a dashboard in the app. Anyone with the link can see it — send it only to your pastor.", 'ps.title': "{c} dashboard", 'ps.asof': "As of {d}", 'ps.att4': "Recent attendance", 'ps.lastMeet': "Last meeting", 'ps.reports': "Leader notes", 'ps.members': "{n} people", 'dash.att': "Attendance {p}%", 'dash.meet': "{n} meetings this month",
    'us.title': "Usage", 'us.day': "Summaries today", 'us.week': "Summaries this week", 'us.space': "Storage", 'us.reset': "Refills in {t}", 'us.full': "Used up", 'us.more': "Get more space", 'us.h': "{n} h", 'us.m': "{n} min", 'us.d': "{n} days", 'us.dayHit': "You’ve used today’s summaries. It will continue in {t}. Your recording is saved.", 'us.weekHit': "You’ve used this week’s summaries. It will continue in {t}. Your recording is saved.",
    'us.used': "{p}% used", 'us.at': "Resets at {t}", 'us.atTom': "Resets tomorrow {t}", 'us.atDay': "Resets {d} {t}", 'us.reset2': "{w}", 'us.secSum': "Summaries", 'us.secWeek': "Weekly limit", 'us.secSpace': "Storage", 'us.secExtra': "Extra usage", 'us.noExtra': "None right now", 'us.noExtraSub': "When you get some, it shows up here with its expiry date.", 'us.refresh': "Refresh",
    'us.spaceCard': "Recordings & notes",
    'cel.today': "Done for today", 'cel.dayOf': "{name} · {d}/{t} days", 'cel.book': "You finished {book}", 'cel.bible': "You read the whole Bible", 'cel.share': "Share", 'size.xl': "Extra large", 'size.btn': "Text size", 'stk.write': "{n}-day streak", 'stk.new': "{n} new", 'np.noon': "Noon", 'np.noonSub': "Midday", 'np.planTitle': "When should we remind you<br>to read today’s passage?", 'np.chTitle': "When should we remind you<br>on challenge days?", 'np.multi': "You can pick more than one", 'yr.btn': "Share my year in the Word", 'yr.title': "My {y} in the Word", 'yr.chapters': "{n} chapters", 'yr.read': "read", 'yr.days': "{n} days", 'yr.daysL': "in the Word", 'yr.best': "Longest streak {n} days", 'yr.books': "{n} books finished", 'yr.pct': "{p}% of the Bible", 'yr.feed': "Feed 4:5", 'yr.story': "Story 9:16", 'yr.reel': "Make a video", 'yr.post': "Post to Instagram", 'yr.save': "Save", 'yr.making': "Making the video… {p}%", 'sm.full': "One verse at a time",
    'np.cr1': "Only at the times you choose.", 'np.pr2': "No reminder once today’s reading is done.", 'np.cr2': "No reminder once today’s part is done.",
    'bf.devo': "Today’s passage", 'bf.endTitle': "You spent time in the Word today", 'bf.endSub': "Keep reading, or write a sermon note.", 'bf.cont': "Keep reading", 'bf.home': "Home", 'bf.note': "Sermon note",
    'bn.feed': "Feed", 'bn.group': "Community", 'bn.plus': "Write", 'bp.title2': "What would you like to write?", 'bp.sermon': "Sermon note", 'bp.med': "Reflection", 'bp.thanks': "Thanks", 'bp.prayer': "Prayer request", 'bp.plan': "Reading plan",
    'kk.thanks': "Thanks", 'sn.addRef': "+ Add a passage", 'sn.rmRef': "Remove passage", 'rt.done': "Read through {n}×", 'rt.round': "Round {k}", 'rt.since': "since {d}", 'rt.title': "Read-through history", 'rt.now': "Reading now", 'rt.nowLine': "Round {k} · since {d} · {n}/{t} chapters", 'rt.notYet': "Not started yet", 'rt.past': "Finished", 'rt.item': "Round {k}", 'rt.days': "{n} days", 'rt.none': "When you finish the whole Bible, it’s kept here.", 'rt.recent': "Recently read", 'rt.empty': "Each chapter you read shows up here by day.", 'rt.cel': "You read the whole Bible — {n}×", 'rt.chs': "{n} ch.", 'upd.title': "A new version is ready", 'upd.body': "Please update daily thanks to keep using it smoothly.", 'upd.go': "Update", 'login.terms': "By continuing, you agree to the <a href=\"{base}/terms\" target=\"_blank\" rel=\"noopener\">Terms of Use</a> and <a href=\"{base}/privacy\" target=\"_blank\" rel=\"noopener\">Privacy Policy</a>. There is no tolerance for abusive or objectionable content.", 'login.demo': 'In this prototype nothing connects to a real account; only the signed-in state is saved on this device.', 'login.done': 'You’re signed in. Next time it opens straight in.',
    'phone.title': 'Sign in with your phone', 'phone.number': 'Phone number', 'phone.send': 'Send code', 'phone.code': '6-digit code', 'phone.verify': 'Verify',
    'phone.sent': 'Code sent.', 'phone.demo': 'No text is sent in this prototype. Enter any 6 digits.', 'phone.bad': 'Please check the number.', 'phone.badCode': 'Enter the 6-digit code.',
    'acct.signedIn': 'Signed in', 'acct.logout': 'Sign out', 'acct.loggedOut': 'Signed out.', 'fs.ios': 'On iPhone, open it from Safari’s Share button → “Add to Home Screen” to see it full screen like an app.', 'fs.blocked': 'Full screen isn’t available here.', 's.fine': 'Your notes are stored only in this browser and don’t sync to other browsers or devices.', 's.confirmReset': 'Erase your notes and settings and start over? This can’t be undone.', 'toast.reset': 'Demo reset.', 'toast.noStore': 'This browser can’t save data right now.'
  },
  es: {
    'snz.ok': "Apagar", 'snz.title': "¿Qué quieres apagar?", 'snz.what': "Apagar", 'snz.all': "Todo", 'snz.for': "Por cuánto tiempo", 'snz.until': "Hasta que lo active", 'snz.hint': "Actívalo cuando quieras en Ajustes › Qué ves.", 'mc.title': "Mis comunidades", 'mc.ph': "Código de tu iglesia, grupo, capítulo o retiro", 'mc.connect': "Conectar", 'mc.none': "Escribe el código que te dieron para conectarte con una comunidad.", 'mc.bad': "Revisa el código.", 'mc.needSign': "Inicia sesión para conectarte. Te conectamos enseguida.", 'mc.joining': "Conectando…", 'mc.admin': "Admin", 'mc.quiet': "Silenciar", 'mc.loud': "Activar", 'mc.quietOn': "Silenciado · sin avisos ni puntos nuevos", 'mc.quietDone': "Silenciado. Sin avisos ni puntos nuevos.", 'mc.loudDone': "Volverás a recibir avisos.", 'mc.leave': "Salir", 'mc.leaveQ': "¿Salir de “{name}”? Necesitarás un código o enlace para volver.", 'mc.left': "Saliste de la comunidad.", 'mc.ownerStay': "Los administradores no pueden salir. Gestiónalo desde el grupo.", 'join.pendingShort': "Esperando aprobación",
    'tour.k.verse': "Versículo de hoy", 'tour.k.prayer': "Petición del grupo", 'tour.k.thanks': "Gratitud", 'tour.s.verse': "Desliza para leer la Biblia", 'tour.s.prayer': "Entérate de las peticiones de tu comunidad", 'tour.s.thanks': "Comparte tu gratitud", 'tour.f.title': "También aquí", 'tour.f.read': "Leer", 'tour.f.readSub': "El pasaje de hoy, donde te quedaste, planes en grupo", 'tour.f.notes': "Notas de sermón", 'tour.f.notesSub': "Graba un sermón y se vuelve notas ordenadas", 'tour.f.group': "Comunidad", 'tour.f.groupSub': "Crea un grupo e invita con un enlace",
    'tour.skip': "Omitir", 'tour.done': "Empezar", 'tour.again': "Ver el recorrido otra vez",
    'wl.title': "Bienvenido", 'wl.nameQ': "¿Primera vez aquí? ¿Cómo te llamas? Se verá en las tarjetas de gratitud y en tus grupos.", 'wl.next': "Siguiente", 'wl.hi': "Bienvenido, {name}", 'wl.sub': "Regístrate para seguir en cualquier dispositivo y unirte a un grupo.", 'wl.google': "Continuar con Google", 'wl.ms': "Continuar con Microsoft", 'wl.kakao': "Continuar con Kakao", 'wl.email': "Continuar con correo", 'wl.phone': "Continuar con un mensaje de texto", 'wl.notYet': "Esta opción abre pronto. Por ahora, continúa con tu correo.",
    'bp.thankSomeone': "Agradecer a alguien",
    'adm.topLeaders': "Los líderes también ven “Más constantes”",
    'cl.title': "Iniciar sesión", 'cl.name': "Nombre", 'cl.namePh': "Aparece como remitente en las tarjetas de gratitud", 'cl.email': "Correo", 'cl.send': "Enviarme un enlace", 'cl.sending': "Enviando…", 'cl.badEmail': "Revisa el correo.", 'cl.sendFail': "No se pudo enviar el correo. Inténtalo en un momento.", 'cl.tooMany': "Demasiados correos por ahora. Inténtalo en un momento.", 'cl.sentTitle': "Revisa tu correo", 'cl.sentBody': "Enviamos un enlace a {email}. Tócalo en el correo para iniciar sesión.", 'cl.code': "Si el correo trae un código numérico", 'cl.verify': "Entrar con el código", 'cl.codeBad': "El código no es correcto o ya venció.", 'cl.resend': "Enviar el correo otra vez", 'cl.resent': "Enviado otra vez.", 'cl.linkBad': "El enlace venció. Pide uno nuevo.", 'cl.needGroup': "Inicia sesión para crear un grupo. Solo entran las personas que invites.", 'cl.needJoin': "Inicia sesión para unirte a “{name}”. Entrarás enseguida.", 'cl.badInvite': "Este enlace cambió o ya no existe. Pide uno nuevo.", 'cl.fail': "No se pudo guardar. Revisa tu conexión.", 'cl.waiting': "Esperando unirse", 'cl.approve': "Aprobar", 'cl.decline': "Rechazar", 'cl.approved': "Aprobado.", 'cl.removed': "Salió del grupo.", 'cl.noName': "Sin nombre", 'cl.signIn': "Iniciar sesión",
    's.legal': 'Acerca de', 's.privacy': 'Política de privacidad', 's.terms': 'Términos de uso', 's.support': 'Contactar soporte', 's.delete': 'Eliminar cuenta', 'del.body': 'Se eliminarán tu cuenta, tus notas y tus guardados y me gusta. No se puede deshacer.', 'del.ok': 'Eliminar', 'del.done': 'Eliminamos tu cuenta. Gracias por estar aquí.', 's.version': 'Versión',
    'card.feed': 'Feed 4:5',
    'card.story': 'Historia 9:16',
    'card.shareImg': 'Compartir como imagen',
    'card.noShare': 'Esta pantalla no permite compartir imágenes. En la app se envía directo a Instagram o KakaoTalk.',
    'wg.title': 'Widgets de inicio',
    'wg.sub': 'Versículo del día · Gratitud de hoy · Reflexión de hoy. Pon los que quieras en tu pantalla de inicio y tócalos para escribir.',
    'wg.ios': 'iPhone',
    'wg.android': 'Android',
    'wg.write': 'Escribir una línea',
    'wg.done': 'Listo por hoy',
    'wg.iosSteps': 'Mantén presionado un espacio vacío de la pantalla de inicio|Toca “+” arriba a la izquierda|Busca “Daily Thanks”|Elige un tamaño y toca “Agregar widget”',
    'wg.androidSteps': 'Mantén presionado un espacio vacío de la pantalla de inicio|Toca “Widgets”|Busca “Daily Thanks”|Mantén presionado el widget y colócalo',
    'wg.ok': 'Ya lo agregué',
    'wg.later': 'Más tarde',
    'wg.okToast': 'Ahora puedes dar gracias desde tu pantalla de inicio.',
    'wg.laterToast': 'Lo encuentras cuando quieras en Ajustes › Widget de inicio.',
    'wg.note': 'Esto es una vista previa. El widget real se agrega al instalar la app.',
    'vis.public': 'Todos',
    'vis.private': 'Privado',
    'vis.me': 'Solo yo',
    'vis.privateHint': "Solo tú, o solo los grupos que elijas. Puedes elegir más de uno.",
    'inf.people': 'Llegó a {n} personas',
    'inf.peopleBig': '{n}',
    'inf.peopleSub': 'personas a las que llegó tu gratitud',
    'inf.peopleNote': 'Personas que dieron me gusta, guardaron o compartieron tus publicaciones. En la app también se suman quienes abren tus enlaces de KakaoTalk / Instagram.',
    'ft.title': 'Funciones (actívalas para usarlas)',
    'ft.hint': 'Por defecto la app es solo gratitud. Activa solo lo que necesites.',
    'ft.groupShare': 'Compartir en grupo',
    'ft.groupShareSub': 'Respondan juntos una pregunta semanal en su grupo.',
    'ft.prayer': 'Peticiones de oración',
    'ft.prayerSub': 'Comparte peticiones; otros tocan “Oré”.',
    'ft.sermon': "Resúmenes de sermones",
    'ft.sermonSub': 'Graba un sermón y recibe notas ordenadas.',
    'ft.on': '{name} está activado.',
    'ft.off': '{name} está desactivado.',
    'kind.prayer': 'Petición de oración',
    'pr.ph': 'Comparte por qué te gustaría que oren.',
    'pr.prayed': 'Oré',
    'pr.prayedToast': 'Oraste con ellos.',
    'pr.count': '{n} personas oraron',
    'pr.section': 'Peticiones de oración',
    'pr.empty': 'Aún no hay peticiones de oración.',
    'pr.who': 'Oraron',
    'gs.section': 'Lo que compartimos esta semana',
    'gs.answers': '{n} respuestas',
    'gs.write': 'Compartir',
    'gs.view': 'Leer respuestas',
    'gs.ph': 'Comparte lo que piensas sobre la pregunta de esta semana.',
    'gs.saved': 'Compartido con tu grupo.',
    'gs.empty': 'Aún no hay respuestas. Sé la primera persona.',
    'sm.section': 'Notas de sermón',
    'sm.new': 'Nueva nota de sermón',
    'sm.empty': 'Graba un sermón o pega una transcripción y recibe notas ordenadas.',
    'sm.record': 'Subir una grabación',
    'sm.paste': 'Pegar una transcripción',
    'sm.title': 'Título del sermón (opcional)',
    'sm.preacher': 'Predicador (opcional)',
    'sm.make': 'Crear notas',
    'sm.demo': "Este prototipo muestra un ejemplo. En la app, la grabación se transcribe y se resume automáticamente.",
    'sm.passages': 'Pasaje',
    'sm.main': 'Mensaje principal',
    'sm.points': 'Puntos',
    'sm.apply': 'Aplicación',
    'sm.prayer': 'Oración',
    'sm.questions': 'Para conversar',
    'sm.toGroup': 'Enviar preguntas al grupo',
    'np.title': 'La gratitud diaria<br>enriquece la vida.',
    'np.sub': 'Daily gratitude makes life richer',
    'np.r1': 'Una vez al día, solo a la hora que elijas.',
    'np.r2': 'Sin recordatorio los días que ya escribiste.',
    'np.r3': 'Las novedades del grupo llegan juntas y en calma.',
    'np.when': '¿Cuándo te lo recordamos?',
    'np.dawn': 'Madrugada',
    'np.morning': 'Mañana',
    'np.evening': 'Noche',
    'np.dawnSub': 'Encomendar el día',
    'np.morningSub': 'Abrir el día',
    'np.eveningSub': 'Mirar atrás',
    'np.other': 'Otra hora',
    'np.allow': 'Activar recordatorios',
    'np.later': 'Más tarde',
    'np.on': 'Te lo recordaremos con suavidad cada día a las {time}.',
    'np.blocked': 'Guardado a las {time}. Esta pantalla no puede pedir permiso de notificaciones; la app te lo pedirá de nuevo.',
    'np.laterToast': 'Puedes activarlos cuando quieras en Ajustes › Hora del recordatorio.',
    'np.test': 'Así se ven los recordatorios. ¿Dejas algo por lo que estás agradecido hoy?',
    'dq.label': 'Pregunta de hoy',
    'cal.title': '{mon} · {n} días de gratitud',
    'cal.recap': 'Esta semana',
    'cal.dayEmpty': 'No escribiste nada este día.',
    'mem.label': 'Mirando atrás',
    'mem.ago': 'Hace {n} días',
    'mem.week': 'Hace una semana',
    'mem.month': 'Hace un mes',
    'mem.year': 'Hace un año',
    'rc.title': 'Tu semana de gratitud',
    'rc.count': 'Diste gracias {n} días esta semana',
    'rc.notes': '{n} notas',
    'rc.empty': 'Aún no escribiste nada esta semana.',
    'rc.share': 'Compartir mi semana',
    'rc.shareHead': 'Mi gratitud esta semana',
    'ms.title': '{n} notas de gratitud',
    'ms.body': 'Cada una es una pequeña luz en un día. Sigamos reuniéndolas, con calma.',
    'share.kakao': 'Enviar por KakaoTalk',
    'share.insta': 'Compartir en Instagram',
    'share.outNote': 'Compartir en KakaoTalk o Instagram llega a más personas, por eso es lo que más aumenta tu alcance.',
    'share.copied': 'Copiado. Pégalo en Instagram para compartir.',
    'inf.ext': '{n} de ellas en KakaoTalk / Instagram',
    'kind.thanks': 'Dar gracias a',
    'ty.to': 'Su nombre',
    'ty.ph': 'Escribe tu mensaje de agradecimiento.',
    'ty.make': 'Crear tarjeta de agradecimiento',
    'ty.card': 'Tarjeta de agradecimiento',
    'ty.send': 'Enviar',
    'ty.copy': 'Copiar texto',
    'ty.toGroup': 'Compartir con un grupo',
    'ty.saved': 'Tu tarjeta queda guardada en Mi gratitud.',
    'ty.needName': 'Agrega su nombre.',
    'inf.title': 'El alcance de mi gratitud',
    'inf.received': 'Recibido',
    'inf.given': 'Dado',
    'inf.likes': 'Me gusta',
    'inf.shares': 'Compartidos',
    'inf.saves': 'Guardados',
    'inf.score': 'pts',
    'inf.candle': 'Vela',
    'inf.lantern': 'Farol',
    'inf.sunlight': 'Luz del sol',
    'inf.starlight': 'Luz de estrellas',
    'inf.glow': 'Cuanto más lejos llega tu gratitud, más brilla.',
    'inf.next': '{n} pts para {level}',
    'inf.max': 'Llegaste al nivel más alto',
    'inf.top': 'Gratitud que más lejos llegó esta semana',
    'inf.how': 'Los me gusta en tus publicaciones cuentan 1, los guardados 2, los compartidos en la app 3 y en KakaoTalk/Instagram 5. No es una competencia: muestra hasta dónde llegó tu gratitud.',
    'inf.week': 'Esta semana',
    'top.badge': 'Llegó a muchos',
    'cel.title': 'Siete días seguidos de gratitud',
    'cel.body': 'Pequeñas gracias, día tras día, se volvieron una semana entera. Es hermoso. Caminemos con calma hacia la próxima.',
    'cel.ok': 'Seguir',
    'cel.share': 'Compartir',
    'cel.shareText': 'Esta semana escribí cada día algo por lo que estoy agradecido. — Daily Thanks',
    'cel.mid': '{n} días seguidos de gratitud. ¡Qué lindo!',
    'mod.title': 'No se puede publicar así',
    'mod.body': 'Incluye palabras que podrían herir a otros.',
    'mod.found': 'Marcado',
    'mod.edit': 'Editar',
    'mod.private': 'Guardarlo solo para mí',
    'mod.appeal': '¿Se marcó por error? Pide una revisión',
    'mod.appealNote': 'Un moderador lo revisará y lo publicará si está bien.',
    'mod.appealed': 'Enviado a un moderador. Verás el resultado en Mi gratitud.',
    'mod.review': 'En revisión',
    'mod.rejected': 'No publicado',
    'mod.privateOk': 'Siempre puedes guardar cualquier nota solo para ti.',
    'size.title': 'Tamaño del texto',
    'size.s': 'Pequeño',
    'size.m': 'Mediano',
    'size.l': 'Grande',
    'readMore': 'Leer más',
    'save': 'Guardar',
    'saved.on': 'Guardado. Lo encuentras en Mi gratitud › Guardados.',
    'saved.off': 'Quitado de guardados.',
    'j.saved': 'Guardados',
    'j.savedEmpty': 'Aún no guardaste nada. Toca Guardar en una publicación que te acompañe.',
    'more': 'Más',
    'menu.report': 'Reportar',
    'menu.hide': 'Ocultar esta publicación',
    'menu.block': 'Bloquear a esta persona',
    'menu.unsave': 'Quitar de guardados',
    'report.title': 'Reportar',
    'report.q': '¿Por qué reportas esta publicación?',
    'report.anon': 'No le diremos a la persona quién la reportó.',
    'report.spam': 'Spam o publicidad',
    'report.hate': 'Discurso de odio o acoso',
    'report.violence': 'Contenido violento o peligroso',
    'report.sexual': 'Contenido sexual',
    'report.false': 'Información falsa',
    'report.privacy': 'Información privada de alguien',
    'report.selfharm': 'Autolesión o suicidio',
    'report.other': 'Otra cosa',
    'report.otherPh': 'Cuéntanos qué está mal (opcional)',
    'report.send': 'Reportar',
    'report.done': 'Gracias por avisarnos',
    'report.doneSub': 'Lo revisaremos y actuaremos según nuestras normas. Gracias por ayudar a que este espacio sea amable.',
    'report.help': 'Si alguien está en peligro ahora mismo, hay ayuda disponible.',
    'report.help1': 'Llama o escribe al 988 (EE. UU.) · 109 (Corea)',
    'report.help2': 'En una emergencia, llama al número de emergencias local',
    'hidden.done': 'Publicación oculta.',
    'blocked.done': 'Bloqueaste a {name}. Ya no verás sus publicaciones.',
    'block.confirm': '¿Bloquear a {name}? No verás sus publicaciones y no se le avisará.',
    'block.ok': 'Bloquear',
    's.blocked': 'Publicaciones ocultas y personas bloqueadas',
    'blocked.none': 'No hay publicaciones ocultas ni personas bloqueadas.',
    'blocked.users': 'Personas bloqueadas',
    'blocked.posts': 'Publicaciones ocultas',
    'unblock': 'Desbloquear',
    'restore': 'Mostrar de nuevo',
    'done': 'Listo',
    'note.delete': 'Eliminar',
    'note.reflect': 'Mirar atrás con gratitud',
    'note.share': 'Compartir',
    's.about': 'Este prototipo guarda tus notas solo en este dispositivo. Las invitaciones, la sincronización y las notificaciones llegan en la versión final.',
    's.guest': 'Sin iniciar sesión',
    's.account': 'Cuenta',
    'send.pick': '¿Con qué grupo?',
    'share.note': 'Comparte solo publicaciones públicas o las que tienes permiso de compartir.',
    'share.toGroup': 'Compartir con un grupo',
    'compose.publicNote': 'Cualquiera puede leer y compartir las publicaciones para Todos.',
    'scope.all': 'Todos',
    'scope.groupShort': 'Grupo',
    'scope.me': 'Solo yo',
    'kind.aheadShort': 'Gracias de antemano',
    'gr.count': '{n} gracias',
    'doc.title': 'Daily Thanks · Un día que lleva gratitud',
    'aria.home': 'Inicio de Daily Thanks',
    'aria.settings': 'Ajustes',
    'aria.nav': 'Menú principal',
    'aria.lang': 'Cambiar idioma',
    'aria.close': 'Cerrar',
    'aria.next': 'Siguiente',
    'lang.other': 'Idioma',
    'top.write': 'Escribir',
    'nav.today': 'Hoy',
    'nav.group': 'Grupos',
    'nav.challenge': '7 días',
    'nav.journal': 'Mi gratitud',
    'feed.mygroup': 'Mi grupo',
    'feed.public': 'Todos',
    'feed.subPublic': 'Gratitud encontrada en los días de otros',
    'feed.subGroup': 'Gratitud compartida en nuestro grupo',
    'feed.together': '7 días',
    'feed.empty': 'Aún no hay gratitud aquí.<br>Sé la primera persona en compartir.',
    'feed.swipe': 'Desliza para ver la siguiente',
    'kind.today': 'Gratitud de hoy',
    'kind.ahead': 'Gracias de antemano · Oración',
    'meta.today': 'Nota de hoy',
    'meta.ahead': 'Oración de esta semana',
    'meta.shared': 'Compartido',
    'scope.public': 'Todos',
    'scope.private': 'Solo yo',
    'scope.group': 'Grupo',
    'act.share': 'Compartir',
    'act.group': 'Grupo',
    'me': 'Yo',
    'reflect.prefix': 'Mirando atrás',
    'toast.likeAhead': 'Orando contigo.',
    'toast.likeToday': 'Agradecidos contigo.',
    'compose.title': 'Una línea de gratitud',
    'compose.qToday': '¿Por qué estás agradecido hoy?',
    'compose.qAhead': '¿Qué le encomiendas a Dios con gratitud?',
    'compose.phToday': 'Escribe un momento por el que diste gracias.',
    'compose.phAhead': 'Dios, esta semana también…',
    'compose.samples': 'Toca una frase y hazla tuya',
    'sample.work': 'En el trabajo',
    'sample.relationship': 'En las relaciones',
    'sample.everyday': 'En lo cotidiano',
    'compose.who': '¿Con quién lo compartes?',
    'compose.private': 'Solo yo (predeterminado)',
    'compose.group': 'Mi grupo',
    'compose.public': 'Todos',
    'compose.groupLabel': 'Grupo',
    'compose.hint': 'Guarda tus oraciones personales con “Solo yo”. Las publicaciones públicas pueden leerlas y compartirlas otros.',
    'compose.submit': 'Guardar',
    'toast.saved': 'Tu gratitud quedó guardada.',
    'reflect.title': 'Mirar atrás con gratitud',
    'reflect.before': 'La gratitud que diste de antemano',
    'reflect.q': '¿Qué gracia encontraste de verdad esta semana?',
    'reflect.ph': 'Los momentos pequeños también cuentan.',
    'reflect.submit': 'Agregar',
    'toast.reflected': 'Una semana de gratitud, agregada.',
    'share.title': 'Compartir gratitud',
    'share.hint': 'Vista previa antes de integrar KakaoTalk/Instagram. Comparte solo publicaciones públicas o con permiso de su autor.',
    'share.copy': 'Copiar texto',
    'share.native': 'Compartir en otra app',
    'share.hint2': 'Puedes usar el menú para compartir de tu teléfono con KakaoTalk o Instagram; las tarjetas propias necesitan una integración aparte.',
    'toast.copied': 'Copiado.',
    'toast.noShare': 'Aquí no se puede compartir desde el dispositivo.',
    'send.title': 'Compartir con un grupo',
    'send.hint': 'Mantén el nombre de quien escribió. Pide permiso antes de enviar una nota privada de alguien.',
    'send.target': 'Grupo con el que compartir',
    'send.submit': 'Compartir con este grupo',
    'toast.sent': 'Compartido con el grupo.',
    'ch.kicker': '7 DÍAS JUNTOS',
    'ch.title': 'Reto',
    'ch.desc': 'Completen siete días de gratitud con un amigo o un grupo. Si faltas un día, simplemente sigue.',
    'ch.new': 'Nuevo reto',
    'ch.write': 'Escribir la gratitud de hoy',
    'ch.detail': 'Detalles',
    'ch.day': 'Día ',
    'ch.fine': 'En esta demo sin conexión, los miembros y el progreso se guardan solo en este navegador. Las invitaciones reales necesitan un servidor y cuentas.',
    'ch.createTitle': 'Empezar un reto',
    'ch.name': 'Nombre',
    'ch.defaultName': 'Caminando juntos',
    'ch.with': '¿Quién te acompaña?',
    'ch.pair': 'Un amigo y yo (enlaces de invitación tras el lanzamiento)',
    'ch.pairShort': 'Un amigo y yo',
    'ch.createHint': 'Faltar un día no reinicia tu semana. Las invitaciones y la sincronización llegan con el servidor.',
    'ch.start': 'Empezar',
    'toast.chStarted': 'Tu reto comenzó.',
    'ch.question': '¿A quién quieres agradecer hoy?',
    'ch.detailHint': 'Para que la publicación de una persona no cuente por todos, el servicio real necesita registros por miembro.',
    'ch.rest': 'Descansa un día y sigue.',
    'gr.kicker': 'GRUPOS PEQUEÑOS',
    'gr.title': 'Grupos',
    'gr.desc': 'Gratitud compartida solo con personas cercanas.',
    'gr.new': 'Nuevo grupo',
    'gr.posts': ' publicaciones',
    'gr.open': 'Abrir feed',
    'gr.createTitle': 'Nuevo grupo',
    'gr.name': 'Nombre del grupo',
    'gr.ph': 'p. ej. Estudio bíblico del miércoles',
    'gr.create': 'Crear',
    'toast.grCreated': 'Grupo creado.',
    'gr.fine': 'Las invitaciones, el ingreso y los permisos reales llegan con el servidor.',
    'j.kicker': 'MI GRATITUD',
    'j.title': 'Mi gratitud',
    'j.desc': 'Tu gratitud de hoy y la que diste de antemano, todo en un lugar.',
    'j.all': 'Todo',
    'j.new': '＋ Escribir nueva gratitud',
    'j.empty': 'Aún no registraste gratitud.',
    'j.reflect': 'Mirar atrás con gratitud',
    'j.delete': 'Eliminar',
    'j.confirmDelete': '¿Eliminar esta nota?',
    'n.title': 'Mi momento de gratitud',
    'n.hint': 'Un recordatorio suave al día, a la hora que elijas, para que una sola línea nunca sea una carga.',
    'n.time': 'Hora del recordatorio',
    'n.enable': 'Recordatorio diario',
    'n.group': 'Agrupar novedades del grupo',
    'n.example': 'Vista en la pantalla bloqueada',
    'n.ex1': 'Algo por lo que estás agradecido hoy',
    'n.ex2': 'Las cosas pequeñas cuentan. ¿Dejas una línea?',
    'n.save': 'Guardar',
    'n.fine': 'Esta pantalla no programa notificaciones reales. Eso requiere permiso y configuración nativa o web push.',
    'toast.nSaved': 'Ajustes de la demo guardados.',
    'w.title': 'Widget de inicio',
    'w.desc': 'Una vista previa del diseño, no un widget real de iPhone.',
    'w.today': 'Gratitud de hoy',
    'w.q': '¿Qué te hizo sonreír hoy?',
    'w.write': '＋ Escribir una línea',
    'w.sub': '7 días juntos',
    'w.view': 'Ver reto',
    'w.fine': 'Instalar un widget real y abrir la app desde él se hace en la fase nativa de iOS/Android.',
    's.title': 'Ajustes',
    's.lang': 'Idioma · Language · 언어',
    's.notify': 'Hora del recordatorio',
    's.widget': 'Widget de inicio',
    's.export': 'Copiar mis datos de demo (JSON)',
    'cancel': 'Cancelar',
    's.reset': 'Empezar de nuevo',
    'fs.enter': 'Pantalla completa',
    'fs.exit': 'Salir de pantalla completa',
    'fs.close': 'Cerrar',
    'fs.closeAria': 'Cerrar pantalla completa',
    'nudge': 'Desliza para ver más',
    'gate.kicker': 'Gratitud de hoy',
    'gate.q': '¿Por qué estás agradecido hoy?',
    'gate.ph': 'Una línea es suficiente.',
    'gate.private': 'Solo yo',
    'gate.public': 'Todos',
    'gate.save': 'Guardar mi gratitud',
    'gate.later': 'Más tarde',
    'gate.saved': 'Tu gratitud de hoy quedó guardada.',
    'gate.savedSub': 'Desliza para seguir leyendo la gratitud de otros.',
    'login.title': 'Inicia sesión<br>para seguir leyendo.',
    'login.sub': 'Inicia sesión una vez y la próxima vez la app se abre directo. Tu gratitud también queda a salvo.',
    'login.apple': 'Continuar con Apple',
    'login.google': 'Continuar con Google',
    'login.phone': 'Continuar con número de teléfono',
    'inv.copy': "Copiar enlace", 'inv.btn': "Invitar", 'inv.title': "Enlace de invitación", 'inv.desc': "Quien tenga este enlace puede unirse a “{name}”.", 'inv.share': "Enviar enlace", 'inv.msg': "Únete a “{name}” en daily thanks y compartamos gratitud:", 'join.title': "Invitación al grupo", 'join.body': "¿Unirte a “{name}”? Lo que se comparte en un grupo solo lo ven sus miembros.", 'join.ok': "Unirme", 'join.done': "Te uniste a “{name}”.", 'join.already': "Ya estás en este grupo.", 'verse.kicker': "Un versículo", 'verse.title': "Versículos", 'verse.freq': "Con qué frecuencia", 'verse.hint': "Entre las publicaciones aparece un versículo. Elige con qué frecuencia verlo.", 'verse.often': "A menudo", 'verse.normal': "Normal", 'verse.rare': "Poco", 'verse.off': "No", 'verse.note.often': "Un versículo cada 4 publicaciones aprox.", 'verse.note.normal': "Un versículo cada 8 publicaciones aprox.", 'verse.note.rare': "Un versículo cada 15 publicaciones aprox.", 'verse.note.off': "Sin versículos en el feed", 'verse.read': "Seguir leyendo", 'rd.loading': "Cargando…", 'rd.offline': "No se pudo cargar el pasaje. Revisa tu conexión a internet.", 'rd.retry': "Reintentar", 'rd.end': "Leíste hasta Apocalipsis. ¡Bien hecho!", 'rd.pick': "Leer toda la Biblia", 'rd.progress': "{n} de {total} capítulos leídos", 'rd.ot': "Antiguo Testamento", 'rd.nt': "Nuevo Testamento", 'devo.kicker': "Pasaje de hoy", 'devo.sub': "Léelo y comparte con tu grupo lo que recibiste.", 'devo.count': "{n} compartidos hoy", 'devo.read': "Leer", 'devo.share': "Compartir reflexión", 'devo.change': "Cambiar pasaje", 'devo.none': "Elige el pasaje de hoy para tu grupo", 'devo.noneSub': "Todo el grupo lo verá.", 'devo.set': "Elegir el pasaje de hoy", 'devo.ph': "p. ej. Juan 3:1-15", 'devo.hint': "Escribe libro y capítulo, p. ej. Salmos 23 o Filipenses 4:6-7.", 'devo.bad': "No se reconoció el pasaje. p. ej. Juan 3:1-15", 'devo.save': "Elegir", 'devo.ph2': "¿Qué te dio el pasaje de hoy?", 'kind.meditation': "Reflexión", 'ch.type': "¿Qué harán juntos?", 'ch.t.thanks': "Gratitud diaria", 'ch.q.meditation': "¿Qué te dio el pasaje de hoy?", 'ch.q.prayer': "¿Por qué oramos hoy?", 'share.link': "Copiar enlace", 'verse.saved': "Guardado · Mi gratitud › Guardado", 'verse.unsaved': "Quitado de guardados.", 'act.like': "Me gusta", 'hint.swipeRead': "Desliza a la izquierda para leer la Biblia", 'hint.swipeBack': "Desliza a la derecha para volver a la gratitud", 'day.today': "Hoy", 'day.yesterday': "Ayer", 'j.month': "{m} · {n} días de gratitud", 'j.monthTitle': "Este mes", 'imm.all': "Todos", 'imm.group': "Grupo", 'gs.week': "Esta semana", 'gs.people': "{n} participaron", 'gs.quiet': "Esperando lo primero de esta semana", 'gs.counts': "Gratitud {t} · Reflexiones {m} · Peticiones {p}", 'gs.chDay': "día {n}", 'gs.write': "Compartir", 'gs.nudge': "Invitar a todos hoy", 'gs.nudged': "Invitados hoy", 'gs.nudgeDone': "Se envió una nota suave a todo el grupo.", 'gs.privacy': "Aquí no se ve quién participó, solo lo que hicimos juntos.", 'pl.kicker': "Peticiones de oración", 'pl.others': "Peticiones de otras personas", 'pl.othersSub': "Ora también por alguien que no conoces.", 'pl.empty': "Aún no hay peticiones", 'pl.back': "Desliza a la izquierda para volver a la gratitud", 'ct.title': "Esto no se puede compartir", 'ct.body': "No se pueden publicar datos de contacto, pedidos de seguidores o promoción, ni pedidos de dinero en Todos o en un grupo. Comparte solo la gratitud.", 'ct.email': "Correo", 'ct.phone': "Teléfono", 'ct.link': "Enlace", 'ct.social': "Contacto o pedido de seguir", 'ct.money': "Pedido de dinero", 'gs.chToday': "Escribir hoy", 'gs.chStart': "Empezar un reto", 'pl.caught': "Ya viste las peticiones de tus grupos.", 'pl.ask': "¿Quieres orar también por otras personas?", 'pl.yes': "Orar por otros", 'ch.t.bible': "Lectura bíblica", 'ch.len': "¿Por cuánto tiempo?", 'ch.days': "{n} días", 'ch.read': "Leer hoy", 'gs.peopleShort': "{n} esta semana", 'gs.quietShort': "Tranquilo esta semana", 'mp.load': "Cargar", 'share.sendLink': "Enviar enlace", 'share.linkMsg': "Una gratitud en daily thanks", 'act.note': "Nota", 'mp.addPrev': "+ Versículo anterior", 'mp.addNext': "Versículo siguiente +", 'fs.open': "Ampliar", 'gs.today': "Hoy participaron {n} de {total}", 'gs.weekPeople': "Esta semana participaron {n} de {total}", 'col.line': "Colecciones", 'col.title': "Colecciones", 'col.month': "Mes", 'col.season': "Estación", 'col.year': "Año", 'col.mTitle': "{K} de {m}", 'col.sTitle': "{K} de {s}", 'col.yTitle': "Mi {y}", 'col.sub': "{n} notas · {d} días", 'col.spring': "primavera", 'col.summer': "verano", 'col.autumn': "otoño", 'col.winter': "invierno", 'col.post': "Publicar en Instagram", 'col.save': "Guardar imágenes", 'col.hint': "{n} imágenes · desliza para verlas. Las notas privadas y peticiones de oración no se incluyen.", 'col.empty': "Aún no hay nada que reunir.", 'col.saved': "Imágenes guardadas.", 'wg.label': "Versículo del día", 'gs.new': "Nuevo", 'gs.todayShort': "Hoy", 'bp.title': "Elegir un pasaje", 'bp.ok': "Listo", 'bp.pick': "Elegir un pasaje", 'bp.hintV': "Toca un segundo versículo para elegir un rango", 'bp.law': "Ley", 'bp.hist': "Historia", 'bp.poet': "Poesía", 'bp.major': "Profetas mayores", 'bp.minor': "Profetas menores", 'bp.gosp': "Evangelios", 'bp.acts': "Historia", 'bp.paul': "Cartas de Pablo", 'bp.gen': "Cartas generales", 'bp.proph': "Profecía", 'bp.ch': "Cap. {n}", 'bp.v': "v. {n}", 'f.thanks': "Gratitud", 'f.med': "Reflexiones", 'f.prayer': "Oraciones", 'col.kAll': "Todo", 'col.kTitle.thanks': "gratitud", 'col.kTitle.meditation': "reflexiones", 'col.kTitle.prayer': "oraciones", 'col.kTitle.all': "momentos", 'col.hintP': "{n} imágenes · desliza para verlas. Las notas privadas no se incluyen.", 'draft.saved': "Guardado", 'st.line': "{n} días seguidos", 'st.none': "Empieza una racha con la gratitud de hoy", 'gd.back': "Grupos", 'gd.week': "Esta semana", 'gd.thanks': "Gratitud", 'gd.med': "Reflexiones", 'gd.prayer': "Oraciones", 'gd.recent': "Reciente", 'gd.all': "Ver todo", 'gd.invite': "Invitar", 'gd.share': "Compartir", 'gd.empty': "Aún no hay nada compartido", 'col.reel': "Crear un reel", 'col.reeling': "Creando el video… {p}%", 'col.reelPost': "Publicar el video", 'col.reelSave': "Guardar video", 'col.photos': "Fotos", 'col.video': "Video", 'wg.thanksLabel': "Gratitud de hoy", 'wg.medLabel': "Reflexión de hoy", 'wg.write2': "Escribir", 'wg.medWrite': "Reflexionar", 'wg.medDone': "Reflexión hecha", 'wg.streak': "{n} días seguidos", 'share.linkSub': "Un enlace que abre tu gratitud", 'ch.u.d': "Días", 'ch.u.w': "Semanas", 'ch.u.m': "Meses", 'ch.total': "{n} días en total", 'ch.from': "Desde", 'ch.to': "Hasta", 'ch.pace': "¿Cómo dividirlo?", 'ch.byPeriod': "En un tiempo", 'ch.byChapters': "Capítulos al día", 'ch.perDay': "{n} al día", 'ch.sumBible': "{total} capítulos · {days} días · unos {per} al día", 'ch.sumBible2': "{total} capítulos · {per} al día · {days} días", 'ch.pick': "Elegir", 'ch.today': "Hoy {r}", 'ch.chUnit': "cap.", 'chn.thanks': "Reto de gratitud", 'chn.prayer': "Reto de oración", 'chn.meditation': "Reto de reflexión", 'chn.bible': "Reto de lectura bíblica", 'vault.title': "Bloqueo de privacidad", 'vault.body': "Tus notas se bloquean en este dispositivo antes de ir al servidor. La llave queda en tu dispositivo, así que ni quienes administran el servicio pueden leerlas. Solo lo que compartes con todos es legible.", 'vault.code': "Llave de recuperación", 'vault.codeHint': "La necesitarás para abrir tus notas en un teléfono nuevo. Guárdala en un lugar seguro: si se pierde, nadie puede recuperarla.", 'vault.copy': "Copiar llave", 'vault.restore': "Ingresar la llave de otro dispositivo", 'vault.restorePh': "Llave de recuperación", 'vault.restored': "Llave añadida.", 'vault.bad': "La llave no coincide.", 'vault.locked': "Este dispositivo necesita tu llave de recuperación. Añádela en Ajustes › Bloqueo de privacidad.", 'vault.group': "Las publicaciones del grupo se bloquean con la llave del grupo. Solo viaja dentro del enlace de invitación y nunca llega al servidor.", 'prot.noShare': "Solo quien escribió una publicación del grupo puede compartirla.", 'prot.shot': "Las publicaciones del grupo no se pueden compartir con capturas.", 'gend.title': "Ya lo viste todo", 'gend.sub': "Te toca: comparte tu día con tu grupo.", 'gend.thanks': "Compartir gratitud", 'gend.meditation': "Compartir una reflexión", 'gend.prayer': "Compartir una petición", 'off.title': "Guardar la Biblia sin conexión", 'off.body': "Guarda completas 개역한글 · KJV · Reina-Valera 1909 (traducciones libres de dominio público) en este dispositivo para leer siempre, incluso sin internet. La app del teléfono ya las incluye.", 'off.go': "Guardar", 'off.doing': "Guardando… {n}/{t}", 'off.done': "La Biblia completa está guardada.", 'off.fail': "Algunos libros no se guardaron. Inténtalo de nuevo.", 'tile.ch': "{name} {n}/{t}", 'ch.counted': "Cuenta como el día {n} de tu {name}", 'j.bible': "{n} capítulos leídos · {p}%", 'j.bibleWeek': "{n} esta semana", 'j.bibleNone': "Empieza a leer la Biblia", 'ty.from': "De (tu nombre)", 'ty.reply': "Gracias de vuelta a {name}", 'ls.title': "Empieza tu grupo", 'ls.sub': "Solo tres pasos.", 'ls.s1': "Enviar el enlace de invitación", 'ls.s1b': "Envíalo por mensaje: con un toque entran.", 'ls.s2': "Primer reto: 7 días de gratitud", 'ls.s2b': "Compartan gratitud juntos una semana. Un toque para empezar.", 'ls.s3': "Comparte la primera gratitud hoy", 'ls.s3b': "Cuando el líder empieza, los demás siguen.", 'ls.go': "Empezar", 'ls.done': "Hecho", 'ls.admin': "Quien crea el grupo es el administrador. En ⋯ › Administrar grupo decides quién invita y quién está.", 'adm.title': "Administrar grupo", 'adm.invite': "Los miembros también pueden invitar", 'adm.inviteOff': "Solo el administrador puede invitar", 'adm.approve': "Apruebo a las personas nuevas", 'adm.newLink': "Crear un enlace nuevo", 'adm.newLinkDone': "Enlace nuevo creado. El anterior ya no deja entrar.", 'adm.members': "Miembros", 'adm.remove': "Quitar", 'adm.removed': "{name} salió del grupo.", 'adm.pending': "Nadie espera aprobación.", 'adm.only': "Solo el administrador puede hacerlo.", 'adm.you': "Yo · administrador", 'adm.row': "Administrar grupo", 'join.pending': "Entrarás cuando el líder te apruebe.", 'gr.pending': "Esperando aprobación", 'cp.now': "Ahora mismo", 'cp.day': "Día {n} hoy", 'cp.join': "Unirme", 'cp.withGroup': "Con mi grupo", 'cp.joined': "Ya participas", 'cp.recap': "Crear mi resumen", 'cp.left': "Faltan {n} días", 'rc.wkTitle': "{n} gratitudes esta semana", 'rc.wkSub': "Tu semana en tarjetas, lista para publicar si quieres.", 'rc.wkGo': "Ver las tarjetas", 'col.week': "Semana", 'col.wTitle': "{K} de esta semana", 'col.wTitle2': "Semana del {d} de {mon}", 'adm.sure': "¿Quitar de verdad?", 'chr.done': "Hecho", 'chr.title': "¡{name} completado!", 'chr.sub': "Llegaron juntos a los {n} días.", 'chr.mine': "Yo {d}/{t} días", 'chr.group': "{g} · {n} personas compartieron {c}", 'chr.top': "Los más constantes", 'chr.days': "{n} días", 'chr.toGroup': "Compartir el resultado con el grupo", 'chr.shareCard': "Compartir tarjeta", 'chr.posted': "Compartido con tu grupo.", 'chr.postText': "¡Terminamos {name} juntos! {n} compartimos {c}. Gracias a todos.", 'chr.see': "Ver resultado", 'qz.kicker': "Quiz de gratitud {i}/{n}", 'qz.right': "¡Correcto!", 'qz.wrong': "Casi.", 'qz.score': "{r}/{n} correctas", 'qz.resTitle': "Acertaste {r} de {n}", 'qz.resSub': "La investigación dice algo simple: la gratitud pequeña y frecuente perdura.", 'qz.resGo': "Escribir la gratitud de hoy", 'qz.q1': "Quienes anotaron cada semana, durante 10 semanas, cosas por las que estaban agradecidos, ¿cuánto más ejercicio hicieron por semana?", 'qz.o1': "Unos 30 minutos|Unas 1,5 horas|Unas 3 horas", 'qz.f1': "El grupo de gratitud hizo unas 1,5 horas más de ejercicio por semana y reportó menos molestias físicas.", 'qz.s1': "Emmons y McCullough, 2003", 'qz.q2': "Escribieron “tres cosas buenas” cada noche durante una semana. ¿Cuánto duró el aumento de felicidad?", 'qz.o2': "1 semana|1 mes|6 meses", 'qz.f2': "Solo una semana de práctica, y la mayor felicidad y menos síntomas depresivos duraron seis meses.", 'qz.s2': "Seligman et al., 2005", 'qz.q3': "Tras escribir cartas de gratitud, ¿cuánto tiempo después los escáneres cerebrales aún mostraban diferencia?", 'qz.o3': "Un día|Una semana|3 meses", 'qz.f3': "Tres meses después, los escáneres aún mostraban mayor actividad cerebral ligada a la gratitud.", 'qz.s3': "Kini et al., 2016", 'chu.title': "Administración de iglesia", 'chu.make': "¿Administras una iglesia? Créala", 'chu.ph': "Nombre de la iglesia", 'chu.create': "Crear", 'chu.stats': "{g} grupos · {m} miembros · {t} participaron hoy", 'chu.allCh': "Iniciar un reto en todos los grupos", 'chu.newGroup': "Nuevo grupo", 'chu.leader': "Líder: {name}", 'chu.noLeader': "Sin líder", 'chu.setLeader': "Elegir líder", 'chu.move': "Mover miembro", 'chu.open': "Abrir", 'chu.pickMember': "¿A quién mover?", 'chu.pickTarget': "¿A qué grupo?", 'chu.moved': "{name} pasó a {g}.", 'chu.leaderSet': "{name} ahora dirige {g}.", 'chu.today': "Hoy {n}/{t}", 'chu.shared': "Mismo pasaje para todos los grupos (plan diario)", 'chu.allStarted': "Se inició un reto en todos los grupos.", 'chu.entry': "Administración · {name}", 'qz.answer': "Respuesta", 'qz.why': "Explicación", 'gh.left': "Desliza a la izquierda para leer la Biblia", 'gh.right': "Desliza a la derecha para peticiones de oración", 'gh.up': "Desliza hacia arriba para la siguiente", 's.intro': "Volver a ver los consejos iniciales", 'toast.intro': "Los consejos iniciales se verán de nuevo.", 'note.mine': "Mi reflexión", 'note.pickRange': "¿Sobre qué versículos reflexionas?", 'j.byBible': "En orden bíblico", 'nick.title': "Nombres de miembros", 'nick.hint': "Solo cambia en tu pantalla. Los demás ven el nombre original.", 'nick.edit': "Cambiar nombre", 'nick.orig': "Nombre original {name}", 'nick.ph': "p. ej. Mamá, Papá", 'nick.save': "Guardar", 'nick.reset': "Usar nombre original", 'nick.row': "Cambiar nombres", 'bb.title': "Daily Bible · La Palabra, cada día", 'bb.read': "Leer", 'bb.notes': "Notas del sermón", 'bb.me': "Yo", 'bb.newNote': "Nota del sermón", 'bb.continue': "Seguir leyendo", 'bb.where': "Donde lo dejaste", 'bb.start': "Empieza con Génesis 1", 'bb.pick': "Elegir un pasaje", 'bb.today': "Pasaje de hoy", 'bb.readToday': "Leer el pasaje de hoy", 'bb.plan': "Reto de lectura bíblica", 'sn.title': "Notas del sermón", 'sn.sub': "Escribe el sermón con su pasaje.", 'sn.new': "Nueva nota", 'sn.empty': "Aún no hay notas.", 'sn.free': "Notas gratis {n}/{t}", 'sn.plan': "Plan {plan} · este mes {n}/{t}", 'sn.monthly': "mensual", 'sn.yearly': "anual", 'sn.rec': "Grabar", 'sn.file': "Archivo", 'sn.text': "Texto", 'sn.titleF': "Título (opcional)", 'sn.preacher': "Predicador (opcional)", 'sn.recStart': "Empezar a grabar", 'sn.recStop': "Terminar", 'sn.recOn': "Grabando {t}", 'sn.recDone': "Grabado · {t}", 'sn.pickFile': "Elegir una grabación", 'sn.paste': "Pega aquí la transcripción del sermón", 'sn.make': "Guardar", 'sn.need': "Añade una grabación, un archivo o un texto.", 'sn.short': "El texto es demasiado corto.", 'sn.queued': "Esperando el resumen", 'sn.working': "Preparando tus notas…", 'sn.failed': "No se pudo resumir", 'sn.offline': "Se resumirá cuando tengas conexión", 'sn.example': "Ejemplo", 'sn.main': "Mensaje principal", 'sn.points': "Puntos", 'sn.apply': "Aplicación", 'sn.prayer': "Oración", 'sn.questions': "Para conversar", 'sn.passages': "Pasajes", 'sn.transcript': "Transcripción completa", 'sn.share': "Compartir", 'sn.delete': "Eliminar", 'sn.deleteQ': "¿Eliminar esta nota? No se puede deshacer.", 'sn.deleted': "Nota eliminada.", 'sn.back': "Notas del sermón", 'pw.title': "Tu espacio está lleno", 'pw.body': "Borra algunas grabaciones para seguir, o consigue más espacio y olvídate del tema.", 'pw.clean': "Ordenar mis grabaciones", 'pw.monthly': "Mensual", 'pw.yearly': "Anual", 'pw.mPrice': "US$3,99 / mes", 'pw.yPrice': "US$29,99 / año", 'pw.ySave': "US$2,50/mes · 2 meses gratis", 'pw.what': "100 GB de espacio · hasta 60 resúmenes al mes", 'pw.soon': "Las suscripciones se abren cuando la app esté en las tiendas.", 'pw.done': "Ya tienes más espacio. Graba sin preocuparte.", 'me.title': "Yo", 'me.days': "{n} días seguidos leyendo", 'me.saved': "Versículos guardados", 'me.medi': "Reflexiones", 'me.planRow': "Suscripción", 'me.free': "Gratis ({t} notas)", 'me.thanks': "Abrir daily thanks", 'me.none': "Aún nada", 'rs.today': "{n} hoy", 'rs.min': "{n} min", 'rs.avg': "{n} al día en promedio", 'rs.eta': "A este ritmo terminarás en {d}", 'rs.week': "{n} esta semana", 'rs.time': "{n} min esta semana", 'sn.yt': "YouTube", 'sn.ytPh': "Enlace de YouTube", 'sn.ytBad': "Revisa el enlace de YouTube.", 'sn.ytNo': "Los enlaces de YouTube funcionan cuando el servidor esté configurado.", 'sn.saving': "Subiendo… {n}", 'sn.toMed': "Guardar como reflexión", 'sn.recNote': "Mantén la pantalla encendida. La grabación se sube en partes de 30 segundos.", 'sn.write': "Escribir", 'sn.ref': "Elegir pasaje", 'sn.mainF': "Mensaje principal (una línea)", 'sn.bodyF': "Notas del sermón", 'sn.manual': "Escrita por ti", 'sn.toGroup': "Compartir con un grupo", 'sn.shared': "Compartido con tu grupo.", 'sn.pickGroup': "¿Con qué grupo?", 'sn.body': "Notas", 'db.title': "Mi lectura", 'db.days': "Días leídos esta semana", 'db.time': "Tiempo este mes", 'db.chs': "Capítulos este mes", 'db.avg': "Promedio diario", 'db.daysV': "{n}/7", 'db.min': "{n} min", 'db.hm': "{h} h {m} min", 'db.chV': "{n}", 'db.c30': "Últimos 30 días · capítulos por día", 'db.wd': "Por día · capítulos en promedio", 'db.streak': "{n} días seguidos · récord {m}", 'db.notes': "Notas {s} · Reflexiones {m}", 'db.tap': "Toca una barra para ver ese día", 'db.day': "{d} · {n} cap · {m} min", 'pp.title': "Personas frecuentes", 'pp.add': "+ Guardar persona", 'pp.name': "Nombre (p. ej. Mamá)", 'pp.phone': "Teléfono", 'pp.save': "Guardar", 'pp.hint': "Toca para abrir un mensaje listo para enviar.", 'pp.del': "Quitar", 'med.felt': "Lo que sentí", 'med.prayer': "Oración", 'med.prayerPh': "Una oración desde este pasaje, o un pedido de oración", 'med.asReq': "Compartir también como pedido de oración", 'med.rec': "Grabar tu voz", 'med.recStop': "Terminar grabación", 'med.recDel': "Borrar grabación", 'med.recNote': "Las grabaciones quedan cifradas en este dispositivo.", 'med.recFail': "No se puede usar el micrófono. Permítelo en Ajustes.", 'med.voice': "Nota de voz",
    'sn.aiOn': "Crear también un resumen automático", 'sn.aiBtn': "Crear resumen", 'sn.aiBusy': "Resumiendo…", 'sn.aiLater': "Podrás resumir cuando estés conectado.", 'sn.aiTag': "Resumen automático", 'sn.aiShort': "Escribe un poco más para resumir.",
    'rec.start': "Grabar el sermón", 'rec.hintApp': "Sigue grabando con la pantalla apagada. Si entra una llamada y no contestas, la grabación continúa; si contestas, se pausa y sigue sola al colgar.", 'rec.hintWeb': "En la web, deja la pantalla encendida. En la app del teléfono sigue grabando con la pantalla apagada, incluso si entra una llamada.", 'rec.on': "Grabando", 'rec.paused': "En pausa", 'rec.call': "En llamada · sigue al colgar", 'rec.pause': "Pausar", 'rec.resume': "Seguir", 'rec.stop': "Terminar", 'rec.del': "Borrar grabación", 'rec.done': "Grabación {t}", 'rec.after': "Al guardar, el sermón se transcribe y se resume en una página. Tus notas también se quedan.", 'rec.fgTitle': "Grabando el sermón", 'rec.fgText': "Sigue grabando con la pantalla apagada.", 'rec.nTitle': "Grabación en pausa", 'rec.nText': "Si la llamada terminó, abre la app para seguir grabando.", 'rec.busy': "Transcribiendo y resumiendo el sermón…", 'rec.pending': "Se transcribirá y resumirá cuando tengas conexión.", 'rec.retry': "Subir de nuevo", 'rec.upFail': "No se pudo subir. Inténtalo más tarde.", 'rec.listen': "Grabación", 'rec.bar': "Grabando {t} · Abrir", 'rec.delQ': "¿Borrar esta grabación?", 'rec.typing': "Puedes tomar notas mientras grabas",
    'rec.kRec': "Grabar", 'rec.kLive': "En vivo", 'rec.kFile': "Archivo", 'rec.ctxPh': "Si escribes el tema o los nombres que se mencionarán (personajes bíblicos, eventos, personas), la transcripción será mucho más precisa. (Opcional)", 'rec.btn': "Grabar · resumen automático", 'rec.pick': "Elegir un archivo de audio", 'rec.liveHint': "Muestra las palabras mientras se dicen. Al guardar, la grabación se transcribe otra vez con más precisión.", 'rec.fileHint': "Elige un archivo del video de tu iglesia o de una app de grabación (m4a, mp3, wav, mp4).", 'rec.liveWait': "Escuchando…", 'rec.file': "Archivo {t}",
    'sn.refReq': "Elige el pasaje", 'sn.church': "Iglesia", 'sn.pastor': "Pastor", 'sn.placeNew': "＋ Escribir otro", 'sn.date': "Fecha", 'rec.needRef': "Primero elige el pasaje. La transcripción y el resumen siguen esos versículos, así salen más precisos.", 'nt.sum': "Resumen", 'nt.tr': "Transcripción", 'nt.pass': "Pasaje", 'nt.noTr': "Aún no hay transcripción. Graba o usa un archivo de audio y aquí aparecerá el texto completo.", 'vc.title': "Versículos del sermón junto al texto bíblico", 'vc.none': "Aún no se encontraron versículos en el sermón.", 'vc.match': "Igual al texto", 'vc.para': "Parafraseado", 'vc.unsure': "¿Qué versículo es?", 'vc.ok': "Confirmado", 'vc.said': "Sermón", 'vc.orig': "Biblia", 'vc.yes': "Es correcto", 'vc.fix': "Es otro versículo", 'vc.fixQ': "Escribe el versículo correcto (p. ej. Juan 3:16)", 'vc.bad': "No se encontró ese versículo", 'vc.banner': "Revisa los números de versículo ({n})", 'vc.noOrig': "No se pudo cargar el texto",
    'pl.title': "Planes de lectura juntos", 'pl.new': "Crear un plan de lectura", 'pl.sub': "Desde dónde hasta dónde y en cuántos días: lo dividimos en una porción diaria. Invita a amigos o familia a leer el mismo pasaje el mismo día.", 'pl.invite': "Invitar", 'pl.invTitle': "Invitar a leer juntos", 'pl.invDesc': "Quien tenga este enlace se une a ‘{name}’ en las mismas fechas.", 'pl.msg': "{by} Leamos la Biblia juntos · {name}\n{range} · {days} días\n", 'pl.joinTitle': "Invitación a leer", 'pl.joinBy': "{by} te invitó a leer juntos", 'pl.join': "Leer juntos", 'pl.joined': "Te uniste al plan", 'pl.already': "Ya estás en este plan", 'pl.today': "Hoy", 'pl.someone': "Un amigo",
    'bs.off': "Apagado", 'bs.size': "Tamaño del texto bíblico", 'bs.remind': "Recordatorio de lectura", 'bs.places': "Iglesia y pastor", 'bs.placesNone': "Aquí se guardan la iglesia y el pastor que escribes en una nota de sermón.", 'bs.placesHint': "Al empezar una nota, se llena primero la que más usas ese día y a esa hora.", 'bs.usually': "Normalmente {when}", 'bs.sub': "Almacenamiento", 'bs.thanks': "Abrir daily thanks", 'bs.sermon': "Notas de sermón", 'bs.reading': "Lectura", 'bs.data': "Mis registros", 'bs.deleted': "Eliminado",
    'rec.slang': "Idioma del sermón", 'rec.slangSet': "Idioma del sermón: {l}",
    'pv.open': "Leer el pasaje en pantalla completa",
    'stk.n': "Racha de {n} días", 'stk.sub': "Lectura diaria", 'stk.todayDone': "Leíste hoy", 'stk.todayNot': "Lee un capítulo hoy para seguir", 'stk.start': "Lee un capítulo hoy para empezar una racha", 'stk.best': "Mejor: {n} días",
    'bs.almost': "Casi lleno",
    'fc.prKick': "Peticiones de {g}", 'fc.prTitle': "{n} pidieron oración", 'fc.pray': "Ir a orar", 'fc.readTitle': "Lectura de hoy", 'fc.read': "Empezar a leer", 'fc.dayN': "Día {n}", 'fc.write': "Escribir hoy", 'fc.group': "tu grupo",
    'ss.ph': "Buscar notas de sermón", 'ss.none': "No se encontró “{q}”", 'ss.count': "{n} encontradas", 'ss.clear': "Borrar", 'ss.inTr': "Transcripción",
    'fp.kick': "Petición de {g} · {i}/{n}", 'fv.kick': "Lectura de hoy · {r}", 'fv.count': "{i} / {n}", 'fv.doneTitle': "Esa es la lectura de hoy", 'fv.done': "Ya lo leí", 'fv.doneSub': "{name} · día {d}", 'fv.marked': "Lectura de hoy completa",
    'vw.row': "Qué ves", 'vw.rowSub': "Qué aparece primero al abrir la app y qué hay en el feed", 'vw.first': "Al abrir la app, primero", 'vw.fPr': "Peticiones de oración del grupo", 'vw.fVerse': "Lectura de hoy (planes)", 'vw.fCh': "Reto de hoy", 'vw.howMany': "Cuántas peticiones", 'vw.all': "Todas", 'vw.pause': "Tomar un descanso", 'vw.on': "Activado", 'vw.h24': "24 horas", 'vw.w1': "Una semana", 'vw.off': "Apagado", 'vw.until': "Vuelve el {d}", 'vw.feed': "En el feed", 'vw.thanks': "Gratitud", 'vw.prayer': "Peticiones", 'vw.med': "Reflexiones", 'vw.strangers': "Mostrar también a personas que no conozco", 'vw.strangersSub': "Si está apagado, solo ves lo tuyo y a quienes estás conectado por grupos e invitaciones", 'fo.off': "Apagar esto", 'fo.h24': "Apagar 24 horas", 'fo.offDone': "Apagado. Puedes activarlo en Ajustes › Qué ves.", 'fo.snoozed': "Descanso de 24 horas", 'why.title': "¿Qué es esto?", 'why.pr': "Hay nuevas peticiones en ‘{g}’, por eso aparecen primero al abrir la app. Una vez vista, no vuelve a aparecer primero.", 'why.plan': "Es la porción de hoy de tu plan ‘{name}’, por eso aparece primero. (Día {d} de {t})", 'why.settings': "Qué ves", 'emp.title': "Aún no hay con quién compartir", 'emp.sub': "Crea un grupo o invita a otros con un enlace. Aquí solo aparece lo tuyo y de quienes estás conectado.", 'emp.group': "Crear un grupo", 'emp.strangers': "Ver gratitud de desconocidos",
    'cu.kick': "Te atrasaste", 'cu.title': "{n} días de atraso. No pasa nada.", 'cu.sub': "¿Repartimos lo que falta en los {d} días que quedan, unos {per} capítulos al día? La fecha final no cambia.", 'cu.yes': "Repartir", 'cu.no': "Dejarlo así", 'cu.done': "Repartido en los días que quedan. Hoy: {r}", 'cu.short': "{n} días de atraso · repartir",
    'smd.title': "Reflexión de {n}", 'smd.someone': "Una reflexión", 'smd.read': "Leer este pasaje", 'smd.write': "Escribir la mía", 'smd.bad': "No se pudo abrir el enlace",
    'ft.leader': "Herramientas para líderes", 'ft.leaderSub': "Reuniones (grabadas y resumidas), asistencia, informes por miembro, paneles de grupo e iglesia, enlace para tu pastor", 'ld.tools': "Herramientas de líder", 'ld.meet': "Empezar reunión", 'ld.reports': "Informes de miembros", 'ld.past': "Reuniones anteriores", 'ld.live': "Reunión ahora · {r}", 'ld.join': "Leer juntos", 'mt.title': "Reunión · {d}", 'mt.pass': "Pasaje de hoy (todos lo leen juntos)", 'mt.share': "Abrir el pasaje para todos", 'mt.shared': "El pasaje se abre en la pantalla de todos", 'mt.attend': "Asistencia", 'mt.me': "Yo (líder)", 'mt.notes': "Notas", 'mt.save': "Guardar reunión", 'mt.view': "Reunión · {d}", 'mt.att': "Asistieron {n}/{t}", 'mt.absent': "Ausentes: {names}", 'mt.byMember': "Por miembro", 'mt.shareL': "Compartió", 'mt.prayL': "Petición", 'mt.prayer': "Oremos por", 'mt.next': "Para la próxima", 'mt.busy': "Transcribiendo la reunión y ordenándola por miembro…", 'mt.pending': "Se transcribirá y ordenará por miembro cuando tengas conexión.", 'mt.none': "Aún no hay reuniones.", 'mt.saved': "Reunión guardada", 'rp.title': "Informe de {name}", 'rp.attend': "Asistencia", 'rp.shared': "Lo que compartió", 'rp.prayers': "Peticiones", 'rp.notes': "Notas del líder", 'rp.add': "Añadir nota", 'rp.ph': "Algo para recordar por esta persona (solo tú y tu pastor lo ven)", 'rp.pick': "¿De quién es el informe?", 'rp.none': "Nada aún", 'cat.set': "Categoría", 'cat.ph': "p. ej. Zona 1, Jóvenes", 'cat.none': "Sin categoría", 'cat.rename': "Cambiar nombre", 'cat.namePh': "Nombre del grupo", 'ps.link': "Enlace para tu pastor", 'ps.desc': "Un enlace con cómo van las cosas (asistencia, lo compartido esta semana, resúmenes de reuniones, notas). Se abre como panel en la app. Cualquiera con el enlace puede verlo: envíalo solo a tu pastor.", 'ps.title': "Panel de {c}", 'ps.asof': "Al {d}", 'ps.att4': "Asistencia reciente", 'ps.lastMeet': "Última reunión", 'ps.reports': "Notas del líder", 'ps.members': "{n} personas", 'dash.att': "Asistencia {p}%", 'dash.meet': "{n} reuniones este mes",
    'us.title': "Uso", 'us.day': "Resúmenes hoy", 'us.week': "Resúmenes esta semana", 'us.space': "Almacenamiento", 'us.reset': "Se recarga en {t}", 'us.full': "Agotado", 'us.more': "Más espacio", 'us.h': "{n} h", 'us.m': "{n} min", 'us.d': "{n} días", 'us.dayHit': "Ya usaste los resúmenes de hoy. Seguirá en {t}. Tu grabación está guardada.", 'us.weekHit': "Ya usaste los resúmenes de esta semana. Seguirá en {t}. Tu grabación está guardada.",
    'us.used': "{p}% usado", 'us.at': "Se recarga a las {t}", 'us.atTom': "Se recarga mañana {t}", 'us.atDay': "Se recarga el {d} {t}", 'us.reset2': "{w}", 'us.secSum': "Resúmenes", 'us.secWeek': "Límite semanal", 'us.secSpace': "Almacenamiento", 'us.secExtra': "Uso extra", 'us.noExtra': "Nada por ahora", 'us.noExtraSub': "Cuando recibas uso extra, aparecerá aquí con su fecha de vencimiento.", 'us.refresh': "Actualizar",
    'us.spaceCard': "Grabaciones y notas",
    'cel.today': "Hecho por hoy", 'cel.dayOf': "{name} · {d}/{t} días", 'cel.book': "Terminaste {book}", 'cel.bible': "Leíste toda la Biblia", 'cel.share': "Compartir", 'size.xl': "Muy grande", 'size.btn': "Tamaño del texto", 'stk.write': "Racha de {n} días", 'stk.new': "{n} nuevas", 'np.noon': "Mediodía", 'np.noonSub': "A mitad del día", 'np.planTitle': "¿Cuándo te recordamos<br>la lectura de hoy?", 'np.chTitle': "¿Cuándo te recordamos<br>los días del reto?", 'np.multi': "Puedes elegir más de uno", 'yr.btn': "Compartir mi año en la Palabra", 'yr.title': "Mi {y} en la Palabra", 'yr.chapters': "{n} capítulos", 'yr.read': "leídos", 'yr.days': "{n} días", 'yr.daysL': "en la Palabra", 'yr.best': "Racha más larga: {n} días", 'yr.books': "{n} libros terminados", 'yr.pct': "{p}% de la Biblia", 'yr.feed': "Feed 4:5", 'yr.story': "Historia 9:16", 'yr.reel': "Crear video", 'yr.post': "Publicar en Instagram", 'yr.save': "Guardar", 'yr.making': "Creando el video… {p}%", 'sm.full': "Un versículo a la vez",
    'np.cr1': "Solo a las horas que elijas.", 'np.pr2': "Sin recordatorio si ya leíste lo de hoy.", 'np.cr2': "Sin recordatorio si ya hiciste lo de hoy.",
    'bf.devo': "Pasaje de hoy", 'bf.endTitle': "Hoy estuviste en la Palabra", 'bf.endSub': "Sigue leyendo o escribe una nota de sermón.", 'bf.cont': "Seguir leyendo", 'bf.home': "Inicio", 'bf.note': "Nota de sermón",
    'bn.feed': "Feed", 'bn.group': "Comunidad", 'bn.plus': "Escribir", 'bp.title2': "¿Qué quieres escribir?", 'bp.sermon': "Nota de sermón", 'bp.med': "Reflexión", 'bp.thanks': "Gratitud", 'bp.prayer': "Petición", 'bp.plan': "Plan de lectura",
    'kk.thanks': "Gratitud", 'sn.addRef': "+ Añadir pasaje", 'sn.rmRef': "Quitar pasaje", 'rt.done': "Biblia leída {n}×", 'rt.round': "Vuelta {k}", 'rt.since': "desde {d}", 'rt.title': "Historial de lectura", 'rt.now': "Leyendo ahora", 'rt.nowLine': "Vuelta {k} · desde {d} · {n}/{t} capítulos", 'rt.notYet': "Aún no empieza", 'rt.past': "Terminadas", 'rt.item': "Vuelta {k}", 'rt.days': "{n} días", 'rt.none': "Cuando termines toda la Biblia, quedará aquí.", 'rt.recent': "Leído recientemente", 'rt.empty': "Cada capítulo que leas aparecerá aquí por día.", 'rt.cel': "Leíste toda la Biblia — {n}×", 'rt.chs': "{n} cap.", 'upd.title': "Hay una nueva versión", 'upd.body': "Actualiza daily thanks para seguir usándola sin problemas.", 'upd.go': "Actualizar", 
    'login.terms': "Al continuar, aceptas los <a href=\"{base}/terms\" target=\"_blank\" rel=\"noopener\">Términos de uso</a> y la <a href=\"{base}/privacy\" target=\"_blank\" rel=\"noopener\">Política de privacidad</a>. No se tolera contenido ofensivo o abusivo.",
    'login.demo': 'En este prototipo nada se conecta a una cuenta real; solo se guarda en este dispositivo que iniciaste sesión.',
    'login.done': 'Iniciaste sesión. La próxima vez se abre directo.',
    'phone.title': 'Inicia sesión con tu teléfono',
    'phone.number': 'Número de teléfono',
    'phone.send': 'Enviar código',
    'phone.code': 'Código de 6 dígitos',
    'phone.verify': 'Verificar',
    'phone.sent': 'Código enviado.',
    'phone.demo': 'En este prototipo no se envía ningún mensaje. Escribe cualquier número de 6 dígitos.',
    'phone.bad': 'Revisa el número.',
    'phone.badCode': 'Escribe el código de 6 dígitos.',
    'acct.signedIn': 'Sesión iniciada',
    'acct.logout': 'Cerrar sesión',
    'acct.loggedOut': 'Cerraste sesión.',
    'fs.ios': 'En iPhone, ábrela desde el botón Compartir de Safari → “Agregar a inicio” para verla a pantalla completa como una app.',
    'fs.blocked': 'Aquí no está disponible la pantalla completa.',
    's.fine': 'Tus notas se guardan solo en este navegador y no se sincronizan con otros navegadores o dispositivos.',
    's.confirmReset': '¿Borrar tus notas y ajustes y empezar de nuevo? No se puede deshacer.',
    'toast.reset': 'Demo reiniciada.',
    'toast.noStore': 'Este navegador no puede guardar datos ahora.'
  }
};

/* ---------------- icons (line style) ---------------- */
const ICONS = {
  play: '<path d="M7 4v16l13-8z"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  lines: '<path d="M4 6h16M4 10h16M4 14h10M4 18h13"/>',
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
  microsoft: '<path fill="#F25022" stroke="none" d="M3 3h8.5v8.5H3z"/><path fill="#7FBA00" stroke="none" d="M12.5 3H21v8.5h-8.5z"/><path fill="#00A4EF" stroke="none" d="M3 12.5h8.5V21H3z"/><path fill="#FFB900" stroke="none" d="M12.5 12.5H21V21h-8.5z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>',
  phoneMsg: '<rect x="5" y="2" width="14" height="20" rx="2.5"/><path d="M11 18h2"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
  chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.3 9.3 0 0 1-3.6-.7L3 21l1.6-4.3A8 8 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
  camera: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
  pray: '<path d="M11 21H7l-1.6-3.2a3 3 0 0 1-.3-1.3V10a1.5 1.5 0 0 1 3 0v4"/><path d="M11 21V6.5a1.5 1.5 0 0 0-3 0"/><path d="M13 21h4l1.6-3.2a3 3 0 0 0 .3-1.3V10a1.5 1.5 0 0 0-3 0v4"/><path d="M13 21V6.5a1.5 1.5 0 0 1 3 0"/>',
  mic: '<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  candle: '<path d="M12 2.5c1.4 1.8 1.9 3 1.9 3.9a1.9 1.9 0 0 1-3.8 0c0-.9.5-2.1 1.9-3.9z"/><rect x="9" y="10" width="6" height="11" rx="1"/><path d="M7 21h10"/>',
  lantern: '<path d="M9.5 3h5M12 3V1.5"/><path d="M8 6h8l1.2 3v8L16 20H8l-1.2-3V9z"/><path d="M12 10.5c1 1.1 1.4 1.9 1.4 2.6a1.4 1.4 0 0 1-2.8 0c0-.7.4-1.5 1.4-2.6z"/>',
  star: '<path d="m12 2.5 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.3l-5.8 3.1 1.1-6.5L2.6 9.3l6.5-.9z"/>',
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
const daysAgo = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toLocaleDateString('en-CA'); };
const seed = {
  posts: [
    { id: 'pub1', name: { ko: '다은', en: 'Emma', es: 'Lucía' }, scope: 'public', kind: 'ahead', date: daysAgo(0), likes: 8, shares: 4, saves: 9,
      text: { ko: '이번 한 주도 직장에서 기쁨으로 하루하루를 보내게 하심에 감사합니다.', en: 'Thank you for a week of joyful days at work.', es: 'Gracias por una semana de días alegres en el trabajo.' } },
    { id: 'pub7', name: { ko: '민준', en: 'Noah', es: 'Mateo' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 31, shares: 2, saves: 6, extShares: 1,
      text: { ko: '따뜻한 밥 한 끼. 그거면 충분한 날이었어요.', en: 'A warm meal. That was enough for today.', es: 'Una comida caliente. Eso fue suficiente hoy.' } },
    { id: 'pub8', name: { ko: '영숙', en: 'Margaret', es: 'Carmen' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 57, shares: 14, saves: 22, extShares: 5,
      text: { ko: '오늘 손주가 처음으로 "할머니 사랑해요"라고 또박또박 말해 줬어요. 평생 들은 말 중에 제일 예쁜 말이었어요. 이렇게 오래 살게 하셔서 이 말을 듣게 하시니 감사합니다.', en: 'Today my grandson said “Grandma, I love you” clearly for the first time. It was the most beautiful thing I’ve heard in my life. Thank you for letting me live long enough to hear it.', es: 'Hoy mi nieto me dijo por primera vez, clarito, “Abuela, te quiero”. Fue lo más bonito que he escuchado en mi vida. Gracias por dejarme vivir tanto como para oírlo.' } },
    { id: 'pub9', name: { ko: '지훈', en: 'Ethan', es: 'Diego' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 19, shares: 1, saves: 3,
      text: { ko: '버스를 놓칠 뻔했는데 기사님이 기다려 주셨다. 감사합니다, 기사님.', en: 'I nearly missed the bus, but the driver waited for me. Thank you, sir.', es: 'Casi pierdo el autobús, pero el conductor me esperó. Gracias, señor.' } },
    { id: 'pub2', name: { ko: '서연', en: 'Olivia', es: 'Sofía' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 24, shares: 11, saves: 15, extShares: 6,
      text: { ko: '잠깐 멈춰 보니, 집으로 돌아가는 길에도 예쁜 하늘이 있었어요. 평범한 하루를 아름답게 하심에 감사합니다.', en: 'I paused on my way home and found a lovely sky. Thank you for a beautiful ordinary day.', es: 'Me detuve camino a casa y encontré un cielo precioso. Gracias por un día común tan bonito.' } },
    { id: 'pub10', name: { ko: '수아', en: 'Lily', es: 'Valentina' }, scope: 'public', kind: 'ahead', date: daysAgo(0), likes: 26, shares: 3, saves: 11, extShares: 1,
      text: { ko: '하나님, 내일 면접에서 떨지 않고 제 모습 그대로 보여 드리게 하실 줄 믿고 미리 감사드립니다.', en: 'God, I thank you ahead of time for helping me stay calm and simply be myself at tomorrow’s interview.', es: 'Dios, te doy gracias de antemano porque mañana en la entrevista estaré en calma y seré yo mismo.' } },
    { id: 'pub11', name: { ko: '현우', en: 'James', es: 'Andrés' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 88, shares: 21, saves: 34, extShares: 9,
      text: { ko: '항암 치료 여섯 번째 날. 몸은 힘들지만 매일 문자 보내 주는 친구들, 묵묵히 곁에 있어 주는 아내 덕분에 오늘도 버텼습니다. 아픈 중에도 감사할 게 이렇게 많네요.', en: 'Day six of chemo. My body is tired, but friends who text every day and my wife who quietly stays by me got me through today. Even in pain, there is so much to be thankful for.', es: 'Sexto día de quimioterapia. Mi cuerpo está cansado, pero los amigos que me escriben cada día y mi esposa, que está a mi lado en silencio, me sostuvieron hoy. Aun en el dolor, hay tanto que agradecer.' } },
    { id: 'pub12', name: { ko: '예준', en: 'Lucas', es: 'Tomás' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 15, shares: 1, saves: 2,
      text: { ko: '시험 끝! 끝까지 같이 공부해 준 친구들 고마워.', en: 'Exams done! Thanks to my friends who studied with me to the end.', es: '¡Terminaron los exámenes! Gracias, amigos, por estudiar conmigo hasta el final.' } },
    { id: 'pub4', name: { ko: '하은', en: 'Grace', es: 'Isabel' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 12, shares: 3, saves: 5,
      text: { ko: '오늘 마음이 무거웠는데 친구가 먼저 안부를 물어봐 주었어요. 함께할 사람이 있어 감사합니다.', en: 'My heart was heavy, but a friend checked in first. Thank you for people by my side.', es: 'Tenía el corazón pesado, pero un amigo me escribió primero. Gracias por las personas que están a mi lado.' } },
    { id: 'pub13', name: { ko: '은지', en: 'Hannah', es: 'Camila' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 42, shares: 6, saves: 18, extShares: 2,
      text: { ko: '새벽 세 시에 깬 아기를 안고 창밖을 보다가, 이 작은 숨소리가 얼마나 큰 선물인지 다시 느꼈어요.', en: 'Holding my baby awake at 3 a.m. and looking out the window, I felt again what a great gift this tiny breathing is.', es: 'Con mi bebé despierto a las tres de la mañana, mirando por la ventana, volví a sentir el gran regalo que es esa respiración tan pequeña.' } },
    { id: 'pub14', name: { ko: '상철', en: 'Robert', es: 'Javier' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 37, shares: 5, saves: 9, extShares: 1,
      text: { ko: '삼십 년 다닌 회사에서 마지막 출근을 했습니다. 함께 일한 동료들, 버틸 힘을 주신 하나님께 감사합니다.', en: 'My last day at the company I worked at for thirty years. Thank you to my colleagues, and to God who gave me the strength to keep going.', es: 'Mi último día en la empresa donde trabajé treinta años. Gracias a mis compañeros, y a Dios, que me dio fuerzas para seguir.' } },
    { id: 'pub15', name: { ko: '소연', en: 'Chloe', es: 'Elena' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 22, shares: 2, saves: 7,
      text: { ko: '비 온 뒤 흙냄새.', en: 'The smell of earth after the rain.', es: 'El olor de la tierra después de la lluvia.' } },
    { id: 'pub3', name: { ko: '지우', en: 'Mia', es: 'Daniela' }, scope: 'public', kind: 'ahead', date: daysAgo(2), likes: 17, shares: 6, saves: 8,
      text: { ko: '하나님, 이번 주 만나는 사람들을 사랑과 인내로 대하게 하심에 감사합니다.', en: 'God, thank you for love and patience with everyone I meet this week.', es: 'Dios, gracias por el amor y la paciencia con cada persona que encuentre esta semana.' } },
    { id: 'pub16', name: { ko: '태호', en: 'Daniel', es: 'Pablo' }, scope: 'public', kind: 'today', date: daysAgo(2), likes: 49, shares: 9, saves: 16, extShares: 3,
      text: { ko: '아버지와 오랜만에 둘이서 낚시를 갔어요. 고기는 한 마리도 못 잡았지만, 아버지가 젊은 시절 이야기를 처음 들려주셨어요. 그 시간이 잡은 고기보다 훨씬 귀했어요.', en: 'I went fishing alone with my dad for the first time in years. We didn’t catch a single fish, but he told me stories from his youth for the first time. That time was worth far more than any catch.', es: 'Fui a pescar a solas con mi papá por primera vez en años. No pescamos nada, pero por primera vez me contó historias de su juventud. Ese tiempo valió mucho más que cualquier pesca.' } },
    { id: 'pub5', name: { ko: '준호', en: 'Ryan', es: 'Martín' }, scope: 'public', kind: 'today', date: daysAgo(2), likes: 9, shares: 1, saves: 2,
      text: { ko: '사소하지만 당연하지 않았던 일. 따뜻한 물로 하루를 시작할 수 있었던 아침에 감사합니다.', en: 'Small, but never a given: thankful for a morning that began with warm water.', es: 'Pequeño, pero nunca obvio: gracias por una mañana que empezó con agua caliente.' } },
    { id: 'pub17', name: { ko: '미영', en: 'Susan', es: 'Rosa' }, scope: 'public', kind: 'today', date: daysAgo(2), likes: 33, shares: 4, saves: 10, extShares: 1,
      text: { ko: '가게에 오신 손님이 "덕분에 하루가 따뜻했다"는 쪽지를 남기고 가셨어요. 제가 오히려 감사해요.', en: 'A customer left a note: “You made my day warm.” I’m the one who’s grateful.', es: 'Una clienta dejó una nota: “Gracias a ti mi día fue cálido”. La agradecida soy yo.' } },
    { id: 'pub6', name: { ko: '예린', en: 'Ava', es: 'Paula' }, scope: 'public', kind: 'ahead', date: daysAgo(2), likes: 6, shares: 2, saves: 3,
      text: { ko: '하나님, 평범한 하루 가운데서 작은 은혜를 발견하게 하심에 감사합니다.', en: 'God, thank you for small graces in an ordinary day.', es: 'Dios, gracias por las pequeñas gracias en un día común.' } },
    { id: 'pub18', name: { ko: '도윤', en: 'Owen', es: 'Hugo' }, scope: 'public', kind: 'ahead', date: daysAgo(2), likes: 11, shares: 1, saves: 4,
      text: { ko: '이번 주도 지켜 주실 줄 믿고, 미리 감사합니다.', en: 'Trusting you’ll keep me this week too — thank you in advance.', es: 'Confiando en que me cuidarás esta semana también: gracias de antemano.' } },
    { id: 'gr1', name: { ko: '지은', en: 'Sarah', es: 'María' }, scope: 'group', group: 'g1', kind: 'today', date: daysAgo(0), likes: 8, shares: 1, saves: 2,
      text: { ko: '평범하게 식탁에 앉아 이야기 나눌 수 있었던 저녁이 감사했어요.', en: 'Grateful for a simple evening of talking around the table.', es: 'Agradecida por una cena sencilla conversando alrededor de la mesa.' } },
    { id: 'gr2', name: { ko: '민서', en: 'Rachel', es: 'Laura' }, scope: 'group', group: 'g1', kind: 'ahead', date: daysAgo(1), likes: 5, shares: 0, saves: 1,
      text: { ko: '하나님, 이번 한 주도 서로를 이해하는 마음을 주심에 감사합니다.', en: 'God, thank you for hearts that understand each other this week.', es: 'Dios, gracias por corazones que se entienden esta semana.' } },
    { id: 'pr1', name: { ko: '지은', en: 'Sarah', es: 'María' }, scope: 'group', group: 'g1', kind: 'prayer', date: daysAgo(0), likes: 0, prayedBy: [{ ko: '민서', en: 'Rachel', es: 'Laura' }, { ko: '하은', en: 'Grace', es: 'Isabel' }],
      text: { ko: '이번 주 어머니 수술이 잘 마무리되도록 기도 부탁드려요.', en: 'Please pray that my mom’s surgery this week goes well.', es: 'Por favor, oren para que la cirugía de mi mamá salga bien esta semana.' } },
    { id: 'pr2', name: { ko: '민서', en: 'Rachel', es: 'Laura' }, scope: 'group', group: 'g1', kind: 'prayer', date: daysAgo(1), likes: 0, prayedBy: [{ ko: '지은', en: 'Sarah', es: 'María' }],
      text: { ko: '새 직장에서 좋은 동료들을 만나게 해 주세요.', en: 'Pray that I find good coworkers at my new job.', es: 'Oren para que encuentre buenos compañeros en mi nuevo trabajo.' } },
    { id: 'gm1', name: {"ko": "하은", "en": "Grace", "es": "Isabel"}, scope: 'group', group: 'g1', kind: 'meditation', date: daysAgo(0), likes: 6, shares: 0, saves: 0, ref: { b: 50, c: 4, v: 6, v2: 7 },
      text: {"ko": "\"아무 것도 염려하지 말고\"라는 말씀에서 멈췄어요. 걱정을 내려놓는 게 아니라, 감사함으로 아뢰는 것부터 시작하라는 뜻 같아요.", "en": "I stopped at \"Be careful for nothing.\" It feels like the start is not to drop the worry, but to bring it with thanksgiving.", "es": "Me detuve en \"Por nada estéis afanosos\". Siento que el comienzo no es soltar la preocupación, sino presentarla con gratitud."} },
    { id: 'gm2', name: {"ko": "민서", "en": "Rachel", "es": "Laura"}, scope: 'group', group: 'g1', kind: 'meditation', date: daysAgo(1), likes: 4, shares: 0, saves: 0, ref: { b: 25, c: 3, v: 22, v2: 23 },
      text: {"ko": "\"이것이 아침마다 새로우니\" — 어제 실수한 일이 계속 마음에 남았는데, 오늘 아침은 새롭게 주신 아침이라는 게 위로가 됐어요.", "en": "\"They are new every morning.\" Yesterday’s mistake stayed with me, but it comforted me that this morning was given fresh.", "es": "\"Nuevas son cada mañana.\" El error de ayer seguía conmigo, pero me consoló que esta mañana fuera nueva."} },
    { id: 'gm3', name: {"ko": "준호", "en": "Ryan", "es": "Martín"}, scope: 'group', group: 'g1', kind: 'meditation', date: daysAgo(2), likes: 3, shares: 0, saves: 0, ref: { b: 52, c: 5, v: 16, v2: 18 },
      text: {"ko": "\"범사에 감사하라\"를 오늘은 출근길 지하철에서 연습해 봤어요. 붐비는 지하철에서도 감사할 것이 세 가지나 있었어요.", "en": "I practiced \"In every thing give thanks\" on the subway today. Even on a crowded train I found three things.", "es": "Practiqué \"Dad gracias en todo\" en el metro. Aun lleno, encontré tres cosas."} },
    { id: 'gt1', name: {"ko": "준호", "en": "Ryan", "es": "Martín"}, scope: 'group', group: 'g1', kind: 'today', date: daysAgo(0), likes: 7, shares: 0, saves: 0,
      text: {"ko": "모임 끝나고 다 같이 치운 덕분에 금방 정리됐어요. 이런 사람들과 함께여서 감사해요.", "en": "Everyone cleaned up together after our meeting, so it was done in minutes. Thankful for these people.", "es": "Todos limpiamos juntos después de la reunión y terminamos enseguida. Agradecido por estas personas."} },
    { id: 'ga1', name: {"ko": "하은", "en": "Grace", "es": "Isabel"}, scope: 'group', group: 'g1', kind: 'ahead', date: daysAgo(1), likes: 5, shares: 0, saves: 0,
      text: {"ko": "다음 주 아이 학교 발표가 있어요. 떨리겠지만 끝까지 잘 해낼 줄 믿고 미리 감사해요.", "en": "My child has a school presentation next week. It will be nerve-racking, but I thank you ahead that it will go well.", "es": "Mi hijo tiene una presentación la próxima semana. Estará nervioso, pero doy gracias de antemano porque saldrá bien."} },
    { id: 'gp3', name: {"ko": "준호", "en": "Ryan", "es": "Martín"}, scope: 'group', group: 'g1', kind: 'prayer', date: daysAgo(0), likes: 0, shares: 0, saves: 0, prayedBy: [{ ko: '지은', en: 'Sarah', es: 'María' }],
      text: {"ko": "아버지 건강검진 결과가 이번 주에 나와요. 평안한 마음으로 기다릴 수 있도록 기도해 주세요.", "en": "My dad’s checkup results come this week. Please pray that we wait with peace.", "es": "Esta semana salen los resultados de mi papá. Oren para que esperemos con paz."} },
    { id: 'gf1', name: {"ko": "엄마", "en": "Mom", "es": "Mamá"}, scope: 'group', group: 'g2', kind: 'today', date: daysAgo(0), likes: 3, shares: 0, saves: 0,
      text: {"ko": "오랜만에 다 같이 저녁 먹어서 좋았어. 고마워 우리 가족.", "en": "It was good to have dinner all together again. Thank you, family.", "es": "Qué bueno cenar todos juntos otra vez. Gracias, familia."} },
    { id: 'gf2', name: {"ko": "아빠", "en": "Dad", "es": "Papá"}, scope: 'group', group: 'g2', kind: 'prayer', date: daysAgo(1), likes: 0, shares: 0, saves: 0, prayedBy: [],
      text: {"ko": "다음 달 이사 준비가 순조롭게 되도록 함께 기도하자.", "en": "Let’s pray that getting ready for next month’s move goes smoothly.", "es": "Oremos para que la mudanza del próximo mes salga bien."} },
    { id: 'pp1', name: {"ko": "수진", "en": "Amy", "es": "Ana"}, scope: 'public', kind: 'prayer', date: daysAgo(0), likes: 0, shares: 0, saves: 0, prayedBy: [{"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}],
      text: {"ko": "이번 금요일에 면접이 있어요. 떨지 않고 준비한 만큼 말할 수 있도록 기도해 주세요.", "en": "I have a job interview this Friday. Please pray that I stay calm and say what I prepared.", "es": "Tengo una entrevista este viernes. Oren para que esté tranquila y diga lo que preparé."} },
    { id: 'pp2', name: {"ko": "태민", "en": "Kevin", "es": "Raúl"}, scope: 'public', kind: 'prayer', date: daysAgo(0), likes: 0, shares: 0, saves: 0, prayedBy: [{"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}],
      text: {"ko": "아이가 열이 나서 밤새 잠을 못 잤어요. 빨리 회복되도록 기도 부탁드려요.", "en": "My child had a fever and we didn’t sleep all night. Please pray for a quick recovery.", "es": "Mi hijo tuvo fiebre y no dormimos en toda la noche. Oren por una pronta recuperación."} },
    { id: 'pp3', name: {"ko": "경희", "en": "Linda", "es": "Beatriz"}, scope: 'public', kind: 'prayer', date: daysAgo(1), likes: 0, shares: 0, saves: 0, prayedBy: [{"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}],
      text: {"ko": "멀리 사는 친구가 큰 수술을 앞두고 있어요. 함께 기도해 주시면 감사하겠습니다.", "en": "A friend who lives far away is facing major surgery. I’d be grateful if you prayed with me.", "es": "Una amiga que vive lejos tiene una cirugía importante. Agradecería que oraran conmigo."} },
    { id: 'pp4', name: {"ko": "동현", "en": "Chris", "es": "Óscar"}, scope: 'public', kind: 'prayer', date: daysAgo(2), likes: 0, shares: 0, saves: 0, prayedBy: [{"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}, {"ko": "누군가", "en": "Someone", "es": "Alguien"}],
      text: {"ko": "요즘 마음이 많이 지쳐 있어요. 다시 감사할 힘을 얻을 수 있도록 기도해 주세요.", "en": "My heart has been very tired lately. Please pray that I find the strength to be thankful again.", "es": "Mi corazón ha estado muy cansado. Oren para que encuentre fuerzas para agradecer otra vez."} },
    { id: 'gs1', name: { ko: '지은', en: 'Sarah', es: 'María' }, scope: 'group', group: 'g1', kind: 'share', week: 'w', date: daysAgo(1), likes: 3,
      text: { ko: '바쁜 출근길에도 하늘을 올려다보는 여유를 주셔서 감사했어요.', en: 'I was grateful for a moment to look up at the sky on a busy commute.', es: 'Agradecí un momento para mirar el cielo en un trayecto apurado.' } },
    { id: 'gs2', name: { ko: '하은', en: 'Grace', es: 'Isabel' }, scope: 'group', group: 'g1', kind: 'share', week: 'w', date: daysAgo(0), likes: 2,
      text: { ko: '아이와 함께 저녁 기도를 드릴 수 있었던 순간이요.', en: 'The moment I could pray with my child at dinner.', es: 'El momento en que pude orar con mi hijo en la cena.' } },
    { id: 'mine1', mine: true, scope: 'private', kind: 'today', date: daysAgo(1), likes: 0,
      text: { ko: '오늘도 새롭게 시작할 수 있는 아침을 주셔서 감사합니다.', en: 'Thank you for a morning to begin again today.' } },
    { id: 'mine2', mine: true, scope: 'public', kind: 'today', date: daysAgo(2), likes: 14, shares: 3, saves: 6, extShares: 2,
      text: { ko: '퇴근길에 엄마가 보내 준 사진 한 장에 하루가 따뜻해졌어요. 감사합니다.', en: 'A photo from Mom on my way home warmed my whole day. Thank you.' } },
    { id: 'mine3', mine: true, scope: 'private', kind: 'ahead', date: daysAgo(3), likes: 0,
      text: { ko: '하나님, 이번 주 발표도 평안한 마음으로 하게 하심에 감사합니다.', en: 'God, thank you for giving me a calm heart for this week’s presentation.' } },
    { id: 'mine4', mine: true, scope: 'group', group: 'g1', kind: 'today', date: daysAgo(4), likes: 5, shares: 0, saves: 1,
      text: { ko: '공동체에서 함께 웃을 수 있어서 감사했어요.', en: 'Grateful we could laugh together in small group.' } },
    { id: 'mine5', mine: true, scope: 'private', kind: 'today', date: daysAgo(5), likes: 0,
      text: { ko: '비 오는 날 우산을 씌워 준 동료에게 감사해요.', en: 'Thankful for the coworker who shared an umbrella in the rain.' } },
    { id: 'mine6', mine: true, scope: 'private', kind: 'today', date: daysAgo(6), likes: 0,
      text: { ko: '천천히 걸으며 본 노을이 참 고마웠어요.', en: 'Grateful for the sunset I saw on a slow walk.' } }
  ],
  liked: [], seen: [], saved: [], hidden: [], blocked: [], reports: [], sharesGiven: 0, extSharesGiven: 0, celebrated: [],
  groups: [{ id: 'g1', name: { ko: '은혜 공동체', en: 'Grace Group', es: 'Grupo Gracia' }, size: 7, owner: true }, { id: 'g2', name: { ko: '우리 가족', en: 'Our Family', es: 'Nuestra familia' }, size: 4 }],
  challenges: [{ id: 'ch1', name: { ko: '함께 발견하는 감사', en: 'Finding Thanks Together', es: 'Encontrando gratitud juntos' }, group: 'g1',
    members: [{ ko: '나', en: 'Me', es: 'Yo' }, { ko: '지은', en: 'Sarah', es: 'María' }, { ko: '민서', en: 'Rachel', es: 'Laura' }], start: '2026-11-14', days: [1, 2] }],
  settings: { lang: null, notificationTime: '21:00', notificationEnabled: false, groupUpdates: false, features: { groupShare: false, prayer: true, sermon: false } }, prayed: [], sermons: []
};

const SAMPLES = {
  es: { work: 'Dios, gracias por dejarme vivir cada día de trabajo de esta semana con alegría.', relationship: 'Dios, gracias por el amor y la paciencia con cada persona que encuentre esta semana.', everyday: 'Dios, gracias por las pequeñas gracias en un día común.' },
  ko: { work: '하나님, 이번 한 주도 직장에서 기쁨으로 하루하루를 보내게 하심에 감사합니다.', relationship: '하나님, 이번 주 만나는 사람들을 사랑과 인내로 대하게 하심에 감사합니다.', everyday: '하나님, 평범한 하루 가운데서 작은 은혜를 발견하게 하심에 감사합니다.' },
  en: { work: 'God, thank you for letting me spend each day at work this week with joy.', relationship: 'God, thank you for helping me meet everyone this week with love and patience.', everyday: 'God, thank you for helping me find small graces in an ordinary day.' }
};

/* ---------------- state ---------------- */
const clone = x => JSON.parse(JSON.stringify(x));
let data;
try { const stored = JSON.parse(localStorage.getItem(KEY)); data = stored && Array.isArray(stored.posts) ? stored : clone(seed); }
catch { data = clone(seed); }
if (typeof data.sharesGiven !== 'number') data.sharesGiven = 0;
// new sample posts reach people who installed before they existed (never re-adds ones they deleted or hid)
data.seedSeen = data.seedSeen || data.posts.map(p => p.id);
seed.posts.forEach(sp => { if (!data.seedSeen.includes(sp.id)) { data.seedSeen.push(sp.id); if (!data.posts.some(p => p.id === sp.id)) data.posts.push(clone(sp)); } });
// keep sample authors' names current (localized per language)
data.posts.forEach(p => { const s = seed.posts.find(x => x.id === p.id); if (s && !p.mine) { p.name = clone(s.name); if (s.prayedBy) p.prayedBy = clone(s.prayedBy); } });
(data.challenges || []).forEach(c => { const s = seed.challenges.find(x => x.id === c.id); if (s) c.members = clone(s.members); });
if (!data.settings.features) data.settings.features = { groupShare: false, prayer: false, sermon: false };
if (!Array.isArray(data.prayed)) data.prayed = [];
if (!Array.isArray(data.verseLikes)) data.verseLikes = [];
if (!Array.isArray(data.readDone)) data.readDone = [];
if (data.settings && !Array.isArray(data.settings.prayerSeen)) data.settings.prayerSeen = [];
// the example community used to be called '은혜 소그룹'
try { (data.groups || []).forEach(g => { if (g && g.name && typeof g.name === 'object' && g.name.ko === '은혜 소그룹') g.name.ko = '은혜 공동체'; }); } catch {}
if (data.settings && (typeof data.settings.prefs !== 'object' || !data.settings.prefs)) data.settings.prefs = {};
if (!data.readLog || typeof data.readLog !== 'object') data.readLog = {};
if (!data.rtStart && (data.readDone || []).length) data.rtStart = Object.values(data.readLog).sort()[0] || null;
if (!Array.isArray(data.savedVerses)) data.savedVerses = [];
if (!data.settings.prayerInGroups) { data.settings.features.prayer = true; data.settings.prayerInGroups = true; } // groups share prayer requests by default
if (!Array.isArray(data.seen)) data.seen = [];
if (!Array.isArray(data.sermons)) data.sermons = [];
if (typeof data.extSharesGiven !== 'number') data.extSharesGiven = 0;
for (const k of ['liked', 'saved', 'hidden', 'blocked', 'reports', 'celebrated']) if (!Array.isArray(data[k])) data[k] = [];
const LANGS = [['ko', '한국어'], ['en', 'English'], ['es', 'Español']];
const deviceLang = () => { const l = (navigator.language || 'en').toLowerCase(); return l.startsWith('ko') ? 'ko' : l.startsWith('es') ? 'es' : 'en'; };
if (!data.settings.lang) data.settings.lang = deviceLang();

/* Sign-in session. Saved once, kept until the user signs out ("always signed in").
   In the prototype only the state is stored; see fullstack/README.md for wiring real Apple / Google / SMS auth. */
const SESSION_KEY = 'daily-thanks-session';
// Public pages required by the App Store and Google Play. Host store/legal/*.html at this address before submitting.
let LEGAL_BASE = 'https://dailyjourney.org';       // Squarespace pages: /privacy, /terms, /support, /delete-account
let SUPPORT_EMAIL = 'hi@dailyjourney.org';
const APP_VERSION = '1.0.0';
let session = null;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { session = null; }
if (session?.lang) data.settings.lang = session.lang;
function setSession(next) {
  session = next;
  try { next ? localStorage.setItem(SESSION_KEY, JSON.stringify(next)) : localStorage.removeItem(SESSION_KEY); } catch {}
  document.dispatchEvent(new CustomEvent('dt:session', { detail: next }));
}
const GATE_AFTER = 5; // posts shown before the "write today's thanks" card and the sign-in card

try { if (!sessionStorage.getItem('dt-visit')) { sessionStorage.setItem('dt-visit', '1'); data.settings.opens = (data.settings.opens || 0) + 1; localStorage.setItem(KEY, JSON.stringify(data)); } } catch {}
const state = { tab: BIBLE_MODE ? 'read' : 'feed', feed: 'public', group: data.groups[0]?.id, composeKind: 'today', challenge: null, filter: 'all', immersive: true, justWrote: false, composeScope: 'public' }; // posts default to Everyone; switch to Only me any time // immersive: the app opens on a full-screen feed of people's thanks
// returning visits get "first things first" (group prayer requests, today's verses) on opening
{ const d0 = new Date().toLocaleDateString('en-CA'); state.openedBefore = !!data.settings.firstOpen && data.settings.firstOpen !== d0; if (!data.settings.firstOpen) data.settings.firstOpen = d0; }

const $ = s => document.querySelector(s);
const main = $('#main'), sheet = $('#sheet'), backdrop = $('#backdrop');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const lang = () => data.settings.lang;
const t = k => STR[lang()]?.[k] ?? STR.en[k] ?? STR.ko[k] ?? k;
const L = v => (v && typeof v === 'object') ? (v[lang()] ?? (lang() === 'es' ? v.en : undefined) ?? v.ko ?? v.en) : (v ?? '');
const today = () => new Date().toLocaleDateString('en-CA');

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { toast(t('toast.noStore')); }
  document.dispatchEvent(new CustomEvent('dt:save', { detail: data }));
}

/* ---------------- Supabase (daily bible): e-mail link sign-in · 공동체 ----------------
   Only the Project URL and the publishable (public) key live here — never a secret key. What anyone may read
   is enforced by the database rules (supabase/schema.sql). Group keys stay in the invite link's # part. */
const SUPA = { url: 'https://puhaycwpfpqsmxubvzkt.supabase.co', key: 'sb_publishable_NYYC9G102Ct3YYuY_unhVA_pGGXFGBa' };
const CLOUD = BIBLE_MODE && !!SUPA.url && !!SUPA.key;
const Cloud = (() => {
  const AKEY = 'daily-bible-auth';
  let auth = null;
  try { auth = JSON.parse(localStorage.getItem(AKEY)); } catch { auth = null; }
  const keep = a => { auth = a; try { a ? localStorage.setItem(AKEY, JSON.stringify(a)) : localStorage.removeItem(AKEY); } catch {} };
  const fail = async res => { const j = await res.json().catch(() => ({})); throw Object.assign(new Error(j.msg || j.message || j.error_description || j.error || res.statusText), { status: res.status, code: j.code || j.error_code }); };
  const call = async (path, { method = 'GET', body, token, prefer } = {}) => {
    const headers = { apikey: SUPA.key, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(token ? { Authorization: 'Bearer ' + token } : {}), ...(prefer ? { Prefer: prefer } : {}) };
    const res = await fetch(SUPA.url + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    if (!res.ok) await fail(res);
    return res.status === 204 ? null : res.json().catch(() => null);
  };
  const store = (j, email) => keep({ access: j.access_token, refresh: j.refresh_token, exp: Date.now() + (+j.expires_in || 3600) * 1000, id: j.user?.id || auth?.id, email: j.user?.email || email || auth?.email });
  let refreshing = null;
  async function token() {
    if (!auth) return null;
    if (Date.now() < auth.exp - 60e3) return auth.access;
    refreshing = refreshing || call('/auth/v1/token?grant_type=refresh_token', { method: 'POST', body: { refresh_token: auth.refresh } })
      .then(j => { store(j); return auth.access; })
      .catch(e => { if (e.status === 400 || e.status === 401) signedOut(); return null; })
      .finally(() => { refreshing = null; });
    return refreshing;
  }
  const rest = async (path, opts = {}) => { const tk = await token(); if (!tk) throw Object.assign(new Error('not_signed_in'), { code: 'not_signed_in' }); return call('/rest/v1/' + path, { ...opts, token: tk }); };
  const appUrl = () => location.origin + location.pathname;
  function signedIn() {
    setSession({ ...(session || {}), method: 'email', email: auth.email, since: session?.since || new Date().toISOString(), lang: lang(), termsAcceptedAt: session?.termsAcceptedAt || new Date().toISOString(), termsVersion: '2026-12-01' });
    sync();
  }
  function signedOut() { keep(null); if (session?.method === 'email') setSession(null); }
  return {
    on: () => CLOUD && !!auth,
    email: () => auth?.email || '',
    uid: () => auth?.id || '',
    // 1) send the e-mail (link, and a code if the mail template includes {{ .Token }})
    sendLink: (email, name) => call('/auth/v1/otp?redirect_to=' + encodeURIComponent(appUrl()), { method: 'POST', body: { email, create_user: true, data: name ? { name } : {} } }),
    // 2a) typed the code from the e-mail
    verify: async (email, code) => { const j = await call('/auth/v1/verify', { method: 'POST', body: { type: 'email', email, token: code } }); store(j, email); signedIn(); },
    // 2b) came back from the link: #access_token=…&refresh_token=…
    fromRedirect() {
      const h = location.hash.slice(1); if (!/(^|&)(access_token|error_description)=/.test(h)) return false;
      const q = new URLSearchParams(h);
      try { history.replaceState(null, '', location.pathname + location.search); } catch { location.hash = ''; }
      if (q.get('error_description')) { setTimeout(() => toast(t('cl.linkBad')), 300); return true; }
      store({ access_token: q.get('access_token'), refresh_token: q.get('refresh_token'), expires_in: q.get('expires_in') });
      call('/auth/v1/user', { token: auth.access }).then(u => { keep({ ...auth, id: u.id, email: u.email }); signedIn(); render(); setTimeout(() => toast(t('login.done')), 200); })
        .catch(() => { signedOut(); toast(t('cl.linkBad')); });
      return true;
    },
    async signOut() { const tk = auth?.access; signedOut(); if (tk) call('/auth/v1/logout', { method: 'POST', token: tk }).catch(() => {}); },
    // Google · Microsoft: off to the provider, back with #access_token (handled by fromRedirect)
    oauth(provider) { location.href = `${SUPA.url}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(appUrl())}${provider === 'azure' ? '&scopes=email' : ''}`; },
    // which sign-in methods are switched on in Supabase (Authentication › Sign In / Providers)
    providers: () => call('/auth/v1/settings').then(j => j.external || {}).catch(() => ({})),
    sendSms: phone => call('/auth/v1/otp', { method: 'POST', body: { phone, create_user: true } }),
    verifySms: async (phone, code) => { const j = await call('/auth/v1/verify', { method: 'POST', body: { type: 'sms', phone, token: code } }); store(j, phone); signedIn(); },
    rest, rpc: (fn, args) => rest('rpc/' + fn, { method: 'POST', body: args }),
    resume() { if (CLOUD && auth) { if (!session) signedIn(); else sync(); } }
  };
})();


/* ---------------- first-visit tour (daily bible) ----------------
   1) a live demo: the feed scrolls by itself — a verse, a group prayer request, a thank-you
   2) "다음" → what else is here (three things), then the name / sign-up sheet. */
const DEMO = {
  ko: [{ k: 'verse', text: '여호와는 나의 목자시니 내가 부족함이 없으리로다', meta: '시편 23:1' },
       { k: 'prayer', text: '이번 주 어머니 수술이 잘 마무리되도록 기도 부탁드려요.', meta: '지은 · 은혜 공동체 · 기도제목' },
       { k: 'thanks', text: '오늘 아침 가족과 함께 따뜻한 밥을 먹을 수 있어 감사해요.', meta: '민서 · 감사' }],
  en: [{ k: 'verse', text: 'The Lord is my shepherd; I shall not want.', meta: 'Psalm 23:1' },
       { k: 'prayer', text: 'Please pray that my mom’s surgery this week goes well.', meta: 'Sarah · Grace Group · Prayer request' },
       { k: 'thanks', text: 'Thankful for a warm breakfast with my family this morning.', meta: 'Mia · Thanks' }],
  es: [{ k: 'verse', text: 'Jehová es mi pastor; nada me faltará.', meta: 'Salmo 23:1' },
       { k: 'prayer', text: 'Oren para que la cirugía de mi mamá salga bien esta semana.', meta: 'Sara · Grupo Gracia · Petición' },
       { k: 'thanks', text: 'Agradecida por un desayuno cálido con mi familia esta mañana.', meta: 'Mía · Gratitud' }]
};
function startTour() {
  close(); document.getElementById('splash')?.remove();
  const host = sheet.parentElement || document.body;
  const el = document.createElement('div'); el.id = 'tour'; el.setAttribute('role', 'dialog'); host.append(el);
  const cards = DEMO[lang()] || DEMO.en, ic = { verse: 'book', prayer: 'pray', thanks: 'heart' };
  let i = 0, timer = null;
  const end = () => { clearInterval(timer); el.remove(); data.settings.toured = true; save(); if (CLOUD && !Cloud.on()) welcomeSheet(); };
  function demo() {
    el.innerHTML = `<div class="tour-demo">
      <span class="wordmark tour-mark">daily <em>bible</em></span>
      <div class="tour-stage"><div class="tour-track">${cards.map(c => `<div class="tour-post">
        <p class="tour-kind">${icon(ic[c.k])}<span>${t('tour.k.' + c.k)}</span></p>
        <p class="tour-text">${esc(c.text)}</p><p class="tour-meta">${esc(c.meta)}</p>
        ${c.k === 'prayer' ? `<span class="tour-chip">${icon('pray')}${t('pr.prayed')}</span>` : c.k === 'thanks' ? `<span class="tour-chip">${icon('heart')}${t('act.like')}</span>` : ''}</div>`).join('')}</div>
        <i class="tour-finger"></i></div>
      <div class="tour-cap">${cards.map((c, n) => `<p class="tour-line" data-n="${n}">${t('tour.s.' + c.k)}</p>`).join('')}</div>
      <div class="tour-dots">${cards.map((c, n) => `<i data-n="${n}"></i>`).join('')}</div>
      <div class="tour-acts"><button class="subtle-link" data-tour="skip">${t('tour.skip')}</button><button class="primary" data-tour="next">${t('wl.next')}</button></div></div>`;
    const track = el.querySelector('.tour-track'), finger = el.querySelector('.tour-finger');
    const show = () => {
      track.style.transform = `translateY(-${i * 100}%)`;
      el.querySelectorAll('.tour-line').forEach(x => x.classList.toggle('on', +x.dataset.n === i));
      el.querySelectorAll('.tour-dots i').forEach(x => x.classList.toggle('on', +x.dataset.n === i));
    };
    show();
    // a finger swipes up, the card slides away — like scrolling the real feed
    timer = setInterval(() => { finger.classList.remove('go'); void finger.offsetWidth; finger.classList.add('go'); setTimeout(() => { i = (i + 1) % cards.length; show(); }, 450); }, 2800);
  }
  function features() {
    clearInterval(timer);
    const f = k => `<div class="tour-f"><span class="row-icon">${icon({ read: 'book', notes: 'mic', group: 'people' }[k])}</span><span><b>${t('tour.f.' + k)}</b><small>${t('tour.f.' + k + 'Sub')}</small></span></div>`;
    el.innerHTML = `<div class="tour-demo tour-feat"><span class="wordmark tour-mark">daily <em>bible</em></span>
      <p class="tour-title">${t('tour.f.title')}</p>
      <div class="tour-fs">${f('read')}${f('notes')}${f('group')}</div>
      <div class="tour-acts"><span></span><button class="primary" data-tour="done">${t('tour.done')}</button></div></div>`;
  }
  el.addEventListener('click', e => {
    const b = e.target.closest('[data-tour]'); if (!b) return;
    if (b.dataset.tour === 'next') features(); else end();
  });
  demo();
}
/* First visit: name first, then one tap to sign up — Google · Microsoft · e-mail · text message.
   A button whose provider isn't switched on in Supabase yet says so instead of failing. */
function welcomeSheet(reason = '') {
  if (!data.settings.myName) {
    showSheet({ title: t('wl.title'), body: `<form id="wl-form" class="sheet-form"><p class="hint">${t('wl.nameQ')}</p>
      <input id="wl-name" class="field" maxlength="30" autocomplete="name" placeholder="${esc(t('cl.namePh'))}" required>
      <button class="primary block" type="submit">${t('wl.next')}</button></form>` });
    $('#wl-form').addEventListener('submit', e => { e.preventDefault(); const n = $('#wl-name').value.trim().slice(0, 30); if (!n) return; data.settings.myName = n; save(); welcomeSheet(reason); });
    return;
  }
  const b = (id, ic, label) => `<button class="login-btn" data-action="wl-sign" data-id="${id}">${icon(ic)}<span>${label}</span></button>`;
  showSheet({ title: t('wl.hi').replace('{name}', esc(data.settings.myName)), body: `<p class="hint">${reason ? esc(reason) : t('wl.sub')}</p>
    <div class="login-buttons">${b('google', 'google', t('wl.google'))}${b('azure', 'microsoft', t('wl.ms'))}${b('email', 'mail', t('wl.email'))}${b('phone', 'phoneMsg', t('wl.phone'))}</div>
    <p class="fine-print login-terms">${t('login.terms').replaceAll('{base}', LEGAL_BASE)}</p>
    <button class="subtle-link" data-action="wl-later">${t('np.later')}</button>` });
}
async function welcomeSign(id) {
  if (id === 'email') return emailLogin();
  const on = await Cloud.providers();
  if (id === 'phone') { if (on.phone) smsLogin(); else toast(t('wl.notYet')); return; }
  if (on[id]) Cloud.oauth(id); else toast(t('wl.notYet'));
}
// Korean numbers (010-…) become +8210…; numbers typed with + stay as they are
const e164 = v => { const d = String(v).replace(/[^\d+]/g, ''); return d.startsWith('+') ? d : d.startsWith('0') ? '+82' + d.slice(1) : '+' + d; };
function smsLogin() {
  showSheet({ title: t('phone.title'), body: `<form id="sms-form" class="sheet-form">
    <label class="field-label" for="sms-number">${t('phone.number')}</label>
    <input id="sms-number" class="field" type="tel" inputmode="tel" autocomplete="tel" placeholder="010-1234-5678" required>
    <div id="sms-step" hidden><label class="field-label" for="sms-code">${t('phone.code')}</label>
    <input id="sms-code" class="field" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000"></div>
    <button class="primary block" type="submit" id="sms-submit">${t('phone.send')}</button></form>` });
  let phone = '';
  $('#sms-form').addEventListener('submit', async e => {
    e.preventDefault();
    if (!phone) {
      const p = e164($('#sms-number').value); if (p.replace(/\D/g, '').length < 10) { toast(t('phone.bad')); return; }
      try { await Cloud.sendSms(p); phone = p; $('#sms-step').hidden = false; $('#sms-submit').textContent = t('phone.verify'); $('#sms-code').focus(); toast(t('phone.sent')); }
      catch (err) { toast(err.status === 429 ? t('cl.tooMany') : t('cl.sendFail')); }
    } else {
      const code = $('#sms-code').value.replace(/\D/g, ''); if (code.length !== 6) { toast(t('phone.badCode')); return; }
      try { await Cloud.verifySms(phone, code); close(); render(); toast(t('login.done')); } catch { toast(t('cl.codeBad')); }
    }
  });
}
// The sign-in sheet: name (shown on thanks cards) + e-mail → link in the mail (or the code from it).
function emailLogin(reason = '', after = null) {
  state.afterLogin = after;
  showSheet({ title: t('cl.title'), body: `<form id="cl-form" class="sheet-form">
    ${reason ? `<p class="hint">${esc(reason)}</p>` : ''}
    <label class="field-label" for="cl-name">${t('cl.name')}</label>
    <input id="cl-name" class="field" maxlength="30" autocomplete="name" value="${esc(data.settings.myName || '')}" placeholder="${esc(t('cl.namePh'))}" required>
    <label class="field-label" for="cl-email">${t('cl.email')}</label>
    <input id="cl-email" class="field" type="email" inputmode="email" autocomplete="email" placeholder="name@example.com" required>
    <button class="primary block" type="submit" id="cl-send">${t('cl.send')}</button>
    <p class="fine-print">${t('login.terms').replaceAll('{base}', LEGAL_BASE)}</p></form>` });
  $('#cl-form').addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('#cl-name').value.trim().slice(0, 30), email = $('#cl-email').value.trim().toLowerCase();
    if (!name) { $('#cl-name').focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast(t('cl.badEmail')); return; }
    data.settings.myName = name; save();
    const b = $('#cl-send'); b.disabled = true; b.textContent = t('cl.sending');
    try { await Cloud.sendLink(email, name); emailSent(email, name); }
    catch (err) { b.disabled = false; b.textContent = t('cl.send'); toast(err.status === 429 ? t('cl.tooMany') : t('cl.sendFail')); }
  });
}
function emailSent(email, name) {
  showSheet({ title: t('cl.sentTitle'), body: `<p class="hint">${esc(t('cl.sentBody').replace('{email}', email))}</p>
    <form id="cl-code-form" class="sheet-form">
    <label class="field-label" for="cl-code">${t('cl.code')}</label>
    <input id="cl-code" class="field" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="000000">
    <button class="secondary block" type="submit">${t('cl.verify')}</button></form>
    <button class="subtle-link" data-action="cl-resend">${t('cl.resend')}</button>` });
  state.clEmail = { email, name };
  $('#cl-code-form').addEventListener('submit', async e => {
    e.preventDefault(); const code = $('#cl-code').value.replace(/\D/g, '');
    if (code.length < 6) { toast(t('phone.badCode')); return; }
    try { await Cloud.verify(email, code); close(); render(); toast(t('login.done')); const next = state.afterLogin; state.afterLogin = null; if (next) setTimeout(next, 300); }
    catch { toast(t('cl.codeBad')); }
  });
}

/* Keeps this device's 공동체 in step with Supabase: registers groups made here, finishes joins made from a link
   (also ones made before signing in), and brings in names, member counts and people waiting for approval. */
let syncing = null;
function sync() {
  if (!Cloud.on()) return Promise.resolve();
  return syncing = syncing || (async () => {
    const uid = Cloud.uid();
    if (data.settings.myName) Cloud.rest('profiles?id=eq.' + uid, { method: 'PATCH', body: { name: data.settings.myName } }).catch(() => {});
    for (const g of data.groups.filter(x => x.cloud && !x.sid)) {
      try {
        if (g.owner) {
          const [row] = await Cloud.rest('groups', { method: 'POST', prefer: 'return=representation', body: { name: L(g.name), invite_code: g.invite, owner: uid, approve: !!g.approve, members_invite: g.membersInvite !== false } });
          await Cloud.rest('group_members', { method: 'POST', body: { group_id: row.id, user_id: uid, role: 'owner', status: 'active' } });
          g.sid = row.id;
        } else {
          const [row] = await Cloud.rpc('join_group', { code: g.invite });
          g.sid = row.group_id; g.name = row.name || g.name; g.pending = row.status === 'pending';
          toast(g.pending ? t('join.pending') : t('join.done').replace('{name}', L(g.name)));
        }
      } catch (err) {
        if (/invalid_code/.test(err.message)) { data.groups = data.groups.filter(x => x !== g); toast(t('cl.badInvite')); }
        else if (err.code === '23505' && g.owner) { g.invite = newCode(); }   // that invite code is taken: try a new one next time
      }
    }
    // my memberships on the server
    try {
      const mine = await Cloud.rest(`group_members?user_id=eq.${uid}&select=group_id,role,status,groups(*)`);
      const ids = new Set(mine.map(m => m.group_id));
      for (const m of mine) {
        let g = data.groups.find(x => x.sid === m.group_id);
        if (!g) { g = { id: 'g' + m.group_id.slice(0, 8), sid: m.group_id, cloud: true, name: m.groups?.name || '', invite: m.groups?.invite_code || newCode(), owner: m.role === 'owner' }; data.groups.push(g); }
        g.pending = m.status === 'pending'; g.role = m.role;
        if (m.groups) { g.name = m.groups.name; if (m.groups.invite_code) g.invite = m.groups.invite_code; g.approve = !!m.groups.approve; g.membersInvite = m.groups.members_invite !== false; g.topToLeaders = !!m.groups.top_to_leaders; }
      }
      // removed from a group (or a pending request turned down)
      data.groups = data.groups.filter(g => !(g.cloud && g.sid && !ids.has(g.sid)));
      for (const g of data.groups.filter(x => x.sid && !x.pending)) {
        const people = await Cloud.rest(`group_members?group_id=eq.${g.sid}&select=user_id,role,status,profiles(name)`).catch(() => null);
        if (!people) continue;
        g.size = people.filter(p => p.status === 'active').length;
        g.people = people.map(p => ({ id: p.user_id, name: p.profiles?.name || '', role: p.role, pending: p.status === 'pending' }));
      }
    } catch {}
    save(); render();
  })().finally(() => { syncing = null; });
}
// group admin: approve / turn down / remove someone (the database lets only the group's leaders do this)
async function cloudMember(gid, uid, approve) {
  const g = data.groups.find(x => x.id === gid); if (!g?.sid) return;
  const where = `group_members?group_id=eq.${g.sid}&user_id=eq.${uid}`;
  try { approve ? await Cloud.rest(where, { method: 'PATCH', body: { status: 'active' } }) : await Cloud.rest(where, { method: 'DELETE' }); }
  catch { toast(t('cl.fail')); return; }
  await sync(); groupAdmin(gid); toast(approve ? t('cl.approved') : t('cl.removed'));
}
function cloudGroupSet(g, fields) { if (Cloud.on() && g?.sid) Cloud.rest('groups?id=eq.' + g.sid, { method: 'PATCH', body: fields }).catch(() => toast(t('cl.fail'))); }

/* ---------------- remote content: change text without a store update ----------------
   Text that changes often (tagline, daily questions, notices, featured posts, which optional features exist,
   links, minimum app version) lives in content/content.json on the server. At launch the app uses the copy it
   saved last time, then downloads a fresh one from CONTENT_URL. Anything missing falls back to built-in text. */
const CONTENT_KEY = 'daily-thanks-content';
// Daily content (today's 생명의 삶 / Our Daily Bread passage, notices…) — updated every day on dailyjourney.org.
const CONTENT_URL = window.DT_CONTENT_URL || 'https://dailyjourney.org/content.json';
let CONTENT = {};
const bootAt = Date.now();
const verNum = v => String(v || '0').split('.').slice(0, 3).reduce((a, n) => a * 1000 + (parseInt(n, 10) || 0), 0);
const safeEm = html => esc(String(html)).replace(/&lt;(\/?)em&gt;/g, '<$1em>');
function syncFeatured() {
  const list = (Array.isArray(CONTENT.featuredPosts) ? CONTENT.featuredPosts : []).filter(f => f && f.id && f.text);
  const ids = new Set(list.map(f => f.id));
  data.posts = data.posts.filter(p => !p.featured || ids.has(p.id));
  list.forEach(f => {
    const ex = data.posts.find(p => p.id === f.id);
    if (ex) { Object.assign(ex, { name: f.name, text: f.text, kind: f.kind || ex.kind }); return; }
    data.posts.unshift({ likes: 0, shares: 0, saves: 0, kind: 'today', date: today(), ...f, scope: 'public', featured: true, mine: false });
  });
}
const ipItems = (c = CONTENT) => { const n = c && c.ipNotice; if (!n || n.show !== true || !Array.isArray(n.items)) return [];
  return n.items.filter(x => x && typeof x.no === 'string' && x.no.trim()).map(x => `${(x.label && (x.label[lang()] || x.label.en)) || 'Patent pending'} ${x.no.trim()}`).slice(0, 4); };
function applyContent(c, persist = true) {
  if (!c || typeof c !== 'object' || Array.isArray(c)) return false;
  CONTENT = c;
  if (persist) try { localStorage.setItem(CONTENT_KEY, JSON.stringify(c)); } catch {}
  if (typeof c.legalBase === 'string' && /^https:\/\/\S+$/.test(c.legalBase)) LEGAL_BASE = c.legalBase.replace(/\/$/, '');
  if (typeof c.supportEmail === 'string' && /^\S+@\S+\.\S+$/.test(c.supportEmail)) SUPPORT_EMAIL = c.supportEmail;
  syncFeatured();
  const tag = document.querySelector('#splash .splash-tag');
  const tl = Array.isArray(c.tagline) ? c.tagline : c.tagline && c.tagline[lang()];
  if (tag && Array.isArray(tl) && tl.length) tag.innerHTML = tl.slice(0, 4).map(l => `<span>${safeEm(l)}</span>`).join('');
  const copy = document.querySelector('#splash .splash-copy');
  if (copy && typeof c.copyright === 'string') copy.textContent = c.copyright;
  // "Patent pending" style notice: only shown once something is really filed (content.json ipNotice.show + numbers).
  // Showing it before filing would be false marking — keep show: false until there is an application number.
  const ip = ipItems(c);
  if (copy && ip.length && !copy.querySelector('.splash-ip')) copy.insertAdjacentHTML('beforeend', `<span class="splash-ip">${ip.map(x => esc(x)).join(' · ')}</span>`);
  return true;
}
// One-time messages from the content file: a notice (shown once per id) and "please update" when this build is too old.
let contentPromptsDone = false;
function contentPrompts() {
  if (contentPromptsDone) return;
  const c = CONTENT;
  if (c.minVersion && verNum(APP_VERSION) < verNum(c.minVersion)) {
    contentPromptsDone = true;
    const ios = /iP(hone|ad|od)/.test(navigator.userAgent), link = c.storeLinks?.[ios ? 'ios' : 'android'];
    showSheet({ title: t('upd.title'), body: `<p class="hint">${t('upd.body')}</p>${link ? `<div class="sheet-actions"><a class="primary" href="${esc(link)}" target="_blank" rel="noopener">${t('upd.go')}</a></div>` : ''}` });
    return;
  }
  const n = c.notice;
  if (n && n.id && (!n.until || n.until >= today())) {
    let seen = null; try { seen = localStorage.getItem('daily-thanks-notice'); } catch {}
    const text = n[lang()] || n.en;
    if (seen !== n.id && text) { contentPromptsDone = true; toast(text); try { localStorage.setItem('daily-thanks-notice', n.id); } catch {} }
  }
}
const afterContent = () => setTimeout(contentPrompts, Math.max(0, 4600 - (Date.now() - bootAt)));
try { applyContent(JSON.parse(localStorage.getItem(CONTENT_KEY)), false); } catch {}

function toast(text) { const el = $('#toast'); el.textContent = text; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => el.hidden = true, 2600); }

/* ---------------- helpers ---------------- */
const postGroups = p => Array.isArray(p.groups) && p.groups.length ? p.groups : (p.group ? [p.group] : []);
// How many people are in a group (the server keeps it up to date; never fewer than those who've posted).
function groupSize(gid) {
  const g = data.groups.find(x => x.id === gid);
  const seen = new Set(data.posts.filter(p => inGroup(p, gid)).map(p => p.mine ? 'me' : authorKey(p))).size;
  return Math.max(g?.size ?? ({ g1: 7, g2: 4 })[gid] ?? 1, seen, 1);
}
const inGroup = (p, gid) => p.scope === 'group' && postGroups(p).includes(gid) && !(p.mine ? false : (data.groups.find(g => g.id === gid)?.removed || []).includes(authorKey(p)));
// Who may invite: the admin always; members only while the admin allows it (on by default).
const canInvite = g => !!g && (g.owner || g.membersInvite !== false);
// A small red dot (on the 공동체 tab and on the group) while a group has posts you haven't caught up on.
const unseenIn = gid => data.groups.find(g => g.id === gid)?.muted ? 0 : data.posts.filter(p => !p.mine && inGroup(p, gid) && !data.hidden.includes(p.id) && !(data.groupSeen || []).includes(p.id)).length;
const unseenKind = (gid, kind) => data.posts.filter(p => !p.mine && inGroup(p, gid) && kindGroup(p) === kind && !data.hidden.includes(p.id) && !(data.groupSeen || []).includes(p.id)).length;
const anyUnseen = () => data.groups.some(g => unseenIn(g.id));
function markGroupSeen(gid, kind) {
  data.groupSeen = data.groupSeen || [];
  data.posts.filter(p => inGroup(p, gid) && (!kind || kind === 'all' || kindGroup(p) === kind) && !data.groupSeen.includes(p.id)).forEach(p => data.groupSeen.push(p.id));
  save();
}
const groupNames = p => postGroups(p).map(groupName).filter(Boolean).join(', ');
const groupName = id => id === 'pair' ? t('ch.pairShort') : L(data.groups.find(g => g.id === id)?.name) || id || '';
const authorName = p => p.mine ? t('me') : (data.nicknames?.[authorKey(p)] || L(p.name));
const kindLabel = p => p.kind === 'meditation' ? t('kind.meditation') + (p.ref ? ' · ' + refText(p.ref) : '') : p.kind === 'ahead' ? t('kind.ahead') : p.kind === 'thanks' ? t('kind.thanks') : p.kind === 'prayer' ? t('kind.prayer') : p.kind === 'share' ? t('gs.section') : t('kind.today');
// what kind of post, in one or two words under each card: 감사 · 기도제목 · 묵상 (with its passage)
const kindShort = p => p.kind === 'today' || !p.kind ? t('kk.thanks') : p.kind === 'ahead' ? t('kind.aheadShort') : kindLabel(p);
const kindIcon = p => p.kind === 'ahead' ? 'sunrise' : p.kind === 'thanks' ? 'send' : p.kind === 'prayer' ? 'pray' : p.kind === 'share' ? 'people' : 'sun';
const scopeLabel = p => p.scope === 'public' ? t('scope.public') : p.scope === 'private' ? t('scope.private') : groupNames(p) || t('scope.group');
const scopeIcon = p => p.scope === 'public' ? 'globe' : p.scope === 'private' ? 'lock' : 'people';
// Same visual line count in both languages: Latin text holds roughly 1.4x the characters per line.
// One reading size for every post (set in Settings › Text size). Very long posts are clamped with "Read more".
// Every post shows at most 5 lines and ends with "…"; "Read more" appears only when a post is actually cut.
const textClass = () => 'clamped';
const readMore = p => `<button class="read-more" data-action="read-more" data-id="${esc(p.id)}" hidden>${t('readMore')}</button>`;
function markClamped() {
  document.querySelectorAll('.post-text.clamped').forEach(el => {
    const btn = el.nextElementSibling; const cut = el.scrollHeight > el.clientHeight + 2;
    if (btn && btn.classList.contains('read-more')) btn.hidden = !cut;
    el.dataset.cut = cut ? '1' : '';
  });
}
function applyTextSize() { document.documentElement.dataset.size = data.settings.textSize || 'm'; }

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
  restoreDrafts(sheet);
  setTimeout(() => sheet.querySelector('textarea, input.field')?.focus(), 30); // only text fields get focus
}
/* Auto-save: whatever you type in a writing box is kept as a draft (on this device) until it's posted.
   Close the sheet, switch apps or lose the connection — the words are there when you come back. */
function restoreDrafts(root) {
  const d = data.drafts || {};
  root.querySelectorAll('textarea[data-draft]').forEach(el => { const v = d[el.dataset.draft]; if (v && !el.value.trim()) el.value = v; });
}
let draftTimer = null;
document.addEventListener('input', e => {
  const el = e.target; if (!el.matches?.('textarea[data-draft]')) return;
  data.drafts = data.drafts || {};
  if (el.value.trim()) data.drafts[el.dataset.draft] = el.value; else delete data.drafts[el.dataset.draft];
  clearTimeout(draftTimer); draftTimer = setTimeout(() => {
    save();
    let tag = el.parentElement.querySelector('.draft-saved');
    if (!tag) { tag = document.createElement('p'); tag.className = 'draft-saved'; el.insertAdjacentElement('afterend', tag); }
    tag.textContent = t('draft.saved'); tag.classList.remove('gone'); clearTimeout(tag.t); tag.t = setTimeout(() => tag.classList.add('gone'), 1600);
  }, 500);
});
// Posted: the draft is no longer needed.
document.addEventListener('submit', e => {
  e.target.querySelectorAll?.('textarea[data-draft]').forEach(el => { if (data.drafts) delete data.drafts[el.dataset.draft]; });
}, true);
function close() {
  if (state.medRecOn) medRecStop();   // never leave the microphone running behind a closed sheet
  sheet.hidden = true; backdrop.hidden = true; sheet.innerHTML = '';
  if (state.verseChanged) { // verse frequency changed: rebuild the feed, staying near the same place
    state.verseChanged = false; const sc = $('#feed-scroll');
    render(sc ? Math.round(sc.scrollTop / Math.max(1, sc.clientHeight)) : 0);
  }
  // Habit onboarding, one step at a time: (after sign-in) reminders → home-screen widget.
  if (state.pendingPrime) { state.pendingPrime = false; if (maybePrime()) return; }
  if (state.pendingWidget) { state.pendingWidget = false; maybeWidget(); }
}

function dayRow(ch) {
  const next = Math.min(ch.days.length + 1, 7);
  return `<div class="days">${Array.from({ length: 7 }, (_, i) => {
    const n = i + 1, done = ch.days.includes(n);
    return `<div class="day ${done ? 'done' : ''} ${n === next && !done ? 'today' : ''}"><span>${done ? icon('check') : n}</span>${lang() === 'ko' ? n + t('ch.day') : t('ch.day') + n}</div>`;
  }).join('')}</div>`;
}

/* ---------------- screens ---------------- */
/* ---------------- feed algorithm ----------------
   Mix three streams so people keep reading (and then write):
     close   — people near me: members of my groups, and authors I liked / saved / prayed for
     popular — reached many people (likes, saves, shares), weighted by freshness
     fresh   — newest
   Unseen posts come first in every stream; the same author never appears twice in a row and
   short / long posts alternate. The order is fixed per app open so the feed doesn't jump while reading.
   (In production this runs on the server with real signals; same idea.) */
const daysOld = p => Math.max(0, Math.round((new Date(today()) - new Date(p.date)) / 864e5));
function closeAuthors() {
  const set = new Set();
  data.posts.filter(p => p.scope === 'group' && !p.mine && data.groups.some(g => inGroup(p, g.id))).forEach(p => set.add(authorKey(p)));
  [...data.liked, ...data.saved, ...(data.prayed || [])].forEach(id => { const p = data.posts.find(x => x.id === id); if (p && !p.mine) set.add(authorKey(p)); });
  return set;
}
function rankFeed(posts) {
  const seen = new Set(data.seen || []), close = closeAuthors();
  const unseenFirst = list => list.filter(p => !seen.has(p.id)).concat(list.filter(p => seen.has(p.id)));
  const byDate = (a, b) => daysOld(a) - daysOld(b);
  const streams = [
    unseenFirst([...posts].sort((a, b) => scoreOf(b) * Math.pow(.8, daysOld(b)) - scoreOf(a) * Math.pow(.8, daysOld(a)))), // popular
    unseenFirst(posts.filter(p => close.has(authorKey(p)) || p.scope === 'group').sort(byDate)),                          // close
    unseenFirst([...posts].sort(byDate))                                                                                     // fresh
  ];
  const out = [], used = new Set(); let turn = 0;
  const isLongPost = p => L(p.text).length > 60;
  while (out.length < posts.length) {
    const prev = out[out.length - 1];
    let pick = null;
    for (let k = 0; k < 3 && !pick; k++) {
      const list = streams[(turn + k) % 3];
      const ok = p => !used.has(p.id) && (!prev || (authorKey(p) !== authorKey(prev) && (out.length < 2 || isLongPost(p) !== isLongPost(prev) || list.filter(x => !used.has(x.id)).length < 3)));
      pick = list.find(ok) || null;
    }
    if (!pick) pick = posts.find(p => !used.has(p.id)); // relax constraints at the end
    out.push(pick); used.add(pick.id); turn++;
  }
  return out;
}
// Freeze the order for this app session; new posts (if any) are added at the front.
function rankedOnce(key, posts) {
  state.order = state.order || {};
  const ids = new Set(posts.map(p => p.id));
  if (!state.order[key]) state.order[key] = rankFeed(posts).map(p => p.id);
  const known = new Set(state.order[key]);
  const fresh = posts.filter(p => !known.has(p.id));
  return fresh.concat(state.order[key].filter(id => ids.has(id)).map(id => posts.find(p => p.id === id)));
}
// Remember what has been seen (used to put unseen posts first next time).
let seenTimer;
function trackSeen() {
  const sc = $('#feed-scroll'); if (!sc) return;
  const mark = () => {
      const el = sc.children[Math.round(sc.scrollTop / sc.clientHeight)];
      const id = el?.dataset?.post; if (!id) return;
      data.seen = data.seen || [];
      if (!data.seen.includes(id)) { data.seen.push(id); if (data.seen.length > 500) data.seen.shift(); save(); }
  };
  sc.addEventListener('scroll', () => { clearTimeout(seenTimer); seenTimer = setTimeout(mark, 400); }, { passive: true });
  setTimeout(() => { if (document.body.contains(sc)) mark(); }, 2500); // the first post counts once it has been on screen a moment
}

const wroteToday = () => data.posts.some(p => p.mine && p.date === today());
/* Public feed order: 3 posts → "write today's thanks" card (until written today) → sign-in card (until signed in) → the rest. */
/* ---------------- Bible: references, read-through (통독), group passage ----------------
   Text comes from public-domain translations: 개역한글 (ko), KJV (en), Reina-Valera 1909 (es).
   Chapters load from dailyjourney.org/bible/… (copied there by the website build), falling back to the getBible API. */
const BOOKS = [
  ["창세기", "창", "Genesis", "Génesis", 50],
  ["출애굽기", "출", "Exodus", "Éxodo", 40],
  ["레위기", "레", "Leviticus", "Levítico", 27],
  ["민수기", "민", "Numbers", "Números", 36],
  ["신명기", "신", "Deuteronomy", "Deuteronomio", 34],
  ["여호수아", "수", "Joshua", "Josué", 24],
  ["사사기", "삿", "Judges", "Jueces", 21],
  ["룻기", "룻", "Ruth", "Rut", 4],
  ["사무엘상", "삼상", "1 Samuel", "1 Samuel", 31],
  ["사무엘하", "삼하", "2 Samuel", "2 Samuel", 24],
  ["열왕기상", "왕상", "1 Kings", "1 Reyes", 22],
  ["열왕기하", "왕하", "2 Kings", "2 Reyes", 25],
  ["역대상", "대상", "1 Chronicles", "1 Crónicas", 29],
  ["역대하", "대하", "2 Chronicles", "2 Crónicas", 36],
  ["에스라", "스", "Ezra", "Esdras", 10],
  ["느헤미야", "느", "Nehemiah", "Nehemías", 13],
  ["에스더", "에", "Esther", "Ester", 10],
  ["욥기", "욥", "Job", "Job", 42],
  ["시편", "시", "Psalms", "Salmos", 150],
  ["잠언", "잠", "Proverbs", "Proverbios", 31],
  ["전도서", "전", "Ecclesiastes", "Eclesiastés", 12],
  ["아가", "아", "Song of Solomon", "Cantares", 8],
  ["이사야", "사", "Isaiah", "Isaías", 66],
  ["예레미야", "렘", "Jeremiah", "Jeremías", 52],
  ["예레미야애가", "애", "Lamentations", "Lamentaciones", 5],
  ["에스겔", "겔", "Ezekiel", "Ezequiel", 48],
  ["다니엘", "단", "Daniel", "Daniel", 12],
  ["호세아", "호", "Hosea", "Oseas", 14],
  ["요엘", "욜", "Joel", "Joel", 3],
  ["아모스", "암", "Amos", "Amós", 9],
  ["오바댜", "옵", "Obadiah", "Abdías", 1],
  ["요나", "욘", "Jonah", "Jonás", 4],
  ["미가", "미", "Micah", "Miqueas", 7],
  ["나훔", "나", "Nahum", "Nahúm", 3],
  ["하박국", "합", "Habakkuk", "Habacuc", 3],
  ["스바냐", "습", "Zephaniah", "Sofonías", 3],
  ["학개", "학", "Haggai", "Hageo", 2],
  ["스가랴", "슥", "Zechariah", "Zacarías", 14],
  ["말라기", "말", "Malachi", "Malaquías", 4],
  ["마태복음", "마", "Matthew", "Mateo", 28],
  ["마가복음", "막", "Mark", "Marcos", 16],
  ["누가복음", "눅", "Luke", "Lucas", 24],
  ["요한복음", "요", "John", "Juan", 21],
  ["사도행전", "행", "Acts", "Hechos", 28],
  ["로마서", "롬", "Romans", "Romanos", 16],
  ["고린도전서", "고전", "1 Corinthians", "1 Corintios", 16],
  ["고린도후서", "고후", "2 Corinthians", "2 Corintios", 13],
  ["갈라디아서", "갈", "Galatians", "Gálatas", 6],
  ["에베소서", "엡", "Ephesians", "Efesios", 6],
  ["빌립보서", "빌", "Philippians", "Filipenses", 4],
  ["골로새서", "골", "Colossians", "Colosenses", 4],
  ["데살로니가전서", "살전", "1 Thessalonians", "1 Tesalonicenses", 5],
  ["데살로니가후서", "살후", "2 Thessalonians", "2 Tesalonicenses", 3],
  ["디모데전서", "딤전", "1 Timothy", "1 Timoteo", 6],
  ["디모데후서", "딤후", "2 Timothy", "2 Timoteo", 4],
  ["디도서", "딛", "Titus", "Tito", 3],
  ["빌레몬서", "몬", "Philemon", "Filemón", 1],
  ["히브리서", "히", "Hebrews", "Hebreos", 13],
  ["야고보서", "약", "James", "Santiago", 5],
  ["베드로전서", "벧전", "1 Peter", "1 Pedro", 5],
  ["베드로후서", "벧후", "2 Peter", "2 Pedro", 3],
  ["요한일서", "요일", "1 John", "1 Juan", 5],
  ["요한이서", "요이", "2 John", "2 Juan", 1],
  ["요한삼서", "요삼", "3 John", "3 Juan", 1],
  ["유다서", "유", "Jude", "Judas", 1],
  ["요한계시록", "계", "Revelation", "Apocalipsis", 22]
]; // [ko, ko short, en, es, chapters] — index + 1 = book number
const BIBLE_TR = { ko: 'korean', en: 'kjv', es: 'valera' };
const TOTAL_CHAPTERS = 1189;
const bookName = b => { const x = BOOKS[b - 1]; return x ? (lang() === 'ko' ? x[0] : lang() === 'es' ? x[3] : x[2]) : ''; };
const fold = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[\s.]/g, '');
// "요한복음 3:1-15", "요 3:16", "시편 23", "John 3:16-18", "1 Tesalonicenses 5:16-18" → { b, c, v, v2 }
function parseRef(input) {
  const str = String(input || '').trim(); if (!str) return null;
  const cross = str.match(/^(.*?\D)\s*(\d+)\s*:\s*(\d+)\s*[-~–]\s*(\d+)\s*:\s*(\d+)\s*$/);
  if (cross) { const r = parseRef(`${cross[1]} ${cross[2]}:${cross[3]}`); if (r && +cross[4] > r.c && +cross[4] <= BOOKS[r.b - 1][4]) return { ...r, v2: 0, c2: +cross[4], e2: +cross[5] }; }
  const m = str.match(/^(.*?)(\d+)\s*(?:장|:|\s)?\s*(?:(\d+)\s*(?:절)?\s*(?:[-~–]\s*(\d+)\s*(?:절)?)?)?\s*$/);
  if (!m) return null;
  const name = fold(m[1]); if (!name) return null;
  let best = 0, bestLen = 0;
  BOOKS.forEach((x, i) => [x[0], x[1], x[2], x[3]].forEach(n => { const f = fold(n); if (f && name === f && f.length > bestLen) { best = i + 1; bestLen = f.length; } }));
  if (!best) BOOKS.forEach((x, i) => [x[0], x[2], x[3]].forEach(n => { const f = fold(n); if (f.length >= 3 && f.startsWith(name) && name.length >= 2 && !best) best = i + 1; }));
  const c = +m[2]; if (!best || !c || c > BOOKS[best - 1][4]) return null;
  const v = m[3] ? +m[3] : 0, v2 = m[4] ? +m[4] : v;
  return { b: best, c, v, v2: Math.max(v, v2) };
}
const refText = r => !r ? '' : r.c2 > r.c ? `${bookName(r.b)} ${r.c}:${r.v}-${r.c2}:${r.e2}` : `${bookName(r.b)} ${r.c}${r.v ? `:${r.v}${r.v2 > r.v ? '-' + r.v2 : ''}` : (lang() === 'ko' ? '장' : '')}`;
// The verses of a passage, even when it runs into the next chapter (each verse keeps its chapter in .c).
async function passageVerses(r) {
  const out = [];
  for (let c = r.c; c <= (r.c2 > r.c ? r.c2 : r.c); c++) {
    const vs = await fetchChapter(r.b, c);
    vs.forEach(x => { const lo = c === r.c ? r.v || 1 : 1, hi = r.c2 > r.c ? (c === r.c2 ? r.e2 : Infinity) : (r.v ? r.v2 || r.v : Infinity); if (x.v >= lo && x.v <= hi) out.push({ ...x, c }); });
  }
  return out;
}
const chapterMem = {}, bookMem = {};
// Bible text: one file per book (bible/<tr>/<book>.json). Looked for next to the app first (phone app, preview,
// dailyjourney.org/app), then on dailyjourney.org, then the getBible API as a last resort.
// Bible text kept on the device (web): every book read once stays available offline; Settings can save all of it.
const bibleCache = () => (window.caches ? caches.open('dt-bible-v1').catch(() => null) : Promise.resolve(null));
async function saveBibleOffline() {
  const box = $('#off-p'); const trs = ['korean', 'kjv', 'valera']; const total = trs.length * 66; let n = 0, fail = 0;
  const cache = await bibleCache(); if (!cache) { toast(t('off.fail')); return; }
  for (const tr of trs) {
    for (let b = 1; b <= 66; b++) {
      const key = `${tr}/${b}`;
      if (!(await cache.match(`/dt-bible/${key}.json`))) { if (!(await fetchBook(tr, b))) fail++; }
      n++; if (box) box.textContent = t('off.doing').replace('{n}', n).replace('{t}', total);
    }
  }
  data.settings.bibleOffline = !fail; save();
  if (box) box.textContent = fail ? t('off.fail') : t('off.done');
  toast(fail ? t('off.fail') : t('off.done'));
}
async function fetchBook(tr, b) {
  const key = `${tr}/${b}`;
  if (!bookMem[key]) bookMem[key] = (async () => {
    const cache = await bibleCache();
    for (const url of [`bible/${key}.json`, `${LEGAL_BASE}/bible/${key}.json`, `https://raw.githubusercontent.com/wonshon-cmd/dailythanksapp/5ca8dc9eb893cb76f362953c1a5e48b34324bc28/bible/${key}.json`]) {
      try { const r = await fetch(url); if (r.ok) { const j = await r.clone().json(); if (Array.isArray(j.chapters)) { cache?.put(`/dt-bible/${key}.json`, r).catch(() => {}); return j.chapters; } } } catch { /* next */ }
    }
    try { const r = await cache?.match(`/dt-bible/${key}.json`); if (r) { const j = await r.json(); if (Array.isArray(j.chapters)) return j.chapters; } } catch {}
    return null;
  })();
  const book = await bookMem[key];
  if (!book) delete bookMem[key]; // allow a retry later
  return book;
}
// Verse counts for every chapter (book.chapter → last verse), so the picker works even before any text loads.
const VERSE_COUNTS = {"korean": "31.25.24.26.32.22.24.22.29.32.32.20.18.24.21.16.27.33.38.18.34.24.20.67.34.35.46.22.35.43.55.32.20.31.29.43.36.30.23.23.57.38.34.34.28.34.31.22.33.26,22.25.22.31.23.30.25.32.35.29.10.51.22.31.27.36.16.27.25.26.36.31.33.18.40.37.21.43.46.38.18.35.23.35.35.38.29.31.43.38,17.16.17.35.19.30.38.36.24.20.47.8.59.57.33.34.16.30.37.27.24.33.44.23.55.46.34,54.34.51.49.31.27.89.26.23.36.35.16.33.45.41.50.13.32.22.29.35.41.30.25.18.65.23.31.40.16.54.42.56.29.34.13,46.37.29.49.33.25.26.20.29.22.32.32.18.29.23.22.20.22.21.20.23.30.25.22.19.19.26.68.29.20.30.52.29.12,18.24.17.24.15.27.26.35.27.43.23.24.33.15.63.10.18.28.51.9.45.34.16.33,36.23.31.24.31.40.25.35.57.18.40.15.25.20.20.31.13.31.30.48.25,22.23.18.22,28.36.21.22.12.21.17.22.27.27.15.25.23.52.35.23.58.30.24.42.15.23.29.22.44.25.12.25.11.31.13,27.32.39.12.25.23.29.18.13.19.27.31.39.33.37.23.29.33.43.26.22.51.39.25,53.46.28.34.18.38.51.66.28.29.43.33.34.31.34.34.24.46.21.43.29.53,18.25.27.44.27.33.20.29.37.36.21.21.25.29.38.20.41.37.37.21.26.20.37.20.30,54.55.24.43.26.81.40.40.44.14.47.40.14.17.29.43.27.17.19.8.30.19.32.31.31.32.34.21.30,17.18.17.22.14.42.22.18.31.19.23.16.22.15.19.14.19.34.11.37.20.12.21.27.28.23.9.27.36.27.21.33.25.33.27.23,11.70.13.24.17.22.28.36.15.44,11.20.32.23.19.19.73.18.38.39.36.47.31,22.23.15.17.14.14.10.17.32.3,22.13.26.21.27.30.21.22.35.22.20.25.28.22.35.22.16.21.29.29.34.30.17.25.6.14.23.28.25.31.40.22.33.37.16.33.24.41.30.24.34.17,6.12.8.8.12.10.17.9.20.18.7.8.6.7.5.11.15.50.14.9.13.31.6.10.22.12.14.9.11.12.24.11.22.22.28.12.40.22.13.17.13.11.5.26.17.11.9.14.20.23.19.9.6.7.23.13.11.11.17.12.8.12.11.10.13.20.7.35.36.5.24.19.28.23.10.12.20.72.13.19.16.8.18.12.13.17.7.18.52.17.16.15.5.23.11.13.12.9.9.5.8.28.22.35.45.48.43.13.31.7.10.10.9.8.18.19.2.29.176.7.8.9.4.8.5.6.5.6.8.8.3.18.3.3.21.26.9.8.24.13.10.7.12.15.21.10.20.14.9.6,33.22.35.27.23.35.27.36.18.32.31.28.25.35.33.33.28.24.29.30.31.29.35.34.28.28.27.28.27.33.31,18.26.22.16.20.12.29.17.18.20.10.14,17.17.11.16.16.13.13.14,31.22.26.6.30.13.25.22.21.34.16.6.22.32.9.14.14.7.25.6.17.25.18.23.12.21.13.29.24.33.9.20.24.17.10.22.38.22.8.31.29.25.28.28.25.13.15.22.26.11.23.15.12.17.13.12.21.14.21.22.11.12.19.12.25.24,19.37.25.31.31.30.34.22.26.25.23.17.27.22.21.21.27.23.15.18.14.30.40.10.38.24.22.17.32.24.40.44.26.22.19.32.21.28.18.16.18.22.13.30.5.28.7.47.39.46.64.34,22.22.66.22.22,28.10.27.17.17.14.27.18.11.22.25.28.23.23.8.63.24.32.14.49.32.31.49.27.17.21.36.26.21.26.18.32.33.31.15.38.28.23.29.49.26.20.27.31.25.24.23.35,21.49.30.37.31.28.28.27.27.21.45.13,11.23.5.19.15.11.16.14.17.15.12.14.16.9,20.32.21,15.16.15.13.27.14.17.14.15,21,17.10.10.11,16.13.12.13.15.16.20,15.13.19,17.20.19,18.15.20,15.23,21.13.10.14.11.15.14.23.17.12.17.14.9.21,14.17.18.6,25.23.17.25.48.34.29.34.38.42.30.50.58.36.39.28.27.35.30.34.46.46.39.51.46.75.66.20,45.28.35.41.43.56.37.38.50.52.33.44.37.72.47.20,80.52.38.44.39.49.50.56.62.42.54.59.35.35.32.31.37.43.48.47.38.71.56.53,51.25.36.54.47.71.53.59.41.42.57.50.38.31.27.33.26.40.42.31.25,26.47.26.37.42.15.60.40.43.48.30.25.52.28.41.40.34.28.41.38.40.30.35.27.27.32.44.31,32.29.31.25.21.23.25.39.33.21.36.21.14.23.33.27,31.16.23.21.13.20.40.13.27.33.34.31.13.40.58.24,24.17.18.18.21.18.16.24.15.18.33.21.13,24.21.29.31.26.18,23.22.21.32.33.24,30.30.21.23,29.23.25.18,10.20.13.18.28,12.17.18,20.15.16.16.25.21,18.26.17.22,16.15.15,25,14.18.19.16.14.20.28.13.28.39.40.29.25,27.26.18.17.20,25.25.22.19.14,21.22.18,10.29.24.21.21,13,15,25,20.29.22.11.14.17.17.13.21.11.19.17.18.20.8.21.18.24.21.15.27.21", "kjv": "31.25.24.26.32.22.24.22.29.32.32.20.18.24.21.16.27.33.38.18.34.24.20.67.34.35.46.22.35.43.55.32.20.31.29.43.36.30.23.23.57.38.34.34.28.34.31.22.33.26,22.25.22.31.23.30.25.32.35.29.10.51.22.31.27.36.16.27.25.26.36.31.33.18.40.37.21.43.46.38.18.35.23.35.35.38.29.31.43.38,17.16.17.35.19.30.38.36.24.20.47.8.59.57.33.34.16.30.37.27.24.33.44.23.55.46.34,54.34.51.49.31.27.89.26.23.36.35.16.33.45.41.50.13.32.22.29.35.41.30.25.18.65.23.31.40.16.54.42.56.29.34.13,46.37.29.49.33.25.26.20.29.22.32.32.18.29.23.22.20.22.21.20.23.30.25.22.19.19.26.68.29.20.30.52.29.12,18.24.17.24.15.27.26.35.27.43.23.24.33.15.63.10.18.28.51.9.45.34.16.33,36.23.31.24.31.40.25.35.57.18.40.15.25.20.20.31.13.31.30.48.25,22.23.18.22,28.36.21.22.12.21.17.22.27.27.15.25.23.52.35.23.58.30.24.42.15.23.29.22.44.25.12.25.11.31.13,27.32.39.12.25.23.29.18.13.19.27.31.39.33.37.23.29.33.43.26.22.51.39.25,53.46.28.34.18.38.51.66.28.29.43.33.34.31.34.34.24.46.21.43.29.53,18.25.27.44.27.33.20.29.37.36.21.21.25.29.38.20.41.37.37.21.26.20.37.20.30,54.55.24.43.26.81.40.40.44.14.47.40.14.17.29.43.27.17.19.8.30.19.32.31.31.32.34.21.30,17.18.17.22.14.42.22.18.31.19.23.16.22.15.19.14.19.34.11.37.20.12.21.27.28.23.9.27.36.27.21.33.25.33.27.23,11.70.13.24.17.22.28.36.15.44,11.20.32.23.19.19.73.18.38.39.36.47.31,22.23.15.17.14.14.10.17.32.3,22.13.26.21.27.30.21.22.35.22.20.25.28.22.35.22.16.21.29.29.34.30.17.25.6.14.23.28.25.31.40.22.33.37.16.33.24.41.30.24.34.17,6.12.8.8.12.10.17.9.20.18.7.8.6.7.5.11.15.50.14.9.13.31.6.10.22.12.14.9.11.12.24.11.22.22.28.12.40.22.13.17.13.11.5.26.17.11.9.14.20.23.19.9.6.7.23.13.11.11.17.12.8.12.11.10.13.20.7.35.36.5.24.20.28.23.10.12.20.72.13.19.16.8.18.12.13.17.7.18.52.17.16.15.5.23.11.13.12.9.9.5.8.28.22.35.45.48.43.13.31.7.10.10.9.8.18.19.2.29.176.7.8.9.4.8.5.6.5.6.8.8.3.18.3.3.21.26.9.8.24.13.10.7.12.15.21.10.20.14.9.6,33.22.35.27.23.35.27.36.18.32.31.28.25.35.33.33.28.24.29.30.31.29.35.34.28.28.27.28.27.33.31,18.26.22.16.20.12.29.17.18.20.10.14,17.17.11.16.16.13.13.14,31.22.26.6.30.13.25.22.21.34.16.6.22.32.9.14.14.7.25.6.17.25.18.23.12.21.13.29.24.33.9.20.24.17.10.22.38.22.8.31.29.25.28.28.25.13.15.22.26.11.23.15.12.17.13.12.21.14.21.22.11.12.19.12.25.24,19.37.25.31.31.30.34.22.26.25.23.17.27.22.21.21.27.23.15.18.14.30.40.10.38.24.22.17.32.24.40.44.26.22.19.32.21.28.18.16.18.22.13.30.5.28.7.47.39.46.64.34,22.22.66.22.22,28.10.27.17.17.14.27.18.11.22.25.28.23.23.8.63.24.32.14.49.32.31.49.27.17.21.36.26.21.26.18.32.33.31.15.38.28.23.29.49.26.20.27.31.25.24.23.35,21.49.30.37.31.28.28.27.27.21.45.13,11.23.5.19.15.11.16.14.17.15.12.14.16.9,20.32.21,15.16.15.13.27.14.17.14.15,21,17.10.10.11,16.13.12.13.15.16.20,15.13.19,17.20.19,18.15.20,15.23,21.13.10.14.11.15.14.23.17.12.17.14.9.21,14.17.18.6,25.23.17.25.48.34.29.34.38.42.30.50.58.36.39.28.27.35.30.34.46.46.39.51.46.75.66.20,45.28.35.41.43.56.37.38.50.52.33.44.37.72.47.20,80.52.38.44.39.49.50.56.62.42.54.59.35.35.32.31.37.43.48.47.38.71.56.53,51.25.36.54.47.71.53.59.41.42.57.50.38.31.27.33.26.40.42.31.25,26.47.26.37.42.15.60.40.43.48.30.25.52.28.41.40.34.28.41.38.40.30.35.27.27.32.44.31,32.29.31.25.21.23.25.39.33.21.36.21.14.23.33.27,31.16.23.21.13.20.40.13.27.33.34.31.13.40.58.24,24.17.18.18.21.18.16.24.15.18.33.21.14,24.21.29.31.26.18,23.22.21.32.33.24,30.30.21.23,29.23.25.18,10.20.13.18.28,12.17.18,20.15.16.16.25.21,18.26.17.22,16.15.15,25,14.18.19.16.14.20.28.13.28.39.40.29.25,27.26.18.17.20,25.25.22.19.14,21.22.18,10.29.24.21.21,13,14,25,20.29.22.11.14.17.17.13.21.11.19.17.18.20.8.21.18.24.21.15.27.21", "valera": "31.25.24.26.32.22.24.22.29.32.32.20.18.24.21.16.27.33.38.18.34.24.20.67.34.35.46.22.35.43.55.32.20.31.29.43.36.30.23.23.57.38.34.34.28.34.31.22.33.26,22.25.22.31.23.30.25.32.35.29.10.51.22.31.27.36.16.27.25.26.36.31.33.18.40.37.21.43.46.38.18.35.23.35.35.38.29.31.43.38,17.16.17.35.19.30.38.36.24.20.47.8.59.57.33.34.16.30.37.27.24.33.44.23.55.46.34,54.34.51.49.31.27.89.26.23.36.35.15.33.45.41.50.13.32.22.29.35.41.30.25.18.65.23.31.39.16.54.42.56.29.34.13,46.37.29.49.33.25.26.20.29.22.32.32.18.29.23.22.20.22.21.20.23.30.25.22.19.19.26.68.29.20.30.52.29.12,18.24.17.24.15.27.26.35.27.43.23.24.33.15.63.10.18.28.51.9.45.34.16.33,36.23.31.24.31.40.25.35.57.18.40.15.25.20.20.31.13.31.30.48.25,22.23.18.22,28.36.21.22.12.21.17.22.27.27.15.25.23.52.35.23.58.30.24.42.15.23.28.22.44.25.12.25.11.31.13,27.32.39.12.25.23.29.18.13.19.27.31.39.33.37.23.29.33.43.25.22.51.39.25,53.46.28.34.18.38.51.66.28.29.43.33.34.31.34.34.24.46.21.43.29.53,18.25.27.44.27.33.20.29.37.36.21.21.25.29.38.20.41.37.37.21.26.20.37.20.30,54.55.24.43.26.81.40.40.44.14.47.40.14.17.29.43.27.17.19.8.30.19.32.31.31.32.34.21.30,17.18.17.22.14.42.22.18.31.19.23.16.22.15.19.14.19.34.11.37.20.12.21.27.28.23.9.27.36.27.21.33.24.33.27.23,11.70.13.24.17.22.28.36.15.44,11.20.32.23.19.19.73.18.38.39.36.47.31,22.23.15.17.14.14.10.17.32.3,22.13.26.21.27.30.21.22.35.22.20.25.28.22.35.22.16.21.29.29.34.30.17.25.6.14.23.28.25.31.40.22.33.37.15.33.24.38.30.19.34.17,6.12.8.8.12.10.17.9.20.18.7.8.6.7.5.11.15.50.14.9.13.31.6.10.22.12.14.9.11.12.24.11.22.22.28.12.40.22.13.17.13.11.5.26.17.11.9.14.20.23.19.9.6.7.23.13.11.11.17.12.8.12.11.10.13.20.7.35.36.5.24.20.28.23.10.12.20.72.13.19.16.8.18.12.13.17.7.18.52.17.16.15.5.23.11.13.12.9.9.5.8.28.22.35.45.48.43.13.31.7.10.10.9.8.18.19.2.29.176.7.8.9.4.8.5.6.5.6.8.8.3.18.3.3.21.26.9.8.24.13.10.7.12.15.21.10.20.14.9.6,33.22.35.27.23.35.27.36.18.32.31.28.25.35.33.33.28.24.29.30.31.29.35.34.28.28.27.28.27.33.31,18.26.22.16.20.12.29.17.18.20.10.14,17.17.11.16.16.13.13.14,31.22.26.6.30.13.25.22.21.34.16.6.22.32.9.14.14.7.25.6.17.25.18.23.12.21.13.29.24.33.9.20.24.17.10.22.38.22.8.31.29.25.28.28.25.13.15.22.26.11.23.15.12.17.13.12.21.14.21.22.11.12.19.12.25.24,19.37.25.31.31.30.34.22.26.25.23.17.27.22.21.21.27.23.15.18.14.30.40.10.38.24.22.17.32.24.40.44.26.22.19.32.21.28.18.16.18.22.13.30.5.28.7.47.39.46.64.34,22.22.66.22.22,28.10.27.17.17.14.27.18.11.22.25.28.23.23.8.63.24.32.14.49.32.31.49.27.17.21.36.26.21.26.18.32.33.31.15.38.28.23.29.49.26.20.27.31.25.24.23.35,21.49.30.37.31.28.28.27.27.21.45.13,11.23.5.19.15.11.16.14.17.15.11.14.16.9,20.32.21,15.16.15.13.27.14.17.14.15,21,16.10.10.11,16.13.12.13.15.16.20,15.13.19,17.20.19,18.15.20,15.23,21.13.10.14.11.15.14.23.17.12.17.14.9.21,14.17.18.6,25.23.17.25.48.34.29.34.38.42.30.50.58.36.39.28.27.35.30.34.46.46.39.51.46.75.66.20,45.28.35.41.43.56.37.38.50.52.33.44.37.72.47.20,80.52.38.44.39.49.50.56.62.42.54.59.35.35.32.31.37.43.48.47.38.71.56.53,51.25.36.54.47.71.53.59.41.42.57.50.38.31.27.33.26.40.42.31.25,26.47.26.37.42.15.60.40.43.48.30.25.52.28.41.40.34.28.40.38.40.30.35.27.27.32.44.31,32.29.31.25.21.23.25.39.33.21.36.21.14.23.33.27,31.16.23.21.13.20.40.13.27.33.34.31.13.40.58.24,24.17.18.18.21.18.16.24.15.18.33.21.13,24.21.29.31.26.18,23.22.21.32.33.24,30.30.21.23,29.23.25.18,10.20.13.18.28,12.17.18,20.15.16.16.25.21,18.26.17.22,16.15.15,25,14.18.19.16.14.20.28.13.28.39.40.29.25,27.26.18.17.20,25.25.22.19.14,21.22.18,10.29.24.21.21,13,14,25,20.29.22.11.14.17.17.13.21.11.19.17.18.20.8.21.18.24.21.15.27.21"};
const verseCount = (b, c) => { const tr = BIBLE_TR[lang()] || 'kjv'; const row = (VERSE_COUNTS[tr] || VERSE_COUNTS.kjv).split(',')[b - 1]; return +(row?.split('.')[c - 1] || 0); };
async function fetchChapter(b, c) {
  const tr = BIBLE_TR[lang()] || 'kjv', key = `${tr}/${b}/${c}`;
  if (chapterMem[key]) return chapterMem[key];
  const book = await fetchBook(tr, b);
  const tidy = x => String(x).replace(/^([A-ZÁÉÍÓÚÑ])([A-ZÁÉÍÓÚÑ]+)\b/, (m, f, r) => f + r.toLowerCase()); // RV 1909 opens chapters in capitals
  if (book && Array.isArray(book[c - 1]) && book[c - 1].length) return (chapterMem[key] = book[c - 1].map(([v, text]) => ({ v: +v, text: tidy(text) })));
  try {
    const r = await fetch(`https://api.getbible.net/v2/${key}.json`);
    if (r.ok) {
      const verses = ((await r.json()).verses || []).map(x => ({ v: +x.verse, text: String(x.text || '').replace(/\s+/g, ' ').trim() })).filter(x => x.v && x.text);
      if (verses.length) return (chapterMem[key] = verses);
    }
  } catch { /* offline */ }
  throw new Error('bible_unavailable');
}
const nextChapter = (b, c) => c < BOOKS[b - 1][4] ? [b, c + 1] : b < 66 ? [b + 1, 1] : null;
const readKey = (b, c) => `${b}:${c}`;
const verseKey = (b, c, v) => `${b}:${c}:${v}`;
// Like / save / share a verse while reading. Saved verses keep their text so "Saved" shows them without loading the book.
function verseFromKey(k) {
  const [b, c, v] = k.split(':').map(Number);
  const text = $(`#v-${b}-${c}-${v} .vs-text`)?.textContent || data.savedVerses.find(s => s.key === k)?.text || '';
  return { key: k, b, c, v, text, tr: VERSE_TR[lang()] || VERSE_TR.en };
}
function verseLink(x) {
  const payload = { t: x.text, n: refText({ b: x.b, c: x.c, v: x.v, v2: x.v }) + ' · ' + x.tr, k: 'verse', d: today(), l: lang() };
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(payload)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${LEGAL_BASE}/t/#${b64}`;
}

// Reader: one continuous page. It loads the next chapter as you scroll, remembers where you stopped,
// and counts chapters you scrolled through toward the read-through (통독).
let readerEl = null, readerObs = null;
function openReader(opts = {}) {
  data.reading = data.reading || { b: 1, c: 1 }; data.readDone = data.readDone || [];
  data.verseLikes = data.verseLikes || []; data.savedVerses = data.savedVerses || [];
  const start = opts.b ? opts : { b: data.reading.b, c: data.reading.c, v: data.reading.v || 1 };
  // Today's passage from a group: only those verses, one card at a time, turned sideways.
  const passage = !!(opts.group && opts.b && opts.v);
  state.reader = { ...start, group: opts.group || null, loaded: [], passage };
  state.readSpan = { b: start.b, c: start.c, v: start.v || 1 };   // where this reading started (for "note what I just read")
  if (!readerEl) { readerEl = document.createElement('div'); readerEl.className = 'reader'; readerEl.id = 'reader'; sheet.parentElement.appendChild(readerEl); }
  readerEl.innerHTML = `<header class="reader-top">
      <button class="reader-x" data-action="reader-close" aria-label="${t('aria.close')}">${icon('x')}</button>
      <span class="reader-gap"></span>
      <span class="reader-tr"><button class="size-btn" data-action="size-cycle" aria-label="${esc(t('size.btn'))}">가<small>±</small></button>${esc(VERSE_TR[lang()] || VERSE_TR.en)}</span></header>
    <div class="reader-scroll${passage ? ' passage' : ''}" id="reader-scroll"><div class="reader-more" id="reader-more">${t('rd.loading')}</div></div>
    ${opts.group ? `<footer class="reader-foot"><button class="primary block" data-action="devo-share" data-id="${esc(opts.group)}">${icon('pencil')}${t('devo.share')}</button></footer>` : ''}`;
  readerEl.hidden = false; document.body.classList.add('reading');
  data.settings.readerOpened = true;
  if (!data.settings.swipedBack && !passage && !BIBLE_MODE) readerEl.insertAdjacentHTML('beforeend', backHint('right', t('hint.swipeBack'))); // until it's been used once
  readerObs?.disconnect();
  readerObs = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) loadNextChapter(); }, { root: $('#reader-scroll'), rootMargin: '600px' });
  if (passage) {
    loadChapter(start.b, start.c, true);
    $('#reader-scroll').addEventListener('scroll', passageCount, { passive: true });
    return;
  }
  loadChapter(start.b, start.c, true).then(() => readerObs.observe($('#reader-more')));
  $('#reader-scroll').addEventListener('scroll', trackReading, { passive: true });
}
async function loadChapter(b, c, first) {
  const r = state.reader; if (!r) return;
  const more = $('#reader-more');
  let verses;
  try { verses = await fetchChapter(b, c); }
  catch { if (more) more.innerHTML = `${t('rd.offline')}<button class="link-btn" data-action="reader-retry">${t('rd.retry')}</button>`; return false; }
  if (!state.reader || r !== state.reader) return;
  if (r.passage) verses = verses.filter(x => r.c2 > r.c ? (c === r.c ? x.v >= r.v : x.v <= r.e2) : x.v >= r.v && x.v <= (r.v2 || r.v));
  r.loaded.push([b, c]); r.last = [b, c];
  const hl = x => first && r.v && x.v >= r.v && x.v <= (r.v2 || r.v);
  const last = verses[verses.length - 1].v;
  // One verse per page; swipe up for the next one (same feel as the thanks feed).
  const readOn = data.readLog?.[readKey(b, c)];
  const pages = verses.map(x => { const k = verseKey(b, c, x.v), liked = data.verseLikes.includes(k), saved = data.savedVerses.some(s => s.key === k);
    return `<article class="vs-page${hl(x) ? ' hl' : ''}" id="v-${b}-${c}-${x.v}" data-b="${b}" data-c="${c}" data-v="${x.v}" data-last="${last}">
    <div class="vs-body"><p class="vs-text">${esc(x.text)}</p><p class="vs-ref"><button class="vs-ref-btn" data-action="reader-pick">${esc(refText({ b, c, v: x.v, v2: x.v }))}</button>${hl(x) && r.group ? ` · ${t('devo.kicker')}` : ''}${readOn ? `<span class="vs-read">${esc(shortDate(readOn))}</span>` : ''}</p>
      ${(() => { const n = notesAt(b, c, x.v)[0]; return n ? `<button class="vs-note" data-action="note" data-id="${esc(n.id)}">${icon('pencil')}<span>${t('note.mine')} · ${esc(refText(n.ref))}</span></button>` : ''; })()}</div>
    <aside class="post-rail vs-rail">
      <button class="rail-btn ${liked ? 'liked' : ''}" data-action="verse-like" data-id="${k}" aria-pressed="${liked}" aria-label="${t('act.like')}">${icon('heart')}</button>
      <button class="rail-btn ${saved ? 'saved' : ''}" data-action="verse-save" data-id="${k}" aria-pressed="${saved}" aria-label="${t('save')}">${icon('bookmark')}</button>
      <button class="rail-btn" data-action="verse-send" data-id="${k}">${icon('share')}<span class="rl">${t('act.share')}</span></button>
      <button class="rail-btn" data-action="verse-note" data-id="${k}">${icon('pencil')}<span class="rl">${t('act.note')}</span></button>
    </aside></article>`; }).join('');
  const sc = $('#reader-scroll');
  if (r.passage) {
    if (first) { more.remove(); sc.innerHTML = pages; sc.scrollLeft = 0; } else sc.insertAdjacentHTML('beforeend', pages);
    passageCount();
    if (r.c2 > c) await loadChapter(b, c + 1, false);
    return true;
  }
  const onLoadingPage = sc && sc.scrollTop >= more.offsetTop - 2; // waiting on the "loading" page
  more.insertAdjacentHTML('beforebegin', pages);
  // Scroll snapping would otherwise stay glued to the "loading" page and jump past the new verses.
  const target = first ? ($(`#v-${b}-${c}-${r.v || 1}`) || $(`#v-${b}-${c}-1`)) : onLoadingPage ? $(`#v-${b}-${c}-1`) : null;
  if (target && sc) { sc.scrollTop = target.offsetTop; requestAnimationFrame(() => { sc.scrollTop = target.offsetTop; trackReading(); }); }
  more.textContent = nextChapter(b, c) ? t('rd.loading') : t('rd.end');
  return true;
}
function loadNextChapter() {
  const r = state.reader; if (!r || r.busy || !r.last) return;
  const n = nextChapter(...r.last); if (!n) return;
  r.busy = true; loadChapter(n[0], n[1]).finally(() => { r.busy = false; });
}
let readSaveTimer;
function trackReading() {
  const sc = $('#reader-scroll'); if (!sc) return;
  const pages = sc.querySelectorAll('.vs-page');
  const cur = pages[Math.round(sc.scrollTop / Math.max(1, sc.clientHeight))]; if (!cur) return;
  const b = +cur.dataset.b, c = +cur.dataset.c, v = +cur.dataset.v;
  data.reading = { b, c, v };
  data.reading.at = new Date().toISOString();
  data.readMax = data.readMax || {}; if ((data.readMax[readKey(b, c)] || 0) < v) data.readMax[readKey(b, c)] = v;
  const now = Date.now(); if (state.readTick && now - state.readTick < 60000) { data.readTime = data.readTime || {}; data.readTime[today()] = (data.readTime[today()] || 0) + (now - state.readTick) / 1000; } state.readTick = now;
  if (v === +cur.dataset.last) { // reached the chapter's last verse: count it and remember the day
    if (!data.readDone.includes(readKey(b, c))) data.readDone.push(readKey(b, c));
    data.readLog = data.readLog || {}; data.readLog[readKey(b, c)] = today(); if (!data.rtStart) data.rtStart = today();
    data.challenges.filter(ch => ch.type === 'bible' && ch.lastDay !== today() && ch.days.length < chLen(ch)).forEach(ch => {
      const d = chPlanDay(ch, ch.days.length); // with a plan: the day counts when today's last chapter is read
      if (d && chIndex(b, c) < chIndex(...d.end)) return;
      ch.days.push(ch.days.length + 1); ch.lastDay = today();
      if (ch.days.length >= chLen(ch)) setTimeout(() => chFinish(ch.id), 600); else setTimeout(() => celebrateDay(ch), 300);
    });
    if (!readThroughDone()) bookMilestone(b, c);
  }
  clearTimeout(readSaveTimer); readSaveTimer = setTimeout(save, 600);
}
function passageCount() {
  const sc = $('#reader-scroll'), gap = $('.reader-gap'); if (!sc || !gap) return;
  const pages = sc.querySelectorAll('.vs-page'), i = Math.min(pages.length - 1, Math.round(sc.scrollLeft / Math.max(1, sc.clientWidth)));
  gap.innerHTML = pages.length > 1 ? `<span class="pg-count">${i + 1} / ${pages.length}</span>` : '';
}
// Leaving a group's full-screen view (back to the 공동체 tab) or the prayer lane (back to where you were).
function immBack() {
  if (!state.immersive) return false;
  if (history.state?.dt === 'imm') { try { history.replaceState(null, ''); } catch {} }
  if (state.immFeed === 'prayer') { data.settings.prayerBackHint = true; state.immFeed = state.prevFeed || 'public'; state.showOthers = false; save(); render(0); return true; }
  if (state.immFeed === 'group') { toggleFullscreen(); return true; }
  return false;
}
// Phone / browser back gesture: reader first, then a group or the prayer lane.
window.addEventListener('popstate', () => { if (!closePicker() && !closeReader() && !immBack() && state.groupDetail && !state.immersive) { state.groupDetail = null; render(); } });
function closeReader() {
  if (!readerEl || readerEl.hidden) return false;
  setTimeout(gestureHint, 300);
  readerObs?.disconnect(); readerEl.hidden = true; readerEl.innerHTML = ''; state.reader = null;
  document.body.classList.remove('reading'); save(); return true;
}
const shortDate = iso => { const d = new Date(iso + 'T00:00:00'); return lang() === 'ko' ? `${d.getMonth() + 1}.${d.getDate()}` : d.toLocaleDateString(lang(), { month: 'short', day: 'numeric' }); };
function readerPicker() {
  const done = (data.readDone || []).length, cur = data.reading || { b: 1, c: 1 };
  const testament = (from, to) => BOOKS.slice(from, to).map((x, i) => `<button class="chip book-chip ${cur.b === from + i + 1 ? 'active' : ''}" data-action="reader-book" data-id="${from + i + 1}">${esc(bookName(from + i + 1))}</button>`).join('');
  showSheet({ title: t('rd.pick'), body: `<p class="hint">${t('rd.progress').replace('{n}', done).replace('{total}', TOTAL_CHAPTERS)}</p>
    <div class="rd-bar"><span style="width:${Math.min(100, done / TOTAL_CHAPTERS * 100).toFixed(1)}%"></span></div>
    <p class="field-label">${t('rd.ot')}</p><div class="chips books">${testament(0, 39)}</div>
    <p class="field-label">${t('rd.nt')}</p><div class="chips books">${testament(39, 66)}</div>` });
}
/* ---------------- Bible picker: books (by section) | chapters | verses, like a printed table of contents ----------------
   Opens over whatever is on screen (so a half-written reflection stays). Tap a verse, then a later one for a range. */
const BOOK_SECTIONS = [['law', 1, 5], ['hist', 6, 17], ['poet', 18, 22], ['major', 23, 27], ['minor', 28, 39], ['gosp', 40, 43], ['acts', 44, 44], ['paul', 45, 57], ['gen', 58, 65], ['proph', 66, 66]];
let bpEl = null;
function biblePicker(opts = {}) {
  const cur = opts.start || data.reading || { b: 1, c: 1 };
  state.bp = { mode: opts.mode || 'reader', gid: opts.gid || null, b: cur.b || 1, c: cur.c || 0, v: 0, v2: 0 };
  if (!bpEl) { bpEl = document.createElement('div'); bpEl.className = 'bpick'; bpEl.id = 'bpick'; document.body.appendChild(bpEl); }
  bpEl.hidden = false;
  bpEl.innerHTML = `<header class="bp-top"><span class="bp-title">${t('bp.title')}</span><button class="close" data-action="bp-close" aria-label="${t('aria.close')}">${icon('x')}</button></header>
    ${state.bp.mode === 'reader' ? readStatsRow() : ''}
    <div class="bp-cols"><div class="bp-col bp-books">${BOOK_SECTIONS.map(([k, a, z]) => `<p class="bp-sec">${t('bp.' + k)}</p>${Array.from({ length: z - a + 1 }, (_, i) => a + i).map(b =>
      `<button class="bp-book" data-action="bp-book" data-id="${b}" id="bp-b-${b}"><span>${esc(bookName(b))}${tick(bookRead(b))}</span>${lang() === 'ko' ? `<small>${esc(BOOKS[b - 1][2])}</small>` : ''}</button>`).join('')}`).join('')}</div>
      <div class="bp-col bp-chs" id="bp-chs"></div><div class="bp-col bp-vs" id="bp-vs"></div></div>
    <footer class="bp-foot"><span class="bp-sel" id="bp-sel"></span><button class="primary" data-action="bp-ok" id="bp-ok">${t('bp.ok')}</button></footer>`;
  bpBook(state.bp.b, true);
  if (state.bp.c) bpChapter(state.bp.c, true).then(() => { if (opts.start?.v && state.bp?.mode !== 'reader') bpVerse(opts.start.v); });
  if (state.bp.mode === 'note') { const tt = bpEl.querySelector('.bp-title'); if (tt) tt.textContent = t('note.pickRange'); }
}
function readStats() {
  const log = Object.values(data.readLog || {}), rt = data.readTime || {};
  const todayN = log.filter(d => d === today()).length, week = log.filter(d => d >= daysAgo(6)).length;
  const mins = d => Math.round((rt[d] || 0) / 60), todayMin = mins(today()), weekMin = Math.round(Object.entries(rt).filter(([d]) => d >= daysAgo(6)).reduce((n, [, s]) => n + s, 0) / 60);
  const recent = log.filter(d => d >= daysAgo(13)), activeDays = new Set(recent).size, avg = activeDays ? recent.length / 14 : 0;
  const left = TOTAL_CHAPTERS - (data.readDone || []).length; let eta = '';
  if (avg > 0 && left > 0) { const d = new Date(); d.setDate(d.getDate() + Math.ceil(left / avg)); eta = lang() === 'ko' ? `${d.getFullYear()}년 ${d.getMonth() + 1}월` : d.toLocaleDateString(lang(), { year: 'numeric', month: 'long' }); }
  return { todayN, todayMin, week, weekMin, avg: Math.round(avg * 10) / 10, eta };
}
function readStatsRow() {
  const r = readStats(); if (!r.week && !r.todayMin) return '';
  const bits = [t('rs.today').replace('{n}', r.todayN) + (r.todayMin ? ' · ' + t('rs.min').replace('{n}', r.todayMin) : ''), t('rs.week').replace('{n}', r.week), ...(r.avg ? [t('rs.avg').replace('{n}', r.avg)] : [])];
  return `<div class="rs"><p class="rs-row">${bits.map(x => `<span>${esc(x)}</span>`).join('')}</p>${r.eta ? `<p class="rs-eta">${esc(t('rs.eta').replace('{d}', r.eta))}</p>` : ''}</div>`;
}
// 통독 progress as a small dial: overall %, chapters read, and Old / New Testament bars.
// Whole Bible read (all 1189 chapters): keep the round (when it started, when it ended), then start the next round from 0.
function readThroughDone() {
  if ((data.readDone || []).length < TOTAL_CHAPTERS) return false;
  data.readThroughs = data.readThroughs || [];
  const start = data.rtStart || Object.values(data.readLog || {}).sort()[0] || today(), end = today();
  data.readThroughs.push({ start, end, days: Math.round((new Date(end) - new Date(start)) / 864e5) + 1 });
  data.readDone = []; data.booksDone = {}; data.rtStart = null; save();
  setTimeout(() => { confetti(); celebrateDay(null, t('rt.cel').replace('{n}', data.readThroughs.length)); }, 400);
  return true;
}
const dotDate = d => String(d || '').replace(/-/g, '.');
function readHistory() {
  const rts = data.readThroughs || [], k = rts.length + 1, n = (data.readDone || []).length;
  const byDay = {}; Object.entries(data.readLog || {}).forEach(([key, d]) => (byDay[d] = byDay[d] || []).push(key.split(':').map(Number)));
  const days = Object.keys(byDay).sort().reverse().slice(0, 30);
  const runs = list => { list.sort((a, b) => chIndex(...a) - chIndex(...b)); const out = []; list.forEach(([b, c]) => { const r = out[out.length - 1]; if (r && r.b === b && r.c2 === c - 1) r.c2 = c; else out.push({ b, c, c2: c }); });
    return out.map(r => `${bookName(r.b)} ${r.c}${r.c2 > r.c ? '–' + r.c2 : ''}`).join(', '); };
  showSheet({ title: t('rt.title'), body: `
    <section class="rt-sec"><p class="gd-label">${t('rt.now')}</p><p class="rt-now">${n || data.rtStart ? esc(t('rt.nowLine').replace('{k}', k).replace('{d}', dotDate(data.rtStart || today())).replace('{n}', n).replace('{t}', TOTAL_CHAPTERS)) : t('rt.notYet')}</p></section>
    <section class="rt-sec"><p class="gd-label">${t('rt.past')}</p>${rts.length ? `<ul class="rt-list">${rts.map((r, i) => `<li><b>${esc(t('rt.item').replace('{k}', i + 1))}</b><span>${dotDate(r.start)} – ${dotDate(r.end)}</span><small>${esc(t('rt.days').replace('{n}', r.days))}</small></li>`).reverse().join('')}</ul>` : `<p class="hint">${t('rt.none')}</p>`}</section>
    <section class="rt-sec"><p class="gd-label">${t('rt.recent')}</p>${days.length ? `<ul class="rt-log">${days.map(d => `<li><span class="rt-d">${esc(dayLabel(d))}</span><span class="rt-chs">${esc(runs(byDay[d]))}</span><small>${esc(t('rt.chs').replace('{n}', byDay[d].length))}</small></li>`).join('')}</ul>` : `<p class="hint">${t('rt.empty')}</p>`}</section>` });
}
function readGauge() {
  const done = data.readDone || [], n = done.length, pct = n / TOTAL_CHAPTERS;
  const ot = done.filter(k => +k.split(':')[0] <= 39).length, nt = n - ot;
  const R = 44, L = Math.PI * R, arc = `M ${56 - R} 56 A ${R} ${R} 0 0 1 ${56 + R} 56`;
  const rts = (data.readThroughs || []).length;
  return `<button type="button" class="rg" data-action="rt-history" aria-label="${esc(t('rt.title'))}">
    <svg class="rg-dial" viewBox="0 0 112 62" aria-hidden="true"><path d="${arc}" class="rg-track"/><path d="${arc}" class="rg-fill" style="stroke-dasharray:${(L * pct).toFixed(1)} ${L.toFixed(1)}"/>
      <text x="56" y="52" class="rg-pct">${pct > 0 && pct < .01 ? '<1' : Math.round(pct * 100)}%</text></svg>
    <div class="rg-side"><p class="rg-n">${t('rd.progress').replace('{n}', n).replace('{total}', TOTAL_CHAPTERS)}</p>
      <p class="rg-row"><span>${t('rd.ot')}</span><i><b style="width:${(ot / 929 * 100).toFixed(1)}%"></b></i><small>${ot}/929</small></p>
      <p class="rg-row"><span>${t('rd.nt')}</span><i><b style="width:${(nt / 260 * 100).toFixed(1)}%"></b></i><small>${nt}/260</small></p>
      ${rts || data.rtStart ? `<p class="rg-rt">${[rts ? t('rt.done').replace('{n}', rts) : '', rts ? t('rt.round').replace('{k}', rts + 1) : '', data.rtStart ? t('rt.since').replace('{d}', shortDate(data.rtStart)) : ''].filter(Boolean).map(esc).join(' · ')}${icon('chevron')}</p>` : `<p class="rg-rt">${esc(t('rt.title'))}${icon('chevron')}</p>`}</div>
  </button>`;
}
const covers = (r, b, c, v) => !!r && r.b === b && (r.c2 > r.c ? (c > r.c && c < r.c2) || (c === r.c && v >= (r.v || 1)) || (c === r.c2 && v <= r.e2) : c === r.c && (!r.v || (v >= r.v && v <= (r.v2 || r.v))));
const notesAt = (b, c, v) => data.posts.filter(p => p.mine && p.kind === 'meditation' && covers(p.ref, b, c, v));
const chRead = (b, c) => (data.readDone || []).includes(readKey(b, c));
const verseRead = (b, c, v) => chRead(b, c) || (data.readMax?.[readKey(b, c)] || 0) >= v;
const bookRead = b => Array.from({ length: BOOKS[b - 1][4] }, (_, i) => i + 1).every(c => chRead(b, c));
const tick = on => on ? `<i class="bp-tick" aria-label="✓">${icon('check')}</i>` : '';
function bpBook(b, first) {
  const r = state.bp; r.b = b; if (!first) { r.c = 0; } r.v = r.v2 = 0;
  bpEl.querySelectorAll('.bp-book').forEach(x => x.classList.toggle('on', +x.dataset.id === b));
  const n = BOOKS[b - 1][4];
  $('#bp-chs').innerHTML = Array.from({ length: n }, (_, i) => `<button class="bp-ch" data-action="bp-ch" data-id="${i + 1}">${tick(chRead(b, i + 1))}${t('bp.ch').replace('{n}', i + 1)}</button>`).join('');
  $('#bp-vs').innerHTML = '';
  if (first) requestAnimationFrame(() => $(`#bp-b-${b}`)?.scrollIntoView({ block: 'center' }));
  bpSel();
}
async function bpChapter(c, first) {
  const r = state.bp; r.c = c; r.v = r.v2 = 0;
  const btns = [...bpEl.querySelectorAll('.bp-ch')]; btns.forEach(x => x.classList.toggle('on', +x.dataset.id === c));
  if (first) requestAnimationFrame(() => btns[c - 1]?.scrollIntoView({ block: 'center' }));
  const vs = $('#bp-vs'); vs.innerHTML = `<p class="bp-load">${t('rd.loading')}</p>`; bpSel();
  let n = verseCount(r.b, c);
  if (!n) { try { n = (await fetchChapter(r.b, c)).slice(-1)[0].v; } catch { vs.innerHTML = `<p class="bp-load">${t('rd.offline')}</p>`; return; } }
  if (state.bp !== r || r.c !== c) return;
  vs.innerHTML = Array.from({ length: n }, (_, i) => `<button class="bp-v" data-action="bp-v" data-id="${i + 1}">${notesAt(r.b, c, i + 1).length ? `<i class="bp-note">${icon('pencil')}</i>` : ''}${tick(verseRead(r.b, c, i + 1))}${t('bp.v').replace('{n}', i + 1)}</button>`).join('') + (r.mode === 'reader' ? '' : `<p class="bp-hint">${t('bp.hintV')}</p>`);
}
function bpVerse(v) {
  const r = state.bp;
  if (r.mode === 'reader') { r.v = v; r.v2 = 0; bpDone(); return; }
  if (r.v && !r.v2 && v > r.v) r.v2 = v; else { r.v = v; r.v2 = 0; }
  bpEl.querySelectorAll('.bp-v').forEach(x => { const n = +x.dataset.id; x.classList.toggle('on', n === r.v || (r.v2 && n >= r.v && n <= r.v2)); });
  bpSel();
}
function bpSel() {
  const r = state.bp, el = $('#bp-sel'); if (!el) return;
  el.textContent = r.c ? refText({ b: r.b, c: r.c, v: r.v || 0, v2: r.v2 || 0 }) : bookName(r.b);
  $('#bp-ok').disabled = !r.c || ((r.mode === 'med' || r.mode === 'devo' || r.mode === 'note' || r.mode === 'sermonref' || r.mode === 'sermonref2' || r.mode === 'meetref') && !r.v);
}
function closePicker() { if (!bpEl || bpEl.hidden) return false; bpEl.hidden = true; bpEl.innerHTML = ''; return true; }
function bpDone() {
  const r = state.bp; if (!r?.c) return;
  const ref = { b: r.b, c: r.c, v: r.v || 0, v2: r.v2 || r.v || 0 };
  closePicker();
  if (r.mode === 'reader') { close(); openReader({ b: ref.b, c: ref.c, v: ref.v || 1, group: state.reader?.group }); return; }
  if (r.mode === 'chfrom' || r.mode === 'chto') {
    const v = [ref.b, ref.c]; if (r.mode === 'chfrom') state.chFrom = v; else state.chTo = v;
    const f = state.chFrom || [1, 1], tt = state.chTo || [1, 50];
    if (chIndex(...f) > chIndex(...tt)) { if (r.mode === 'chfrom') state.chTo = [ref.b, BOOKS[ref.b - 1][4]]; else state.chFrom = [ref.b, 1]; }
    redrawCh(); return;
  }
  if (r.mode === 'meetref') { state.snRef = ref; const b = $('#sn-ref span'); if (b) b.textContent = refText(ref); $('#sn-ref')?.classList.add('set'); ['#sn-pv', '#mt-live'].forEach(s2 => { const x = $(s2); if (x) x.hidden = false; }); recPaint(true); return; }
  if (r.mode === 'sermonref') { state.snRef = ref; const b = $('#sn-ref span'); if (b) b.textContent = refText(ref); $('#sn-ref')?.classList.add('set'); const pvb = $('#sn-pv'); if (pvb) pvb.hidden = false;
    snRefsChanged(); recPaint(true); return; }
  if (r.mode === 'sermonref2') { state.snRefs = [...(state.snRefs || []), ref].slice(0, 2); snRefsChanged(); return; }
  if (r.mode === 'note') { closeReader(); state.medRef = ref; state.medSource = ''; state.medNote = true; compose('meditation', state.challenge); return; }
  if (r.mode === 'med') { state.medRef = ref; state.medSource = ''; state.medNote = true; fillMedPassage(); return; }
  if (r.mode === 'devo') { const g = data.groups.find(x => x.id === r.gid); if (!g) return; g.passages = { ...(g.passages || {}), [today()]: ref }; save(); render(); toast(refText(ref)); }
}
function chapterPicker(b) {
  showSheet({ title: esc(bookName(b)), body: `<div class="chips chapters">${Array.from({ length: BOOKS[b - 1][4] }, (_, i) => `<button class="chip ch-chip ${(data.readDone || []).includes(readKey(b, i + 1)) ? 'read' : ''}" data-action="reader-go" data-id="${b}:${i + 1}">${i + 1}${data.readLog?.[readKey(b, i + 1)] ? `<small>${esc(shortDate(data.readLog[readKey(b, i + 1)]))}</small>` : ''}</button>`).join('')}</div>` });
}

// Group passage of the day: the group's own choice, or the plan published in content.json (e.g. a QT plan used with permission).
// Passages already known when this version was built (content.json from dailyjourney.org adds every new day).
const QT_BUILTIN = { ko: {"2026-11-16": "아모스 7:10-17", "2026-11-17": "아모스 8:1-10", "2026-11-18": "아모스 8:11-9:6", "2026-11-19": "아모스 9:7-15", "2026-11-20": "고린도후서 1:1-7", "2026-11-21": "고린도후서 1:8-14", "2026-11-22": "고린도후서 1:15-24", "2026-11-23": "고린도후서 2:1-11", "2026-11-24": "고린도후서 2:12-17", "2026-11-25": "고린도후서 3:1-11", "2026-11-26": "고린도후서 3:12-18", "2026-11-27": "고린도후서 4:1-10", "2026-11-28": "고린도후서 4:11-18", "2026-11-29": "고린도후서 5:1-10", "2026-11-30": "고린도후서 5:11-21"} };
function todaysPassage(gid) {
  const g = data.groups.find(x => x.id === gid);
  const own = g?.passages?.[today()];
  if (own) return { ref: own, source: '' };
  // Daily plan from content.json, per language (Korean groups: 생명의 삶, once the publisher's permission is in place)
  const planFor = CONTENT.qtPlan?.[lang()] && typeof CONTENT.qtPlan[lang()] === 'object' ? CONTENT.qtPlan[lang()] : CONTENT.qtPlan;
  const plan = planFor?.[today()] || QT_BUILTIN[lang()]?.[today()];
  const name = (CONTENT.qtPlanName && typeof CONTENT.qtPlanName === 'object' ? CONTENT.qtPlanName[lang()] : CONTENT.qtPlanName) || { ko: '생명의 삶', en: 'Our Daily Bread', es: 'Nuestro Pan Diario' }[lang()];
  if (plan) return { ref: parseRef(plan), source: name || '' };
  const gospel = [[40, 28], [41, 16], [42, 24], [43, 21]], all = gospel.flatMap(([b, n]) => Array.from({ length: n }, (_, i) => [b, i + 1]));
  const [b, c] = all[(dayOfYear() - 1) % all.length];
  return { ref: { b, c, v: 0, v2: 0 }, source: '' };
}
function groupWeek(gid) {
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toLocaleDateString('en-CA'); });
  const posts = data.posts.filter(p => inGroup(p, gid) && days.includes(p.date) && !data.hidden.includes(p.id));
  const people = new Set(posts.map(p => p.mine ? 'me' : authorKey(p))).size;
  const count = k => posts.filter(p => k === 'thanks' ? !['meditation', 'prayer'].includes(p.kind) : p.kind === k).length;
  return { people, thanks: count('thanks'), meditation: count('meditation'), prayer: count('prayer'), days: days.map(d => posts.some(p => p.date === d)) };
}
function groupStatusCard(gid) {
  const g = data.groups.find(x => x.id === gid); if (!g) return '';
  const w = groupWeek(gid), ch = data.challenges.find(c => c.group === gid);
  const nudged = data.groupNudges?.[gid] === today();
  return `<article class="post card-page gstatus-card"><div class="card-inner">
    ${data.groups.length > 1 ? `<div class="chips gs-groups">${data.groups.map(x => `<button class="chip ${x.id === gid ? 'active' : ''}" data-action="imm-group" data-id="${esc(x.id)}">${esc(L(x.name))}</button>`).join('')}</div>`
      : `<div class="post-kind">${icon('people')}<span>${esc(L(g.name))}</span></div>`}
    <p class="gs-kicker">${t('gs.week')}</p>
    <p class="card-title">${w.people ? t('gs.people').replace('{n}', w.people) : t('gs.quiet')}</p>
    <div class="gs-days" aria-hidden="true">${w.days.map(on => `<i class="${on ? 'on' : ''}"></i>`).join('')}</div>
    <p class="gs-counts">${t('gs.counts').replace('{t}', w.thanks).replace('{m}', w.meditation).replace('{p}', w.prayer)}</p>
    ${ch ? `<p class="gs-counts">${t('ch.title')} · ${chTypeLabel(ch)} · ${t('gs.chDay').replace('{n}', Math.min(7, ch.days.length + (ch.days.length < 7 ? 1 : 0)))}</p>` : ''}
    <div class="card-actions">
      <button class="primary" data-action="group-write" data-id="${esc(gid)}">${t('gs.write')}</button>
      <button class="secondary" data-action="group-nudge" data-id="${esc(gid)}" ${nudged ? 'disabled' : ''}>${nudged ? t('gs.nudged') : t('gs.nudge')}</button>
    </div>
  </div></article>`;
}
// End of a group's posts: now it's your turn (the kind you were looking at comes first).
function groupEndCard(gid, kind) {
  const kinds = kind ? [kind, ...['thanks', 'meditation', 'prayer'].filter(k => k !== kind)] : ['thanks', 'meditation', 'prayer'];
  return `<article class="post card-page gend-card"><div class="card-inner">
    <p class="card-title">${t('gend.title')}</p><p class="card-sub">${t('gend.sub')}</p>
    <div class="gend-acts">${kinds.map((k, i) => `<button class="${i ? 'secondary' : 'primary'}" data-action="gend-write" data-id="${esc(gid)}|${k}">${icon(k === 'prayer' ? 'pray' : k === 'meditation' ? 'book' : 'pencil')}${t('gend.' + k)}</button>`).join('')}</div>
  </div><aside class="post-rail card-close"><button class="rail-btn" data-action="imm-back" aria-label="${t('fs.closeAria')}">${icon('minimize')}<span class="rl">${t('fs.close')}</span></button></aside></article>`;
}
function devoCard(gid) {
  const p = todaysPassage(gid), n = data.posts.filter(x => x.kind === 'meditation' && inGroup(x, gid) && x.date === today()).length;
  return `<article class="post card-page devo-card"><div class="card-inner">
    <div class="post-kind">${icon('book')}<span>${t('devo.kicker')}${p?.source ? ' · ' + esc(p.source) : ''}</span></div>
    ${p?.ref ? `<p class="card-title">${esc(refText(p.ref))}</p><p class="card-sub">${t('devo.sub')}${n ? ' ' + t('devo.count').replace('{n}', n) : ''}</p>
      <div class="card-actions"><button class="primary" data-action="devo-read" data-id="${esc(gid)}">${t('devo.read')}</button>
      <button class="secondary" data-action="devo-share" data-id="${esc(gid)}">${t('devo.share')}</button></div>`
    : `<p class="card-title">${t('devo.none')}</p><p class="card-sub">${t('devo.noneSub')}</p>
      <div class="card-actions"><button class="primary" data-action="devo-set" data-id="${esc(gid)}">${t('devo.set')}</button></div>`}
  </div></article>`;
}
function devoSetSheet(gid) {
  showSheet({ title: t('devo.set'), body: `<form id="devo-form" class="sheet-form">
    <input id="devo-ref" class="field" placeholder="${esc(t('devo.ph'))}" aria-label="${esc(t('devo.set'))}" required>
    <p class="hint" id="devo-msg">${t('devo.hint')}</p>
    <button class="primary block" type="submit">${t('devo.save')}</button></form>` });
  $('#devo-form').addEventListener('submit', e => {
    e.preventDefault(); const r = parseRef($('#devo-ref').value);
    if (!r) { $('#devo-msg').textContent = t('devo.bad'); return; }
    const g = data.groups.find(x => x.id === gid); if (!g) return;
    g.passages = { ...(g.passages || {}), [today()]: r }; save(); close(); render(); toast(refText(r));
  });
}
function devoShare(gid) {
  closeReader(); state.medNote = false;
  const p = todaysPassage(gid);
  state.medRef = p?.ref || null; state.medSource = p?.source || '';
  Object.assign(visOf('compose'), { mode: 'private', targets: [gid] });
  compose('meditation', state.challenge);
}

/* ---------------- a verse now and then ----------------
   Public-domain translations only: 개역한글 (ko), KJV (en), Reina-Valera 1909 (es).
   content.json "verses": { ko: [{ ref, text }], … } can replace the list without an app update. */
const VERSES = [
  { ref: {"ko": "고린도후서 9:15", "en": "2 Corinthians 9:15", "es": "2 Corintios 9:15"}, text: {"ko": "말할 수 없는 그의 은사를 인하여 하나님께 감사하노라", "en": "Thanks be unto God for his unspeakable gift.", "es": "Gracias á Dios por su don inefable."}, thanks: true },
  { ref: {"ko": "시편 9:1", "en": "Psalm 9:1", "es": "Salmos 9:1"}, text: {"ko": "내가 전심으로 여호와께 감사하오며 주의 모든 기사를 전하리이다", "en": "I will praise thee, O Lord, with my whole heart; I will shew forth all thy marvellous works.", "es": "Te alabaré, oh Jehová, con todo mi corazón; contaré todas tus maravillas."}, thanks: true },
  { ref: {"ko": "에베소서 5:20", "en": "Ephesians 5:20", "es": "Efesios 5:20"}, text: {"ko": "범사에 우리 주 예수 그리스도의 이름으로 항상 아버지 하나님께 감사하며", "en": "Giving thanks always for all things unto God and the Father in the name of our Lord Jesus Christ;", "es": "Dando gracias siempre de todo al Dios y Padre en el nombre de nuestro Señor Jesucristo:"}, thanks: true },
  { ref: {"ko": "시편 107:1", "en": "Psalm 107:1", "es": "Salmos 107:1"}, text: {"ko": "여호와께 감사하라 그는 선하시며 그 인자하심이 영원함이로다", "en": "O give thanks unto the Lord, for he is good: for his mercy endureth for ever.", "es": "Alabad á Jehová, porque es bueno; porque para siempre es su misericordia."}, thanks: true },
  { ref: {"ko": "데살로니가전서 5:16-18", "en": "1 Thessalonians 5:16-18", "es": "1 Tesalonicenses 5:16-18"}, text: {"ko": "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이는 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", "en": "Rejoice evermore. Pray without ceasing. In every thing give thanks: for this is the will of God in Christ Jesus concerning you.", "es": "Estad siempre gozosos. Orad sin cesar. Dad gracias en todo; porque esta es la voluntad de Dios para con vosotros en Cristo Jesús."}, thanks: true },
  { ref: {"ko": "시편 118:24", "en": "Psalm 118:24", "es": "Salmos 118:24"}, text: {"ko": "이 날은 여호와의 정하신 것이라 이 날에 우리가 즐거워하고 기뻐하리로다", "en": "This is the day which the Lord hath made; we will rejoice and be glad in it.", "es": "Este es el día que hizo Jehová: nos gozaremos y alegraremos en él."}, thanks: true },
  { ref: {"ko": "빌립보서 4:6", "en": "Philippians 4:6", "es": "Filipenses 4:6"}, text: {"ko": "아무 것도 염려하지 말고 오직 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", "en": "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", "es": "Por nada estéis afanosos; sino sean notorias vuestras peticiones delante de Dios en toda oración y ruego, con hacimiento de gracias."}, thanks: true },
  { ref: {"ko": "예레미야애가 3:22-23", "en": "Lamentations 3:22-23", "es": "Lamentaciones 3:22-23"}, text: {"ko": "여호와의 자비와 긍휼이 무궁하시므로 우리가 진멸되지 아니함이니이다 이것이 아침마다 새로우니 주의 성실이 크도소이다", "en": "It is of the Lord’s mercies that we are not consumed, because his compassions fail not. They are new every morning: great is thy faithfulness.", "es": "Es por la misericordia de Jehová que no somos consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad."}, thanks: true },
  { ref: {"ko": "시편 100:4", "en": "Psalm 100:4", "es": "Salmos 100:4"}, text: {"ko": "감사함으로 그 문에 들어가며 찬송함으로 그 궁정에 들어가서 그에게 감사하며 그 이름을 송축할지어다", "en": "Enter into his gates with thanksgiving, and into his courts with praise: be thankful unto him, and bless his name.", "es": "Entrad por sus puertas con reconocimiento, por sus atrios con alabanza: alabadle, bendecid su nombre."}, thanks: true },
  { ref: {"ko": "골로새서 3:15", "en": "Colossians 3:15", "es": "Colosenses 3:15"}, text: {"ko": "그리스도의 평강이 너희 마음을 주장하게 하라 평강을 위하여 너희가 한 몸으로 부르심을 받았나니 또한 너희는 감사하는 자가 되라", "en": "And let the peace of God rule in your hearts, to the which also ye are called in one body; and be ye thankful.", "es": "Y la paz de Dios gobierne en vuestros corazones, á la cual asimismo sois llamados en un cuerpo; y sed agradecidos."}, thanks: true },
  { ref: {"ko": "시편 103:2", "en": "Psalm 103:2", "es": "Salmos 103:2"}, text: {"ko": "내 영혼아 여호와를 송축하며 그 모든 은택을 잊지 말지어다", "en": "Bless the Lord, O my soul, and forget not all his benefits:", "es": "Bendice, alma mía á Jehová, y no olvides ninguno de sus beneficios."}, thanks: true },
  { ref: {"ko": "야고보서 1:17", "en": "James 1:17", "es": "Santiago 1:17"}, text: {"ko": "각양 좋은 은사와 온전한 선물이 다 위로부터 빛들의 아버지께로서 내려오나니 그는 변함도 없으시고 회전하는 그림자도 없으시니라", "en": "Every good gift and every perfect gift is from above, and cometh down from the Father of lights, with whom is no variableness, neither shadow of turning.", "es": "Toda buena dádiva y todo don perfecto es de lo alto, que desciende del Padre de las luces, en el cual no hay mudanza, ni sombra de variación."}, thanks: true },
  { ref: {"ko": "시편 23:1", "en": "Psalm 23:1", "es": "Salmos 23:1"}, text: {"ko": "여호와는 나의 목자시니 내가 부족함이 없으리로다", "en": "The Lord is my shepherd; I shall not want.", "es": "Jehová es mi pastor; nada me faltará."} },
  { ref: {"ko": "마태복음 11:28", "en": "Matthew 11:28", "es": "Mateo 11:28"}, text: {"ko": "수고하고 무거운 짐진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", "en": "Come unto me, all ye that labour and are heavy laden, and I will give you rest.", "es": "Venid á mí todos los que estáis trabajados y cargados, que yo os haré descansar."} },
  { ref: {"ko": "로마서 8:28", "en": "Romans 8:28", "es": "Romanos 8:28"}, text: {"ko": "우리가 알거니와 하나님을 사랑하는 자 곧 그 뜻대로 부르심을 입은 자들에게는 모든 것이 합력하여 선을 이루느니라", "en": "And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", "es": "Y sabemos que á los que á Dios aman, todas las cosas les ayudan á bien, es á saber, á los que conforme al propósito son llamados."} },
  { ref: {"ko": "빌립보서 4:13", "en": "Philippians 4:13", "es": "Filipenses 4:13"}, text: {"ko": "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", "en": "I can do all things through Christ which strengtheneth me.", "es": "Todo lo puedo en Cristo que me fortalece."} },
  { ref: {"ko": "이사야 41:10", "en": "Isaiah 41:10", "es": "Isaías 41:10"}, text: {"ko": "두려워 말라 내가 너와 함께 함이니라 놀라지 말라 나는 네 하나님이 됨이니라 내가 너를 굳세게 하리라 참으로 너를 도와주리라 참으로 나의 의로운 오른손으로 너를 붙들리라", "en": "Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", "es": "No temas, que yo soy contigo; no desmayes, que yo soy tu Dios que te esfuerzo: siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia."} }
];
const VERSE_TR = { ko: '개역한글', en: 'KJV', es: 'RV 1909' };
const VERSE_EVERY = { often: 4, normal: 8, rare: 15, off: 0 };
const verseEvery = () => VERSE_EVERY[data.settings.verseEvery || 'normal'] ?? 8;
function verseList() {
  const remote = CONTENT.verses?.[lang()];
  if (Array.isArray(remote) && remote.length) return remote.filter(v => v && v.text && v.ref).map(v => ({ ref: v.ref, text: v.text, tr: v.tr || '' }));
  // Until someone picks a frequency, only verses about thanks appear (this is a gratitude app first).
  const pool = data.settings.verseEvery ? VERSES : VERSES.filter(v => v.thanks);
  return pool.map(v => ({ ref: L(v.ref), text: L(v.text), tr: VERSE_TR[lang()] || VERSE_TR.en }));
}
// Puts a verse card after every N thanks (N from Settings). The verse changes with the day and position.
function withVerses(items) {
  const n = verseEvery(), list = verseList(); if (!n || !list.length) return items;
  const first = Math.min(4, Math.ceil(n / 2)); // the first verse comes a little sooner, then every n thanks
  const out = []; let posts = 0, k = 0, start = dayOfYear() * 3;
  for (const it of items) {
    out.push(it);
    if (it.type === 'post' && (++posts === first || (posts > first && (posts - first) % n === 0))) out.push({ type: 'verse', v: list[(start + k++) % list.length] });
  }
  return out;
}
function verseCard(v) {
  return `<article class="post card-page verse-card" data-ref="${esc(v.ref)}"><div class="card-inner">
    <div class="post-kind">${icon('book')}<span>${t('verse.kicker')}</span></div>
    <p class="verse-text">${esc(v.text)}</p>
    <p class="verse-ref">${esc(v.ref)}${v.tr ? ` · ${esc(v.tr)}` : ''}</p>
    ${data.settings.readerOpened ? '' : `<p class="swipe-hint left"><span aria-hidden="true">‹</span>${t('hint.swipeRead')}</p>`}
    <div class="verse-actions"><button class="link-btn" data-action="verse-read" data-id="${esc(v.ref)}">${icon('book')}${t('verse.read')}</button>
    <button class="link-btn" data-action="verse-share" data-id="${esc(v.ref)}">${icon('share')}${t('act.share')}</button>
    <button class="link-btn" data-action="verse-freq">${icon('sparkle')}${t('verse.freq')}</button></div></div></article>`;
}
function verseFreqSheet() {
  const cur = data.settings.verseEvery || 'normal';
  showSheet({ title: t('verse.title'), body: `<p class="hint">${t('verse.hint')}</p>
    ${seg([['often', t('verse.often')], ['normal', t('verse.normal')], ['rare', t('verse.rare')], ['off', t('verse.off')]], 'set-verse', cur, 'four')}
    <p class="hint verse-freq-note">${t('verse.note.' + cur)}</p>` });
}
function feedSequence(posts) { return withVerses(baseSequence(posts)); }
function baseSequence(posts) {
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
    ${dailyQLine()}
    <textarea id="gate-text" data-draft="gate" class="card-input" maxlength="1500" rows="3" placeholder="${esc(t('gate.ph'))}"></textarea>
    ${visPicker('gate')}
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
    <p class="fine-print login-terms">${t('login.terms').replaceAll('{base}', LEGAL_BASE)}</p>
    <p class="fine-print">${t('login.demo')}</p></div></article>`;
}
const cardFor = item => item.type === 'devoread' ? `<article class="post card-page devo-load"><div class="card-inner"><div class="post-kind">${icon('sun')}<span>${t('bf.devo')}</span></div><p class="hint">${t('rd.loading')}</p></div></article>`
  : item.type === 'bbend' ? `<article class="post card-page bb-end"><div class="card-inner"><div class="post-kind">${icon('book')}<span>daily bible</span></div>
    <p class="card-title">${t('bf.endTitle')}</p><p class="card-sub">${t('bf.endSub')}</p>
    <div class="card-actions"><button class="primary" data-action="bb-continue">${icon('book')}${t('bf.cont')}</button><button class="secondary" data-action="sermon-new">${icon('mic')}${t('bf.note')}</button></div>
    <p class="fo-links"><button data-action="fullscreen">${t('bf.home')}</button></p></div></article>`
  : item.type === 'empty' ? `<article class="post card-page"><div class="card-inner"><div class="post-kind">${icon('people')}<span>daily thanks</span></div>
    <p class="card-title">${t('emp.title')}</p><p class="card-sub">${t('emp.sub')}</p>
    <div class="card-actions"><button class="primary" data-action="new-group">${t('emp.group')}</button><button class="secondary" data-action="emp-strangers">${t('emp.strangers')}</button></div></div></article>` : item.type === 'planread' ? `<article class="post card-page plan-load" data-id="${esc(item.c.id)}"><div class="card-inner"><div class="post-kind">${icon('book')}<span>${esc(L(item.c.name) || chName(item.c))}</span></div><p class="hint">${t('rd.loading')}</p></div></article>` : item.type === 'first' ? firstCard(item) : item.type === 'quiz' ? quizCard(item.i) : item.type === 'quizres' ? quizResultCard() : item.type === 'compose' ? composeCard() : item.type === 'verse' ? verseCard(item.v) : item.type === 'camp' ? campaignCard(item.c) : item.type === 'wrecap' ? weekRecapCard(item.n) : loginCard();
function bindGateForm() {
  const f = $('#gate-compose'); if (!f) return;
  f.addEventListener('submit', e => {
    e.preventDefault();
    const text = $('#gate-text').value.trim(); if (!text) { $('#gate-text').focus(); return; }
    const vis = visScope('gate');
    const post = (v = vis) => ({ id: 'p' + Date.now(), mine: true, ...v, kind: 'today', text, date: today(), likes: 0 });
    const done = msg => { state.justWrote = true; save(); close(); renderKeep('#compose-card'); cheer(msg); };
    if (passesFilter(text, vis.scope, (choice, terms) => {
      if (choice === 'edit') { close(); $('#gate-text')?.focus(); return; }
      if (choice === 'private') { data.posts.unshift(post({ scope: 'private' })); return done(t('toast.saved')); }
      const p = post(); requestReview(p, terms); data.posts.unshift(p); done(t('mod.appealed'));
    })) { data.posts.unshift(post()); done(t('toast.saved')); }
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
const featureAvailable = k => CONTENT.features?.[k] !== false;
const featureOn = k => featureAvailable(k) && !!data.settings.features?.[k];
const visible = p => !p.status && !(p.kind === 'prayer' && !featureOn('prayer')) && p.kind !== 'share' && !data.hidden.includes(p.id) && !data.blocked.includes(authorKey(p)); // 'review' / 'rejected' posts stay off feeds
function feedPosts() {
  return data.posts.filter(visible).filter(p => state.feed === 'public' ? p.scope === 'public' && p.kind !== 'prayer' : inGroup(p, state.group));
}

// "오늘", "어제", or "11월 15일"
function dayLabel(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00'), now = new Date(today() + 'T00:00:00'), diff = Math.round((now - d) / 864e5);
  if (diff === 0) return t('day.today'); if (diff === 1) return t('day.yesterday');
  return d.toLocaleDateString(lang() === 'ko' ? 'ko-KR' : lang(), { month: 'long', day: 'numeric' });
}
function postTemplate(p, i, count) {
  const liked = data.liked.includes(p.id), text = L(p.text), name = authorName(p);
  const meta = p.sharedFrom ? t('meta.shared') : (p.kind === 'ahead' ? t('meta.ahead') : t('meta.today'));
  return `<article class="post${protectedPost(p) ? ' protected' : ''}" data-post="${esc(p.id)}">
    <div class="post-body">
      ${p.kind && p.kind !== 'today' ? `<div class="post-kind">${icon(kindIcon(p))}<span>${esc(kindLabel(p))}</span></div>` : ''}
      <p class="post-text ${textClass(text)}">${esc(text)}</p>${readMore(p, text)}
      ${p.reflection ? `<div class="post-reflect">${t('reflect.prefix')} · ${esc(p.reflection)}</div>` : ''}
    </div>
    <aside class="post-rail">
      ${p.kind === 'prayer' ? prayBtn(p) : `<button class="rail-btn ${liked ? 'liked' : ''}" data-action="like" data-id="${esc(p.id)}" aria-pressed="${liked}">${icon('heart')}${countLabel(p, p.likes + (liked ? 1 : 0))}</button>`}
      <button class="rail-btn ${data.saved.includes(p.id) ? 'saved' : ''}" data-action="save-post" data-id="${esc(p.id)}" aria-pressed="${data.saved.includes(p.id)}" aria-label="${t('save')}">${icon('bookmark')}</button>
      ${protectedPost(p) ? '' : `<button class="rail-btn" data-action="share" data-id="${esc(p.id)}">${icon('share')}<span class="rl">${t('act.share')}</span></button>`}
      <button class="rail-btn rail-more" data-action="post-menu" data-id="${esc(p.id)}" aria-label="${t('more')}">${icon('more')}</button>
      ${state.tab === 'feed' ? `<button class="rail-btn" data-action="fullscreen" aria-label="${t('fs.enter')}">${icon('maximize')}<span>${t('fs.open')}</span></button>` : ''}
    </aside>
    <footer class="post-foot"><p class="post-line">${esc(name)}${p.scope === 'group' ? ' · ' + esc(groupNames(p)) : ''} · ${esc(dayLabel(p.date))}</p></footer>
  </article>`;
}

function renderFeed(keepIndex = 0) {
  const posts = feedPosts();
  state.feed = 'public'; const isGroup = false; // 오늘 = everyone's thanks; each group opens from the 공동체 tab
  main.innerHTML = `
    ${isGroup ? `<div class="feed-sub">
      ${isGroup
        ? `<select class="group-select" data-action="change-group" aria-label="${t('compose.groupLabel')}">${data.groups.map(g => `<option value="${esc(g.id)}" ${state.group === g.id ? 'selected' : ''}>${esc(L(g.name))}</option>`).join('')}</select><button class="link-btn" data-action="invite-group" data-id="${esc(state.group || '')}">${icon('plus')}${t('inv.btn')}</button>`
        : ''}
    </div>` : ''}
    <div class="feed-scroll" id="feed-scroll">
      ${isGroup && state.group ? devoCard(state.group) : ''}
      ${posts.length ? (isGroup ? posts.map((p, i) => postTemplate(p, i, posts.length)).join('')
        : feedSequence(rankedOnce('public', posts)).map(it => it.type === 'post' ? postTemplate(it.p, rankedOnce('public', posts).indexOf(it.p), posts.length) : cardFor(it)).join(''))
        : `<div class="empty">${t('feed.empty')}<br><br><button class="primary" data-action="compose">${t('top.write')}</button></div>`}
    </div>
    ${posts.length > 1 ? `<button class="next-fab" data-action="next" aria-label="${t('aria.next')}">${icon('down')}</button>` : ''}`;
  const sc = $('#feed-scroll');
  if (keepIndex && sc) sc.scrollTop = keepIndex * sc.clientHeight;
  if (focus) state.immFocus = null;
  bindGateForm();
}

const pageHead = (title, desc, tools = '') => `<header class="page-head"><h1 class="page-title">${title}</h1>${tools ? `<div class="page-tools">${tools}</div>` : ''}</header>`; // titles speak for themselves
const roundBtn = (action, ic, label) => `<button class="round-btn" data-action="${action}" aria-label="${esc(label)}">${icon(ic)}</button>`;

// One group in the 공동체 tab: name (tap → swipe through its posts), this week together, and three actions.
function groupBlock(g) {
  const w = groupWeek(g.id), ch = data.challenges.find(c => c.group === g.id);
  const todayPeople = new Set(data.posts.filter(p => inGroup(p, g.id) && p.date === today() && !data.hidden.includes(p.id)).map(p => p.mine ? 'me' : authorKey(p))).size;
  const who = (todayPeople ? t('gs.today').replace('{n}', todayPeople) : w.people ? t('gs.weekPeople').replace('{n}', w.people) : t('gs.quiet')).replace('{total}', groupSize(g.id));
  if (g.pending) return `<section class="g-block g-card g-pending"><div class="g-row"><span class="g-name">${esc(L(g.name))}</span></div><p class="g-people">${t('gr.pending')}</p></section>`;
  return `<section class="g-block g-card">
    <div class="g-row"><button class="g-head" data-action="open-group" data-id="${esc(g.id)}"><span class="g-name">${esc(L(g.name))}</span>${unseenIn(g.id) ? `<i class="new-dot" aria-label="${t('gs.new')}"></i>` : ''}</button>
      <span class="g-tools"><button class="g-more" data-action="group-menu" data-id="${esc(g.id)}" aria-label="${t('more')}">${icon('more')}</button><button class="g-go" data-action="open-group" data-id="${esc(g.id)}" aria-label="${esc(L(g.name))}">›</button></span></div>
    <button class="g-sum" data-action="open-group" data-id="${esc(g.id)}">
      <span class="g-people">${who}</span>
      <span class="gs-week" aria-hidden="true">${w.days.map((on, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return `<span class="gs-day${i === 6 ? ' today' : ''}"><i class="${on ? 'on' : ''}"></i><small>${i === 6 ? t('gs.todayShort') : esc(d.toLocaleDateString(lang(), { weekday: 'narrow' }))}</small></span>`; }).join('')}</span>
      <span class="gs-counts"><b>${t('gs.week')}</b> ${t('gs.counts').replace('{t}', w.thanks).replace('{m}', w.meditation).replace('{p}', w.prayer)}</span></button>
    ${ch ? `<button class="g-ch" data-action="${chDone(ch) ? 'ch-result' : 'challenge-write'}" data-id="${esc(ch.id)}"><span>${chName(ch)} <em class="g-ch-d${chDone(ch) ? ' done' : ''}">${chDday(ch)}</em></span>
      ${chLen(ch) <= 7 ? `<span class="g-ch-days">${Array.from({ length: chLen(ch) }, (_, i) => `<i class="${i < ch.days.length ? 'on' : ''}"></i>`).join('')}</span>`
        : `<span class="g-ch-bar"><b style="width:${Math.round(ch.days.length / chLen(ch) * 100)}%"></b></span><span class="g-ch-n">${ch.days.length}/${chLen(ch)}</span>`}
      <span class="g-ch-go">${chDone(ch) ? t('chr.see') : ch.type === 'bible' ? (ch.plan ? esc(chPlanText(chPlanDay(ch, Math.min(ch.days.length, chLen(ch) - 1)))) : t('ch.read')) : t('gs.chToday')} ›</span></button>` : ''}
  </section>`;
}
// The rest of a group's actions, out of sight until asked for.
// Admin: who can invite, approving newcomers, a fresh link, and removing someone.
function groupAdmin(gid) {
  const g = data.groups.find(x => x.id === gid); if (!g) return;
  if (!g.owner) { toast(t('adm.only')); return; }
  const people = [...new Map(data.posts.filter(p => !p.mine && p.scope === 'group' && postGroups(p).includes(gid)).map(p => [authorKey(p), L(p.name)])).entries()];
  const sw = (id, on, label) => `<button class="list-row sw-row" data-action="${id}" data-id="${esc(gid)}" aria-pressed="${on}"><span class="row-main"><span class="row-title">${label}</span></span><span class="sw ${on ? 'on' : ''}"><i></i></span></button>`;
  showSheet({ title: t('adm.title'), body: `<div class="list">
      ${sw('adm-invite', g.membersInvite !== false, t('adm.invite'))}
      ${sw('adm-approve', !!g.approve, t('adm.approve'))}
      ${sw('adm-top', !!g.topToLeaders, t('adm.topLeaders'))}
      <button class="list-row" data-action="adm-newlink" data-id="${esc(gid)}"><span class="row-icon">${icon('reset')}</span><span class="row-main"><span class="row-title">${t('adm.newLink')}</span></span></button></div>
    ${g.approve && !g.sid ? `<p class="hint">${t('adm.pending')}</p>` : ''}
    ${g.sid ? cloudPeople(g) : `<p class="field-label">${t('adm.members')} · ${groupSize(gid)}</p>
    <div class="list"><div class="list-row static"><span class="row-main"><span class="row-title">${t('adm.you')}</span></span></div>
      ${people.filter(([k]) => !(g.removed || []).includes(k)).map(([k, name]) => `<div class="list-row static"><span class="row-main"><span class="row-title">${esc(data.nicknames?.[k] || name)}</span>${data.nicknames?.[k] ? `<span class="row-sub">${t('nick.orig').replace('{name}', esc(name))}</span>` : ''}</span><button class="link-btn" data-action="nick-edit" data-id="${esc(gid)}|${esc(k)}|${esc(name)}">${t('nick.edit')}</button><button class="link-btn adm-rm" data-action="adm-remove" data-id="${esc(gid)}|${esc(k)}">${t('adm.remove')}</button></div>`).join('')}</div>`}` });
}
function cloudPeople(g) {
  const ppl = (g.people || []).filter(p => p.id !== Cloud.uid()), waiting = ppl.filter(p => p.pending), active = ppl.filter(p => !p.pending);
  const who = p => esc(p.name || t('cl.noName'));
  return `${waiting.length ? `<p class="field-label">${t('cl.waiting')} · ${waiting.length}</p><div class="list">${waiting.map(p => `<div class="list-row static"><span class="row-main"><span class="row-title">${who(p)}</span></span><button class="secondary" data-action="cl-approve" data-id="${esc(g.id)}|${esc(p.id)}">${t('cl.approve')}</button><button class="link-btn adm-rm" data-action="cl-remove" data-id="${esc(g.id)}|${esc(p.id)}">${t('cl.decline')}</button></div>`).join('')}</div>` : ''}
    <p class="field-label">${t('adm.members')} · ${active.length + 1}</p>
    <div class="list"><div class="list-row static"><span class="row-main"><span class="row-title">${t('adm.you')}</span></span></div>
      ${active.map(p => `<div class="list-row static"><span class="row-main"><span class="row-title">${who(p)}</span></span><button class="link-btn adm-rm" data-action="cl-remove" data-id="${esc(g.id)}|${esc(p.id)}">${t('adm.remove')}</button></div>`).join('')}</div>`;
}
function leaderStart(gid) {
  const g = data.groups.find(x => x.id === gid); if (!g) return;
  const hasCh = data.challenges.some(c => c.group === gid), wrote = data.posts.some(p => p.mine && inGroup(p, gid));
  const step = (n, title, sub, action, done) => `<div class="ls-step${done ? ' done' : ''}"><span class="ls-n">${done ? icon('check') : n}</span><span class="ls-main"><b>${title}</b><small>${sub}</small></span>
    ${done ? `<span class="ls-done">${t('ls.done')}</span>` : `<button class="secondary" data-action="${action}" data-id="${esc(gid)}">${t('ls.go')}</button>`}</div>`;
  showSheet({ title: t('ls.title'), body: `<p class="hint">${t('ls.sub')}</p>
    <div class="ls">${step(1, t('ls.s1'), t('ls.s1b'), 'ls-invite', !!state.lsInvited?.[gid])}${step(2, t('ls.s2'), t('ls.s2b'), 'ls-challenge', hasCh)}${step(3, t('ls.s3'), t('ls.s3b'), 'group-write', wrote)}</div>
    <p class="hint">${t('ls.admin')}</p>` });
}
const CAMPAIGNS_BUILTIN = [
  { id: 'thanks21-2026', start: '2026-11-06', end: '2026-11-26', type: 'thanks', title: { ko: '추수감사 21일 감사', en: '21 Days of Thanks', es: '21 días de gratitud' } },
  { id: 'recap-2026', start: '2026-12-20', end: '2026-12-31', type: 'recap', title: { ko: '나의 2026년 돌아보기', en: 'My 2026, looking back', es: 'Mi 2026 en recuerdos' } },
  { id: 'newyear-2027', start: '2027-01-01', end: '2027-01-07', type: 'thanks', title: { ko: '새해 첫 주 감사', en: 'First week of the year: thanks', es: 'Primera semana del año: gratitud' } },
  { id: 'lent-2027', start: '2027-02-10', end: '2027-03-27', type: 'meditation', title: { ko: '사순절 40일 묵상', en: 'Lent: 40 days of reflection', es: 'Cuaresma: 40 días de reflexión' } }
];
const dayDiff = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5);
function activeCampaign() {
  const list = Array.isArray(CONTENT.campaigns) && CONTENT.campaigns.length ? CONTENT.campaigns : CAMPAIGNS_BUILTIN;
  return list.find(c => c && c.start <= today() && today() <= c.end) || null;
}
// First visits: a tiny quiz about what studies found on gratitude, one card at a time between posts.
const QUIZ_N = 3, QUIZ_ANS = [1, 2, 2];
const quizState = () => (data.settings.quiz = data.settings.quiz || {});
const quizScore = () => Object.entries(quizState()).filter(([k, v]) => /^\d$/.test(k) && v === QUIZ_ANS[+k]).length;
const quizAnswered = () => Object.keys(quizState()).filter(k => /^\d$/.test(k)).length;
function quizCard(i) {
  const q = quizState(), ans = q[i], opts = t('qz.o' + (i + 1)).split('|');
  return `<article class="post card-page quiz-card" data-quiz="${i}"><div class="card-inner">
    <div class="post-kind">${icon('sparkle')}<span>${t('qz.kicker').replace('{i}', i + 1).replace('{n}', QUIZ_N)}</span>${quizAnswered() ? `<span class="qz-score">${t('qz.score').replace('{r}', quizScore()).replace('{n}', quizAnswered())}</span>` : ''}</div>
    <p class="card-title qz-q">${t('qz.q' + (i + 1))}</p>
    <div class="qz-opts">${opts.map((o, k) => `<button class="qz-opt${ans === undefined ? '' : k === QUIZ_ANS[i] ? ' right' : k === ans ? ' wrong' : ' dim'}" data-action="quiz" data-id="${i}|${k}" ${ans === undefined ? '' : 'disabled'}>${esc(o)}</button>`).join('')}</div>
    ${ans === undefined ? '' : `<div class="qz-ans"><p class="qz-verdict ${ans === QUIZ_ANS[i] ? 'ok' : 'no'}">${ans === QUIZ_ANS[i] ? t('qz.right') : t('qz.wrong')}</p>
      <p class="qz-correct">${t('qz.answer')} · <b>${esc(opts[QUIZ_ANS[i]])}</b></p>
      <p class="qz-label">${t('qz.why')}</p><p class="qz-fact">${t('qz.f' + (i + 1))}</p><p class="qz-src">${t('qz.s' + (i + 1))}</p></div>`}
  </div></article>`;
}
function quizResultCard() {
  const r = quizScore();
  return `<article class="post card-page quiz-card quiz-res"><div class="card-inner">
    <div class="post-kind">${icon('sparkle')}<span>${t('qz.kicker').replace('{i}', QUIZ_N).replace('{n}', QUIZ_N)}</span></div>
    <p class="card-title">${t('qz.resTitle').replace('{n}', QUIZ_N).replace('{r}', r)}</p>
    <div class="qz-dots">${Array.from({ length: QUIZ_N }, (_, i) => `<i class="${quizState()[i] === QUIZ_ANS[i] ? 'on' : ''}"></i>`).join('')}</div>
    <p class="card-sub">${t('qz.resSub')}</p>
    <div class="card-actions"><button class="primary" data-action="imm-write">${t('qz.resGo')}</button></div></div></article>`;
}
/* What to see first when the app opens: new prayer requests from my group (순원 기도제목), then today's part of a
   challenge or reading plan I haven't done yet. Each one is a card at the very top of the feed. */
// What-you-see preferences (Settings › What you see). Defaults: opening cards on, feed = me + people I'm connected to.
const PREF_DEFAULTS = { firstPr: true, firstVerse: true, firstCh: true, firstMax: 5, feedThanks: true, feedPrayer: true, feedMed: true, strangers: false };
const pref = k => { if ((data.settings.prefs?.offUntil?.[k] || '') > new Date().toISOString()) return false; const v = data.settings.prefs?.[k]; return v === undefined ? PREF_DEFAULTS[k] : v; };
const setPref = (k, v) => { data.settings.prefs = { ...(data.settings.prefs || {}), [k]: v }; save(); };
const firstSnoozed = () => data.settings.prefs?.firstOff || (data.settings.prefs?.firstUntil || '') > new Date().toISOString();
// People I'm connected to: anyone who posts in my groups (and anyone who joined my plans / challenges).
function connectedKeys() {
  const keys = new Set(['me']);
  data.posts.forEach(p => { if (p.scope === 'group' && data.groups.some(g => inGroup(p, g.id))) keys.add(authorKey(p)); });
  data.challenges.forEach(c => (c.members || []).forEach(m => keys.add(String(L(m)))));
  return keys;
}
const newGroupPrayers = () => data.posts.filter(p => p.kind === 'prayer' && !p.mine && visible(p) && p.scope === 'group' && data.groups.some(g => inGroup(p, g.id))
  && p.date >= daysAgo(6) && !postGroups(p).every(gid => data.groups.find(g => g.id === gid)?.muted) && !data.prayed.includes(p.id) && !(data.settings.prayerSeen || []).includes(p.id));
function firstItems() {
  if (!state.openedBefore && !BIBLE_MODE) return [];   // the very first visit of daily thanks: its feed and first-visit steps come first
  if (firstSnoozed()) return [];
  // which requests come first is decided once when the app opens, so they don't vanish while you're looking at them
  if (!state.firstPrIds) state.firstPrIds = newGroupPrayers().sort((a, b) => (b.date || '').localeCompare(a.date || '')).map(p => p.id);
  const max = pref('firstMax'), reqs = pref('firstPr') ? state.firstPrIds.map(id => data.posts.find(p => p.id === id)).filter(p => p && visible(p)).slice(0, max || 999) : [];
  const out = reqs.map((p, i) => ({ type: 'post', p, firstPr: { i: i + 1, n: reqs.length } }));   // one request per card, like the thanks feed
  const due = data.challenges.filter(c => !chDone(c) && c.lastDay !== today()).sort((a, b) => (b.start || '').localeCompare(a.start || ''));
  const plan = pref('firstVerse') ? due.find(c => c.type === 'bible' && c.plan) : null;
  if (plan) out.push({ type: 'planread', c: plan });                                            // filled with one verse per card below
  if (pref('firstCh') && !BIBLE_MODE) due.filter(c => c !== plan && c.type !== 'bible').slice(0, 1).forEach(c => out.push({ type: 'first', kind: 'ch', c }));
  if (out.length) out[out.length - 1].lastFirst = true;   // the small "turn off" links go under the last opening card
  return out;
}
// Today's portion of a reading plan, as verse cards (one verse per card), then a "done" card.
function planChapters(c) {
  const d = chPlanDay(c, Math.min(c.days.length, chLen(c) - 1)); if (!d) return [];
  const out = []; for (let i = chIndex(...d.start); i <= chIndex(...d.end); i++) out.push(chAt(i)); return out;
}
async function fillPlanCards() {
  const slot = document.querySelector('.plan-load'); if (!slot) return;
  const c = data.challenges.find(x => x.id === slot.dataset.id); if (!c) { slot.remove(); return; }
  const chs = planChapters(c), range = chPlanText(chPlanDay(c, Math.min(c.days.length, chLen(c) - 1)));
  let verses = [];
  try { for (const [b, ch] of chs) (await fetchChapter(b, ch)).forEach(x => verses.push({ b, c: ch, v: x.v, text: x.text })); }
  catch { slot.querySelector('.card-inner').innerHTML = `<p class="hint">${t('rd.offline')}</p>`; return; }
  if (!document.body.contains(slot) || !verses.length) return;
  const n = verses.length;
  state.readSpan = { b: verses[0].b, c: verses[0].c, v: verses[0].v };   // a note on a later verse covers what was read so far
  const cu = c.cuDismissed === today() ? '' : catchUpCard(c);
  slot.outerHTML = cu + verseCards(verses, `<button class="fv-src why-btn" data-action="first-why" data-id="plan|${esc(c.id)}">${esc(L(c.name) || chName(c))} · ${t('fc.dayN').replace('{n}', c.days.length + 1)}</button>
        <div class="post-kind">${icon('book')}<span>${esc(t('fv.kick').replace('{r}', range))}</span></div>`, c.id) + `<article class="post card-page fv-end" data-fvend="${esc(c.id)}"><div class="card-inner">
      <div class="post-kind">${icon('check')}<span>${esc(range)}</span></div>
      <p class="card-title">${t('fv.doneTitle')}</p>
      <p class="card-sub">${esc(t('fv.doneSub').replace('{name}', L(c.name) || chName(c)).replace('{d}', c.days.length + 1))}</p>
      <div class="card-actions"><button class="primary" data-action="plan-read-done" data-id="${esc(c.id)}">${icon('check')}${t('fv.done')}</button></div>${firstOffLinks()}</div></article>`;
}
function verseCards(verses, head, cid = '') {
  const n = verses.length;
  return verses.map((x, i) => { const k = verseKey(x.b, x.c, x.v), liked = (data.verseLikes || []).includes(k), saved = (data.savedVerses || []).some(s => s.key === k);
    return `<article class="post card-page fv-card" id="v-${x.b}-${x.c}-${x.v}"${cid ? ` data-fv="${esc(cid)}"` : ''}>
      <div class="card-inner">${head}
        <p class="vs-text fv-text">${esc(x.text)}</p>
        <p class="fv-ref">${esc(refText({ b: x.b, c: x.c, v: x.v, v2: x.v }))}<span>${t('fv.count').replace('{i}', i + 1).replace('{n}', n)}</span></p></div>
      <aside class="post-rail">
        <button class="rail-btn ${liked ? 'liked' : ''}" data-action="verse-like" data-id="${k}" aria-pressed="${liked}" aria-label="${t('act.like')}">${icon('heart')}</button>
        <button class="rail-btn ${saved ? 'saved' : ''}" data-action="verse-save" data-id="${k}" aria-pressed="${saved}" aria-label="${t('save')}">${icon('bookmark')}</button>
        <button class="rail-btn" data-action="verse-send" data-id="${k}">${icon('share')}<span class="rl">${t('act.share')}</span></button>
        <button class="rail-btn" data-action="verse-note" data-id="${k}">${icon('pencil')}<span class="rl">${t('act.note')}</span></button>
        <button class="rail-btn" data-action="fullscreen" aria-label="${t('fs.closeAria')}">${icon('minimize')}<span class="rl">${t('fs.close')}</span></button>
      </aside></article>`; }).join('');
}
// daily bible with no reading plan today: today's passage (생명의 삶 / Our Daily Bread), one verse per card
async function fillDevoCards() {
  const slot = document.querySelector('.devo-load'); if (!slot) return;
  const p = todaysPassage(data.groups[0]?.id); if (!p?.ref) { slot.remove(); return; }
  let verses = []; try { verses = (await passageVerses(p.ref)).map(x => ({ b: p.ref.b, c: x.c, v: x.v, text: x.text })); } catch { slot.querySelector('.card-inner').innerHTML = `<p class="hint">${t('rd.offline')}</p>`; return; }
  if (!document.body.contains(slot) || !verses.length) return;
  state.readSpan = { b: verses[0].b, c: verses[0].c, v: verses[0].v };
  slot.outerHTML = verseCards(verses, `<div class="post-kind">${icon('sun')}<span>${esc(t('bf.devo'))}${p.source ? ' · ' + esc(p.source) : ''} · ${esc(refText(p.ref))}</span></div>`);
}
// A prayer request seen as its own card no longer comes first next time.
let firstSeenObs = null;
function watchFirstPrayers() {
  firstSeenObs?.disconnect(); if (!window.IntersectionObserver) return;
  firstSeenObs = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; const id = e.target.dataset.post;
    if (e.target.dataset.firstpr) { const seen = data.settings.prayerSeen = data.settings.prayerSeen || []; if (!seen.includes(id)) { seen.push(id); if (seen.length > 300) seen.shift(); } }
    // every card scrolled past counts as seen, so the "new" number goes down as you go
    const gs = data.groupSeen = data.groupSeen || []; if (!gs.includes(id)) { gs.push(id); if (gs.length > 2000) gs.shift(); refreshNewPill(); }
    clearTimeout(readSaveTimer); readSaveTimer = setTimeout(save, 600); }), { threshold: 0.6 });
  document.querySelectorAll('article.post.imm[data-post]:not(.mine)').forEach(el => firstSeenObs.observe(el));
}
function refreshNewPill() { const el = document.querySelector('.imm-streak'); if (!el) return; const h = immStreak(); if (!h) { el.remove(); return; } const tmp = document.createElement('div'); tmp.innerHTML = h; el.replaceWith(tmp.firstElementChild); }
function writeStreak() { const days = new Set(data.posts.filter(p => p.mine).map(p => p.date)); let i = days.has(today()) ? 0 : 1, n = 0; while (days.has(daysAgo(i))) { n++; i++; } return n; }
function immStreak() {
  const n = BIBLE_MODE ? readDays() : writeStreak(), unseen = BIBLE_MODE
    // daily bible: count only what the feed itself shows, so scrolling to the end takes it to zero
    ? data.posts.filter(p => !p.mine && visible(p) && data.groups.some(g => inGroup(p, g.id)) && !(data.groupSeen || []).includes(p.id)).length
    : data.groups.reduce((x, g) => x + unseenIn(g.id), 0);
  if (!n && !unseen) return '';
  return `<div class="imm-streak" aria-live="polite">${n ? `<span>${esc(t('stk.write').replace('{n}', n))}</span>` : ''}${unseen ? `<span class="imm-new"><i class="new-dot"></i>${esc(t('stk.new').replace('{n}', unseen))}</span>` : ''}</div>`;
}
const firstOffLinks = () => `<p class="fo-links"><button data-action="off-sheet">${t('fo.off')}</button></p>`;
// "끄기": what to turn off (prayer cards, today's reading, challenges, or all of them) and for how long
function offSheet() {
  const what = state.offWhat || 'firstPr', dur = state.offFor || 'h24';
  const chip = (k, label) => `<button type="button" class="chip ${what === k ? 'active' : ''}" data-action="off-what" data-id="${k}">${label}</button>`;
  showSheet({ title: t('snz.title'), body: `<div class="snz"><p class="field-label">${t('snz.what')}</p>
    <div class="chips">${chip('firstPr', t('vw.fPr'))}${chip('firstVerse', t('vw.fVerse'))}${chip('firstCh', t('vw.fCh'))}${chip('all', t('snz.all'))}</div>
    <p class="field-label">${t('snz.for')}</p>
    ${seg([['h24', t('vw.h24')], ['w1', t('vw.w1')], ['off', t('snz.until')]], 'off-for', dur)}
    <button class="primary block" data-action="off-ok">${t('snz.ok')}</button>
    <p class="hint">${t('snz.hint')}</p></div>` });
}
function offApply() {
  const what = state.offWhat || 'firstPr', dur = state.offFor || 'h24', P = { ...(data.settings.prefs || {}) };
  const until = dur === 'h24' ? new Date(Date.now() + 864e5).toISOString() : dur === 'w1' ? new Date(Date.now() + 7 * 864e5).toISOString() : '';
  if (what === 'all') { P.firstOff = dur === 'off'; P.firstUntil = until; }
  else if (dur === 'off') { P[what] = false; }
  else P.offUntil = { ...(P.offUntil || {}), [what]: until };
  data.settings.prefs = P; state.firstPrIds = null; save(); close(); render(0); toast(t('fo.offDone'));
}
function viewSettings() {
  const sw = (k, label, sub = '') => `<label class="list-row"><span class="row-main"><span class="row-title">${label}</span>${sub ? `<span class="row-sub">${sub}</span>` : ''}</span><input class="switch" type="checkbox" data-pref="${k}" ${pref(k) ? 'checked' : ''}></label>`;
  const until = data.settings.prefs?.firstUntil, snoozed = !data.settings.prefs?.firstOff && until > new Date().toISOString();
  const pause = data.settings.prefs?.firstOff ? 'off' : snoozed ? (new Date(until) - Date.now() > 2 * 864e5 ? 'w1' : 'h24') : 'on';
  showSheet({ title: t('vw.row'), body: `
    <p class="field-label">${t('vw.first')}</p>
    <div class="list">${sw('firstPr', t('vw.fPr'))}${sw('firstVerse', t('vw.fVerse'))}${sw('firstCh', t('vw.fCh'))}</div>
    <p class="field-label">${t('vw.howMany')}</p>
    ${seg([['3', '3'], ['5', '5'], ['10', '10'], ['0', t('vw.all')]], 'vw-max', String(pref('firstMax')))}
    <p class="field-label">${t('vw.pause')}</p>
    ${seg([['on', t('vw.on')], ['h24', t('vw.h24')], ['w1', t('vw.w1')], ['off', t('vw.off')]], 'vw-pause', pause, 'four')}
    ${snoozed ? `<p class="hint">${esc(t('vw.until').replace('{d}', new Date(until).toLocaleString(lang(), { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })))}</p>` : ''}
    <p class="field-label">${t('vw.feed')}</p>
    <div class="list">${sw('feedThanks', t('vw.thanks'))}${sw('feedPrayer', t('vw.prayer'))}${sw('feedMed', t('vw.med'))}${sw('strangers', t('vw.strangers'), t('vw.strangersSub'))}</div>` });
}
function firstCard(it) {
  if (it.kind === 'prayer') {
    const gids = [...new Set(it.reqs.flatMap(p => data.groups.filter(g => inGroup(p, g.id)).map(g => g.id)))], g = gids.length === 1 ? L(data.groups.find(x => x.id === gids[0])?.name) : t('fc.group');
    const people = new Set(it.reqs.map(p => authorKey(p))).size;
    return `<article class="post card-page first-card"><div class="card-inner">
      <div class="post-kind"><span>${esc(t('fc.prKick').replace('{g}', g))}</span></div>
      <p class="card-title">${esc(t('fc.prTitle').replace('{n}', people))}</p>
      <ul class="fc-list">${it.reqs.slice(0, 3).map(p => `<li><b>${esc(authorName(p))}</b><span>${esc(L(p.text).slice(0, 60))}</span></li>`).join('')}</ul>
      <div class="card-actions"><button class="primary" data-action="first-prayers">${t('fc.pray')}</button></div>
    </div></article>`;
  }
  const c = it.c, k = Math.min(c.days.length, chLen(c) - 1), bible = c.type === 'bible' && c.plan;
  return `<article class="post card-page first-card"><div class="card-inner">
    <div class="post-kind">${icon(bible ? 'book' : c.type === 'prayer' ? 'pray' : 'sparkle')}<span>${esc(L(c.name) || chName(c))} · ${chDday(c)}</span></div>
    <p class="card-title">${bible ? esc(t('fc.readTitle')) : esc(chName(c))}</p>
    <p class="fc-big">${bible ? esc(chPlanText(chPlanDay(c, k))) : esc(t('fc.dayN').replace('{n}', c.days.length + 1))}</p>
    <div class="card-actions"><button class="primary" data-action="challenge-write" data-id="${esc(c.id)}">${bible ? t('fc.read') : t('fc.write')}</button></div>
  </div></article>`;
}
function campaignCard(c) {
  const joined = data.challenges.find(x => x.campaign === c.id), day = dayDiff(c.start, today()) + 1, left = dayDiff(today(), c.end);
  return `<article class="post card-page camp-card"><div class="card-inner">
    <div class="post-kind">${icon('sparkle')}<span>${t('cp.now')}</span></div>
    <p class="card-title">${esc(L(c.title))}</p>
    <p class="card-sub">${esc(shortDate(c.start))} – ${esc(shortDate(c.end))} · ${c.type === 'recap' ? t('cp.left').replace('{n}', left + 1) : t('cp.day').replace('{n}', day)}</p>
    <div class="card-actions">${c.type === 'recap' ? `<button class="primary" data-action="cp-recap">${t('cp.recap')}</button>`
      : joined ? `<span class="hint">${icon('check')} ${t('cp.joined')} · ${joined.days.length}/${chLen(joined)}</span>`
      : `<button class="primary" data-action="cp-join" data-id="${esc(c.id)}">${t('cp.join')}</button>${data.groups[0] ? `<button class="secondary" data-action="cp-join" data-id="${esc(c.id)}|group">${t('cp.withGroup')}</button>` : ''}`}</div>
  </div></article>`;
}
// Sunday evening / Monday: the week, ready as cards.
function weekRecapDue() {
  const d = new Date(), dow = d.getDay(), h = d.getHours();
  if (!((dow === 0 && h >= 17) || (dow === 1 && h < 12))) return 0;
  const wk = periodOf(today(), 'w'); if ((data.settings.recapSeen || '') === wk && dow === 0) return 0;
  return data.posts.filter(p => p.mine && p.scope !== 'private' && kindGroup(p) === 'thanks' && p.date >= daysAgo(6)).length;
}
function weekRecapCard(n) {
  return `<article class="post card-page recap-card"><div class="card-inner">
    <div class="post-kind">${icon('camera')}<span>${t('col.title')}</span></div>
    <p class="card-title">${t('rc.wkTitle').replace('{n}', n)}</p><p class="card-sub">${t('rc.wkSub')}</p>
    <div class="card-actions"><button class="primary" data-action="recap-week">${t('rc.wkGo')}</button></div></div></article>`;
}
/* Church admin: many groups at a glance — leaders, moving people, one challenge for everyone. */
const churchGroups = () => (data.church?.groups || []).map(id => data.groups.find(g => g.id === id)).filter(Boolean);
const groupPeople = gid => { const g = data.groups.find(x => x.id === gid); const m = new Map(data.posts.filter(p => !p.mine && p.scope === 'group' && inGroup(p, gid)).map(p => [authorKey(p), L(p.name)])); (g?.extra || []).forEach(x => m.set(x.key, x.name)); return [...m.entries()]; };
function renderChurch() {
  const ch = data.church, gs = churchGroups();
  const todayN = gid => new Set(data.posts.filter(p => inGroup(p, gid) && p.date === today()).map(p => p.mine ? 'me' : authorKey(p))).size;
  const members = gs.reduce((n, g) => n + groupSize(g.id), 0), todayAll = gs.reduce((n, g) => n + todayN(g.id), 0);
  main.innerHTML = `<div class="screen"><div class="page gd church">
    <div class="gd-top"><button class="gd-back" data-action="church-back">${icon('chevron')}<span>${t('gd.back')}</span></button></div>
    <h1 class="gd-name">${esc(ch.name)}</h1>
    <p class="g-people">${t('chu.stats').replace('{g}', gs.length).replace('{m}', members).replace('{t}', todayAll)}</p>
    <div class="gd-row"><button class="secondary" data-action="church-allch">${icon('sparkle')}${t('chu.allCh')}</button><button class="secondary" data-action="new-group">${icon('plus')}${t('chu.newGroup')}</button></div>
    <button class="secondary block" data-action="ps-link">${icon('share')}${t('ps.link')}</button>
    <button class="list-row sw-row" data-action="church-shared" aria-pressed="${ch.sharedPassage !== false}"><span class="row-main"><span class="row-title">${t('chu.shared')}</span></span><span class="sw ${ch.sharedPassage !== false ? 'on' : ''}"><i></i></span></button>
    ${catGroups(gs).map(([cat, cgs]) => `<p class="gd-label cat-h">${esc(cat || t('cat.none'))} · ${esc(t('ps.members').replace('{n}', cgs.reduce((n, g) => n + groupSize(g.id), 0)))}</p>
    <div class="chu-list">${cgs.map(g => { const w = groupWeek(g.id), c = data.challenges.find(x => x.group === g.id), lead = ch.leaders?.[g.id], att = attendRate(g.id), mm = meetingsOf(g.id).filter(m => m.date.slice(0, 7) === today().slice(0, 7)).length;
      return `<section class="chu-g"><div class="chu-head"><b>${esc(L(g.name))}${unseenIn(g.id) ? ' <i class="new-dot"></i>' : ''}</b><span>${t('chu.today').replace('{n}', todayN(g.id)).replace('{t}', groupSize(g.id))}</span></div>
        ${att != null || mm ? `<p class="chu-sub">${att != null ? esc(t('dash.att').replace('{p}', att)) : ''}${att != null && mm ? ' · ' : ''}${mm ? esc(t('dash.meet').replace('{n}', mm)) : ''}</p>` : ''}
        <p class="chu-sub">${lead ? t('chu.leader').replace('{name}', esc(lead)) : t('chu.noLeader')} · ${t('gs.counts').replace('{t}', w.thanks).replace('{m}', w.meditation).replace('{p}', w.prayer)}${c ? ` · ${esc(chName(c))} ${chDday(c)}` : ''}</p>
        <div class="chu-acts"><button class="link-btn" data-action="church-leader" data-id="${esc(g.id)}">${t('chu.setLeader')}</button><button class="link-btn" data-action="church-move" data-id="${esc(g.id)}">${t('chu.move')}</button><button class="link-btn" data-action="cat-set" data-id="${esc(g.id)}">${t('cat.set')}</button><button class="link-btn" data-action="cat-rename" data-id="${esc(g.id)}">${t('cat.rename')}</button><button class="link-btn" data-action="open-group" data-id="${esc(g.id)}">${t('chu.open')} ›</button></div></section>`; }).join('')}</div>`).join('')}
  </div></div>`;
}
/* ---------------- small-group leader tools (Settings › Features › leader tools) ----------------
   Meetings: the leader sets the passage (everyone reads along, one verse per page), takes attendance and records;
   the recording comes back as notes per member. Member reports: attendance, what they shared, prayer requests,
   the leader's own notes. The church view groups small groups by category; a link shows the pastor a dashboard. */
const meetingsOf = gid => (data.meetings || []).filter(m => m.gid === gid).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
const memberList = gid => [['me', t('mt.me')], ...groupPeople(gid)];
const nameOf = (gid, k) => k === 'me' ? t('mt.me') : (data.nicknames?.[k] || (memberList(gid).find(x => x[0] === k) || [])[1] || k);
function attendRate(gid, n = 4) {
  const ms = meetingsOf(gid).slice(0, n).filter(m => m.attend); if (!ms.length) return null;
  const pct = ms.reduce((x, m) => { const v = Object.values(m.attend); return x + (v.length ? v.filter(Boolean).length / v.length : 0); }, 0) / ms.length;
  return Math.round(pct * 100);
}
function leaderTools(gid) {
  const ms = meetingsOf(gid).slice(0, 3);
  return `<section class="ld"><p class="gd-label">${t('ld.tools')}</p>
    <div class="gd-row"><button class="primary" data-action="mt-new" data-id="${esc(gid)}">${icon('mic')}${t('ld.meet')}</button><button class="secondary" data-action="rp-pick" data-id="${esc(gid)}">${icon('user')}${t('ld.reports')}</button></div>
    ${ms.length ? `<p class="gd-label">${t('ld.past')}</p><div class="ld-list">${ms.map(m => { const v = Object.values(m.attend || {});
      return `<button class="ld-meet" data-action="mt-open" data-id="${esc(m.id)}"><span>${esc(dayLabel(m.date))}${m.ref ? ' · ' + esc(refText(m.ref)) : ''}</span><small>${esc(t('mt.att').replace('{n}', v.filter(Boolean).length).replace('{t}', v.length))}${m.busy ? ' · ' + t('sn.working') : ''}</small></button>`; }).join('')}</div>` : ''}
  </section>`;
}
function meetingSheet(gid) {
  const g = data.groups.find(x => x.id === gid); if (!g) return;
  const keep = recLive() || !!Rec.blob;
  if (!keep || state.mtGid !== gid) { state.mtGid = gid; state.snRef = g.meetingLive?.date === today() ? g.meetingLive.ref : null; state.mtAttend = Object.fromEntries(memberList(gid).map(([k]) => [k, k === 'me'])); state.snMode = 'write'; }
  showSheet({ title: esc(t('mt.title').replace('{d}', dayLabel(today()))), body: `<form id="mt-form" class="sheet-form">
    <p class="field-label">${t('mt.pass')}</p>
    <div class="sn-refrow"><button type="button" class="mp-open sn-refbtn ${state.snRef ? 'set' : ''}" data-action="mt-ref" id="sn-ref">${icon('book')}<span>${state.snRef ? esc(refText(state.snRef)) : t('sn.refReq')}</span>${icon('chevron')}</button>
      <button type="button" class="round-btn sn-pv" data-action="pv-open" id="sn-pv" ${state.snRef ? '' : 'hidden'}>${icon('maximize')}</button></div>
    <button type="button" class="secondary block" data-action="mt-live" id="mt-live" ${state.snRef ? '' : 'hidden'}>${icon('people')}${g.meetingLive?.date === today() ? t('mt.shared') : t('mt.share')}</button>
    <p class="field-label">${t('mt.attend')}</p>
    <div class="mt-att">${memberList(gid).map(([k, name]) => `<label class="mt-person"><input type="checkbox" data-att="${esc(k)}" ${state.mtAttend?.[k] ? 'checked' : ''}><span>${esc(nameOf(gid, k) || name)}</span></label>`).join('')}</div>
    <div id="rec-card" class="rec-card">${recCard()}</div>
    <textarea id="mt-notes" data-draft="meeting-${esc(gid)}" class="big-input" rows="3" placeholder="${esc(t('mt.notes'))}"></textarea>
    <button class="primary block" type="submit">${t('mt.save')}</button></form>` });
  document.querySelectorAll('[data-att]').forEach(cb => cb.addEventListener('change', () => { state.mtAttend[cb.dataset.att] = cb.checked; }));
  $('#mt-form').addEventListener('submit', e => { e.preventDefault(); meetingSave(gid); });
  recPaint(true);
}
async function meetingSave(gid) {
  if (recLive()) await recStop();
  const id = 'mt' + Date.now(), blob = Rec.blob, passageText = state.snRef ? ((await passageVerses(state.snRef).then(vs => vs.map(x => `${x.c}:${x.v} ${x.text}`).join('\n')).catch(() => '')) || '') : '';
  const m = { id, gid, date: today(), ref: state.snRef || null, attend: { ...(state.mtAttend || {}) }, notes: $('#mt-notes')?.value.trim() || '', passageText: passageText.slice(0, 20000),
    ...(blob ? { rec: { dur: Math.round(Rec.dur || 0), bytes: blob.size } } : {}), ...(Rec.live.final.trim() ? { liveText: Rec.live.final.trim() } : {}) };
  data.meetings = [m, ...(data.meetings || [])];
  const g = data.groups.find(x => x.id === gid); if (g?.meetingLive) g.meetingLive = null;
  if (blob && blob.size < 80 * 1024 * 1024) await AudioStore.put(id, blob).catch(() => {});
  recReset(true); if (data.drafts) delete data.drafts['meeting-' + gid]; save(); close(); render(); toast(t('mt.saved'));
  if (blob) meetingUpload(id, blob); else if (m.liveText) meetingSummarizeLocal(id);
}
async function meetingUpload(id, blob) {
  const m = (data.meetings || []).find(x => x.id === id); if (!m) return;
  m.busy = true; save(); state.snChecked = false; await sermonSync();
  const members = memberList(m.gid).filter(([k]) => m.attend?.[k]).map(([k]) => nameOf(m.gid, k));
  const stop = () => { m.busy = false; m.pending = true; save(); render(); if (m.liveText) meetingSummarizeLocal(id); };
  if (!state.snOnline) return stop();
  try {
    const { id: rid } = await sapi('POST', `/api/sermons/upload?type=${encodeURIComponent((blob.type || 'audio/mp4').split(';')[0])}&lang=${sermonLang()}&kind=meeting&members=${encodeURIComponent(members.join(','))}&title=${encodeURIComponent(L(data.groups.find(g => g.id === m.gid)?.name) || '')}`);
    const PART = 4 * 1024 * 1024;
    for (let i = 0, k = 0; i < blob.size; i += PART, k++) { const r = await fetch(`${API_BASE}/api/sermons/${rid}/chunk?i=${k}`, { method: 'PUT', headers: { 'x-user-id': 'demo', 'Content-Type': 'application/octet-stream' }, body: blob.slice(i, i + PART) }); if (!r.ok) return stop(); }
    await sapi('POST', `/api/sermons/${rid}/finish`, { passage: m.ref ? refText(m.ref) : '', passageText: m.passageText || '' });
    m.remoteId = rid; save();
    let n = 0; const tick = async () => { n++; try { const { sermon } = await sapi('GET', `/api/sermons/${rid}`);
      if (sermon.status === 'done' && sermon.summary) { m.summary = sermon.summary; m.transcript = sermon.transcript || ''; m.busy = false; m.pending = false; save(); render(); return; }
      if (sermon.status === 'error' || n > 600) return stop(); } catch { return stop(); } setTimeout(tick, n < 30 ? 2000 : 5000); };
    setTimeout(tick, 1500);
  } catch { stop(); }
}
// No server (preview): what was heard live is sorted by member with Claude through the page.
async function meetingSummarizeLocal(id) {
  const m = (data.meetings || []).find(x => x.id === id); if (!m?.liveText) return;
  const sample = window.claude?.use ? await window.claude.use('sample').catch(() => null) : null; if (!sample) return;
  const members = memberList(m.gid).filter(([k]) => m.attend?.[k]).map(([k]) => nameOf(m.gid, k));
  m.busy = true; save(); render();
  try {
    const A = await sample.json(`You write notes for a church small-group leader from what was said at their meeting. Same language as the transcript. Only what people said; gentle, brief.
Members: ${members.join(', ')}
Return only JSON: {"overview": string, "members": [{"name": string, "sharing": string, "prayer_request": string}], "prayer_topics": string[], "next_steps": string[]}
${m.ref ? `Passage: ${refText(m.ref)}\n` : ''}Transcript:
${m.liveText}`, { modelTier: 'default' });
    m.summary = { overview: String(A.overview || ''), members: [].concat(A.members || []).filter(x => x && x.name).map(x => ({ name: String(x.name), sharing: String(x.sharing || ''), prayer_request: String(x.prayer_request || '') })), prayer_topics: [].concat(A.prayer_topics || []).map(String), next_steps: [].concat(A.next_steps || []).map(String) };
  } catch {}
  m.busy = false; save(); render();
}
function meetingView(id) {
  const m = (data.meetings || []).find(x => x.id === id); if (!m) return;
  const people = memberList(m.gid), here = people.filter(([k]) => m.attend?.[k]), away = people.filter(([k]) => m.attend && !m.attend[k]), S = m.summary;
  showSheet({ title: esc(t('mt.view').replace('{d}', dayLabel(m.date))), body: `
    ${m.ref ? `<p class="gd-label">${icon('book')} ${esc(refText(m.ref))}</p>` : ''}
    <p class="mt-attline"><b>${esc(t('mt.att').replace('{n}', here.length).replace('{t}', people.length))}</b>${away.length ? ` · ${esc(t('mt.absent').replace('{names}', away.map(([k]) => nameOf(m.gid, k)).join(', ')))}` : ''}</p>
    ${m.rec ? `<audio class="med-play" id="mt-audio" controls preload="none"></audio>` : ''}
    ${m.busy ? `<p class="sn-aibusy">${icon('sparkle')}${t('mt.busy')}</p>` : m.pending && !S ? `<p class="hint">${t('mt.pending')}</p>` : ''}
    ${S?.overview ? `<p class="quote">${esc(S.overview)}</p>` : ''}
    ${S?.members?.length ? `<p class="field-label">${t('mt.byMember')}</p><div class="mt-members">${S.members.map(x => `<div class="mt-mem"><b>${esc(x.name)}</b>${x.sharing ? `<p><small>${t('mt.shareL')}</small>${esc(x.sharing)}</p>` : ''}${x.prayer_request ? `<p><small>${t('mt.prayL')}</small>${esc(x.prayer_request)}</p>` : ''}</div>`).join('')}</div>` : ''}
    ${S?.prayer_topics?.length ? `<p class="field-label">${t('mt.prayer')}</p><ul class="sn-list">${S.prayer_topics.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${S?.next_steps?.length ? `<p class="field-label">${t('mt.next')}</p><ul class="sn-list">${S.next_steps.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}
    ${m.notes ? `<p class="field-label">${t('mt.notes')}</p><p class="sn-body">${esc(m.notes)}</p>` : ''}
    ${m.transcript || m.liveText ? `<details class="sn-tr"><summary>${t('sn.transcript')}</summary><p>${esc(m.transcript || m.liveText)}</p></details>` : ''}` });
  if (m.rec) AudioStore.url(m.id).then(u => { const a = $('#mt-audio'); if (a && u) a.src = u; }).catch(() => {});
}
// One member: attendance across meetings, what they shared there, their prayer requests, and the leader's notes.
function memberReport(gid, k) {
  const name = nameOf(gid, k), ms = meetingsOf(gid).filter(m => m.attend && k in m.attend);
  const said = ms.flatMap(m => (m.summary?.members || []).filter(x => x.name === name || x.name === (groupPeople(gid).find(p => p[0] === k) || [])[1]).map(x => ({ d: m.date, ...x })));
  const prayers = data.posts.filter(p => p.kind === 'prayer' && !p.mine && inGroup(p, gid) && authorKey(p) === k).slice(0, 5);
  const notes = data.memberNotes?.[gid]?.[k] || [];
  showSheet({ title: esc(t('rp.title').replace('{name}', name)), body: `
    <p class="field-label">${t('rp.attend')}</p>
    ${ms.length ? `<div class="rp-dots">${ms.slice(0, 12).reverse().map(m => `<span class="${m.attend[k] ? 'on' : ''}" title="${esc(m.date)}"><i></i><small>${esc(shortDate(m.date))}</small></span>`).join('')}</div>` : `<p class="hint">${t('rp.none')}</p>`}
    <p class="field-label">${t('rp.shared')}</p>
    ${said.length ? said.slice(0, 6).map(x => `<div class="mt-mem"><small>${esc(dayLabel(x.d))}</small>${x.sharing ? `<p>${esc(x.sharing)}</p>` : ''}${x.prayer_request ? `<p><small>${t('mt.prayL')}</small>${esc(x.prayer_request)}</p>` : ''}</div>`).join('') : `<p class="hint">${t('rp.none')}</p>`}
    <p class="field-label">${t('rp.prayers')}</p>
    ${prayers.length ? `<ul class="sn-list">${prayers.map(p => `<li>${esc(L(p.text))} <small class="hint">${esc(dayLabel(p.date))}</small></li>`).join('')}</ul>` : `<p class="hint">${t('rp.none')}</p>`}
    <p class="field-label">${t('rp.notes')}</p>
    ${notes.map(n => `<p class="rp-note"><small>${esc(dayLabel(n.d))}</small>${esc(n.t)}</p>`).join('')}
    <form id="rp-form" class="sheet-form"><textarea id="rp-in" class="big-input" rows="2" maxlength="600" placeholder="${esc(t('rp.ph'))}"></textarea><button class="secondary block" type="submit">${t('rp.add')}</button></form>` });
  $('#rp-form').addEventListener('submit', e => { e.preventDefault(); const v = $('#rp-in').value.trim(); if (!v) return;
    data.memberNotes = data.memberNotes || {}; data.memberNotes[gid] = data.memberNotes[gid] || {}; (data.memberNotes[gid][k] = data.memberNotes[gid][k] || []).unshift({ d: today(), t: v }); save(); memberReport(gid, k); });
}
// Pastor: a snapshot of the church dashboard inside a link (#pastor=…; the # part never reaches any server).
function pastorSnapshot() {
  const gs = churchGroups();
  return { c: data.church?.name || '', at: today(), g: gs.map(g => { const w = groupWeek(g.id), m = meetingsOf(g.id)[0], v = m ? Object.values(m.attend || {}) : [];
    const notes = Object.entries(data.memberNotes?.[g.id] || {}).map(([k, arr]) => ({ m: nameOf(g.id, k), t: arr[0]?.t || '' })).filter(x => x.t).slice(0, 8);
    return { n: L(g.name), cat: g.category || '', lead: data.church?.leaders?.[g.id] || '', size: groupSize(g.id), att: attendRate(g.id), wk: [w.thanks, w.meditation, w.prayer],
      last: m ? { d: m.date, r: m.ref ? refText(m.ref) : '', a: `${v.filter(Boolean).length}/${v.length}`, o: (m.summary?.overview || '').slice(0, 280) } : null, notes }; }) };
}
const b64url = obj => btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = str => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(str.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))));
function pastorLinkSheet() {
  const link = `${LEGAL_BASE}/app/#pastor=${b64url(pastorSnapshot())}`;
  state.inviteMsg = link;
  showSheet({ title: t('ps.link'), body: `<p class="hint">${t('ps.desc')}</p><div class="invite-link selectable">${esc(link.slice(0, 120))}…</div>
    <div class="sheet-actions"><button class="primary" data-action="invite-share">${icon('share')}${t('inv.share')}</button><button class="secondary" data-action="ps-copy">${t('inv.copy')}</button><button class="secondary" data-action="ps-preview">${icon('eye')}</button></div>` });
}
const catGroups = gs => { const m = new Map(); gs.forEach(g => { const c = g.category || ''; if (!m.has(c)) m.set(c, []); m.get(c).push(g); }); return [...m.entries()].sort((a, b) => !a[0] ? 1 : !b[0] ? -1 : a[0].localeCompare(b[0])); };
function renderPastor() {
  const P = state.pastorView, cats = new Map(); P.g.forEach(g => { const c = g.cat || ''; if (!cats.has(c)) cats.set(c, []); cats.get(c).push(g); });
  main.innerHTML = `<div class="screen"><div class="page gd church">
    <div class="gd-top"><button class="gd-back" data-action="ps-close">${icon('chevron')}<span>${t('gd.back')}</span></button></div>
    <h1 class="gd-name">${esc(t('ps.title').replace('{c}', P.c))}</h1><p class="g-people">${esc(t('ps.asof').replace('{d}', dayLabel(P.at)))}</p>
    ${[...cats.entries()].map(([c, gs]) => `<p class="gd-label cat-h">${esc(c || t('cat.none'))} · ${esc(t('ps.members').replace('{n}', gs.reduce((n, g) => n + g.size, 0)))}</p>
      <div class="chu-list">${gs.map(g => `<section class="chu-g"><div class="chu-head"><b>${esc(g.n)}</b><span>${g.att != null ? esc(t('dash.att').replace('{p}', g.att)) : ''}</span></div>
        <p class="chu-sub">${g.lead ? esc(t('chu.leader').replace('{name}', g.lead)) + ' · ' : ''}${esc(t('ps.members').replace('{n}', g.size))} · ${t('gs.counts').replace('{t}', g.wk[0]).replace('{m}', g.wk[1]).replace('{p}', g.wk[2])}</p>
        ${g.last ? `<p class="ps-last"><small>${t('ps.lastMeet')} · ${esc(dayLabel(g.last.d))}${g.last.r ? ' · ' + esc(g.last.r) : ''} · ${esc(g.last.a)}</small>${g.last.o ? esc(g.last.o) : ''}</p>` : ''}
        ${g.notes.length ? `<details class="ps-notes"><summary>${t('ps.reports')} (${g.notes.length})</summary>${g.notes.map(x => `<p><b>${esc(x.m)}</b> ${esc(x.t)}</p>`).join('')}</details>` : ''}</section>`).join('')}</div>`).join('')}
  </div></div>`;
}
function churchCreate() {
  showSheet({ title: t('chu.title'), body: `<form id="church-form" class="sheet-form"><input id="church-name" class="field" maxlength="40" placeholder="${esc(t('chu.ph'))}" required><button class="primary block" type="submit">${t('chu.create')}</button></form>` });
  $('#church-form').addEventListener('submit', e => { e.preventDefault(); const name = $('#church-name').value.trim(); if (!name) return;
    data.church = { name, groups: data.groups.filter(g => g.owner || true).map(g => g.id), leaders: {}, sharedPassage: true, admin: true };
    data.groups.forEach(g => { g.owner = true; }); save(); close(); state.churchView = true; render(); });
}
function nickSheet(gid) {
  const people = groupPeople(gid), nn = data.nicknames || {};
  showSheet({ title: t('nick.title'), body: `<p class="hint">${t('nick.hint')}</p><div class="list">${people.map(([k, name]) => `<button class="list-row" data-action="nick-edit" data-id="${esc(gid)}|${esc(k)}|${esc(name)}">
      <span class="row-main"><span class="row-title">${esc(nn[k] || name)}</span>${nn[k] ? `<span class="row-sub">${t('nick.orig').replace('{name}', esc(name))}</span>` : ''}</span><span class="row-end">${icon('pencil')}</span></button>`).join('') || `<p class="hint">${t('gd.empty')}</p>`}</div>` });
}
function nickEdit(gid, k, name) {
  const cur = data.nicknames?.[k] || '';
  showSheet({ title: t('nick.edit'), body: `<form id="nick-form" class="sheet-form"><p class="hint">${t('nick.orig').replace('{name}', esc(name))}</p>
    <input id="nick-in" class="field" maxlength="20" value="${esc(cur)}" placeholder="${esc(t('nick.ph'))}" autocomplete="off">
    <button class="primary block" type="submit">${t('nick.save')}</button>${cur ? `<button type="button" class="subtle-link" data-action="nick-clear" data-id="${esc(gid)}|${esc(k)}">${t('nick.reset')}</button>` : ''}</form>` });
  $('#nick-form').addEventListener('submit', e => { e.preventDefault(); const v = $('#nick-in').value.trim().slice(0, 20);
    data.nicknames = { ...(data.nicknames || {}) }; if (v) data.nicknames[k] = v; else delete data.nicknames[k]; save(); render(); nickSheet(gid); });
}
function groupMenu(gid) {
  const g = data.groups.find(x => x.id === gid); if (!g) return;
  const ch = data.challenges.find(c => c.group === gid), nudged = data.groupNudges?.[gid] === today();
  const row = (action, ic, label, extra = '') => `<button class="list-row" data-action="${action}" data-id="${esc(action === 'challenge-write' ? ch.id : gid)}" ${extra}><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${label}</span></span></button>`;
  showSheet({ title: esc(L(g.name)), body: `<div class="list">
    ${row('group-write', 'pencil', t('gs.write'))}
    ${ch ? row('challenge-write', 'sparkle', `${chName(ch)} · ${ch.days.length}/${chLen(ch)}`) : row('group-challenge', 'sparkle', t('gs.chStart'))}
    ${row('group-nudge', 'bell', nudged ? t('gs.nudged') : t('gs.nudge'), nudged ? 'disabled' : '')}
    ${canInvite(g) ? row('invite-group', 'userplus', t('inv.btn')) : ''}
    ${row('nick-sheet', 'user', t('nick.row'))}
    ${g.owner && featureOn('leader') ? row('group-admin', 'user', t('adm.row')) : ''}
  </div>` });
}
function renderGroups() {
  if (state.pastorView) return renderPastor();
  if (state.churchView && data.church && featureOn('leader')) return renderChurch();
  if (state.groupDetail && data.groups.some(g => g.id === state.groupDetail)) return renderGroupDetail(state.groupDetail);
  state.groupDetail = null;
  main.innerHTML = `<div class="screen"><div class="page">
    ${pageHead(BIBLE_MODE ? t('bn.group') : t('gr.title'), t('gr.desc'), roundBtn('new-group', 'plus', t('gr.new')))}
    ${data.church && featureOn('leader') ? `<button class="j-line chu-entry" data-action="church-open"><span class="j-ic">${icon('people')}</span><span>${t('chu.entry').replace('{name}', esc(data.church.name))}</span><span class="j-go">›</span></button>` : ''}
    <div class="g-list">${data.groups.map(groupBlock).join('')}</div>
    ${featureOn('groupShare') ? groupShareSection() : ''}
  </div></div>`;
}

function renderGroupDetail(gid) {
  const g = data.groups.find(x => x.id === gid), w = groupWeek(gid), ch = data.challenges.find(c => c.group === gid);
  const todayPeople = new Set(data.posts.filter(p => inGroup(p, gid) && p.date === today() && !data.hidden.includes(p.id)).map(p => p.mine ? 'me' : authorKey(p))).size;
  const who = (todayPeople ? t('gs.today').replace('{n}', todayPeople) : w.people ? t('gs.weekPeople').replace('{n}', w.people) : t('gs.quiet')).replace('{total}', groupSize(gid));
  const p = todaysPassage(gid), medN = data.posts.filter(x => x.kind === 'meditation' && inGroup(x, gid) && x.date === today()).length;
  const recent = data.posts.filter(x => inGroup(x, gid) && !data.hidden.includes(x.id)).sort((a, b) => a.date < b.date ? 1 : -1).slice(0, 3);
  const chOf = kind => data.challenges.find(c => c.group === gid && (c.type || 'thanks') === kind && c.days.length < chLen(c));
  const tile = (n, label, kind) => { const c = chOf(kind);
    return `<button class="gd-tile${c ? ' has-ch' : ''}" data-action="gd-all" data-id="${esc(gid)}|${kind}"><b>${n}</b><span>${label}</span>${unseenKind(gid, kind) ? `<i class="new-dot tile-dot" aria-label="${t('gs.new')}"></i>` : ''}
      ${c ? `<small class="tile-ch">${icon('sparkle')}${t('ch.title')} ${c.days.length}/${chLen(c)}</small><i class="tile-bar"><b style="width:${Math.round(c.days.length / chLen(c) * 100)}%"></b></i>` : ''}</button>`; };
  main.innerHTML = `<div class="screen"><div class="page gd">
    <div class="gd-top"><button class="gd-back" data-action="gd-back">${icon('chevron')}<span>${t('gd.back')}</span></button>
      <button class="g-more" data-action="group-menu" data-id="${esc(gid)}" aria-label="${t('more')}">${icon('more')}</button></div>
    <h1 class="gd-name">${esc(L(g.name))}</h1>
    <p class="g-people">${who}</p>
    ${g.meetingLive?.date === today() && g.meetingLive.ref ? `<button class="mt-live" data-action="mt-join" data-id="${esc(gid)}"><i class="rec-dot"></i><span>${esc(t('ld.live').replace('{r}', refText(g.meetingLive.ref)))}</span><b>${t('ld.join')} ›</b></button>` : ''}
    ${g.owner && featureOn('leader') ? leaderTools(gid) : ''}
    <div class="gs-week">${w.days.map((on, i) => { const d = new Date(); d.setDate(d.getDate() - (6 - i));
      return `<span class="gs-day${i === 6 ? ' today' : ''}"><i class="${on ? 'on' : ''}"></i><small>${i === 6 ? t('gs.todayShort') : esc(d.toLocaleDateString(lang(), { weekday: 'narrow' }))}</small></span>`; }).join('')}</div>
    ${p?.ref ? `<section class="gd-devo"><p class="gd-kicker">${icon('book')}<span>${t('devo.kicker')}${p.source ? ' · ' + esc(p.source) : ''}</span></p>
      <p class="gd-ref">${esc(refText(p.ref))}</p>${medN ? `<p class="gd-sub">${t('devo.count').replace('{n}', medN)}</p>` : ''}
      <div class="gd-acts"><button class="primary" data-action="devo-read" data-id="${esc(gid)}">${t('devo.read')}</button><button class="secondary" data-action="devo-share" data-id="${esc(gid)}">${t('devo.share')}</button></div></section>` : ''}
    <p class="gd-label">${t('gd.week')}</p>
    <div class="gd-tiles">${tile(w.thanks, t('gd.thanks'), 'thanks')}${tile(w.meditation, t('gd.med'), 'meditation')}${tile(w.prayer, t('gd.prayer'), 'prayer')}</div>
    ${ch ? `<button class="g-ch" data-action="${chDone(ch) ? 'ch-result' : 'challenge-write'}" data-id="${esc(ch.id)}"><span>${chName(ch)} <em class="g-ch-d${chDone(ch) ? ' done' : ''}">${chDday(ch)}</em></span>
      ${chLen(ch) <= 7 ? `<span class="g-ch-days">${Array.from({ length: chLen(ch) }, (_, i) => `<i class="${i < ch.days.length ? 'on' : ''}"></i>`).join('')}</span>`
        : `<span class="g-ch-bar"><b style="width:${Math.round(ch.days.length / chLen(ch) * 100)}%"></b></span><span class="g-ch-n">${ch.days.length}/${chLen(ch)}</span>`}
      <span class="g-ch-go">${chDone(ch) ? t('chr.see') : ch.type === 'bible' ? (ch.plan ? esc(chPlanText(chPlanDay(ch, Math.min(ch.days.length, chLen(ch) - 1)))) : t('ch.read')) : t('gs.chToday')} ›</span></button>` : ''}
    ${ch ? chTopHtml(ch) : ''}
    <p class="gd-label">${t('gd.recent')}</p>
    ${recent.length ? `<div class="gd-recent">${recent.map(x => `<button class="gd-post" data-action="gd-all" data-id="${esc(gid)}|all"><span class="gd-meta">${esc(authorName(x))} · ${esc(x.kind && x.kind !== 'today' ? kindLabel(x) : dayLabel(x.date))}</span><span class="gd-text">${esc(L(x.text))}</span></button>`).join('')}</div>` : `<p class="hint">${t('gd.empty')}</p>`}
    <button class="primary block gd-allbtn" data-action="gd-all" data-id="${esc(gid)}|all">${t('gd.all')}</button>
    <div class="gd-row"><button class="secondary" data-action="group-write" data-id="${esc(gid)}">${icon('pencil')}${t('gd.share')}</button><button class="secondary" data-action="invite-group" data-id="${esc(gid)}">${icon('userplus')}${t('gd.invite')}</button></div>
  </div></div>`;
}
/* ======================= daily bible =======================
   Read (where you left off · the dial · today's passage), Sermon notes (AI, one page) and Me. */
function bibleShell() {
  document.querySelectorAll('.wordmark').forEach(w => { w.innerHTML = 'daily <em>bible</em>'; });
  const sp = document.getElementById('splash'); if (sp) sp.setAttribute('aria-label', 'daily bible');
  const tag = document.querySelector('#splash .splash-tag'); if (tag) tag.innerHTML = '<span>Read the Word daily.</span><span>Take notes.</span><span>Live it.</span>';
  const pill = document.querySelector('.write-pill'); if (pill) { pill.dataset.action = 'bible-write'; pill.classList.add('plus-only'); pill.setAttribute('aria-label', '+'); pill.querySelector('.label').remove(); } // sermon notes have their own tab; + is for writing
  const brand = document.querySelector('.topbar .brand-sun'); if (brand) brand.dataset.icon = 'book';
  // language switch beside the + (shown on every screen for the first few visits)
  if (pill && !document.querySelector('.top-right')) { const box = document.createElement('div'); box.className = 'top-right'; pill.before(box);
    box.innerHTML = `<button class="top-lang" data-action="lang-menu" hidden></button>`; box.append(pill); }
  const nav = document.querySelector('.bottom-nav');
  // feed (the full-screen scroll) · read · sermon notes · groups · me — writing is the + button at the top right (감사 · 기도제목 · 묵상 · 감사 전하기)
  const tabBtn = ([id, ic, k]) => `<button data-tab="${id}"><span class="nav-ico" data-icon="${ic}"></span><span data-i18n="${k}"></span></button>`;
  if (nav) { nav.classList.add('bb-nav'); nav.innerHTML = `<button data-action="fullscreen" class="nav-feed"><span class="nav-ico" data-icon="sun"></span><span data-i18n="bn.feed"></span></button>`
    + tabBtn(['read', 'book', 'bb.read'])
    + [['notes', 'mic', 'bb.notes'], ['group', 'people', 'bn.group'], ['me', 'user', 'bb.me']].map(tabBtn).join(''); }
}
// A reading day: a chapter finished, or at least a minute spent reading (same rule as the dashboard).
const readDaySet = () => new Set([...Object.values(data.readLog || {}), ...Object.entries(data.readTime || {}).filter(([, sec]) => sec >= 60).map(([d]) => d)]);
function streakHtml() {
  const days = readDaySet(), n = readDays(), done = days.has(today()), best = readDash().longest;
  const week = Array.from({ length: 7 }, (_, i) => daysAgo(6 - i));
  const wd = d => new Date(d + 'T00:00:00').toLocaleDateString(lang(), { weekday: 'narrow' });
  return `<section class="stk ${done ? 'done' : ''}">
    <div class="stk-main"><span class="stk-flame">${icon('book')}</span><div><b class="stk-n">${n ? esc(t('stk.n').replace('{n}', n)) : esc(t('stk.sub'))}</b>
      <span class="stk-sub">${n ? (done ? t('stk.todayDone') : t('stk.todayNot')) : t('stk.start')}${best > n ? ' · ' + esc(t('stk.best').replace('{n}', best)) : ''}</span></div></div>
    <div class="stk-week">${week.map(d => `<span class="${days.has(d) ? 'on' : ''} ${d === today() ? 'today' : ''}"><i></i><small>${esc(wd(d))}</small></span>`).join('')}</div>
  </section>`;
}
function readDays() { const days = readDaySet(); let i = days.has(today()) ? 0 : 1, n = 0; while (days.has(daysAgo(i))) { n++; i++; } return n; }
function renderBibleHome() {
  const r = data.reading, gid = data.groups[0]?.id || 'me', p = todaysPassage(data.groups[0]?.id);
  const plans = data.challenges.filter(c => c.type === 'bible' && !chDone(c));
  main.innerHTML = `<div class="screen"><div class="page bb">
    ${streakHtml()}
    ${plans.some(c => c.lastDay !== today()) ? planSection(plans) : ''}
    <section class="bb-cont">
      <p class="gd-label">${t('bb.where')}</p>
      <p class="bb-ref">${r ? esc(refText({ b: r.b, c: r.c, v: r.v || 1, v2: r.v || 1 })) : t('bb.start')}</p>
      ${r?.at ? `<p class="gd-sub">${esc(dayLabel(r.at.slice(0, 10)))}</p>` : ''}
      <div class="gd-acts"><button class="primary" data-action="bb-continue">${icon('book')}${t('bb.continue')}</button><button class="secondary" data-action="reader-pick">${t('bb.pick')}</button></div>
    </section>
    ${readStatsRow()}
    ${p?.ref ? `<section class="gd-devo"><p class="gd-kicker">${icon('sun')}<span>${t('bb.today')}${p.source ? ' · ' + esc(p.source) : ''}</span></p>
      <p class="gd-ref">${esc(refText(p.ref))}</p>
      <div class="gd-acts"><button class="primary" data-action="bb-today">${t('bb.readToday')}</button></div></section>` : ''}
    ${plans.some(c => c.lastDay !== today()) ? '' : planSection(plans)}
  </div></div>`;
}
function planSection(plans) {
  return `<section class="pl">
      <div class="pl-head"><p class="gd-label">${t('pl.title')}</p><button class="secondary pl-new" data-action="plan-new">${icon('plus')}${t('pl.new')}</button></div>
      ${plans.length ? '' : `<p class="hint">${t('pl.sub')}</p>`}
      ${plans.map(c => `<div class="pl-row"><button class="g-ch${c.lastDay === today() ? ' today-done' : ''}" data-action="challenge-write" data-id="${esc(c.id)}"><span>${esc(L(c.name) || chName(c))} <em class="g-ch-d">${c.lastDay === today() ? icon('check') : ''}${chDday(c)}</em></span>
        <span class="g-ch-bar"><b style="width:${Math.round(c.days.length / chLen(c) * 100)}%"></b></span><span class="g-ch-go">${c.plan ? esc(chPlanText(chPlanDay(c, Math.min(c.days.length, chLen(c) - 1)))) : t('ch.read')} ›</span>
        ${planBehind(c) && c.cuDismissed !== today() ? `<span class="pl-behind" data-action="cu-ask" data-id="${esc(c.id)}">${esc(t('cu.short').replace('{n}', planBehind(c).behind))} ›</span>` : ''}
        ${(c.members || []).length > 1 ? `<span class="pl-with">${icon('people')}${esc((c.members || []).map(m => L(m)).join(', '))}</span>` : ''}</button>
        <button class="round-btn pl-inv" data-action="plan-invite" data-id="${esc(c.id)}" aria-label="${esc(t('pl.invite'))}">${icon('share')}</button></div>`).join('')}
    </section>`;
}
// ---- sermon notes: the server summarizes (Claude) when it's connected; otherwise notes wait on the device ----
const API_BASE = window.DT_API ?? '';
const NOTE_FREE = 10, NOTE_FAIR = 60;
async function sapi(method, url, body) {
  const blob = body instanceof Blob;
  const res = await fetch(API_BASE + url, { method, headers: { 'x-user-id': 'demo', ...(blob ? { 'Content-Type': body.type || 'audio/webm' } : body ? { 'Content-Type': 'application/json' } : {}) }, body: blob ? body : body ? JSON.stringify(body) : undefined });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(out.error || res.statusText), { code: out.error, status: res.status, data: out });
  return out;
}
async function sermonSync() {
  if (state.snChecked) return; state.snChecked = true;
  try { state.snQuota = await sapi('GET', '/api/sermons/quota'); state.snOnline = true;
    const { sermons } = await sapi('GET', '/api/sermons'); state.snRemote = sermons || []; if (state.tab === 'notes') render(); } catch { state.snOnline = false; }
}
const EXAMPLE_NOTE = () => ({ id: 'example', example: true, status: 'done', date: today(), title: { ko: '거듭남', en: 'Born again', es: 'Nacer de nuevo' }[lang()] || 'Born again', preacher: '',
  summary: lang() === 'ko' ? { passages: ['요한복음 3:1-15'], main_message: '하나님 나라는 노력으로 들어가는 곳이 아니라, 성령으로 새로 태어날 때 보이고 들어가는 곳이에요.', points: [{ heading: '밤에 찾아온 니고데모', detail: '모든 것을 갖춘 사람도 마음 깊은 곳에서는 하나님을 찾고 있었어요.' }, { heading: '물과 성령으로', detail: '새 생명은 스스로 만들 수 없고, 위로부터 주어지는 선물이에요.' }, { heading: '들린 뱀처럼', detail: '광야의 놋뱀처럼 십자가를 바라보는 사람에게 영생이 있어요.' }], application: ['이번 주, 내 힘으로 하려던 일 하나를 기도로 맡겨 보기', '매일 아침 요한복음 3:16을 소리 내어 읽기'], prayer_topics: ['새 마음을 주시도록', '아직 예수님을 모르는 가족을 위해'], discussion_questions: ['나에게 "거듭남"은 어떤 의미인가요?', '니고데모처럼 밤에 찾아가고 싶은 질문이 있나요?'],
      verse_checks: [{ reference: '요한복음 3:3', quoted: '사람이 거듭나지 아니하면 하나님의 나라를 볼 수 없느니라', status: 'match', note: '' }, { reference: '요한복음 3:14', quoted: '모세가 광야에서 뱀을 든 것 같이 인자도 들려야 하리니', status: 'paraphrase', note: '' }, { reference: '요한복음 3:6', quoted: '바람이 임의로 불매 그 소리를 들어도', status: 'unsure', note: '바람 이야기는 3:8 말씀일 수 있어요.' }] }
    : { passages: ['John 3:1-15'], main_message: 'We don’t earn our way into God’s kingdom — we see it and enter it when the Spirit gives us new birth.', points: [{ heading: 'Nicodemus at night', detail: 'Even someone who had everything was quietly searching for God.' }, { heading: 'Water and Spirit', detail: 'New life can’t be made by effort; it is a gift from above.' }, { heading: 'Lifted up', detail: 'Like the bronze serpent, whoever looks to the cross receives life.' }], application: ['This week, hand one thing you were forcing over to God in prayer', 'Read John 3:16 aloud each morning'], prayer_topics: ['For a new heart', 'For family who don’t know Jesus yet'], discussion_questions: ['What does “born again” mean to you?', 'What question would you bring to Jesus at night?'],
      verse_checks: [{ reference: 'John 3:3', quoted: 'Unless one is born again, he cannot see the kingdom of God', status: 'match', note: '' }, { reference: 'John 3:14', quoted: 'As Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up', status: 'paraphrase', note: '' }, { reference: 'John 3:6', quoted: 'The wind blows where it wishes', status: 'unsure', note: 'The wind is in verse 8, not 6.' }] },
  ref: { b: 43, c: 3, v: 1, v2: 15 },
  transcript: lang() === 'ko' ? '오늘 함께 나눌 말씀은 요한복음 삼 장 일 절부터 십오 절까지입니다.\n밤에 예수님을 찾아온 니고데모는 존경받는 바리새인이었습니다. 그런데 예수님은 그에게 사람이 거듭나지 아니하면 하나님의 나라를 볼 수 없다고 말씀하십니다.\n첫째, 거듭남은 우리의 노력이 아니라 성령의 일하심입니다. 바람이 임의로 불매 그 소리를 들어도 어디서 오는지 알지 못하는 것처럼 성령으로 난 사람도 그러합니다.\n둘째, 거듭남은 십자가를 바라봄으로 시작됩니다. 모세가 광야에서 뱀을 든 것 같이 인자도 들려야 하리니 그를 믿는 자마다 영생을 얻게 하려 하심입니다.\n이번 한 주, 우리의 신앙이 밤에만 머무르지 않고 일상의 빛 가운데서 드러나기를 바랍니다.'
    : 'Today we read John chapter three, verses one to fifteen.\nNicodemus came to Jesus by night. Jesus told him that unless one is born again, he cannot see the kingdom of God.\nFirst, new birth is the work of the Spirit, not our effort. The wind blows where it wishes, and so is everyone born of the Spirit.\nSecond, it begins by looking to the cross. As Moses lifted up the serpent in the wilderness, so must the Son of Man be lifted up.\nThis week, may our faith not stay in the night but show in the light of everyday life.' });
const sermonNotes = () => {
  const local = data.sermonNotes || [];
  const linked = new Set(local.map(n => n.remoteId).filter(Boolean));
  const remote = (state.snRemote || []).filter(x => !linked.has(x.id)).map(x => ({ ...x, remote: true, date: (x.createdAt || '').slice(0, 10) }));
  const all = [...remote, ...local.filter(n => !remote.some(r => r.id === n.id))].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return all.length ? all : [EXAMPLE_NOTE()];
};
// Google-style space: lots of free room; when it fills up, delete recordings or get more space. No counter on screen.
const FREE_BYTES = 1024 ** 3, PAID_BYTES = 100 * 1024 ** 3;
const noteBytes = n => n.rec?.bytes || new Blob([n.transcript || n.liveText || '']).size;
const noteQuota = () => {
  if (state.snOnline && state.snQuota?.unit === 'bytes') return state.snQuota;
  const plan = data.settings.biblePlan && data.settings.biblePlan.until > new Date().toISOString() ? data.settings.biblePlan : null;
  const kept = (data.sermonNotes || []).filter(n => !n.manual || n.ai || n.rec), month = kept.filter(n => n.date >= daysAgo(30)).length;
  const made = (data.sermonNotes || []).filter(n => n.ai || n.rec).concat((data.meetings || []).filter(m => m.rec));
  return { plan: plan?.plan || 'free', used: kept.reduce((x, n) => x + noteBytes(n), 0), limit: plan ? PAID_BYTES : FREE_BYTES, unit: 'bytes', monthUsed: month, monthLimit: plan ? NOTE_FAIR : null,
    dayUsed: made.filter(n => n.date === today()).length, dayLimit: plan ? 10 : 3, weekUsed: made.filter(n => n.date >= daysAgo(6)).length, weekLimit: plan ? 40 : 10 };
};
const quotaFull = q => q.used >= q.limit || (q.plan !== 'free' && q.monthLimit && q.monthUsed >= q.monthLimit);
// Usage, Claude-style: tucked away under Settings › Storage, small type, thin bars, when each limit refills.
const fmtLeft = iso => { const ms = Date.parse(iso || '') - Date.now(); if (!(ms > 0)) return ''; const h = ms / 36e5;
  return h >= 48 ? t('us.d').replace('{n}', Math.ceil(h / 24)) : h >= 1 ? t('us.h').replace('{n}', Math.ceil(h)) : t('us.m').replace('{n}', Math.max(1, Math.ceil(ms / 6e4))); };
const fmtBytes = b => b >= 1024 ** 3 ? `${(b / 1024 ** 3).toFixed(b >= 10 * 1024 ** 3 ? 0 : 1)} GB` : b >= 1024 ** 2 ? `${Math.round(b / 1024 ** 2)} MB` : `${Math.max(0, Math.round(b / 1024))} KB`;
function usageSheet() {
  const q = noteQuota(), now = new Date();
  const nextMid = (() => { const d = new Date(); d.setHours(24, 0, 0, 0); return d.toISOString(); })();
  const nextWeek = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return d.toISOString(); })();   // next Monday 0:00
  // "Resets at 2:20 AM" today/tomorrow, or "Resets Sun 5:00 PM" further out
  const when = iso => { const d = new Date(iso); if (isNaN(d)) return ''; const time = d.toLocaleTimeString(lang(), { hour: 'numeric', minute: '2-digit' });
    const sameDay = d.toDateString() === now.toDateString(), tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
    return sameDay ? t('us.at').replace('{t}', time) : d.toDateString() === tomorrow.toDateString() ? t('us.atTom').replace('{t}', time) : t('us.atDay').replace('{d}', d.toLocaleDateString(lang(), { weekday: 'short' })).replace('{t}', time); };
  const card = (title, used, limit, sub) => { const pct = limit ? Math.min(100, Math.round(used / limit * 100)) : 0;
    return `<div class="us-card${pct >= 100 ? ' full' : pct >= 75 ? ' high' : ''}"><div class="us-top"><b>${title}</b><span>${t('us.used').replace('{p}', pct)}</span></div><i class="us-bar"><b style="width:${pct}%"></b></i>${sub ? `<small>${sub}</small>` : ''}</div>`; };
  const extra = (data.settings.usageGifts || []).filter(x => x.until > now.toISOString());
  showSheet({ title: `<span class="us-title">${t('us.title')}</span>`, body: `<div class="us">
    <button class="us-refresh round-btn" data-action="us-refresh" aria-label="${esc(t('us.refresh'))}">${icon('reset')}</button>
    <p class="us-sec">${t('us.secSum')}</p>
    ${card(t('us.day'), q.dayUsed || 0, q.dayLimit, t('us.reset2').replace('{w}', when(q.dayReset || nextMid)))}
    <p class="us-sec">${t('us.secWeek')}</p>
    ${card(t('us.week'), q.weekUsed || 0, q.weekLimit, t('us.reset2').replace('{w}', when(q.weekReset || nextWeek)))}
    <p class="us-sec">${t('us.secSpace')}</p>
    ${card(t('us.spaceCard'), q.used || 0, q.limit, `${fmtBytes(q.used || 0)} / ${fmtBytes(q.limit)}`)}
    <p class="us-sec">${t('us.secExtra')}</p>
    <div class="us-card">${extra.length ? extra.map(x => `<div class="us-top"><b>${esc(x.label)}</b><span>${esc(when(x.until))}</span></div>`).join('') : `<b class="us-none">${t('us.noExtra')}</b><small>${t('us.noExtraSub')}</small>`}</div>
    <button class="link-btn us-more" data-action="pw-open">${t('us.more')}</button></div>` });
}
function renderSermons() {
  sermonSync();
  if (state.noteOpen) return renderSermonNote(state.noteOpen);
  const q = noteQuota(), notes = sermonNotes();
  const status = n => n.example ? t('sn.example') : n.aiBusy ? t('sn.working') : n.recPending ? t('sn.offline') : n.status === 'done' ? '' : n.status === 'error' ? t('sn.failed') : !state.snOnline && n.status === 'waiting' ? t('sn.offline') : n.status === 'queued' ? t('sn.queued') : t('sn.working');
  main.innerHTML = `<div class="screen"><div class="page bb">
    ${pageHead(t('sn.title'), '', roundBtn('sermon-new', 'plus', t('sn.new')))}
    ${recLive() ? `<button class="rec-bar" id="rec-bar" data-action="sermon-new"><i class="rec-dot"></i><span>${t('rec.bar').replace('{t}', fmtDur(Rec.seconds))}</span></button>` : ''}
    <label class="sn-search">${icon('search')}<input id="sn-q" type="search" enterkeyhint="search" autocomplete="off" placeholder="${esc(t('ss.ph'))}" value="${esc(state.snQuery || '')}">
      <button type="button" class="link-btn sn-qx" data-action="sn-q-clear" ${state.snQuery ? '' : 'hidden'}>${t('ss.clear')}</button></label>
    <p class="hint" ${state.snQuery ? 'hidden' : ''} id="sn-sub">${t('sn.sub')}</p>
    ${'' && `<div class="sn-quota"><span>${q.plan === 'free' ? t('sn.free').replace('{n}', q.used).replace('{t}', q.limit) : t('sn.plan').replace('{plan}', t('sn.' + q.plan)).replace('{n}', q.monthUsed).replace('{t}', q.monthLimit)}</span>
      ${q.plan === 'free' ? `<i class="sn-bar"><b style="width:${Math.min(100, q.used / q.limit * 100)}%"></b></i>` : ''}</div>`}
    <div id="sn-list">${noteList(notes, status)}</div>
  </div></div>`;
  const qi = $('#sn-q');
  qi?.addEventListener('input', () => { state.snQuery = qi.value; const l = $('#sn-list'); if (l) l.innerHTML = noteList(sermonNotes(), status);
    const x = $('.sn-qx'); if (x) x.hidden = !qi.value; const sub = $('#sn-sub'); if (sub) sub.hidden = !!qi.value; });
}
/* Sermon note search: every word must appear somewhere in the note — title, pastor, church, passage, summary,
   my own notes or the full transcript. Results show where it matched, with the words marked. */
const snTerms = () => String(state.snQuery || '').toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6);
const noteFields = n => { const S = n.summary || {};
  return { top: [n.title, S.title, n.preacher, n.church, (S.passages || []).join(' '), n.ref ? refText(n.ref) : '', n.date, n.context].filter(Boolean).join(' · '),
    sum: [S.main_message, (S.points || []).map(x => `${x.heading} ${x.detail}`).join(' '), (S.application || []).join(' '), (S.prayer_topics || []).join(' '), (S.discussion_questions || []).join(' '), n.body].filter(Boolean).join(' '),
    tr: n.transcript || n.liveText || '' }; };
const markTerms = (text, terms) => { let h = esc(text); terms.forEach(tm => { const e = esc(tm).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); if (e) h = h.replace(new RegExp(e, 'gi'), m => `<mark>${m}</mark>`); }); return h; };
function noteHit(n, terms) {
  const f = noteFields(n), all = `${f.top}\n${f.sum}\n${f.tr}`.toLowerCase();
  if (!terms.every(tm => all.includes(tm))) return null;
  const where = ['sum', 'tr'].find(k => f[k].toLowerCase().includes(terms[0])) || null;
  let snip = '';
  if (where) { const txt = f[where].replace(/\s+/g, ' '), i = txt.toLowerCase().indexOf(terms[0]), a = Math.max(0, i - 28), b = Math.min(txt.length, i + terms[0].length + 52);
    snip = (a ? '…' : '') + txt.slice(a, b) + (b < txt.length ? '…' : ''); }
  return { where, snip };
}
function noteList(notes, status) {
  const terms = snTerms();
  const rows = terms.length ? notes.map(n => ({ n, hit: noteHit(n, terms) })).filter(x => x.hit) : notes.map(n => ({ n, hit: null }));
  if (terms.length && !rows.length) return `<p class="hint sn-none">${esc(t('ss.none').replace('{q}', state.snQuery.trim()))}</p>`;
  const m = x => terms.length ? markTerms(x, terms) : esc(x);
  return `${terms.length ? `<p class="sn-count">${esc(t('ss.count').replace('{n}', rows.length))}</p>` : ''}<div class="notes">${rows.map(({ n, hit }) => `<button class="note" data-action="note-open" data-id="${esc(n.id)}">
      <span class="note-meta"><span>${m(dayLabel(n.date || today()) + (n.preacher ? ' · ' + n.preacher : '') + (terms.length && n.church ? ' · ' + n.church : ''))}</span>${status(n) ? `<span class="badge">${esc(status(n))}</span>` : ''}</span>
      <span class="note-text">${m(n.title || n.summary?.title || t('sn.title'))}</span>
      ${terms.length && (n.summary?.passages || []).length ? `<span class="note-ref">${m(n.summary.passages.join(', '))}</span>` : ''}
      ${hit?.snip ? `<span class="note-reflect">${hit.where === 'tr' ? `<small class="sn-where">${t('ss.inTr')}</small> ` : ''}${m(hit.snip)}</span>`
        : n.summary?.main_message ? `<span class="note-reflect">${m(n.summary.main_message)}</span>` : ''}</button>`).join('')}</div>`;
}
async function renderSermonNote(id) {
  let n = sermonNotes().find(x => x.id === id);
  if (n?.remote && !n.summary && state.snOnline) { try { const { sermon } = await sapi('GET', `/api/sermons/${id}`); n = { ...n, ...sermon }; } catch {} }
  if (!n) { state.noteOpen = null; return renderSermons(); }
  const S = n.summary, list = (arr, cls = '') => arr?.length ? `<ul class="sn-list ${cls}">${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const tab = state.noteTab || 'sum', checks = S?.verse_checks || [], unsure = checks.filter(c => vcStatus(c) === 'unsure' && !c.confirmed).length;
  const tr = n.transcript || n.liveText || '';
  const sumHtml = S ? `${unsure ? `<button class="vc-banner" data-action="note-tab" data-id="pass">${icon('book')}<span>${t('vc.banner').replace('{n}', unsure)}</span>${icon('chevron')}</button>` : ''}
      ${S.main_message ? `<section class="sn-sec sn-main"><p class="gd-label">${t('sn.main')}</p><p>${esc(S.main_message)}</p></section>` : ''}
      ${n.rec ? `<section class="sn-sec"><p class="gd-label">${icon('mic')} ${t('rec.listen')} · ${fmtDur(n.rec.dur || 0)}</p><audio class="med-play" id="note-rec" controls preload="none"></audio></section>` : ''}
      ${n.manual && n.aiBusy ? `<p class="sn-aibusy">${icon('sparkle')}${n.rec ? t('rec.busy') : t('sn.aiBusy')}</p>`
        : n.rec && !n.ai ? `<p class="hint">${t('rec.pending')}</p><button class="secondary block sn-aibtn" data-action="note-upload" data-id="${esc(n.id)}">${icon('upload')}${t('rec.retry')}</button>`
        : n.manual && !n.ai ? `<button class="secondary block sn-aibtn" data-action="note-ai" data-id="${esc(n.id)}">${icon('sparkle')}${t('sn.aiBtn')}</button>` : ''}
      ${n.manual && n.ai ? `<p class="gd-label sn-aitag">${icon('sparkle')}${t('sn.aiTag')}</p>` : ''}
      ${S.points?.length ? `<section class="sn-sec"><p class="gd-label">${t('sn.points')}</p><ol class="sn-points">${S.points.map(x => `<li><b>${esc(x.heading)}</b><span>${esc(x.detail)}</span></li>`).join('')}</ol></section>` : ''}
      ${S.application?.length ? `<section class="sn-sec"><p class="gd-label">${t('sn.apply')}</p>${list(S.application)}</section>` : ''}
      ${S.prayer_topics?.length ? `<section class="sn-sec"><p class="gd-label">${t('sn.prayer')}</p>${list(S.prayer_topics)}</section>` : ''}
      ${S.discussion_questions?.length ? `<section class="sn-sec"><p class="gd-label">${t('sn.questions')}</p>${list(S.discussion_questions)}</section>` : ''}
      ${n.body ? `<section class="sn-sec"><p class="gd-label">${t('sn.body')}</p><p class="sn-body">${esc(n.body)}</p></section>` : ''}
      <button class="primary block sn-tomed" data-action="note-tomed" data-id="${esc(n.id)}">${icon('pencil')}${t('sn.toMed')}</button>
      ${data.groups.length ? `<button class="secondary block sn-tomed" data-action="note-group" data-id="${esc(n.id)}">${icon('people')}${t('sn.toGroup')}</button>` : ''}`
    : `<p class="hint">${n.status === 'error' ? t('sn.failed') : state.snOnline ? t('sn.working') : t('sn.offline')}</p>`;
  const trHtml = tr ? `<div class="sn-trtext">${tr.split(/\n+/).map(x => `<p>${snTerms().length ? markTerms(x, snTerms()) : esc(x)}</p>`).join('')}</div>` : `<p class="hint">${t('nt.noTr')}</p>`;
  const passRef = n.ref || parseRef(S?.passages?.[0] || '');
  const moreRefs = (n.refs || []).filter(Boolean), multi = !!(passRef && moreRefs.length);
  const passHtml = `${passRef ? `<section class="sn-sec"><p class="gd-label">${icon('book')} ${esc(refText(passRef))}</p><div class="sn-ptext" id="sn-ptext">${n.passageText && !multi ? passageHtml(n.passageText) : `<p class="hint">${t('rd.loading')}</p>`}</div></section>` : ''}
    ${multi ? moreRefs.map((r, k) => `<section class="sn-sec"><p class="gd-label">${icon('book')} ${esc(refText(r))}</p><div class="sn-ptext" id="sn-ptext-${k}"><p class="hint">${t('rd.loading')}</p></div></section>`).join('') : ''}
    <section class="sn-sec"><p class="gd-label">${t('vc.title')}</p>${checks.length ? checks.map((c, k) => vcHtml(n, c, k)).join('') : `<p class="hint">${t('vc.none')}</p>`}</section>`;
  main.innerHTML = `<div class="screen"><div class="page bb sn-page">
    <div class="gd-top"><button class="gd-back" data-action="note-back">${icon('chevron')}<span>${t('sn.back')}</span></button></div>
    <p class="gd-label">${esc(dayLabel(n.date || today()))}${n.preacher ? ' · ' + esc(n.preacher) : ''}${n.church ? ' · ' + esc(n.church) : ''}${n.example ? ' · ' + t('sn.example') : n.manual ? ' · ' + t('sn.manual') : ''}</p>
    <h1 class="gd-name">${esc(n.title || S?.title || t('sn.title'))}</h1>
    ${S?.passages?.length ? `<div class="sn-passages">${S.passages.map(x => `<button class="chip" data-action="note-passage" data-id="${esc(x)}">${icon('book')}${esc(x)}</button>`).join('')}</div>` : ''}
    <div class="seg sn-tabs">${[['sum', t('nt.sum')], ['tr', t('nt.tr')], ['pass', t('nt.pass')]].map(([k, l]) => `<button class="${tab === k ? 'active' : ''}" data-action="note-tab" data-id="${k}">${l}${k === 'pass' && unsure ? ` <i class="vc-dot"></i>` : ''}</button>`).join('')}</div>
    <div class="sn-tabbody">${tab === 'tr' ? trHtml : tab === 'pass' ? passHtml : sumHtml}</div>
    ${n.example ? '' : `<div class="gd-row"><button class="secondary" data-action="note-share" data-id="${esc(n.id)}">${icon('share')}${t('sn.share')}</button><button class="secondary" data-action="note-del" data-id="${esc(n.id)}">${icon('trash')}${t('sn.delete')}</button></div>`}
  </div></div>`;
  if (n.rec && tab === 'sum') AudioStore.url(n.id).then(u => { const a = $('#note-rec'); if (a && u) a.src = u; }).catch(() => {});
  if (tab === 'pass') {
    if (multi) moreRefs.forEach((r, k) => passageVerses(r).then(vs => { const el = $(`#sn-ptext-${k}`); if (el) el.innerHTML = passageHtml(vs.map(x => `${x.c}:${x.v} ${x.text}`).join('\n')); }).catch(() => { const el = $(`#sn-ptext-${k}`); if (el) el.innerHTML = `<p class="hint">${t('vc.noOrig')}</p>`; }));
    if (passRef && (!n.passageText || multi)) passageVerses(passRef).then(vs => { const el = $('#sn-ptext'); if (el) el.innerHTML = passageHtml(vs.map(x => `${x.c}:${x.v} ${x.text}`).join('\n')); }).catch(() => { const el = $('#sn-ptext'); if (el) el.innerHTML = `<p class="hint">${t('vc.noOrig')}</p>`; });
    checks.forEach((c, k) => vcOriginal(c).then(o => { const el = $(`#vc-o-${k}`); if (el) el.textContent = o || t('vc.noOrig');
      const st = vcStatus(c, o); const box = $(`#vc-${k}`); if (box && st !== box.dataset.st) { c._auto = st; renderSermonNote(id); } }));
  }
}
const passageHtml = txt => String(txt).split('\n').map(l => { const m = l.match(/^(\d+):(\d+)\s(.*)$/); return m ? `<p><sup>${m[2]}</sup>${esc(m[3])}</p>` : `<p>${esc(l)}</p>`; }).join('');
// Similarity of what was said and the Bible text (shared letter pairs), to double-check the AI's "match".
function textSim(a, b) {
  const grams = x => { x = String(x || '').toLowerCase().replace(/[\s\p{P}\p{S}\d]/gu, ''); const m = new Map(); for (let i = 0; i < x.length - 1; i++) { const k = x.slice(i, i + 2); m.set(k, (m.get(k) || 0) + 1); } return [m, Math.max(1, x.length - 1)]; };
  const [A, na] = grams(a), [B, nb] = grams(b); let hit = 0; A.forEach((n, k) => { hit += Math.min(n, B.get(k) || 0); }); return 2 * hit / (na + nb);
}
const vcOrigMem = {};
async function vcOriginal(c) {
  const r = parseRef(c.reference); if (!r) return '';
  const key = refText(r); if (key in vcOrigMem) return vcOrigMem[key];
  try { const vs = await passageVerses(r.v ? r : { ...r, v: 1, v2: 3 }); return (vcOrigMem[key] = vs.map(x => x.text).join(' ')); } catch { return ''; }
}
// The AI's verdict, checked again here: an unknown reference, or a "match" whose words don't line up with the text, needs the listener.
function vcStatus(c, orig) {
  if (c.confirmed) return 'ok';
  if (!parseRef(c.reference)) return 'unsure';
  if (c._auto) return c._auto;
  const o = orig ?? vcOrigMem[refText(parseRef(c.reference))];
  if (o && c.quoted && c.status === 'match' && textSim(c.quoted, o) < 0.3) return 'unsure';
  return c.status || 'unsure';
}
function vcHtml(n, c, k) {
  const st = vcStatus(c), lab = { match: t('vc.match'), paraphrase: t('vc.para'), unsure: t('vc.unsure'), ok: t('vc.ok') }[st];
  const r = parseRef(c.reference);
  return `<div class="vc ${st}" id="vc-${k}" data-st="${st}">
    <p class="vc-head">${r ? `<button class="link-btn" data-action="note-passage" data-id="${esc(refText(r))}">${esc(refText(r))}</button>` : `<b>${esc(c.reference)}</b>`}<span class="vc-badge">${st === 'ok' || st === 'match' ? icon('check') : ''}${lab}</span></p>
    ${c.quoted ? `<p class="vc-q"><small>${t('vc.said')}</small>${esc(c.quoted)}</p>` : ''}
    <p class="vc-o"><small>${t('vc.orig')}</small><span id="vc-o-${k}">${esc(vcOrigMem[r ? refText(r) : ''] || '…')}</span></p>
    ${c.note && st !== 'ok' ? `<p class="hint">${esc(c.note)}</p>` : ''}
    ${st === 'unsure' && !n.example ? `<div class="vc-acts"><button class="secondary" data-action="vc-yes" data-id="${esc(n.id)}|${k}">${t('vc.yes')}</button><button class="secondary" data-action="vc-fix" data-id="${esc(n.id)}|${k}">${t('vc.fix')}</button></div>` : ''}
  </div>`;
}
/* Church + pastor: typed once, then offered from a list. The one used at this weekday and hour comes first
   (Sunday 11:00 → that church's pastor; Wednesday evening → maybe another). */
const placeLabel = x => [x.preacher, x.church].filter(Boolean).join(' · ');
// The chosen passage, full screen, to scroll through during the sermon. It floats over the note (recording keeps going).
async function passageView(ref, more = []) {
  if (!ref) return;
  if (more.length) return passageViewMany([ref, ...more]);
  let el = $('#pv'); if (!el) { el = document.createElement('div'); el.id = 'pv'; el.className = 'pv'; document.body.appendChild(el); }
  el.hidden = false;
  el.innerHTML = `<header class="pv-top"><span class="pv-ref">${icon('book')}${esc(refText(ref))}</span><button class="close" data-action="pv-close" aria-label="${esc(t('aria.close'))}">${icon('x')}</button></header><div class="pv-body" id="pv-body"><p class="hint">${t('rd.loading')}</p></div>`;
  try { const vs = await passageVerses(ref); const body = $('#pv-body'); if (body) body.innerHTML = vs.map((x, i) => `${i && x.c !== vs[i - 1].c ? `<p class="pv-ch">${esc(refText({ b: ref.b, c: x.c }))}</p>` : ''}<p class="pv-v"><sup>${x.v}</sup>${esc(x.text)}</p>`).join(''); }
  catch { const body = $('#pv-body'); if (body) body.innerHTML = `<p class="hint">${t('rd.offline')}</p>`; }
}
async function passageViewMany(refs) {
  let el = $('#pv'); if (!el) { el = document.createElement('div'); el.id = 'pv'; el.className = 'pv'; document.body.appendChild(el); }
  el.hidden = false;
  el.innerHTML = `<header class="pv-top"><span class="pv-ref">${icon('book')}${esc(refs.map(refText).join(' · '))}</span><button class="close" data-action="pv-close" aria-label="${esc(t('aria.close'))}">${icon('x')}</button></header><div class="pv-body" id="pv-body">${refs.map((r, k) => `<p class="pv-ch">${esc(refText(r))}</p><div id="pv-part-${k}"><p class="hint">${t('rd.loading')}</p></div>`).join('')}</div>`;
  refs.forEach((r, k) => passageVerses(r).then(vs => { const p = $(`#pv-part-${k}`); if (p) p.innerHTML = vs.map(x => `<p class="pv-v"><sup>${x.v}</sup>${esc(x.text)}</p>`).join(''); }).catch(() => { const p = $(`#pv-part-${k}`); if (p) p.innerHTML = `<p class="hint">${t('rd.offline')}</p>`; }));
}
const passageViewClose = () => { const el = $('#pv'); if (!el || el.hidden) return false; el.hidden = true; el.innerHTML = ''; return true; };
function placeDefault() {
  const L = data.sermonPlaces || []; if (!L.length) return -1;
  const now = state.snOpenedAt ? new Date(state.snOpenedAt) : new Date(), dow = now.getDay(), h = now.getHours();
  let best = -1, score = 0;
  L.forEach((x, i) => { let sc = 0; Object.entries(x.slots || {}).forEach(([k, n]) => { const [d, hh] = k.split('-').map(Number); if (d === dow && Math.abs(hh - h) <= 2) sc += n; }); if (sc > score) { score = sc; best = i; } });
  if (best >= 0) return best;
  return L.reduce((bi, x, i) => (x.last || '') > (L[bi].last || '') ? i : bi, 0);
}
function placeRemember(preacher, church) {
  if (!preacher && !church) return;
  const L = data.sermonPlaces = data.sermonPlaces || [];
  let x = L.find(y => y.preacher === preacher && y.church === church);
  if (!x) { x = { preacher, church, slots: {} }; L.unshift(x); }
  const at = state.snOpenedAt ? new Date(state.snOpenedAt) : new Date(), k = `${at.getDay()}-${at.getHours()}`;
  x.slots[k] = (x.slots[k] || 0) + 1; x.last = new Date().toISOString();
  data.sermonPlaces = L.slice(0, 12);
}
function placeField() {
  const L = data.sermonPlaces || [];
  if (L.length && state.snPlace !== 'new') {
    const sel = state.snPlace ?? placeDefault();
    return `<select id="sn-place" class="field sn-select" aria-label="${esc(t('sn.pastor'))}">${L.map((x, i) => `<option value="${i}" ${+sel === i ? 'selected' : ''}>${esc(placeLabel(x))}</option>`).join('')}<option value="new">${t('sn.placeNew')}</option></select>`;
  }
  return `<div class="sn-who"><input id="sn-preacher" class="field" maxlength="60" placeholder="${esc(t('sn.pastor'))}"><input id="sn-church" class="field" maxlength="60" placeholder="${esc(t('sn.church'))}"></div>`;
}
function readPlace() {
  const sel = $('#sn-place');
  if (sel && sel.value !== 'new') { const x = (data.sermonPlaces || [])[+sel.value] || {}; return { preacher: x.preacher || '', church: x.church || '' }; }
  return { preacher: $('#sn-preacher')?.value.trim() || '', church: $('#sn-church')?.value.trim() || '' };
}
// A sermon can have more than one passage (e.g. 룻기 4:4-9 and 마태복음 1:5): the first is required, up to two more.
const snAllRefs = () => [state.snRef, ...(state.snRefs || [])].filter(Boolean);
const snMoreHtml = () => `${(state.snRefs || []).map((r, i) => `<span class="sn-ref2">${icon('book')}<span>${esc(refText(r))}</span><button type="button" data-action="sn-ref-rm" data-id="${i}" aria-label="${esc(t('sn.rmRef'))}">${icon('x')}</button></span>`).join('')}${state.snRef && (state.snRefs || []).length < 2 ? `<button type="button" class="link-btn sn-addref" data-action="sn-ref-add">${t('sn.addRef')}</button>` : ''}`;
function snRefsChanged() {
  const refs = snAllRefs(), el = $('#sn-more'); if (el) el.innerHTML = snMoreHtml();
  state.snPassageText = Promise.all(refs.map(r => passageVerses(r).then(vs => (refs.length > 1 ? refText(r) + '\n' : '') + vs.map(x => `${x.c}:${x.v} ${x.text}`).join('\n')).catch(() => ''))).then(a => a.filter(Boolean).join('\n\n'));
}
function sermonNew() {
  const keep = recLive() || !!Rec.blob;   // reopened from the "recording" bar: keep what was chosen
  state.snMode = 'write'; state.snBlob = null;
  if (!keep) { state.snRef = null; state.snRefs = []; state.snPlace = null; state.snOpenedAt = Date.now(); state.snPassageText = null; Rec.slang = null; }
  showSheet({ title: t('sn.new'), body: `<form id="sn-form" class="sheet-form">
    <div class="sn-refrow"><button type="button" class="mp-open sn-refbtn ${state.snRef ? 'set' : ''}" data-action="sn-ref" id="sn-ref">${icon('book')}<span>${state.snRef ? esc(refText(state.snRef)) : t('sn.refReq')}</span>${icon('chevron')}</button>
      <button type="button" class="round-btn sn-pv" data-action="pv-open" id="sn-pv" aria-label="${esc(t('pv.open'))}" title="${esc(t('pv.open'))}" ${state.snRef ? '' : 'hidden'}>${icon('maximize')}</button></div>
    <div id="sn-more" class="sn-more">${snMoreHtml()}</div>
    <input id="sn-title" class="field" maxlength="120" placeholder="${esc(t('sn.titleF'))}">
    <div id="sn-placebox">${placeField()}</div>
    <label class="sn-date"><span>${t('sn.date')}</span><input id="sn-date" type="date" class="field" value="${state.snDate && keep ? state.snDate : today()}" max="${today()}"></label>
    <div id="rec-card" class="rec-card">${recCard()}</div>
    <div id="sn-input">${snInput()}</div>
    <button class="primary block" type="submit">${t('sn.make')}</button></form>` });
  $('#sn-form').addEventListener('submit', e => { e.preventDefault(); sermonSubmit(); });
  $('#sn-place')?.addEventListener('change', e => { if (e.target.value === 'new') { state.snPlace = 'new'; $('#sn-placebox').innerHTML = placeField(); $('#sn-preacher')?.focus(); } else state.snPlace = +e.target.value; });
  $('#sn-date')?.addEventListener('change', e => { state.snDate = e.target.value; });
  recPaint(true);
}
const snInput = () => state.snMode === 'write' ? `<input id="sn-main" class="field" maxlength="200" placeholder="${esc(t('sn.mainF'))}">
    <textarea id="sn-body" data-draft="sermon-write" class="big-input" rows="7" placeholder="${esc(t('sn.bodyF'))}"></textarea>
    <label class="med-check sn-ai"><input type="checkbox" id="sn-ai" checked>${icon('sparkle')}<span>${t('sn.aiOn')}</span></label>`
  : state.snMode === 'rec' ? `<div class="sn-rec"><button type="button" class="sn-recbtn" data-action="sn-rec" id="sn-recbtn">${icon('mic')}<span>${t('sn.recStart')}</span></button><p class="hint" id="sn-recst"></p><p class="hint center">${t('sn.recNote')}</p></div>`
  : state.snMode === 'yt' ? `<input id="sn-yt" class="field" inputmode="url" placeholder="${esc(t('sn.ytPh'))}" autocomplete="off">`
  : state.snMode === 'file' ? `<label class="sn-file">${icon('upload')}<span id="sn-fname">${t('sn.pickFile')}</span><input type="file" id="sn-fin" accept="audio/*" hidden></label>`
  : `<textarea id="sn-text" data-draft="sermon" class="big-input" rows="6" placeholder="${esc(t('sn.paste'))}"></textarea>`;
async function snRecord() {
  if (state.snRec) { state.snRec.stop(); return; }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(m => window.MediaRecorder?.isTypeSupported?.(m)) || '';
    const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined), chunks = [], t0 = Date.now();
    const base = (type || 'audio/webm').split(';')[0];
    state.snUp = null;
    if (state.snOnline) { try { const { id } = await sapi('POST', `/api/sermons/upload?type=${encodeURIComponent(base)}`); state.snUp = { id, i: 0, q: Promise.resolve(), failed: false }; } catch (e) { if (e.code === 'quota_full' || e.code === 'storage_full' || e.code === 'fair_use') { stream.getTracks().forEach(x => x.stop()); close(); return paywall(); } } }
    const sendPiece = (blob, i) => { const up = state.snUp; if (!up) return;
      up.q = up.q.then(async () => { for (let k = 0; k < 3; k++) { try { const r = await fetch(`${API_BASE}/api/sermons/${up.id}/chunk?i=${i}`, { method: 'PUT', headers: { 'x-user-id': 'demo', 'Content-Type': 'application/octet-stream' }, body: blob }); if (r.ok) return; } catch {} await new Promise(z => setTimeout(z, 1500 * (k + 1))); } up.failed = true; }); };
    rec.ondataavailable = e => { if (!e.data.size) return; chunks.push(e.data); if (state.snUp) sendPiece(e.data, state.snUp.i++); };
    const tick = setInterval(() => { const s = Math.round((Date.now() - t0) / 1000), el = $('#sn-recst'); if (el) el.textContent = t('sn.recOn').replace('{t}', `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`); }, 500);
    rec.onstop = () => { clearInterval(tick); stream.getTracks().forEach(x => x.stop()); state.snRec = null;
      state.snBlob = new Blob(chunks, { type: (rec.mimeType || 'audio/webm').split(';')[0] }); const s = Math.round((Date.now() - t0) / 1000);
      const b = $('#sn-recbtn'); if (b) b.innerHTML = `${icon('mic')}<span>${t('sn.recStart')}</span>`; const el = $('#sn-recst'); if (el) el.textContent = t('sn.recDone').replace('{t}', `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`); };
    rec.start(state.snUp ? 30000 : 1000); state.snRec = rec;
    const b = $('#sn-recbtn'); if (b) b.innerHTML = `${icon('mic')}<span>${t('sn.recStop')}</span>`; b?.classList.add('on');
  } catch { toast(t('sn.need')); }
}
async function sermonSubmit() {
  const title = $('#sn-title')?.value.trim() || '', { preacher, church } = readPlace(), date = $('#sn-date')?.value || today();
  if (state.snMode === 'write') {
    placeRemember(preacher, church); state.snDate = null;
    const main = $('#sn-main')?.value.trim() || '', body = $('#sn-body')?.value.trim() || '';
    if (recLive()) await recStop();
    if (Rec.blob) {
      const blob = Rec.blob, id = 'n' + Date.now();
      const context = [Rec.ctx.trim(), church, ...snAllRefs().map(refText)].filter(Boolean).join(' · ').slice(0, 500);
      const passageText = (await state.snPassageText?.catch?.(() => '')) || '';
      data.sermonNotes = [{ id, manual: true, slang: sermonLang(), rec: { dur: Math.round(Rec.dur || 0), bytes: blob.size, ...(Rec.fileName ? { file: Rec.fileName.slice(0, 80) } : {}) }, date, title, preacher, church, status: 'done', body,
        ...(state.snRef ? { ref: state.snRef, ...(state.snRefs?.length ? { refs: [...state.snRefs] } : {}), passageText: passageText.slice(0, 20000) } : {}),
        ...(context ? { context } : {}), ...(Rec.live.final.trim() ? { liveText: Rec.live.final.trim() } : {}),
        summary: { title, passages: snAllRefs().map(refText), main_message: main, points: [], application: [], prayer_topics: [], discussion_questions: [] } }, ...(data.sermonNotes || [])];
      if (blob.size < 80 * 1024 * 1024) await AudioStore.put(id, blob).catch(() => {});
      recReset(true);
      if (data.drafts) delete data.drafts['sermon-write']; save(); close(); state.tab = 'notes'; state.noteOpen = null; render();
      return uploadRecording(id, blob);
    }
    if (!main && !body) { toast(t('sn.need')); return; }
    const passageText = state.snRef ? ((await state.snPassageText?.catch?.(() => '')) || '') : '';
    data.sermonNotes = [{ id: 'n' + Date.now(), manual: true, date, title, preacher, church, status: 'done', body, ...(church ? { context: church } : {}),
      ...(state.snRef ? { ref: state.snRef, ...(state.snRefs?.length ? { refs: [...state.snRefs] } : {}), passageText: passageText.slice(0, 20000) } : {}),
      summary: { title, passages: snAllRefs().map(refText), main_message: main, points: [], application: [], prayer_topics: [], discussion_questions: [] } }, ...(data.sermonNotes || [])];
    const wantAi = $('#sn-ai')?.checked;
    if (data.drafts) delete data.drafts['sermon-write']; save(); close(); state.tab = 'notes'; state.noteOpen = null; render();
    if (wantAi) aiSummarize(data.sermonNotes[0].id, true);
    return;
  }
  if (quotaFull(noteQuota())) { close(); return paywall(); }
  let blob = state.snBlob, text = '';
  if (state.snMode === 'file') blob = $('#sn-fin')?.files?.[0] || null;
  if (state.snMode === 'text') { text = $('#sn-text')?.value.trim() || ''; if (text && text.length < 50) { toast(t('sn.short')); return; } }
  if (!blob && !text && state.snMode !== 'yt' && !(state.snMode === 'rec' && state.snUp)) { toast(t('sn.need')); return; }
  if (state.snMode === 'yt') {
    const url = $('#sn-yt')?.value.trim() || '';
    if (!/^https:\/\/(www\.|m\.)?(youtube\.com|youtu\.be)\//.test(url)) { toast(t('sn.ytBad')); return; }
    if (!state.snOnline) { toast(t('sn.ytNo')); return; }
    try { const out = await sapi('POST', '/api/sermons/youtube', { url, title, preacher }); close(); state.snChecked = false; await sermonSync(); sermonPoll(out.id); render(); }
    catch (e) { if (e.code === 'quota_full' || e.code === 'storage_full' || e.code === 'fair_use') { close(); return paywall(); } toast(e.code === 'youtube_not_configured' ? t('sn.ytNo') : t('sn.failed')); }
    return;
  }
  if (state.snMode === 'rec' && state.snUp && state.snOnline) {
    const up = state.snUp; await up.q;
    try { const out = await sapi('POST', `/api/sermons/${up.id}/finish`, { title, preacher }); state.snUp = null; close(); state.snChecked = false; await sermonSync(); sermonPoll(out.id); render(); return; }
    catch { if (!blob) { toast(t('sn.failed')); return; } }
  }
  if (state.snOnline) {
    try {
      const out = text ? await sapi('POST', '/api/sermons/text', { transcript: text, title, preacher })
        : await sapi('POST', `/api/sermons/audio?title=${encodeURIComponent(title)}&preacher=${encodeURIComponent(preacher)}`, blob);
      if (data.drafts) delete data.drafts.sermon; close(); state.snChecked = false; await sermonSync(); sermonPoll(out.id); render(); return;
    } catch (e) { if (e.code === 'quota_full' || e.code === 'storage_full' || e.code === 'fair_use') { close(); return paywall(); } toast(t('sn.failed')); return; }
  }
  // no server yet: keep the note on the device; it'll be summarized once connected
  data.sermonNotes = [{ id: 'n' + Date.now(), date: today(), title, preacher, status: 'waiting', transcript: text, hasAudio: !!blob }, ...(data.sermonNotes || [])];
  if (data.drafts) delete data.drafts.sermon; save(); close(); state.tab = 'notes'; state.noteOpen = null; render();
}
// The user's own passage and main line win; the AI fills in the rest.
function mergeSummary(n, A) {
  const S0 = n.summary || {};
  n.summary = { ...A, title: A.title || '', passages: S0.passages?.length ? S0.passages : (A.passages || []), main_message: S0.main_message || A.main_message || '' };
  if (!n.title && A.title) n.title = A.title; n.ai = true; n.aiBusy = false; n.recPending = false; save(); render();
}
function pollInto(n, rid, fail) {
  let k = 0; const tick = async () => { k++;
    try { const { sermon } = await sapi('GET', `/api/sermons/${rid}`);
      if (sermon.status === 'done' && sermon.summary) { if (sermon.transcript) n.transcript = sermon.transcript; return mergeSummary(n, sermon.summary); }
      if (sermon.status === 'error' || k > 600) return fail(); } catch { return fail(); }
    setTimeout(tick, k < 30 ? 2000 : 5000); };
  setTimeout(tick, 1500);
}
/* ---------- sermon recorder ----------
   Phone app: the native SermonRecorder plugin (keeps going with the screen off; a ringing call doesn't stop it,
   an answered call pauses it and it picks up again when the call ends). Web: MediaRecorder, screen kept on.
   Tuned for a sermon in a church: no echo cancellation or noise suppression (they eat a distant voice), gain control on. */
const Rec = { state: 'idle', seconds: 0, level: 0, blob: null, dur: 0, url: null, kind: 'rec', ctx: '', live: { final: '', interim: '' } };
// The sermon's language: the phone's (app) language by default; the small chip next to the record button changes it.
const SLANG = { ko: ['한', '한국어'], en: ['EN', 'English'], es: ['ES', 'Español'] };
const sermonLang = () => Rec.slang || lang();
const langChip = () => `<button type="button" class="rec-lang" data-action="rec-lang" aria-label="${esc(t('rec.slang') + ': ' + SLANG[sermonLang()][1])}" title="${esc(t('rec.slang'))}">${icon('globe')}<b>${SLANG[sermonLang()][0]}</b></button>`;
const SpeechRec = () => window.SpeechRecognition || window.webkitSpeechRecognition;
const nativeRec = () => window.Capacitor?.isNativePlatform?.() && window.Capacitor?.Plugins?.SermonRecorder;
const recLive = () => ['recording', 'paused', 'interrupted'].includes(Rec.state);
function recCard() {
  if (recLive()) {
    const lab = Rec.state === 'interrupted' ? t('rec.call') : Rec.state === 'paused' ? t('rec.paused') : t('rec.on');
    return `<div class="rec-live ${Rec.state}"><span class="rec-dot"></span><b class="rec-time" id="rec-time">${fmtDur(Rec.seconds)}</b><span class="rec-lv"><i id="rec-lv" style="width:${Math.round(Rec.level * 100)}%"></i></span></div>
      <p class="rec-st">${Rec.state === 'recording' ? t('rec.typing') : lab}</p>
      ${Rec.kind === 'live' ? `<div class="rec-livetext" id="rec-livetext">${esc(Rec.live.final)}<i>${esc(Rec.live.interim || (Rec.live.final ? '' : t('rec.liveWait')))}</i></div>` : ''}
      <div class="rec-ctl">${Rec.state === 'recording' ? `<button type="button" class="secondary" data-action="rec-pause">${t('rec.pause')}</button>` : `<button type="button" class="secondary" data-action="rec-resume">${t('rec.resume')}</button>`}
        <button type="button" class="primary" data-action="rec-stop">${t('rec.stop')}</button></div>`;
  }
  if (Rec.blob) { if (!Rec.url) Rec.url = URL.createObjectURL(Rec.blob);
    return `<div class="rec-done"><span>${icon(Rec.fileName ? 'upload' : 'mic')}${Rec.fileName ? esc(Rec.fileName.slice(0, 32)) : t('rec.done').replace('{t}', fmtDur(Rec.dur))}</span><button type="button" class="link-btn" data-action="rec-del">${t('rec.del')}</button></div>
      <audio controls preload="metadata" src="${Rec.url}"></audio>${Rec.live.final ? `<div class="rec-livetext done">${esc(Rec.live.final)}</div>` : ''}<p class="hint">${t('rec.after')}</p>`; }
  const kinds = [['rec', t('rec.kRec')], ...(SpeechRec() ? [['live', t('rec.kLive')]] : []), ['file', t('rec.kFile')]];
  if (Rec.kind === 'live' && !SpeechRec()) Rec.kind = 'rec';
  return `<div class="seg rec-seg">${kinds.map(([k, l]) => `<button type="button" class="${Rec.kind === k ? 'active' : ''}" data-action="rec-kind" data-id="${k}">${l}</button>`).join('')}</div>
    <label class="rec-ctx">${icon('lines')}<textarea id="rec-ctx" rows="3" maxlength="500" placeholder="${esc(t('rec.ctxPh'))}">${esc(Rec.ctx)}</textarea></label>
    ${!state.snRef ? `<div class="rec-row"><button type="button" class="rec-big rec-go locked" data-action="rec-need-ref">${icon(Rec.kind === 'file' ? 'upload' : 'mic')}<span>${Rec.kind === 'file' ? t('rec.pick') : t('rec.btn')}</span></button>${langChip()}</div><p class="hint rec-need">${icon('book')}${t('rec.needRef')}</p>`
      : Rec.kind === 'file' ? `<div class="rec-row"><label class="rec-big rec-go">${icon('upload')}<span>${t('rec.pick')}</span><input type="file" id="rec-file" accept="audio/*,video/mp4,.m4a,.mp3,.wav,.aac" hidden></label>${langChip()}</div><p class="hint">${t('rec.fileHint')}</p>`
      : `<div class="rec-row"><button type="button" class="rec-big rec-go" data-action="rec-start">${icon('mic')}<span>${t('rec.btn')}</span></button>${langChip()}</div><p class="hint">${Rec.kind === 'live' ? t('rec.liveHint') : nativeRec() ? t('rec.hintApp') : t('rec.hintWeb')}</p>`}`;
}
function livePaint() { const el = $('#rec-livetext'); if (el) { el.innerHTML = `${esc(Rec.live.final)}<i>${esc(Rec.live.interim)}</i>` || ''; el.scrollTop = el.scrollHeight; } }
function liveStart() {
  const SR = SpeechRec(); if (!SR || Rec.kind !== 'live') return;
  const r = new SR(); r.lang = { ko: 'ko-KR', en: 'en-US', es: 'es-ES' }[sermonLang()] || 'ko-KR'; r.continuous = true; r.interimResults = true;
  r.onresult = e => { let interim = ''; for (let i = e.resultIndex; i < e.results.length; i++) { const x = e.results[i]; if (x.isFinal) Rec.live.final += x[0].transcript.trim() + ' '; else interim += x[0].transcript; } Rec.live.interim = interim; livePaint(); };
  r.onend = () => { if (Rec.sr === r && Rec.state === 'recording') { try { r.start(); } catch {} } };   // browsers stop after a pause in speech: keep going
  r.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') { Rec.sr = null; } };
  try { r.start(); Rec.sr = r; } catch {}
}
function liveStop() { const r = Rec.sr; Rec.sr = null; try { r?.stop(); } catch {} Rec.live.interim = ''; }
let recShown = '';
function recPaint(force) {
  const key = Rec.state + (Rec.blob ? 'b' : '');
  const card = $('#rec-card'); const cx = $('#rec-ctx'); if (cx) Rec.ctx = cx.value;
  if (card && (force || key !== recShown)) { card.innerHTML = recCard(); $('#sn-form')?.classList.toggle('has-rec', recLive() || !!Rec.blob); }
  recShown = key;
  const tm = $('#rec-time'); if (tm) tm.textContent = fmtDur(Rec.seconds);
  const lv = $('#rec-lv'); if (lv) lv.style.width = Math.round(Rec.level * 100) + '%';
  const bar = $('#rec-bar'); if (bar) { if (recLive()) bar.querySelector('span').textContent = t('rec.bar').replace('{t}', fmtDur(Rec.seconds)); else bar.remove(); }
  // sheet closed while recording: keep a "recording · open" bar on the sermon notes page
  else if (recLive() && sheet.hidden && state.tab === 'notes' && !state.noteOpen) $('.bb .page-head')?.insertAdjacentHTML('afterend', `<button class="rec-bar" id="rec-bar" data-action="sermon-new"><i class="rec-dot"></i><span>${t('rec.bar').replace('{t}', fmtDur(Rec.seconds))}</span></button>`);
}
function recTicker(on) {
  clearInterval(Rec.tick); if (!on) return;
  Rec.tick = setInterval(async () => {
    const N = nativeRec();
    if (N) { try { const s = await N.status(); if (s.state !== 'idle') { Rec.state = s.state; Rec.seconds = s.seconds; Rec.level = s.level; } } catch {} }
    else if (Rec.web) { const w = Rec.web; Rec.seconds = (w.acc + (Rec.state === 'recording' ? Date.now() - w.since : 0)) / 1000;
      if (w.an && Rec.state === 'recording') { const a = new Uint8Array(w.an.fftSize); w.an.getByteTimeDomainData(a); let m = 0; for (const v of a) m = Math.max(m, Math.abs(v - 128)); Rec.level = Math.min(1, m / 64); } else Rec.level = 0; }
    recPaint();
  }, 500);
}
async function recStart() {
  if (!state.snRef) { toast(t('rec.needRef')); return biblePicker({ mode: 'sermonref', start: null }); }
  if (quotaFull(noteQuota())) { close(); return paywall(); }
  const N = nativeRec();
  if (N) {
    try { await N.start({ title: t('rec.fgTitle'), text: t('rec.fgText'), pausedTitle: t('rec.nTitle'), pausedText: t('rec.nText') }); }
    catch { toast(t('med.recFail')); return; }
    if (!Rec.sub) Rec.sub = N.addListener?.('state', s => { if (s.state !== 'idle') { Rec.state = s.state; Rec.seconds = s.seconds; recPaint(); } });
    Rec.state = 'recording'; Rec.seconds = 0;
  } else {
    let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: true, channelCount: 1 } }); }
    catch { toast(t('med.recFail')); return; }
    const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(m => window.MediaRecorder?.isTypeSupported?.(m)) || '';
    const mr = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 48000 } : undefined), chunks = [];
    mr.ondataavailable = e => e.data.size && chunks.push(e.data);
    let an = null; try { const ac = new (window.AudioContext || window.webkitAudioContext)(); an = ac.createAnalyser(); an.fftSize = 512; ac.createMediaStreamSource(stream).connect(an); ac.resume?.(); Rec.ac = ac; } catch {}
    let wake = null; try { wake = await navigator.wakeLock?.request('screen'); } catch {}
    Rec.web = { mr, chunks, stream, an, wake, acc: 0, since: Date.now(), type: (mr.mimeType || type || 'audio/webm').split(';')[0] };
    mr.start(1000); Rec.state = 'recording'; Rec.seconds = 0;
  }
  Rec.blob = null; Rec.fileName = null; Rec.live = { final: '', interim: '' }; recTicker(true); recPaint(true); liveStart();
}
async function recPause() {
  const N = nativeRec();
  if (N) { try { await N.pause(); } catch {} }
  else if (Rec.web) { try { Rec.web.mr.pause(); } catch {} Rec.web.acc += Date.now() - Rec.web.since; }
  Rec.state = 'paused'; liveStop(); recPaint(true);
}
async function recResume() {
  const N = nativeRec();
  if (N) { try { await N.resume(); } catch {} }
  else if (Rec.web) { try { Rec.web.mr.resume(); } catch {} Rec.web.since = Date.now(); }
  Rec.state = 'recording'; recPaint(true); liveStart();
}
async function recStop() {
  const N = nativeRec(); recTicker(false); liveStop();
  if (N) {
    try { const r = await N.stop(); Rec.path = r.path; Rec.dur = r.duration || Rec.seconds;
      Rec.blob = await (await fetch(window.Capacitor.convertFileSrc(r.path))).blob();
      if (!Rec.blob.type) Rec.blob = new Blob([Rec.blob], { type: r.mimeType || 'audio/mp4' }); }
    catch { toast(t('sn.failed')); }
  } else if (Rec.web) {
    const w = Rec.web; if (Rec.state === 'recording') w.acc += Date.now() - w.since; Rec.dur = w.acc / 1000;
    await new Promise(res => { w.mr.onstop = res; try { w.mr.stop(); } catch { res(); } });
    w.stream.getTracks().forEach(x => x.stop()); try { w.wake?.release(); } catch {} try { Rec.ac?.close(); } catch {}
    Rec.blob = new Blob(w.chunks, { type: w.type }); Rec.web = null;
  }
  Rec.state = 'idle'; Rec.level = 0; recPaint(true);
}
function recReset(keepFile) {
  const N = nativeRec(); recTicker(false);
  if (N && !keepFile) N.discard?.({ path: Rec.path || undefined }).catch(() => {});
  if (Rec.web) { try { Rec.web.mr.stop(); } catch {} Rec.web.stream.getTracks().forEach(x => x.stop()); try { Rec.web.wake?.release(); } catch {} Rec.web = null; }
  if (Rec.url) URL.revokeObjectURL(Rec.url);
  liveStop();
  Object.assign(Rec, { state: 'idle', seconds: 0, level: 0, blob: null, dur: 0, url: null, path: null, fileName: null, live: { final: '', interim: '' } }); recPaint(true);
}
// Upload a finished recording in 4 MB pieces (retried), then the server transcribes (in the sermon's language) and summarizes.
async function uploadRecording(id, blob) {
  const n = (data.sermonNotes || []).find(x => x.id === id); if (!n) return;
  try { if (!blob) { const d = await AudioStore.url(id); if (!d) return; blob = await (await fetch(d)).blob(); } } catch { return; }
  n.aiBusy = true; n.recPending = false; save(); render();
  state.snChecked = false; await sermonSync();
  const pending = msg => { n.aiBusy = false; n.recPending = true; save(); render(); if (msg) toast(msg);
    if (n.liveText && !n.ai) { n.transcript = n.transcript || n.liveText; aiSummarize(n.id, true); } };   // no server: summarize what was heard live
  if (!state.snOnline) return pending();
  try {
    const type = (blob.type || 'audio/mp4').split(';')[0];
    const { id: rid } = await sapi('POST', `/api/sermons/upload?type=${encodeURIComponent(type)}&lang=${n.slang || lang()}&title=${encodeURIComponent(n.title || '')}&preacher=${encodeURIComponent(n.preacher || '')}&context=${encodeURIComponent(n.context || '')}`);
    const PART = 4 * 1024 * 1024;
    for (let i = 0, k = 0; i < blob.size; i += PART, k++) {
      let ok = false;
      for (let tries = 0; tries < 4 && !ok; tries++) {
        try { const r = await fetch(`${API_BASE}/api/sermons/${rid}/chunk?i=${k}`, { method: 'PUT', headers: { 'x-user-id': 'demo', 'Content-Type': 'application/octet-stream' }, body: blob.slice(i, i + PART) }); ok = r.ok; } catch {}
        if (!ok) await new Promise(z => setTimeout(z, 1500 * (tries + 1)));
      }
      if (!ok) return pending(t('rec.upFail'));
    }
    await sapi('POST', `/api/sermons/${rid}/finish`, { title: n.title, preacher: n.preacher, church: n.church || '', passage: n.ref ? [n.ref, ...(n.refs || [])].map(refText).join(' · ') : '', passageText: n.passageText || '' });
    n.remoteId = rid; save(); state.snChecked = false;
    pollInto(n, rid, () => pending(t('sn.failed')));
  } catch (e) { if (e?.code === 'daily_limit' || e?.code === 'weekly_limit') return pending(t(e.code === 'daily_limit' ? 'us.dayHit' : 'us.weekHit').replace('{t}', fmtLeft(e.data?.reset) || '24h'));
    if (e?.code === 'quota_full' || e?.code === 'storage_full' || e?.code === 'fair_use') { n.aiBusy = false; n.recPending = true; save(); return paywall(); } pending(t('rec.upFail')); }
}
/* A handwritten note can also get an AI summary. The phone/web app asks our server (Claude, same sermon format);
   in the claude.ai preview, where there's no server, it asks Claude through the page's `sample` capability. */
async function aiSummarize(id, fromSave) {
  const n = (data.sermonNotes || []).find(x => x.id === id); if (!n || n.aiBusy) return;
  const q = noteQuota(); if (quotaFull(q)) return paywall();
  const S0 = n.summary || {}, transcript = [S0.passages?.[0] ? `${t('sn.ref')}: ${S0.passages[0]}` : '', S0.main_message || '', n.body || '', n.transcript || n.liveText || ''].filter(Boolean).join('\n');
  if (transcript.length < 50) { if (!fromSave) toast(t('sn.aiShort')); return; }
  const merge = A => mergeSummary(n, A);
  const fail = msg => { n.aiBusy = false; save(); render(); toast(msg); };
  n.aiBusy = true; save(); render();
  try {
    await sermonSync();
    if (state.snOnline) {
      const out = await sapi('POST', '/api/sermons/text', { transcript, title: n.title, preacher: n.preacher, church: n.church || '', context: n.context || '', language: n.slang || lang(), passage: n.ref ? [n.ref, ...(n.refs || [])].map(refText).join(' · ') : '', passageText: n.passageText || '' });
      n.remoteId = out.id; save(); state.snChecked = false;
      return pollInto(n, out.id, () => fail(t('sn.failed')));
    }
    const sample = window.claude?.use ? await window.claude.use('sample') : null;
    if (!sample) return fail(t('sn.aiLater'));
    const A = await sample.json(`You turn a listener's handwritten sermon notes into tidy one-page sermon notes.
Write in the same language as the notes. Stay faithful to what is written: do not add theology, stories or Bible verses that are not in the notes.
The listener chose the passage below: use it to fix misheard words and to anchor the notes.
verse_checks: every Bible verse the notes quote or refer to. "match" if the wording matches the passage text closely, "paraphrase" if the meaning matches in other words, "unsure" if the reference or wording is unclear or you can't verify it — never guess; the listener will confirm unsure ones.
Return only JSON: {"title": string, "passages": string[], "main_message": string (one sentence), "points": [{"heading": string, "detail": string (1-2 sentences)}] (2-4, in order), "application": string[] (concrete ways to live it out this week), "prayer_topics": string[], "discussion_questions": string[] (2-3 for a small group), "verse_checks": [{"reference": string, "quoted": string, "status": "match"|"paraphrase"|"unsure", "note": string}]}.
${n.passageText ? `<passage ref="${n.ref ? refText(n.ref) : ''}">\n${n.passageText.slice(0, 6000)}\n</passage>\n` : ''}
${n.context ? `About this sermon: ${n.context}\n` : ''}Notes:
${transcript}`, { modelTier: 'default' });
    if (!A || typeof A !== 'object') return fail(t('sn.failed'));
    merge({ title: String(A.title || ''), passages: [].concat(A.passages || []).map(String), main_message: String(A.main_message || ''),
      points: [].concat(A.points || []).filter(x => x && x.heading).map(x => ({ heading: String(x.heading), detail: String(x.detail || '') })),
      application: [].concat(A.application || []).map(String), prayer_topics: [].concat(A.prayer_topics || []).map(String), discussion_questions: [].concat(A.discussion_questions || []).map(String),
      verse_checks: [].concat(A.verse_checks || []).filter(x => x && x.reference).map(x => ({ reference: String(x.reference), quoted: String(x.quoted || ''), status: ['match', 'paraphrase', 'unsure'].includes(x.status) ? x.status : 'unsure', note: String(x.note || '') })) });
  } catch (e) { if (e?.code === 'quota_full' || e?.code === 'storage_full' || e?.code === 'fair_use') { n.aiBusy = false; save(); return paywall(); } fail(e?.code === 'not_granted' ? t('sn.aiLater') : t('sn.failed')); }
}
function sermonPoll(id) {
  let n = 0; const tick = async () => { n++; try { const { sermon } = await sapi('GET', `/api/sermons/${id}`);
    if (sermon.status === 'done' || sermon.status === 'error' || n > 90) { state.snChecked = false; await sermonSync(); render(); return; } } catch { return; }
    setTimeout(tick, 2000); }; setTimeout(tick, 1500);
}
function paywall() {
  const q = noteQuota();
  showSheet({ title: t('pw.title').replace('{t}', q.limit || NOTE_FREE), body: `<p class="hint">${t('pw.body')}</p>
    <div class="pw-plans">
      <button class="pw-plan" data-action="pw-buy" data-id="monthly"><b>${t('pw.monthly')}</b><span>${t('pw.mPrice')}</span></button>
      <button class="pw-plan best" data-action="pw-buy" data-id="yearly"><b>${t('pw.yearly')}</b><span>${t('pw.yPrice')}</span><small>${t('pw.ySave')}</small></button>
    </div>
    <p class="hint center">${t('pw.what')}</p>
    <button class="secondary block" data-action="pw-clean">${icon('trash')}${t('pw.clean')}</button>` });
}
async function buyPlan(plan) {
  // Phone apps: the store purchase (StoreKit / Google Play Billing) is handled by the native shell; the server verifies the receipt.
  if (window.DTBilling?.purchase) { try { await window.DTBilling.purchase(plan); state.snChecked = false; await sermonSync(); close(); render(); toast(t('pw.done')); } catch {} return; }
  if (state.snOnline) { try { state.snQuota = await sapi('POST', '/api/billing/activate', { plan }); close(); render(); toast(t('pw.done')); return; } catch {} }
  toast(t('pw.soon'));
}
function readDash() {
  const log = data.readLog || {}, rt = data.readTime || {}, perDay = {};
  Object.values(log).forEach(d => { perDay[d] = (perDay[d] || 0) + 1; });
  const month = today().slice(0, 7), days30 = Array.from({ length: 30 }, (_, i) => daysAgo(29 - i));
  const weekDays = Array.from({ length: 7 }, (_, i) => daysAgo(i)).filter(d => perDay[d] || (rt[d] || 0) >= 60).length;
  const monthSec = Object.entries(rt).filter(([d]) => d.startsWith(month)).reduce((n, [, x]) => n + x, 0);
  const monthCh = Object.entries(perDay).filter(([d]) => d.startsWith(month)).reduce((n, [, x]) => n + x, 0);
  const active = days30.filter(d => perDay[d] || (rt[d] || 0) >= 60), avgMin = active.length ? Math.round(active.reduce((n, d) => n + (rt[d] || 0), 0) / 60 / active.length) : 0;
  const wd = Array.from({ length: 7 }, () => [0, 0]); Object.entries(perDay).forEach(([d, n]) => { const k = new Date(d + 'T00:00:00').getDay(); wd[k][0] += n; wd[k][1]++; });
  const seen = new Set([...Object.keys(perDay), ...Object.keys(rt).filter(d => rt[d] >= 60)]), sorted = [...seen].sort();
  let longest = 0, run = 0, prev = null; sorted.forEach(d => { run = prev && dayDiff(prev, d) === 1 ? run + 1 : 1; longest = Math.max(longest, run); prev = d; });
  return { perDay, rt, days30, weekDays, monthSec, monthCh, avgMin, wd: wd.map(([n, c]) => c ? n / c : 0), streak: readDays(), longest };
}
function dashHtml() {
  const D = readDash(), fmtT = s => { const m = Math.round(s / 60); return m >= 60 ? t('db.hm').replace('{h}', Math.floor(m / 60)).replace('{m}', m % 60) : t('db.min').replace('{n}', m); };
  const tile = (v, l) => `<div class="db-tile"><b>${v}</b><span>${l}</span></div>`;
  const max30 = Math.max(1, ...D.days30.map(d => D.perDay[d] || 0)), maxW = Math.max(0.1, ...D.wd);
  const wdNames = Array.from({ length: 7 }, (_, i) => new Date(2026, 10, 15 + i).toLocaleDateString(lang(), { weekday: 'narrow' })); // Sun..Sat
  const sMed = data.posts.filter(p => p.mine && p.kind === 'meditation').length, sSer = (data.sermonNotes || []).length;
  return `<section class="db">
    <p class="gd-label">${t('db.title')}</p>
    <div class="db-tiles">${tile(t('db.daysV').replace('{n}', D.weekDays), t('db.days'))}${tile(fmtT(D.monthSec), t('db.time'))}${tile(t('db.chV').replace('{n}', D.monthCh), t('db.chs'))}${tile(t('db.min').replace('{n}', D.avgMin), t('db.avg'))}</div>
    <p class="db-cap">${t('db.c30')}</p>
    <p class="db-read" id="db-read">${t('db.tap')}</p>
    <div class="db-bars" role="img" aria-label="${esc(t('db.c30'))}">${D.days30.map(d => { const n = D.perDay[d] || 0, m = Math.round((D.rt[d] || 0) / 60);
      const lab = t('db.day').replace('{d}', shortDate(d)).replace('{n}', n).replace('{m}', m);
      return `<button class="db-bar${d === today() ? ' today' : ''}" data-action="db-bar" data-id="${esc(lab)}" aria-label="${esc(lab)}"><i style="height:${n ? Math.max(6, n / max30 * 100) : 0}%"></i></button>`; }).join('')}</div>
    <div class="db-axis"><span>${esc(shortDate(D.days30[0]))}</span><span>${esc(shortDate(today()))}</span></div>
    <p class="db-cap">${t('db.wd')}</p>
    <div class="db-wd">${D.wd.map((v, k) => `<div class="db-wcol"><div class="db-wbar"><i style="height:${v ? Math.max(6, v / maxW * 100) : 0}%"></i></div><small>${esc(wdNames[k])}</small><em>${v ? (Math.round(v * 10) / 10) : ''}</em></div>`).join('')}</div>
    <p class="db-foot">${t('db.streak').replace('{n}', D.streak).replace('{m}', D.longest)}<br>${t('db.notes').replace('{s}', sSer).replace('{m}', sMed)}</p>
  </section>`;
}
function yearStats(y = new Date().getFullYear()) {
  const ys = String(y), log = Object.entries(data.readLog || {}).filter(([, d]) => d.startsWith(ys));
  const days = [...new Set(log.map(([, d]) => d))].sort(); let best = 0, run = 0, prev = null; days.forEach(d => { run = prev && dayDiff(prev, d) === 1 ? run + 1 : 1; best = Math.max(best, run); prev = d; });
  const books = Object.entries(data.booksDone || {}).filter(([, d]) => d.startsWith(ys)).map(([b]) => +b);
  return { y, chapters: log.length, days: days.length, best, books, pct: Math.round((data.readDone || []).length / TOTAL_CHAPTERS * 1000) / 10 };
}
async function yearCanvas(kind = 'feed', prog = 1) {
  try { await document.fonts.ready; } catch {}
  const [W, H] = CARD[kind], c = document.createElement('canvas'); c.width = W; c.height = H; drawYear(c.getContext('2d'), W, H, yearStats(), prog); return c;
}
function drawYear(x, W, H, st, prog) {
  const M = Math.round(W * .11), serif = '"Newsreader", Georgia, serif', sans = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif', ease = v => 1 - Math.pow(1 - Math.max(0, Math.min(1, v)), 3);
  x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H);
  x.fillStyle = '#9BA0A3'; x.font = `400 40px ${serif}`; x.fillText('daily', M, M + 30); const dw = x.measureText('daily ').width; x.font = `italic 400 40px ${serif}`; x.fillText('bible', M + dw, M + 30);
  x.fillStyle = '#B5453F'; x.beginPath(); const rx = W - M - 18; x.moveTo(rx, M - 6); x.lineTo(rx + 22, M - 6); x.lineTo(rx + 22, M + 52); x.lineTo(rx + 11, M + 42); x.lineTo(rx, M + 52); x.closePath(); x.fill();
  const top = H * .25, a = ease(prog * 1.4), gap = H > 1500 ? 170 : 132;
  x.globalAlpha = a; x.fillStyle = '#80868A'; x.font = `400 40px ${sans}`; x.fillText(t('yr.title').replace('{y}', st.y), M, top);
  x.fillStyle = '#16191C'; x.font = `400 190px ${serif}`; x.fillText(String(Math.round(st.chapters * ease(prog * 1.2))), M - 8, top + 200);
  x.font = `300 48px ${sans}`; x.fillStyle = '#4A4F54'; x.fillText(t('yr.chapters').replace('{n}', '').trim() + ' ' + t('yr.read'), M, top + 270);
  const rows = [[t('yr.days').replace('{n}', st.days), t('yr.daysL')], [t('yr.best').replace('{n}', st.best), ''], [t('yr.books').replace('{n}', st.books.length), st.books.slice(0, 4).map(b => bookName(b)).join(' · ')], [t('yr.pct').replace('{p}', st.pct), '']];
  rows.forEach(([big, small], i) => { const k = ease(prog * 2 - .35 - i * .18); if (k <= 0) return; x.globalAlpha = k; const yy = top + 390 + i * gap;
    x.fillStyle = '#E3E5E6'; x.fillRect(M, yy - 58, W - 2 * M, 2); x.fillStyle = '#2C3135'; x.font = `400 44px ${sans}`; x.fillText(big, M, yy + 14);
    if (small) { x.fillStyle = '#9BA0A3'; x.font = `300 30px ${sans}`; x.fillText(small, M, yy + 52); } });
  x.globalAlpha = 1; x.fillStyle = '#B4B8BA'; x.font = `400 30px ${sans}`; x.fillText('dailyjourney.org', M, H - M);
}
function yearShare() {
  state.yrKind = state.yrKind || 'feed';
  showSheet({ title: esc(t('yr.title').replace('{y}', new Date().getFullYear())), body: `
    <div class="card-frame"><img id="yr-img" alt="" class="card-img"></div>
    <div class="card-row"><div class="seg card-seg">${[['feed', t('yr.feed')], ['story', t('yr.story')]].map(([k, l]) => `<button type="button" class="${state.yrKind === k ? 'active' : ''}" data-action="yr-kind" data-id="${k}"><span>${l}</span></button>`).join('')}</div></div>
    <div class="sheet-actions"><button class="primary" data-action="yr-post">${icon('camera')}${t('yr.post')}</button><button class="secondary" data-action="yr-reel">${icon('play')}${t('yr.reel')}</button></div>
    <div id="yr-reel"></div>` });
  yearCanvas(state.yrKind).then(c => { const img = $('#yr-img'); if (img) { img.src = c.toDataURL('image/png'); img.style.aspectRatio = state.yrKind === 'story' ? '9 / 16' : '4 / 5'; } });
}
async function yearReel() {
  const box = $('#yr-reel'); if (!box || state.reeling) return;
  try { await document.fonts.ready; } catch {}
  const [W, H] = CARD.story, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), st = yearStats(), total = 5.5;
  const types = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'], type = window.MediaRecorder ? types.find(m => MediaRecorder.isTypeSupported?.(m)) : null;
  if (!type || !c.captureStream) { toast(t('card.noShare')); return; }
  state.reeling = true; box.innerHTML = `<p class="hint" id="yr-p">${t('yr.making').replace('{p}', 0)}</p>`;
  const rec = new MediaRecorder(c.captureStream(30), { mimeType: type, videoBitsPerSecond: 6e6 }), chunks = []; rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => rec.onstop = r); rec.start(250); const start = performance.now();
  await new Promise(r => { const step = () => { const time = (performance.now() - start) / 1000; drawYear(x, W, H, st, Math.min(1, time / (total - 1.2)));
    const pe = $('#yr-p'); if (pe) pe.textContent = t('yr.making').replace('{p}', Math.min(100, Math.round(time / total * 100)));
    if (time < total) requestAnimationFrame(step); else r(); }; requestAnimationFrame(step); });
  rec.stop(); await done; state.reeling = false;
  const mime = type.split(';')[0]; state.reelFile = new File([new Blob(chunks, { type: mime })], `daily-bible-${st.y}.${mime.includes('mp4') ? 'mp4' : 'webm'}`, { type: mime });
  if (!$('#yr-reel')) return;
  $('#yr-reel').innerHTML = `<video class="reel-video" src="${URL.createObjectURL(state.reelFile)}" autoplay muted loop playsinline></video>
    <button class="primary block" data-action="yr-reel-share">${icon('camera')}${t('yr.post')}</button><button class="secondary block" data-action="reel-save" style="margin-top:8px">${icon('download')}${t('yr.save')}</button>`;
}
// 나 › 내 공동체: type a code from your church, small group, chapter or retreat; keep each one loud, quiet, or leave it
function myCommunities() {
  const row = g => { const sub = g.pending ? t('join.pendingShort') : g.muted ? t('mc.quietOn') : g.owner ? t('mc.admin') : '';
    return `<div class="list-row static"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${esc(L(g.name) || t('mc.joining'))}</span>${sub ? `<span class="row-sub">${sub}</span>` : ''}</span>
      <button class="link-btn" data-action="mc-quiet" data-id="${esc(g.id)}">${g.muted ? t('mc.loud') : t('mc.quiet')}</button>
      <button class="link-btn adm-rm" data-action="mc-leave" data-id="${esc(g.id)}">${t('mc.leave')}</button></div>`; };
  return `<p class="gd-label">${t('mc.title')}</p>
    <form id="mc-form" class="mc-form"><input id="mc-code" class="field" maxlength="24" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${esc(t('mc.ph'))}"><button class="secondary" type="submit">${t('mc.connect')}</button></form>
    ${data.groups.length ? `<div class="list mc-list">${data.groups.map(row).join('')}</div>` : `<p class="hint">${t('mc.none')}</p>`}`;
}
function joinByCode(raw) {
  const code = String(raw || '').replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 24);
  if (code.length < 4) { toast(t('mc.bad')); return; }
  if (data.groups.some(g => g.invite === code)) { toast(t('join.already')); return; }
  data.groups.push({ id: 'g' + code, name: '', invite: code, cloud: true, pending: true }); save(); render();
  if (!CLOUD) return;
  if (Cloud.on()) sync(); else welcomeSheet(t('mc.needSign'));
}
document.addEventListener('submit', e => { if (e.target.id === 'mc-form') { e.preventDefault(); joinByCode($('#mc-code').value); } });
function leaveGroup(gid) {
  const g = data.groups.find(x => x.id === gid); if (!g) return;
  if (g.owner) { toast(t('mc.ownerStay')); return; }
  confirmSheet(t('mc.leave'), esc(t('mc.leaveQ').replace('{name}', L(g.name) || t('scope.group'))), t('mc.leave'), async () => {
    if (g.sid && Cloud.on()) { try { await Cloud.rest(`group_members?group_id=eq.${g.sid}&user_id=eq.${Cloud.uid()}`, { method: 'DELETE' }); } catch { toast(t('cl.fail')); return; } }
    data.groups = data.groups.filter(x => x !== g); if (state.group === gid) state.group = data.groups[0]?.id; save(); render(); toast(t('mc.left'));
  });
}
function renderBibleMe() {
  const saved = data.savedVerses || [], medi = data.posts.filter(p => p.mine && p.kind === 'meditation' && p.ref).sort((a, b) => chIndex(a.ref.b, a.ref.c) - chIndex(b.ref.b, b.ref.c));
  const q = noteQuota(), d = readDays();
  main.innerHTML = `<div class="screen"><div class="page bb">
    ${pageHead(t('me.title'), '', roundBtn('settings', 'more', t('aria.settings')))}
    ${myCommunities()}
    ${readGauge()}${dashHtml()}
    <button class="secondary block yr-btn" data-action="yr-share">${icon('camera')}${t('yr.btn')}</button>
    ${d ? `<p class="bb-streak">${icon('sparkle')}${t('me.days').replace('{n}', d)}</p>` : ''}
    <p class="gd-label">${t('me.medi')} · ${medi.length}</p>
    <div class="notes">${medi.slice(0, 20).map(p => `<button class="note" data-action="note" data-id="${esc(p.id)}"><span class="note-meta"><span>${esc(refText(p.ref))}</span></span><span class="note-text">${esc(L(p.text))}</span></button>`).join('') || `<p class="hint">${t('me.none')}</p>`}</div>
    <p class="gd-label">${t('me.saved')} · ${saved.length}</p>
    <div class="notes">${saved.slice(0, 20).map(x => `<button class="note" data-action="open-saved-verse" data-id="${esc(x.key)}"><span class="note-meta"><span>${esc(refText({ b: x.b, c: x.c, v: x.v, v2: x.v }))}</span></span><span class="note-text">${esc(x.text)}</span></button>`).join('') || `<p class="hint">${t('me.none')}</p>`}</div>
    <div class="list" style="margin-top:18px">
      <button class="list-row" data-action="usage"><span class="row-icon">${icon('star')}</span><span class="row-main"><span class="row-title">${t('bs.sub')}</span>${q.limit && q.used / q.limit >= 0.8 ? `<span class="row-sub">${t('bs.almost')}</span>` : ''}</span></button>
      <a class="list-row" href="/app/"><span class="row-icon">${icon('sun')}</span><span class="row-main"><span class="row-title">${t('me.thanks')}</span></span></a>
    </div>
  </div></div>`;
}
function renderChallenges() {
  main.innerHTML = `<div class="screen"><div class="page">
    ${pageHead(t('ch.title'), t('ch.desc'), roundBtn('new-challenge', 'plus', t('ch.new')))}
    ${data.challenges.map(ch => `<section class="ch-card">
      <button class="ch-head" data-action="challenge-detail" data-id="${esc(ch.id)}">
        <span class="row-main"><span class="row-sub">${chTypeLabel(ch)} · ${esc(groupName(ch.group))} · ${Math.min(7, ch.days.length)}/7</span><span class="ch-name">${esc(L(ch.name))}</span></span>
        <span class="row-end">${icon('chevron')}</span></button>
      ${dayRow(ch)}
      <button class="primary block" data-action="challenge-write" data-id="${esc(ch.id)}">${t('ch.write')}</button>
    </section>`).join('')}
  </div></div>`;
}

function renderJournal() {
  const savedView = state.filter === 'saved';
  let mine = savedView ? data.saved.map(id => data.posts.find(p => p.id === id)).filter(p => p && visible(p)) : data.posts.filter(p => p.mine);
  if (!savedView && state.filter !== 'all') mine = mine.filter(p => kindGroup(p) === state.filter);
  const byBible = state.filter === 'meditation';
  if (byBible) mine = mine.slice().sort((a, b) => (a.ref ? chIndex(a.ref.b, a.ref.c) * 1000 + (a.ref.v || 0) : 1e9) - (b.ref ? chIndex(b.ref.b, b.ref.c) * 1000 + (b.ref.v || 0) : 1e9));
  main.innerHTML = `<div class="screen"><div class="page">
    ${pageHead(t('j.title'), t('j.desc'), roundBtn('settings', 'more', t('aria.settings')))}
    ${journalSummary()}
    <div class="seg seg-page">${[['all', t('j.all')], ['thanks', t('f.thanks')], ['meditation', t('f.med')], ['prayer', t('f.prayer')], ['saved', t('j.saved')]].map(([k, label]) => `<button class="${state.filter === k ? 'active' : ''}" data-action="journal-filter" data-id="${k}">${label}</button>`).join('')}</div>
    ${savedView && (data.savedVerses || []).length ? `<div class="notes">${data.savedVerses.map(x => `<button class="note" data-action="open-saved-verse" data-id="${esc(x.key)}">
      <span class="note-meta">${icon('book')}<span>${esc(refText({ b: x.b, c: x.c, v: x.v, v2: x.v }))} · ${esc(x.tr)}</span></span><span class="note-text">${esc(x.text)}</span></button>`).join('')}</div>` : ''}
    ${mine.length ? `<div class="notes">${mine.map((p, i) => `${byBible && (i === 0 || (mine[i - 1].ref?.b !== p.ref?.b)) ? `<p class="note-book">${p.ref ? esc(bookName(p.ref.b)) : '—'}</p>` : ''}<button class="note" data-action="${savedView ? 'post-menu' : 'note'}" data-id="${esc(p.id)}">
      <span class="note-meta"><span>${savedView ? esc(authorName(p)) + ' · ' : ''}${p.kind && p.kind !== 'today' ? esc(kindLabel(p)) + ' · ' : ''}${esc(dayLabel(p.date))}</span>${p.status ? `<span class="badge ${p.status}">${t(p.status === 'review' ? 'mod.review' : 'mod.rejected')}</span>` : ''}${p.scope === 'private' ? `<span class="note-scope">${icon('lock')}</span>` : ''}</span>
      ${p.kind === 'thanks' ? `<span class="note-to">Thank you, ${esc(p.to)}</span>` : ''}<span class="note-text">${esc(L(p.text))}</span>
      ${p.reflection ? `<span class="note-reflect">${t('reflect.prefix')} · ${esc(p.reflection)}</span>` : ''}
    </button>`).join('')}</div>`
      : savedView && (data.savedVerses || []).length ? '' : savedView ? `<div class="empty-state">${icon('bookmark')}<p>${t('j.savedEmpty')}</p></div>`
      : `<div class="empty-state">${icon('pencil')}<p>${t('j.empty')}</p><button class="primary" data-action="compose">${t('top.write')}</button></div>`}
    ${featureOn('sermon') ? sermonSection() : ''}
    <div id="slot-journal"></div>
  </div></div>`;
}

/* Full-screen feed: only the gratitude text, with ♡ count, share and close on the right. */
// "How to get back to thanks": a pill and a dot moving that way, shown until the user has done it once.
const backHint = (dir, text) => `<div class="gesture-hint back-hint gh-${dir}" aria-hidden="true"><div class="gh-row">${dir === 'left' ? `<span class="gh-l">‹ ${text}</span><span></span>` : `<span></span><span class="gh-r">${text} ›</span>`}</div><div class="gh-track"><i class="gh-dot"></i></div></div>`;
function gestureHint() {
  const st = data.settings, L = !!st.triedLeft, R = !!st.triedRight;
  document.querySelector('.gesture-hint:not(.back-hint)')?.remove();
  if (!st.hintArmed || (L && R) || !state.immersive || state.immFeed === 'prayer' || state.immFeed === 'group') return;
  const side = !L && !R ? 'both' : !L ? 'left' : 'right';
  const el = document.createElement('div'); el.className = `gesture-hint gh-${side}`; el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `<div class="gh-row">${side !== 'right' ? `<span class="gh-l">‹ ${t('gh.left')}</span>` : '<span></span>'}${side !== 'left' ? `<span class="gh-r">${t('gh.right')} ›</span>` : '<span></span>'}</div>
    <div class="gh-track"><i class="gh-dot"></i></div>${side === 'both' ? `<p class="gh-up">${t('gh.up')}</p>` : ''}`;
  document.getElementById('app').appendChild(el);
}
const triedSwipe = dir => { data.settings[dir === 'left' ? 'triedLeft' : 'triedRight'] = true; save(); };
function renderImmersive(keepIndex = 0) {
  const prayerMode = state.immFeed === 'prayer';
  const groupMode = state.immFeed === 'group' && data.groups.length > 0;
  const gid = groupMode ? (data.groups.some(g => g.id === state.group) ? state.group : data.groups[0].id) : null;
  if (gid) state.group = gid;
  const pool = groupMode
    ? data.posts.filter(p => visible(p) && inGroup(p, gid))                     // the group's thanks, reflections and prayer requests
    : (() => { const keys = connectedKeys(), strangers = pref('strangers');
        return data.posts.filter(p => visible(p) && !(p.mine && p.scope === 'private') && (p.scope === 'public' || (p.scope === 'group' && data.groups.some(g => inGroup(p, g.id))))
          && (strangers || keys.has(authorKey(p)))
          && (kindGroup(p) === 'prayer' ? pref('feedPrayer') : kindGroup(p) === 'meditation' ? pref('feedMed') : pref('feedThanks'))); })();
  let posts = groupMode ? pool.filter(p => !state.groupKind || kindGroup(p) === state.groupKind).sort((a, b) => (b.date || '').localeCompare(a.date || '')) : rankedOnce('imm', pool);
  const focus = state.immFocus && data.posts.find(p => p.id === state.immFocus);
  if (focus) { posts = [focus, ...posts.filter(p => p.id !== focus.id)]; keepIndex = 0; }
  let seq = groupMode ? [...(state.groupKind ? [] : [{ type: 'devo', gid }]), ...posts.map(p => ({ type: 'post', p })), { type: 'gend', gid, kind: state.groupKind }] : feedSequence(posts);
  if (!groupMode && !prayerMode && !posts.length) seq.unshift({ type: 'empty' });   // nobody connected yet
  if (!groupMode && !prayerMode) { // the season's challenge and the weekly recap, near the top
    const c = activeCampaign(), wn = weekRecapDue();
    if (c && seq.length) seq.splice(Math.min(1, seq.length), 0, { type: 'camp', c });
    if (wn) seq.splice(0, 0, { type: 'wrecap', n: wn });
    // newcomers: the quiz, spread between posts, until it's done (the result stays for that day)
    const q = quizState();
    if (!q.doneOn || q.doneOn === today()) {
      [2, 5, 8].forEach((at, i) => { if (seq.length > at) seq.splice(at + i, 0, { type: 'quiz', i }); });
      if (quizAnswered() >= QUIZ_N) { const last = seq.findIndex(x => x.type === 'quiz' && x.i === QUIZ_N - 1); seq.splice(last + 1, 0, { type: 'quizres' }); }
    }
  }
  if (!groupMode && !prayerMode && !keepIndex) { try { seq.splice(0, 0, ...firstItems()); } catch (e) { console.warn('first cards skipped', e); } }
  // daily bible: prayer requests and today's verses first, then the same sharing feed as daily thanks (thanks, prayer
  // requests, reflections from me and the people I'm connected to), one per card, and a closing card
  if (BIBLE_MODE && !groupMode && !prayerMode) { let f = []; try { f = firstItems(); } catch {} const shown = new Set(f.filter(x => x.p).map(x => x.p.id));
    seq = [...f, ...(f.some(x => x.type === 'planread') ? [] : [{ type: 'devoread' }]), ...posts.filter(p => !shown.has(p.id)).slice(0, 40).map(p => ({ type: 'post', p })), ...(posts.length ? [] : [{ type: 'empty' }]), { type: 'bbend' }]; }   // on opening: my group's new prayer requests, then today's verses, one card each
  if (prayerMode) { // swipe left: my groups' prayer requests first, then requests from people I don't know
    const newest = list => list.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
    const mine = newest(data.posts.filter(p => p.kind === 'prayer' && visible(p) && p.scope === 'group' && data.groups.some(g => inGroup(p, g.id))));
    const pool = data.posts.filter(p => p.kind === 'prayer' && visible(p) && p.scope === 'public');
    if (state.showOthers && !state.othersOrder) state.othersOrder = pool.map(p => p.id).sort(() => Math.random() - .5); // random, fixed for this visit
    const others = state.showOthers ? state.othersOrder.map(id => pool.find(p => p.id === id)).filter(Boolean) : [];
    seq = [...mine.map(p => ({ type: 'post', p })), ...(pool.length ? [{ type: 'pdivider', asked: !!state.showOthers }] : []), ...others.map(p => ({ type: 'post', p }))];
    if (!seq.length) seq = [{ type: 'pdivider', empty: true }];
  }
  main.innerHTML = `<div class="feed-scroll imm-scroll" id="feed-scroll">${seq.map(it => {
    if (it.type === 'gstatus') return groupStatusCard(it.gid);
    if (it.type === 'pdivider') return `<article class="post card-page pdivider-card"><div class="card-inner">
      <p class="pl-caught">${it.empty ? t('pl.empty') : t('pl.caught')}</p>
      ${it.empty || it.asked ? `<p class="card-title">${t('pl.others')}</p>` : `<p class="card-title">${t('pl.ask')}</p>
        <div class="card-actions"><button class="secondary" data-action="pl-others">${t('pl.yes')}</button></div>`}</div></article>`;
    if (it.type === 'devo') return devoCard(it.gid);
    if (it.type === 'gend') return groupEndCard(it.gid, it.kind);
    if (it.type !== 'post') { // verse, writing and other cards get the same 닫기 as posts, in the same spot
      const html = cardFor(it), i = html.lastIndexOf('</article>');
      return i < 0 ? html : html.slice(0, i) + `<aside class="post-rail card-close"><button class="rail-btn" data-action="fullscreen" aria-label="${t('fs.closeAria')}">${icon('minimize')}<span class="rl">${t('fs.close')}</span></button></aside>` + html.slice(i);
    }
    const p = it.p, liked = data.liked.includes(p.id), text = L(p.text);
    const fp = it.firstPr, fpg = fp ? (data.groups.find(g => inGroup(p, g.id))?.name) : null, fpLast = fp && fp.i === fp.n;
    return `<article class="post imm${protectedPost(p) ? ' protected' : ''}${p.mine ? ' mine' : ''}" data-post="${esc(p.id)}"${fp ? ' data-firstpr="1"' : ''}>
      <div class="post-body"><p class="post-text ${textClass(text)}">${esc(text)}</p>${readMore(p, text)}
        <p class="imm-by">${esc(authorName(p))} · ${prayerMode ? esc(p.scope === 'group' ? groupNames(p) : dayLabel(p.date)) : groupMode ? esc(p.kind === 'ahead' ? t('kind.aheadShort') : p.kind && p.kind !== 'today' ? kindLabel(p) : dayLabel(p.date)) : esc([p.scope === 'group' ? groupNames(p) : '', kindShort(p)].filter(Boolean).join(' · '))}${BIBLE_MODE && p.mine && reachOf(p) ? `<span class="imm-reach">${esc(t('inf.people').replace('{n}', reachOf(p)))}</span>` : ''}${isTop(p) ? ` <span class="top-mark">${icon('sparkle')}${t('top.badge')}</span>` : ''}</p></div>
      ${fpLast ? firstOffLinks() : ''}
      <aside class="post-rail">
        ${p.kind === 'prayer' ? prayBtn(p) : `<button class="rail-btn ${liked ? 'liked' : ''}" data-action="like" data-id="${esc(p.id)}" aria-pressed="${liked}">${icon('heart')}${countLabel(p, p.likes + (liked ? 1 : 0))}</button>`}
        <button class="rail-btn ${data.saved.includes(p.id) ? 'saved' : ''}" data-action="save-post" data-id="${esc(p.id)}" aria-pressed="${data.saved.includes(p.id)}" aria-label="${t('save')}">${icon('bookmark')}</button>
      ${protectedPost(p) ? '' : `<button class="rail-btn" data-action="share" data-id="${esc(p.id)}">${icon('share')}<span class="rl">${t('act.share')}</span></button>`}
      <button class="rail-btn rail-more" data-action="post-menu" data-id="${esc(p.id)}" aria-label="${t('more')}">${icon('more')}</button>
        <button class="rail-btn" data-action="fullscreen" aria-label="${t('fs.closeAria')}">${icon('minimize')}<span class="rl">${t('fs.close')}</span>${groupMode || prayerMode || !anyUnseen() ? '' : '<i class="new-dot rail-dot"></i>'}</button>
      </aside></article>`;
  }).join('')}</div>
  ${prayerMode && !data.settings.prayerBackHint ? backHint('left', t('pl.back')) : ''}
  ${groupMode ? `<button class="imm-backbar" data-action="imm-back">${icon('chevron')}<span>${esc(L(data.groups.find(g => g.id === state.group)?.name || t('nav.group')))}${state.groupKind ? ' · ' + t('gd.' + ({ thanks: 'thanks', meditation: 'med', prayer: 'prayer' })[state.groupKind]) : ''}</span></button>`
    : prayerMode ? `<button class="imm-backbar" data-action="imm-back">${icon('chevron')}<span>${t('pr.section')}</span></button>`
    : `<div class="imm-brand" aria-hidden="true"><span class="wordmark">daily <em>${BIBLE_MODE ? 'bible' : 'thanks'}</em></span></div>`}
  <button class="imm-plus" data-action="${BIBLE_MODE ? 'bible-write' : 'imm-write'}" aria-label="${BIBLE_MODE ? t('bp.title2') : t('top.write')}">${icon('plus')}</button>
  ${!groupMode && !prayerMode ? safeHtml(immStreak) : ''}
  <div class="imm-tr"><button class="size-btn" data-action="size-cycle" aria-label="${esc(t('size.btn'))}">${lang() === 'ko' ? '가' : 'A'}<small>±</small></button><button class="imm-lang" data-action="lang-menu" aria-label="${t('aria.lang')}">${icon('globe')}<span>${LANGS.find(x => x[0] === lang())[1]}</span></button></div>
  ${showNudge() && !prayerMode ? `<div class="imm-nudge" id="imm-nudge" aria-hidden="true">${icon('down')}<span>${t('nudge')}</span></div>` : ''}`;
  const sc = $('#feed-scroll');
  if (keepIndex && sc) sc.scrollTop = keepIndex * sc.clientHeight;
  if (sc && !prayerMode && !groupMode && !BIBLE_MODE && !(data.settings.triedLeft && data.settings.triedRight)) {
    if (data.settings.hintArmed) setTimeout(gestureHint, 200);   // keeps showing until both sides were tried
    else { const first = () => { if (sc.scrollTop > sc.clientHeight * .6) { sc.removeEventListener('scroll', first); data.settings.hintArmed = true; save(); setTimeout(gestureHint, 350); } }; sc.addEventListener('scroll', first, { passive: true }); }
  } else document.querySelector('.gesture-hint:not(.back-hint)')?.remove();
  bindGateForm();
  if (sc && $('#imm-nudge')) sc.addEventListener('scroll', hideNudge, { passive: true });
  trackSeen();
  try { watchFirstPrayers(); } catch {}
  fillPlanCards().catch(e => console.warn('plan cards skipped', e));
  fillDevoCards().catch(e => console.warn('passage cards skipped', e));
}
const safeHtml = fn => { try { return fn(); } catch (e) { console.warn(e); return ''; } };

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
  if (!state.immersive || state.immFeed !== 'public') document.querySelector('.gesture-hint:not(.back-hint)')?.remove();
  if (state.immersive) {
    try { renderImmersive(keepIndex); }
    catch (e) { console.error('feed failed', e); state.firstPrIds = []; data.settings.prefs = { ...(data.settings.prefs || {}), firstOff: true };
      try { renderImmersive(0); } catch (e2) { console.error(e2); state.immersive = false; $('#app').classList.remove('immersive'); return render(); } }
    requestAnimationFrame(markClamped); restoreDrafts($('#app')); document.dispatchEvent(new CustomEvent('dt:render', { detail: { tab: 'immersive' } })); return; }
  document.querySelectorAll('[data-tab]').forEach(b => {
    const on = b.dataset.tab === state.tab;
    b.classList.toggle('active', on);
    b.classList.toggle('has-new', b.dataset.tab === 'group' && anyUnseen());
    on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
  });
  { const tl = document.querySelector('.top-lang'); if (tl) { tl.hidden = (data.settings.opens || 0) > 5; tl.setAttribute('aria-label', t('aria.lang')); tl.innerHTML = `${icon('globe')}<span>${LANGS.find(x => x[0] === lang())?.[1] || ''}</span>`; } }
  { const wp = document.querySelector('.write-pill'); if (wp) wp.hidden = BIBLE_MODE && state.tab === 'group'; } // Community has its own +
  ({ feed: () => renderFeed(keepIndex), group: renderGroups, challenges: renderChallenges, journal: renderJournal, read: renderBibleHome, notes: renderSermons, me: renderBibleMe })[state.tab]();
  document.dispatchEvent(new CustomEvent('dt:render', { detail: { tab: state.tab } }));
  requestAnimationFrame(markClamped); restoreDrafts($('#app'));
}

/* ---------------- visibility: Everyone | Private (→ Only me or one of my groups) ---------------- */
const visOf = key => { state.vis = state.vis || {}; return state.vis[key] = state.vis[key] || { mode: 'public', targets: [] }; };
// Private = Only me, or any number of my groups (empty list = Only me).
const visTargets = v => (v.targets || []).filter(id => data.groups.some(g => g.id === id));
function visPicker(key) {
  const v = visOf(key);
  return `<div class="vis" data-vis="${key}">
    <div class="seg">${[['public', t('vis.public'), 'globe'], ['private', t('vis.private'), 'lock']].map(([m, label, ic]) => `<button type="button" class="${v.mode === m ? 'active' : ''}" data-action="vis-mode" data-id="${key}|${m}">${icon(ic)}<span>${label}</span></button>`).join('')}</div>
    <div class="chips vis-targets" ${v.mode === 'private' ? '' : 'hidden'}>${[['me', t('vis.me'), 'lock'], ...data.groups.map(g => [g.id, L(g.name), 'people'])].map(([id, label, ic]) => `<button type="button" class="chip ${(id === 'me' ? !visTargets(v).length : visTargets(v).includes(id)) ? 'active' : ''}" data-action="vis-target" data-id="${key}|${esc(id)}" aria-pressed="${id === 'me' ? !visTargets(v).length : visTargets(v).includes(id)}">${icon(ic)}${esc(label)}</button>`).join('')}</div>
    <p class="hint vis-note">${v.mode === 'public' ? t('compose.publicNote') : t('vis.privateHint')}</p>
  </div>`;
}
// → { scope: 'public' } | { scope: 'private' } | { scope: 'group', group, groups: [...] }
function visScope(key) {
  const v = visOf(key);
  if (v.mode === 'public') return { scope: 'public' };
  const groups = visTargets(v);
  if (!groups.length) return { scope: 'private' };
  return { scope: 'group', group: groups[0], groups };
}
function updateVis(key) {
  const box = document.querySelector(`[data-vis="${key}"]`); if (!box) return;
  const v = visOf(key);
  box.querySelectorAll('[data-action="vis-mode"]').forEach(b => b.classList.toggle('active', b.dataset.id.endsWith('|' + v.mode)));
  box.querySelectorAll('[data-action="vis-target"]').forEach(b => { const id = b.dataset.id.split('|')[1], on = id === 'me' ? !visTargets(v).length : visTargets(v).includes(id); b.classList.toggle('active', on); b.setAttribute('aria-pressed', on); });
  box.querySelector('.vis-targets').hidden = v.mode !== 'private';
  box.querySelector('.vis-note').textContent = v.mode === 'public' ? t('compose.publicNote') : t('vis.privateHint');
}

/* ---------------- sheets ---------------- */
const seg = (items, action, current, extra = '') => `<div class="seg ${extra}">${items.map(([id, label, ic]) => `<button type="button" class="${current === id ? 'active' : ''}" data-action="${action}" data-id="${id}">${ic ? icon(ic) : ''}<span>${label}</span></button>`).join('')}</div>`;

function compose(kind = state.composeKind, chId = state.challenge, keepText = '') {
  state.composeKind = kind; state.challenge = chId;
  state.sheetScope = state.sheetScope || 'public';
  state.sheetGroup = state.sheetGroup || data.groups[0]?.id;
  const ahead = kind === 'ahead', med = kind === 'meditation';
  const kinds = `<div class="kind-chips">${[['today', t('kind.today')], ['ahead', t('kind.aheadShort')], ['thanks', t('kind.thanks')], ['meditation', t('kind.meditation')], ...(featureOn('prayer') ? [['prayer', t('kind.prayer')]] : [])]
    .map(([id, label]) => `<button type="button" class="kind-chip ${kind === id ? 'active' : ''}" data-action="pick-kind" data-id="${id}">${label}</button>`).join('')}</div>`;
  if (kind === 'prayer' && !state.prayerScopeSet) { Object.assign(visOf('compose'), { mode: 'private', targets: data.groups[0] ? [data.groups[0].id] : [] }); state.prayerScopeSet = true; }
  if (kind === 'thanks') {
    showSheet({ title: t('compose.title'), body: `<form id="compose-form" class="sheet-form">${kinds}${thanksForm({ text: keepText, name: state.tyName })}</form>` });
    $('#compose-form').addEventListener('submit', e => {
      e.preventDefault();
      const to = $('#ty-name').value.trim(), text = $('#gratitude-text').value.trim();
      if (!to) { toast(t('ty.needName')); $('#ty-name').focus(); return; }
      if (!text) { $('#gratitude-text').focus(); return; }
      const from = (data.settings.myName || '').trim().slice(0, 30); // the name from sign-up
      const p = { id: 'p' + Date.now(), mine: true, scope: 'private', kind: 'thanks', to, text, date: today(), likes: 0, ...(from ? { from } : {}) };
      data.posts.unshift(p); state.tyName = ''; save(); render(); thanksCard(p.id);
    });
    return;
  }
  showSheet({ title: med && state.medRef ? t('devo.share') : t('compose.title'), body: `<form id="compose-form" class="sheet-form">
    ${med && state.medRef ? '' : kinds}
    ${ahead || med || kind === 'prayer' ? '' : dailyQLine()}
    ${med ? `<div class="med-passage" id="med-passage"></div><p class="field-label">${t('med.felt')}</p>` : ''}
    <textarea id="gratitude-text" data-draft="compose" class="big-input" maxlength="1500" rows="4" placeholder="${esc(ahead ? t('compose.phAhead') : med ? t('devo.ph2') : kind === 'prayer' ? t('pr.ph') : t('compose.qToday'))}" aria-label="${esc(ahead ? t('compose.qAhead') : t('compose.qToday'))}">${esc(keepText)}</textarea>
    ${med ? medExtras() : ''}
    ${ahead ? `<div class="chips">${['work', 'relationship', 'everyday'].map(k => `<button type="button" class="chip" data-action="sample" data-id="${k}">${t('sample.' + k)}</button>`).join('')}</div>` : ''}
    <p class="field-label">${t('compose.who')}</p>
    ${visPicker('compose')}
    ${(() => { const kg = kind === 'meditation' ? 'meditation' : kind === 'prayer' ? 'prayer' : 'thanks', v = visOf('compose'), gids = v.mode === 'private' ? (v.targets || []) : [];
      const c = data.challenges.find(x => gids.includes(x.group) && (x.type || 'thanks') === kg && x.lastDay !== today() && x.days.length < chLen(x));
      return c ? `<p class="ch-count">${icon('sparkle')}${t('ch.counted').replace('{name}', chName(c)).replace('{n}', c.days.length + 1)}</p>` : ''; })()}
    <button class="primary block" type="submit">${t('compose.submit')}</button>
  </form>` });
  if (med) fillMedPassage(); // reflection: today's passage above the writing space
  if (!med) medRecReset();
  $('#compose-form').addEventListener('submit', e => {
    e.preventDefault();
    const kind = state.composeKind, prayer = kind === 'meditation' ? ($('#med-prayer')?.value.trim() || '') : '';
    if (state.medRecOn) medRecStop();
    const voice = kind === 'meditation' && state.medAudio;
    const text = $('#gratitude-text').value.trim() || (kind === 'meditation' && (prayer || voice) ? (prayer ? '' : t('med.voice')) : ''); if (!text && !prayer) { $('#gratitude-text').focus(); return; }
    const asReq = kind === 'meditation' && prayer && $('#med-asreq')?.checked;
    const vis = visScope('compose');
    const pid = 'p' + Date.now();
    const post = (v = vis) => ({ id: pid, mine: true, ...v, kind, text: text || prayer, date: today(), likes: 0, ...(kind === 'meditation' && state.medRef ? { ref: state.medRef } : {}), ...(prayer && text ? { prayer } : {}), ...(voice ? { voice: { dur: state.medAudioDur || 0 } } : {}) });
    // the voice note stays on this device, sealed with the vault key; a prayer can also go out as its own prayer request
    const extras = p => { if (voice) AudioStore.put(p.id, state.medAudio).catch(() => {}); medRecReset();
      if (asReq) data.posts.splice(1, 0, { id: pid + 'r', mine: true, ...visScope('compose'), kind: 'prayer', text: prayer, date: today(), likes: 0, ...(state.medRef ? { ref: state.medRef } : {}) }); };
    if (!passesFilter(text || prayer, vis.scope, (choice, terms) => {
      if (choice === 'edit') return compose(kind, state.challenge, text);
      if (choice === 'private') { const q = post({ scope: 'private' }); data.posts.unshift(q); extras(q); return finishCompose(t('toast.saved')); }
      const p = post(); requestReview(p, terms); data.posts.unshift(p); extras(p); finishCompose(t('mod.appealed'));
    })) return;
    const p = post(); data.posts.unshift(p); extras(p);
    finishCompose(t('toast.saved'));
  });
}
/* ---------- meditation extras: a prayer line, "also a prayer request", and a voice note ---------- */
const medExtras = () => `<p class="field-label">${t('med.prayer')}</p>
    <textarea id="med-prayer" data-draft="compose-prayer" class="big-input med-prayer" maxlength="800" rows="2" placeholder="${esc(t('med.prayerPh'))}"></textarea>
    <label class="med-check"><input type="checkbox" id="med-asreq"><span>${t('med.asReq')}</span></label>
    <div class="med-rec" id="med-rec">${medRecHtml()}</div>`;
const fmtDur = s => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
function medRecHtml() {
  if (state.medRecOn) return `<button type="button" class="med-recbtn on" data-action="med-rec">${icon('mic')}<span>${t('med.recStop')}</span><b id="med-rect">0:00</b></button>`;
  if (state.medAudio) { if (!state.medAudioUrl) state.medAudioUrl = URL.createObjectURL(state.medAudio);
    return `<div class="med-recrow"><audio controls preload="metadata" src="${state.medAudioUrl}"></audio><button type="button" class="link-btn" data-action="med-rec-del">${t('med.recDel')}</button></div>`; }
  return `<button type="button" class="med-recbtn" data-action="med-rec">${icon('mic')}<span>${t('med.rec')}</span></button><p class="hint">${t('med.recNote')}</p>`;
}
const medRecPaint = () => { const el = $('#med-rec'); if (el) el.innerHTML = medRecHtml(); };
function medRecReset() { if (state.medRecOn) medRecStop(true); if (state.medAudioUrl) URL.revokeObjectURL(state.medAudioUrl); state.medAudio = null; state.medAudioUrl = null; state.medAudioDur = 0; }
async function medRecStart() {
  let stream; try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); } catch { toast(t('med.recFail')); return; }
  const type = ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm'].find(m => window.MediaRecorder?.isTypeSupported?.(m)) || '';
  const rec = new MediaRecorder(stream, type ? { mimeType: type, audioBitsPerSecond: 32000 } : undefined), chunks = [], t0 = Date.now();
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  rec.onstop = () => { stream.getTracks().forEach(x => x.stop()); clearInterval(state.medRecTimer);
    if (state.medRecDrop) { state.medRecDrop = false; return; }
    state.medAudio = new Blob(chunks, { type: rec.mimeType || type || 'audio/webm' }); state.medAudioDur = Math.round((Date.now() - t0) / 1000); medRecPaint(); };
  rec.start(1000); state.medRecorder = rec; state.medRecOn = true; medRecPaint();
  state.medRecTimer = setInterval(() => { const s = (Date.now() - t0) / 1000; const el = $('#med-rect'); if (el) el.textContent = fmtDur(s); if (s >= 600) medRecStop(); }, 500);   // 10 minutes at most
}
function medRecStop(drop) { state.medRecOn = false; state.medRecDrop = !!drop; try { state.medRecorder?.stop(); } catch {} state.medRecorder = null; }
// Voice notes live in IndexedDB on this device, sealed with the same vault key as everything else personal.
const AudioStore = (() => {
  let dbP = null;
  const db = () => dbP || (dbP = new Promise((res, rej) => { const r = indexedDB.open('dt-voice', 1); r.onupgradeneeded = () => r.result.createObjectStore('v'); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }));
  const run = async (mode, fn) => { const d = await db(); return new Promise((res, rej) => { const q = fn(d.transaction('v', mode).objectStore('v')); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); };
  const b64 = blob => new Promise(r => { const f = new FileReader(); f.onload = () => r(String(f.result)); f.readAsDataURL(blob); });
  return {
    put: async (id, blob) => { const sealed = await Vault.seal({ d: await b64(blob) }); return run('readwrite', st => st.put(sealed, id)); },
    url: async id => { const sealed = await run('readonly', st => st.get(id)); if (!sealed) return null; const { d } = await Vault.open(sealed); return d; },
    del: id => run('readwrite', st => st.delete(id)).catch(() => {})
  };
})();
// Passage for a reflection: the one already attached, else today's plan (생명의 삶 for Korean), else the chosen group's.
function medPassage() {
  if (state.medRef) return { ref: state.medRef, source: state.medSource || '' };
  const g = visTargets(visOf('compose'))[0] || data.groups[0]?.id;
  const p = todaysPassage(g);
  return p?.ref ? p : null;
}
async function fillMedPassage(focus) {
  const box = $('#med-passage'); if (!box) return;
  const p = medPassage();
  if (!p) {
    box.innerHTML = `<button type="button" class="mp-open" data-action="mp-pick">${icon('book')}<span>${t('bp.pick')}</span>${icon('chevron')}</button>`;
    return;
  }
  state.medRef = p.ref; state.medSource = p.source;
  box.innerHTML = `<p class="mp-head">${icon('book')}<span>${state.medNote ? '' : t('devo.kicker') + (p.source ? ' · ' + esc(p.source) : '') + ' · '}${esc(refText(p.ref))}</span><button type="button" class="link-btn mp-change" data-action="mp-change">${t('devo.change')}</button></p><div class="mp-text">${t('rd.loading')}</div>`;
  try {
    const r = p.ref, verses = await fetchChapter(r.b, r.c);
    const pick = r.c2 > r.c ? await passageVerses(r) : verses.filter(x => !r.v || (x.v >= r.v && x.v <= (r.v2 || r.v))).map(x => ({ ...x, c: r.c }));
    state.medLast = verses[verses.length - 1].v;
    // one verse at a time: swipe (or tap the arrows) to turn
    const el = box.querySelector('.mp-text'); if (!el) return;
    el.classList.add('mp-cards');
    el.innerHTML = `<div class="mp-track">${pick.map(x => `<p class="mp-card"><span>${esc(x.text)}</span></p>`).join('')}</div>
      <div class="mp-nav"><button type="button" class="mp-arrow" data-action="mp-prev" aria-label="‹">‹</button><span class="mp-count">${refText({ b: r.b, c: pick[0]?.c || r.c, v: pick[0]?.v, v2: pick[0]?.v })} · 1/${pick.length}</span><button type="button" class="mp-arrow" data-action="mp-next" aria-label="›">›</button></div>
      ${r.v ? `<div class="mp-range">${r.v > 1 ? `<button type="button" class="link-btn" data-action="mp-grow" data-id="prev">${t('mp.addPrev')}</button>` : '<span></span>'}${(r.v2 || r.v) < state.medLast ? `<button type="button" class="link-btn" data-action="mp-grow" data-id="next">${t('mp.addNext')}</button>` : ''}</div>` : ''}`;
    const track = el.querySelector('.mp-track'), count = el.querySelector('.mp-count');
    const showCount = () => { const i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)); const x = pick[i]; if (x) count.textContent = `${refText({ b: r.b, c: x.c || r.c, v: x.v, v2: x.v })} · ${i + 1}/${pick.length}`; };
    track.addEventListener('scroll', showCount, { passive: true });
    if (focus === 'next') { track.scrollLeft = track.scrollWidth; showCount(); }
  } catch { const el = box.querySelector('.mp-text'); if (el) el.textContent = t('rd.offline'); }
}
// A post shared with a group counts toward that group's challenge of the same kind (one day per day).
function countGroupChallenges(post) {
  const kind = kindGroup(post), gids = postGroups(post) || [];
  data.challenges.filter(c => gids.includes(c.group) && (c.type || 'thanks') === kind && c.lastDay !== today() && c.days.length < chLen(c) && c.id !== state.challenge)
    .forEach(c => { c.days.push(c.days.length + 1); c.lastDay = today(); if (c.days.length >= chLen(c)) state.chFinished = c.id; });
}
function finishCompose(message) {
  const last = data.posts[0]; if (last?.mine && last.date === today() && last.scope === 'group') countGroupChallenges(last);
  if (state.challenge) {
    const ch = data.challenges.find(c => c.id === state.challenge);
    const next = ch && Math.min(ch.days.length + 1, chLen(ch));
    if (ch && ch.lastDay !== today() && !ch.days.includes(next)) { ch.days.push(next); ch.lastDay = today(); if (ch.days.length >= chLen(ch)) state.chFinished = ch.id; else state.chDayDone = ch.id; } // one day per day
  }
  state.challenge = null;
  save(); close(); state.immersive = false; state.tab = BIBLE_MODE ? 'me' : 'journal'; render();
  if (state.chFinished) { const id = state.chFinished; state.chFinished = null; setTimeout(() => chFinish(id), 250); return; }
  if (state.chDayDone) { const c = data.challenges.find(x => x.id === state.chDayDone); state.chDayDone = null; if (c) setTimeout(() => celebrateDay(c), 250); }
  cheer(message);
}
/* A finished challenge: fireworks, the group's result, and ways to share it. */
function confetti(scale = 1) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = document.createElement('canvas'), x = c.getContext('2d'), W = c.width = innerWidth * devicePixelRatio, H = c.height = innerHeight * devicePixelRatio;
  c.className = 'confetti'; document.body.appendChild(c);
  const cols = ['#F2D27A', '#F6E2A8', '#C9CDD0', '#8A9094', '#E7A79E', '#B9D2BF'];
  const bursts = [[.3, .35], [.7, .3], [.5, .22]];
  const parts = bursts.slice(0, scale < 1 ? 2 : 3).flatMap(([bx, by], k) => Array.from({ length: Math.round(46 * scale) }, () => { const a = Math.random() * Math.PI * 2, v = (3 + Math.random() * 6) * devicePixelRatio;
    return { x: bx * W, y: by * H, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2 * devicePixelRatio, r: (2 + Math.random() * 3) * devicePixelRatio, c: cols[(Math.random() * cols.length) | 0], d: k * 220 }; }));
  const t0 = performance.now();
  const step = now => { const el = now - t0; x.clearRect(0, 0, W, H);
    parts.forEach(p => { if (el < p.d) return; p.vy += .12 * devicePixelRatio; p.vx *= .99; p.x += p.vx; p.y += p.vy; x.globalAlpha = Math.max(0, 1 - (el - p.d) / 1900); x.fillStyle = p.c; x.beginPath(); x.arc(p.x, p.y, p.r, 0, 7); x.fill(); });
    if (el < 2300) requestAnimationFrame(step); else c.remove(); };
  requestAnimationFrame(step);
}
// A day done: a small burst, a check mark, and where you are (4/30 · D-26). The whole challenge gets chFinish.
function bookMilestone(b, c) {
  if (c !== BOOKS[b - 1][4]) return;
  const done = Array.from({ length: BOOKS[b - 1][4] }, (_, i) => i + 1).every(n => data.readDone.includes(readKey(b, n))); if (!done) return;
  data.booksDone = data.booksDone || {}; if (data.booksDone[b]) return; data.booksDone[b] = today(); save();
  const all = data.readDone.length >= TOTAL_CHAPTERS;
  setTimeout(() => { if (all) { confetti(); yearShare(); } else celebrateDay(null, t('cel.book').replace('{book}', bookName(b))); }, 400);
}
function celebrateDay(c, title) {
  confetti(.6);
  document.querySelector('.cel-day')?.remove();
  const el = document.createElement('div'); el.className = 'cel-day'; el.setAttribute('role', 'status');
  el.innerHTML = `<div class="cel-day-box"><span class="cel-check">${icon('check')}</span><b>${esc(title || t('cel.today'))}</b>${c ? `<small>${esc(t('cel.dayOf').replace('{name}', L(c.name) || chName(c)).replace('{d}', c.days.length).replace('{t}', chLen(c)))} · ${chDday(c)}</small>` : ''}</div>`;
  el.addEventListener('click', () => el.remove()); document.body.appendChild(el);
  setTimeout(() => el.classList.add('out'), 2000); setTimeout(() => el.remove(), 2500);
}
function chFinish(id) {
  const ch = data.challenges.find(c => c.id === id); if (!ch) return;
  if (!ch.finishedAt) { ch.finishedAt = today(); save(); }
  confetti(); chResult(id);
}
function chResult(id) {
  const ch = data.challenges.find(c => c.id === id); if (!ch) return;
  const st = chStats(ch), g = data.groups.find(x => x.id === ch.group);
  showSheet({ title: '', body: `<div class="chr">
    <p class="cel-title">${t('chr.title').replace('{name}', esc(chName(ch)))}</p>
    <p class="cel-body">${t('chr.sub').replace('{n}', chLen(ch))}</p>
    <div class="chr-nums"><span><b>${st.mine}/${chLen(ch)}</b><small>${t('me')}</small></span>${g ? `<span><b>${st.people}</b><small>${esc(L(g.name))}</small></span><span><b>${st.total}</b><small>${t('gd.' + ({ thanks: 'thanks', meditation: 'med', prayer: 'prayer' })[ch.type || 'thanks'] || 'thanks')}</small></span>` : ''}</div>
    ${seesTop(ch) && st.top.length > 1 ? `<div class="ch-top">${st.top.map((x, i) => `<span class="ch-top-row"><i>${i + 1}</i>${esc(x.name)}<small>${t('chr.days').replace('{n}', x.n)}</small></span>`).join('')}</div>` : ''}
    ${g ? `<button class="primary block" data-action="chr-post" data-id="${esc(id)}">${icon('people')}${t('chr.toGroup')}</button>` : ''}
    <button class="secondary block" data-action="chr-card" data-id="${esc(id)}" style="margin-top:8px">${icon('share')}${t('chr.shareCard')}</button>
  </div>` });
}
async function chResultCard(ch) {
  try { await document.fonts.ready; } catch {}
  const st = chStats(ch), g = data.groups.find(x => x.id === ch.group), [W, H] = CARD.feed, c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), M = Math.round(W * .11), serif = '"Newsreader", Georgia, serif', sans = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
  x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.fillStyle = '#9BA0A3'; x.font = `400 40px ${serif}`; x.fillText('daily', M, M + 30); const dw = x.measureText('daily ').width; x.font = `italic 400 40px ${serif}`; x.fillText('thanks', M + dw, M + 30);
  x.fillStyle = '#B4B8BA'; x.font = `400 34px ${sans}`; x.fillText(g ? L(g.name) : '', M, H * .36);
  x.fillStyle = '#303438'; x.font = `300 80px ${sans}`; x.fillText(chName(ch), M, H * .36 + 110);
  x.font = `300 46px ${sans}`; x.fillStyle = '#5B6064'; x.fillText(t('chr.sub').replace('{n}', chLen(ch)), M, H * .36 + 190);
  const nums = [[st.mine + '/' + chLen(ch), t('me')], ...(g ? [[String(st.people), t('adm.members')], [String(st.total), t('gd.' + ({ thanks: 'thanks', meditation: 'med', prayer: 'prayer' })[ch.type || 'thanks'] || 'thanks')]] : [])];
  nums.forEach(([n, l], i) => { const xx = M + i * ((W - 2 * M) / 3); x.fillStyle = '#303438'; x.font = `300 72px ${sans}`; x.fillText(n, xx, H * .72); x.fillStyle = '#A9AEB1'; x.font = `400 30px ${sans}`; x.fillText(l, xx, H * .72 + 50); });
  x.font = `italic 400 34px ${serif}`; x.fillStyle = '#B4B8BA'; x.fillText('Give thanks daily.', M, H - M + 10);
  return c;
}

function noteSheet(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  if (p.kind === 'thanks') return thanksCard(id);
  showSheet({ title: t('j.title'), body: `${p.ref ? `<p class="gd-label">${esc(refText(p.ref))}</p>` : ''}<p class="quote">${esc(L(p.text))}</p>
    ${p.prayer ? `<p class="field-label">${t('med.prayer')}</p><p class="quote med-pr">${esc(p.prayer)}</p>` : ''}
    ${p.voice ? `<p class="field-label">${t('med.voice')} · ${fmtDur(p.voice.dur || 0)}</p><audio class="med-play" id="note-audio" controls preload="none"></audio>` : ''}
    <div class="list">
      <button class="list-row" data-action="share" data-id="${esc(p.id)}"><span class="row-icon">${icon('upload')}</span><span class="row-main"><span class="row-title">${t('note.share')}</span></span></button>
      ${p.kind === 'ahead' ? `<button class="list-row" data-action="reflect" data-id="${esc(p.id)}"><span class="row-icon">${icon('pencil')}</span><span class="row-main"><span class="row-title">${t('note.reflect')}</span></span></button>` : ''}
      <button class="list-row danger" data-action="delete" data-id="${esc(p.id)}"><span class="row-icon">${icon('trash')}</span><span class="row-main"><span class="row-title">${t('note.delete')}</span></span></button>
    </div>` });
  if (p.voice) AudioStore.url(p.id).then(u => { const a = $('#note-audio'); if (a && u) a.src = u; }).catch(() => {});
}

function reflect(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('reflect.title'), body: `<form id="reflect-form" class="sheet-form"><p class="quote">${esc(L(p.text))}</p>
    <textarea id="reflect-text" data-draft="reflect:${esc(p.id)}" class="big-input" rows="4" placeholder="${esc(t('reflect.q'))}" aria-label="${esc(t('reflect.q'))}">${esc(p.reflection || '')}</textarea>
    <button class="primary block" type="submit">${t('reflect.submit')}</button></form>` });
  $('#reflect-form').addEventListener('submit', e => { e.preventDefault(); p.reflection = $('#reflect-text').value.trim(); save(); close(); renderJournal(); toast(t('toast.reflected')); });
}

/* ---------------- share card image (Instagram feed 4:5 / story 9:16) ----------------
   Proportions: 11% side margins, text block centred slightly above the middle (42% / 45%),
   faint wordmark top-left, author line under the text, "Give thanks daily." at the bottom. */
const CARD = { feed: [1080, 1350], story: [1080, 1920] };
function wrapLines(ctx, text, maxW) {
  const lines = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width <= maxW) { line = test; continue; }
      if (line) lines.push(line);
      if (ctx.measureText(word).width <= maxW) { line = word; continue; }
      line = '';
      for (const ch of word) { if (ctx.measureText(line + ch).width > maxW) { lines.push(line); line = ch; } else line += ch; }
    }
    lines.push(line);
  }
  return lines;
}
async function renderCard(p, kind = 'feed') {
  try { await document.fonts.ready; } catch {}
  const [W, H] = CARD[kind], c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d'), M = Math.round(W * .11), maxW = W - M * 2;
  const serif = '"Newsreader", Georgia, serif', sans = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
  x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); // pure white card
  // wordmark
  x.fillStyle = '#9BA0A3'; x.textBaseline = 'alphabetic';
  x.font = `400 40px ${serif}`; x.fillText('daily', M, M + 30);
  const dw = x.measureText('daily ').width; x.font = `italic 400 40px ${serif}`; x.fillText('thanks', M + dw, M + 30);
  // body: shrink until it fits
  const text = L(p.kind === 'thanks' ? `Thank you, ${p.to}\n\n${L(p.text)}` : p.text);
  const maxH = H * (kind === 'story' ? .52 : .50);
  let size = kind === 'story' ? 64 : 58, lines, lh;
  for (; size >= 44; size -= 2) { x.font = `300 ${size}px ${sans}`; lines = wrapLines(x, text, maxW); lh = size * 1.72; if (lines.length * lh <= maxH) break; }
  if (size < 44) size = 44;
  x.font = `300 ${size}px ${sans}`; lines = wrapLines(x, text, maxW); lh = size * 1.72;
  const fit = Math.max(1, Math.floor(maxH / lh));
  if (lines.length > fit) { // too long for the card: show the beginning and end with "…" (the shared link has the rest)
    lines = lines.slice(0, fit);
    let last = lines[fit - 1].replace(/\s+$/, '');
    while (last && x.measureText(last + '…').width > maxW) last = last.slice(0, -1);
    lines[fit - 1] = last + '…';
  }
  const blockH = lines.length * lh, centre = H * (kind === 'story' ? .45 : .42);
  let y = centre - blockH / 2 + size;
  x.fillStyle = '#303438';
  lines.forEach(l => { x.fillText(l, M, y); y += lh; });
  // author line
  x.font = `400 30px ${sans}`; x.fillStyle = '#A9AEB1';
  x.fillText(`${p.mine ? t('me') : L(p.name)} · ${kindLabel(p)}`, M, y - lh + size + 70);
  // bottom tagline
  x.font = `italic 400 34px ${serif}`; x.fillStyle = '#B4B8BA';
  x.fillText('Give thanks daily.', M, H - M + 10);
  return c;
}
/* ---------------- collections: a month, a season or a year of thanks as Instagram slides ----------------
   Cover ("10월의 감사" / "봄의 감사" / "나의 2026년") + pages of a few thanks each, 4:5 (carousel) or 9:16 (story). */
const kindGroup = p => p.kind === 'meditation' ? 'meditation' : p.kind === 'prayer' ? 'prayer' : 'thanks';
const SEASON_OF = m => m >= 3 && m <= 5 ? 'spring' : m >= 6 && m <= 8 ? 'summer' : m >= 9 && m <= 11 ? 'autumn' : 'winter';
const colPosts = () => data.posts.filter(p => p.mine && p.date && p.scope !== 'private' && !p.status && ((state.colKind || 'all') === 'all' || kindGroup(p) === state.colKind)).sort((a, b) => a.date < b.date ? -1 : 1);
const colKindWord = (cap) => { const w = t('col.kTitle.' + (state.colKind || 'all')); return cap ? w[0].toUpperCase() + w.slice(1) : w; };
function periodOf(iso, type) {
  const y = +iso.slice(0, 4), m = +iso.slice(5, 7);
  if (type === 'm') return `m:${iso.slice(0, 7)}`;
  if (type === 'w') { const d = new Date(iso + 'T00:00:00'); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return `w:${d.toLocaleDateString('en-CA')}`; } // weeks start on Monday
  if (type === 'y') return `y:${y}`;
  const s = SEASON_OF(m); return `s:${s === 'winter' && m <= 2 ? y - 1 : y}-${s}`; // Dec–Feb counts as that December's winter
}
function periodTitle(id) {
  const [type, v] = [id[0], id.slice(2)];
  if (type === 'y') return t('col.yTitle').replace('{y}', v);
  const k = s => s.replace('{k}', colKindWord(false)).replace('{K}', colKindWord(true));
  if (type === 'w') { const d = new Date(v + 'T00:00:00'); return k(id === periodOf(today(), 'w') ? t('col.wTitle') : t('col.wTitle2').replace('{m}', d.getMonth() + 1).replace('{mon}', d.toLocaleDateString(lang(), { month: 'short' })).replace('{d}', d.getDate())); }
  if (type === 'm') { const d = new Date(v + '-01T00:00:00'); return k(t('col.mTitle').replace('{m}', lang() === 'ko' ? d.getMonth() + 1 : d.toLocaleDateString(lang(), { month: 'long' }))); }
  const [y, s] = v.split('-'); return k(t('col.sTitle').replace('{s}', t('col.' + s)));
}
function periodLabel(id) { // chip text: adds the year where the title has none
  if (id[0] === 'w') return periodTitle(id).replace(/의 (감사|묵상|기도|기록)$/, '').replace(/’s .*$/, '');
  const y = id.slice(2, 6), d = new Date(id.slice(2, 9) + '-01T00:00:00');
  const name = id[0] === 'm' ? (lang() === 'ko' ? `${d.getMonth() + 1}월` : d.toLocaleDateString(lang(), { month: 'long' })) : t('col.' + id.slice(7));
  if (id[0] === 'y') return y;
  return +y === new Date().getFullYear() ? name : lang() === 'ko' ? `${y}년 ${name}` : `${name} ${y}`;
}
const periodsOf = type => [...new Set(colPosts().map(p => periodOf(p.date, type)))].reverse();
async function renderCollection(id, kind = 'feed') {
  try { await document.fonts.ready; } catch {}
  const posts = colPosts().filter(p => periodOf(p.date, id[0]) === id);
  const [W, H] = CARD[kind], M = Math.round(W * .11), maxW = W - M * 2;
  const serif = '"Newsreader", Georgia, serif', sans = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif';
  const page = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.fillStyle = '#9BA0A3'; x.textBaseline = 'alphabetic';
    x.font = `400 40px ${serif}`; x.fillText('daily', M, M + 30); const dw = x.measureText('daily ').width; x.font = `italic 400 40px ${serif}`; x.fillText('thanks', M + dw, M + 30);
    return [c, x]; };
  const out = [];
  // cover
  const [c0, x0] = page(), days = new Set(posts.map(p => p.date)).size;
  x0.fillStyle = '#303438'; x0.font = `300 ${kind === 'story' ? 92 : 84}px ${sans}`;
  const title = periodTitle(id); x0.fillText(title, M, H * .46);
  x0.fillStyle = '#8E9396'; x0.font = `300 38px ${sans}`;
  x0.fillText(t('col.sub').replace('{n}', posts.length).replace('{d}', days), M, H * .46 + 86);
  const over = id[0] !== 'y' ? id.slice(2, 6) : (state.colKind || 'all') !== 'all' ? t('f.' + ({ thanks: 'thanks', meditation: 'med', prayer: 'prayer' })[state.colKind]) : '';
  if (over) { x0.fillStyle = '#B4B8BA'; x0.font = `400 32px ${sans}`; x0.fillText(over, M, H * .46 - (kind === 'story' ? 150 : 140)); }
  x0.font = `italic 400 34px ${serif}`; x0.fillStyle = '#B4B8BA'; x0.fillText('Give thanks daily.', M, H - M + 10);
  out.push(c0);
  // pages: up to 9 more (Instagram carousels take 10); long periods pick evenly through the time
  const size = kind === 'story' ? 46 : 42, lh = size * 1.66, top = M + 170, bottom = H - M - 80, maxLines = 4;
  const measure = (x, p) => { x.font = `300 ${size}px ${sans}`; let lines = wrapLines(x, L(p.kind === 'thanks' ? `Thank you, ${p.to}\n${L(p.text)}` : p.text), maxW);
    if (lines.length > maxLines) { lines = lines.slice(0, maxLines); let l = lines[maxLines - 1]; while (l && x.measureText(l + '…').width > maxW) l = l.slice(0, -1); lines[maxLines - 1] = l + '…'; }
    return lines; };
  const [, probe] = page(), packs = []; let cur = [], h = 0;
  for (const p of posts) { const need = 44 + measure(probe, p).length * lh + 64; if (cur.length && h + need > bottom - top) { packs.push(cur); cur = []; h = 0; } cur.push(p); h += need; }
  if (cur.length) packs.push(cur);
  const keep = packs.length <= 9 ? packs : Array.from({ length: 9 }, (_, i) => packs[Math.round(i * (packs.length - 1) / 8)]);
  for (const pack of keep) {
    const [c, x] = page(); const blocks = pack.map(p => measure(x, p));
    const total = blocks.reduce((a, ls) => a + 44 + ls.length * lh + 64, -64);
    let y = top + Math.max(0, (bottom - top - total) / 2);
    pack.forEach((p, i) => {
      x.font = `400 28px ${sans}`; x.fillStyle = '#A9AEB1'; x.fillText(`${shortDate(p.date)}${p.kind && p.kind !== 'today' ? ' · ' + kindLabel(p) : ''}`, M, y + 28); y += 44;
      x.font = `300 ${size}px ${sans}`; x.fillStyle = '#303438'; blocks[i].forEach(l => { y += lh; x.fillText(l, M, y - lh * .28); }); y += 64;
    });
    x.font = `400 30px ${sans}`; x.fillStyle = '#B4B8BA'; x.fillText(title, M, H - M + 10);
    out.push(c);
  }
  return out;
}
function collectionSheet(type = state.colType || 'm', id) {
  state.colType = type; state.cardKind = state.cardKind || 'feed';
  const list = periodsOf(type); id = id && list.includes(id) ? id : list[0]; state.colId = id;
  const kinds = [['all', t('col.kAll')], ['thanks', t('f.thanks')], ['meditation', t('f.med')], ['prayer', t('f.prayer')]];
  showSheet({ title: t('col.title'), body: `<div class="chips col-kinds">${kinds.map(([k, l]) => `<button type="button" class="chip ${(state.colKind || 'all') === k ? 'active' : ''}" data-action="col-kindf" data-id="${k}">${l}</button>`).join('')}</div>
    <div class="seg">${[['w', t('col.week')], ['m', t('col.month')], ['s', t('col.season')], ['y', t('col.year')]].map(([k, l]) => `<button type="button" class="${type === k ? 'active' : ''}" data-action="col-type" data-id="${k}">${l}</button>`).join('')}</div>
    ${id ? `<div class="chips col-chips">${list.map(x => `<button type="button" class="chip ${x === id ? 'active' : ''}" data-action="col-pick" data-id="${esc(x)}">${esc(periodLabel(x))}</button>`).join('')}</div>
    <div class="col-track" id="col-track"><p class="hint">${t('rd.loading')}</p></div>
    <div class="card-row"><div class="seg card-seg">${[['feed', t('card.feed')], ['story', t('card.story')]].map(([k, l]) => `<button type="button" class="${state.cardKind === k ? 'active' : ''}" data-action="col-kind" data-id="${k}"><span>${l}</span></button>`).join('')}</div></div>
    <p class="hint" id="col-hint"></p>
    <button class="primary block" data-action="col-share">${icon('camera')}${t('col.post')}</button>
    <button class="secondary block" data-action="col-save" style="margin-top:8px">${icon('download')}${t('col.save')}</button>
    <div class="col-reel" id="col-reel"><button class="secondary block" data-action="col-reel">${icon('sparkle')}${t('col.reel')}</button></div>`
    : `<p class="hint">${t('col.empty')}</p>`}` });
  if (id) drawCollection();
}
async function drawCollection() {
  const tr = $('#col-track'); if (!tr) return;
  const rb = $('#col-reel'); if (rb && !state.reeling) { rb.innerHTML = `<button class="secondary block" data-action="col-reel">${icon('sparkle')}${t('col.reel')}</button>`; state.reelFile = null; }
  const cs = await renderCollection(state.colId, state.cardKind);
  state.colCanvases = cs;
  tr.innerHTML = cs.map(c => `<img class="col-img ${state.cardKind}" alt="" src="${c.toDataURL('image/png')}">`).join('');
  const h = $('#col-hint'); if (h) h.textContent = t('col.hintP').replace('{n}', cs.length);
}
async function collectionFiles() {
  const cs = state.colCanvases || await renderCollection(state.colId, state.cardKind);
  return Promise.all(cs.map(async (c, i) => new File([await new Promise(r => c.toBlob(r, 'image/png'))], `daily-thanks-${state.colId.slice(2)}-${i + 1}.png`, { type: 'image/png' })));
}
async function shareCollection() {
  const files = await collectionFiles();
  try { if (navigator.canShare && navigator.canShare({ files })) { await navigator.share({ files, title: periodTitle(state.colId) }); return; } } catch { return; }
  saveCollection(files);
}
async function saveCollection(files) {
  files = files || await collectionFiles();
  files.forEach((f, i) => setTimeout(() => { const a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, i * 250));
  toast(t('col.saved'));
}
/* Reel: the same collection as a short vertical video (9:16) — a soft cover, one note at a time fading in, and the
   wordmark at the end. Drawn on a canvas and recorded in the browser (MP4 where the phone supports it). */
function reelScenes(id) {
  const posts = colPosts().filter(p => periodOf(p.date, id[0]) === id);
  const pick = posts.length <= 8 ? posts : Array.from({ length: 8 }, (_, i) => posts[Math.round(i * (posts.length - 1) / 7)]);
  return { title: periodTitle(id), sub: t('col.sub').replace('{n}', posts.length).replace('{d}', new Set(posts.map(p => p.date)).size), year: id.slice(2, 6), pick };
}
function drawReel(x, W, H, sc, time) {
  const serif = '"Newsreader", Georgia, serif', sans = '"Noto Sans KR", "Apple SD Gothic Neo", sans-serif', M = Math.round(W * .11), maxW = W - M * 2;
  const COVER = 2.8, EACH = 2.6, END = 2.4, total = COVER + sc.pick.length * EACH + END;
  const ease = v => v < 0 ? 0 : v > 1 ? 1 : v * v * (3 - 2 * v);
  x.fillStyle = '#FFFFFF'; x.fillRect(0, 0, W, H); x.textBaseline = 'alphabetic';
  const fade = (t0, len) => { const a = ease((time - t0) / .5), b = 1 - ease((time - (t0 + len - .5)) / .5); return Math.min(a, b); };
  // faint wordmark top-left (not on the last scene)
  if (time < total - END) { x.globalAlpha = .9; x.fillStyle = '#9BA0A3'; x.font = `400 40px ${serif}`; x.fillText('daily', M, M + 30); const dw = x.measureText('daily ').width; x.font = `italic 400 40px ${serif}`; x.fillText('thanks', M + dw, M + 30); x.globalAlpha = 1; }
  if (time < COVER) {
    const a = fade(0, COVER), rise = (1 - ease(time / .9)) * 24;
    x.globalAlpha = a; x.fillStyle = '#B4B8BA'; x.font = `400 34px ${sans}`; x.fillText(sc.year, M, H * .44 - 150 + rise);
    x.fillStyle = '#303438'; x.font = `300 96px ${sans}`; x.fillText(sc.title, M, H * .44 + rise);
    x.fillStyle = '#8E9396'; x.font = `300 40px ${sans}`; x.fillText(sc.sub, M, H * .44 + 92 + rise); x.globalAlpha = 1;
  } else if (time < total - END) {
    const i = Math.floor((time - COVER) / EACH), t0 = COVER + i * EACH, p = sc.pick[i];
    const a = fade(t0, EACH), rise = (1 - ease((time - t0) / .8)) * 30, size = 56, lh = size * 1.7;
    x.font = `300 ${size}px ${sans}`;
    let lines = wrapLines(x, L(p.kind === 'thanks' ? `Thank you, ${p.to}\n${L(p.text)}` : p.text), maxW);
    if (lines.length > 7) { lines = lines.slice(0, 7); lines[6] = lines[6].replace(/.$/, '…'); }
    const top = H * .46 - lines.length * lh / 2;
    x.globalAlpha = a;
    x.fillStyle = '#A9AEB1'; x.font = `400 32px ${sans}`; x.fillText(`${shortDate(p.date)}${p.kind && p.kind !== 'today' ? ' · ' + kindLabel(p) : ''}`, M, top - 30 + rise);
    x.fillStyle = '#303438'; x.font = `300 ${size}px ${sans}`; lines.forEach((l, k) => x.fillText(l, M, top + size + k * lh + rise));
    // progress dots
    x.globalAlpha = 1; sc.pick.forEach((_, k) => { x.fillStyle = k === i ? '#8A9094' : '#E3E5E6'; x.beginPath(); x.arc(M + k * 22, H - M - 120, 5, 0, 7); x.fill(); });
    x.fillStyle = '#B4B8BA'; x.font = `400 30px ${sans}`; x.fillText(sc.title, M, H - M + 10);
  } else {
    const a = ease((time - (total - END)) / .6);
    x.globalAlpha = a; x.fillStyle = '#383D42'; x.font = `400 92px ${serif}`;
    const w1 = x.measureText('daily ').width; x.font = `italic 400 92px ${serif}`; const w2 = x.measureText('thanks').width;
    const sx = (W - w1 - w2) / 2; x.font = `400 92px ${serif}`; x.fillText('daily', sx, H * .48); x.font = `italic 400 92px ${serif}`; x.fillText('thanks', sx + w1, H * .48);
    x.fillStyle = '#9BA0A3'; x.font = `italic 400 40px ${serif}`; const tg = 'Give thanks daily.'; x.fillText(tg, (W - x.measureText(tg).width) / 2, H * .48 + 80);
    x.globalAlpha = 1;
  }
  return total;
}
async function makeReel() {
  const box = $('#col-reel'); if (!box || state.reeling) return;
  try { await document.fonts.ready; } catch {}
  const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
  const sc = reelScenes(state.colId); const total = drawReel(x, W, H, sc, 0);
  const types = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
  const type = window.MediaRecorder ? types.find(m => MediaRecorder.isTypeSupported?.(m)) : null;
  if (!type || !c.captureStream) { toast(t('card.noShare')); return; }
  state.reeling = true;
  box.innerHTML = `<p class="hint" id="reel-p">${t('col.reeling').replace('{p}', 0)}</p>`;
  const stream = c.captureStream(30), rec = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 6e6 }), chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const done = new Promise(r => rec.onstop = r);
  rec.start(250); const start = performance.now();
  await new Promise(r => { const step = () => { const time = (performance.now() - start) / 1000; drawReel(x, W, H, sc, Math.min(time, total));
    const pe = $('#reel-p'); if (pe) pe.textContent = t('col.reeling').replace('{p}', Math.min(100, Math.round(time / total * 100)));
    if (time < total + .2) requestAnimationFrame(step); else r(); }; requestAnimationFrame(step); });
  rec.stop(); await done; state.reeling = false;
  const ext = type.includes('mp4') ? 'mp4' : 'webm';
  state.reelFile = new File([new Blob(chunks, { type: type.split(';')[0] })], `daily-thanks-${state.colId.slice(2)}.${ext}`, { type: type.split(';')[0] });
  const url = URL.createObjectURL(state.reelFile);
  if (!$('#col-reel')) return;
  $('#col-reel').innerHTML = `<video class="reel-video" src="${url}" autoplay muted loop playsinline></video>
    <button class="primary block" data-action="reel-share">${icon('camera')}${t('col.reelPost')}</button>
    <button class="secondary block" data-action="reel-save" style="margin-top:8px">${icon('download')}${t('col.reelSave')}</button>`;
}
async function showCardPreview(id) {
  const p = data.posts.find(x => x.id === id), img = $('#card-img'); if (!p || !img) return;
  const c = await renderCard(p, state.cardKind || 'feed');
  img.src = c.toDataURL('image/png');
  img.style.aspectRatio = (state.cardKind || 'feed') === 'story' ? '9 / 16' : '4 / 5';
}
async function shareImage(id, external = true) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  const c = await renderCard(p, state.cardKind || 'feed');
  const blob = await new Promise(res => c.toBlob(res, 'image/png'));
  const file = new File([blob], 'daily-thanks.png', { type: 'image/png' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Daily Thanks', text: postLink(p) }); countShare(id, external); return; }
  } catch { return; }
  toast(t('card.noShare'));
}

/* Share link: dailyjourney.org/t/#… opens the thanks on its own page (with "write your own" → the app).
   The words travel inside the link's # part, so no server is needed and nothing is stored anywhere. */
function postLink(p) {
  const kind = p.kind === 'thanks' || p.kind === 'ahead' || p.kind === 'meditation' ? p.kind : 'today';
  const payload = { t: L(p.text), n: p.mine ? (p.from || data.settings.myName || '') : authorName(p), k: kind, d: p.date, l: lang(), ...(p.to ? { to: p.to } : {}), ...(p.ref ? { r: refText(p.ref) } : {}) };
  const b64 = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(payload)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  // a reflection opens right in the app (passage + what they wrote); other posts open on their own web page
  if (kind === 'meditation') return `${LEGAL_BASE}/${BIBLE_MODE ? 'daily-bible' : 'app'}/#m=${b64}`;
  return `${LEGAL_BASE}/t/#${b64}`;
}
async function openSharedMeditation(b64) {
  let x; try { x = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)))); } catch { toast(t('smd.bad')); return; }
  const ref = parseRef(x.r || ''), name = String(x.n || '').slice(0, 30), text = String(x.t || '').slice(0, 2000);
  state.sharedMed = { ref, text };
  showSheet({ title: esc(name ? t('smd.title').replace('{n}', name) : t('smd.someone')), body: `
    ${ref ? `<div class="sm-refrow"><span class="sm-ref">${icon('book')}${esc(refText(ref))}</span><button class="secondary sm-full" data-action="sm-read">${icon('maximize')}${t('sm.full')}</button></div><div class="sn-ptext sm-pass" id="sm-pass"><p class="hint">${t('rd.loading')}</p></div>` : ''}
    <p class="quote sm-text">${esc(text)}</p>
    ${x.d ? `<p class="hint">${esc(dayLabel(x.d))}</p>` : ''}
    <div class="sheet-actions">${ref ? `<button class="secondary" data-action="sm-read">${icon('book')}${t('smd.read')}</button>` : ''}<button class="primary" data-action="sm-write">${icon('pencil')}${t('smd.write')}</button></div>` });
  if (ref) { try { const vs = await passageVerses(ref.v ? ref : { ...ref, v: 1, v2: 999 }); const el = $('#sm-pass'); if (el) el.innerHTML = passageHtml(vs.map(v => `${v.c}:${v.v} ${v.text}`).join('\n')); } catch { const el = $('#sm-pass'); if (el) el.remove(); } }
}
const withLink = (text, p) => `${text}\n\n${postLink(p)}`;
function share(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  if (protectedPost(p)) { toast(t('prot.noShare')); return; }
  state.cardKind = state.cardKind || 'feed';
  showSheet({ title: t('share.title'), body: `<button class="link-first" data-action="send-link" data-id="${esc(id)}"><span class="lf-ic">${icon('send')}</span><span class="lf-main"><span>${t('share.sendLink')}</span><small>${t('share.linkSub')}</small></span>${icon('chevron')}</button>
    <div class="card-frame"><img id="card-img" alt="" class="card-img"></div>
    <div class="card-row"><div class="seg card-seg">${[['feed', t('card.feed')], ['story', t('card.story')]].map(([k, label]) => `<button type="button" class="${state.cardKind === k ? 'active' : ''}" data-action="card-kind" data-id="${esc(id)}|${k}"><span>${label}</span></button>`).join('')}</div></div>
    <div class="list">
      <button class="list-row" data-action="copy-link" data-id="${esc(id)}"><span class="row-icon">${icon('copy')}</span><span class="row-main"><span class="row-title">${t('share.link')}</span></span></button>
      <button class="list-row" data-action="share-kakao" data-id="${esc(id)}"><span class="row-icon">${icon('chat')}</span><span class="row-main"><span class="row-title">${t('share.kakao')}</span></span></button>
      <button class="list-row" data-action="share-insta-img" data-id="${esc(id)}"><span class="row-icon">${icon('camera')}</span><span class="row-main"><span class="row-title">${t('share.insta')}</span></span></button>
      <button class="list-row" data-action="copy-share" data-id="${esc(id)}"><span class="row-icon">${icon('copy')}</span><span class="row-main"><span class="row-title">${t('share.copy')}</span></span></button>
      <button class="list-row" data-action="send-group" data-id="${esc(id)}"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${t('share.toGroup')}</span></span><span class="row-end">${icon('chevron')}</span></button>
      <button class="list-row" data-action="native-share" data-id="${esc(id)}"><span class="row-icon">${icon('upload')}</span><span class="row-main"><span class="row-title">${t('share.native')}</span></span></button>
    </div><p class="hint">${t('share.outNote')}</p><p class="hint">${t('share.note')}</p>` });
  showCardPreview(id);
}

function sendToGroup(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('share.toGroup'), body: `<p class="quote">${esc(L(p.text))}</p><p class="field-label">${t('send.pick')}</p>
    <div class="list">${data.groups.map(g => `<button class="list-row" data-action="send-to" data-id="${esc(id)}|${esc(g.id)}"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${esc(L(g.name))}</span></span><span class="row-end">${icon('chevron')}</span></button>`).join('')}</div>` });
}

/* ---------------- group invites ----------------
   Each group has an invite code. The link opens dailyjourney.org/join/, which hands over to the app
   (daily-thanks://join?c=…&n=…); with the server, the code is checked there (POST /api/groups/join). */
const INVITE_BASE = () => `${LEGAL_BASE}/join/`;
const newCode = () => Array.from(crypto.getRandomValues(new Uint8Array(6)), b => 'abcdefghjkmnpqrstuvwxyz23456789'[b % 31]).join('');
/* ---------------- privacy lock (end-to-end) ----------------
   Everything personal is sealed with AES-GCM on the device before it is synced; the key never leaves the device
   (the user can copy a recovery key to open it on a new phone). The server — and anyone running it — only stores
   ciphertext, plus the posts the user chose to share with everyone (those are public by choice and need moderation).
   Groups have their own key, carried only in the invite link's #fragment (browsers never send it to a server). */
const Vault = (() => {
  const KEY = 'dt-vault-key';
  const b64 = u => btoa(String.fromCharCode(...new Uint8Array(u)));
  const unb64 = s => Uint8Array.from(atob(String(s).replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));
  const url64 = u => b64(u).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  let keyP = null;
  const raw = () => { try { let r = localStorage.getItem(KEY); if (!r) { r = url64(crypto.getRandomValues(new Uint8Array(32))); localStorage.setItem(KEY, r); } return r; } catch { return null; } };
  // In the phone app the key lives in the iPhone Keychain / Android Keystore (SecureStore), never in web storage.
  const secure = () => window.Capacitor?.Plugins?.SecureStore;
  const rawAsync = async () => {
    const S = secure(); if (!S) return raw();
    try {
      const { value } = await S.get({ key: 'vault' }); if (value) return value;
      let r = null; try { r = localStorage.getItem(KEY); } catch {}
      r = r || url64(crypto.getRandomValues(new Uint8Array(32)));
      await S.set({ key: 'vault', value: r }); try { localStorage.removeItem(KEY); } catch {}   // moved out of web storage
      return r;
    } catch { return raw(); }
  };
  const imp = r => crypto.subtle.importKey('raw', unb64(r), 'AES-GCM', false, ['encrypt', 'decrypt']);
  const key = () => keyP || (keyP = rawAsync().then(imp));
  const sealWith = async (k, obj) => { const iv = crypto.getRandomValues(new Uint8Array(12)); const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(JSON.stringify(obj))); return { v: 1, iv: b64(iv), ct: b64(ct) }; };
  const openWith = async (k, s) => JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(s.iv) }, k, unb64(s.ct))));
  return {
    seal: async obj => sealWith(await key(), obj),
    open: async sealed => openWith(await key(), sealed),
    // what the server keeps: only posts shared with everyone stay readable; the rest is one sealed box
    sealState: async st => ({ posts: (st.posts || []).filter(p => p.mine && p.scope === 'public' && !p.status), sealed: await sealWith(await key(), st) }),
    openState: async st => st && st.sealed ? openWith(await key(), st.sealed) : st,
    recoveryCode: () => rawAsync(),
    restore: async code => { const c = String(code || '').trim(); try { if (unb64(c).length !== 32) return false; await imp(c);
      const S = secure(); if (S) await S.set({ key: 'vault', value: c }); else localStorage.setItem(KEY, c); keyP = null; return true; } catch { return false; } },
    newGroupKey: () => url64(crypto.getRandomValues(new Uint8Array(32))),
    sealForGroup: async (groupKey, obj) => sealWith(await imp(groupKey), obj),
    openForGroup: async (groupKey, sealed) => openWith(await imp(groupKey), sealed)
  };
})();
function vaultSheet() {
  showSheet({ title: t('vault.title'), body: `<p class="hint">${t('vault.body')}</p><p class="hint">${t('vault.group')}</p>
    <p class="field-label">${t('vault.code')}</p><p class="vault-code" id="vault-code">…</p>
    <p class="hint">${t('vault.codeHint')}</p>
    <button class="secondary block" data-action="vault-copy">${icon('copy')}${t('vault.copy')}</button>
    <p class="field-label">${t('vault.restore')}</p>
    <form id="vault-form" class="sheet-form"><input id="vault-in" class="field" placeholder="${esc(t('vault.restorePh'))}" autocomplete="off" spellcheck="false"><button class="secondary block" type="submit">${t('vault.restore')}</button></form>` });
  Vault.recoveryCode().then(c => { const el = $('#vault-code'); if (el) el.textContent = c || ''; });
  $('#vault-form').addEventListener('submit', async e => { e.preventDefault(); if (await Vault.restore($('#vault-in').value)) { close(); toast(t('vault.restored')); document.dispatchEvent(new CustomEvent('dt:vault-restored')); } else toast(t('vault.bad')); });
}
// Group keys travel only in the invite link's # part (never sent to any server).
const groupKeyOf = g => { if (!g.key) { g.key = Vault.newGroupKey(); save(); } return g.key; };
// Someone else's group (or private) post: read it here, but it can't be shared, copied or captured.
const protectedPost = p => !!p && !p.mine && p.scope !== 'public';
function inviteLink(g) {
  if (!g.invite) { g.invite = newCode(); save(); }
  if (BIBLE_MODE) return `${LEGAL_BASE}/daily-bible/#join?c=${encodeURIComponent(g.invite)}&n=${encodeURIComponent(L(g.name))}${g.approve ? '&a=1' : ''}&k=${groupKeyOf(g)}`;
  return `${INVITE_BASE()}?c=${encodeURIComponent(g.invite)}&n=${encodeURIComponent(L(g.name))}${g.approve ? '&a=1' : ''}#k=${groupKeyOf(g)}`;
}
function inviteSheet(id) {
  const g = data.groups.find(x => x.id === id); if (!g) return;
  if (!canInvite(g)) { toast(t('adm.inviteOff')); return; }
  const link = inviteLink(g), name = L(g.name);
  const msg = `${t('inv.msg').replace('{name}', name)}\n${link}`;
  showSheet({ title: t('inv.title'), body: `<p class="hint">${esc(t('inv.desc').replace('{name}', name))}</p>
    <div class="invite-link selectable">${esc(decodeURIComponent(link))}</div>
    <div class="sheet-actions"><button class="primary" data-action="invite-share" data-id="${esc(id)}">${icon('share')}${t('inv.share')}</button>
    <button class="secondary" data-action="invite-copy" data-id="${esc(id)}">${t('inv.copy')}</button></div>` });
  state.inviteMsg = msg;
}
/* Reading-plan invite: the plan travels in the link (range, length, start date), so whoever opens it reads the
   same portion on the same day — no account needed. dailyjourney.org/daily-bible/#plan?f=1.1&t=1.50&d=30&s=2026-11-17 */
function planLink(ch) {
  const p = ch.plan; if (!p) return '';
  const q = new URLSearchParams({ f: p.from.join('.'), t: p.to.join('.'), d: String(chLen(ch)), s: ch.start, n: ch.name || '', by: data.settings.myName || '' });
  return `${LEGAL_BASE}/daily-bible/#plan?${q.toString()}`;
}
function planInvite(id) {
  const ch = data.challenges.find(x => x.id === id); if (!ch?.plan) return;
  const link = planLink(ch), range = `${refText({ b: ch.plan.from[0], c: ch.plan.from[1] })} → ${refText({ b: ch.plan.to[0], c: ch.plan.to[1] })}`;
  state.inviteMsg = t('pl.msg').replace('{by}', '').replace('{name}', ch.name || chName(ch)).replace('{range}', range).replace('{days}', chLen(ch)).trim() + '\n' + link;
  showSheet({ title: t('pl.invTitle'), body: `<p class="hint">${esc(t('pl.invDesc').replace('{name}', ch.name || chName(ch)))}</p>
    <p class="pl-sum">${esc(range)} · ${chLen(ch)}${lang() === 'ko' ? '일' : ' ' + t('ch.u.d').toLowerCase()}</p>
    <div class="invite-link selectable">${esc(link)}</div>
    <div class="sheet-actions"><button class="primary" data-action="invite-share">${icon('share')}${t('inv.share')}</button>
    <button class="secondary" data-action="plan-copy" data-id="${esc(id)}">${t('inv.copy')}</button></div>
    <button class="subtle-link" data-action="plan-invite-done">${t('np.later')}</button>` });
}
function planJoin(q) {
  const pair = x => { const [b, c] = String(x || '').split('.').map(Number); return b >= 1 && b <= 66 && c >= 1 && c <= BOOKS[b - 1][4] ? [b, c] : null; };
  const from = pair(q.get('f')), to = pair(q.get('t')), days = Math.min(730, Math.max(1, +q.get('d') || 0)), start = /^\d{4}-\d{2}-\d{2}$/.test(q.get('s') || '') ? q.get('s') : today();
  if (!from || !to || chIndex(...to) < chIndex(...from)) return;
  const name = String(q.get('n') || '').slice(0, 50) || t('chn.bible'), by = String(q.get('by') || '').slice(0, 30);
  const total = chIndex(...to) - chIndex(...from) + 1, range = `${refText({ b: from[0], c: from[1] })} → ${refText({ b: to[0], c: to[1] })}`;
  const dup = data.challenges.find(c => c.plan && c.start === start && c.plan.from.join('.') === from.join('.') && c.plan.to.join('.') === to.join('.') && chLen(c) === days);
  showSheet({ title: t('pl.joinTitle'), body: `<p class="pl-by">${esc(t('pl.joinBy').replace('{by}', by || t('pl.someone')))}</p>
    <h2 class="pl-name">${esc(name)}</h2><p class="pl-sum">${esc(range)} · ${days}${lang() === 'ko' ? '일' : ' ' + t('ch.u.d').toLowerCase()} · ${esc(start === today() ? t('pl.today') : dayLabel(start))}</p>
    <button class="primary block" data-action="plan-join">${t('pl.join')}</button>` });
  state.planJoin = dup ? null : { id: 'ch' + Date.now(), name, type: 'bible', length: days, group: 'pair', members: [{ ko: '나', en: 'Me', es: 'Yo' }, ...(by ? [by] : [])], start, days: [], plan: { from, to, total } };
}
function joinGroup(code, name, key) {
  code = String(code || '').replace(/[^a-z0-9]/gi, '').slice(0, 24); name = String(name || '').trim().slice(0, 30);
  key = /^[A-Za-z0-9_-]{43}$/.test(String(key || '')) ? key : '';
  const approve = /[?&]a=1/.test(location.hash + location.search) || state.joinApprove;
  if (!code) return;
  const have = data.groups.find(g => g.invite === code);
  if (have) { state.tab = 'feed'; state.feed = 'group'; state.group = have.id; render(); toast(t('join.already')); return; }
  showSheet({ title: t('join.title'), body: `<p class="hint">${esc(t('join.body').replace('{name}', name || t('scope.group')))}</p>
    <div class="sheet-actions"><button class="primary" data-action="join-ok">${t('join.ok')}</button><button class="secondary" data-action="close">${t('cancel')}</button></div>` });
  state.pendingJoin = { code, name: name || t('scope.group'), key, approve };
}
function createGroup() {
  if (CLOUD && !Cloud.on()) { welcomeSheet(t('cl.needGroup')); return; }
  showSheet({ title: t('gr.createTitle'), body: `<form id="group-form" class="sheet-form">
    <input id="group-name" class="field" maxlength="30" placeholder="${esc(t('gr.ph'))}" aria-label="${esc(t('gr.name'))}" required>
    <button class="primary block" type="submit">${t('gr.create')}</button>
    ${data.church || !featureOn('leader') ? '' : `<button type="button" class="subtle-link" data-action="church-create">${t('chu.make')}</button>`}</form>` });
  $('#group-form').addEventListener('submit', e => {
    e.preventDefault(); const name = $('#group-name').value.trim(); if (!name) return;
    const g = { id: 'g' + Date.now(), name, invite: newCode(), owner: true, key: Vault.newGroupKey(), ...(CLOUD ? { cloud: true } : {}) }; data.groups.push(g); if (CLOUD) sync(); if (data.church) data.church.groups.push(g.id); save(); close(); renderGroups();
    document.dispatchEvent(new CustomEvent('dt:group-created', { detail: g })); // server add-on registers the invite code
    toast(t('toast.grCreated'));
    // invite people right away — but only if they're still on the 공동체 tab and nothing else is open
    setTimeout(() => { if (state.tab === 'group' && !state.immersive && $('#sheet').hidden) leaderStart(g.id); }, 350);
  });
}

function createChallenge() {
  state.sheetWith = state.sheetWith || 'pair';
  const planOnly = BIBLE_MODE; if (planOnly) state.chType = 'bible';
  showSheet({ title: planOnly ? t('pl.new') : t('ch.createTitle'), body: `<form id="challenge-form" class="sheet-form">
    <input id="challenge-name" class="field" value="${esc(planOnly ? t('chn.bible') : t('ch.defaultName'))}" maxlength="50" aria-label="${esc(t('ch.name'))}" required>
    <p class="field-label" ${planOnly ? 'hidden' : ''}>${t('ch.type')}</p>
    <div class="chips ch-types" ${planOnly ? 'hidden' : ''}>${[['thanks', t('ch.t.thanks')], ['prayer', t('f.prayer')], ['meditation', t('kind.meditation')], ['bible', t('ch.t.bible')]].map(([k, l]) => `<button type="button" class="chip ${(state.chType || 'thanks') === k ? 'active' : ''}" data-action="pick-chtype" data-id="${k}">${l}</button>`).join('')}</div>
    <div id="ch-opts">${chOpts()}</div>
    ${state.chFromGroup ? '' : `<p class="field-label">${t('ch.with')}</p>`}
    <div class="chips" ${state.chFromGroup ? 'hidden' : ''}>${[['pair', t('ch.pairShort')], ...data.groups.map(g => [g.id, L(g.name)])].map(([id, label]) => `<button type="button" class="chip ${state.sheetWith === id ? 'active' : ''}" data-action="pick-with" data-id="${esc(id)}">${esc(label)}</button>`).join('')}</div>
    <p class="hint">${t('ch.rest')}</p>
    <button class="primary block" type="submit">${t('ch.start')}</button></form>` });
  $('#challenge-form').addEventListener('submit', e => {
    e.preventDefault(); const name = $('#challenge-name').value.trim(); if (!name) return;
    const type = state.chType || 'thanks', plan = type === 'bible' ? chBiblePlan() : null;
    if (state.chAllGroups && data.church) {
      churchGroups().forEach((g, i) => data.challenges.unshift({ id: 'ch' + Date.now() + i, name, type, length: plan ? plan.days : chDays(), group: g.id, members: [{ ko: '나', en: 'Me', es: 'Yo' }], start: today(), days: [], ...(plan ? { plan: { from: plan.from, to: plan.to, total: plan.total } } : {}) }));
      state.chAllGroups = false; state.chFromGroup = false; save(); close(); render(); toast(t('chu.allStarted')); return;
    }
    data.challenges.unshift({ id: 'ch' + Date.now(), name, type, length: plan ? plan.days : chDays(), group: state.sheetWith, members: [{ ko: '나', en: 'Me', es: 'Yo' }], start: today(), days: [],
      ...(plan ? { plan: { from: plan.from, to: plan.to, total: plan.total } } : {}) });
    save(); close(); state.tab = BIBLE_MODE ? 'read' : 'group'; state.chFromGroup = false; render(); toast(t('toast.chStarted'));
    if (BIBLE_MODE && type === 'bible') setTimeout(() => planInvite(data.challenges[0].id), 300); else askReminders(type === 'bible' ? 'plan' : 'challenge');
  });
}

/* 동행 length: a number of days, weeks or months. Bible reading: from → to, split over a time or by chapters a day. */
const CH_UNIT = { d: 1, w: 7, m: 30 }, CH_MAX = { d: 365, w: 52, m: 12 };
const chDays = () => (state.chN || 7) * CH_UNIT[state.chUnit || 'd'];
const chIndex = (b, c) => BOOKS.slice(0, b - 1).reduce((n, x) => n + x[4], 0) + c - 1;   // 0 … 1188
const chAt = i => { let b = 0; while (i >= BOOKS[b][4]) { i -= BOOKS[b][4]; b++; } return [b + 1, i + 1]; };
function chBiblePlan() {
  const from = state.chFrom || [1, 1], to = state.chTo || [1, 50];
  const total = Math.max(1, chIndex(...to) - chIndex(...from) + 1);
  if ((state.chPace || 'period') === 'perday') { const per = state.chPer || 3; return { from, to, total, per, days: Math.ceil(total / per) }; }
  const days = Math.min(chDays(), total); return { from, to, total, per: +(total / days).toFixed(1), days };
}
// Chapters for day k (0-based) of a Bible plan: spread evenly, so no day is more than one chapter heavier.
function chPlanDay(ch, k) {
  const p = ch.plan; if (!p) return null;
  const cu = ch.catchUp;   // after "spread it out": the rest is split evenly over the days that were left
  if (cu && k >= cu.k0) { const j = k - cu.k0, s0 = cu.next + Math.floor(j * cu.rem / cu.days), e0 = cu.next + Math.floor((j + 1) * cu.rem / cu.days) - 1;
    return { start: chAt(Math.min(s0, chIndex(...p.to))), end: chAt(Math.min(Math.max(s0, e0), chIndex(...p.to))) }; }
  const a = chIndex(...p.from), days = chLen(ch), s0 = a + Math.floor(k * p.total / days), e0 = a + Math.floor((k + 1) * p.total / days) - 1;
  return { start: chAt(s0), end: chAt(Math.max(s0, e0)) };
}
// Behind on a reading plan? How many days, and what spreading the rest over the days left would look like.
function planBehind(c) {
  if (!c?.plan || chDone(c)) return null;
  const base = c.catchUp ? c.catchUp.at : c.start, k0 = c.catchUp ? c.catchUp.k0 : 0;
  const doneBefore = c.days.length - k0 - (c.lastDay === today() ? 1 : 0), expected = Math.max(0, dayDiff(base, today()));
  const behind = expected - doneBefore; if (behind < 1) return null;
  const daysLeft = Math.max(1, chLen(c) - dayDiff(c.start, today())), next = chIndex(...chPlanDay(c, c.days.length).start), rem = chIndex(...c.plan.to) - next + 1;
  if (rem < 1) return null;
  return { behind, daysLeft, rem, next, per: Math.max(1, Math.round(rem / daysLeft * 10) / 10) };
}
function catchUp(id) {
  const c = data.challenges.find(x => x.id === id), b = planBehind(c); if (!b) return;
  c.catchUp = { at: today(), k0: c.days.length, next: b.next, rem: b.rem, days: b.daysLeft };
  // the plan's length becomes "what's done + the days left", so the end date doesn't move
  c.length = c.days.length + b.daysLeft; c.start = (() => { const d = new Date(today() + 'T00:00:00'); d.setDate(d.getDate() - c.days.length); return d.toLocaleDateString('en-CA'); })();
  save(); toast(t('cu.done').replace('{r}', chPlanText(chPlanDay(c, c.days.length))));
}
const catchUpCard = c => { const b = planBehind(c); if (!b) return '';
  return `<article class="post card-page cu-card" data-cu="${esc(c.id)}"><div class="card-inner">
    <div class="post-kind">${icon('book')}<span>${esc(L(c.name) || chName(c))} · ${t('cu.kick')}</span></div>
    <p class="card-title">${esc(t('cu.title').replace('{n}', b.behind))}</p>
    <p class="card-sub">${esc(t('cu.sub').replace('{d}', b.daysLeft).replace('{per}', b.per))}</p>
    <div class="card-actions"><button class="primary" data-action="cu-yes" data-id="${esc(c.id)}">${t('cu.yes')}</button><button class="secondary" data-action="cu-no" data-id="${esc(c.id)}">${t('cu.no')}</button></div></div></article>`; };
const chPlanText = d => { if (!d) return ''; const [b1, c1] = d.start, [b2, c2] = d.end;
  return b1 === b2 ? (c1 === c2 ? refText({ b: b1, c: c1 }) : `${bookName(b1)} ${c1}–${c2}${lang() === 'ko' ? '장' : ''}`) : `${refText({ b: b1, c: c1 })} – ${refText({ b: b2, c: c2 })}`; };
function chOpts() {
  const type = state.chType || 'thanks', unit = state.chUnit || 'd', n = state.chN || 7;
  const stepper = (id, val, label) => `<div class="ch-step"><button type="button" class="round-btn" data-action="ch-step" data-id="${id}|-1" aria-label="−">−</button><span class="ch-n">${label.replace('{n}', val)}</span><button type="button" class="round-btn" data-action="ch-step" data-id="${id}|1" aria-label="+">＋</button></div>`;
  const period = `<div class="seg ch-unit">${['d', 'w', 'm'].map(u => `<button type="button" class="${unit === u ? 'active' : ''}" data-action="ch-unit" data-id="${u}">${t('ch.u.' + u)}</button>`).join('')}</div>
    ${stepper('n', n, lang() === 'ko' ? `{n}${t('ch.u.' + unit)}` : `{n} ${t('ch.u.' + unit).toLowerCase()}`)}${unit !== 'd' ? `<p class="hint ch-sum">${t('ch.total').replace('{n}', chDays())}</p>` : ''}`;
  if (type !== 'bible') return `<p class="field-label">${t('ch.len')}</p>${period}`;
  const from = state.chFrom || [1, 1], to = state.chTo || [1, 50], plan = chBiblePlan(), pace = state.chPace || 'period';
  return `<div class="ch-range"><button type="button" class="ch-ref" data-action="ch-pick" data-id="from"><small>${t('ch.from')}</small><span>${esc(refText({ b: from[0], c: from[1] }))}</span></button>
      <span class="ch-arrow">→</span><button type="button" class="ch-ref" data-action="ch-pick" data-id="to"><small>${t('ch.to')}</small><span>${esc(refText({ b: to[0], c: to[1] }))}</span></button></div>
    <p class="field-label">${t('ch.pace')}</p>
    <div class="seg">${[['period', t('ch.byPeriod')], ['perday', t('ch.byChapters')]].map(([k, l]) => `<button type="button" class="${pace === k ? 'active' : ''}" data-action="ch-pace" data-id="${k}">${l}</button>`).join('')}</div>
    ${pace === 'period' ? period : stepper('per', state.chPer || 3, t('ch.perDay'))}
    <p class="ch-plan">${(pace === 'period' ? t('ch.sumBible') : t('ch.sumBible2')).replace('{total}', plan.total).replace('{days}', plan.days).replace('{per}', plan.per)}</p>`;
}
const redrawCh = () => { const el = $('#ch-opts'); if (el) el.innerHTML = chOpts(); };
const chName = ch => t('chn.' + (['prayer', 'meditation', 'bible'].includes(ch.type) ? ch.type : 'thanks'));
const chEndDate = ch => { const d = new Date((ch.start || today()) + 'T00:00:00'); d.setDate(d.getDate() + chLen(ch) - 1); return d.toLocaleDateString('en-CA'); };
const chLeft = ch => Math.round((new Date(chEndDate(ch) + 'T00:00:00') - new Date(today() + 'T00:00:00')) / 864e5);
const chDone = ch => ch.days.length >= chLen(ch) || chLeft(ch) < 0;
const chDday = ch => chDone(ch) ? t('chr.done') : chLeft(ch) === 0 ? 'D-DAY' : `D-${chLeft(ch)}`;
// Group result for a challenge: everyone's posts of that kind during it (only good news — who showed up most).
function chStats(ch) {
  const end = chEndDate(ch) < today() ? chEndDate(ch) : today(), kind = ch.type || 'thanks';
  const posts = ch.group && ch.group !== 'pair' ? data.posts.filter(p => inGroup(p, ch.group) && p.date >= ch.start && p.date <= end && (kind === 'bible' || kindGroup(p) === kind)) : [];
  const per = new Map();
  posts.forEach(p => { const k = p.mine ? '__me' : authorKey(p); if (!per.has(k)) per.set(k, { name: p.mine ? t('me') : L(p.name), days: new Set() }); per.get(k).days.add(p.date); });
  const meDays = Math.max(ch.days.length, per.get('__me')?.days.size || 0);
  if (per.has('__me')) per.get('__me').days = new Set([...Array(meDays).keys()]);
  const top = [...per.values()].map(x => ({ name: x.name, n: x.days.size })).filter(x => x.n > 0).sort((a, b) => b.n - a.n).slice(0, 3);
  return { total: posts.length, people: per.size, mine: meDays, top };
}
// "가장 꾸준한 사람": the group's admin only; 순장 too when the admin turns it on (off by default)
const seesTop = ch => { if (!ch?.group || ch.group === 'pair') return true; const g = data.groups.find(x => x.id === ch.group); return !!g && (g.owner || (g.role === 'leader' && !!g.topToLeaders)); };
const chTopHtml = ch => { const st = chStats(ch); return seesTop(ch) && st.top.length > 1 ? `<div class="ch-top"><p class="gd-label">${icon('sparkle')}${t('chr.top')}</p>${st.top.map((x, i) => `<span class="ch-top-row"><i>${i + 1}</i>${esc(x.name)}<small>${t('chr.days').replace('{n}', x.n)}</small></span>`).join('')}</div>` : ''; };
const chTypeLabel = ch => ch.type === 'meditation' ? t('kind.meditation') : ch.type === 'prayer' ? t('kind.prayer') : ch.type === 'bible' ? t('ch.t.bible') : t('ch.t.thanks');
const chLen = ch => ch.length || 7;
function challengeDetail(id) {
  const ch = data.challenges.find(c => c.id === id); if (!ch) return;
  showSheet({ title: esc(L(ch.name)), body: `<p class="hint">${esc(groupName(ch.group))} · ${esc(ch.members.map(L).join(', '))}</p>${dayRow(ch)}
    <p class="quote center">${ch.type === 'meditation' ? t('ch.q.meditation') : ch.type === 'prayer' ? t('ch.q.prayer') : t('ch.question')}</p>
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

function widget() { return widgetGuide(true); }
function widgetOld() {
  const ch = data.challenges[0];
  showSheet({ title: t('w.title'), body: `<div class="widget-surface">
    <div class="widget-card"><h3>${icon('sun')}${t('w.today')}</h3><div class="question">${t('w.q')}</div><button class="primary block" data-action="compose">${t('w.write')}</button></div>
    ${ch ? `<div class="widget-card"><h3>${icon('people')}${esc(groupName(ch.group))}</h3>${dayRow(ch)}</div>` : ''}
    </div><p class="hint">${t('w.desc')}</p>` });
}

// daily bible: settings for reading and sermon notes only (no feed, verse frequency, blocking or widgets here)
function bibleSettings() {
  const row = (action, ic, title, end = icon('chevron'), cls = '') => `<button class="list-row ${cls}" data-action="${action}"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${title}</span></span><span class="row-end">${end}</span></button>`;
  const q = noteQuota(), almost = q.limit && q.used / q.limit >= 0.8;
  const places = (data.sermonPlaces || []).length;
  showSheet({ title: t('s.title'), body: `
    ${seg(LANGS, 'set-lang', lang())}
    <p class="field-label">${t('bs.size')}</p>
    ${seg([['s', t('size.s')], ['m', t('size.m')], ['l', t('size.l')], ['xl', t('size.xl')]], 'set-size', data.settings.textSize || 'm', 'seg-size four')}
    <p class="field-label">${t('bs.reading')}</p>
    <div class="list">
      ${row(data.settings.notificationEnabled ? 'notification' : 'notify-prime', 'bell', t('bs.remind'), `<span class="row-sub">${data.settings.notificationEnabled ? esc(data.settings.notificationTime) : t('bs.off')}</span>${icon('chevron')}`)}
      ${window.Capacitor?.isNativePlatform?.() ? '' : row('bible-offline', 'book', t('off.title'))}
    </div>
    <p class="field-label">${t('bs.sermon')}</p>
    <div class="list">
      ${row('bs-places', 'people', t('bs.places'), `${places ? `<span class="row-sub">${places}</span>` : ''}${icon('chevron')}`)}
      ${row('usage', 'sparkle', t('bs.sub'), `${almost ? `<span class="row-sub">${t('bs.almost')}</span>` : ''}${icon('chevron')}`)}
    </div>
    <p class="field-label">${t('bs.data')}</p>
    <div class="list">
      ${CLOUD ? (Cloud.on() ? row('logout', 'user', `${t('s.account')} · ${esc(Cloud.email())}`, `<span class="row-link">${t('acct.logout')}</span>`) : row('wl-open', 'user', t('s.account'), `<span class="row-sub">${t('cl.signIn')}</span>${icon('chevron')}`)) : session
        ? row('logout', 'user', `${t('s.account')} · ${esc(methodName(session.method))}${session.phone ? ' ' + esc(session.phone) : ''}`, `<span class="row-link">${t('acct.logout')}</span>`)
        : `<div class="list-row static"><span class="row-icon">${icon('user')}</span><span class="row-main"><span class="row-title">${t('s.account')}</span></span><span class="row-end row-sub">${t('s.guest')}</span></div>`}
      ${row('tour', 'history', t('tour.again'))}
      ${row('vault', 'lock', t('vault.title'))}
      ${row('export', 'copy', t('s.export'), '')}
      <a class="list-row" href="${LEGAL_BASE}/app/" target="_blank" rel="noopener"><span class="row-icon">${icon('sun')}</span><span class="row-main"><span class="row-title">${t('bs.thanks')}</span></span><span class="row-end">${icon('chevron')}</span></a>
      ${row('reset', 'reset', t('s.reset'), '', 'danger')}
    </div>
    <p class="field-label">${t('s.legal')}</p>
    <div class="list">
      <a class="list-row" href="${LEGAL_BASE}/privacy" target="_blank" rel="noopener"><span class="row-icon">${icon('lock')}</span><span class="row-main"><span class="row-title">${t('s.privacy')}</span></span><span class="row-end">${icon('chevron')}</span></a>
      <a class="list-row" href="${LEGAL_BASE}/terms" target="_blank" rel="noopener"><span class="row-icon">${icon('book')}</span><span class="row-main"><span class="row-title">${t('s.terms')}</span></span><span class="row-end">${icon('chevron')}</span></a>
      <div class="list-row static"><span class="row-icon">${icon('chat')}</span><span class="row-main"><span class="row-title">${t('s.support')}</span><span class="row-sub selectable">${SUPPORT_EMAIL}</span></span><button class="secondary" data-action="copy-support">${t('share.copy')}</button></div>
      ${session ? row('delete-account', 'trash', t('s.delete'), '', 'danger') : ''}
      <div class="list-row static"><span class="row-icon">${icon('info')}</span><span class="row-main"><span class="row-title">${t('s.version')}</span></span><span class="row-end row-sub">${APP_VERSION}</span></div>
    </div>` });
}
// Saved church + pastor pairs, with the day and hour each is usually used.
function placesSheet() {
  const L = data.sermonPlaces || [];
  const when = x => { const top = Object.entries(x.slots || {}).sort((a, b) => b[1] - a[1])[0]; if (!top) return '';
    const [d, h] = top[0].split('-').map(Number), day = new Date(2026, 10, 15 + d).toLocaleDateString(lang(), { weekday: 'long' });
    const hr = new Date(2026, 0, 1, h).toLocaleTimeString(lang(), { hour: 'numeric' }); return t('bs.usually').replace('{when}', `${day} ${hr}`); };
  showSheet({ title: t('bs.places'), body: L.length ? `<p class="hint">${t('bs.placesHint')}</p><div class="list">${L.map((x, i) => `<div class="list-row static"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${esc(placeLabel(x))}</span>${when(x) ? `<span class="row-sub">${esc(when(x))}</span>` : ''}</span><button class="round-btn" data-action="bs-place-del" data-id="${i}" aria-label="${esc(t('j.delete'))}">${icon('trash')}</button></div>`).join('')}</div>`
    : `<p class="hint">${t('bs.placesNone')}</p>` });
}
function settings() {
  if (BIBLE_MODE) return bibleSettings();
  const row = (action, ic, title, end = icon('chevron'), cls = '') => `<button class="list-row ${cls}" data-action="${action}"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${title}</span></span><span class="row-end">${end}</span></button>`;
  showSheet({ title: t('s.title'), body: `
    ${seg(LANGS, 'set-lang', lang())}
    <p class="field-label">${t('size.title')}</p>
    ${seg([['s', t('size.s')], ['m', t('size.m')], ['l', t('size.l')], ['xl', t('size.xl')]], 'set-size', data.settings.textSize || 'm', 'seg-size four')}
    <p class="field-label">${t('verse.title')}</p>
    ${seg([['often', t('verse.often')], ['normal', t('verse.normal')], ['rare', t('verse.rare')], ['off', t('verse.off')]], 'set-verse', data.settings.verseEvery || 'normal', 'four')}
    <div class="list">
      ${session
        ? row('logout', 'user', `${t('s.account')} · ${esc(methodName(session.method))}${session.phone ? ' ' + esc(session.phone) : ''}`, `<span class="row-link">${t('acct.logout')}</span>`)
        : `<div class="list-row static"><span class="row-icon">${icon('user')}</span><span class="row-main"><span class="row-title">${t('s.account')}</span></span><span class="row-end row-sub">${t('s.guest')}</span></div>`}
      ${row(data.settings.notificationEnabled ? 'notification' : 'notify-prime', 'bell', t('s.notify'), `<span class="row-sub">${esc(data.settings.notificationTime)}</span>${icon('chevron')}`)}
      ${row('view-settings', 'eye', t('vw.row'))}
      ${row('blocked', 'eyeOff', t('s.blocked'))}
      ${row('widget', 'phone', t('s.widget'))}
      ${row('vault', 'lock', t('vault.title'))}
      ${window.Capacitor?.isNativePlatform?.() ? '' : row('bible-offline', 'book', t('off.title'))}
      ${row('fullscreen', 'maximize', t('fs.enter'))}
      ${row('export', 'copy', t('s.export'), '')}
      ${row('intro-again', 'history', t('s.intro'))}
      ${row('reset', 'reset', t('s.reset'), '', 'danger')}
    </div>
    <p class="field-label">${t('s.legal')}</p>
    <div class="list">
      <a class="list-row" href="${LEGAL_BASE}/privacy" target="_blank" rel="noopener"><span class="row-icon">${icon('lock')}</span><span class="row-main"><span class="row-title">${t('s.privacy')}</span></span><span class="row-end">${icon('chevron')}</span></a>
      <a class="list-row" href="${LEGAL_BASE}/terms" target="_blank" rel="noopener"><span class="row-icon">${icon('book')}</span><span class="row-main"><span class="row-title">${t('s.terms')}</span></span><span class="row-end">${icon('chevron')}</span></a>
      <div class="list-row static"><span class="row-icon">${icon('chat')}</span><span class="row-main"><span class="row-title">${t('s.support')}</span><span class="row-sub selectable">${SUPPORT_EMAIL}</span></span><button class="secondary" data-action="copy-support">${t('share.copy')}</button></div>
      ${session ? row('delete-account', 'trash', t('s.delete'), '', 'danger') : ''}
      <div class="list-row static"><span class="row-icon">${icon('info')}</span><span class="row-main"><span class="row-title">${t('s.version')}</span></span><span class="row-end row-sub">${APP_VERSION}</span></div>
    </div>
    <p class="field-label">${t('ft.title')}</p>
    <div class="list">${[['groupShare', 'people'], ['prayer', 'pray'], ['sermon', 'mic'], ['leader', 'star']].filter(([k]) => featureAvailable(k)).map(([k, ic]) => `<label class="list-row"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${t('ft.' + k)}</span><span class="row-sub">${t('ft.' + k + 'Sub')}</span></span><input class="switch" type="checkbox" data-feature="${k}" ${featureOn(k) ? 'checked' : ''}></label>`).join('')}</div>
    <p class="hint">${t('ft.hint')}</p>
    <p class="about">${icon('info')}<span>${t('s.about')}</span></p>` });
}

/* ---------------- language filter ----------------
   Posts shared with others (group / everyone) are checked for strong or abusive language before posting.
   Private notes are never filtered. The server repeats this check (fullstack/server/moderation.js) —
   the client check is only for instant feedback. Wrongly flagged posts can be sent to a moderator. */
const BLOCKED_TERMS = [
  // Korean (matched after removing spaces, digits and symbols, so "씨 1발" is caught too)
  '씨발', '시발', '씨팔', '쌍놈', '썅', 'ㅅㅂ', 'ㅆㅂ', 'ㅂㅅ', '병신', '븅신', '개새끼', '개색끼', '개쉐이', '좆', '존나', '졸라', 'ㅈㄴ', '지랄', 'ㅈㄹ',
  '미친놈', '미친년', '미친새끼', '닥쳐', '꺼져', '엿먹어', '개같은', '염병', '니미', '느금마', '니애미', '애미뒤', '죽어버려', '뒤져라', '창녀', '걸레년',
  // English
  'fuck', 'fck', 'fuk', 'shit', 'bitch', 'asshole', 'bastard', 'cunt', 'dick', 'motherfucker', 'slut', 'whore', 'retard', 'nigger', 'nigga', 'faggot', 'killyourself', 'kys'
];
const LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '@': 'a', '$': 's', '!': 'i', '*': '' };
// Korean: keep only Hangul (so "씨 1발", "씨.발" match). English: undo leetspeak, keep only a-z.
const flatKo = s => String(s).replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
const flatEn = s => String(s).toLowerCase().replace(/[013457@$!*]/g, c => LEET[c]).replace(/[^a-z]/g, '');
const isKo = term => /[가-힣ㄱ-ㅎ]/.test(term);
const SHORT_EN = new Set(['dick', 'kys', 'fck', 'fuk']); // only as whole words, to avoid "dickens", "skys"…
// Ordinary words that happen to contain a blocked term ("시발점" = starting point, "Scunthorpe").
const ALLOWED_WORDS = ['시발점', '시발역', '시발택시', '기시발', 'scunthorpe', 'cocktail', 'shittake', 'dickens', 'hancock'];
function flaggedTerms(raw) {
  let text = String(raw).toLowerCase();
  for (const w of ALLOWED_WORDS) text = text.split(w).join(' ');
  const ko = flatKo(text), en = flatEn(text), words = String(text).toLowerCase().split(/[^a-z0-9@$!*]+/).map(flatEn);
  return BLOCKED_TERMS.filter(term => isKo(term) ? ko.includes(term) : SHORT_EN.has(term) ? words.includes(term) : en.includes(term));
}
const mask = w => w.length <= 1 ? '*' : w[0] + '*'.repeat(Math.min(w.length - 1, 3));

// Returns true when the post may go out now; otherwise shows the filter sheet and calls `onDecision`.
/* No contact details, self-promotion or money requests in anything others can see (Everyone or a group).
   Writing them only for yourself is fine. */
function contactFlags(text) {
  const s = String(text || ''), found = [];
  if (/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(s)) found.push('email');
  if ((s.match(/\+?\d[\d\s().-]{7,}\d/g) || []).some(m => m.replace(/\D/g, '').length >= 9)) found.push('phone');
  if (/(https?:\/\/|www\.)\S+|\b[\w-]{2,}\.(com|net|org|kr|co|io|me|ly|app|link|shop|store)\b/i.test(s.replace(/[\w.+-]+@[\w-]+\.[\w.]+/g, ''))) found.push('link');
  if (/(^|\s)@[\w.]{3,}|팔로우|맞팔|선팔|언팔|인스타\s*(아이디|id)|카톡\s*(아이디|id)|오픈\s*(채팅|톡)|텔레그램|디엠\s*(주|줘)|dm\s*(주세요|me)|follow\s*(me|back)|f4f|kakao\s*id|line\s*id|snapchat|whatsapp\s*me|sígueme|seguidores/i.test(s)) found.push('social');
  if (/계좌|송금|입금|후원\s*(해|부탁|좀|계좌)|돈\s*(좀|빌려|보내|부쳐)|카카오페이|토스로|venmo|cash\s*app|paypal|zelle|gofundme|send\s+(me\s+)?money|bank\s+account|donate\s+to\s+me|cuenta\s+bancaria|transferencia|env[ií]a(me)?\s+dinero/i.test(s)) found.push('money');
  return found;
}
function passesFilter(text, scope, onDecision) {
  if (scope === 'private') return true;
  const contact = contactFlags(text);
  if (contact.length) {
    showSheet({ title: t('ct.title'), body: `<p class="hint" style="margin:0">${t('ct.body')}</p>
      <div class="flagged"><span>${contact.map(k => t('ct.' + k)).join(' · ')}</span></div>
      <div class="sheet-form">
        <button class="primary block" id="mod-edit">${t('mod.edit')}</button>
        <button class="secondary block" id="mod-private">${icon('lock')}${t('mod.private')}</button>
      </div>` });
    $('#mod-edit').addEventListener('click', () => onDecision('edit', contact));
    $('#mod-private').addEventListener('click', () => onDecision('private', contact));
    return false;
  }
  const terms = flaggedTerms(text);
  if (!terms.length) return true;
  showSheet({ title: t('mod.title'), body: `<p class="hint" style="margin:0">${t('mod.body')}</p>
    <div class="flagged"><span class="row-sub">${t('mod.found')}</span><span>${terms.map(mask).map(esc).join(', ')}</span></div>
    <div class="sheet-form">
      <button class="primary block" id="mod-edit">${t('mod.edit')}</button>
      <button class="secondary block" id="mod-private">${icon('lock')}${t('mod.private')}</button>
      <button class="subtle-link" id="mod-appeal">${t('mod.appeal')}</button>
      <p class="hint center" style="margin:0">${t('mod.appealNote')}</p>
    </div>` });
  $('#mod-edit').addEventListener('click', () => onDecision('edit', terms));
  $('#mod-private').addEventListener('click', () => onDecision('private', terms));
  $('#mod-appeal').addEventListener('click', () => onDecision('appeal', terms));
  return false;
}
function requestReview(post, terms) {
  post.status = 'review';
  post.review = { terms, requestedAt: new Date().toISOString() };
  document.dispatchEvent(new CustomEvent('dt:review', { detail: { postId: post.id, text: L(post.text), scope: post.scope, terms } }));
}

/* ---------------- influence (영향력) & streak ----------------
   Score = likes ×1 + saves ×2 + shares ×3 on posts others can see. Levels are gentle milestones, not a leaderboard. */
const likesOf = p => (p.likes || 0) + (data.liked.includes(p.id) ? 1 : 0);
const savesOf = p => (p.saves || 0) + (data.saved.includes(p.id) ? 1 : 0);
const sharesOf = p => p.shares || 0;
const extOf = p => p.extShares || 0;
// Shares to KakaoTalk / Instagram reach people outside the app, so they weigh most (5 vs 3 for in-app shares).
const scoreOf = p => likesOf(p) + 2 * savesOf(p) + 3 * (sharesOf(p) - extOf(p)) + 5 * extOf(p);
// Light theme: the more your thanks travels, the brighter it glows.
const LEVELS = [['candle', 0, 'candle'], ['lantern', 10, 'lantern'], ['sunlight', 50, 'sun'], ['starlight', 150, 'star']];
function influence() {
  const mine = data.posts.filter(p => p.mine && p.scope !== 'private' && !p.status);
  const sum = f => mine.reduce((a, p) => a + f(p), 0);
  const received = { likes: sum(p => p.likes || 0), saves: sum(p => p.saves || 0), shares: sum(sharesOf), ext: sum(extOf) };
  const score = received.likes + 2 * received.saves + 3 * (received.shares - received.ext) + 5 * received.ext;
  const given = { likes: data.liked.length, saves: data.saved.length, shares: data.sharesGiven, ext: data.extSharesGiven };
  let li = 0; LEVELS.forEach((l, i) => { if (score >= l[1]) li = i; });
  const next = LEVELS[li + 1];
  const people = received.likes + received.saves + received.shares; // people who responded to my thanks
  return { received, given, score, people, level: LEVELS[li], next, progress: next ? (score - LEVELS[li][1]) / (next[1] - LEVELS[li][1]) : 1 };
}
// Top public posts this week by score; the top 3 get a quiet "reached many" mark in the feed.
const weekAgo = () => daysAgo(7);
function topPosts(n = 5) {
  return data.posts.filter(p => p.scope === 'public' && visible(p) && p.date >= weekAgo()).sort((a, b) => scoreOf(b) - scoreOf(a)).slice(0, n);
}
const isTop = p => topPosts(3).includes(p);
// Consecutive days (ending today) with at least one note of mine.
function streak() {
  const days = new Set(data.posts.filter(p => p.mine).map(p => p.date));
  let n = 0; while (days.has(daysAgo(n))) n++;
  return n;
}
// For showing: a streak stays alive through today even before today's note is written.
const liveStreak = () => { const days = new Set(data.posts.filter(p => p.mine).map(p => p.date)); let i = days.has(today()) ? 0 : 1, n = 0; while (days.has(daysAgo(i))) { n++; i++; } return n; };
function weekDots() {
  return Array.from({ length: 7 }, (_, i) => { const d = daysAgo(6 - i); return data.posts.some(p => p.mine && p.date === d); });
}
/* ---------------- keep-writing helpers ---------------- */
const DAILY_Q = {
  ko: ['오늘 나를 웃게 한 사람은 누구였나요?', '사소하지만 당연하지 않았던 일은?', '오늘 먹은 것 중 감사한 음식은?', '오늘 들은 말 중 고마웠던 말은?', '내 몸에게 고마운 점 하나는?', '오늘 본 것 중 아름다웠던 것은?', '요즘 기도가 응답된 일이 있나요?',
       '오늘 누군가에게 도움을 받았나요?', '집에서 감사한 것 하나는?', '오늘 새로 배운 것은?', '힘들었지만 그 안에서 발견한 감사는?', '지금 이 순간 감사한 것은?', '내일이 기대되는 이유 하나는?', '오래 곁에 있어 준 사람은 누구인가요?'],
  es: ['¿Quién te hizo sonreír hoy?', '¿Qué cosa pequeña no fue obvia hoy?', '¿Por qué comida estás agradecido hoy?', '¿Qué palabras amables escuchaste hoy?', '¿Qué hizo tu cuerpo por ti hoy?', '¿Qué cosa hermosa viste hoy?', '¿Se respondió alguna oración últimamente?',
       '¿Alguien te ayudó hoy?', '¿Qué cosa de tu casa agradeces?', '¿Qué aprendiste hoy?', '¿Qué gratitud encontraste en algo difícil?', '¿Por qué estás agradecido ahora mismo?', '¿Qué razón tienes para esperar el mañana?', '¿Quién ha estado a tu lado por mucho tiempo?'],
  en: ['Who made you smile today?', 'What small thing wasn’t a given today?', 'What food are you grateful for today?', 'What kind words did you hear today?', 'What is one thing your body did for you?', 'What beautiful thing did you see today?', 'Has a prayer been answered lately?',
       'Did someone help you today?', 'What is one thing at home you’re thankful for?', 'What did you learn today?', 'What gratitude did you find in something hard?', 'What are you thankful for right now?', 'What is one reason to look forward to tomorrow?', 'Who has stayed by your side for a long time?']
};
const dayOfYear = () => { const d = new Date(), s0 = new Date(d.getFullYear(), 0, 0); return Math.floor((d - s0) / 864e5); };
const dailyQ = () => { const remote = CONTENT.dailyQuestions?.[lang()]; const list = Array.isArray(remote) && remote.length ? remote : (DAILY_Q[lang()] || DAILY_Q.en); return list[dayOfYear() % list.length]; };
const dailyQLine = () => `<p class="daily-q">${icon('sparkle')}<span>${t('dq.label')} · ${esc(dailyQ())}</span></p>`;

// A past note resurfaces: exactly a week / month / year ago if there is one, otherwise the oldest of the last weeks.
function memory() {
  const mine = data.posts.filter(p => p.mine && p.kind !== 'thanks');
  for (const [n, key] of [[365, 'mem.year'], [30, 'mem.month'], [7, 'mem.week']]) {
    const p = mine.find(x => x.date === daysAgo(n)); if (p) return { p, label: t(key) };
  }
  const older = mine.filter(x => x.date <= daysAgo(3)).sort((a, b) => a.date < b.date ? -1 : 1);
  if (!older.length) return null;
  const p = older[dayOfYear() % older.length];
  const n = Math.round((new Date(today()) - new Date(p.date)) / 864e5);
  return { p, label: t('mem.ago').replace('{n}', n) };
}
function memoryCard() {
  const m = memory(); if (!m) return '';
  return `<button class="mem-card" data-action="note" data-id="${esc(m.p.id)}"><span class="mem-head">${icon('history')}<span>${t('mem.label')} · ${esc(m.label)}</span></span><span class="mem-text">${esc(L(m.p.text))}</span></button>`;
}

// This month as a small garden of days.
function calendarCard() {
  const now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
  const iso = d => new Date(y, m, d).toLocaleDateString('en-CA');
  const written = new Set(data.posts.filter(p => p.mine).map(p => p.date));
  let count = 0;
  const cells = Array.from({ length: first }, () => '<i class="cal-pad"></i>').concat(Array.from({ length: days }, (_, i) => {
    const d = i + 1, on = written.has(iso(d)); if (on) count++;
    return `<button class="cal-day ${on ? 'on' : ''} ${iso(d) === today() ? 'today' : ''}" data-action="cal-day" data-id="${iso(d)}" aria-label="${iso(d)}">${d}</button>`;
  }));
  const title = lang() === 'ko' ? t('cal.title').replace('{m}', m + 1).replace('{n}', count) : t('cal.title').replace('{mon}', now.toLocaleDateString(lang(), { month: 'long' })).replace('{n}', count);
  return `<section class="cal-card"><div class="cal-head"><span>${icon('calendar')}${title}</span><button class="row-link" data-action="recap">${t('cal.recap')} ›</button></div>
    <div class="cal-grid">${cells.join('')}</div></section>`;
}
function dayNotes(date) {
  const notes = data.posts.filter(p => p.mine && p.date === date);
  showSheet({ title: date, body: notes.length ? `<div class="notes">${notes.map(p => `<button class="note" data-action="note" data-id="${esc(p.id)}"><span class="note-meta">${icon(kindIcon(p))}<span>${esc(kindLabel(p))}</span></span><span class="note-text">${esc(L(p.text))}</span></button>`).join('')}</div>` : `<p class="hint">${t('cal.dayEmpty')}</p>` });
}
function weekNotes() { const from = daysAgo(6); return data.posts.filter(p => p.mine && p.date >= from).sort((a, b) => a.date < b.date ? -1 : 1); }
function recap() {
  const notes = weekNotes(), days = weekDots().filter(Boolean).length;
  showSheet({ title: t('rc.title'), body: `<p class="rc-count">${t('rc.count').replace('{n}', days)}</p>
    <div class="cel-dots rc-dots">${weekDots().map(on => `<span class="${on ? 'on' : ''}">${on ? icon('check') : ''}</span>`).join('')}</div>
    ${notes.length ? `<p class="field-label">${t('rc.notes').replace('{n}', notes.length)}</p><div class="notes">${notes.map(p => `<div class="note static"><span class="note-meta">${icon(kindIcon(p))}<span>${esc(p.date)}</span></span><span class="note-text">${esc(L(p.text))}</span></div>`).join('')}</div>
      <button class="secondary block" data-action="recap-share" style="margin-top:14px">${icon('upload')}${t('rc.share')}</button>` : `<p class="hint">${t('rc.empty')}</p>`}` });
}
const recapText = () => `${t('rc.shareHead')}\n\n${weekNotes().filter(p => p.scope !== 'private').map(p => '· ' + L(p.text)).join('\n') || '·'}\n\n— Daily Thanks`;

/* ---------------- optional features (Settings › Features) ---------------- */
// Prayer requests: others tap "I prayed"; the author sees who prayed (quietly, no ranking).
// Counts are private: in feeds a heart shows no number; only the author sees counts on their own posts.
// how many people a post of mine reached (liked, saved or shared it)
const reachOf = p => (p.likes || 0) + (data.liked.includes(p.id) ? 1 : 0) + (p.saves || 0) + sharesOf(p);
const countLabel = (p, n) => p.mine && !BIBLE_MODE ? `<span>${n}</span>` : ''; // daily bible: no like numbers at all
function prayBtn(p) {
  const on = data.prayed.includes(p.id), n = (p.prayedBy || []).length + (on ? 1 : 0);
  return `<button class="rail-btn ${on ? 'prayed' : ''}" data-action="pray" data-id="${esc(p.id)}" aria-pressed="${on}" aria-label="${t('pr.prayed')}">${icon('heart')}${countLabel(p, n)}</button>`;
}
function prayerSection() {
  const list = data.posts.filter(p => p.kind === 'prayer' && p.scope === 'group' && visible(p));
  return `<p class="section-label">${icon('pray')}${t('pr.section')}</p>
    ${list.length ? `<div class="list">${list.map(p => {
      const on = data.prayed.includes(p.id), n = (p.prayedBy || []).length + (on ? 1 : 0);
      return `<div class="list-row static prayer-row"><span class="row-main"><span class="row-title">${esc(L(p.text))}</span>
        <span class="row-sub">${esc(p.mine ? t('me') : L(p.name))} · ${esc(groupName(p.group))}${n && p.mine ? ' · <button class="link-inline" data-action="prayed-who" data-id="' + esc(p.id) + '">' + t('pr.count').replace('{n}', n) + '</button>' : ''}</span></span>
        <button class="pray-pill ${on ? 'on' : ''}" data-action="pray" data-id="${esc(p.id)}">${icon('pray')}${t('pr.prayed')}</button></div>`;
    }).join('')}</div>` : `<p class="hint">${t('pr.empty')}</p>`}`;
}
function togglePray(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  const i = data.prayed.indexOf(id);
  i >= 0 ? data.prayed.splice(i, 1) : data.prayed.push(id);
  save(); render(keepPlace());
  if (i < 0) toast(t('pr.prayedToast'));
}
function prayedWho(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  const names = (p.prayedBy || []).map(L).concat(data.prayed.includes(id) ? [t('me')] : []);
  showSheet({ title: t('pr.who'), body: `<p class="quote">${esc(L(p.text))}</p><div class="list">${names.map(n => `<div class="list-row static"><span class="row-icon">${icon('pray')}</span><span class="row-main"><span class="row-title">${esc(n)}</span></span></div>`).join('')}</div>` });
}

// Group sharing: one question per week, answered inside the group.
const GROUP_Q = {
  ko: ['이번 주 가장 감사했던 순간은 언제였나요?', '이번 주 하나님이 가까이 계심을 느낀 때는?', '요즘 마음을 지켜 준 말씀이 있나요?', '이번 주 누군가에게 받은 친절은?', '다음 주를 위해 미리 감사하고 싶은 것은?'],
  es: ['¿Cuándo estuviste más agradecido esta semana?', '¿Cuándo sentiste a Dios cerca esta semana?', '¿Qué versículo ha cuidado tu corazón últimamente?', '¿Qué bondad te mostró alguien esta semana?', '¿Por qué le darías gracias a Dios antes de la próxima semana?'],
  en: ['When were you most grateful this week?', 'When did you sense God near this week?', 'Which verse has kept your heart lately?', 'What kindness did someone show you this week?', 'What would you thank God for ahead of next week?']
};
const weekQ = () => { const list = GROUP_Q[lang()] || GROUP_Q.en; return list[Math.floor(dayOfYear() / 7) % list.length]; };
function groupShareSection() {
  const g = data.groups[0]; if (!g) return '';
  const answers = data.posts.filter(p => p.kind === 'share' && p.group === g.id && !data.hidden.includes(p.id));
  return `<p class="section-label">${icon('people')}${t('gs.section')} · ${esc(L(g.name))}</p>
    <section class="share-q"><p class="share-q-text">${esc(weekQ())}</p>
      <div class="btn-row"><button class="primary" data-action="gs-write" data-id="${esc(g.id)}">${t('gs.write')}</button><button class="secondary" data-action="gs-view" data-id="${esc(g.id)}">${t('gs.view')} · ${answers.length}</button></div></section>`;
}
function gsWrite(gid) {
  showSheet({ title: t('gs.write'), body: `<form id="gs-form" class="sheet-form"><p class="quote">${esc(weekQ())}</p>
    <textarea id="gs-text" data-draft="gs:${esc(gid)}" class="big-input" rows="4" maxlength="1000" placeholder="${esc(t('gs.ph'))}"></textarea>
    <button class="primary block" type="submit">${t('compose.submit')}</button></form>` });
  $('#gs-form').addEventListener('submit', e => {
    e.preventDefault(); const text = $('#gs-text').value.trim(); if (!text) return;
    if (flaggedTerms(text).length) { toast(t('mod.title')); return; }
    data.posts.unshift({ id: 'gs' + Date.now(), mine: true, scope: 'group', group: gid, kind: 'share', text, date: today(), likes: 0 });
    save(); close(); render(); toast(t('gs.saved'));
  });
}
function gsView(gid) {
  const answers = data.posts.filter(p => p.kind === 'share' && p.group === gid && !data.hidden.includes(p.id));
  showSheet({ title: t('gs.section'), body: `<p class="quote">${esc(weekQ())}</p>${answers.length ? `<div class="notes">${answers.map(p => `<div class="note static"><span class="note-meta">${icon('user')}<span>${esc(p.mine ? t('me') : L(p.name))}</span><span class="dot">·</span><span>${esc(p.date)}</span></span><span class="note-text">${esc(L(p.text))}</span></div>`).join('')}</div>` : `<p class="hint">${t('gs.empty')}</p>`}
    <button class="primary block" data-action="gs-write" data-id="${esc(gid)}" style="margin-top:14px">${t('gs.write')}</button>` });
}

// AI sermon notes: the prototype shows a sample; the full-stack server does speech-to-text + Claude summary.
const SAMPLE_SERMON = {
  ko: { title: '다시 태어난다는 것', passages: ['요한복음 3:1~15'], main: '거듭남은 내 노력이 아니라 성령의 일하심이며, 십자가를 바라봄으로 시작되어 빛 가운데로 나아오게 합니다.',
    points: [['성령의 일하심', '바람이 임의로 불듯, 거듭남은 우리의 노력이 아니라 성령께서 하시는 일입니다.'], ['십자가를 바라봄', '모세가 든 놋뱀처럼, 들리신 예수님을 믿음으로 바라볼 때 새 생명이 시작됩니다.'], ['빛 가운데로', '밤에 왔던 니고데모가 나중에는 공개적으로 나아왔듯, 믿음은 일상에서 드러납니다.']],
    apply: ['이번 주 신앙을 숨기지 않고 한 가지 말과 행동으로 드러내기', '매일 아침 십자가를 묵상하며 하루 시작하기'], prayer: ['일상의 빛 가운데서 살아가게 하소서'], questions: ['나에게 "밤에 찾아가는 신앙"은 어떤 모습인가요?', '이번 주 빛 가운데로 나아갈 한 걸음은?'] },
  en: { title: 'What it means to be born again', passages: ['John 3:1–15'], main: 'New birth is the Spirit’s work, not our effort; it begins by looking to the cross and leads us into the light.',
    points: [['The Spirit’s work', 'Like the wind, new birth is something the Spirit does, not something we achieve.'], ['Looking to the cross', 'As Moses lifted the serpent, new life begins when we look in faith to Jesus lifted up.'], ['Into the light', 'Nicodemus came by night, but later stepped out openly — faith shows in daily life.']],
    apply: ['Show your faith this week in one word or action', 'Start each morning by reflecting on the cross'], prayer: ['Help me live in the light every day'], questions: ['What does “coming by night” look like for me?', 'What is one step into the light this week?'] }
};
function sermonSection() {
  return `<p class="section-label">${icon('mic')}${t('sm.section')}</p>
    ${data.sermons.length ? `<div class="list">${data.sermons.map(n => `<button class="list-row" data-action="sm-open" data-id="${esc(n.id)}"><span class="row-icon">${icon('book')}</span><span class="row-main"><span class="row-title">${esc(n.title)}</span><span class="row-sub">${esc(n.date)}${n.preacher ? ' · ' + esc(n.preacher) : ''}</span></span><span class="row-end">${icon('chevron')}</span></button>`).join('')}</div>` : `<p class="hint">${t('sm.empty')}</p>`}
    <button class="secondary block" data-action="sm-new" style="margin-top:10px">${icon('plus')}${t('sm.new')}</button>`;
}
function smNew() {
  showSheet({ title: t('sm.new'), body: `<form id="sm-form" class="sheet-form">
    <input id="sm-title" class="field" maxlength="80" placeholder="${esc(t('sm.title'))}">
    <input id="sm-preacher" class="field" maxlength="40" placeholder="${esc(t('sm.preacher'))}">
    <label class="secondary block file-btn">${icon('mic')}${t('sm.record')}<input id="sm-audio" type="file" accept="audio/*" hidden></label>
    <textarea id="sm-text" data-draft="sm" class="big-input" rows="3" placeholder="${esc(t('sm.paste'))}"></textarea>
    <button class="primary block" type="submit">${t('sm.make')}</button>
    <p class="hint">${t('sm.demo')}</p></form>` });
  $('#sm-form').addEventListener('submit', e => {
    e.preventDefault();
    const sample = SAMPLE_SERMON[lang()] || SAMPLE_SERMON.en;
    const note = { id: 'sm' + Date.now(), date: today(), title: $('#sm-title').value.trim() || sample.title, preacher: $('#sm-preacher').value.trim(), summary: sample };
    data.sermons.unshift(note); save(); render(); smOpen(note.id);
  });
}
function smOpen(id) {
  const n = data.sermons.find(x => x.id === id); if (!n) return;
  const m = n.summary, list = items => `<ul class="sm-list">${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>`;
  showSheet({ title: esc(n.title), body: `<p class="row-sub">${t('sm.passages')} · ${esc(m.passages.join(', '))}</p>
    <div class="sm-main"><span class="row-sub">${t('sm.main')}</span><p>${esc(m.main)}</p></div>
    <p class="field-label">${t('sm.points')}</p>${m.points.map(([h, d], i) => `<p class="sm-point"><strong>${i + 1}. ${esc(h)}</strong><br>${esc(d)}</p>`).join('')}
    <p class="field-label">${t('sm.apply')}</p>${list(m.apply)}
    <p class="field-label">${t('sm.prayer')}</p>${list(m.prayer)}
    <p class="field-label">${t('sm.questions')}</p>${list(m.questions)}` });
}

/* ---------------- notification priming ----------------
   iOS / the browser show their own fixed permission popup. Right before it, this screen explains why reminders help
   and lets people pick a time; only "Turn on reminders" triggers the system popup (Notification.requestPermission
   on the web; UNUserNotificationCenter.requestAuthorization in the native iOS app). */
const NOTIFY_TIMES = [['morning', '07:00', 'sunrise'], ['noon', '12:30', 'sun'], ['evening', '21:00', 'moon']];
// offered right after setting up a reading plan or a challenge (once each), if reminders aren't on yet
function askReminders(context) {
  if (data.settings.notificationEnabled || (data.settings.notifyAskedFor || {})[context]) return;
  // never on top of something the person is doing: if a sheet is open by then, ask another time
  setTimeout(() => { if (!sheet.hidden || document.body.classList.contains('reading')) return;
    data.settings.notifyAskedFor = { ...(data.settings.notifyAskedFor || {}), [context]: today() }; save(); notifyPrime(context); }, 600);
}
function notifyPrime(context) {
  data.settings.notifyAsked = data.settings.notifyAsked || today(); save(); // asked once, even if closed with ✕
  if (!data.settings.widgetAsked) state.pendingWidget = true;              // the widget guide follows when this closes
  state.primeTimes = state.primeTimes || new Set([context === 'plan' ? 'morning' : 'evening']); state.primeTime = [...state.primeTimes][0];
  const tile = ([id, time, ic]) => `<button type="button" class="time-tile ${state.primeTimes.has(id) ? 'active' : ''}" data-action="prime-time" data-id="${id}">${icon(ic)}<strong>${t('np.' + id)}</strong><span>${time.replace(/^0/, '')}</span><small>${t('np.' + id + 'Sub')}</small></button>`;
  showSheet({ title: '', body: `<div class="prime">
    <div class="cel-mark">${icon('bell')}</div>
    <p class="prime-title">${context === 'plan' ? t('np.planTitle') : context === 'challenge' ? t('np.chTitle') : t('np.title')}</p>${!context && t('np.sub') ? `<p class="prime-sub">${t('np.sub')}</p>` : ''}
    <ul class="prime-reasons"><li>${icon('sun')}${context ? t('np.cr1') : t('np.r1')}</li><li>${icon('check')}${context === 'plan' ? t('np.pr2') : context ? t('np.cr2') : t('np.r2')}</li><li>${icon('people')}${t('np.r3')}</li></ul>
    <p class="field-label">${t('np.when')} <small class="hint">${t('np.multi')}</small></p>
    <div class="time-tiles">${NOTIFY_TIMES.map(tile).join('')}</div>
    <label class="prime-other">${t('np.other')}<input id="prime-custom" class="time-input" type="time" value="${esc(data.settings.notificationTime)}"></label>
    <button class="primary block" data-action="prime-allow">${icon('bell')}${t('np.allow')}</button>
    <button class="subtle-link" data-action="prime-later">${t('np.later')}</button></div>` });
  $('#prime-custom').addEventListener('change', () => { state.primeCustom = true; });
}
async function primeAllow() {
  const times = [...NOTIFY_TIMES.filter(x => state.primeTimes?.has(x[0])).map(x => x[1]), ...(state.primeCustom && $('#prime-custom')?.value ? [$('#prime-custom').value] : [])];
  const list = [...new Set(times.length ? times : [$('#prime-custom')?.value || '21:00'])].sort(), time = list[0];
  Object.assign(data.settings, { notificationEnabled: true, notificationTime: time, notificationTimes: list, notifyAsked: today() });
  save(); close();
  let granted = false;
  try {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      granted = res === 'granted';
      if (granted) new Notification('Daily Thanks', { body: t('np.test') });
    }
  } catch { /* some embedded viewers block the permission request; the preference is still saved */ }
  toast((granted || !('Notification' in window) ? t('np.on') : t('np.blocked')).replace('{time}', list.join(' · ')));
}
// Reminders are offered once, only after someone has written and signed in (habit order: read → write → sign in → remind → widget).
function maybePrime() {
  if (!session || data.settings.notifyAsked || data.settings.notificationEnabled) return false;
  setTimeout(notifyPrime, 350); return true;
}
function maybeWidget() {
  if (!session || data.settings.widgetAsked) return false;
  setTimeout(widgetGuide, 350); return true;
}
// The home-screen widget: today's verse about thanks (the same one on the phone widget), small and medium.
function todayVerse() {
  const pool = VERSES.filter(v => v.thanks);
  const v = pool[(dayOfYear() - 1) % pool.length]; // same day → same verse as the phone widgets
  return { ref: L(v.ref), text: L(v.text), tr: VERSE_TR[lang()] || VERSE_TR.en };
}
function widgetPreview() {
  const v = todayVerse();
  return `<div class="hw-stage vw-stage">
    <div class="vw vw-medium"><div class="vw-top"><div><span class="vw-label">${t('wg.label')}</span><span class="vw-ref">${esc(v.ref)}</span></div><span class="hw-light" aria-hidden="true"></span></div>
      <p class="vw-text">${esc(v.text)}</p>
      <div class="vw-foot"><span class="vw-badge">${esc(v.tr)}</span><span class="vw-mark">daily <em>thanks</em></span></div></div>
    <div class="vw-pair">
      <div class="vw vw-small"><span class="vw-label">${t('wg.label')}</span><p class="vw-text">${esc(v.text)}</p><span class="vw-ref">${esc(v.ref)}</span></div>
      ${thanksWidget()}
    </div>
    ${medWidget()}
  </div>`;
}
// 오늘의 감사: today's own thanks (or the question), the streak, and a write button.
function thanksWidget() {
  const mine = data.posts.filter(x => x.mine && x.date === today() && kindGroup(x) === 'thanks').slice(-1)[0], sk = liveStreak();
  return `<div class="vw vw-small vw-thanks"><span class="vw-top2"><span class="vw-label">${t('wg.thanksLabel')}</span>${sk ? `<span class="vw-streak">${t('wg.streak').replace('{n}', sk)}</span>` : ''}</span>
    <p class="vw-text${mine ? '' : ' q'}">${esc(mine ? L(mine.text) : dailyQ())}</p>
    <span class="vw-pill">${icon(mine ? 'check' : 'plus')}${mine ? t('wg.done') : t('wg.write2')}</span></div>`;
}
// 오늘의 묵상: today's passage (생명의 삶 when available) and a reflect button.
function medWidget() {
  const p = todaysPassage(data.groups[0]?.id), done = data.posts.some(x => x.mine && x.date === today() && x.kind === 'meditation');
  return `<div class="vw vw-medium vw-med"><div class="vw-top"><div><span class="vw-label">${t('wg.medLabel')}${p?.source ? ' · ' + esc(p.source) : ''}</span><span class="vw-ref">${esc(p?.ref ? refText(p.ref) : '')}</span></div><span class="hw-light" aria-hidden="true"></span></div>
    <p class="vw-text" id="vw-med-text">${esc(state.medPreview || '')}</p>
    <div class="vw-foot"><span class="vw-pill">${icon(done ? 'check' : 'pencil')}${done ? t('wg.medDone') : t('wg.medWrite')}</span><span class="vw-mark">daily <em>thanks</em></span></div></div>`;
}
// What the phone widgets show (the native shell hands this to the home-screen widgets).
async function widgetData() {
  const p = todaysPassage(data.groups[0]?.id); let ptext = '';
  try { if (p?.ref) { const vs = await fetchChapter(p.ref.b, p.ref.c); ptext = (vs.find(x => x.v === (p.ref.v || 1)) || vs[0])?.text || ''; } } catch {}
  const mine = data.posts.filter(x => x.mine && x.date === today() && kindGroup(x) === 'thanks').slice(-1)[0], v = todayVerse(), sk = liveStreak();
  return { date: today(), lang: lang(), streak: sk, streakText: sk ? t('wg.streak').replace('{n}', sk) : '', thanks: mine ? L(mine.text) : '', question: dailyQ(),
    passage: p?.ref ? refText(p.ref) : '', passageSource: p?.source || '', passageText: ptext, meditated: data.posts.some(x => x.mine && x.date === today() && x.kind === 'meditation'),
    verseRef: v.ref, verseText: v.text, verseTr: v.tr,
    labels: { verse: t('wg.label'), thanks: t('wg.thanksLabel'), med: t('wg.medLabel'), write: t('wg.write2'), done: t('wg.done'), medWrite: t('wg.medWrite'), medDone: t('wg.medDone') } };
}
function widgetGuide(fromSettings = false) {
  data.settings.widgetAsked = data.settings.widgetAsked || today(); save();
  const android = /Android/i.test(navigator.userAgent);
  state.wgOs = state.wgOs || (android ? 'android' : 'ios');
  const steps = os => `<ol class="wg-steps">${t(os === 'ios' ? 'wg.iosSteps' : 'wg.androidSteps').split('|').map(x => `<li>${esc(x)}</li>`).join('')}</ol>`;
  showSheet({ title: '', body: `<div class="wg">
    <p class="prime-title">${t('wg.title')}</p><p class="hint center">${t('wg.sub')}</p>
    ${widgetPreview()}
    <div class="seg">${[['ios', t('wg.ios')], ['android', t('wg.android')]].map(([id, label]) => `<button type="button" class="${state.wgOs === id ? 'active' : ''}" data-action="wg-os" data-id="${id}"><span>${label}</span></button>`).join('')}</div>
    <div id="wg-steps">${steps(state.wgOs)}</div>
    ${fromSettings ? '' : `<button class="primary block" data-action="wg-ok">${t('wg.ok')}</button><button class="subtle-link" data-action="wg-later">${t('wg.later')}</button>`}
    <p class="fine-print center">${t('wg.note')}</p></div>` });
  state.wgSteps = steps;
  widgetData().then(d => { const el = $('#vw-med-text'); if (el && d.passageText) { state.medPreview = d.passageText; el.textContent = d.passageText; } });
}

// After saving a note: celebrate a full week, cheer at 3 and 5 days. Shown once per day reached.
function cheer(fallbackToast) {
  const n = streak(), key = today() + ':' + n;
  const total = data.posts.filter(p => p.mine).length, mkey = 'notes:' + total;
  // A celebration sheet comes first; the reminder screen (asked once) follows when it closes.
  if (n > 0 && n % 7 === 0 && !data.celebrated.includes(key)) {
    data.celebrated.push(key); save(); state.pendingPrime = true;
    return celebrate();
  }
  if ([10, 30, 50, 100].includes(total) && !data.celebrated.includes(mkey)) {
    data.celebrated.push(mkey); save(); state.pendingPrime = true;
    return milestone(total);
  }
  if ((n === 3 || n === 5) && !data.celebrated.includes(key)) { data.celebrated.push(key); save(); toast(t('cel.mid').replace('{n}', n)); }
  else if (fallbackToast) toast(fallbackToast);
  maybePrime();
}
function milestone(n) {
  showSheet({ title: '', body: `<div class="celebrate"><div class="cel-mark">${icon('star')}</div>
    <p class="cel-title">${t('ms.title').replace('{n}', n)}</p><p class="cel-body">${t('ms.body')}</p>
    <button class="primary block" data-action="close">${t('cel.ok')}</button></div>` });
}
function celebrate() {
  showSheet({ title: '', body: `<div class="celebrate">
    <div class="cel-mark">${icon('sparkle')}</div>
    <p class="cel-title">${t('cel.title')}</p>
    <div class="cel-dots">${weekDots().map(on => `<span class="${on ? 'on' : ''}">${on ? icon('check') : ''}</span>`).join('')}</div>
    <p class="cel-body">${t('cel.body')}</p>
    <button class="primary block" data-action="close">${t('cel.ok')}</button>
    <button class="subtle-link" data-action="cel-share">${t('cel.share')}</button></div>` });
}
// The only yellow in the app: a small light that grows larger and deeper as reach grows (log scale, full at ~300 pts).
function glow(score, scale = 1) {
  // starts as a tiny, faint point; spreads slowly (log scale, full glow around 1,000 pts)
  const g = Math.pow(Math.min(1, Math.log10(1 + Math.max(0, score)) / Math.log10(1001)), 1.3);
  return `<span class="glow" style="--g:${g.toFixed(3)};--s:${scale}" aria-hidden="true"></span>`;
}
// 나의 감사 top: just two quiet lines — how far your thanks reached, and this month. Details open on tap.
function journalSummary() {
  const f = influence(), now = new Date(), y = now.getFullYear(), m = now.getMonth();
  const days = new Set(data.posts.filter(p => p.mine && p.date && p.date.startsWith(`${y}-${String(m + 1).padStart(2, '0')}`)).map(p => p.date)).size;
  const month = lang() === 'ko' ? `${m + 1}월` : now.toLocaleDateString(lang(), { month: 'long' });
  const sk = liveStreak();
  return `<div class="j-sum">
    <button class="j-line j-streak" data-action="month-sheet"><span class="j-ic">${icon('sparkle')}</span><span>${sk ? t('st.line').replace('{n}', sk) : t('st.none')}</span><span class="mini-dots">${weekDots().map(on => `<i class="${on ? 'on' : ''}"></i>`).join('')}</span></button>
    <button class="j-line" data-action="influence"><span class="glow-wrap">${glow(f.score)}</span><span>${t('inf.people').replace('{n}', f.people)}</span><span class="j-go">›</span></button>
    <button class="j-line" data-action="month-sheet"><span class="j-ic">${icon('calendar')}</span><span>${t('j.month').replace('{m}', month).replace('{n}', days)}</span><span class="j-go">›</span></button>
    ${(() => { const n = (data.readDone || []).length, rs = readStats(), wk = rs.week, pct = n / TOTAL_CHAPTERS * 100;
      return `<button class="j-line j-bible" data-action="reader-pick"><span class="j-ic">${icon('book')}</span><span class="jb-main"><span>${n ? t('j.bible').replace('{n}', n).replace('{p}', pct > 0 && pct < 1 ? '<1' : Math.round(pct)) : t('j.bibleNone')}${rs.todayN || rs.todayMin ? ` <small>· ${t('rs.today').replace('{n}', rs.todayN)}${rs.todayMin ? ' ' + t('rs.min').replace('{n}', rs.todayMin) : ''}</small>` : wk ? ` <small>· ${t('j.bibleWeek').replace('{n}', wk)}</small>` : ''}</span>${n ? `<i class="jb-bar"><b style="width:${Math.max(1, pct).toFixed(1)}%"></b></i>` : ''}</span><span class="j-go">›</span></button>`; })()}
    <button class="j-line" data-action="collection"><span class="j-ic">${icon('camera')}</span><span>${t('col.line')}</span><span class="j-go">›</span></button>
  </div>`;
}
function monthSheet() { showSheet({ title: t('j.monthTitle'), body: `${calendarCard()}${memoryCard()}` }); }
function influenceCard() {
  const f = influence(), dots = weekDots();
  return `<button class="inf-card" data-action="influence">
    <span class="inf-top"><span class="glow-wrap">${glow(f.score)}</span><span class="inf-label"><span class="inf-people">${t('inf.people').replace('{n}', f.people)}</span><span class="row-sub">${t('inf.title')} · ${f.score}${t('inf.score')}</span></span><span class="row-end">${icon('chevron')}</span></span>
    <span class="inf-stats"><span>${icon('heart')}${f.received.likes}</span><span>${icon('bookmark')}${f.received.saves}</span><span>${icon('upload')}${f.received.shares}</span>
      <span class="inf-week">${t('inf.week')}<span class="mini-dots">${dots.map(on => `<i class="${on ? 'on' : ''}"></i>`).join('')}</span></span></span>
  </button>`;
}
function influenceSheet() {
  const f = influence();
  const stat = (ic, label, n) => `<div class="stat">${icon(ic)}<strong>${n}</strong><span>${label}</span></div>`;
  showSheet({ title: t('inf.title'), body: `
    <div class="inf-hero"><span class="glow-stage">${glow(f.score, 2)}</span><p class="inf-hero-score">${t('inf.peopleBig').replace('{n}', f.people)}</p><p class="row-sub">${t('inf.peopleSub')}</p><p class="row-sub">${f.score}${t('inf.score')} · ${t('inf.glow')}</p></div>
    <p class="field-label">${t('inf.received')}</p>
    <div class="stats">${stat('heart', t('inf.likes'), f.received.likes)}${stat('bookmark', t('inf.saves'), f.received.saves)}${stat('upload', t('inf.shares'), f.received.shares)}</div>
    ${f.received.ext ? `<p class="hint">${t('inf.ext').replace('{n}', f.received.ext)}</p>` : ''}
    <p class="field-label">${t('inf.given')}</p>
    <div class="stats">${stat('heart', t('inf.likes'), f.given.likes)}${stat('bookmark', t('inf.saves'), f.given.saves)}${stat('upload', t('inf.shares'), f.given.shares)}</div>
    ${f.given.ext ? `<p class="hint">${t('inf.ext').replace('{n}', f.given.ext)}</p>` : ''}
    <p class="field-label">${t('inf.top')}</p>
    <div class="list">${topPosts(5).map((p, i) => `<div class="list-row static rank-row"><span class="rank">${i + 1}</span><span class="row-main"><span class="row-title clamp">${esc(L(p.text))}</span><span class="row-sub">${esc(p.mine ? t('me') : L(p.name))}${p.mine ? ` · ♡ ${likesOf(p)} · ${t('inf.saves')} ${savesOf(p)} · ${t('inf.shares')} ${sharesOf(p)}` : ''}</span></span></div>`).join('')}</div>
    <p class="about">${icon('info')}<span>${t('inf.peopleNote')} ${t('inf.how')}</span></p>` });
}
function countShare(id, external = false) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  p.shares = (p.shares || 0) + 1; data.sharesGiven++;
  if (external) { p.extShares = (p.extShares || 0) + 1; data.extSharesGiven++; }
  save();
}

/* ---------------- thank-you card (감사 전하기) ---------------- */
function thanksForm(keep = {}) {
  return `<div class="ty-head">Thank you,</div>
    <input id="ty-name" class="ty-name" maxlength="30" placeholder="${esc(t('ty.to'))}" value="${esc(keep.name || '')}" aria-label="${esc(t('ty.to'))}">
    <textarea id="gratitude-text" data-draft="ty" class="big-input" maxlength="800" rows="4" placeholder="${esc(t('ty.ph'))}" aria-label="${esc(t('ty.ph'))}">${esc(keep.text || '')}</textarea>
    <button class="primary block" type="submit">${icon('send')}${t('ty.make')}</button>`;
}
function thanksText(p) { return `Thank you, ${p.to}\n\n${L(p.text)}\n\n— Daily Thanks`; }
function thanksCard(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  showSheet({ title: t('ty.card'), body: `<div class="ty-card"><span class="ty-card-head">Thank you, <em>${esc(p.to)}</em></span><p>${esc(L(p.text))}</p><span class="wordmark">daily <em>thanks</em></span></div>
    <button class="primary block" data-action="ty-send" data-id="${esc(id)}">${icon('send')}${t('ty.send')}</button>
    <div class="list" style="margin-top:8px">
      ${listRow('ty-copy', id, 'copy', t('ty.copy'))}
      ${listRow('send-group', id, 'people', t('ty.toGroup'), '', icon('chevron'))}
    </div>
    <p class="field-label">${t('pp.title')}</p>
    <div class="chips pp-chips">${(data.people || []).map((x, i) => `<button class="chip" data-action="pp-send" data-id="${esc(id)}|${i}">${icon('send')}${esc(x.name)}</button>`).join('')}<button class="chip" data-action="pp-add" data-id="${esc(id)}">${t('pp.add')}</button></div>
    <p class="hint">${t('pp.hint')}</p>` });
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
  setSession({ method, since: new Date().toISOString(), lang: lang(), termsAcceptedAt: new Date().toISOString(), termsVersion: '2026-12-01', ...extra });
  const hadCompose = !!$('#compose-card');
  close(); render(); toast(t('login.done'));
  const sc = $('#feed-scroll'); // land on the post that comes right after the cards
  if (sc && state.tab === 'feed' && state.feed === 'public') sc.scrollTop = (GATE_AFTER + (hadCompose ? 1 : 0)) * sc.clientHeight;
  if (wroteToday()) setTimeout(() => { if (!maybePrime()) maybeWidget(); }, 900); // habit order: write → sign in → reminders → widget
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
const methodName = m => m === 'email' ? (session?.email || 'Email') : ({ apple: 'Apple', google: 'Google', phone: lang() === 'ko' ? '휴대폰' : 'Phone' })[m] || m;

/* ---------------- actions ---------------- */
function setLang(l) {
  data.settings.lang = l; save(); applyStatic();
  if (session) setSession({ ...session, lang: l }); // remembered with the account for the next sign-in
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
  home: () => { state.tab = BIBLE_MODE ? 'read' : 'feed'; state.feed = 'public'; state.noteOpen = null; render(); },
  'feed-public': () => { state.feed = 'public'; renderFeed(); },
  'feed-group': () => { state.feed = 'group'; renderFeed(); },
  challenges: () => { close(); state.tab = 'challenges'; render(); },
  next: () => { const sc = $('#feed-scroll'); sc?.scrollBy({ top: sc.clientHeight, behavior: 'smooth' }); },
  settings, notification: notifications, widget, close,
  'toggle-lang': () => setLang(lang() === 'ko' ? 'en' : 'ko'),
  'set-lang': id => setLang(id),
  like, share, 'send-group': sendToGroup, reflect,
  'pick-kind': id => { state.tyName = $('#ty-name')?.value || state.tyName; if (id !== 'meditation') { state.medRef = null; state.medSource = null; state.medNote = false; } compose(id, state.challenge, $('#gratitude-text')?.value || ''); },
  'mp-next': () => { const tr = $('.mp-track'); if (tr) tr.scrollBy({ left: tr.clientWidth, behavior: 'smooth' }); },
  'mp-prev': () => { const tr = $('.mp-track'); if (tr) tr.scrollBy({ left: -tr.clientWidth, behavior: 'smooth' }); },
  'mp-grow': dir => { const r = state.medRef; if (!r?.v) return; const ref = { ...r, v2: r.v2 || r.v };
    if (dir === 'prev') ref.v = Math.max(1, ref.v - 1); else ref.v2 = Math.min(state.medLast || ref.v2 + 1, ref.v2 + 1);
    state.medRef = ref; fillMedPassage(dir); },
  'verse-note': k => { const [b, c, v] = k.split(':').map(Number), sp = state.readSpan;
    let ref = { b, c, v, v2: v };
    if (sp && sp.b === b && (sp.c < c || (sp.c === c && sp.v < v))) ref = sp.c === c ? { b, c, v: sp.v, v2: v } : { b, c: sp.c, v: sp.v, v2: 0, c2: c, e2: v };
    closeReader(); state.medRef = ref; state.medSource = ''; state.medNote = true; compose('meditation', state.challenge); },
  'mp-load': () => { const r = parseRef($('#mp-ref')?.value); if (!r) { $('#mp-ref')?.focus(); toast(t('devo.bad')); return; } state.medRef = r; state.medSource = ''; fillMedPassage(); },
  'mp-change': () => { state.medNote = false; state.medRef = null; state.medSource = null; biblePicker({ mode: 'med' }); },
  'vis-mode': pair => { const [key, m] = pair.split('|'); visOf(key).mode = m; updateVis(key); },
  'vis-target': pair => {
    const [key, id] = pair.split('|'), v = visOf(key), cur = visTargets(v);
    v.targets = id === 'me' ? [] : cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]; // groups toggle; "Only me" clears them
    updateVis(key);
  },
  'pick-scope': id => {
    state.sheetScope = id;
    document.querySelectorAll('[data-action="pick-scope"]').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    $('#group-chips').hidden = id !== 'group'; $('#public-note').hidden = id !== 'public';
  },
  'pick-group': id => { state.sheetGroup = id; document.querySelectorAll('[data-action="pick-group"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  'pick-with': id => { state.sheetWith = id; document.querySelectorAll('[data-action="pick-with"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  note: noteSheet,
  'copy-support': () => copyText(SUPPORT_EMAIL),
  // Account deletion (App Store 5.1.1(v) / Google Play): removes the account and everything written by it.
  'delete-account': () => confirmSheet(t('s.delete'), t('del.body'), t('del.ok'), () => {
    document.dispatchEvent(new CustomEvent('dt:delete-account'));
    data.posts = data.posts.filter(p => !p.mine);
    Object.assign(data, { liked: [], saved: [], prayed: [], seen: [], sermons: [], reports: [], celebrated: [], sharesGiven: 0, extSharesGiven: 0 });
    data.settings.notifyAsked = null; data.settings.widgetAsked = null; data.settings.notificationEnabled = false;
    setSession(null); save(); state.immersive = true; state.order = null; render(); toast(t('del.done'));
  }),
  'lang-menu': () => showSheet({ title: '', body: `<div class="list">${LANGS.map(([id, label]) => `<button class="list-row" data-action="pick-lang" data-id="${id}"><span class="row-icon">${icon('globe')}</span><span class="row-main"><span class="row-title">${label}</span></span><span class="row-end">${lang() === id ? icon('check') : ''}</span></button>`).join('')}</div>` }),
  'pick-lang': id => { close(); setLang(id); },
  'wg-os': id => { state.wgOs = id; document.querySelectorAll('[data-action="wg-os"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); $('#wg-steps').innerHTML = state.wgSteps(id); },
  'wg-ok': () => { close(); toast(t('wg.okToast')); },
  'wg-later': () => { close(); toast(t('wg.laterToast')); },
  pray: togglePray,
  'prayed-who': prayedWho,
  'gs-write': gsWrite,
  'gs-view': gsView,
  'sm-new': smNew,
  'sm-open': smOpen,
  'notify-prime': () => { close(); setTimeout(notifyPrime, 50); },
  'prime-time': id => { const S2 = state.primeTimes = state.primeTimes || new Set(); S2.has(id) && S2.size > 1 ? S2.delete(id) : S2.add(id); state.primeTime = [...S2][0]; document.querySelectorAll('.time-tile').forEach(b => b.classList.toggle('active', S2.has(b.dataset.id))); },
  'prime-allow': primeAllow,
  'prime-later': () => { data.settings.notifyAsked = today(); save(); close(); toast(t('np.laterToast')); },
  'cal-day': dayNotes,
  recap,
  'recap-share': () => { const text = recapText(); if (navigator.share) navigator.share({ title: 'Daily Thanks', text }).catch(() => {}); else copyText(text); },
  'share-kakao': id => {
    // Native app: Kakao SDK "feed" template with the card image. Prototype: system share sheet (KakaoTalk is listed there).
    const p = data.posts.find(x => x.id === id); if (!p) return;
    const text = withLink(`${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks`, p);
    if (navigator.share) navigator.share({ title: 'Daily Thanks', text }).then(() => countShare(id, true)).catch(() => {});
    else { countShare(id, true); copyText(text); }
  },
  'card-kind': pair => { const [id, k] = pair.split('|'); state.cardKind = k; document.querySelectorAll('[data-action="card-kind"]').forEach(b => b.classList.toggle('active', b.dataset.id === pair)); showCardPreview(id); },
  'share-image': id => shareImage(id),
  'share-insta-img': id => shareImage(id, true),
  'share-insta': id => {
    // Native app: Instagram Stories sharing (instagram-stories:// with a rendered card image). Prototype: share sheet, or copy.
    const p = data.posts.find(x => x.id === id); if (!p) return;
    const text = withLink(`${L(p.text)}\n\n— Daily Thanks`, p);
    if (navigator.share) navigator.share({ title: 'Daily Thanks', text }).then(() => countShare(id, true)).catch(() => {});
    else { countShare(id, true); navigator.clipboard?.writeText(text).catch(() => {}); toast(t('share.copied')); }
  },
  influence: influenceSheet,
  'month-sheet': () => monthSheet(),
  collection: () => collectionSheet(),
  'col-type': k => collectionSheet(k),
  'col-kindf': k => { state.colKind = k; collectionSheet(state.colType, state.colId); },
  'col-pick': id => { state.colId = id; document.querySelectorAll('[data-action="col-pick"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); drawCollection(); },
  'col-kind': k => { state.cardKind = k; document.querySelectorAll('[data-action="col-kind"]').forEach(b => b.classList.toggle('active', b.dataset.id === k)); drawCollection(); },
  'col-share': () => shareCollection(),
  'col-reel': () => makeReel(),
  'reel-share': async () => { const f = state.reelFile; if (!f) return; try { if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f], title: periodTitle(state.colId) }); return; } } catch { return; } saveCollection([f]); },
  'reel-save': () => { if (state.reelFile) saveCollection([state.reelFile]); },
  'col-save': () => saveCollection(),
  'cel-share': () => { if (navigator.share) navigator.share({ title: 'Daily Thanks', text: t('cel.shareText') }).catch(() => {}); else copyText(t('cel.shareText')); },
  'ty-copy': id => { const p = data.posts.find(x => x.id === id); if (p) copyText(withLink(thanksText(p), p)); },
  'pp-add': id => { showSheet({ title: t('pp.add'), body: `<form id="pp-form" class="sheet-form"><input id="pp-name" class="field" maxlength="20" placeholder="${esc(t('pp.name'))}" required><input id="pp-phone" class="field" type="tel" inputmode="tel" maxlength="20" placeholder="${esc(t('pp.phone'))}" required><button class="primary block" type="submit">${t('pp.save')}</button></form>` });
    $('#pp-form').addEventListener('submit', e => { e.preventDefault(); const name = $('#pp-name').value.trim(), phone = $('#pp-phone').value.replace(/[^\d+]/g, '');
      if (!name || phone.length < 7) return; data.people = [...(data.people || []).filter(x => x.phone !== phone), { name, phone }].slice(-12); save(); thanksCard(id); }); },
  'pp-send': pair => { const [id, i] = pair.split('|'), x = (data.people || [])[+i], p = data.posts.find(q => q.id === id); if (!x || !p) return;
    const body = encodeURIComponent(withLink(thanksText(p), p)), ios = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    location.href = `sms:${x.phone}${ios ? '&' : '?'}body=${body}`; },
  'ty-send': id => {
    const p = data.posts.find(x => x.id === id); if (!p) return;
    if (navigator.share) navigator.share({ title: 'Thank you', text: withLink(thanksText(p), p) }).then(() => { close(); cheer(t('ty.saved')); }).catch(() => {});
    else { copyText(thanksText(p)); }
  },
  'set-verse': id => {
    data.settings.verseEvery = id; save();
    document.querySelectorAll('[data-action="set-verse"]').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    const note = $('.verse-freq-note'); if (note) note.textContent = t('verse.note.' + id);
    state.verseChanged = true; // the feed is rebuilt with the new spacing when the sheet closes
  },
  'verse-freq': () => verseFreqSheet(),
  'verse-share': ref => {
    const v = verseList().find(x => x.ref === ref); if (!v) return;
    const text = `${v.text}\n— ${v.ref}${v.tr ? ' (' + v.tr + ')' : ''}\n\nGive thanks daily. · daily thanks`;
    if (navigator.share) navigator.share({ title: 'daily thanks', text }).catch(() => {}); else copyText(text);
  },
  'set-size': id => { data.settings.textSize = id; save(); applyTextSize(); document.querySelectorAll('[data-action="set-size"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  'read-more': id => { const p = data.posts.find(x => x.id === id); if (p) showSheet({ title: esc(p.mine ? t('me') : L(p.name)), body: `<p class="full-text">${esc(L(p.text))}</p>` }); },
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
    if (flaggedTerms(L(p.text)).length) { toast(t('mod.title')); return; }
    countShare(id);
    data.posts.unshift({ ...clone(p), id: 'repost' + Date.now(), scope: 'group', group: g, mine: false, name: p.mine ? { ko: '나', en: 'Me', es: 'Yo' } : p.name, sharedFrom: { ko: '공유', en: 'shared' }, likes: 0 });
    save(); close(); state.immersive = false; state.tab = 'feed'; state.feed = 'group'; state.group = g; render(); toast(t('toast.sent'));
  },
  sample: id => { const ta = $('#gratitude-text'); ta.value = SAMPLES[lang()][id]; ta.focus(); },
  'journal-filter': id => { state.filter = id; renderJournal(); },
  'med-rec': () => state.medRecOn ? medRecStop() : medRecStart(),
  'med-rec-del': () => { medRecReset(); medRecPaint(); },
  delete: id => confirmSheet(t('j.delete'), t('j.confirmDelete'), t('j.delete'), () => { if (data.posts.find(p => p.id === id)?.voice) AudioStore.del(id); data.posts = data.posts.filter(p => p.id !== id); save(); render(); }),
  'copy-share': id => { const p = data.posts.find(x => x.id === id); if (p) { countShare(id); copyText(withLink(`${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks`, p)); } },
  'send-link': id => { // just the link: opens the thanks on dailyjourney.org
    const p = data.posts.find(x => x.id === id); if (!p) return;
    const url = postLink(p);
    if (navigator.share) navigator.share({ title: 'daily thanks', text: `${t('share.linkMsg')}\n${url}` }).then(() => countShare(id, true)).catch(() => {});
    else { countShare(id, true); copyText(url); }
  },
  'copy-link': id => { const p = data.posts.find(x => x.id === id); if (p) { countShare(id, true); copyText(postLink(p)); } },
  'native-share': id => {
    const p = data.posts.find(x => x.id === id);
    if (navigator.share && p) navigator.share({ title: 'Daily Thanks', text: withLink(`${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks`, p) }).then(() => countShare(id)).catch(() => {});
    else toast(t('toast.noShare'));
  },
  'new-group': createGroup,
  'invite-group': id => inviteSheet(id || state.group),
  'invite-share': id => { const msg = state.inviteMsg; if (navigator.share) navigator.share({ title: 'daily thanks', text: msg }).catch(() => {}); else copyText(msg); },
  'plan-new': () => { state.chType = 'bible'; state.sheetWith = 'pair'; createChallenge(); },
  'plan-invite': id => planInvite(id),
  'plan-invite-done': () => { close(); askReminders('plan'); },
  'plan-copy': id => { const ch = data.challenges.find(x => x.id === id); if (ch) copyText(planLink(ch)); },
  'plan-join': () => { const c = state.planJoin; close(); if (!c) { toast(t('pl.already')); return; } data.challenges.unshift(c); state.planJoin = null; save(); state.tab = BIBLE_MODE ? 'read' : 'group'; render(); toast(t('pl.joined')); askReminders('plan'); },
  'invite-copy': id => { const g = data.groups.find(x => x.id === id); if (g) copyText(inviteLink(g)); },
  vault: () => vaultSheet(),
  'bible-offline': () => showSheet({ title: t('off.title'), body: `<p class="hint">${t('off.body')}</p><p class="hint" id="off-p">${data.settings.bibleOffline ? t('off.done') : ''}</p><button class="primary block" data-action="bible-offline-go">${icon('download')}${t('off.go')}</button>` }),
  'bible-offline-go': () => saveBibleOffline(),
  'vault-copy': async () => copyText((await Vault.recoveryCode()) || ''),
  'cp-join': pair => { const [id, how] = pair.split('|'); const c = [...(CONTENT.campaigns || []), ...CAMPAIGNS_BUILTIN].find(x => x.id === id); if (!c || data.challenges.some(x => x.campaign === id)) return;
    const g = how === 'group' ? (state.group && data.groups.some(x => x.id === state.group) ? state.group : data.groups[0]?.id) : 'pair';
    data.challenges.unshift({ id: 'ch' + Date.now(), name: L(c.title), type: c.type, length: dayDiff(today(), c.end) + 1, group: g, campaign: id, members: [{ ko: '나', en: 'Me', es: 'Yo' }], start: today(), days: [] });
    save(); render(keepPlace()); toast(t('toast.chStarted')); },
  'ch-result': id => chResult(id),
  'church-create': () => churchCreate(),
  'church-open': () => { state.churchView = true; state.groupDetail = null; render(); },
  'church-back': () => { state.churchView = false; render(); },
  'church-shared': () => { data.church.sharedPassage = data.church.sharedPassage === false; save(); render(); },
  'church-leader': gid => { const g = data.groups.find(x => x.id === gid);
    showSheet({ title: t('chu.setLeader'), body: `<div class="list">${groupPeople(gid).map(([k, name]) => `<button class="list-row" data-action="church-leader-set" data-id="${esc(gid)}|${esc(name)}"><span class="row-main"><span class="row-title">${esc(name)}</span></span></button>`).join('') || `<p class="hint">${t('gd.empty')}</p>`}</div>` }); },
  'church-leader-set': pair => { const [gid, name] = pair.split('|'); data.church.leaders = { ...(data.church.leaders || {}), [gid]: name }; save(); close(); render();
    document.dispatchEvent(new CustomEvent('dt:church-leader', { detail: { group: gid, name } })); toast(t('chu.leaderSet').replace('{name}', name).replace('{g}', L(data.groups.find(x => x.id === gid)?.name))); },
  'church-move': gid => { showSheet({ title: t('chu.pickMember'), body: `<div class="list">${groupPeople(gid).map(([k, name]) => `<button class="list-row" data-action="church-move-who" data-id="${esc(gid)}|${esc(k)}|${esc(name)}"><span class="row-main"><span class="row-title">${esc(name)}</span></span>${icon('chevron')}</button>`).join('') || `<p class="hint">${t('gd.empty')}</p>`}</div>` }); },
  'church-move-who': trip => { const [from, k, name] = trip.split('|');
    showSheet({ title: t('chu.pickTarget'), body: `<div class="list">${churchGroups().filter(g => g.id !== from).map(g => `<button class="list-row" data-action="church-move-to" data-id="${esc(from)}|${esc(k)}|${esc(name)}|${esc(g.id)}"><span class="row-main"><span class="row-title">${esc(L(g.name))}</span></span></button>`).join('')}</div>` }); },
  'church-move-to': quad => { const [from, k, name, to] = quad.split('|'); const a = data.groups.find(x => x.id === from), b = data.groups.find(x => x.id === to); if (!a || !b) return;
    a.removed = [...new Set([...(a.removed || []), k])]; a.size = Math.max(1, groupSize(from) - 1);
    b.extra = [...(b.extra || []).filter(x => x.key !== k), { key: k, name }]; b.size = groupSize(to) + 1;
    save(); close(); render(); document.dispatchEvent(new CustomEvent('dt:church-move', { detail: { from, to, member: k } })); toast(t('chu.moved').replace('{name}', name).replace('{g}', L(b.name))); },
  'church-allch': () => { state.chAllGroups = true; state.chFromGroup = true; state.sheetWith = churchGroups()[0]?.id || 'pair'; createChallenge(); },
  quiz: pair => { const [i, k] = pair.split('|').map(Number), q = quizState(); if (q[i] !== undefined) return; q[i] = k; if (quizAnswered() >= QUIZ_N) q.doneOn = today(); save();
    const el = document.querySelector(`.quiz-card[data-quiz="${i}"]`); if (el) el.outerHTML = quizCard(i);
    document.querySelectorAll('.quiz-card .qz-score').forEach(x => x.textContent = t('qz.score').replace('{r}', quizScore()).replace('{n}', quizAnswered()));
    if (quizAnswered() >= QUIZ_N && !document.querySelector('.quiz-res')) { const last = document.querySelector(`.quiz-card[data-quiz="${QUIZ_N - 1}"]`); last?.insertAdjacentHTML('afterend', quizResultCard()); } },
  'chr-post': id => { const ch = data.challenges.find(c => c.id === id); if (!ch?.group || ch.group === 'pair') return; const st = chStats(ch);
    data.posts.unshift({ id: 'p' + Date.now(), mine: true, kind: 'today', scope: 'group', group: ch.group, groups: [ch.group], text: t('chr.postText').replace('{name}', chName(ch)).replace('{n}', st.people).replace('{c}', st.total), date: today(), likes: 0 });
    save(); close(); render(); toast(t('chr.posted')); },
  'chr-card': async id => { const ch = data.challenges.find(c => c.id === id); if (!ch) return; const cv = await chResultCard(ch);
    const f = new File([await new Promise(r => cv.toBlob(r, 'image/png'))], 'daily-thanks-challenge.png', { type: 'image/png' });
    try { if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f], title: chName(ch) }); return; } } catch { return; } saveCollection([f]); },
  'cp-recap': () => { state.colKind = 'all'; collectionSheet('y'); },
  'recap-week': () => { data.settings.recapSeen = periodOf(today(), 'w'); save(); state.colKind = 'thanks'; collectionSheet('w'); },
  'group-admin': gid => groupAdmin(gid),
  'bb-continue': () => openReader({}),
  'bb-today': () => { const p = todaysPassage(data.groups[0]?.id); if (p?.ref) openReader({ ...p.ref, group: data.groups[0]?.id || 'me' }); },
  'sermon-new': () => sermonNew(),
  'sn-mode': k => { state.snMode = k; const el = $('#sn-input'); if (el) el.innerHTML = snInput(); document.querySelectorAll('[data-action="sn-mode"]').forEach(b => b.classList.toggle('active', b.dataset.id === k));
    const fin = $('#sn-fin'); if (fin) fin.addEventListener('change', () => { const f = fin.files?.[0]; const nm = $('#sn-fname'); if (nm && f) nm.textContent = f.name; }); },
  'sn-rec': () => snRecord(),
  'note-open': id => { const n = sermonNotes().find(x => x.id === id), terms = snTerms(), hit = n && terms.length ? noteHit(n, terms) : null;
    state.noteOpen = id; state.noteTab = hit?.where === 'tr' ? 'tr' : 'sum'; render(); window.scrollTo?.(0, 0);
    if (hit?.where === 'tr') setTimeout(() => document.querySelector('.sn-trtext mark')?.scrollIntoView({ block: 'center' }), 60); },
  'sn-q-clear': () => { state.snQuery = ''; render(); },
  'note-tab': k => { state.noteTab = k; if (state.noteOpen) renderSermonNote(state.noteOpen); },
  'vc-yes': pair => { const [id, k] = pair.split('|'), n = (data.sermonNotes || []).find(x => x.id === id), c = n?.summary?.verse_checks?.[+k]; if (!c) return; c.confirmed = true; save(); renderSermonNote(id); },
  'vc-fix': pair => { const [id, k] = pair.split('|'), n = (data.sermonNotes || []).find(x => x.id === id), c = n?.summary?.verse_checks?.[+k]; if (!c) return;
    showSheet({ title: t('vc.fix'), body: `<form id="vc-form" class="sheet-form"><input id="vc-ref" class="field" value="${esc(c.reference)}" placeholder="${esc(t('vc.fixQ'))}" aria-label="${esc(t('vc.fixQ'))}"><button class="primary block" type="submit">${t('vc.yes')}</button></form>` });
    $('#vc-form').addEventListener('submit', e => { e.preventDefault(); const r = parseRef($('#vc-ref').value); if (!r) { toast(t('vc.bad')); return; }
      c.reference = refText(r); c.confirmed = true; c._auto = null; save(); close(); renderSermonNote(id); }); },
  'rec-need-ref': () => { toast(t('rec.needRef')); biblePicker({ mode: 'sermonref', start: null }); },
  'note-tomed': id => { const n = sermonNotes().find(x => x.id === id); if (!n?.summary) return; const r = parseRef(n.summary.passages?.[0] || '');
    state.medRef = r || null; state.medSource = ''; state.medNote = !!r; compose('meditation', null, `${n.title || n.summary.title || ''} — ${n.summary.main_message || ''}\n`); },
  'note-ai': id => aiSummarize(id),
  'mt-new': gid => meetingSheet(gid),
  'mt-ref': () => biblePicker({ mode: 'meetref', start: state.snRef || null }),
  'mt-live': () => { const g = data.groups.find(x => x.id === state.mtGid); if (!g || !state.snRef) return; g.meetingLive = { date: today(), ref: state.snRef }; save(); const b = $('#mt-live'); if (b) b.innerHTML = `${icon('people')}${t('mt.shared')}`; toast(t('mt.shared')); },
  'mt-join': gid => { const g = data.groups.find(x => x.id === gid), r = g?.meetingLive?.ref; if (!r) return; openReader({ b: r.b, c: r.c, v: r.v || 1, passage: r.v ? r : null, group: gid }); },
  'mt-open': id => meetingView(id),
  'rp-pick': gid => showSheet({ title: t('rp.pick'), body: `<div class="list">${memberList(gid).filter(([k]) => k !== 'me').map(([k]) => `<button class="list-row" data-action="rp-open" data-id="${esc(gid)}|${esc(k)}"><span class="row-main"><span class="row-title">${esc(nameOf(gid, k))}</span></span>${icon('chevron')}</button>`).join('') || `<p class="hint">${t('gd.empty')}</p>`}</div>` }),
  'rp-open': pair => { const [gid, k] = pair.split('|'); memberReport(gid, k); },
  'cat-set': gid => { const g = data.groups.find(x => x.id === gid); if (!g) return; const cats = [...new Set(data.groups.map(x => x.category).filter(Boolean))];
    showSheet({ title: esc(L(g.name)) + ' · ' + t('cat.set'), body: `<form id="cat-form" class="sheet-form"><input id="cat-in" class="field" list="cat-list" maxlength="30" value="${esc(g.category || '')}" placeholder="${esc(t('cat.ph'))}"><datalist id="cat-list">${cats.map(c => `<option value="${esc(c)}">`).join('')}</datalist><button class="primary block" type="submit">${t('nick.save')}</button></form>` });
    $('#cat-form').addEventListener('submit', e => { e.preventDefault(); g.category = $('#cat-in').value.trim(); save(); close(); render(); }); },
  'cat-rename': gid => { const g = data.groups.find(x => x.id === gid); if (!g) return;
    showSheet({ title: t('cat.rename'), body: `<form id="ren-form" class="sheet-form"><input id="ren-in" class="field" maxlength="30" value="${esc(L(g.name))}" placeholder="${esc(t('cat.namePh'))}" required><button class="primary block" type="submit">${t('nick.save')}</button></form>` });
    $('#ren-form').addEventListener('submit', e => { e.preventDefault(); const v = $('#ren-in').value.trim(); if (!v) return; g.name = v; save(); close(); render(); }); },
  'ps-link': () => pastorLinkSheet(),
  'ps-copy': () => copyText(state.inviteMsg),
  'ps-preview': () => { close(); state.pastorView = pastorSnapshot(); render(); },
  'ps-close': () => { state.pastorView = null; if (location.hash.startsWith('#pastor=')) { try { history.replaceState(null, '', location.pathname); } catch {} } render(); },
  usage: () => usageSheet(),
  'bible-plus': () => { const row = (action, ic, label, id = '') => `<button class="list-row" data-action="${action}"${id ? ` data-id="${id}"` : ''}><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${label}</span></span>${icon('chevron')}</button>`;
    showSheet({ title: t('bp.title2'), body: `<div class="list">${row('sermon-new', 'mic', t('bp.sermon'))}${row('bp-write', 'book', t('bp.med'), 'meditation')}${row('bp-write', 'sun', t('bp.thanks'), 'today')}${row('bp-write', 'pray', t('bp.prayer'), 'prayer')}${row('plan-new', 'calendar', t('bp.plan'))}</div>` }); },
  'bible-write': () => { const row = (ic, label, kind) => `<button class="list-row" data-action="bp-write" data-id="${kind}"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${label}</span></span>${icon('chevron')}</button>`;
    showSheet({ title: t('bp.title2'), body: `<div class="list">${row('sun', t('bp.thanks'), 'today')}${row('pray', t('bp.prayer'), 'prayer')}${row('book', t('bp.med'), 'meditation')}${row('heart', t('bp.thankSomeone'), 'thanks')}</div>` }); },
  'bp-write': kind => { close(); state.medRef = null; state.medSource = null; state.medNote = false; compose(kind, null); },
  'size-cycle': () => { const order = ['s', 'm', 'l', 'xl'], cur = data.settings.textSize || 'm'; data.settings.textSize = order[(order.indexOf(cur) + 1) % order.length]; save(); applyTextSize(); toast(`${t('size.btn')} · ${t('size.' + data.settings.textSize)}`); },
  'imm-streak': () => { if (anyUnseen() && !BIBLE_MODE) { state.immersive = false; state.tab = 'group'; render(); } else if (anyUnseen()) { state.prevFeed = 'public'; state.immFeed = 'prayer'; render(0); } else toast(t('stk.write').replace('{n}', BIBLE_MODE ? readDays() : writeStreak())); },
  'yr-share': () => yearShare(),
  'rt-history': () => readHistory(),
  'yr-kind': k => { state.yrKind = k; yearShare(); },
  'yr-post': async () => { const c = await yearCanvas(state.yrKind || 'feed'); const blob = await new Promise(r => c.toBlob(r, 'image/png')); const f = new File([blob], `daily-bible-${new Date().getFullYear()}.png`, { type: 'image/png' });
    try { if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f], title: 'daily bible' }); return; } } catch { return; } saveCollection([f]); },
  'yr-reel': () => yearReel(),
  'yr-reel-share': async () => { const f = state.reelFile; if (!f) return; try { if (navigator.canShare?.({ files: [f] })) { await navigator.share({ files: [f], title: 'daily bible' }); return; } } catch { return; } saveCollection([f]); },
  'us-refresh': async () => { state.snChecked = false; await sermonSync(); usageSheet(); },
  'off-sheet': () => offSheet(),
  'mc-quiet': gid => { const g = data.groups.find(x => x.id === gid); if (!g) return; g.muted = !g.muted; state.firstPrIds = null; save(); render(); toast(g.muted ? t('mc.quietDone') : t('mc.loudDone')); },
  'mc-leave': gid => leaveGroup(gid),
  'off-what': k => { state.offWhat = k; offSheet(); },
  'off-for': k => { state.offFor = k; offSheet(); },
  'off-ok': () => offApply(),
  'first-off': () => { setPref('firstOff', true); state.firstPrIds = []; toast(t('fo.offDone')); render(0); },
  'first-snooze': () => { setPref('firstUntil', new Date(Date.now() + 864e5).toISOString()); toast(t('fo.snoozed')); render(0); },
  'first-why': id => { const [k, v] = id.split('|'); const c = k === 'plan' ? data.challenges.find(x => x.id === v) : null;
    showSheet({ title: t('why.title'), body: `<p class="quote why-q">${esc(k === 'pr' ? t('why.pr').replace('{g}', v) : t('why.plan').replace('{name}', L(c?.name) || chName(c || {})).replace('{d}', (c?.days.length || 0) + 1).replace('{t}', c ? chLen(c) : 0))}</p>
      <div class="sheet-actions"><button class="secondary" data-action="view-settings">${icon('settings')}${t('why.settings')}</button><button class="secondary" data-action="first-snooze-close">${t('fo.h24')}</button></div>` }); },
  'first-snooze-close': () => { close(); setPref('firstUntil', new Date(Date.now() + 864e5).toISOString()); toast(t('fo.snoozed')); render(0); },
  'view-settings': () => viewSettings(),
  'vw-max': n => { setPref('firstMax', +n); viewSettings(); },
  'vw-pause': k => { const P = { ...(data.settings.prefs || {}) }; P.firstOff = k === 'off'; P.firstUntil = k === 'h24' ? new Date(Date.now() + 864e5).toISOString() : k === 'w1' ? new Date(Date.now() + 7 * 864e5).toISOString() : '';
    data.settings.prefs = P; save(); viewSettings(); },
  'emp-strangers': () => { setPref('strangers', true); render(0); },
  'cu-yes': id => { catchUp(id); if (BIBLE_MODE) { close(); render(); } else { state.firstPrIds = state.firstPrIds || []; render(0); } },
  'cu-no': id => { const c = data.challenges.find(x => x.id === id); if (c) { c.cuDismissed = today(); save(); } document.querySelector(`[data-cu="${id}"]`)?.remove(); close(); },
  'cu-ask': id => { const c = data.challenges.find(x => x.id === id), b = planBehind(c); if (!b) return;
    showSheet({ title: esc(L(c.name) || chName(c)), body: `<p class="card-title cu-t">${esc(t('cu.title').replace('{n}', b.behind))}</p><p class="hint">${esc(t('cu.sub').replace('{d}', b.daysLeft).replace('{per}', b.per))}</p>
      <div class="sheet-actions"><button class="primary" data-action="cu-yes" data-id="${esc(id)}">${t('cu.yes')}</button><button class="secondary" data-action="cu-no" data-id="${esc(id)}">${t('cu.no')}</button></div>` }); },
  'sm-read': () => { const r = state.sharedMed?.ref; if (!r) return; close(); openReader({ b: r.b, c: r.c, v: r.v || 1, passage: r.v ? r : null }); },
  'sm-write': () => { const r = state.sharedMed?.ref; close(); state.medRef = r || null; state.medSource = ''; state.medNote = !!r; compose('meditation', null); },
  'plan-read-done': id => { const c = data.challenges.find(x => x.id === id); if (!c) return;
    planChapters(c).forEach(([b, ch]) => { const k = readKey(b, ch); if (!data.readDone.includes(k)) data.readDone.push(k); data.readLog = data.readLog || {}; data.readLog[k] = today(); }); if (!data.rtStart) data.rtStart = today(); readThroughDone();
    const last = planChapters(c).slice(-1)[0]; if (last) data.reading = { b: last[0], c: last[1], v: 1, at: new Date().toISOString() };
    if (c.lastDay !== today()) { c.days.push(c.days.length + 1); c.lastDay = today(); }
    save(); const card = document.querySelector(`[data-fvend="${id}"] .card-actions`); if (card) card.innerHTML = `<span class="hint">${icon('check')} ${t('fv.marked')}</span>`;
    if (c.days.length >= chLen(c)) setTimeout(() => chFinish(c.id), 600); else celebrateDay(c); },
  'first-prayers': () => { data.settings.prayerSeen = [...new Set([...(data.settings.prayerSeen || []), ...newGroupPrayers().map(p => p.id)])].slice(-300); save();
    state.prevFeed = 'public'; state.immFeed = 'prayer'; state.immersive = true; state.tab = 'feed'; render(0); },
  'bs-places': () => placesSheet(),
  'bs-place-del': i => { (data.sermonPlaces || []).splice(+i, 1); save(); placesSheet(); toast(t('bs.deleted')); },
  'note-upload': id => uploadRecording(id),
  'rec-start': () => recStart(),
  'pv-open': () => passageView(state.snRef, state.snRefs || []),
  'sn-ref-add': () => biblePicker({ mode: 'sermonref2', start: state.snRef || null }),
  'sn-ref-rm': i => { state.snRefs = (state.snRefs || []).filter((_, k) => k !== +i); snRefsChanged(); },
  'pv-close': () => passageViewClose(),
  'rec-lang': () => { const order = ['ko', 'en', 'es'], next = order[(order.indexOf(sermonLang()) + 1) % 3]; Rec.slang = next; recPaint(true); toast(t('rec.slangSet').replace('{l}', SLANG[next][1])); },
  'rec-kind': k => { const cx = $('#rec-ctx'); if (cx) Rec.ctx = cx.value; Rec.kind = k; recPaint(true); },
  'rec-pause': () => recPause(),
  'rec-resume': () => recResume(),
  'rec-stop': () => recStop(),
  'rec-del': () => recReset(),
  'sn-ref': () => biblePicker({ mode: 'sermonref', start: state.snRef || null }),
  'note-group': id => showSheet({ title: t('sn.pickGroup'), body: `<div class="list">${data.groups.filter(g => !g.pending).map(g => `<button class="list-row" data-action="note-group-to" data-id="${esc(id)}|${esc(g.id)}"><span class="row-icon">${icon('people')}</span><span class="row-main"><span class="row-title">${esc(L(g.name))}</span></span></button>`).join('')}</div>` }),
  'note-group-to': pair => { const [id, gid] = pair.split('|'); const n = sermonNotes().find(x => x.id === id); if (!n?.summary) return; const S = n.summary;
    const text = [n.title || S.title, S.main_message, ...(S.points || []).map((p, i) => `${i + 1}. ${p.heading}`), n.body].filter(Boolean).join('\n');
    data.posts.unshift({ id: 'p' + Date.now(), mine: true, kind: 'meditation', scope: 'group', group: gid, groups: [gid], text, ref: parseRef(S.passages?.[0] || '') || undefined, date: today(), likes: 0 });
    save(); close(); toast(t('sn.shared')); },
  'db-bar': lab => { const el = $('#db-read'); if (el) el.textContent = lab; },
  'note-back': () => { state.noteOpen = null; render(); },
  'note-passage': ref => { const r = parseRef(ref); if (r) openReader({ ...r, group: 'me' }); },
  'note-share': id => { const n = sermonNotes().find(x => x.id === id); if (!n?.summary) return; const S = n.summary;
    const txt = [n.title || S.title, S.passages?.join(', '), '', S.main_message, '', ...(S.points || []).map((p, i) => `${i + 1}. ${p.heading} — ${p.detail}`), '', ...(S.application || []).map(x => '· ' + x)].filter(x => x !== undefined).join('\n');
    if (navigator.share) navigator.share({ title: n.title || S.title, text: txt }).catch(() => {}); else copyText(txt); },
  'note-del': id => confirmSheet(t('sn.delete'), t('sn.deleteQ'), t('sn.delete'), async () => {
    if (sermonNotes().find(x => x.id === id)?.remote && state.snOnline) { try { state.snQuota = await sapi('DELETE', `/api/sermons/${id}`); } catch {} state.snChecked = false; await sermonSync(); }
    const mine = (data.sermonNotes || []).find(x => x.id === id);
    if (mine?.remoteId && state.snOnline) { try { state.snQuota = await sapi('DELETE', `/api/sermons/${mine.remoteId}`); } catch {} }
    if (mine?.rec) AudioStore.del(id);
    data.sermonNotes = (data.sermonNotes || []).filter(x => x.id !== id); save(); state.noteOpen = null; render(); toast(t('sn.deleted')); }),
  'pw-open': () => paywall(),
  'pw-buy': plan => buyPlan(plan),
  'pw-clean': () => { close(); state.tab = 'notes'; state.noteOpen = null; render(); },
  'nick-sheet': gid => nickSheet(gid),
  'nick-edit': trip => { const [gid, k, name] = trip.split('|'); nickEdit(gid, k, name); },
  'nick-clear': pair => { const [gid, k] = pair.split('|'); if (data.nicknames) delete data.nicknames[k]; save(); render(); nickSheet(gid); },
  'ls-invite': gid => { state.lsInvited = { ...(state.lsInvited || {}), [gid]: true }; inviteSheet(gid); },
  'ls-challenge': gid => { if (!data.challenges.some(c => c.group === gid)) data.challenges.unshift({ id: 'ch' + Date.now(), name: t('chn.thanks'), type: 'thanks', length: 7, group: gid, members: [{ ko: '나', en: 'Me', es: 'Yo' }], start: today(), days: [] });
    save(); toast(t('toast.chStarted')); leaderStart(gid); },
  'adm-invite': gid => { const g = data.groups.find(x => x.id === gid); if (!g?.owner) return; g.membersInvite = g.membersInvite === false; save(); cloudGroupSet(g, { members_invite: g.membersInvite }); groupAdmin(gid); },
  'adm-top': gid => { const g = data.groups.find(x => x.id === gid); if (!g?.owner) return; g.topToLeaders = !g.topToLeaders; save(); cloudGroupSet(g, { top_to_leaders: g.topToLeaders }); groupAdmin(gid); },
  'adm-approve': gid => { const g = data.groups.find(x => x.id === gid); if (!g?.owner) return; g.approve = !g.approve; save(); cloudGroupSet(g, { approve: g.approve }); groupAdmin(gid); },
  'adm-newlink': gid => { const g = data.groups.find(x => x.id === gid); if (!g?.owner) return; const old = g.invite; g.invite = newCode(); g.key = Vault.newGroupKey(); save(); cloudGroupSet(g, { invite_code: g.invite });
    document.dispatchEvent(new CustomEvent('dt:group-relink', { detail: { old, code: g.invite } })); toast(t('adm.newLinkDone')); },
  'adm-remove': pair => { const [gid, k] = pair.split('|'); const g = data.groups.find(x => x.id === gid); if (!g?.owner) return;
    if (state.rmArm !== pair) { state.rmArm = pair; const b = [...document.querySelectorAll('[data-action="adm-remove"]')].find(x => x.dataset.id === pair); if (b) { b.textContent = t('adm.sure'); b.classList.add('armed'); } return; }
    state.rmArm = null;
    const name = L(data.posts.find(p => authorKey(p) === k)?.name) || ''; g.removed = [...new Set([...(g.removed || []), k])]; g.size = Math.max(1, (g.size || groupSize(gid)) - 1); save();
    document.dispatchEvent(new CustomEvent('dt:group-remove', { detail: { code: g.invite, member: k } })); groupAdmin(gid); toast(t('adm.removed').replace('{name}', name)); },
  'join-ok': () => {
    const j = state.pendingJoin; if (!j) return close();
    const g = { id: 'g' + j.code, name: j.name, invite: j.code, ...(j.key ? { key: j.key } : {}), ...(j.approve ? { pending: true } : {}) }; data.groups.push(g); state.pendingJoin = null;
    if (CLOUD) { // Supabase finishes the join (right away, or after signing in); until then it waits as pending
      g.cloud = true; g.pending = true; save(); close(); state.tab = 'group'; state.immersive = false; render();
      if (Cloud.on()) sync(); else welcomeSheet(t('cl.needJoin').replace('{name}', j.name)); // signed in once = stays signed in
      return;
    }
    if (j.approve) { document.dispatchEvent(new CustomEvent('dt:group-join', { detail: { code: j.code, approve: true } })); save(); close(); state.tab = 'group'; render(); toast(t('join.pending')); return; }
    document.dispatchEvent(new CustomEvent('dt:group-join', { detail: { code: j.code } }));
    save(); close(); state.tab = 'feed'; state.feed = 'group'; state.group = g.id; render(); toast(t('join.done').replace('{name}', j.name));
  },
  'imm-back': () => immBack(),
  'open-group': id => { if (data.groups.find(g => g.id === id)?.pending) { toast(t('join.pending')); return; } close(); state.groupDetail = id; state.group = id; state.tab = 'group'; state.immersive = false; render(); window.scrollTo?.(0, 0); try { history.pushState({ dt: 'gd' }, ''); } catch {} },
  'gd-back': () => { state.groupDetail = null; render(); },
  'gd-all': pair => { const [id, kind] = pair.split('|'); state.groupKind = kind && kind !== 'all' ? kind : null; close(); markGroupSeen(id, kind); try { history.pushState({ dt: 'imm' }, ''); } catch {} state.group = id; state.immFeed = 'group'; state.immersive = true; state.tab = 'group'; render(0); },
  'new-challenge': createChallenge,
  'challenge-write': id => {
    const ch = data.challenges.find(c => c.id === id); if (ch && chDone(ch)) { chResult(id); return; } close();
    if (ch?.type === 'bible') { const d = chPlanDay(ch, ch.days.length); openReader(d ? { b: d.start[0], c: d.start[1] } : {}); return; }
    if (ch?.type === 'meditation') { state.medRef = ch.group && ch.group !== 'pair' ? todaysPassage(ch.group)?.ref || null : null; compose('meditation', id); }
    else compose(ch?.type === 'prayer' ? 'prayer' : 'today', id);
  },
  'pick-chlen': n => { state.chLen = +n; document.querySelectorAll('[data-action="pick-chlen"]').forEach(b => b.classList.toggle('active', b.dataset.id === n)); },
  'pick-chtype': id => { state.chType = id; document.querySelectorAll('[data-action="pick-chtype"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); redrawCh(); },
  'ch-unit': u => { if (state.chUnit !== u) state.chN = { d: 7, w: 3, m: 1 }[u]; state.chUnit = u; redrawCh(); },
  'ch-step': pair => { const [k, d] = pair.split('|'); if (k === 'n') state.chN = Math.max(1, Math.min(CH_MAX[state.chUnit || 'd'], (state.chN || 7) + +d)); else state.chPer = Math.max(1, Math.min(50, (state.chPer || 3) + +d)); redrawCh(); },
  'ch-pace': k => { state.chPace = k; redrawCh(); },
  'ch-pick': w => { const cur = w === 'from' ? state.chFrom || [1, 1] : state.chTo || [1, 50]; biblePicker({ mode: w === 'from' ? 'chfrom' : 'chto', start: { b: cur[0], c: cur[1] } }); },
  'imm-feed': k => { state.immFeed = k; render(0); },
  'group-menu': gid => groupMenu(gid),
  'group-challenge': gid => { state.sheetWith = gid; state.chFromGroup = true; createChallenge(); },
  'pl-others': () => {
    const sc = $('#feed-scroll'), here = sc ? Math.round(sc.scrollTop / sc.clientHeight) : 0;
    state.showOthers = true; state.othersOrder = null; render(here); setTimeout(() => { const s2 = $('#feed-scroll'); if (s2) s2.scrollTo({ top: (here + 1) * s2.clientHeight, behavior: 'smooth' }); }, 60);
  },
  'imm-write': () => {
    state.medRef = null;
    if (state.immFeed === 'group' && state.group) Object.assign(visOf('compose'), { mode: 'private', targets: [state.group] }); // inside a group: share with that group
    compose(state.immFeed === 'prayer' ? 'prayer' : 'today', null);
  },
  'gend-write': pair => { const [gid, k] = pair.split('|'); Object.assign(visOf('compose'), { mode: 'private', targets: [gid] });
    if (k === 'meditation') devoShare(gid); else { state.medRef = null; compose(k === 'prayer' ? 'prayer' : 'today', null); } },
  'imm-group': gid => { state.group = gid; render(0); },
  'group-write': gid => { Object.assign(visOf('compose'), { mode: 'private', targets: [gid] }); compose('today', null); },
  'group-nudge': gid => {
    // One gentle message to the whole group, at most once a day. Never names anyone.
    close(); data.groupNudges = data.groupNudges || {};
    if (data.groupNudges[gid] === today()) return;
    data.groupNudges[gid] = today(); save();
    document.dispatchEvent(new CustomEvent('dt:group-nudge', { detail: { groupId: gid, code: data.groups.find(g => g.id === gid)?.invite } }));
    if (state.immersive) render(Math.round(($('#feed-scroll')?.scrollTop || 0) / Math.max(1, $('#feed-scroll')?.clientHeight || 1))); else render();
    toast(t('gs.nudgeDone'));
  },
  'verse-like': k => {
    const on = !data.verseLikes.includes(k);
    data.verseLikes = on ? [...data.verseLikes, k] : data.verseLikes.filter(x => x !== k); save();
    const btn = $(`[data-action="verse-like"][data-id="${k}"]`); if (btn) { btn.classList.toggle('liked', on); btn.setAttribute('aria-pressed', on); }
  },
  'verse-save': k => {
    const on = !data.savedVerses.some(x => x.key === k);
    data.savedVerses = on ? [{ ...verseFromKey(k), date: today() }, ...data.savedVerses] : data.savedVerses.filter(x => x.key !== k); save();
    const btn = $(`[data-action="verse-save"][data-id="${k}"]`); if (btn) { btn.classList.toggle('saved', on); btn.setAttribute('aria-pressed', on); }
    toast(on ? t('verse.saved') : t('verse.unsaved'));
  },
  'verse-send': k => {
    const x = verseFromKey(k); if (!x.text) return;
    const text = `${x.text}\n— ${refText({ b: x.b, c: x.c, v: x.v, v2: x.v })} (${x.tr})\n\n${verseLink(x)}`;
    if (navigator.share) navigator.share({ title: 'daily thanks', text }).catch(() => {}); else copyText(text);
  },
  'open-saved-verse': k => { const [b, c, v] = k.split(':').map(Number); openReader({ b, c, v }); },
  'verse-read': ref => { const r = parseRef(ref); openReader(r ? { ...r } : {}); },
  'reader-close': () => { closeReader(); if (state.immersive) toggleFullscreen(); }, // ✕ goes to the regular app; swiping right still returns to the feed
  'reader-pick': () => biblePicker({ mode: 'reader', start: state.reader?.loaded?.length ? { b: data.reading?.b, c: data.reading?.c } : null }),
  'bp-book': b => bpBook(+b),
  'bp-ch': c => bpChapter(+c),
  'bp-v': v => bpVerse(+v),
  'bp-ok': () => bpDone(),
  'bp-close': () => closePicker(),
  'mp-pick': () => biblePicker({ mode: 'med', start: state.medRef || null }),
  'reader-book': b => chapterPicker(+b),
  'reader-go': bc => { const [b, c] = bc.split(':').map(Number); close(); openReader({ b, c, group: state.reader?.group }); },
  'reader-retry': () => { const r = state.reader; if (r) openReader(r); },
  'devo-read': gid => { const p = todaysPassage(gid); openReader(p?.ref ? { ...p.ref, group: gid } : { group: gid }); },
  'devo-share': gid => devoShare(gid),
  'devo-set': gid => biblePicker({ mode: 'devo', gid, start: todaysPassage(gid)?.ref || null }),
  compose: () => compose('today', null),
  'challenge-detail': challengeDetail,
  'save-notifications': () => {
    Object.assign(data.settings, { notificationTime: $('#notify-time').value, notificationEnabled: $('#notify-enabled').checked, groupUpdates: $('#notify-group').checked });
    save(); close(); toast(t('toast.nSaved'));
  },
  export: exportData,
  fullscreen: toggleFullscreen,
  login: id => CLOUD ? welcomeSheet() : id === 'phone' ? phoneLogin() : completeLogin(id),
  'email-login': () => emailLogin(),
  'wl-open': () => welcomeSheet(),
  tour: () => startTour(),
  'wl-sign': id => welcomeSign(id),
  'wl-later': () => { try { sessionStorage.setItem('wl-later', '1'); } catch {} close(); },
  'cl-resend': () => { const c = state.clEmail; if (!c) return; Cloud.sendLink(c.email, c.name).then(() => toast(t('cl.resent')), err => toast(err.status === 429 ? t('cl.tooMany') : t('cl.sendFail'))); },
  'cl-approve': pair => { const [gid, uid] = pair.split('|'); cloudMember(gid, uid, true); },
  'cl-remove': pair => { const [gid, uid] = pair.split('|'); if (state.rmArm !== pair) { state.rmArm = pair; const b = [...document.querySelectorAll('[data-action="cl-remove"]')].find(x => x.dataset.id === pair); if (b) { b.textContent = t('adm.sure'); b.classList.add('armed'); } return; } state.rmArm = null; cloudMember(gid, uid, false); },
  logout: () => { if (CLOUD) Cloud.signOut(); setSession(null); close(); render(); toast(t('acct.loggedOut')); },
  'gate-scope': id => { state.composeScope = id; document.querySelectorAll('[data-action="gate-scope"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  'gate-later': () => { const sc = $('#feed-scroll'), card = $('#compose-card'); if (sc && card) sc.scrollTo({ top: card.offsetTop + sc.clientHeight, behavior: 'smooth' }); },
  'intro-again': () => { Object.assign(data.settings, { gestureHint: false, hintArmed: false, triedLeft: false, triedRight: false, swipedBack: false, prayerBackHint: false, quiz: {}, readerOpened: false }); save(); close(); state.tab = 'feed'; state.immersive = true; render(0); toast(t('toast.intro')); },
  reset: () => confirmSheet(t('s.reset'), t('s.confirmReset'), t('s.reset'), () => {
    const l = lang(); data = clone(seed); data.settings.lang = l; state.group = data.groups[0].id;
    save(); state.tab = 'feed'; state.immersive = true; render(); toast(t('toast.reset')); setTimeout(() => location.reload(), 600);
  })
};

document.addEventListener('click', e => {
  const cut = state.immersive && e.target.closest('.post-text[data-cut="1"]'); // in the regular feed a tap opens the big view instead
  if (cut) { const id = cut.closest('[data-post]')?.dataset.post; if (id) { actions['read-more'](id); return; } }
  const tab = e.target.closest('[data-tab]');
  if (tab) { state.tab = tab.dataset.tab; state.groupDetail = null; state.churchView = false; if (state.tab === 'feed') state.feed = 'public'; close(); render(); return; }
  const b = e.target.closest('[data-action]');
  if (b && b.tagName !== 'SELECT') { actions[b.dataset.action]?.(b.dataset.id); return; }
  const card = !state.immersive && state.tab === 'feed' && !e.target.closest('a,button,input,textarea,select,label') && e.target.closest('.post[data-post]:not(.imm)');
  if (card) { state.immFocus = card.dataset.post; toggleFullscreen(); }
});
document.addEventListener('change', e => {
  if (e.target.dataset?.pref) { setPref(e.target.dataset.pref, e.target.checked); state.firstPrIds = null; return; }
  if (e.target.id === 'rec-file') {   // sermon note from an audio file
    const f = e.target.files?.[0]; if (!f) return;
    if (quotaFull(noteQuota())) { close(); paywall(); return; }
    Rec.blob = f; Rec.fileName = f.name; Rec.dur = 0; Rec.live = { final: '', interim: '' };
    const a = new Audio(); a.preload = 'metadata'; a.onloadedmetadata = () => { Rec.dur = isFinite(a.duration) ? a.duration : 0; URL.revokeObjectURL(a.src); }; a.src = URL.createObjectURL(f);
    recPaint(true); return;
  }
  const f = e.target.dataset?.feature;
  if (f) {
    data.settings.features[f] = e.target.checked; save(); render();
    toast(t(e.target.checked ? 'ft.on' : 'ft.off').replace('{name}', t('ft.' + f)));
    return;
  }
  if (e.target.matches('[data-action="change-group"]')) { state.group = e.target.value; renderFeed(); }
});
backdrop.addEventListener('click', close);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !passageViewClose() && !closePicker()) close(); });
['copy', 'cut', 'contextmenu', 'dragstart'].forEach(ev => document.addEventListener(ev, e => { if (e.target.closest?.('.post.protected, .gd-recent')) { e.preventDefault(); if (ev === 'copy') toast(t('prot.noShare')); } }));

/* Extension hook for optional add-ons (e.g. fullstack/public/client.js): server sync and
   feature-flagged screens. The plain front-end app never uses it, so nothing changes visually. */
window.DailyThanks = {
  getData: () => data,
  replaceData: next => { if (next && Array.isArray(next.posts)) { data = next; try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {} applyStatic(); render(); } },
  lang, t, esc, icon, showSheet, close, toast, render: () => render(), getSession: () => session,
  // remote content: the server add-on (or the native shell) passes the downloaded content.json here
  applyContent: c => { if (applyContent(c)) { save(); render(); afterContent(); } }, getContent: () => CONTENT,
  // native shell: a reminder tap or the home-screen widget opens the writing sheet
  joinGroup: (code, name, key) => joinGroup(code, name, key),
  replyThanks: (to, from) => { document.getElementById('splash')?.remove(); close(); state.tyName = String(to || '').slice(0, 30); if (from && !data.settings.myName) data.settings.myName = String(from).slice(0, 30); compose('thanks', null); },
  vault: Vault,
  // native shell: is something on screen that mustn't be captured (other people's group / prayer posts)?
  isProtectedView: () => !!document.querySelector('#app .post.protected, #app .gd-recent'),
  closeReader: () => closeReader(),
  back: () => closePicker() || closeReader() || immBack() || (state.groupDetail && !state.immersive ? (state.groupDetail = null, render(), true) : false),
  parseRef, refText,
  openWrite: () => { document.getElementById('splash')?.remove(); close(); compose('today', null); },
  openMeditation: () => { document.getElementById('splash')?.remove(); close(); const g = data.groups[0]?.id; if (g) devoShare(g); else compose('meditation', null); },
  widgetData: () => widgetData()
};
if (CONTENT_URL) fetch(CONTENT_URL, { cache: 'no-cache' }).then(r => r.ok ? r.json() : null).then(c => window.DailyThanks.applyContent(c)).catch(() => {});
afterContent();

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
  if (entering) { if (!BIBLE_MODE) state.tab = 'feed'; state.feed = 'public'; state.immFeed = 'public'; }
  else if (BIBLE_MODE) { state.immFeed = 'public'; state.tab = 'read'; state.groupDetail = null; } // daily bible: closing the feed always lands on 읽기
  else if (state.immFeed === 'group') { state.immFeed = 'public'; state.tab = 'group'; } // closing a group returns to the 공동체 tab
  else state.immFeed = 'public';
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

if (BIBLE_MODE) bibleShell();
applyStatic();
if (BIBLE_MODE) document.title = t('bb.title');
applyTextSize();
render();
// Widget / notification deep link: daily-thanks://write → #write opens the writing sheet straight away.
(() => {
  let sx = 0, sy = 0, card = null, inReader = false, startEl = null;
  document.addEventListener('touchstart', e => { const tch = e.touches[0]; sx = tch.clientX; sy = tch.clientY; startEl = e.target; card = e.target.closest?.('.verse-card'); inReader = !!e.target.closest?.('#reader'); }, { passive: true });
  let lastTap = 0, lastX = 0, lastY = 0;
  document.addEventListener('touchend', e => {
    const tch = e.changedTouches[0], dx = tch.clientX - sx, dy = tch.clientY - sy;
    // double tap while reading → like (or "I prayed" on a prayer request)
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      const now = Date.now();
      if (now - lastTap < 320 && Math.abs(tch.clientX - lastX) < 40 && Math.abs(tch.clientY - lastY) < 40) { lastTap = 0; doubleTap(startEl, tch.clientX, tch.clientY); }
      else { lastTap = now; lastX = tch.clientX; lastY = tch.clientY; }
      return;
    }
    if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.4) return; // mostly sideways, anywhere on the screen
    if (startEl?.closest('#bpick')) return; // inside the Bible picker
    if (inReader && state.reader?.passage && startEl?.closest('#reader-scroll')) return; // sideways turns the verse
    if (BIBLE_MODE && !inReader) return; // daily bible: no sideways jumps between screens
    if (inReader) { if (dx > 0) { data.settings.swipedBack = true; closeReader(); } return; } // Bible ← reached by swiping left; swipe right to come back
    if (document.getElementById('sheet')?.hidden === false) return;
    if (startEl?.closest('.chips,.kind-chips,.seg,input,textarea,select,.cal-grid')) return;
    const toPrayers = () => { state.prevFeed = state.immFeed === 'prayer' ? 'public' : (state.immFeed || 'public'); state.immFeed = 'prayer'; state.immersive = true; state.tab = 'feed'; render(0); };
    if (state.immersive && state.immFeed === 'prayer') { if (dx < 0) { data.settings.prayerBackHint = true; save(); state.immFeed = state.prevFeed || 'public'; state.showOthers = false; render(0); } return; } // back from prayers
    if (dx > 0) { triedSwipe('right'); toPrayers(); return; }                                 // swipe right → prayer requests
    triedSwipe('left'); document.querySelector('.gesture-hint:not(.back-hint)')?.remove();
    const r = card && parseRef(card.dataset.ref); openReader(r ? { ...r } : {});           // swipe left → read the Bible
  }, { passive: true });
  document.addEventListener('dblclick', e => doubleTap(e.target, e.clientX, e.clientY)); // mouse
})();
// Double tap on a post or a verse: like it (prayer requests: "I prayed"). Only turns it on, like a heart tap.
function doubleTap(el, x, y) {
  if (!el || el.closest('button,a,input,textarea,.sheet')) return;
  const post = el.closest('.post.imm[data-post]'), verse = el.closest('.vs-page');
  let done = false;
  if (post) {
    const p = data.posts.find(q => q.id === post.dataset.post); if (!p) return;
    if (p.kind === 'prayer') { if (!data.prayed.includes(p.id)) { togglePray(p.id); done = true; } }
    else if (!data.liked.includes(p.id)) { like(p.id); done = true; }
  } else if (verse) {
    const k = verseKey(verse.dataset.b, verse.dataset.c, verse.dataset.v);
    if (!data.verseLikes.includes(k)) { actions['verse-like'](k); done = true; }
  }
  if (!done && !post && !verse) return;
  const h = document.createElement('span'); h.className = 'tap-heart'; h.innerHTML = icon(post && data.posts.find(q => q.id === post.dataset.post)?.kind === 'prayer' ? 'pray' : 'heart');
  h.style.left = x + 'px'; h.style.top = y + 'px'; document.body.appendChild(h); setTimeout(() => h.remove(), 750);
}
// Invite link opened in the web app: #join?c=CODE&n=NAME
if (CLOUD) { const back = Cloud.fromRedirect(); if (!back) Cloud.resume();
  if (!back && !Cloud.on() && !/^#(join|plan|m=|reply|pastor)/.test(location.hash)) { let later = false; try { later = !!sessionStorage.getItem('wl-later'); } catch {} if (!later) setTimeout(() => { if (!data.settings.toured) startTour(); else if (!Cloud.on() && sheet.hidden) welcomeSheet(); }, 2600); } document.addEventListener('visibilitychange', () => { if (!document.hidden && Date.now() - (sync.last || 0) > 60e3) { sync.last = Date.now(); sync(); } }); }
if (location.hash.startsWith('#reply')) { const q = new URLSearchParams(location.hash.split('?')[1] || ''); document.getElementById('splash')?.remove();
  setTimeout(() => { state.tyName = (q.get('to') || '').slice(0, 30); if (q.get('from') && !data.settings.myName) data.settings.myName = q.get('from').slice(0, 30); compose('thanks', null); }, 80); }
if (location.hash.startsWith('#join')) { const q = new URLSearchParams(location.hash.split('?')[1] || ''); document.getElementById('splash')?.remove(); setTimeout(() => joinGroup(q.get('c'), q.get('n'), q.get('k')), 80); }
if (location.hash.startsWith('#pastor=')) { try { state.pastorView = unb64url(location.hash.slice(8)); state.immersive = false; state.tab = 'group'; document.getElementById('splash')?.remove(); setTimeout(render, 60); } catch {} }
if (location.hash.startsWith('#m=')) { const b64 = location.hash.slice(3); document.getElementById('splash')?.remove(); setTimeout(() => openSharedMeditation(b64), 120); }
if (location.hash.startsWith('#plan')) { const q = new URLSearchParams(location.hash.split('?')[1] || ''); document.getElementById('splash')?.remove(); setTimeout(() => planJoin(q), 80); }
if (location.hash === '#write') { document.getElementById('splash')?.remove(); setTimeout(() => compose('today', null), 50); }

/* Splash second line follows the language: Korean gets its own words; the wordmark stays as it is.
   content.json "tagline" may be a list (all languages) or { ko: [...], en: [...] }. */
(() => {
  const tag = document.querySelector('#splash .splash-tag'); if (!tag || BIBLE_MODE) return;
  const remote = CONTENT.tagline && !Array.isArray(CONTENT.tagline) ? CONTENT.tagline[lang()] : null;
  const lines = Array.isArray(remote) && remote.length ? remote : lang() === 'ko' ? ['매일 감사', '풍성한 하루', '나눔의 기쁨'] : null;
  if (lines) { tag.innerHTML = lines.slice(0, 4).map(l => `<span>${safeEm(l)}</span>`).join(''); tag.classList.toggle('ko', lang() === 'ko'); }
})();
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
  // 1) wordmark  2) "Give thanks daily. Live abundantly. Share the joy."  3) feed
  // daily bible: just the wordmark, then the app (no tagline step)
  if (BIBLE_MODE) { splash.querySelector('.splash-tag')?.remove(); splash.setAttribute('aria-label', 'daily bible. © 2026 Daily Journey, Inc.'); setTimeout(hide, 2400); }
  else { setTimeout(() => { if (!gone) splash.classList.add('step2'); }, 1400); setTimeout(hide, 4200); }
}
})();
