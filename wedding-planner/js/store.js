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
    if (typeof onSelect === "function") onSelect(text);
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
