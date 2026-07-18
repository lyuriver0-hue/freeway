// 웨딩닷컴 내부 관리자 콘솔 — 모의 데이터 & 세션
// 일반 회원 세션(WeddingStore)과 완전히 분리된 시스템이다.
// 관리자 계정은 공개 회원가입으로 만들 수 없고, 아래 미리 시딩된 계정으로만
// admin-login.html에서 로그인할 수 있다.
const ADMIN_ACCOUNTS = [
  { email: "admin@weddingcom.kr", password: "admin1234", name: "웨딩닷컴 운영자" },
];

const AdminStore = {
  getSession() {
    try {
      return JSON.parse(sessionStorage.getItem("weddingcom_admin_session"));
    } catch (e) {
      return null;
    }
  },
  setSession(admin) {
    sessionStorage.setItem("weddingcom_admin_session", JSON.stringify(admin));
  },
  logout() {
    sessionStorage.removeItem("weddingcom_admin_session");
  },
  requireAuth() {
    if (!this.getSession()) location.href = "admin-login.html";
  },
};
