/* =========================================================
   FREEWAY mock data & shared state (localStorage backed)
========================================================= */
const FREEWAY_CATEGORIES = [
  {id:'design', name:'디자인', emoji:'🎨', desc:'로고 · 브랜딩 · 상세페이지 · UX/UI'},
  {id:'dev', name:'IT·프로그래밍', emoji:'💻', desc:'웹 · 앱 · 프로그램 개발'},
  {id:'video', name:'영상·사진·음향', emoji:'🎬', desc:'영상편집 · 촬영 · 사운드'},
  {id:'marketing', name:'마케팅', emoji:'📈', desc:'SNS · 광고 · 콘텐츠'},
  {id:'doc', name:'번역·통역', emoji:'🌐', desc:'영어 · 중국어 · 일본어 번역'},
  {id:'biz', name:'세무·법무·노무', emoji:'📋', desc:'세무 · 법률자문 · 노무'},
  {id:'ai', name:'AI 서비스', emoji:'🤖', desc:'AI 챗봇 · 업무자동화 · AI 콘텐츠'},
  {id:'ebook', name:'전자책', emoji:'📚', desc:'전자책 제작 · 출판 대행'},
  {id:'custom', name:'주문제작', emoji:'🎁', desc:'수제품 · 인쇄 · 굿즈 제작'},
  {id:'edu', name:'취업·입시', emoji:'🎓', desc:'자소서 · 면접 · 포트폴리오 첨삭'},
  {id:'sidejob', name:'투잡·노하우', emoji:'💡', desc:'부업 · 창업 · 재테크 노하우'},
  {id:'lesson', name:'직무역량 레슨', emoji:'🧑‍🏫', desc:'오피스 · 자격증 · 실무 강의'},
  {id:'fortune', name:'운세', emoji:'🔮', desc:'사주 · 타로 · 궁합'},
  {id:'counsel', name:'심리상담', emoji:'💬', desc:'심리상담 · 연애상담 · 고민상담'},
  {id:'hobby', name:'취미 레슨', emoji:'🎸', desc:'악기 · 운동 · 원데이클래스'},
  {id:'life', name:'생활서비스', emoji:'🏠', desc:'이사 · 청소 · 인테리어'},
];

const FREEWAY_FREELANCERS = [
  {id:'f1', name:'김수현', role:'브랜드 디자이너', career:'7년차', rating:4.9, reviews:312, response:'평균 2시간 이내', verified:true, category:'design', tags:['로고디자인','브랜딩','패키지'], price:350000, avatar:'김', bio:'스타트업부터 대기업까지 200건 이상의 브랜드 아이덴티티를 설계한 브랜드 디자이너입니다.',
    dealCount:340, dealAmount:119000000, repurchaseRate:42, responseRate:98, responseSpeedHours:2, lastActiveDaysAgo:0, joinedDaysAgo:900},
  {id:'f2', name:'박지훈', role:'풀스택 개발자', career:'5년차', rating:4.8, reviews:204, response:'평균 3시간 이내', verified:true, category:'dev', tags:['웹개발','쇼핑몰','API연동'], price:2000000, avatar:'박', bio:'Next.js/Node 기반 커머스, SaaS 서비스를 다수 구축한 풀스택 개발자입니다.',
    dealCount:220, dealAmount:340000000, repurchaseRate:55, responseRate:95, responseSpeedHours:3, lastActiveDaysAgo:1, joinedDaysAgo:650},
  {id:'f3', name:'이하늘', role:'퍼포먼스 마케터', career:'4년차', rating:4.9, reviews:156, response:'평균 1시간 이내', verified:true, category:'marketing', tags:['SNS운영','광고대행','콘텐츠기획'], price:600000, avatar:'이', bio:'월 예산 5천만원 이상 광고 계정을 운영해온 퍼포먼스 마케팅 전문가입니다.',
    dealCount:410, dealAmount:246000000, repurchaseRate:61, responseRate:99, responseSpeedHours:1, lastActiveDaysAgo:0, joinedDaysAgo:520},
  {id:'f4', name:'정민주', role:'전문 번역가', career:'9년차', rating:5.0, reviews:98, response:'평균 4시간 이내', verified:true, category:'doc', tags:['영한번역','계약서번역','현지화'], price:150000, avatar:'정', bio:'IT/법률 전문 영한·한영 번역 9년 경력, 법무법인 상시 협업 중입니다.',
    dealCount:105, dealAmount:15750000, repurchaseRate:38, responseRate:90, responseSpeedHours:4, lastActiveDaysAgo:2, joinedDaysAgo:1200},
  {id:'f5', name:'최다인', role:'영상 편집자', career:'6년차', rating:4.7, reviews:134, response:'평균 5시간 이내', verified:false, category:'video', tags:['유튜브편집','모션그래픽','컬러보정'], price:250000, avatar:'최', bio:'구독자 10만+ 채널 다수와 협업한 영상 편집/모션그래픽 전문가입니다.',
    dealCount:96, dealAmount:24000000, repurchaseRate:30, responseRate:80, responseSpeedHours:5, lastActiveDaysAgo:3, joinedDaysAgo:780},
  {id:'f6', name:'한소영', role:'세무 컨설턴트', career:'11년차', rating:4.9, reviews:87, response:'평균 6시간 이내', verified:true, category:'biz', tags:['법인세무','기장대행','노무자문'], price:200000, avatar:'한', bio:'중소기업 전문 세무사, 스타트업 초기 세팅부터 정기 기장까지 지원합니다.',
    dealCount:130, dealAmount:26000000, repurchaseRate:70, responseRate:92, responseSpeedHours:6, lastActiveDaysAgo:1, joinedDaysAgo:1500},
  {id:'f7', name:'윤서준', role:'AI 자동화 전문가', career:'3년차', rating:4.8, reviews:64, response:'평균 2시간 이내', verified:true, category:'ai', tags:['AI챗봇','업무자동화','ChatGPT연동'], price:400000, avatar:'윤', bio:'생성형 AI를 활용한 업무 자동화, 커스텀 챗봇 구축을 전문으로 합니다.',
    dealCount:58, dealAmount:23200000, repurchaseRate:45, responseRate:96, responseSpeedHours:2, lastActiveDaysAgo:0, joinedDaysAgo:60},
  {id:'f8', name:'강지연', role:'사주·타로 상담가', career:'8년차', rating:4.9, reviews:271, response:'평균 30분 이내', verified:false, category:'fortune', tags:['사주풀이','타로','궁합'], price:30000, avatar:'강', bio:'8년간 5,000건 이상 상담을 진행한 사주·타로 전문 상담가입니다.',
    dealCount:610, dealAmount:18300000, repurchaseRate:65, responseRate:99, responseSpeedHours:0.5, lastActiveDaysAgo:0, joinedDaysAgo:30},
];

/* =========================================================
   전문가 정렬 필터 (크몽 고객센터 "서비스 정렬 기준" 안내 참고)
   https://kmong.com/support/customer-center/posts/126
   - 모든 기준은 상위노출 광고 적용 여부를 최우선으로 반영
   - 실제 가중치는 비공개이므로, 각 기준이 설명하는 요소들을
     우선순위 순으로 비교하는 방식으로 근사 구현함
========================================================= */
const FREEWAY_SORT_OPTIONS = [
  {id:'recommend', label:'추천순'},
  {id:'popular', label:'인기순'},
  {id:'rating', label:'평점순'},
  {id:'response', label:'응답순'},
  {id:'newest', label:'신규등록순'},
];

function sortFreelancers(list, mode){
  const cmp = {
    // 거래 완료 건수·금액, 리뷰 건수·평가 점수를 종합 평가
    popular:(a,b)=> (b.dealCount-a.dealCount) || (b.dealAmount-a.dealAmount) || (b.reviews-a.reviews) || (b.rating-a.rating),
    // 거래 완료 금액, 고객 평가, 구매/재구매율, 응답률을 종합 평가
    recommend:(a,b)=> (b.dealAmount-a.dealAmount) || (b.rating-a.rating) || (b.repurchaseRate-a.repurchaseRate) || (b.responseRate-a.responseRate),
    // 의뢰인 평가 점수 순
    rating:(a,b)=> (b.rating-a.rating) || (b.reviews-a.reviews),
    // 응답률, 평균 응답 속도, 최근 로그인(활동) 순
    response:(a,b)=> (b.responseRate-a.responseRate) || (a.responseSpeedHours-b.responseSpeedHours) || (a.lastActiveDaysAgo-b.lastActiveDaysAgo),
    // 서비스(전문가) 등록 시점이 최신인 순
    newest:(a,b)=> (a.joinedDaysAgo-b.joinedDaysAgo),
  }[mode] || (()=>0);

  return list.slice().sort((a,b)=>{
    // 모든 필터 공통: 상위노출 광고 적용 여부가 최우선
    const aBoost = FreewayStore.isBoosted(a.id) ? 1 : 0;
    const bBoost = FreewayStore.isBoosted(b.id) ? 1 : 0;
    if(aBoost !== bBoost) return bBoost - aBoost;
    return cmp(a,b);
  });
}

const FREEWAY_BOOST_PLANS = [
  {id:'d1', days:1, price:15000, label:'상위노출 1일'},
  {id:'d7', days:7, price:90000, label:'상위노출 7일', badge:'인기'},
  {id:'d30', days:30, price:250000, label:'상위노출 30일', badge:'최대할인'},
];

const FREEWAY_SERVICES = [
  {id:'s1', title:'스타트업을 위한 브랜드 로고 & 아이덴티티 디자인', category:'design', catName:'디자인', freelancerId:'f1', price:350000, rating:4.9, reviews:312, thumb:'🎨'},
  {id:'s2', title:'반응형 쇼핑몰 웹사이트 풀스택 개발', category:'dev', catName:'IT·프로그래밍', freelancerId:'f2', price:2000000, rating:4.8, reviews:204, thumb:'💻'},
  {id:'s3', title:'인스타그램·틱톡 SNS 운영 대행 (월 단위)', category:'marketing', catName:'마케팅', freelancerId:'f3', price:600000, rating:4.9, reviews:156, thumb:'📱'},
  {id:'s4', title:'계약서·기술문서 전문 영한 번역', category:'doc', catName:'번역·통역', freelancerId:'f4', price:150000, rating:5.0, reviews:98, thumb:'📄'},
  {id:'s5', title:'유튜브 롱폼/숏폼 영상 편집 및 자막', category:'video', catName:'영상·사진·음향', freelancerId:'f5', price:250000, rating:4.7, reviews:134, thumb:'🎬'},
  {id:'s6', title:'법인 설립부터 기장까지 세무 컨설팅', category:'biz', catName:'세무·법무·노무', freelancerId:'f6', price:200000, rating:4.9, reviews:87, thumb:'📋'},
  {id:'s7', title:'모바일 앱 UI/UX 디자인 풀패키지', category:'design', catName:'디자인', freelancerId:'f1', price:800000, rating:4.8, reviews:145, thumb:'📱'},
  {id:'s8', title:'React Native 하이브리드 앱 개발', category:'dev', catName:'IT·프로그래밍', freelancerId:'f2', price:3500000, rating:4.7, reviews:76, thumb:'📲'},
  {id:'s9', title:'카카오톡 챗봇 제작 및 업무 자동화', category:'ai', catName:'AI 서비스', freelancerId:'f7', price:400000, rating:4.8, reviews:64, thumb:'🤖'},
  {id:'s10', title:'정통 사주풀이 & 신년운세 상담', category:'fortune', catName:'운세', freelancerId:'f8', price:30000, rating:4.9, reviews:271, thumb:'🔮'},
];

const FREEWAY_REVIEWS = [
  {name:'㈜스토어이든 대표', role:'소상공인 · 상세페이지 제작', rating:5, text:'직접 채용하면 한 달 넘게 걸릴 일을 일주일 만에 해결했어요. 가격도 미리 비교할 수 있어서 예산 잡기가 편했습니다.'},
  {name:'김수현', role:'프리랜서 디자이너', rating:5, text:'표준계약서 덕분에 처음 거래하는 클라이언트와도 안심하고 진행했어요. 안전결제라 대금 문제 걱정도 없었습니다.'},
  {name:'노스필드 스타트업', role:'기업 · 개발·마케팅 동시 진행', rating:5, text:'비핵심 업무를 외주로 돌리고 나니 팀이 핵심 제품 개발에만 집중할 수 있게 됐습니다.'},
];

const FREEWAY_NOTICES = [
  {id:'n1', tag:'공지', title:'프리웨이 안전결제 시스템 정기 점검 안내 (7/10)', date:'2026-07-05', views:1284, body:'안녕하세요, 프리웨이입니다. 보다 안정적인 서비스 제공을 위해 안전결제 시스템 정기 점검을 진행합니다. 점검 시간 동안 결제 및 정산 기능 이용이 제한될 수 있는 점 양해 부탁드립니다.'},
  {id:'n2', tag:'이벤트', title:'신규 가입 시 안전결제 수수료 50% 할인 이벤트', date:'2026-07-01', views:3021, body:'프리웨이에 신규 가입하신 모든 회원님께 첫 거래 안전결제 수수료를 50% 할인해드리는 이벤트를 진행합니다. 기간 내 프로젝트를 등록하고 혜택을 받아보세요.'},
  {id:'n3', tag:'공지', title:'표준계약서 템플릿 3종 추가 업데이트', date:'2026-06-20', views:842, body:'디자인, 개발, 마케팅 분야에 특화된 표준계약서 템플릿이 추가되었습니다. 마이페이지 > 계약관리에서 확인하실 수 있습니다.'},
  {id:'n4', tag:'공지', title:'개인정보처리방침 개정 안내', date:'2026-06-10', views:511, body:'개인정보처리방침이 일부 개정되어 안내드립니다. 자세한 내용은 정책안내 페이지를 확인해주세요.'},
];

const FREEWAY_FAQS = [
  {q:'안전결제(에스크로)는 어떻게 진행되나요?', a:'클라이언트가 결제한 금액은 프리웨이가 예치하고, 작업물 검수 완료 후 전문가에게 정산됩니다. 작업 미완료·분쟁 시에는 고객센터를 통해 중재를 요청할 수 있습니다.'},
  {q:'표준계약서는 꼭 작성해야 하나요?', a:'필수는 아니지만, 분쟁 예방과 양측 권리 보호를 위해 모든 거래에 표준계약서 작성을 권장하고 있습니다. 계약서는 견적 수락 시 자동으로 생성됩니다.'},
  {q:'수수료는 어떻게 되나요?', a:'클라이언트는 결제금액의 3%, 전문가는 정산금액의 8~15%(등급별 차등)의 플랫폼 이용 수수료가 부과됩니다.'},
  {q:'전문가 등급(인증)은 어떻게 부여되나요?', a:'사업자등록증 인증, 경력증명, 자격증 등록, 누적 리뷰·평점을 기준으로 신뢰등급이 자동 산정됩니다.'},
  {q:'환불은 어떻게 요청하나요?', a:'작업 시작 전에는 전액 환불이 가능하며, 작업 진행 중 분쟁 발생 시 고객센터 중재 절차를 통해 부분/전액 환불이 진행될 수 있습니다.'},
];

const FREEWAY_COMMUNITY_POSTS = [
  {id:'c1', cat:'꿀팁공유', title:'프리랜서 첫 견적서 작성할 때 꿀팁 공유합니다', author:'디자이너K', date:'2026-07-03', views:412, likes:34, comments:12, body:'견적서를 작성할 때는 작업 범위, 수정 횟수, 납기일을 명확히 적는 게 가장 중요합니다. 특히 수정 횟수를 미리 못박아두지 않으면 무한 수정 요청에 시달릴 수 있어요. 저는 보통 "2차 수정까지 무료, 이후 회당 추가 비용" 식으로 명시합니다.'},
  {id:'c2', cat:'질문답변', title:'안전결제 정산까지 보통 며칠 걸리나요?', author:'초보의뢰인', date:'2026-07-02', views:203, likes:9, comments:5, body:'구매확정 후 영업일 기준 2~3일 이내에 등록하신 계좌로 정산됩니다. 주말/공휴일이 낀 경우 다음 영업일에 처리되니 참고해주세요.'},
  {id:'c3', cat:'공지', title:'커뮤니티 이용 가이드라인 안내', author:'프리웨이팀', date:'2026-06-28', views:891, likes:52, comments:1, body:'프리웨이 커뮤니티는 프리랜서와 클라이언트 모두가 자유롭게 정보를 나누는 공간입니다. 광고성 게시물, 타인 비방, 개인정보 노출 게시물은 사전 통보 없이 삭제될 수 있습니다. 즐거운 커뮤니티 문화를 함께 만들어주세요.'},
  {id:'c4', cat:'질문답변', title:'표준계약서 특약사항 추가하고 싶은데 가능한가요?', author:'스타트업대표', date:'2026-06-25', views:156, likes:14, comments:8, body:'네, 가능합니다. 프로젝트 등록 시 계약서 작성 단계에서 "특약사항" 항목에 원하시는 조건을 자유롭게 추가하실 수 있어요. 다만 관련 법령에 위배되는 조항은 자동으로 안내 문구가 표시됩니다.'},
  {id:'c5', cat:'자유게시판', title:'다들 재택근무 할 때 하루 루틴 어떻게 짜세요?', author:'프리한영수', date:'2026-07-08', views:328, likes:21, comments:6, body:'혼자 일하다 보니 자꾸 늘어지네요. 오전에 딱 정해놓고 시작하는 루틴 있으신 분 계시면 공유 부탁드려요.'},
  {id:'c6', cat:'자유게시판', title:'오늘 첫 정산 받았습니다 다들 화이팅해요', author:'신입프리랜서', date:'2026-07-06', views:245, likes:38, comments:9, body:'프리웨이로 첫 프로젝트 마무리하고 정산까지 받았네요. 별거 아닌데 괜히 뿌듯해서 자랑하고 갑니다. 다들 화이팅하세요!'},
  {id:'c7', cat:'자유게시판', title:'작업할 때 듣는 플레이리스트 공유해요', author:'디자이너K', date:'2026-07-04', views:189, likes:16, comments:4, body:'집중 안 될 때 로파이 채널 틀어놓고 작업하는데 은근 도움 돼요. 다들 작업용 플레이리스트 있으면 댓글로 알려주세요.'},
];

const FREEWAY_PROJECTS = [
  {id:'pj1', title:'브랜드 로고 리뉴얼', category:'design', catName:'디자인·브랜딩', budget:450000, deadline:'2026-07-20', status:'progress', progress:65, freelancerId:'f1', client:'㈜스토어이든'},
  {id:'pj2', title:'쇼핑몰 웹사이트 개발', category:'dev', catName:'IT·개발', budget:3200000, deadline:'2026-08-10', status:'progress', progress:30, freelancerId:'f2', client:'노스필드'},
  {id:'pj3', title:'SNS 마케팅 대행 (7월)', category:'marketing', catName:'마케팅', budget:800000, deadline:'2026-07-31', status:'done', progress:100, freelancerId:'f3', client:'그린테이블'},
];

const FREEWAY_QUOTES = [
  {id:'q1', projectId:'pj1', freelancerId:'f1', amount:420000, days:7, message:'브랜드 컨셉에 맞춰 3종 시안을 제안드립니다.', status:'pending'},
  {id:'q2', projectId:'pj1', freelancerId:'f5', amount:390000, days:10, message:'합리적인 가격으로 빠르게 작업 가능합니다.', status:'pending'},
  {id:'q3', projectId:'pj2', freelancerId:'f2', amount:3100000, days:30, message:'Next.js 기반으로 SEO 최적화까지 함께 진행합니다.', status:'accepted'},
];

/* ---------- localStorage-backed state helpers ---------- */
const FreewayStore = {
  _get(key, def){
    try{ const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }catch(e){ return def; }
  },
  _set(key, val){ localStorage.setItem(key, JSON.stringify(val)); },

  getFavorites(){ return this._get('freeway_favorites', []); },
  toggleFavorite(id){
    const favs = this.getFavorites();
    const idx = favs.indexOf(id);
    if(idx>-1) favs.splice(idx,1); else favs.push(id);
    this._set('freeway_favorites', favs);
    return favs.includes(id);
  },
  isFavorite(id){ return this.getFavorites().includes(id); },

  getUser(){ return this._get('freeway_user', null); },
  setUser(user){ this._set('freeway_user', user); },
  logout(){ localStorage.removeItem('freeway_user'); },

  /* ---- 서비스 상위노출(Boost) ---- */
  getBoosts(){ return this._get('freeway_boosts', {}); },
  setBoost(serviceId, days){
    const boosts = this.getBoosts();
    boosts[serviceId] = Date.now() + days*24*60*60*1000;
    this._set('freeway_boosts', boosts);
  },
  cancelBoost(serviceId){
    const boosts = this.getBoosts();
    delete boosts[serviceId];
    this._set('freeway_boosts', boosts);
  },
  isBoosted(serviceId){
    const exp = this.getBoosts()[serviceId];
    return !!exp && exp > Date.now();
  },
  getBoostRemainingDays(serviceId){
    const exp = this.getBoosts()[serviceId];
    if(!exp || exp <= Date.now()) return 0;
    return Math.max(1, Math.ceil((exp - Date.now()) / (24*60*60*1000)));
  },

  getBoostHistory(){ return this._get('freeway_boost_history', []); },
  addBoostHistory(entry){
    const list = this.getBoostHistory();
    list.unshift(entry);
    this._set('freeway_boost_history', list);
  },

  /* ---- 커뮤니티: 좋아요 ---- */
  getLikedPosts(){ return this._get('freeway_liked_posts', []); },
  toggleLike(postId){
    const liked = this.getLikedPosts();
    const idx = liked.indexOf(postId);
    if(idx>-1) liked.splice(idx,1); else liked.push(postId);
    this._set('freeway_liked_posts', liked);
    return liked.includes(postId);
  },
  isLiked(postId){ return this.getLikedPosts().includes(postId); },

  /* ---- 커뮤니티: 댓글 ---- */
  getComments(postId){
    const all = this._get('freeway_comments', {});
    return all[postId] || [];
  },
  addComment(postId, body){
    const all = this._get('freeway_comments', {});
    if(!all[postId]) all[postId] = [];
    const user = this.getUser();
    const comment = {id:'cm'+Date.now(), author: user ? user.name : '익명', date: new Date().toISOString().slice(0,10), body};
    all[postId].push(comment);
    this._set('freeway_comments', all);
    return comment;
  },

  /* ---- 커뮤니티: 조회수 (브라우저당 게시물별 1회만 반영) ---- */
  getExtraViews(){ return this._get('freeway_extra_views', {}); },
  addView(postId){
    const viewed = this._get('freeway_viewed_posts', []);
    if(viewed.includes(postId)) return false;
    viewed.push(postId);
    this._set('freeway_viewed_posts', viewed);
    const extra = this.getExtraViews();
    extra[postId] = (extra[postId]||0) + 1;
    this._set('freeway_extra_views', extra);
    return true;
  },

  toast(msg){
    let el = document.getElementById('freeway-toast');
    if(!el){
      el = document.createElement('div');
      el.id = 'freeway-toast';
      el.className = 'toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(()=>el.classList.remove('show'), 2200);
  }
};
