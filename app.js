/* Daily Thanks — dependency-free offline prototype (Korean / English).
   No accounts, server, push, Kakao or Instagram integration. Data lives in this browser's localStorage. */
(() => {
'use strict';

const KEY = 'daily-thanks-v4'; // v3: seeds include share/save counts and a week of my notes

/* ---------------- strings ---------------- */
const STR = {
  ko: {
    'card.feed': '피드 4:5', 'card.story': '스토리 9:16', 'card.shareImg': '이미지로 공유', 'card.noShare': '이 화면에서는 이미지 공유가 막혀 있어요. 앱에서는 바로 인스타그램·카카오톡으로 보낼 수 있어요.',
    'wg.title': '홈 화면에 감사 한 줄', 'wg.sub': '위젯을 두면 앱을 찾지 않고 바로 오늘의 감사를 쓸 수 있어요. 매일 쓰는 습관이 훨씬 쉬워져요.',
    'wg.ios': '아이폰', 'wg.android': '안드로이드', 'wg.write': '한 줄 쓰기', 'wg.done': '오늘 감사 완료',
    'wg.iosSteps': '홈 화면 빈 곳을 길게 누르기|왼쪽 위 「+」 누르기|「Daily Thanks」 찾기|원하는 크기를 골라 「위젯 추가」',
    'wg.androidSteps': '홈 화면 빈 곳을 길게 누르기|「위젯」 누르기|「Daily Thanks」 찾기|위젯을 길게 눌러 홈 화면에 놓기',
    'wg.ok': '추가했어요', 'wg.later': '나중에 할게요', 'wg.okToast': '이제 홈 화면에서 바로 감사를 남길 수 있어요.', 'wg.laterToast': '설정 › 홈 위젯에서 언제든 다시 볼 수 있어요.',
    'wg.note': '시안에서는 미리보기예요. 실제 위젯은 앱을 설치하면 추가할 수 있어요.',
    'vis.public': '모두', 'vis.private': '비공개', 'vis.me': '나만 보기', 'vis.privateHint': '나만 보거나, 고른 소그룹 사람들만 볼 수 있어요.',
    'inf.people': '{n}명에게 닿았어요', 'inf.peopleBig': '{n}명', 'inf.peopleSub': '나의 감사가 닿은 사람', 'inf.peopleNote': '좋아요·저장·공유로 마음을 표현한 사람 수예요. 실제 앱에서는 카카오톡·인스타그램으로 공유된 링크를 열어 본 사람도 더해져요.',
    'ft.title': '기능 (켜서 쓰기)', 'ft.hint': '기본은 감사만이에요. 필요한 기능만 켜서 쓰세요.',
    'ft.groupShare': '소그룹 나눔', 'ft.groupShareSub': '소그룹에서 이번 주 질문에 함께 답해요.',
    'ft.prayer': '기도제목 나눔', 'ft.prayerSub': '기도제목을 올리고 「기도했어요」로 함께 기도해요.',
    'ft.sermon': 'AI 설교 요약', 'ft.sermonSub': '설교를 녹음하면 설교 노트로 정리해요.',
    'ft.on': '{name}을(를) 켰어요.', 'ft.off': '{name}을(를) 껐어요.',
    'kind.prayer': '기도제목', 'pr.ph': '함께 기도받고 싶은 것을 나눠 주세요.', 'pr.prayed': '기도했어요', 'pr.prayedToast': '함께 기도했어요.', 'pr.count': '{n}명이 기도했어요', 'pr.section': '기도제목', 'pr.empty': '아직 올라온 기도제목이 없어요.', 'pr.who': '기도한 사람',
    'gs.section': '이번 주 나눔', 'gs.answers': '나눔 {n}개', 'gs.write': '나눔 쓰기', 'gs.view': '나눔 보기', 'gs.ph': '이번 주 질문에 대한 나의 생각을 나눠 주세요.', 'gs.saved': '소그룹에 나눴어요.', 'gs.empty': '아직 나눔이 없어요. 처음으로 나눠 보세요.',
    'sm.section': '설교 노트', 'sm.new': '새 설교 노트', 'sm.empty': '설교를 녹음하거나 받아쓴 글을 붙여 넣으면 노트로 정리해 드려요.', 'sm.record': '녹음 파일 올리기', 'sm.paste': '받아쓴 글 붙여 넣기', 'sm.title': '설교 제목 (선택)', 'sm.preacher': '설교자 (선택)', 'sm.make': '요약 만들기', 'sm.demo': '시안에서는 예시 요약을 보여드려요. 실제 앱에서는 AI가 녹음을 글로 옮기고 요약해요.',
    'sm.passages': '본문', 'sm.main': '핵심 메시지', 'sm.points': '말씀 요점', 'sm.apply': '삶의 적용', 'sm.prayer': '기도제목', 'sm.questions': '나눔 질문', 'sm.toGroup': '소그룹 나눔 질문으로 보내기',
    'np.title': '매일의 감사가<br>삶을 풍성하게 합니다.', 'np.sub': 'Daily gratitude makes life richer',
    'np.r1': '하루 한 번, 내가 고른 시간에만 알려드려요.', 'np.r2': '이미 감사를 쓴 날은 알리지 않아요.', 'np.r3': '소그룹 소식은 모아서 조용히 전해요.',
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
    'ty.copy': '텍스트 복사', 'ty.toGroup': '소그룹에 나누기', 'ty.saved': '감사 카드를 나의 감사에 남겨 두었어요.', 'ty.needName': '받는 사람 이름을 적어 주세요.',
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
    'nav.today': '오늘', 'nav.group': '소그룹', 'nav.challenge': '함께 7일', 'nav.journal': '나의 감사',
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
    'compose.qToday': '오늘 감사한 것은?', 'compose.qAhead': '미리 감사하며 하나님께 맡기는 일은?',
    'compose.phToday': '오늘 감사한 것을 적어보세요.', 'compose.phAhead': '하나님, 이번 한 주도…',
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
    'ch.question': '오늘 감사하고 싶은 사람은 누구인가요?', 'ch.detailHint': '한 사람이 글을 썼을 때 모든 참가자의 참여로 계산하지 않도록, 실제 서비스에서는 사용자별 체크인 기록이 필요합니다.', 'ch.rest': '하루 쉬어도, 다시 이어가요.',
    'gr.kicker': 'SMALL GROUPS', 'gr.title': '소그룹', 'gr.desc': '가까운 사람들과만 나누는 감사예요.', 'gr.new': '새 소그룹', 'gr.posts': '개의 감사', 'gr.open': '피드 보기',
    'gr.createTitle': '새 소그룹', 'gr.name': '소그룹 이름', 'gr.ph': '예: 수요 성경공부', 'gr.create': '만들기', 'toast.grCreated': '소그룹이 만들어졌어요.', 'gr.fine': '실제 초대·가입·권한 관리는 서버 연동 후 제공됩니다.',
    'j.kicker': 'MY GRATITUDE', 'j.title': '나의 감사', 'j.desc': '오늘의 감사와 미리 드린 감사가 여기에 쌓여요.', 'j.all': '전체', 'j.new': '＋ 새로운 감사 쓰기', 'j.empty': '아직 기록된 감사가 없어요.', 'j.reflect': '돌아보며 감사 쓰기', 'j.delete': '삭제', 'j.confirmDelete': '이 감사 기록을 삭제할까요?',
    'n.title': '나의 감사 시간', 'n.hint': '매일 부담 없이 한 줄을 남기도록, 내가 정한 시간에 한 번만 알려주는 흐름을 설계했어요.', 'n.time': '감사 알림 시간', 'n.enable': '매일 감사 알림', 'n.group': '그룹 소식 모아 받기', 'n.example': '잠금 화면 알림 예시', 'n.ex1': '오늘 감사한 것 하나', 'n.ex2': '작은 일도 좋아요. 한 줄로 남겨볼까요?', 'n.save': '저장', 'n.fine': '이 화면은 기기에 실제 푸시 알림을 예약하지 않습니다. 실제 알림은 권한 요청 및 네이티브 앱/웹 푸시 설정이 필요합니다.', 'toast.nSaved': '데모 설정이 저장되었어요.',
    'w.title': '홈 화면 위젯', 'w.desc': '실제 iPhone 위젯이 아닌 홈 화면 디자인 미리보기예요.', 'w.today': '오늘의 감사', 'w.q': '오늘 나를 웃게 한 일은?', 'w.write': '＋ 한 줄 쓰기', 'w.sub': '함께하는 7일', 'w.view': '챌린지 보기', 'w.fine': '실제 위젯 설치·위젯에서 앱 열기는 iOS/Android 네이티브 개발 단계에서 구현해야 합니다.',
    's.title': '설정', 's.lang': '언어 · Language', 's.notify': '알림 시간', 's.widget': '홈 위젯 미리보기', 's.export': '내 데모 데이터 JSON 복사', 'cancel': '취소', 's.reset': '데모 초기화', 'fs.enter': '전체 화면', 'fs.exit': '전체 화면 끄기', 'fs.close': '닫기', 'fs.closeAria': '전체 화면 닫기',
    'nudge': '아래로 넘겨 보기', 'gate.kicker': '오늘의 감사', 'gate.q': '오늘 감사한 것은?', 'gate.ph': '한 줄이면 충분해요.', 'gate.private': '나만 보기', 'gate.public': '모두의 감사', 'gate.save': '감사 남기기', 'gate.later': '나중에 쓸게요',
    'gate.saved': '오늘의 감사가 저장되었어요.', 'gate.savedSub': '위로 넘겨 다른 사람들의 감사를 계속 보세요.',
    'login.title': '계속 보려면<br>로그인해 주세요.', 'login.sub': '한 번만 로그인하면 다음부터는 바로 열려요. 오늘 쓴 감사도 안전하게 보관돼요.',
    'login.apple': 'Apple로 계속하기', 'login.google': 'Google로 계속하기', 'login.phone': '휴대폰 번호로 계속하기',
    'login.demo': '시안에서는 실제 계정에 연결하지 않고 로그인 상태만 이 기기에 저장해요.', 'login.done': '로그인했어요. 다음부터는 바로 열려요.',
    'phone.title': '휴대폰 번호로 로그인', 'phone.number': '휴대폰 번호', 'phone.send': '인증번호 받기', 'phone.code': '인증번호 6자리', 'phone.verify': '확인',
    'phone.sent': '인증번호를 보냈어요.', 'phone.demo': '시안에서는 문자가 가지 않아요. 아무 6자리 숫자나 입력하세요.', 'phone.bad': '번호를 다시 확인해 주세요.', 'phone.badCode': '6자리 숫자를 입력해 주세요.',
    'acct.signedIn': '로그인됨', 'acct.logout': '로그아웃', 'acct.loggedOut': '로그아웃했어요.', 'fs.ios': '아이폰에서는 Safari 공유 버튼 → 「홈 화면에 추가」로 열면 앱처럼 전체 화면으로 보여요.', 'fs.blocked': '이 환경에서는 전체 화면을 쓸 수 없어요.', 's.fine': '현재의 기록은 이 브라우저에만 저장됩니다. 새 브라우저나 기기로 자동 동기화되지 않습니다.', 's.confirmReset': '데모에서 추가한 기록과 설정을 모두 초기화할까요?', 'toast.reset': '데모가 초기화되었어요.', 'toast.noStore': '현재 브라우저에 저장할 수 없어요.'
  },
  en: {
    'card.feed': 'Feed 4:5', 'card.story': 'Story 9:16', 'card.shareImg': 'Share as image', 'card.noShare': 'Image sharing is blocked on this screen. In the app it goes straight to Instagram or KakaoTalk.',
    'wg.title': 'A line of thanks on your home screen', 'wg.sub': 'With the widget you can write today’s thanks without looking for the app. The daily habit gets much easier.',
    'wg.ios': 'iPhone', 'wg.android': 'Android', 'wg.write': 'Write a line', 'wg.done': 'Done for today',
    'wg.iosSteps': 'Touch and hold an empty spot on the Home Screen|Tap “+” at the top left|Find “Daily Thanks”|Pick a size and tap “Add Widget”',
    'wg.androidSteps': 'Touch and hold an empty spot on the home screen|Tap “Widgets”|Find “Daily Thanks”|Touch and hold the widget, then place it',
    'wg.ok': 'Added it', 'wg.later': 'Maybe later', 'wg.okToast': 'Now you can leave thanks right from your home screen.', 'wg.laterToast': 'You can find it anytime in Settings › Home widget.',
    'wg.note': 'This is a preview. The real widget can be added once the app is installed.',
    'vis.public': 'Everyone', 'vis.private': 'Private', 'vis.me': 'Only me', 'vis.privateHint': 'Only you, or only the group you pick, can see it.',
    'inf.people': 'Reached {n} people', 'inf.peopleBig': '{n}', 'inf.peopleSub': 'people your thanks reached', 'inf.peopleNote': 'People who liked, saved or shared your posts. In the app, people who open your KakaoTalk / Instagram links are added too.',
    'ft.title': 'Features (turn on to use)', 'ft.hint': 'The app is just thanks by default. Turn on only what you need.',
    'ft.groupShare': 'Group sharing', 'ft.groupShareSub': 'Answer a weekly question together in your group.',
    'ft.prayer': 'Prayer requests', 'ft.prayerSub': 'Share prayer requests; others tap “I prayed”.',
    'ft.sermon': 'AI sermon notes', 'ft.sermonSub': 'Record a sermon and get tidy notes.',
    'ft.on': '{name} is on.', 'ft.off': '{name} is off.',
    'kind.prayer': 'Prayer request', 'pr.ph': 'Share what you’d like prayer for.', 'pr.prayed': 'I prayed', 'pr.prayedToast': 'You prayed with them.', 'pr.count': '{n} people prayed', 'pr.section': 'Prayer requests', 'pr.empty': 'No prayer requests yet.', 'pr.who': 'Prayed',
    'gs.section': 'This week’s sharing', 'gs.answers': '{n} answers', 'gs.write': 'Share', 'gs.view': 'Read answers', 'gs.ph': 'Share your thoughts on this week’s question.', 'gs.saved': 'Shared with your group.', 'gs.empty': 'No answers yet. Be the first.',
    'sm.section': 'Sermon notes', 'sm.new': 'New sermon note', 'sm.empty': 'Record a sermon or paste a transcript and get tidy notes.', 'sm.record': 'Upload a recording', 'sm.paste': 'Paste a transcript', 'sm.title': 'Sermon title (optional)', 'sm.preacher': 'Preacher (optional)', 'sm.make': 'Make notes', 'sm.demo': 'This prototype shows a sample. In the app, AI transcribes the recording and writes the notes.',
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
    'kind.thanks': 'Thank someone', 'ty.to': 'Their name', 'ty.ph': 'Write your thank-you message.', 'ty.make': 'Make a thank-you card', 'ty.card': 'Thank-you card', 'ty.send': 'Send',
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
    'nudge': 'Scroll for more', 'gate.kicker': 'Today’s thanks', 'gate.q': 'What are you thankful for today?', 'gate.ph': 'One line is enough.', 'gate.private': 'Only me', 'gate.public': 'Everyone', 'gate.save': 'Save my thanks', 'gate.later': 'Maybe later',
    'gate.saved': 'Your thanks for today is saved.', 'gate.savedSub': 'Swipe up to keep reading others’ thanks.',
    'login.title': 'Sign in<br>to keep reading.', 'login.sub': 'Sign in once and the app opens straight in next time. Your thanks stays safe too.',
    'login.apple': 'Continue with Apple', 'login.google': 'Continue with Google', 'login.phone': 'Continue with phone number',
    'login.demo': 'In this prototype nothing connects to a real account; only the signed-in state is saved on this device.', 'login.done': 'You’re signed in. Next time it opens straight in.',
    'phone.title': 'Sign in with your phone', 'phone.number': 'Phone number', 'phone.send': 'Send code', 'phone.code': '6-digit code', 'phone.verify': 'Verify',
    'phone.sent': 'Code sent.', 'phone.demo': 'No text is sent in this prototype. Enter any 6 digits.', 'phone.bad': 'Please check the number.', 'phone.badCode': 'Enter the 6-digit code.',
    'acct.signedIn': 'Signed in', 'acct.logout': 'Sign out', 'acct.loggedOut': 'Signed out.', 'fs.ios': 'On iPhone, open it from Safari’s Share button → “Add to Home Screen” to see it full screen like an app.', 'fs.blocked': 'Full screen isn’t available here.', 's.fine': 'Your notes are stored only in this browser and don’t sync to other browsers or devices.', 's.confirmReset': 'Reset all notes and settings added in this demo?', 'toast.reset': 'Demo reset.', 'toast.noStore': 'This browser can’t save data right now.'
  },
  es: {
    'card.feed': 'Feed 4:5',
    'card.story': 'Historia 9:16',
    'card.shareImg': 'Compartir como imagen',
    'card.noShare': 'Esta pantalla no permite compartir imágenes. En la app se envía directo a Instagram o KakaoTalk.',
    'wg.title': 'Una línea de gratitud en tu pantalla de inicio',
    'wg.sub': 'Con el widget puedes escribir tu gratitud de hoy sin buscar la app. El hábito diario se vuelve mucho más fácil.',
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
    'vis.privateHint': 'Solo tú, o solo el grupo que elijas, puede verlo.',
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
    'ft.sermon': 'Notas de sermón con IA',
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
    'sm.demo': 'Este prototipo muestra un ejemplo. En la app, la IA transcribe la grabación y escribe las notas.',
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
    'kind.thanks': 'Agradecer a alguien',
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
    'ch.title': '7 días',
    'ch.desc': 'Completen siete días de gratitud con un amigo o un grupo. Si faltas un día, simplemente sigue.',
    'ch.new': 'Nuevo reto',
    'ch.write': 'Escribir la gratitud de hoy',
    'ch.detail': 'Detalles',
    'ch.day': 'Día ',
    'ch.fine': 'En esta demo sin conexión, los miembros y el progreso se guardan solo en este navegador. Las invitaciones reales necesitan un servidor y cuentas.',
    'ch.createTitle': 'Empezar un reto de 7 días',
    'ch.name': 'Nombre del reto',
    'ch.defaultName': 'Siete días juntos',
    'ch.with': '¿Quién te acompaña?',
    'ch.pair': 'Un amigo y yo (enlaces de invitación tras el lanzamiento)',
    'ch.pairShort': 'Un amigo y yo',
    'ch.createHint': 'Faltar un día no reinicia tu semana. Las invitaciones y la sincronización llegan con el servidor.',
    'ch.start': 'Empezar',
    'toast.chStarted': 'Tu nuevo reto de 7 días comenzó.',
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
    's.reset': 'Reiniciar demo',
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
    's.confirmReset': '¿Reiniciar todas las notas y ajustes de esta demo?',
    'toast.reset': 'Demo reiniciada.',
    'toast.noStore': 'Este navegador no puede guardar datos ahora.'
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
    { id: 'pub1', name: { ko: '다은', en: 'Daeun' }, scope: 'public', kind: 'ahead', date: daysAgo(0), likes: 8, shares: 4, saves: 9,
      text: { ko: '이번 한 주도 직장에서 기쁨으로 하루하루를 보내게 하심에 감사합니다.', en: 'Thank you for a week of joyful days at work.', es: 'Gracias por una semana de días alegres en el trabajo.' } },
    { id: 'pub7', name: { ko: '민준', en: 'Minjun' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 31, shares: 2, saves: 6, extShares: 1,
      text: { ko: '따뜻한 밥 한 끼. 그거면 충분한 날이었어요.', en: 'A warm meal. That was enough for today.', es: 'Una comida caliente. Eso fue suficiente hoy.' } },
    { id: 'pub8', name: { ko: '영숙', en: 'Youngsook' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 57, shares: 14, saves: 22, extShares: 5,
      text: { ko: '오늘 손주가 처음으로 "할머니 사랑해요"라고 또박또박 말해 줬어요. 평생 들은 말 중에 제일 예쁜 말이었어요. 이렇게 오래 살게 하셔서 이 말을 듣게 하시니 감사합니다.', en: 'Today my grandson said “Grandma, I love you” clearly for the first time. It was the most beautiful thing I’ve heard in my life. Thank you for letting me live long enough to hear it.', es: 'Hoy mi nieto me dijo por primera vez, clarito, “Abuela, te quiero”. Fue lo más bonito que he escuchado en mi vida. Gracias por dejarme vivir tanto como para oírlo.' } },
    { id: 'pub9', name: { ko: '지훈', en: 'Jihoon' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 19, shares: 1, saves: 3,
      text: { ko: '버스를 놓칠 뻔했는데 기사님이 기다려 주셨다. 감사합니다, 기사님.', en: 'I nearly missed the bus, but the driver waited for me. Thank you, sir.', es: 'Casi pierdo el autobús, pero el conductor me esperó. Gracias, señor.' } },
    { id: 'pub2', name: { ko: '서연', en: 'Seoyeon' }, scope: 'public', kind: 'today', date: daysAgo(0), likes: 24, shares: 11, saves: 15, extShares: 6,
      text: { ko: '잠깐 멈춰 보니, 집으로 돌아가는 길에도 예쁜 하늘이 있었어요. 평범한 하루를 아름답게 하심에 감사합니다.', en: 'I paused on my way home and found a lovely sky. Thank you for a beautiful ordinary day.', es: 'Me detuve camino a casa y encontré un cielo precioso. Gracias por un día común tan bonito.' } },
    { id: 'pub10', name: { ko: '수아', en: 'Sua' }, scope: 'public', kind: 'ahead', date: daysAgo(0), likes: 26, shares: 3, saves: 11, extShares: 1,
      text: { ko: '하나님, 내일 면접에서 떨지 않고 제 모습 그대로 보여 드리게 하실 줄 믿고 미리 감사드립니다.', en: 'God, I thank you ahead of time for helping me stay calm and simply be myself at tomorrow’s interview.', es: 'Dios, te doy gracias de antemano porque mañana en la entrevista estaré en calma y seré yo mismo.' } },
    { id: 'pub11', name: { ko: '현우', en: 'Hyunwoo' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 88, shares: 21, saves: 34, extShares: 9,
      text: { ko: '항암 치료 여섯 번째 날. 몸은 힘들지만 매일 문자 보내 주는 친구들, 묵묵히 곁에 있어 주는 아내 덕분에 오늘도 버텼습니다. 아픈 중에도 감사할 게 이렇게 많네요.', en: 'Day six of chemo. My body is tired, but friends who text every day and my wife who quietly stays by me got me through today. Even in pain, there is so much to be thankful for.', es: 'Sexto día de quimioterapia. Mi cuerpo está cansado, pero los amigos que me escriben cada día y mi esposa, que está a mi lado en silencio, me sostuvieron hoy. Aun en el dolor, hay tanto que agradecer.' } },
    { id: 'pub12', name: { ko: '예준', en: 'Yejun' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 15, shares: 1, saves: 2,
      text: { ko: '시험 끝! 끝까지 같이 공부해 준 친구들 고마워.', en: 'Exams done! Thanks to my friends who studied with me to the end.', es: '¡Terminaron los exámenes! Gracias, amigos, por estudiar conmigo hasta el final.' } },
    { id: 'pub4', name: { ko: '하은', en: 'Haeun' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 12, shares: 3, saves: 5,
      text: { ko: '오늘 마음이 무거웠는데 친구가 먼저 안부를 물어봐 주었어요. 함께할 사람이 있어 감사합니다.', en: 'My heart was heavy, but a friend checked in first. Thank you for people by my side.', es: 'Tenía el corazón pesado, pero un amigo me escribió primero. Gracias por las personas que están a mi lado.' } },
    { id: 'pub13', name: { ko: '은지', en: 'Eunji' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 42, shares: 6, saves: 18, extShares: 2,
      text: { ko: '새벽 세 시에 깬 아기를 안고 창밖을 보다가, 이 작은 숨소리가 얼마나 큰 선물인지 다시 느꼈어요.', en: 'Holding my baby awake at 3 a.m. and looking out the window, I felt again what a great gift this tiny breathing is.', es: 'Con mi bebé despierto a las tres de la mañana, mirando por la ventana, volví a sentir el gran regalo que es esa respiración tan pequeña.' } },
    { id: 'pub14', name: { ko: '상철', en: 'Sangcheol' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 37, shares: 5, saves: 9, extShares: 1,
      text: { ko: '삼십 년 다닌 회사에서 마지막 출근을 했습니다. 함께 일한 동료들, 버틸 힘을 주신 하나님께 감사합니다.', en: 'My last day at the company I worked at for thirty years. Thank you to my colleagues, and to God who gave me the strength to keep going.', es: 'Mi último día en la empresa donde trabajé treinta años. Gracias a mis compañeros, y a Dios, que me dio fuerzas para seguir.' } },
    { id: 'pub15', name: { ko: '소연', en: 'Soyeon' }, scope: 'public', kind: 'today', date: daysAgo(1), likes: 22, shares: 2, saves: 7,
      text: { ko: '비 온 뒤 흙냄새.', en: 'The smell of earth after the rain.', es: 'El olor de la tierra después de la lluvia.' } },
    { id: 'pub3', name: { ko: '지우', en: 'Jiwoo' }, scope: 'public', kind: 'ahead', date: daysAgo(2), likes: 17, shares: 6, saves: 8,
      text: { ko: '하나님, 이번 주 만나는 사람들을 사랑과 인내로 대하게 하심에 감사합니다.', en: 'God, thank you for love and patience with everyone I meet this week.', es: 'Dios, gracias por el amor y la paciencia con cada persona que encuentre esta semana.' } },
    { id: 'pub16', name: { ko: '태호', en: 'Taeho' }, scope: 'public', kind: 'today', date: daysAgo(2), likes: 49, shares: 9, saves: 16, extShares: 3,
      text: { ko: '아버지와 오랜만에 둘이서 낚시를 갔어요. 고기는 한 마리도 못 잡았지만, 아버지가 젊은 시절 이야기를 처음 들려주셨어요. 그 시간이 잡은 고기보다 훨씬 귀했어요.', en: 'I went fishing alone with my dad for the first time in years. We didn’t catch a single fish, but he told me stories from his youth for the first time. That time was worth far more than any catch.', es: 'Fui a pescar a solas con mi papá por primera vez en años. No pescamos nada, pero por primera vez me contó historias de su juventud. Ese tiempo valió mucho más que cualquier pesca.' } },
    { id: 'pub5', name: { ko: '준호', en: 'Junho' }, scope: 'public', kind: 'today', date: daysAgo(2), likes: 9, shares: 1, saves: 2,
      text: { ko: '사소하지만 당연하지 않았던 일. 따뜻한 물로 하루를 시작할 수 있었던 아침에 감사합니다.', en: 'Small, but never a given: thankful for a morning that began with warm water.', es: 'Pequeño, pero nunca obvio: gracias por una mañana que empezó con agua caliente.' } },
    { id: 'pub17', name: { ko: '미영', en: 'Miyoung' }, scope: 'public', kind: 'today', date: daysAgo(2), likes: 33, shares: 4, saves: 10, extShares: 1,
      text: { ko: '가게에 오신 손님이 "덕분에 하루가 따뜻했다"는 쪽지를 남기고 가셨어요. 제가 오히려 감사해요.', en: 'A customer left a note: “You made my day warm.” I’m the one who’s grateful.', es: 'Una clienta dejó una nota: “Gracias a ti mi día fue cálido”. La agradecida soy yo.' } },
    { id: 'pub6', name: { ko: '예린', en: 'Yerin' }, scope: 'public', kind: 'ahead', date: daysAgo(2), likes: 6, shares: 2, saves: 3,
      text: { ko: '하나님, 평범한 하루 가운데서 작은 은혜를 발견하게 하심에 감사합니다.', en: 'God, thank you for small graces in an ordinary day.', es: 'Dios, gracias por las pequeñas gracias en un día común.' } },
    { id: 'pub18', name: { ko: '도윤', en: 'Doyun' }, scope: 'public', kind: 'ahead', date: daysAgo(2), likes: 11, shares: 1, saves: 4,
      text: { ko: '이번 주도 지켜 주실 줄 믿고, 미리 감사합니다.', en: 'Trusting you’ll keep me this week too — thank you in advance.', es: 'Confiando en que me cuidarás esta semana también: gracias de antemano.' } },
    { id: 'gr1', name: { ko: '지은', en: 'Jieun' }, scope: 'group', group: 'g1', kind: 'today', date: daysAgo(0), likes: 8, shares: 1, saves: 2,
      text: { ko: '평범하게 식탁에 앉아 이야기 나눌 수 있었던 저녁이 감사했어요.', en: 'Grateful for a simple evening of talking around the table.', es: 'Agradecida por una cena sencilla conversando alrededor de la mesa.' } },
    { id: 'gr2', name: { ko: '민서', en: 'Minseo' }, scope: 'group', group: 'g1', kind: 'ahead', date: daysAgo(1), likes: 5, shares: 0, saves: 1,
      text: { ko: '하나님, 이번 한 주도 서로를 이해하는 마음을 주심에 감사합니다.', en: 'God, thank you for hearts that understand each other this week.', es: 'Dios, gracias por corazones que se entienden esta semana.' } },
    { id: 'pr1', name: { ko: '지은', en: 'Jieun' }, scope: 'group', group: 'g1', kind: 'prayer', date: daysAgo(0), likes: 0, prayedBy: [{ ko: '민서', en: 'Minseo' }, { ko: '하은', en: 'Haeun' }],
      text: { ko: '이번 주 어머니 수술이 잘 마무리되도록 기도 부탁드려요.', en: 'Please pray that my mom’s surgery this week goes well.', es: 'Por favor, oren para que la cirugía de mi mamá salga bien esta semana.' } },
    { id: 'pr2', name: { ko: '민서', en: 'Minseo' }, scope: 'group', group: 'g1', kind: 'prayer', date: daysAgo(1), likes: 0, prayedBy: [{ ko: '지은', en: 'Jieun' }],
      text: { ko: '새 직장에서 좋은 동료들을 만나게 해 주세요.', en: 'Pray that I find good coworkers at my new job.', es: 'Oren para que encuentre buenos compañeros en mi nuevo trabajo.' } },
    { id: 'gs1', name: { ko: '지은', en: 'Jieun' }, scope: 'group', group: 'g1', kind: 'share', week: 'w', date: daysAgo(1), likes: 3,
      text: { ko: '바쁜 출근길에도 하늘을 올려다보는 여유를 주셔서 감사했어요.', en: 'I was grateful for a moment to look up at the sky on a busy commute.', es: 'Agradecí un momento para mirar el cielo en un trayecto apurado.' } },
    { id: 'gs2', name: { ko: '하은', en: 'Haeun' }, scope: 'group', group: 'g1', kind: 'share', week: 'w', date: daysAgo(0), likes: 2,
      text: { ko: '아이와 함께 저녁 기도를 드릴 수 있었던 순간이요.', en: 'The moment I could pray with my child at dinner.', es: 'El momento en que pude orar con mi hijo en la cena.' } },
    { id: 'mine1', mine: true, scope: 'private', kind: 'today', date: daysAgo(1), likes: 0,
      text: { ko: '오늘도 새롭게 시작할 수 있는 아침을 주셔서 감사합니다.', en: 'Thank you for a morning to begin again today.' } },
    { id: 'mine2', mine: true, scope: 'public', kind: 'today', date: daysAgo(2), likes: 14, shares: 3, saves: 6, extShares: 2,
      text: { ko: '퇴근길에 엄마가 보내 준 사진 한 장에 하루가 따뜻해졌어요. 감사합니다.', en: 'A photo from Mom on my way home warmed my whole day. Thank you.' } },
    { id: 'mine3', mine: true, scope: 'private', kind: 'ahead', date: daysAgo(3), likes: 0,
      text: { ko: '하나님, 이번 주 발표도 평안한 마음으로 하게 하심에 감사합니다.', en: 'God, thank you for giving me a calm heart for this week’s presentation.' } },
    { id: 'mine4', mine: true, scope: 'group', group: 'g1', kind: 'today', date: daysAgo(4), likes: 5, shares: 0, saves: 1,
      text: { ko: '소그룹에서 함께 웃을 수 있어서 감사했어요.', en: 'Grateful we could laugh together in small group.' } },
    { id: 'mine5', mine: true, scope: 'private', kind: 'today', date: daysAgo(5), likes: 0,
      text: { ko: '비 오는 날 우산을 씌워 준 동료에게 감사해요.', en: 'Thankful for the coworker who shared an umbrella in the rain.' } },
    { id: 'mine6', mine: true, scope: 'private', kind: 'today', date: daysAgo(6), likes: 0,
      text: { ko: '천천히 걸으며 본 노을이 참 고마웠어요.', en: 'Grateful for the sunset I saw on a slow walk.' } }
  ],
  liked: [], seen: [], saved: [], hidden: [], blocked: [], reports: [], sharesGiven: 0, extSharesGiven: 0, celebrated: [],
  groups: [{ id: 'g1', name: { ko: '은혜 소그룹', en: 'Grace Group', es: 'Grupo Gracia' } }, { id: 'g2', name: { ko: '우리 가족', en: 'Our Family', es: 'Nuestra familia' } }],
  challenges: [{ id: 'ch1', name: { ko: '함께 발견하는 감사', en: 'Finding Thanks Together', es: 'Encontrando gratitud juntos' }, group: 'g1',
    members: [{ ko: '나', en: 'Me' }, { ko: '지은', en: 'Jieun' }, { ko: '민서', en: 'Minseo' }], start: '2026-11-14', days: [1, 2] }],
  settings: { lang: null, notificationTime: '21:00', notificationEnabled: false, groupUpdates: false, features: { groupShare: false, prayer: false, sermon: false } }, prayed: [], sermons: []
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
if (!data.settings.features) data.settings.features = { groupShare: false, prayer: false, sermon: false };
if (!Array.isArray(data.prayed)) data.prayed = [];
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
let session = null;
try { session = JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { session = null; }
if (session?.lang) data.settings.lang = session.lang;
function setSession(next) {
  session = next;
  try { next ? localStorage.setItem(SESSION_KEY, JSON.stringify(next)) : localStorage.removeItem(SESSION_KEY); } catch {}
  document.dispatchEvent(new CustomEvent('dt:session', { detail: next }));
}
const GATE_AFTER = 5; // posts shown before the "write today's thanks" card and the sign-in card

const state = { tab: 'feed', feed: 'public', group: data.groups[0]?.id, composeKind: 'today', challenge: null, filter: 'all', immersive: true, justWrote: false, composeScope: 'public' }; // posts default to Everyone; switch to Only me any time // immersive: the app opens on a full-screen feed of people's thanks

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
function toast(text) { const el = $('#toast'); el.textContent = text; el.hidden = false; clearTimeout(toast.timer); toast.timer = setTimeout(() => el.hidden = true, 2600); }

/* ---------------- helpers ---------------- */
const groupName = id => id === 'pair' ? t('ch.pairShort') : L(data.groups.find(g => g.id === id)?.name) || id || '';
const authorName = p => p.mine ? t('me') : L(p.name);
const kindLabel = p => p.kind === 'ahead' ? t('kind.ahead') : p.kind === 'thanks' ? t('kind.thanks') : p.kind === 'prayer' ? t('kind.prayer') : p.kind === 'share' ? t('gs.section') : t('kind.today');
const kindIcon = p => p.kind === 'ahead' ? 'sunrise' : p.kind === 'thanks' ? 'send' : p.kind === 'prayer' ? 'pray' : p.kind === 'share' ? 'people' : 'sun';
const scopeLabel = p => p.scope === 'public' ? t('scope.public') : p.scope === 'private' ? t('scope.private') : groupName(p.group) || t('scope.group');
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
  setTimeout(() => sheet.querySelector('textarea, input.field')?.focus(), 30); // only text fields get focus
}
function close() {
  sheet.hidden = true; backdrop.hidden = true; sheet.innerHTML = '';
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
  data.posts.filter(p => p.scope === 'group' && !p.mine && data.groups.some(g => g.id === p.group)).forEach(p => set.add(authorKey(p)));
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
    ${dailyQLine()}
    <textarea id="gate-text" class="card-input" maxlength="1500" rows="3" placeholder="${esc(t('gate.ph'))}"></textarea>
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
    <p class="fine-print">${t('login.demo')}</p></div></article>`;
}
const cardFor = item => item.type === 'compose' ? composeCard() : loginCard();
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
const featureOn = k => !!data.settings.features?.[k];
const visible = p => !p.status && !(p.kind === 'prayer' && !featureOn('prayer')) && p.kind !== 'share' && !data.hidden.includes(p.id) && !data.blocked.includes(authorKey(p)); // 'review' / 'rejected' posts stay off feeds
function feedPosts() {
  return data.posts.filter(visible).filter(p => state.feed === 'public' ? p.scope === 'public' : p.scope === 'group' && p.group === state.group);
}

function postTemplate(p, i, count) {
  const liked = data.liked.includes(p.id), text = L(p.text), name = authorName(p);
  const meta = p.sharedFrom ? t('meta.shared') : (p.kind === 'ahead' ? t('meta.ahead') : t('meta.today'));
  return `<article class="post" data-post="${esc(p.id)}">
    <div class="post-body">
      <div class="post-kind">${icon(kindIcon(p))}<span>${esc(kindLabel(p))}</span></div>
      <p class="post-text ${textClass(text)}">${esc(text)}</p>${readMore(p, text)}
      ${p.reflection ? `<div class="post-reflect">${t('reflect.prefix')} · ${esc(p.reflection)}</div>` : ''}
    </div>
    <aside class="post-rail">
      ${p.kind === 'prayer' ? prayBtn(p) : `<button class="rail-btn ${liked ? 'liked' : ''}" data-action="like" data-id="${esc(p.id)}" aria-pressed="${liked}">${icon('heart')}${countLabel(p, p.likes + (liked ? 1 : 0))}</button>`}
      <button class="rail-btn ${data.saved.includes(p.id) ? 'saved' : ''}" data-action="save-post" data-id="${esc(p.id)}" aria-pressed="${data.saved.includes(p.id)}" aria-label="${t('save')}">${icon('bookmark')}</button>
      <button class="rail-btn" data-action="share" data-id="${esc(p.id)}">${icon('share')}<span>${t('act.share')}</span></button>
      <button class="rail-btn rail-more" data-action="post-menu" data-id="${esc(p.id)}" aria-label="${t('more')}">${icon('more')}</button>
    </aside>
    <footer class="post-foot">
      <div class="post-author"><div><div class="author-name">${esc(name)}${p.sharedFrom ? ' · ' + esc(L(p.sharedFrom)) : ''}</div><div class="author-meta">${esc(meta)} · ${esc(p.date)}${isTop(p) ? ` <span class="top-mark">${icon('sparkle')}${t('top.badge')}</span>` : ''}</div></div></div>
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
        : feedSequence(rankedOnce('public', posts)).map(it => it.type === 'post' ? postTemplate(it.p, rankedOnce('public', posts).indexOf(it.p), posts.length) : cardFor(it)).join(''))
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
    ${featureOn('groupShare') ? groupShareSection() : ''}
    ${featureOn('prayer') ? prayerSection() : ''}
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
    ${influenceCard()}
    ${memoryCard()}
    ${calendarCard()}
    <div class="seg seg-page">${[['all', t('j.all')], ['today', t('kind.today')], ['ahead', t('kind.aheadShort')], ['saved', t('j.saved')]].map(([k, label]) => `<button class="${state.filter === k ? 'active' : ''}" data-action="journal-filter" data-id="${k}">${label}</button>`).join('')}</div>
    ${mine.length ? `<div class="notes">${mine.map(p => `<button class="note" data-action="${savedView ? 'post-menu' : 'note'}" data-id="${esc(p.id)}">
      <span class="note-meta">${icon(kindIcon(p))}<span>${savedView ? esc(authorName(p)) + ' · ' : ''}${esc(kindLabel(p))}</span><span class="dot">·</span><span>${esc(p.date)}</span>${p.status ? `<span class="badge ${p.status}">${t(p.status === 'review' ? 'mod.review' : 'mod.rejected')}</span>` : ''}<span class="note-scope">${icon(scopeIcon(p))}</span></span>
      ${p.kind === 'thanks' ? `<span class="note-to">Thank you, ${esc(p.to)}</span>` : ''}<span class="note-text">${esc(L(p.text))}</span>
      ${p.reflection ? `<span class="note-reflect">${t('reflect.prefix')} · ${esc(p.reflection)}</span>` : ''}
    </button>`).join('')}</div>`
      : savedView ? `<div class="empty-state">${icon('bookmark')}<p>${t('j.savedEmpty')}</p></div>`
      : `<div class="empty-state">${icon('pencil')}<p>${t('j.empty')}</p><button class="primary" data-action="compose">${t('top.write')}</button></div>`}
    ${featureOn('sermon') ? sermonSection() : ''}
    <div id="slot-journal"></div>
  </div></div>`;
}

/* Full-screen feed: only the gratitude text, with ♡ count, share and close on the right. */
function renderImmersive(keepIndex = 0) {
  const pool = data.posts.filter(p => !p.mine && visible(p) && (p.scope === 'public' || (p.scope === 'group' && data.groups.some(g => g.id === p.group))));
  const posts = rankedOnce('imm', pool);
  main.innerHTML = `<div class="feed-scroll imm-scroll" id="feed-scroll">${feedSequence(posts).map(it => {
    if (it.type !== 'post') return cardFor(it);
    const p = it.p, liked = data.liked.includes(p.id), text = L(p.text);
    return `<article class="post imm" data-post="${esc(p.id)}">
      <div class="post-body"><p class="post-text ${textClass(text)}">${esc(text)}</p>${readMore(p, text)}
        <p class="imm-by">${esc(L(p.name))} · ${p.scope === 'group' ? esc(groupName(p.group)) : esc(kindLabel(p))}${isTop(p) ? ` <span class="top-mark">${icon('sparkle')}${t('top.badge')}</span>` : ''}</p></div>
      <aside class="post-rail">
        <button class="rail-btn ${liked ? 'liked' : ''}" data-action="like" data-id="${esc(p.id)}" aria-pressed="${liked}">${icon('heart')}${countLabel(p, p.likes + (liked ? 1 : 0))}</button>
        <button class="rail-btn ${data.saved.includes(p.id) ? 'saved' : ''}" data-action="save-post" data-id="${esc(p.id)}" aria-pressed="${data.saved.includes(p.id)}" aria-label="${t('save')}">${icon('bookmark')}</button>
      <button class="rail-btn" data-action="share" data-id="${esc(p.id)}">${icon('share')}<span>${t('act.share')}</span></button>
      <button class="rail-btn rail-more" data-action="post-menu" data-id="${esc(p.id)}" aria-label="${t('more')}">${icon('more')}</button>
        <button class="rail-btn" data-action="fullscreen" aria-label="${t('fs.closeAria')}">${icon('minimize')}<span>${t('fs.close')}</span></button>
      </aside></article>`;
  }).join('')}</div>
  <div class="imm-brand" aria-hidden="true"><span class="wordmark">daily <em>thanks</em></span></div>
  <button class="imm-lang" data-action="lang-menu" aria-label="${t('aria.lang')}">${icon('globe')}<span>${LANGS.find(x => x[0] === lang())[1]}</span></button>
  ${showNudge() ? `<div class="imm-nudge" id="imm-nudge" aria-hidden="true">${icon('down')}<span>${t('nudge')}</span></div>` : ''}`;
  const sc = $('#feed-scroll');
  if (keepIndex && sc) sc.scrollTop = keepIndex * sc.clientHeight;
  bindGateForm();
  if (sc && $('#imm-nudge')) sc.addEventListener('scroll', hideNudge, { passive: true });
  trackSeen();
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
  if (state.immersive) { renderImmersive(keepIndex); requestAnimationFrame(markClamped); document.dispatchEvent(new CustomEvent('dt:render', { detail: { tab: 'immersive' } })); return; }
  document.querySelectorAll('[data-tab]').forEach(b => {
    const on = b.dataset.tab === state.tab;
    b.classList.toggle('active', on);
    on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current');
  });
  ({ feed: () => renderFeed(keepIndex), group: renderGroups, challenges: renderChallenges, journal: renderJournal })[state.tab]();
  document.dispatchEvent(new CustomEvent('dt:render', { detail: { tab: state.tab } }));
  requestAnimationFrame(markClamped);
}

/* ---------------- visibility: Everyone | Private (→ Only me or one of my groups) ---------------- */
const visOf = key => { state.vis = state.vis || {}; return state.vis[key] = state.vis[key] || { mode: 'public', target: 'me' }; };
function visPicker(key) {
  const v = visOf(key);
  return `<div class="vis" data-vis="${key}">
    <div class="seg">${[['public', t('vis.public'), 'globe'], ['private', t('vis.private'), 'lock']].map(([m, label, ic]) => `<button type="button" class="${v.mode === m ? 'active' : ''}" data-action="vis-mode" data-id="${key}|${m}">${icon(ic)}<span>${label}</span></button>`).join('')}</div>
    <div class="chips vis-targets" ${v.mode === 'private' ? '' : 'hidden'}>${[['me', t('vis.me'), 'lock'], ...data.groups.map(g => [g.id, L(g.name), 'people'])].map(([id, label, ic]) => `<button type="button" class="chip ${v.target === id ? 'active' : ''}" data-action="vis-target" data-id="${key}|${esc(id)}">${icon(ic)}${esc(label)}</button>`).join('')}</div>
    <p class="hint vis-note">${v.mode === 'public' ? t('compose.publicNote') : t('vis.privateHint')}</p>
  </div>`;
}
// → { scope: 'public' } | { scope: 'private' } | { scope: 'group', group }
function visScope(key) {
  const v = visOf(key);
  if (v.mode === 'public') return { scope: 'public' };
  if (v.target === 'me' || !data.groups.some(g => g.id === v.target)) return { scope: 'private' };
  return { scope: 'group', group: v.target };
}
function updateVis(key) {
  const box = document.querySelector(`[data-vis="${key}"]`); if (!box) return;
  const v = visOf(key);
  box.querySelectorAll('[data-action="vis-mode"]').forEach(b => b.classList.toggle('active', b.dataset.id.endsWith('|' + v.mode)));
  box.querySelectorAll('[data-action="vis-target"]').forEach(b => b.classList.toggle('active', b.dataset.id === key + '|' + v.target));
  box.querySelector('.vis-targets').hidden = v.mode !== 'private';
  box.querySelector('.vis-note').textContent = v.mode === 'public' ? t('compose.publicNote') : t('vis.privateHint');
}

/* ---------------- sheets ---------------- */
const seg = (items, action, current, extra = '') => `<div class="seg ${extra}">${items.map(([id, label, ic]) => `<button type="button" class="${current === id ? 'active' : ''}" data-action="${action}" data-id="${id}">${ic ? icon(ic) : ''}<span>${label}</span></button>`).join('')}</div>`;

function compose(kind = state.composeKind, chId = state.challenge, keepText = '') {
  state.composeKind = kind; state.challenge = chId;
  state.sheetScope = state.sheetScope || 'public';
  state.sheetGroup = state.sheetGroup || data.groups[0]?.id;
  const ahead = kind === 'ahead';
  const kinds = seg([['today', t('kind.today'), 'sun'], ['ahead', t('kind.aheadShort'), 'sunrise'], ['thanks', t('kind.thanks'), 'send'], ...(featureOn('prayer') ? [['prayer', t('kind.prayer'), 'pray']] : [])], 'pick-kind', kind, 'seg-kinds' + (featureOn('prayer') ? ' four' : ''));
  if (kind === 'prayer' && !state.prayerScopeSet) { Object.assign(visOf('compose'), { mode: 'private', target: data.groups[0]?.id || 'me' }); state.prayerScopeSet = true; }
  if (kind === 'thanks') {
    showSheet({ title: t('compose.title'), body: `<form id="compose-form" class="sheet-form">${kinds}${thanksForm({ text: keepText, name: state.tyName })}</form>` });
    $('#compose-form').addEventListener('submit', e => {
      e.preventDefault();
      const to = $('#ty-name').value.trim(), text = $('#gratitude-text').value.trim();
      if (!to) { toast(t('ty.needName')); $('#ty-name').focus(); return; }
      if (!text) { $('#gratitude-text').focus(); return; }
      const p = { id: 'p' + Date.now(), mine: true, scope: 'private', kind: 'thanks', to, text, date: today(), likes: 0 };
      data.posts.unshift(p); state.tyName = ''; save(); render(); thanksCard(p.id);
    });
    return;
  }
  showSheet({ title: t('compose.title'), body: `<form id="compose-form" class="sheet-form">
    ${kinds}
    ${ahead || kind === 'prayer' ? '' : dailyQLine()}
    <textarea id="gratitude-text" class="big-input" maxlength="1500" rows="4" placeholder="${esc(ahead ? t('compose.phAhead') : kind === 'prayer' ? t('pr.ph') : t('compose.qToday'))}" aria-label="${esc(ahead ? t('compose.qAhead') : t('compose.qToday'))}">${esc(keepText)}</textarea>
    ${ahead ? `<div class="chips">${['work', 'relationship', 'everyday'].map(k => `<button type="button" class="chip" data-action="sample" data-id="${k}">${t('sample.' + k)}</button>`).join('')}</div>` : ''}
    <p class="field-label">${t('compose.who')}</p>
    ${visPicker('compose')}
    <button class="primary block" type="submit">${t('compose.submit')}</button>
  </form>` });
  $('#compose-form').addEventListener('submit', e => {
    e.preventDefault();
    const text = $('#gratitude-text').value.trim(); if (!text) { $('#gratitude-text').focus(); return; }
    const kind = state.composeKind;
    const vis = visScope('compose');
    const post = (v = vis) => ({ id: 'p' + Date.now(), mine: true, ...v, kind, text, date: today(), likes: 0 });
    if (!passesFilter(text, vis.scope, (choice, terms) => {
      if (choice === 'edit') return compose(kind, state.challenge, text);
      if (choice === 'private') { data.posts.unshift(post({ scope: 'private' })); return finishCompose(t('toast.saved')); }
      const p = post(); requestReview(p, terms); data.posts.unshift(p); finishCompose(t('mod.appealed'));
    })) return;
    data.posts.unshift(post());
    finishCompose(t('toast.saved'));
  });
}
function finishCompose(message) {
  if (state.challenge) {
    const ch = data.challenges.find(c => c.id === state.challenge);
    const next = ch && Math.min(ch.days.length + 1, 7);
    if (ch && !ch.days.includes(next)) ch.days.push(next);
  }
  state.challenge = null;
  save(); close(); state.immersive = false; state.tab = 'journal'; render(); cheer(message);
}

function noteSheet(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  if (p.kind === 'thanks') return thanksCard(id);
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
  x.fillStyle = '#FCFCFA'; x.fillRect(0, 0, W, H);
  // faint warm light in the corner, very subtle
  const g = x.createRadialGradient(W * .82, H * .12, 0, W * .82, H * .12, W * .7); g.addColorStop(0, 'rgba(255,233,170,.10)'); g.addColorStop(1, 'rgba(255,233,170,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  // wordmark
  x.fillStyle = '#9BA0A3'; x.textBaseline = 'alphabetic';
  x.font = `400 40px ${serif}`; x.fillText('daily', M, M + 30);
  const dw = x.measureText('daily ').width; x.font = `italic 400 40px ${serif}`; x.fillText('thanks', M + dw, M + 30);
  // body: shrink until it fits
  const text = L(p.kind === 'thanks' ? `Thank you, ${p.to}\n\n${L(p.text)}` : p.text);
  const maxH = H * (kind === 'story' ? .52 : .50);
  let size = kind === 'story' ? 64 : 58, lines, lh;
  for (; size >= 34; size -= 2) { x.font = `300 ${size}px ${sans}`; lines = wrapLines(x, text, maxW); lh = size * 1.72; if (lines.length * lh <= maxH) break; }
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
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: 'Daily Thanks' }); countShare(id, external); return; }
  } catch { return; }
  toast(t('card.noShare'));
}

function share(id) {
  const p = data.posts.find(x => x.id === id); if (!p) return;
  state.cardKind = state.cardKind || 'feed';
  showSheet({ title: t('share.title'), body: `<div class="card-frame"><img id="card-img" alt="" class="card-img"></div>
    <div class="seg card-seg">${[['feed', t('card.feed')], ['story', t('card.story')]].map(([k, label]) => `<button type="button" class="${state.cardKind === k ? 'active' : ''}" data-action="card-kind" data-id="${esc(id)}|${k}"><span>${label}</span></button>`).join('')}</div>
    <div class="list">
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

function widget() { return widgetGuide(true); }
function widgetOld() {
  const ch = data.challenges[0];
  showSheet({ title: t('w.title'), body: `<div class="widget-surface">
    <div class="widget-card"><h3>${icon('sun')}${t('w.today')}</h3><div class="question">${t('w.q')}</div><button class="primary block" data-action="compose">${t('w.write')}</button></div>
    ${ch ? `<div class="widget-card"><h3>${icon('people')}${esc(groupName(ch.group))}</h3>${dayRow(ch)}</div>` : ''}
    </div><p class="hint">${t('w.desc')}</p>` });
}

function settings() {
  const row = (action, ic, title, end = icon('chevron'), cls = '') => `<button class="list-row ${cls}" data-action="${action}"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${title}</span></span><span class="row-end">${end}</span></button>`;
  showSheet({ title: t('s.title'), body: `
    ${seg(LANGS, 'set-lang', lang())}
    <p class="field-label">${t('size.title')}</p>
    ${seg([['s', t('size.s')], ['m', t('size.m')], ['l', t('size.l')]], 'set-size', data.settings.textSize || 'm', 'seg-size')}
    <div class="list">
      ${session
        ? row('logout', 'user', `${t('s.account')} · ${esc(methodName(session.method))}${session.phone ? ' ' + esc(session.phone) : ''}`, `<span class="row-link">${t('acct.logout')}</span>`)
        : `<div class="list-row static"><span class="row-icon">${icon('user')}</span><span class="row-main"><span class="row-title">${t('s.account')}</span></span><span class="row-end row-sub">${t('s.guest')}</span></div>`}
      ${row(data.settings.notificationEnabled ? 'notification' : 'notify-prime', 'bell', t('s.notify'), `<span class="row-sub">${esc(data.settings.notificationTime)}</span>${icon('chevron')}`)}
      ${row('blocked', 'eyeOff', t('s.blocked'))}
      ${row('widget', 'phone', t('s.widget'))}
      ${row('fullscreen', 'maximize', t('fs.enter'))}
      ${row('export', 'copy', t('s.export'), '')}
      ${row('reset', 'reset', t('s.reset'), '', 'danger')}
    </div>
    <p class="field-label">${t('ft.title')}</p>
    <div class="list">${[['groupShare', 'people'], ['prayer', 'pray'], ['sermon', 'mic']].map(([k, ic]) => `<label class="list-row"><span class="row-icon">${icon(ic)}</span><span class="row-main"><span class="row-title">${t('ft.' + k)}</span><span class="row-sub">${t('ft.' + k + 'Sub')}</span></span><input class="switch" type="checkbox" data-feature="${k}" ${featureOn(k) ? 'checked' : ''}></label>`).join('')}</div>
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
function passesFilter(text, scope, onDecision) {
  if (scope === 'private') return true;
  const terms = flaggedTerms(text);
  if (!terms.length) return true;
  showSheet({ title: t('mod.title'), body: `<p class="page-desc" style="margin:0">${t('mod.body')}</p>
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
const dailyQ = () => { const list = DAILY_Q[lang()] || DAILY_Q.en; return list[dayOfYear() % list.length]; };
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
const countLabel = (p, n) => p.mine ? `<span>${n}</span>` : '';
function prayBtn(p) {
  const on = data.prayed.includes(p.id), n = (p.prayedBy || []).length + (on ? 1 : 0);
  return `<button class="rail-btn ${on ? 'prayed' : ''}" data-action="pray" data-id="${esc(p.id)}" aria-pressed="${on}" aria-label="${t('pr.prayed')}">${icon('pray')}${countLabel(p, n)}</button>`;
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
    <textarea id="gs-text" class="big-input" rows="4" maxlength="1000" placeholder="${esc(t('gs.ph'))}"></textarea>
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
    <textarea id="sm-text" class="big-input" rows="3" placeholder="${esc(t('sm.paste'))}"></textarea>
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
const NOTIFY_TIMES = [['dawn', '06:00', 'sunrise'], ['morning', '08:00', 'sun'], ['evening', '21:00', 'moon']];
function notifyPrime() {
  data.settings.notifyAsked = data.settings.notifyAsked || today(); save(); // asked once, even if closed with ✕
  if (!data.settings.widgetAsked) state.pendingWidget = true;              // the widget guide follows when this closes
  state.primeTime = state.primeTime || 'evening';
  const tile = ([id, time, ic]) => `<button type="button" class="time-tile ${state.primeTime === id ? 'active' : ''}" data-action="prime-time" data-id="${id}">${icon(ic)}<strong>${t('np.' + id)}</strong><span>${time.replace(/^0/, '')}</span><small>${t('np.' + id + 'Sub')}</small></button>`;
  showSheet({ title: '', body: `<div class="prime">
    <div class="cel-mark">${icon('bell')}</div>
    <p class="prime-title">${t('np.title')}</p>${t('np.sub') ? `<p class="prime-sub">${t('np.sub')}</p>` : ''}
    <ul class="prime-reasons"><li>${icon('sun')}${t('np.r1')}</li><li>${icon('check')}${t('np.r2')}</li><li>${icon('people')}${t('np.r3')}</li></ul>
    <p class="field-label">${t('np.when')}</p>
    <div class="time-tiles">${NOTIFY_TIMES.map(tile).join('')}</div>
    <label class="prime-other">${t('np.other')}<input id="prime-custom" class="time-input" type="time" value="${esc(data.settings.notificationTime)}"></label>
    <button class="primary block" data-action="prime-allow">${icon('bell')}${t('np.allow')}</button>
    <button class="subtle-link" data-action="prime-later">${t('np.later')}</button></div>` });
  $('#prime-custom').addEventListener('change', () => { state.primeTime = 'custom'; document.querySelectorAll('.time-tile').forEach(b => b.classList.remove('active')); });
}
async function primeAllow() {
  const chosen = NOTIFY_TIMES.find(x => x[0] === state.primeTime);
  const time = chosen ? chosen[1] : ($('#prime-custom')?.value || '21:00');
  Object.assign(data.settings, { notificationEnabled: true, notificationTime: time, notifyAsked: today() });
  save(); close();
  let granted = false;
  try {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      granted = res === 'granted';
      if (granted) new Notification('Daily Thanks', { body: t('np.test') });
    }
  } catch { /* some embedded viewers block the permission request; the preference is still saved */ }
  toast((granted || !('Notification' in window) ? t('np.on') : t('np.blocked')).replace('{time}', time));
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
// The home-screen widget, kept very simple: today's question and one button that opens the writing sheet.
function widgetPreview() {
  const done = wroteToday();
  return `<div class="hw-stage">
    <div class="hw hw-small"><span class="hw-mark">daily <em>thanks</em></span><span class="hw-q">${done ? t('wg.done') : esc(dailyQ())}</span><span class="hw-btn">${icon(done ? 'check' : 'plus')}${done ? '' : t('wg.write')}</span></div>
    <div class="hw hw-medium"><span class="hw-mark">daily <em>thanks</em></span><span class="hw-q">${esc(dailyQ())}</span>
      <span class="hw-row"><span class="mini-dots">${weekDots().map(on => `<i class="${on ? 'on' : ''}"></i>`).join('')}</span><span class="hw-btn">${icon('plus')}${t('wg.write')}</span></span></div>
  </div>`;
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
    <textarea id="gratitude-text" class="big-input" maxlength="800" rows="4" placeholder="${esc(t('ty.ph'))}" aria-label="${esc(t('ty.ph'))}">${esc(keep.text || '')}</textarea>
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
    </div>` });
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
  setSession({ method, since: new Date().toISOString(), lang: lang(), ...extra });
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
const methodName = m => ({ apple: 'Apple', google: 'Google', phone: lang() === 'ko' ? '휴대폰' : 'Phone' })[m] || m;

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
  home: () => { state.tab = 'feed'; state.feed = 'public'; render(); },
  'feed-public': () => { state.feed = 'public'; renderFeed(); },
  'feed-group': () => { state.feed = 'group'; renderFeed(); },
  challenges: () => { close(); state.tab = 'challenges'; render(); },
  next: () => { const sc = $('#feed-scroll'); sc?.scrollBy({ top: sc.clientHeight, behavior: 'smooth' }); },
  settings, notification: notifications, widget, close,
  'toggle-lang': () => setLang(lang() === 'ko' ? 'en' : 'ko'),
  'set-lang': id => setLang(id),
  like, share, 'send-group': sendToGroup, reflect,
  'pick-kind': id => { state.tyName = $('#ty-name')?.value || state.tyName; compose(id, state.challenge, $('#gratitude-text')?.value || ''); },
  'vis-mode': pair => { const [key, m] = pair.split('|'); visOf(key).mode = m; updateVis(key); },
  'vis-target': pair => { const [key, id] = pair.split('|'); visOf(key).target = id; updateVis(key); },
  'pick-scope': id => {
    state.sheetScope = id;
    document.querySelectorAll('[data-action="pick-scope"]').forEach(b => b.classList.toggle('active', b.dataset.id === id));
    $('#group-chips').hidden = id !== 'group'; $('#public-note').hidden = id !== 'public';
  },
  'pick-group': id => { state.sheetGroup = id; document.querySelectorAll('[data-action="pick-group"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  'pick-with': id => { state.sheetWith = id; document.querySelectorAll('[data-action="pick-with"]').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  note: noteSheet,
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
  'prime-time': id => { state.primeTime = id; document.querySelectorAll('.time-tile').forEach(b => b.classList.toggle('active', b.dataset.id === id)); },
  'prime-allow': primeAllow,
  'prime-later': () => { data.settings.notifyAsked = today(); save(); close(); toast(t('np.laterToast')); },
  'cal-day': dayNotes,
  recap,
  'recap-share': () => { const text = recapText(); if (navigator.share) navigator.share({ title: 'Daily Thanks', text }).catch(() => {}); else copyText(text); },
  'share-kakao': id => {
    // Native app: Kakao SDK "feed" template with the card image. Prototype: system share sheet (KakaoTalk is listed there).
    const p = data.posts.find(x => x.id === id); if (!p) return;
    const text = `${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks`;
    if (navigator.share) navigator.share({ title: 'Daily Thanks', text }).then(() => countShare(id, true)).catch(() => {});
    else { countShare(id, true); copyText(text); }
  },
  'card-kind': pair => { const [id, k] = pair.split('|'); state.cardKind = k; document.querySelectorAll('[data-action="card-kind"]').forEach(b => b.classList.toggle('active', b.dataset.id === pair)); showCardPreview(id); },
  'share-image': id => shareImage(id),
  'share-insta-img': id => shareImage(id, true),
  'share-insta': id => {
    // Native app: Instagram Stories sharing (instagram-stories:// with a rendered card image). Prototype: share sheet, or copy.
    const p = data.posts.find(x => x.id === id); if (!p) return;
    const text = `${L(p.text)}\n\n— Daily Thanks`;
    if (navigator.share) navigator.share({ title: 'Daily Thanks', text }).then(() => countShare(id, true)).catch(() => {});
    else { countShare(id, true); navigator.clipboard?.writeText(text).catch(() => {}); toast(t('share.copied')); }
  },
  influence: influenceSheet,
  'cel-share': () => { if (navigator.share) navigator.share({ title: 'Daily Thanks', text: t('cel.shareText') }).catch(() => {}); else copyText(t('cel.shareText')); },
  'ty-copy': id => { const p = data.posts.find(x => x.id === id); if (p) copyText(thanksText(p)); },
  'ty-send': id => {
    const p = data.posts.find(x => x.id === id); if (!p) return;
    if (navigator.share) navigator.share({ title: 'Thank you', text: thanksText(p) }).then(() => { close(); cheer(t('ty.saved')); }).catch(() => {});
    else { copyText(thanksText(p)); }
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
    data.posts.unshift({ ...clone(p), id: 'repost' + Date.now(), scope: 'group', group: g, mine: false, name: p.mine ? { ko: '나', en: 'Me' } : p.name, sharedFrom: { ko: '공유', en: 'shared' }, likes: 0 });
    save(); close(); state.immersive = false; state.tab = 'feed'; state.feed = 'group'; state.group = g; render(); toast(t('toast.sent'));
  },
  sample: id => { const ta = $('#gratitude-text'); ta.value = SAMPLES[lang()][id]; ta.focus(); },
  'journal-filter': id => { state.filter = id; renderJournal(); },
  delete: id => confirmSheet(t('j.delete'), t('j.confirmDelete'), t('j.delete'), () => { data.posts = data.posts.filter(p => p.id !== id); save(); render(); }),
  'copy-share': id => { const p = data.posts.find(x => x.id === id); if (p) { countShare(id); copyText(`${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks`); } },
  'native-share': id => {
    const p = data.posts.find(x => x.id === id);
    if (navigator.share && p) navigator.share({ title: 'Daily Thanks', text: `${L(p.text)}\n\n— ${authorName(p)} · Daily Thanks` }).then(() => countShare(id)).catch(() => {});
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
  const cut = e.target.closest('.post-text[data-cut="1"]');
  if (cut) { const id = cut.closest('[data-post]')?.dataset.post; if (id) { actions['read-more'](id); return; } }
  const tab = e.target.closest('[data-tab]');
  if (tab) { state.tab = tab.dataset.tab; if (state.tab === 'feed') state.feed = 'public'; close(); render(); return; }
  const b = e.target.closest('[data-action]');
  if (b && b.tagName !== 'SELECT') actions[b.dataset.action]?.(b.dataset.id);
});
document.addEventListener('change', e => {
  const f = e.target.dataset?.feature;
  if (f) {
    data.settings.features[f] = e.target.checked; save(); render();
    toast(t(e.target.checked ? 'ft.on' : 'ft.off').replace('{name}', t('ft.' + f)));
    return;
  }
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
applyTextSize();
render();
// Widget / notification deep link: daily-thanks://write → #write opens the writing sheet straight away.
if (location.hash === '#write') { document.getElementById('splash')?.remove(); setTimeout(() => compose('today', null), 50); }

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
  // 1) wordmark  2) "Give thanks daily. Live fully. Share the joy."  3) feed
  setTimeout(() => { if (!gone) splash.classList.add('step2'); }, 1400);
  setTimeout(hide, 4200);
}
})();
