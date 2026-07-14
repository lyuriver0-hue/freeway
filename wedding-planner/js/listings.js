// 웨딩닷컴 업체 더미 데이터 — 메인페이지 카드 + 상세페이지가 공용으로 사용
// LISTINGS[type][id] 형태로 조회 (type: hall | studio | dress | makeup)

const LISTINGS = {
  hall: [
    { name: "라마다신도림호텔", loc: "서울 구로구", views: 162, tags: ["BEST"], price: "예식비 문의", emoji: "🏨",
      desc: "도심 접근성이 뛰어난 호텔 웨딩홀로, 넉넉한 주차 공간과 품격 있는 연회장을 갖추고 있습니다.",
      capacity: "최대 300명", style: "호텔 웨딩",
      priceTable: [{ item: "대관료", price: "2,000,000원" }, { item: "식대(1인)", price: "68,000원~" }, { item: "주차", price: "무료 200대" }] },
    { name: "아펠가모 반포", loc: "서울 서초구", views: 208, tags: ["인기", "BEST"], price: "1,800,000원~", emoji: "🏛️",
      desc: "채광이 아름다운 홀로 자연광 웨딩 사진을 선호하는 신랑신부에게 인기가 높습니다.",
      capacity: "최대 250명", style: "채플 웨딩",
      priceTable: [{ item: "대관료", price: "1,800,000원" }, { item: "식대(1인)", price: "75,000원~" }, { item: "폐백실", price: "300,000원" }] },
    { name: "더링크호텔", loc: "서울 강남구", views: 127, tags: ["BEST"], price: "2,200,000원~", emoji: "🏨",
      desc: "강남 중심가에 위치한 프리미엄 호텔 웨딩홀로 고급스러운 인테리어가 특징입니다.",
      capacity: "최대 280명", style: "호텔 웨딩",
      priceTable: [{ item: "대관료", price: "2,200,000원" }, { item: "식대(1인)", price: "88,000원~" }, { item: "주차", price: "무료 150대" }] },
    { name: "라브르에드니아", loc: "서울 강남구", views: 160, tags: ["BEST", "추천"], price: "2,500,000원~", emoji: "🏛️",
      desc: "유럽풍 인테리어와 대형 샹들리에가 인상적인 프리미엄 웨딩홀입니다.",
      capacity: "최대 320명", style: "컨벤션 웨딩",
      priceTable: [{ item: "대관료", price: "2,500,000원" }, { item: "식대(1인)", price: "82,000원~" }, { item: "웨딩카 서비스", price: "무료" }] },
    { name: "빌라드지디 수서", loc: "서울 강남구", views: 143, tags: ["BEST"], price: "1,950,000원~", emoji: "🏛️",
      desc: "가든 테라스가 있는 세미 야외형 웨딩홀로 사계절 다른 분위기를 연출할 수 있습니다.",
      capacity: "최대 200명", style: "가든 웨딩",
      priceTable: [{ item: "대관료", price: "1,950,000원" }, { item: "식대(1인)", price: "78,000원~" }, { item: "테라스 이용료", price: "포함" }] },
    { name: "더채플앳 논현", loc: "서울 강남구", views: 157, tags: ["인기", "BEST"], price: "2,100,000원~", emoji: "⛪",
      desc: "높은 층고와 스테인드글라스가 아름다운 채플형 웨딩홀입니다.",
      capacity: "최대 220명", style: "채플 웨딩",
      priceTable: [{ item: "대관료", price: "2,100,000원" }, { item: "식대(1인)", price: "80,000원~" }, { item: "부케 서비스", price: "무료" }] },
    { name: "더컨벤션 반포", loc: "서울 서초구", views: 129, tags: ["BEST"], price: "1,700,000원~", emoji: "🏛️",
      desc: "넓은 로비와 다목적 홀을 갖춘 컨벤션형 웨딩홀로 대규모 하객 초대에 적합합니다.",
      capacity: "최대 350명", style: "컨벤션 웨딩",
      priceTable: [{ item: "대관료", price: "1,700,000원" }, { item: "식대(1인)", price: "70,000원~" }, { item: "주차", price: "무료 250대" }] },
    { name: "L65호텔웨딩컨벤션", loc: "서울 영등포구", views: 88, tags: ["인기", "BEST"], price: "1,600,000원~", emoji: "🏨",
      desc: "한강뷰가 보이는 호텔 웨딩컨벤션으로 야경 웨딩 촬영이 인기입니다.",
      capacity: "최대 260명", style: "호텔 웨딩",
      priceTable: [{ item: "대관료", price: "1,600,000원" }, { item: "식대(1인)", price: "72,000원~" }, { item: "한강뷰 라운지", price: "300,000원" }] },
  ],
  studio: [
    { name: "아르센", loc: "서울 강남구", price: "990,000원~", emoji: "📸",
      desc: "자연광을 활용한 인생샷 전문 스튜디오로, 편안한 분위기의 촬영을 지향합니다.",
      capacity: "촬영 2~3시간", style: "내추럴 촬영",
      priceTable: [{ item: "베이직 패키지", price: "990,000원" }, { item: "프리미엄 패키지", price: "1,450,000원" }, { item: "원본파일 전체", price: "300,000원" }] },
    { name: "온뜰에피움", loc: "서울 강남구", price: "1,200,000원~", emoji: "📸",
      desc: "필름 감성의 톤앤매너로 유명한 스튜디오, 야외 세트장도 함께 운영합니다.",
      capacity: "촬영 3시간", style: "필름 감성",
      priceTable: [{ item: "베이직 패키지", price: "1,200,000원" }, { item: "야외 세트 추가", price: "400,000원" }, { item: "원본파일 전체", price: "350,000원" }] },
    { name: "르안스튜디오", loc: "서울 강남구", price: "850,000원~", emoji: "📸",
      desc: "클래식하고 정갈한 스타일의 웨딩 스냅으로 부모님 세대에게도 인기입니다.",
      capacity: "촬영 2시간", style: "클래식",
      priceTable: [{ item: "베이직 패키지", price: "850,000원" }, { item: "액자 앨범 추가", price: "250,000원" }, { item: "원본파일 전체", price: "280,000원" }] },
    { name: "섬스튜디오", loc: "경기 하남시", price: "1,050,000원~", emoji: "📸",
      desc: "미사리 조정경기장 인근 대형 스튜디오, 다양한 세트 콘셉트를 보유하고 있습니다.",
      capacity: "촬영 3시간", style: "컨셉 촬영",
      priceTable: [{ item: "베이직 패키지", price: "1,050,000원" }, { item: "세트 추가 1개", price: "150,000원" }, { item: "원본파일 전체", price: "320,000원" }] },
  ],
  dress: [
    { name: "하우스오브에이미", loc: "서울 강남구", price: "1,550,000원~", emoji: "👗",
      desc: "유럽 수입 드레스를 다수 보유한 프리미엄 드레스샵입니다.",
      capacity: "피팅 2회 포함", style: "수입 드레스",
      priceTable: [{ item: "본식 드레스", price: "1,550,000원" }, { item: "촬영 드레스 추가", price: "600,000원" }, { item: "피팅 추가", price: "50,000원/회" }] },
    { name: "모리엠포티", loc: "서울 강남구", price: "1,500,000원~", emoji: "👗",
      desc: "미니멀하고 세련된 실루엣의 드레스로 인스타 감성 신부들에게 인기입니다.",
      capacity: "피팅 2회 포함", style: "미니멀",
      priceTable: [{ item: "본식 드레스", price: "1,500,000원" }, { item: "촬영 드레스 추가", price: "550,000원" }, { item: "베일/장갑 세트", price: "100,000원" }] },
    { name: "클라라웨딩", loc: "서울 강남구", price: "2,050,000원~", emoji: "👗",
      desc: "볼륨감 있는 실루엣과 화려한 디테일이 특징인 드레스샵입니다.",
      capacity: "피팅 3회 포함", style: "볼륨 드레스",
      priceTable: [{ item: "본식 드레스", price: "2,050,000원" }, { item: "촬영 드레스 추가", price: "700,000원" }, { item: "피팅 추가", price: "50,000원/회" }] },
    { name: "제시카로렌", loc: "서울 강남구", price: "1,700,000원~", emoji: "👗",
      desc: "레이스 디테일이 돋보이는 클래식 라인의 드레스를 전문으로 합니다.",
      capacity: "피팅 2회 포함", style: "레이스 클래식",
      priceTable: [{ item: "본식 드레스", price: "1,700,000원" }, { item: "촬영 드레스 추가", price: "620,000원" }, { item: "베일/장갑 세트", price: "120,000원" }] },
  ],
  makeup: [
    { name: "청담 이유", loc: "서울 강남구", price: "920,000원~", emoji: "💄",
      desc: "자연스러운 광채 피부 표현으로 유명한 청담동 대표 헤어메이크업샵입니다.",
      capacity: "헤어+메이크업", style: "내추럴 글로우",
      priceTable: [{ item: "본식 메이크업", price: "920,000원" }, { item: "리허설 촬영 추가", price: "350,000원" }, { item: "어머님 메이크업", price: "250,000원" }] },
    { name: "비올", loc: "서울 강남구", price: "780,000원~", emoji: "💄",
      desc: "트렌디한 헤어 스타일링과 깔끔한 메이크업을 선호하는 신부에게 추천합니다.",
      capacity: "헤어+메이크업", style: "트렌디",
      priceTable: [{ item: "본식 메이크업", price: "780,000원" }, { item: "리허설 촬영 추가", price: "300,000원" }, { item: "어머님 메이크업", price: "220,000원" }] },
    { name: "라포엠", loc: "서울 서초구", price: "850,000원~", emoji: "💄",
      desc: "화사하고 우아한 신부 화장으로 정평이 난 서초 지역 대표 샵입니다.",
      capacity: "헤어+메이크업", style: "우아한 글램",
      priceTable: [{ item: "본식 메이크업", price: "850,000원" }, { item: "리허설 촬영 추가", price: "320,000원" }, { item: "어머님 메이크업", price: "230,000원" }] },
    { name: "스와니예", loc: "서울 강남구", price: "1,100,000원~", emoji: "💄",
      desc: "셀럽 웨딩 다수 진행 경력의 실장님이 직접 담당하는 프리미엄 샵입니다.",
      capacity: "헤어+메이크업", style: "프리미엄 글램",
      priceTable: [{ item: "본식 메이크업", price: "1,100,000원" }, { item: "리허설 촬영 추가", price: "400,000원" }, { item: "어머님 메이크업", price: "280,000원" }] },
  ],
  suit: [
    { name: "예작맨스웨어", loc: "서울 강남구", price: "1,200,000원~", emoji: "🤵",
      desc: "이탈리아 원단을 사용한 맞춤 예복 전문 브랜드입니다.",
      capacity: "가봉 2회 포함", style: "클래식 슈트",
      priceTable: [{ item: "예복 대여", price: "1,200,000원" }, { item: "맞춤 제작", price: "2,500,000원" }, { item: "셔츠·타이 세트", price: "150,000원" }] },
    { name: "브라이덜수트 청담", loc: "서울 강남구", price: "980,000원~", emoji: "🤵",
      desc: "슬림핏 실루엣이 강점인 청담동 예복 전문샵입니다.",
      capacity: "가봉 2회 포함", style: "슬림핏",
      priceTable: [{ item: "예복 대여", price: "980,000원" }, { item: "맞춤 제작", price: "2,100,000원" }, { item: "구두 대여", price: "80,000원" }] },
    { name: "젠틀맨스박스", loc: "서울 서초구", price: "890,000원~", emoji: "🤵",
      desc: "톤온톤 스타일링으로 신랑 예복부터 혼주 한복까지 함께 준비할 수 있습니다.",
      capacity: "가봉 1회 포함", style: "모던 클래식",
      priceTable: [{ item: "예복 대여", price: "890,000원" }, { item: "맞춤 제작", price: "1,900,000원" }, { item: "넥타이 세트", price: "90,000원" }] },
    { name: "슈트클래스 강남", loc: "서울 강남구", price: "1,050,000원~", emoji: "🤵",
      desc: "체형별 맞춤 코칭으로 신랑의 첫 슈트 피팅을 편안하게 도와드립니다.",
      capacity: "가봉 2회 포함", style: "테일러드",
      priceTable: [{ item: "예복 대여", price: "1,050,000원" }, { item: "맞춤 제작", price: "2,300,000원" }, { item: "구두+벨트 세트", price: "120,000원" }] },
  ],
  jewelry: [
    { name: "루이델라 주얼리", loc: "서울 강남구", price: "1,800,000원~", emoji: "💍",
      desc: "다이아몬드 감정서가 포함된 커플링 전문 주얼리 브랜드입니다.",
      capacity: "커플링 세트", style: "클래식 다이아",
      priceTable: [{ item: "커플링 세트", price: "1,800,000원" }, { item: "각인 서비스", price: "무료" }, { item: "사이즈 조정", price: "무료 1회" }] },
    { name: "다이아본느", loc: "서울 강남구", price: "1,450,000원~", emoji: "💍",
      desc: "합리적인 가격대의 4C 등급 다이아몬드 예물을 제안합니다.",
      capacity: "커플링 세트", style: "미니멀",
      priceTable: [{ item: "커플링 세트", price: "1,450,000원" }, { item: "목걸이 세트 추가", price: "600,000원" }, { item: "각인 서비스", price: "무료" }] },
    { name: "이든주얼리", loc: "서울 서초구", price: "2,100,000원~", emoji: "💍",
      desc: "1:1 맞춤 디자인 상담으로 세상에 하나뿐인 반지를 제작합니다.",
      capacity: "맞춤 디자인", style: "커스텀 디자인",
      priceTable: [{ item: "커플링 세트", price: "2,100,000원" }, { item: "디자인 상담", price: "무료" }, { item: "사이즈 조정", price: "무료 2회" }] },
    { name: "골든아워 주얼리", loc: "경기 하남시", price: "1,250,000원~", emoji: "💍",
      desc: "화이트골드·로즈골드 등 다양한 소재로 부담 없는 예물을 준비할 수 있습니다.",
      capacity: "커플링 세트", style: "데일리 심플",
      priceTable: [{ item: "커플링 세트", price: "1,250,000원" }, { item: "각인 서비스", price: "무료" }, { item: "보증서 발급", price: "무료" }] },
  ],
};

const LISTING_TYPE_LABEL = { hall: "웨딩홀", studio: "스튜디오", dress: "드레스", makeup: "메이크업", suit: "예복", jewelry: "예물" };

const REVIEW_POOL = [
  { name: "김민지", stars: 5, txt: "정말 만족스러운 진행이었어요! 담당자분이 친절하게 설명해주셔서 편했습니다." },
  { name: "이수현", stars: 5, txt: "결과물이 기대 이상이었어요. 주변에도 추천하고 싶습니다." },
  { name: "박서준", stars: 4, txt: "전반적으로 좋았는데 예약이 조금 빡빡했어요. 그래도 만족합니다." },
  { name: "최유리", stars: 5, txt: "가격 대비 퀄리티가 훌륭했습니다. 다시 이용하고 싶어요." },
  { name: "정하은", stars: 4, txt: "친절하고 꼼꼼하게 상담해주셔서 좋았어요." },
];

const TAG_CLASS = { "BEST": "tag-best", "인기": "tag-hot", "추천": "tag-pick" };

function getListing(type, id) {
  const list = LISTINGS[type];
  if (!list) return null;
  return list[id] || null;
}

// 전체 카테고리를 하나의 배열로 펼침 — 카테고리 필터 페이지에서 사용
function getAllListings() {
  return Object.keys(LISTINGS).flatMap((type) => LISTINGS[type].map((item, id) => ({ type, id, ...item })));
}

// "1,800,000원~" 같은 가격 문자열에서 정렬/필터용 숫자를 추출. "예식비 문의"처럼 숫자가 없으면 null.
function getPriceValue(price) {
  const digits = (price || "").replace(/[^0-9]/g, "");
  return digits ? Number(digits) : null;
}

function renderListingCard(type, id, item) {
  const tagsHtml = item.tags ? `<div class="venue-tags">${item.tags.map((t) => `<span class="${TAG_CLASS[t] || "tag-best"}">${t}</span>`).join("")}</div>` : "";
  const metaRight = item.views !== undefined
    ? `<span>조회수 ${item.views}</span><span class="venue-price">${item.price}</span>`
    : `<span class="venue-price">${item.price}</span>`;
  return `
    <a class="venue-card" href="detail.html?type=${type}&id=${id}">
      <div class="venue-thumb">${tagsHtml}${item.emoji}</div>
      <div class="venue-body">
        <div class="venue-loc">${item.loc}</div>
        <div class="venue-name">${item.name}</div>
        <div class="venue-meta">${metaRight}</div>
      </div>
    </a>`;
}
