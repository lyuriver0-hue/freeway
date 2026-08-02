// Supabase 클라이언트 초기화 — 개인 회원(로그인/회원가입)부터 실제 백엔드로 전환.
// anon(publishable) 키는 Row Level Security로 보호되는 것을 전제로 클라이언트 코드에
// 노출되도록 설계된 키라, 네이버 지도 API 키와 달리 공개 저장소에 그대로 커밋해도 안전하다.
const SUPABASE_URL = "https://laasnwfzhizmcyivoqgc.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_DxdUdN2jKLbnghTpqZMAgA_KHNUpO2F";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
