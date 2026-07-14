# 프리웨이 (FREEWAY)

프리랜서-기업 매칭 온라인 아웃소싱 플랫폼. 업워크·크몽·숨고를 벤치마킹했다. **컨셉 검증용 정적 프로토타입 단계는 지났고, 실서비스로 배포할 예정**이다 — 실제 백엔드/인증/결제 연동이 붙을 예정이나 스택은 아직 미정이며, 현재 코드베이스 자체는 여전히 프론트엔드(HTML/CSS/JS)만 존재하고 상태는 브라우저 저장소 목업으로 처리되어 있다 (아래 "스택 & 아키텍처"는 이 현재 상태 기준).

## 스택 & 아키텍처

- **현재 상태**: 순수 HTML/CSS/JS. 빌드 도구, 패키지 매니저, 프레임워크 없음 — `index.html`을 브라우저로 직접 열거나 정적 서버로 서빙하면 끝. 페이지 단위로 `.html` 파일이 루트에 평면적으로 존재한다 (라우터 없음, 링크는 상대경로 `href="xxx.html"`).
- 상태는 전부 브라우저 저장소 기반의 목업 상태다. 실제 서버/DB는 아직 없다.
  - 일반 사용자 세션·찜·상위노출 등: `FreewayStore` (`js/data.js`) → `localStorage`
  - 관리자 세션: `AdminStore` (`js/admin-data.js`) → `sessionStorage`, 완전히 별도 시스템 (공개 회원가입으로 관리자 계정 생성 불가, `admin-login.html`에서만 사전 시딩된 `ADMIN_ACCOUNTS`로 로그인)
- **예정된 방향**: 실서비스 배포를 위해 백엔드/인증/결제 연동을 추가할 계획이지만, 구체적인 스택(프레임워크·DB·호스팅 등)은 아직 정해지지 않았다. 스택이 정해지면 이 문서를 다시 갱신할 것.

## 파일 구조

- `js/data.js` — 목업 데이터(카테고리, 프리랜서, 서비스, 리뷰, 공지, FAQ, 커뮤니티 글, 프로젝트, 견적)와 `FreewayStore`(찜/유저세션/상위노출/토스트 등 localStorage 헬퍼), 정렬 로직(`sortFreelancers`)
- `js/common.js` — 모든 페이지 공통 헤더/푸터(`freewayHeaderHTML`, `freewayFooterHTML`, `freewayMount`)와 위임 이벤트로 처리되는 공유 UI 동작(찜 버튼, 탭, 아코디언, 모달, 마이페이지 사이드바)
- `js/admin-data.js` — 관리자 전용 목업 데이터/권한 그룹/세션
- `css/styles.css` — 공통 디자인 시스템 (일반 사용자 페이지 전체가 공유)
- `css/admin.css` — 관리자 콘솔 전용 스타일
- `admin-*.html` — 내부 관리자 콘솔 (일반 사용자 플로우와 분리)
- `mypage-fl-*.html` / `mypage-cl-*.html` — 마이페이지: 프리랜서(fl)/클라이언트(cl) 역할별로 파일이 나뉜다
- `프리웨이_AI빌더_프롬프트.md` — 이 프로토타입을 만들 때 사용한 v0/Lovable류 AI 웹빌더용 페이지별 프롬프트 원본. 새 페이지를 추가하거나 기존 페이지의 "의도된 구성"을 확인할 때 참고

## 페이지 작성 패턴

새 사용자 페이지를 만들 때는 기존 페이지(`search.html` 등)의 구조를 따른다:

```html
<header class="site-header"></header>
<main class="page container"> ... </main>
<footer class="site-footer"></footer>

<script src="js/data.js"></script>
<script src="js/common.js"></script>
<script>
  freewayMount('활성탭키'); // 헤더/푸터 주입 + 상단 네비 active 표시
  // 페이지별 렌더링 로직
</script>
```

- `<header class="site-header">`/`<footer class="site-footer">`는 빈 채로 두고 `freewayMount(active)`가 채운다. `active` 값은 헤더 네비 항목(`category`/`search`/`project`/`community`/`faq`)과 매칭.
- 동적 렌더링(필터링, 탭 전환 등)은 `innerHTML` 재작성 방식을 쓰고, 리스너는 `document`에 위임된 것을 재사용한다(`js/common.js`의 `data-fav-id`/`.tab-btn`/`.acc-head` 델리게이션). 재렌더 후 별도 `initXxx()` 재호출이 필요 없도록 이 패턴을 유지할 것.
- 관리자 페이지는 `freewayMount` 대신 자체 레이아웃 + `AdminStore.requireAuth()`를 사용한다.

## 디자인 시스템

`css/styles.css`의 CSS 변수 기준, White > Blue > Green 우선순위.

- Primary Blue `#2563EB`, Green(안전결제/인증/성공 강조) `#16A34A`, Background `#FFFFFF`/`#F8FAFC`
- 폰트: Pretendard 계열 산세리프, 제목은 `font-weight:800`
- 카드 UI, `border-radius` 넉넉하게(`--radius: 14px`), 은은한 shadow, 여백 넓게
- 신뢰 요소(평점, 리뷰수, 인증뱃지, 응답률, 안전결제·표준계약서 배지)를 항상 시각적으로 강조

## 도메인 개념

- **안전결제(에스크로)**: 클라이언트 결제금 예치 → 작업 검수 완료 후 전문가 정산. 분쟁 시 고객센터 중재.
- **표준계약서**: 견적 수락 시 자동 생성, 필수는 아니지만 권장.
- **상위노출(Boost)**: 유료 광고 슬롯. `FreewayStore.setBoost/isBoosted`로 관리하며, 모든 정렬 기준에서 최우선 정렬 요소다 (`sortFreelancers` 참고).
- **전문가 정렬 기준**(추천순/인기순/평점순/응답순/신규등록순): 크몽 고객센터 안내를 참고해 근사 구현한 것으로, `js/data.js`의 `sortFreelancers` 주석에 각 기준의 근거가 적혀 있다. 정렬 로직을 바꿀 때는 이 우선순위 규칙을 유지할 것.

## 작업 시 유의사항

- 이 프로젝트는 실서비스 배포를 목표로 하지만, 백엔드 스택은 아직 미정이다. 실제 인증/결제/DB 연동을 요청받으면 먼저 스택(프레임워크·DB·호스팅 등)을 사용자와 확인할 것 — 임의로 특정 기술을 골라 구현하지 않는다. 스택 확정 전까지 새 기능은 기존과 동일하게 `localStorage`/`sessionStorage` 목업(`FreewayStore`/`AdminStore`) 위에 얹는다.
- 새 목업 데이터가 필요하면 `js/data.js`(일반) 또는 `js/admin-data.js`(관리자)에 기존 항목과 동일한 필드 스키마로 추가한다. 향후 실제 API로 교체될 것을 감안해, 필드명·구조는 실제 도메인 모델에 가깝게 유지한다.
- 커밋 메시지와 UI 카피는 한국어를 사용한다.
