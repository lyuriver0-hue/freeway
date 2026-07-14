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
  onSelect: (text) => { selectedRegionText = text; },
});
