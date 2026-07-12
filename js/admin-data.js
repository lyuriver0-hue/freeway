/* =========================================================
   FREEWAY internal admin console — mock data & session
   Completely separate from FreewayStore (regular user session).
   Admin accounts are NOT created via public signup — only the
   pre-seeded ADMIN_ACCOUNTS below can log in at admin-login.html.
========================================================= */
const ADMIN_ACCOUNTS = [
  {email:'admin@freeway.com', password:'admin1234', name:'김운영', roleId:'r1'},
];

const ADMIN_PERMISSION_GROUPS = [
  {key:'account', label:'계정정보', items:[
    {key:'payment', label:'결제정보'},
    {key:'settings', label:'설정정보'},
    {key:'usermgmt', label:'사용자계정 관리'},
  ]},
  {key:'support', label:'고객지원', items:[
    {key:'support', label:'고객지원'},
    {key:'qna', label:'묻고답하기'},
  ]},
  {key:'settlement', label:'정산내역', items:[
    {key:'settlement', label:'정산내역'},
    {key:'unsettled', label:'미정산내역'},
    {key:'pending_deposit', label:'입금대기내역'},
    {key:'done_deposit', label:'입금완료내역'},
    {key:'tax_invoice', label:'세금계산서'},
    {key:'vat_ref', label:'부가세참고자료'},
  ]},
  {key:'transaction', label:'거래내역', items:[
    {key:'transaction', label:'거래내역'},
    {key:'website_tx', label:'웹사이트 거래내역'},
    {key:'chargeback', label:'Chargeback'},
    {key:'summary', label:'Summary'},
  ]},
];

const ALL_PERMISSION_KEYS = ADMIN_PERMISSION_GROUPS.flatMap(g=>g.items.map(i=>i.key));

let ADMIN_ROLES = [
  {id:'r1', name:'최고관리자', open:true, permissions: ALL_PERMISSION_KEYS.slice()},
  {id:'r2', name:'부 관리자', open:false, permissions: ['payment','settings','usermgmt','support','qna','settlement','unsettled','pending_deposit','done_deposit','transaction','website_tx']},
  {id:'r3', name:'운영관리자', open:false, permissions: ['settings','usermgmt','support','qna']},
];

const AdminStore = {
  getSession(){
    try{ return JSON.parse(sessionStorage.getItem('freeway_admin_session')); }catch(e){ return null; }
  },
  setSession(admin){ sessionStorage.setItem('freeway_admin_session', JSON.stringify(admin)); },
  logout(){ sessionStorage.removeItem('freeway_admin_session'); },
  requireAuth(){
    if(!this.getSession()){ location.href = 'admin-login.html'; }
  },
};
