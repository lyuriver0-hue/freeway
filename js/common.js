/* =========================================================
   FREEWAY common header/footer + shared UI behaviors
========================================================= */
function freewayLogoIconSVG(size){
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
    <defs>
      <linearGradient id="fwGreen" x1="4" y1="14" x2="17" y2="27" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#2DD4BF"/>
        <stop offset="1" stop-color="#16A34A"/>
      </linearGradient>
      <linearGradient id="fwBlue" x1="13" y1="35" x2="42" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0" stop-color="#3730D9"/>
        <stop offset="1" stop-color="#4FA6F5"/>
      </linearGradient>
    </defs>
    <polygon points="4,20 17,14 17,27" fill="url(#fwGreen)"/>
    <polygon points="13,35 22,35 39,10 30,10" fill="url(#fwBlue)"/>
    <polygon points="25,35 31,35 44,16 38,16" fill="url(#fwBlue)" opacity="0.55"/>
  </svg>`;
}

function freewayLogoHTML(){
  return `<a href="index.html" class="logo">
    ${freewayLogoIconSVG(34)}
    <span class="logo-text">
      <span class="logo-word">FREE<span class="logo-way">WAY</span></span>
      <span class="logo-sub">프리웨이</span>
    </span>
  </a>`;
}

function freewayHeaderHTML(active){
  const user = FreewayStore.getUser();
  const authArea = user ? `
    <a href="${user.role==='freelancer' ? 'mypage-fl-services.html' : 'mypage-cl-favorites.html'}" class="login">${user.name}님</a>
    <button class="icon-btn" title="채팅" onclick="location.href='chat.html'">💬</button>
    <button class="btn btn-ghost btn-sm" onclick="FreewayStore.logout(); location.reload();">로그아웃</button>
  ` : `
    <a href="login.html" class="login">로그인</a>
    <a href="signup.html" class="btn btn-primary btn-sm">무료로 시작하기</a>
  `;
  return `
  <div class="nav">
    ${freewayLogoHTML()}
    <nav class="nav-links">
      <a href="category.html" class="${active==='category'?'active':''}">카테고리</a>
      <a href="search.html" class="${active==='search'?'active':''}">전문가 찾기</a>
      <a href="project-register.html" class="${active==='project'?'active':''}">프로젝트 등록</a>
      <a href="community.html" class="${active==='community'?'active':''}">커뮤니티</a>
      <a href="faq.html" class="${active==='faq'?'active':''}">고객센터</a>
    </nav>
    <form class="nav-search" onsubmit="event.preventDefault(); location.href='search.html?q='+encodeURIComponent(this.q.value);">
      <span class="icon">🔍</span>
      <input name="q" type="text" placeholder="서비스, 전문가 검색">
    </form>
    <div class="nav-actions">
      ${authArea}
    </div>
    <button class="burger" onclick="document.querySelector('.nav-links').classList.toggle('mobile-open')">☰</button>
  </div>`;
}

function freewayFooterHTML(){
  return `
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        ${freewayLogoHTML()}
        <p>모든 전문분야를 하나로 연결하는 프리웨이. 기업, 소상공인, 프리랜서 모두가 신뢰할 수 있는 거래를 경험하세요.</p>
      </div>
      <div>
        <h5>서비스</h5>
        <ul>
          <li><a href="project-register.html">프로젝트 등록</a></li>
          <li><a href="search.html">전문가 찾기</a></li>
          <li><a href="category.html">카테고리 전체보기</a></li>
        </ul>
      </div>
      <div>
        <h5>신뢰 &amp; 지원</h5>
        <ul>
          <li><a href="policy.html">표준계약서 안내</a></li>
          <li><a href="policy.html">안전결제 시스템</a></li>
          <li><a href="faq.html">고객센터</a></li>
          <li><a href="faq.html">자주 묻는 질문</a></li>
        </ul>
      </div>
      <div>
        <h5>회사</h5>
        <ul>
          <li><a href="policy.html">이용약관</a></li>
          <li><a href="policy.html">개인정보처리방침</a></li>
          <li><a href="notice.html">공지사항</a></li>
          <li><a href="community.html">커뮤니티</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 FREEWAY Inc. All rights reserved.</span>
      <span>본 화면은 사업 컨셉 검증을 위한 프로토타입입니다.</span>
    </div>
  </div>`;
}

function freewayMount(active){
  const h = document.querySelector('header.site-header');
  if(h) h.innerHTML = freewayHeaderHTML(active);
  const f = document.querySelector('footer.site-footer');
  if(f) f.innerHTML = freewayFooterHTML();
}

/* ---------- shared UI behaviors ----------
   Uses event delegation on document so dynamically-injected HTML
   (innerHTML re-renders from filters/tabs/etc.) always works without
   needing to re-attach listeners after every render. */

function markFavorites(root=document){
  root.querySelectorAll('[data-fav-id]').forEach(btn=>{
    btn.classList.toggle('active', FreewayStore.isFavorite(btn.getAttribute('data-fav-id')));
  });
}
// kept for backward-compat with existing page scripts that call this after rendering
function initFavoriteButtons(root=document){ markFavorites(root); }
function initTabs(){ /* no-op: handled by delegated listener below */ }
function initAccordion(){ /* no-op: handled by delegated listener below */ }

function freewayMypageSidebar(role, activeHref){
  const user = FreewayStore.getUser() || {name: role==='freelancer' ? '김프리랜서' : '박클라이언트'};
  const flLinks = [
    ['mypage-fl-services.html','🛠️','서비스 관리'],
    ['mypage-fl-quotes.html','📋','제안 견적서 관리'],
    ['mypage-fl-earnings.html','💰','수익 현황'],
  ];
  const clLinks = [
    ['mypage-cl-favorites.html','❤️','관심 목록'],
    ['mypage-cl-quotes.html','📄','견적서 관리'],
    ['mypage-cl-projects.html','📁','진행중인 프로젝트'],
    ['mypage-cl-payments.html','💳','결제 내역'],
    ['mypage-cl-inquiries.html','💬','문의 내역'],
  ];
  const links = role==='freelancer' ? flLinks : clLinks;
  return `
    <div class="who">
      <div class="avatar">${user.name[0]}</div>
      <div><b>${user.name}${role==='freelancer'?' 전문가':'님'}</b><span>${role==='freelancer'?'프리랜서 계정':'클라이언트 계정'}</span></div>
    </div>
    <nav>
      <div class="group-title">마이페이지</div>
      ${links.map(([href,icon,label])=>`<a href="${href}" class="${href===activeHref?'active':''}">${icon} ${label}</a>`).join('')}
    </nav>`;
}

function openModal(id){ document.getElementById(id).classList.add('open'); }
function closeModal(id){ document.getElementById(id).classList.remove('open'); }

document.addEventListener('click', (e)=>{
  const favBtn = e.target.closest('[data-fav-id]');
  if(favBtn){
    e.preventDefault(); e.stopPropagation();
    const id = favBtn.getAttribute('data-fav-id');
    const active = FreewayStore.toggleFavorite(id);
    document.querySelectorAll(`[data-fav-id="${CSS.escape(id)}"]`).forEach(el=>el.classList.toggle('active', active));
    FreewayStore.toast(active ? '관심 목록에 추가했습니다' : '관심 목록에서 제거했습니다');
    return;
  }

  const tabBtn = e.target.closest('.tab-btn');
  if(tabBtn){
    const group = tabBtn.closest('[data-tabs]');
    if(group){
      group.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      tabBtn.classList.add('active');
      const targetId = tabBtn.getAttribute('data-tab-target');
      const scope = group.parentElement || document;
      scope.querySelectorAll('.tab-panel').forEach(p=>p.classList.remove('active'));
      const panel = document.getElementById(targetId);
      if(panel) panel.classList.add('active');
    }
    return;
  }

  const accHead = e.target.closest('.acc-head');
  if(accHead){
    const item = accHead.parentElement;
    const body = item.querySelector('.acc-body');
    const wasOpen = item.classList.contains('open');
    item.classList.toggle('open', !wasOpen);
    body.style.maxHeight = !wasOpen ? body.scrollHeight + 40 + 'px' : 0;
    return;
  }
});

document.addEventListener('DOMContentLoaded', ()=>{
  markFavorites();
});
