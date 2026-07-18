// 웨딩닷컴 메인페이지 — LISTINGS(js/listings.js) 데이터로 카드 렌더링 + 인터랙션
// 참고: 동적으로 렌더링되는 요소의 클릭은 document 레벨 이벤트 위임 사용 (직접 리스너는 첫 클릭이 씹힐 수 있음)

function renderVenues() {
  const grid = document.getElementById("venue-grid");
  grid.innerHTML = LISTINGS.hall.map((v, id) => renderListingCard("hall", id, v)).join("");
}

function renderSdmGrid(elId, type) {
  const grid = document.getElementById(elId);
  grid.innerHTML = LISTINGS[type].map((v, id) => renderListingCard(type, id, v)).join("");
}

renderVenues();
renderSdmGrid("grid-studio", "studio");
renderSdmGrid("grid-dress", "dress");
renderSdmGrid("grid-makeup", "makeup");

function renderFairPreview() {
  const upcoming = FAIRS
    .map((fair, id) => ({ id, fair }))
    .filter(({ fair }) => getFairStatus(fair).id !== "ended")
    .sort((a, b) => new Date(a.fair.dateStart) - new Date(b.fair.dateStart))
    .slice(0, 4);
  document.getElementById("fair-preview-grid").innerHTML = upcoming.map(({ id, fair }) => renderFairCard(id, fair)).join("");
}
renderFairPreview();

// 검색 위젯 탭 전환 (이벤트 위임)
document.addEventListener("click", (e) => {
  const tab = e.target.closest(".search-tab");
  if (tab) {
    document.querySelectorAll(".search-tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".search-panel").forEach(p => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.panel).classList.add("active");
    return;
  }

  const subtab = e.target.closest(".subtab");
  if (subtab) {
    activateSubtab(subtab.dataset.target);
    return;
  }

  if (e.target.closest("#hall-search-btn")) {
    document.getElementById("venues").scrollIntoView({ behavior: "smooth" });
    return;
  }
});

function activateSubtab(targetId) {
  document.querySelectorAll(".subtab").forEach(t => t.classList.toggle("active", t.dataset.target === targetId));
  document.querySelectorAll(".sdm-grid").forEach(g => g.style.display = g.id === targetId ? "grid" : "none");
}

// 웨딩홀 찾기 — 대한민국 지역 검색 (공용 지도 위젯, js/store.js)
let selectedRegionText = "";
initNaverRegionPicker({
  mapElId: "naver-map",
  queryInputId: "map-query",
  searchBtnId: "map-search-btn",
  labelElId: "map-selected-label",
  onSelect: (text, map) => {
    selectedRegionText = text;
    showNearbyHallPins(map, text);
  },
});

// ---------- 선택한 지역 주변 웨딩홀 핀 + 메모 ----------
let hallPinMarkers = [];
let activeHallInfoWindow = null;

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

// "서울특별시 강남구 역삼동" 같은 주소 문자열에서 구/시 단위 지역명을 추출
function extractDistrict(addressText) {
  const parts = (addressText || "").split(/\s+/);
  return (
    parts.find(p => /[가-힣]+구$/.test(p)) ||
    parts.find(p => /[가-힣]+시$/.test(p) && !/(특별시|광역시)$/.test(p)) ||
    null
  );
}

function clearHallPins() {
  hallPinMarkers.forEach(m => m.setMap(null));
  hallPinMarkers = [];
  if (activeHallInfoWindow) {
    activeHallInfoWindow.close();
    activeHallInfoWindow = null;
  }
}

// 마커가 겹치지 않도록 중심 좌표를 기준으로 살짝 원형으로 흩뿌려준다
function offsetLatLng(base, index, total) {
  if (total <= 1) return base;
  const angle = (2 * Math.PI * index) / total;
  const radius = 0.006;
  return new naver.maps.LatLng(base.y + radius * Math.sin(angle), base.x + radius * Math.cos(angle));
}

function openHallMemoPopup(map, marker, hall, id) {
  if (activeHallInfoWindow) activeHallInfoWindow.close();
  const key = `hall:${id}`;
  const domId = `hall-memo-${key.replace(":", "-")}`;
  const existing = getHallMemo(key);
  const html = `
    <div style="padding:14px; width:220px; font-family:inherit;">
      <b style="font-size:13px;">${escapeHtml(hall.name)}</b>
      <div style="font-size:11px; color:#8C7A7D; margin:2px 0 8px;">${escapeHtml(hall.loc)}</div>
      <textarea id="${domId}" rows="3" style="width:100%; font-size:12px; padding:6px; border:1px solid #E3D6D2; border-radius:8px; resize:vertical; box-sizing:border-box; font-family:inherit;" placeholder="이 웨딩홀에 대한 메모를 남겨보세요">${escapeHtml(existing)}</textarea>
      <button type="button" data-save-hall-memo="${key}" style="margin-top:6px; width:100%; padding:7px; background:#D6336C; color:#fff; border:none; border-radius:8px; cursor:pointer; font-size:12px; font-weight:700;">메모 저장</button>
      <a href="detail.html?type=hall&id=${id}" style="display:block; text-align:center; margin-top:8px; font-size:11px; color:#D6336C;">상세페이지 보기 →</a>
    </div>`;
  activeHallInfoWindow = new naver.maps.InfoWindow({ content: html, borderWidth: 0, backgroundColor: "transparent" });
  activeHallInfoWindow.open(map, marker);
  // InfoWindow 내부 클릭은 지도로 버블링되지 않도록 네이버 지도 쪽에서 막아버려서 document 위임
  // 리스너로는 저장 버튼 클릭을 못 받고, "domready" 이벤트도 이 SDK 버전에서는 발생하지 않는다.
  // open() 직후 짧은 지연을 두고 실제 DOM에 붙은 버튼을 찾아 직접 바인딩한다.
  setTimeout(() => {
    const saveBtn = document.querySelector(`[data-save-hall-memo="${key}"]`);
    if (!saveBtn) return;
    saveBtn.addEventListener("click", () => {
      const textarea = document.getElementById(domId);
      const text = textarea ? textarea.value.trim() : "";
      saveHallMemo(key, text);
      WeddingStore.toast(text ? "메모가 저장되었습니다" : "메모를 삭제했습니다");
    });
  }, 50);
}

function showNearbyHallPins(map, regionText) {
  clearHallPins();
  const district = extractDistrict(regionText);
  if (!district) return;

  const matches = LISTINGS.hall
    .map((h, id) => ({ h, id }))
    .filter(({ h }) => extractDistrict(h.loc) === district);

  if (matches.length === 0) {
    WeddingStore.toast("이 지역에 등록된 웨딩홀이 아직 없어요");
    return;
  }

  naver.maps.Service.geocode({ query: matches[0].h.loc }, (status, response) => {
    if (status !== naver.maps.Service.Status.OK || !response.v2.addresses.length) return;
    const item = response.v2.addresses[0];
    const base = new naver.maps.LatLng(item.y, item.x);

    matches.forEach(({ h, id }, i) => {
      const pos = offsetLatLng(base, i, matches.length);
      const marker = new naver.maps.Marker({
        position: pos,
        map,
        icon: {
          content: `<div style="background:#D6336C; width:28px; height:28px; border-radius:50% 50% 50% 0; transform:rotate(-45deg); display:flex; align-items:center; justify-content:center; box-shadow:0 2px 6px rgba(0,0,0,.3); border:2px solid #fff;"><span style="transform:rotate(45deg); font-size:12px;">🏛️</span></div>`,
          size: new naver.maps.Size(28, 28),
          anchor: new naver.maps.Point(14, 28),
        },
      });
      naver.maps.Event.addListener(marker, "click", () => openHallMemoPopup(map, marker, h, id));
      hallPinMarkers.push(marker);
    });

    WeddingStore.toast(`${matches.length}개의 웨딩홀 핀을 표시했어요`);
  });
}
