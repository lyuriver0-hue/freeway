// 웨딩닷컴 공용 스토어 — localStorage 기반 로그인 상태 + 토스트 + 사업자등록번호 검증
// 프로토타입 목적의 클라이언트 전용 모의(mock) 인증입니다. 실제 서비스에서는 서버 인증 및
// 국세청 사업자등록정보 진위확인 API(공공데이터포털) 연동이 필요합니다.

const WeddingStore = {
  KEY: "weddingcom_user",
  ACCOUNTS_KEY: "weddingcom_accounts",
  setUser(user) {
    localStorage.setItem(this.KEY, JSON.stringify(user));
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY));
    } catch (e) {
      return null;
    }
  },
  logout() {
    localStorage.removeItem(this.KEY);
  },
  toast(msg) {
    let t = document.getElementById("wc-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "wc-toast";
      t.className = "wc-toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  },
  // 회원가입 시 저장된 계정 정보 레지스트리 (이메일 기준) — 로그인 시 여기서 조회해
  // 기존에 입력한 이름/사업자번호/지역 등 프로필이 로그인할 때 유실되지 않도록 한다.
  getAccounts() {
    try {
      return JSON.parse(localStorage.getItem(this.ACCOUNTS_KEY)) || {};
    } catch (e) {
      return {};
    }
  },
  saveAccount(user) {
    if (!user || !user.email) return;
    const accounts = this.getAccounts();
    accounts[user.email] = user;
    localStorage.setItem(this.ACCOUNTS_KEY, JSON.stringify(accounts));
  },
  findAccount(identifier) {
    if (!identifier) return null;
    const accounts = this.getAccounts();
    if (accounts[identifier]) return accounts[identifier];
    return Object.values(accounts).find((a) => a.bizNo === identifier) || null;
  },
};

// 리스팅(type, id)에 자신을 연결한 기업 계정 조회 — 연결되어 있으면 그 계정이 업로드한
// 실제 사진·웹사이트를 상세페이지/카드 썸네일 등 고객이 보는 화면에 노출할 수 있다.
// 카테고리(hall/studio/dress/...)에 상관없이 항상 동일하게 동작한다.
function findLinkedBusinessAccount(type, id) {
  const accounts = WeddingStore.getAccounts();
  return Object.values(accounts).find(
    (a) => a.type === "business" && a.linkedListing && a.linkedListing.type === type && a.linkedListing.id === id
  ) || null;
}

// ---------- 기업회원 월 회비(멤버십) ----------
// 업체가 상세페이지·카드에 실제 사진·웹사이트를 노출하려면 매달 회비를 내야 한다.
// 가입 후 첫 달은 무료로 노출되고, 그 이후부터는 결제해야 노출이 유지된다.
// 회비 금액은 관리자 콘솔(admin-settings.html)에서만 변경할 수 있다.
const MEMBERSHIP_FEE_KEY = "weddingcom_membership_fee";
const DEFAULT_MEMBERSHIP_FEE = 19900;

function getMembershipFee() {
  const raw = localStorage.getItem(MEMBERSHIP_FEE_KEY);
  const n = Number(raw);
  return raw && !Number.isNaN(n) ? n : DEFAULT_MEMBERSHIP_FEE;
}
function setMembershipFee(amount) {
  localStorage.setItem(MEMBERSHIP_FEE_KEY, String(amount));
}

function addMonths(dateStr, months) {
  const d = new Date(dateStr);
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

// 업체 계정의 멤버십 상태 계산: joinedAt(가입일) 기준 첫 달은 trial(무료),
// 이후엔 membershipPaidUntil이 오늘 이후여야 active. 둘 다 아니면 expired.
function getMembershipStatus(account) {
  const today = new Date().toISOString().slice(0, 10);
  const joinedAt = (account && account.joinedAt) || today;
  const trialEndsAt = addMonths(joinedAt, 1);
  const paidUntil = (account && account.membershipPaidUntil) || null;
  if (paidUntil && paidUntil >= today) {
    return { status: "active", trialEndsAt, paidUntil };
  }
  if (today <= trialEndsAt) {
    return { status: "trial", trialEndsAt, paidUntil };
  }
  return { status: "expired", trialEndsAt, paidUntil };
}

// 상세페이지·카드에 실제 사진/웹사이트를 노출해도 되는 상태인지 (체험중 또는 정상 결제중)
function isMembershipExposed(account) {
  return !!account && getMembershipStatus(account).status !== "expired";
}

// 월 회비 결제(모의 처리) — 체험 기간이 남았으면 체험 종료일부터, 이미 결제한 기간이 있으면
// 그 다음날부터, 둘 다 없으면 오늘부터 1개월을 연장한다.
function payMembershipFee(email) {
  const accounts = WeddingStore.getAccounts();
  const account = accounts[email];
  if (!account) return null;
  const today = new Date().toISOString().slice(0, 10);
  const status = getMembershipStatus(account);
  const base = status.status === "active" ? status.paidUntil : status.status === "trial" ? status.trialEndsAt : today;
  account.membershipPaidUntil = addMonths(base, 1);
  account.membershipLastPaidAt = today;
  account.membershipLastPaidAmount = getMembershipFee();
  WeddingStore.saveAccount(account);
  const current = WeddingStore.getUser();
  if (current && current.email === email) WeddingStore.setUser(account);
  return account;
}

// 사업자등록번호 체크섬 검증 (국세청 공개 알고리즘)
function validateBizRegNo(raw) {
  const d = (raw || "").replace(/[^0-9]/g, "");
  if (d.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(d[i]) * weights[i];
  sum += Math.floor((Number(d[8]) * 5) / 10);
  const check = (10 - (sum % 10)) % 10;
  return check === Number(d[9]);
}

function formatBizRegNo(raw) {
  const d = (raw || "").replace(/[^0-9]/g, "").slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
}

// "www.mystudio.com" 처럼 프로토콜 없이 입력된 URL에 https://를 붙여준다.
function normalizeUrl(raw) {
  const trimmed = (raw || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

// ---------- 상담 신청 / 견적 문의 ----------
// 상세페이지·박람회 상세페이지의 신청 폼 제출을 실제로 저장해, 마이페이지의
// 견적함·예약 일정 탭이 이 데이터를 그대로 조회해서 보여준다.
const INQUIRIES_KEY = "weddingcom_inquiries";
function getInquiries() {
  try {
    return JSON.parse(localStorage.getItem(INQUIRIES_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveInquiry(inquiry) {
  const list = getInquiries();
  list.push({
    id: Date.now(),
    status: "wait",
    createdAt: new Date().toISOString().slice(0, 10),
    ...inquiry,
  });
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
}
// 예약(상담 신청)에 대한 계약금 결제를 모의 처리 — 결제내역 탭은 paid=true인 신청 내역을 그대로 보여준다.
function markInquiryPaid(id, amount) {
  const list = getInquiries();
  const target = list.find((r) => r.id === id);
  if (!target) return;
  target.paid = true;
  target.paidAmount = amount;
  target.paidAt = new Date().toISOString().slice(0, 10);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
}
function markInquiryReviewed(id) {
  const list = getInquiries();
  const target = list.find((r) => r.id === id);
  if (!target) return;
  target.reviewed = true;
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
}

// ---------- 리뷰 ----------
const REVIEWS_KEY = "weddingcom_reviews";
function getReviews() {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveReview(review) {
  const list = getReviews();
  list.push({
    id: Date.now(),
    createdAt: new Date().toISOString().slice(0, 10),
    ...review,
  });
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(list));
}

// ---------- 1:1 문의 ----------
const SUPPORT_KEY = "weddingcom_support_tickets";
function getSupportTickets() {
  try {
    return JSON.parse(localStorage.getItem(SUPPORT_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveSupportTicket(ticket) {
  const list = getSupportTickets();
  list.push({
    id: Date.now(),
    status: "wait",
    createdAt: new Date().toISOString().slice(0, 10),
    ...ticket,
  });
  localStorage.setItem(SUPPORT_KEY, JSON.stringify(list));
}

// ---------- 커뮤니티 ----------
// 시드 게시글(js/community-data.js)은 고정이고, 사용자가 새로 쓴 글/좋아요/댓글/조회수는
// 전부 localStorage에 실제로 저장해 새로고침해도 유지되도록 한다.
const COMMUNITY_POSTS_KEY = "weddingcom_community_posts";
function getCommunityUserPosts() {
  try {
    return JSON.parse(localStorage.getItem(COMMUNITY_POSTS_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function saveCommunityPost(post) {
  const list = getCommunityUserPosts();
  list.unshift({
    id: `new${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    views: 0,
    likes: 0,
    comments: 0,
    ...post,
  });
  localStorage.setItem(COMMUNITY_POSTS_KEY, JSON.stringify(list));
}

const COMMUNITY_LIKES_KEY = "weddingcom_community_likes";
function getCommunityLikes() {
  try {
    return JSON.parse(localStorage.getItem(COMMUNITY_LIKES_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function isCommunityLiked(postId) {
  return getCommunityLikes().includes(postId);
}
function toggleCommunityLike(postId) {
  const likes = getCommunityLikes();
  const idx = likes.indexOf(postId);
  if (idx === -1) likes.push(postId);
  else likes.splice(idx, 1);
  localStorage.setItem(COMMUNITY_LIKES_KEY, JSON.stringify(likes));
  return likes.includes(postId);
}

const COMMUNITY_COMMENTS_KEY = "weddingcom_community_comments";
function getAllCommunityComments() {
  try {
    return JSON.parse(localStorage.getItem(COMMUNITY_COMMENTS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function getCommunityComments(postId) {
  return getAllCommunityComments()[postId] || [];
}
function addCommunityComment(postId, author, text) {
  const all = getAllCommunityComments();
  if (!all[postId]) all[postId] = [];
  all[postId].push({ author, date: new Date().toISOString().slice(0, 10), body: text });
  localStorage.setItem(COMMUNITY_COMMENTS_KEY, JSON.stringify(all));
}

const COMMUNITY_VIEWS_KEY = "weddingcom_community_views";
function getCommunityExtraViews() {
  try {
    return JSON.parse(localStorage.getItem(COMMUNITY_VIEWS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function addCommunityView(postId) {
  const all = getCommunityExtraViews();
  all[postId] = (all[postId] || 0) + 1;
  localStorage.setItem(COMMUNITY_VIEWS_KEY, JSON.stringify(all));
}

// 로그인 상태에 따라 헤더 nav-actions 영역을 갱신 (모든 페이지 공통)
function weddingRenderHeader() {
  const nav = document.querySelector(".nav-actions");
  if (!nav) return;
  const user = WeddingStore.getUser();
  if (user) {
    const mypageHref = user.type === "business" ? "mypage-business.html" : "mypage.html";
    nav.innerHTML = `
      <a href="${mypageHref}" class="nav-user">${user.type === "business" ? "🏢" : "💍"} ${user.name}${user.type === "business" ? "" : "님"}</a>
      <button type="button" class="btn btn-ghost btn-sm" id="btn-logout">로그아웃</button>
    `;
  } else {
    nav.innerHTML = `
      <a href="login.html">로그인</a>
      <a href="signup.html" class="btn btn-primary btn-sm">회원가입</a>
    `;
  }
}

document.addEventListener("DOMContentLoaded", weddingRenderHeader);

document.addEventListener("click", (e) => {
  if (e.target.closest("#btn-logout")) {
    WeddingStore.logout();
    WeddingStore.toast("로그아웃 되었습니다");
    setTimeout(() => location.reload(), 500);
  }
});

// ---------- 네이버 지도 지역 검색 위젯 (공용) ----------
// TODO: 네이버 클라우드 플랫폼(console.ncloud.com)에서 발급받은 Maps API Client ID로 교체하세요.
// AI·Application Service > Maps 에서 Dynamic Map / Geocoding / Reverse Geocoding 을 등록하고
// Web 서비스 URL에 이 사이트의 도메인(로컬 테스트 시 http://localhost:8082)을 등록해야 합니다.
const NAVER_MAP_CLIENT_ID = "YOUR_NCP_CLIENT_ID";

// geocoder 서브모듈은 maps.js의 onload 이후 약간의 지연을 두고 준비되는 경우가 있어,
// naver.maps.Service.geocode 를 실제로 사용할 수 있을 때까지 짧게 폴링해서 기다린다.
function waitForNaverService(maxWaitMs) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    (function check() {
      if (window.naver && naver.maps && naver.maps.Service && naver.maps.Service.geocode) {
        resolve();
      } else if (Date.now() - start > maxWaitMs) {
        reject(new Error("naver maps Service(geocoder) not ready"));
      } else {
        setTimeout(check, 50);
      }
    })();
  });
}

let _naverMapsScriptPromise = null;
function loadNaverMapsScript() {
  if (_naverMapsScriptPromise) return _naverMapsScriptPromise;
  _naverMapsScriptPromise = new Promise((resolve, reject) => {
    if (window.naver && window.naver.maps) return waitForNaverService(3000).then(resolve).catch(reject);
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${NAVER_MAP_CLIENT_ID}&submodules=geocoder`;
    script.onload = () => waitForNaverService(3000).then(resolve).catch(reject);
    script.onerror = () => reject(new Error("naver maps script load failed"));
    document.head.appendChild(script);
  });
  return _naverMapsScriptPromise;
}

// 지역 검색 지도 위젯 초기화 — 웨딩홀 찾기, 업체 지역 설정 등에서 공통으로 사용
// config: { mapElId, queryInputId, searchBtnId, labelElId, onSelect(text) }
function initNaverRegionPicker(config) {
  const { mapElId, queryInputId, searchBtnId, labelElId, onSelect } = config;
  const mapEl = document.getElementById(mapElId);
  if (!mapEl) return;

  if (!NAVER_MAP_CLIENT_ID || NAVER_MAP_CLIENT_ID === "YOUR_NCP_CLIENT_ID") {
    mapEl.innerHTML = `<div class="map-placeholder">
      <span>🗺️</span>
      <p><b>네이버 지도 API 키가 설정되지 않았습니다.</b><br>js/store.js 상단의 NAVER_MAP_CLIENT_ID 값을 발급받은 Client ID로 교체해주세요.</p>
    </div>`;
    return;
  }

  let map = null;
  let marker = null;

  function setSelected(text) {
    const label = document.getElementById(labelElId);
    if (label) label.textContent = `📍 선택한 지역: ${text}`;
    if (typeof onSelect === "function") onSelect(text, map);
  }

  function search(query) {
    naver.maps.Service.geocode({ query }, (status, response) => {
      if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) {
        alert("검색 결과가 없습니다. 다른 지역명으로 시도해보세요. (예: 시/도 + 구·군)");
        return;
      }
      const item = response.v2.addresses[0];
      const point = new naver.maps.LatLng(item.y, item.x);
      map.setCenter(point);
      map.setZoom(13);
      marker.setPosition(point);
      setSelected(item.roadAddress || item.jibunAddress);
    });
  }

  function reverseGeocode(coord) {
    naver.maps.Service.reverseGeocode(
      { coords: coord, orders: [naver.maps.Service.OrderType.ADDR, naver.maps.Service.OrderType.ROAD_ADDR].join(",") },
      (status, response) => {
        if (status !== naver.maps.Service.Status.OK || !response.v2.results.length) return;
        const region = response.v2.results[0].region;
        const label = [region.area1.name, region.area2.name, region.area3.name].filter(Boolean).join(" ");
        marker.setPosition(coord);
        setSelected(label);
      }
    );
  }

  loadNaverMapsScript()
    .then(() => {
      mapEl.innerHTML = "";
      map = new naver.maps.Map(mapElId, {
        center: new naver.maps.LatLng(36.5, 127.8), // 대한민국 중심
        zoom: 7,
      });
      marker = new naver.maps.Marker({ position: map.getCenter(), map });
      naver.maps.Event.addListener(map, "click", (e) => reverseGeocode(e.coord));

      document.getElementById(searchBtnId)?.addEventListener("click", () => {
        const q = document.getElementById(queryInputId).value.trim();
        if (q) search(q);
      });
      document.getElementById(queryInputId)?.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          const q = e.target.value.trim();
          if (q) search(q);
        }
      });
    })
    .catch(() => {
      mapEl.innerHTML = `<div class="map-placeholder">
        <span>⚠️</span>
        <p>지도를 불러오지 못했습니다. Client ID 또는 Web 서비스 URL 도메인 등록을 확인해주세요.</p>
      </div>`;
    });
}

// 특정 주소를 지도에 표시만 하는 읽기전용 위젯 (상세페이지 위치 안내용)
function initNaverStaticMap(mapElId, address) {
  const mapEl = document.getElementById(mapElId);
  if (!mapEl) return;

  if (!NAVER_MAP_CLIENT_ID || NAVER_MAP_CLIENT_ID === "YOUR_NCP_CLIENT_ID") {
    mapEl.innerHTML = `<div class="map-placeholder"><span>🗺️</span><p><b>네이버 지도 API 키가 설정되지 않았습니다.</b></p></div>`;
    return;
  }

  loadNaverMapsScript()
    .then(() => {
      mapEl.innerHTML = "";
      const map = new naver.maps.Map(mapElId, { center: new naver.maps.LatLng(36.5, 127.8), zoom: 6 });
      naver.maps.Service.geocode({ query: address }, (status, response) => {
        if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) return;
        const item = response.v2.addresses[0];
        const point = new naver.maps.LatLng(item.y, item.x);
        map.setCenter(point);
        map.setZoom(15);
        new naver.maps.Marker({ position: point, map });
      });
    })
    .catch(() => {
      mapEl.innerHTML = `<div class="map-placeholder"><span>⚠️</span><p>지도를 불러오지 못했습니다.</p></div>`;
    });
}

// ---------- 지도 웨딩홀 핀 메모 ----------
// 메인페이지 지도에서 핀을 클릭해 남기는 개인 메모. type:id 키로 저장해 다시 클릭하면 그대로 보인다.
const HALL_MEMOS_KEY = "weddingcom_hall_memos";
function getHallMemos() {
  try {
    return JSON.parse(localStorage.getItem(HALL_MEMOS_KEY)) || {};
  } catch (e) {
    return {};
  }
}
function getHallMemo(key) {
  return getHallMemos()[key] || "";
}
function saveHallMemo(key, text) {
  const all = getHallMemos();
  if (text) all[key] = text;
  else delete all[key];
  localStorage.setItem(HALL_MEMOS_KEY, JSON.stringify(all));
}

// ---------- 찜하기 (즐겨찾기) ----------
const FAV_KEY = "weddingcom_favorites";
function getFavoriteIds() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch (e) {
    return [];
  }
}
function isFavorite(key) {
  return getFavoriteIds().includes(key);
}
function toggleFavorite(key) {
  const favs = getFavoriteIds();
  const idx = favs.indexOf(key);
  if (idx === -1) favs.push(key);
  else favs.splice(idx, 1);
  localStorage.setItem(FAV_KEY, JSON.stringify(favs));
  return favs.includes(key);
}
