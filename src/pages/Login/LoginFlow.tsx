import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'

// ── 단계 정의 ──────────────────────────────────────────────
const STEPS = ['본인 인증', '가족 관계', '소득 정보', '주식 정보', '마이데이터']
const TOTAL = STEPS.length

const familyOptions = [
  { label: '부모', icon: '👴', sub: '아버지 / 어머니' },
  { label: '배우자', icon: '💑', sub: '남편 / 아내' },
  { label: '자녀', icon: '👶', sub: '아들 / 딸' },
  { label: '형제/자매', icon: '🧑‍🤝‍🧑', sub: '오빠 / 동생 등' },
  { label: '조부모', icon: '👵', sub: '할머니 / 할아버지' },
  { label: '없음(1인)', icon: '🙋', sub: '혼자 생활 중' },
]

const mydataOrgs = [
  { id: 'nts',  icon: '🏛️', name: '국세청',         sub: '소득·세금 정보',      required: true },
  { id: 'nhis', icon: '🏥', name: '국민건강보험공단', sub: '건강보험·의료비 정보', required: true },
  { id: 'nhpf', icon: '🏠', name: '국민연금공단',    sub: '연금 납부 정보',       required: false },
  { id: 'bank', icon: '🏦', name: '금융결제원',      sub: '계좌·카드 사용 내역',   required: false },
  { id: 'kb',   icon: '🟡', name: 'KB국민은행',      sub: '입출금·대출 정보',      required: false },
  { id: 'nh',   icon: '🌿', name: 'NH농협은행',      sub: '입출금·예적금 정보',    required: false },
]

// ── 유틸 ──────────────────────────────────────────────────
function formatPhone(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`
}

function formatTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

// ── 체크박스 컴포넌트 ─────────────────────────────────────
function KakaoCheckbox({ checked, small }: { checked: boolean; small?: boolean }) {
  const s = small ? 16 : 20
  return (
    <div style={{ width: s, height: s, borderRadius: '50%', background: checked ? '#FEE500' : 'white', border: checked ? 'none' : '1.5px solid #DDDDDD', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {checked && <svg width={s * 0.55} height={s * 0.55} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#3A1D1D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
    </div>
  )
}


// ── 인증 모달 ──────────────────────────────────────────────
type AuthProvider = 'kakao' | 'naver' | 'pass'

interface AuthModalProps {
  provider: AuthProvider
  onComplete: () => void
  onClose: () => void
}

function AuthModal({ provider, onComplete, onClose }: AuthModalProps) {
  const [subStep, setSubStep] = useState(1)
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [phone, setPhone] = useState('')
  const [carrier, setCarrier] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(180)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = () => {
    setCountdown(180)
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timerRef.current!); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current) }, [])

  const handleSuccess = () => {
    setSubStep(99)
    setTimeout(onComplete, 1200)
  }

  // ── 카카오 OAuth ───────────────────────────────────────────
  if (provider === 'kakao') {
    if (subStep === 99) {
      return (
        <BrowserShell url="accounts.kakao.com" onClose={onClose} hideClose>
          <OAuthSuccess />
        </BrowserShell>
      )
    }

    // 동의 화면 (실제 카카오 OAuth 동의 페이지 스타일)
    if (subStep === 2) {
      return (
        <BrowserShell url="accounts.kakao.com" onClose={onClose}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* 스크롤 영역 */}
            <div style={{ overflowY: 'auto', flex: 1 }}>
              {/* kakao 로고 */}
              <div style={{ padding: '16px 0 14px', textAlign: 'center', borderBottom: '1px solid #F0F0F0' }}>
                <span style={{ fontSize: 22, color: '#3A1D1D', letterSpacing: -0.5 }}>kakao</span>
              </div>

              {/* 계정 정보 */}
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F0F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FEE500', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#3A1D1D', flexShrink: 0 }}>한</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>한입(HanIP) </span>
                    <span style={{ fontSize: 12, color: '#999' }}>셀로나인</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#F7F7F7', borderRadius: 6 }}>
                  <span style={{ fontSize: 13, color: '#333' }}>{id || 'user@kakao.com'}</span>
                  <button style={{ fontSize: 12, color: '#555', border: 'none', background: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 1, padding: 0 }}>
                    변경
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
                  </button>
                </div>
              </div>

              {/* 전체 선택 안내 */}
              <div style={{ padding: '10px 20px', background: '#FAFAFA', borderBottom: '1px solid #F0F0F0' }}>
                <p style={{ fontSize: 11, color: '#666', lineHeight: 1.6 }}>
                  전체 선택하기는 선택 항목을 포함하고 있으며, <strong style={{ color: '#444' }}>선택 항목에 동의하지 않아도 서비스를 이용할 수 있습니다.</strong>
                </p>
              </div>

              {/* 동의 항목 */}
              <div style={{ padding: '16px 20px 20px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 10 }}>카카오 로그인 동의</p>

                {/* 필수 항목 */}
                <div style={{ border: '1px solid #E8E8E8', borderRadius: 6, marginBottom: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: '1px solid #F0F0F0' }}>
                    <KakaoCheckbox checked />
                    <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: '#333' }}>(필수)카카오 개인정보 제3자 제공 동의</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ padding: '8px 14px 10px', background: '#FAFAFA' }}>
                    <p style={{ fontSize: 11, color: '#999', lineHeight: 1.7 }}>닉네임, 프로필 사진, 카카오계정(이메일), 성별, 카카오계정(전화번호), 출생 연도, 생일, 이름</p>
                  </div>
                </div>

                {/* 선택 항목 */}
                <div style={{ border: '1px solid #E8E8E8', borderRadius: 6, marginBottom: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderBottom: '1px solid #F0F0F0' }}>
                    <KakaoCheckbox checked={false} />
                    <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: '#333' }}>(선택)카카오 개인정보 제3자 제공 동의</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ padding: '8px 14px 10px', background: '#FAFAFA' }}>
                    {[
                      { label: '배송지정보(수령인명, 배송지 주소, 전화번호)' },
                      { label: '연령대' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: i === 0 ? 5 : 0 }}>
                        <KakaoCheckbox checked={false} small />
                        <span style={{ fontSize: 11, color: '#999' }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 10 }}>한입 서비스 동의</p>
                <div style={{ border: '1px solid #E8E8E8', borderRadius: 6, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px' }}>
                    <KakaoCheckbox checked />
                    <span style={{ fontSize: 12, fontWeight: 600, flex: 1, color: '#333' }}>(필수) 서비스 이용약관 동의</span>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#AAAAAA" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* 하단 고정 버튼 */}
            <div style={{ padding: '10px 20px 16px', borderTop: '1px solid #F0F0F0', background: 'white', flexShrink: 0 }}>
              <button
                style={{ width: '100%', height: 46, background: '#FEE500', color: '#000', border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', marginBottom: 8, opacity: loading ? 0.7 : 1 }}
                onClick={() => { setLoading(true); setTimeout(handleSuccess, 900) }}
                disabled={loading}
              >
                {loading ? '처리 중…' : '전체 선택하기'}
              </button>
              <p style={{ textAlign: 'center' }}>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#888', fontFamily: 'inherit' }}>취소</button>
              </p>
            </div>
          </div>
        </BrowserShell>
      )
    }

    // 카카오 로그인 폼 (subStep 1)
    return (
      <BrowserShell url="accounts.kakao.com" onClose={onClose}>
        <div style={{ overflowY: 'auto' }}>
          <div style={{ textAlign: 'center', padding: '28px 24px 22px' }}>
            <span style={{ fontSize: 26, color: '#3A1D1D', letterSpacing: -0.5 }}>kakao</span>
          </div>

          <div style={{ padding: '0 24px 28px' }}>
            <div style={{ border: '1.5px solid #DDDDDD', borderRadius: 2, overflow: 'hidden', marginBottom: 10 }}>
              <input
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="카카오계정 (이메일 또는 전화번호)"
                autoComplete="username"
                style={{ display: 'block', width: '100%', height: 46, padding: '0 14px', border: 'none', borderBottom: '1px solid #DDDDDD', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#333', boxSizing: 'border-box' }}
              />
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="비밀번호"
                autoComplete="current-password"
                style={{ display: 'block', width: '100%', height: 46, padding: '0 14px', border: 'none', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#333', boxSizing: 'border-box' }}
              />
            </div>

            <button
              style={{ width: '100%', height: 46, background: id && pw ? '#FEE500' : '#FEE50055', color: id && pw ? '#000' : '#00000055', border: 'none', borderRadius: 2, fontSize: 14, fontWeight: 700, cursor: id && pw ? 'pointer' : 'default', fontFamily: 'inherit', marginBottom: 20, transition: 'all 0.15s' }}
              onClick={() => {
                if (!id || !pw) return
                setLoading(true)
                setTimeout(() => { setLoading(false); setSubStep(2) }, 900)
              }}
              disabled={!id || !pw || loading}
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {['카카오계정 찾기', 'QR코드 로그인', '비밀번호 재설정'].map((t, i) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: '#888', cursor: 'pointer', padding: '0 8px' }}>{t}</span>
                  {i < 2 && <span style={{ color: '#DDDDDD' }}>|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </BrowserShell>
    )
  }

  // ── 네이버 OAuth ───────────────────────────────────────────
  if (provider === 'naver') {
    if (subStep === 99) {
      return (
        <BrowserShell url="nid.naver.com" onClose={onClose} hideClose>
          <OAuthSuccess />
        </BrowserShell>
      )
    }

    // 동의 화면 — 실제 네이버 OAuth 동의 페이지
    if (subStep === 2) {
      return (
        <BrowserShell url="nid.naver.com" onClose={onClose}>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', background: '#fff' }}>
            <div style={{ overflowY: 'auto', flex: 1 }}>

              {/* 앱 아이콘 + 서비스명 */}
              <div style={{ padding: '24px 20px 16px', textAlign: 'center', borderBottom: '1px solid #EBEBEB' }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: '#EBF1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, margin: '0 auto 10px', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }}>🤖</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 }}>한입(HanIP)</p>
                <p style={{ fontSize: 11, color: '#888' }}>hanip.app</p>
              </div>

              <div style={{ padding: '0 20px 16px' }}>

                {/* 안내 문구 */}
                <p style={{ fontSize: 12, color: '#555', lineHeight: 1.6, padding: '14px 0 12px', borderBottom: '1px solid #EBEBEB' }}>
                  아래 동의 항목을 확인하고 동의해 주세요.<br />
                  <span style={{ color: '#03C75A', fontWeight: 600 }}>선택 항목</span>에 동의하지 않아도 서비스를 이용할 수 있습니다.
                </p>

                {/* 전체 동의 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', borderBottom: '2px solid #222' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #03C75A', background: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>전체 동의</span>
                </div>

                {/* 필수 항목 */}
                <div style={{ borderBottom: '1px solid #EBEBEB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 8px' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #03C75A', background: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: '#111' }}>(필수) 개인정보 제3자 제공 동의</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 9l-7 7-7-7" stroke="#AAA" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ paddingLeft: 32, paddingBottom: 12 }}>
                    {[
                      { label: '이름/나이/성별', required: true },
                      { label: '이메일 주소', required: true },
                      { label: '휴대폰 번호', required: true },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#03C75A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span style={{ fontSize: 12, color: '#333', flex: 1 }}>{item.label}</span>
                        <span style={{ fontSize: 10, color: '#03C75A', border: '1px solid #03C75A', borderRadius: 2, padding: '1px 5px', flexShrink: 0 }}>필수</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 선택 항목 */}
                <div style={{ borderBottom: '1px solid #EBEBEB' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 8px' }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #CCCCCC', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: '#111' }}>(선택) 개인정보 제3자 제공 동의</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 9l-7 7-7-7" stroke="#AAA" strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <div style={{ paddingLeft: 32, paddingBottom: 12 }}>
                    {[
                      { label: '생일', required: false },
                      { label: '연령대', required: false },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="5" stroke="#CCC" strokeWidth="2"/></svg>
                        <span style={{ fontSize: 12, color: '#888', flex: 1 }}>{item.label}</span>
                        <span style={{ fontSize: 10, color: '#999', border: '1px solid #DDD', borderRadius: 2, padding: '1px 5px', flexShrink: 0 }}>선택</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 서비스 이용 동의 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: '1px solid #EBEBEB' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid #03C75A', background: '#03C75A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: '#111' }}>(필수) 서비스 이용약관 동의</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#AAA" strokeWidth="2" strokeLinecap="round"/></svg>
                </div>

                <p style={{ fontSize: 10, color: '#AAA', lineHeight: 1.8, paddingTop: 12 }}>
                  네이버(주)는 위 서비스에서 발생하는 회원 개인정보 처리에 관여하지 않으며, 이와 관련한 책임은 위 서비스 업체에 있습니다.
                </p>
              </div>
            </div>

            {/* 하단 버튼 */}
            <div style={{ display: 'flex', borderTop: '1px solid #EBEBEB', flexShrink: 0 }}>
              <button onClick={onClose} style={{ flex: 1, height: 52, background: 'white', border: 'none', borderRight: '1px solid #EBEBEB', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', color: '#666' }}>
                취소
              </button>
              <button
                style={{ flex: 1, height: 52, background: loading ? '#9BE0BB' : '#03C75A', color: 'white', border: 'none', fontSize: 15, fontWeight: 700, cursor: loading ? 'default' : 'pointer', fontFamily: 'inherit', transition: 'background 0.15s' }}
                onClick={() => { setLoading(true); setTimeout(handleSuccess, 900) }}
                disabled={loading}
              >
                {loading ? '처리 중…' : '동의하기'}
              </button>
            </div>
          </div>
        </BrowserShell>
      )
    }

    // 네이버 로그인 폼 — 실제 nid.naver.com OAuth 스타일
    return (
      <BrowserShell url="nid.naver.com" onClose={onClose}>
        <div style={{ overflowY: 'auto', background: '#fff' }}>
          <div style={{ padding: '24px 20px 28px' }}>

            {/* NAVER 로고 */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 36, fontWeight: 900, fontStyle: 'italic', color: '#03C75A', letterSpacing: -1, fontFamily: '"Arial Black", "Impact", sans-serif' }}>NAVER</span>
            </div>

            {/* 탭 바 — ID / 일회용 번호 / QR코드 */}
            <div style={{ display: 'flex', border: '1px solid #DDDDDD', borderRadius: 4, overflow: 'hidden', marginBottom: 16 }}>
              {[
                { icon: '🪪', label: 'ID 로그인', active: true },
                { icon: '🔢', label: '일회용 번호', active: false },
                { icon: '⊞', label: 'QR코드', active: false },
              ].map((tab, i) => (
                <div key={i} style={{ flex: 1, padding: '9px 4px', textAlign: 'center', background: tab.active ? '#03C75A' : 'white', borderRight: i < 2 ? '1px solid #DDDDDD' : 'none', cursor: 'pointer' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: tab.active ? 'white' : '#888', lineHeight: 1.3 }}>{tab.icon} {tab.label}</p>
                </div>
              ))}
            </div>

            {/* OAuth 안내 문구 */}
            <div style={{ background: '#F0FAF0', border: '1px solid #C8EDD0', borderRadius: 4, padding: '10px 12px', marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: '#3D7A4A', lineHeight: 1.6 }}>
                네이버에 로그인하여 OAuth2 서비스를 이용하실 수 있습니다.<br />
                서비스 이용이 끝나면 네이버에서도 로그아웃해 주세요.
              </p>
            </div>

            {/* 아이디 입력 */}
            <div style={{ position: 'relative', marginBottom: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                <circle cx="12" cy="8" r="4" stroke="#333" strokeWidth="2"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                value={id}
                onChange={e => setId(e.target.value)}
                placeholder="아이디"
                autoComplete="username"
                style={{ display: 'block', width: '100%', height: 46, padding: '0 14px 0 36px', border: '1px solid #CCCCCC', borderBottom: 'none', borderRadius: '4px 4px 0 0', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#111', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}>
                <rect x="3" y="11" width="18" height="11" rx="2" stroke="#333" strokeWidth="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#333" strokeWidth="2"/>
              </svg>
              <input
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="비밀번호"
                autoComplete="current-password"
                style={{ display: 'block', width: '100%', height: 46, padding: '0 14px 0 36px', border: '1px solid #CCCCCC', borderRadius: '0 0 4px 4px', fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#111', boxSizing: 'border-box' }}
              />
            </div>

            {/* 로그인 상태 유지 + IP보안 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#03C75A" strokeWidth="2" fill="#03C75A"/>
                  <path d="M7 12l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ fontSize: 12, color: '#444' }}>로그인 상태 유지</span>
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 11, color: '#444' }}>IP보안</span>
                <div style={{ width: 36, height: 20, background: '#03C75A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 2px' }}>
                  <div style={{ width: 16, height: 16, background: 'white', borderRadius: '50%' }} />
                </div>
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              style={{ width: '100%', height: 50, background: id && pw ? '#03C75A' : '#9BE0BB', color: 'white', border: 'none', borderRadius: 4, fontSize: 16, fontWeight: 700, cursor: id && pw ? 'pointer' : 'default', fontFamily: 'inherit', marginBottom: 16, transition: 'background 0.15s' }}
              onClick={() => {
                if (!id || !pw) return
                setLoading(true)
                setTimeout(() => { setLoading(false); setSubStep(2) }, 900)
              }}
              disabled={!id || !pw || loading}
            >
              {loading ? '로그인 중…' : '로그인'}
            </button>

            {/* 하단 링크 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              {['비밀번호 찾기', '아이디 찾기', '회원가입'].map((t, i) => (
                <span key={t} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: '#888', cursor: 'pointer', padding: '0 10px' }}>{t}</span>
                  {i < 2 && <span style={{ color: '#DDDDDD' }}>|</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </BrowserShell>
    )
  }

  // ── PASS (SMS/앱 기반) ─────────────────────────────────────
  if (provider === 'pass') {
    if (subStep === 99) {
      return (
        <ModalShell onClose={onClose} headerBg="#2448A5" headerColor="#fff" logo="PASS" title="PASS 본인인증" hideClose>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px 40px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#10B981" />
                <path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>인증이 완료되었어요</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>잠시 후 자동으로 이동합니다</p>
          </div>
        </ModalShell>
      )
    }

    if (subStep === 1) {
      return (
        <ModalShell onClose={onClose} headerBg="#2448A5" headerColor="#fff" logo="PASS" title="PASS 본인인증">
          <div style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                사용 중인 통신사를 선택해주세요.<br />
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>PASS 앱이 설치된 기기와 같은 통신사여야 해요</span>
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { name: 'SKT',   color: '#E60012', bg: '#FFF0F0', sub: 'SK텔레콤' },
                  { name: 'KT',    color: '#000000', bg: '#F5F5F5', sub: '케이티' },
                  { name: 'LG U+', color: '#E11E8E', bg: '#FFF0F8', sub: 'LG유플러스' },
                ].map(c => (
                  <button key={c.name} onClick={() => { setCarrier(c.name); setSubStep(2) }}
                    style={{ padding: '16px 18px', background: c.bg, border: `1.5px solid ${carrier === c.name ? c.color : 'transparent'}`, borderRadius: 18, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: c.color }}>{c.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{c.sub}</p>
                    </div>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke={c.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ModalShell>
      )
    }

    if (subStep === 2) {
      return (
        <ModalShell onClose={onClose} headerBg="#2448A5" headerColor="#fff" logo="PASS" title="PASS 본인인증">
          <div style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#EEF2FF', borderRadius: 10 }}>
              <span style={{ fontSize: 14 }}>📱</span>
              <p style={{ fontSize: 12, color: '#2448A5', fontWeight: 600 }}>선택한 통신사: {carrier}</p>
              <button onClick={() => setSubStep(1)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, color: '#2448A5', fontWeight: 600, fontFamily: 'inherit' }}>변경</button>
            </div>
            <div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
                PASS 앱에 가입된 휴대폰 번호를 입력해주세요.
              </p>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>휴대폰 번호</label>
              <input
                className="input"
                value={phone}
                onChange={e => setPhone(formatPhone(e.target.value))}
                placeholder="010-0000-0000"
                inputMode="numeric"
                style={{ fontSize: 16, letterSpacing: 1 }}
              />
            </div>
            <button
              className="btn-primary"
              onClick={() => { if (phone.length < 12) return; startTimer(); setSubStep(3) }}
              style={{ background: '#2448A5', opacity: phone.length < 12 ? 0.4 : 1 }}
              disabled={phone.length < 12}
            >
              PASS 인증 요청
            </button>
          </div>
        </ModalShell>
      )
    }

    if (subStep === 3) {
      return (
        <ModalShell onClose={onClose} headerBg="#2448A5" headerColor="#fff" logo="PASS" title="PASS 본인인증">
          <div style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>PASS 앱 알림을 확인해주세요</p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{phone}으로 인증 요청을 보냈어요</p>
            </div>

            <div style={{ border: '1px solid #E5E7EB', borderRadius: 18, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ background: '#F9F9F9', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2448A5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>P</span>
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#333' }}>PASS</p>
                  <p style={{ fontSize: 10, color: '#999' }}>지금 막 · 알림</p>
                </div>
              </div>
              <div style={{ background: 'white', padding: '14px 16px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#333', marginBottom: 6 }}>본인인증 요청</p>
                <p style={{ fontSize: 12, color: '#666', lineHeight: 1.5, marginBottom: 6 }}>
                  서비스명: 한입(HanIP)<br />
                  통신사: {carrier} · {phone}
                </p>
                <div style={{ padding: '8px 12px', background: '#F3F4F6', borderRadius: 8, display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 11, color: '#666' }}>남은 시간</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: countdown < 30 ? 'var(--error)' : '#2448A5' }}>{formatTime(countdown)}</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1, padding: '8px 0', background: '#F3F4F6', borderRadius: 8, textAlign: 'center', fontSize: 12, color: '#666', fontWeight: 600 }}>거절</div>
                  <div style={{ flex: 1, padding: '8px 0', background: '#2448A5', borderRadius: 8, textAlign: 'center', fontSize: 12, color: 'white', fontWeight: 700 }}>인증하기</div>
                </div>
              </div>
            </div>

            {countdown === 0 ? (
              <button className="btn-secondary" onClick={() => { startTimer(); setSubStep(2) }}>다시 요청하기</button>
            ) : (
              <button
                className="btn-primary"
                onClick={() => { setLoading(true); setTimeout(() => { setLoading(false); setSubStep(99); setTimeout(onComplete, 1200) }, 1500) }}
                style={{ background: '#2448A5' }}
                disabled={loading}
              >
                {loading ? '인증 확인 중…' : 'PASS 앱에서 확인했어요'}
              </button>
            )}
            <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
              PASS 앱에서 [인증하기] 버튼을 누른 후<br />위 버튼을 눌러주세요
            </p>
          </div>
        </ModalShell>
      )
    }
  }

  return null
}

// ── OAuth 성공 — 앱으로 리디렉트되는 화면 ─────────────────────
function OAuthSuccess() {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 24px', gap: 12 }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: '#EBF1FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, fontSize: 32 }}>🤖</div>
      <p style={{ fontSize: 16, fontWeight: 700, color: '#111', textAlign: 'center' }}>한입(HanIP)으로<br />돌아가는 중…</p>
      <p style={{ fontSize: 13, color: '#888', textAlign: 'center' }}>잠시만 기다려주세요</p>
      <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: '#007AFF', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
    </div>
  )
}

// ── iOS SFSafariViewController 스타일 인앱 브라우저 ──────────
interface BrowserShellProps {
  children: React.ReactNode
  url: string
  onClose: () => void
  hideClose?: boolean
}

function BrowserShell({ children, url, onClose, hideClose }: BrowserShellProps) {
  const [pageReady, setPageReady] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(40), 80)
    const t2 = setTimeout(() => setProgress(75), 250)
    const t3 = setTimeout(() => setProgress(100), 500)
    const t4 = setTimeout(() => setPageReady(true), 600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [])

  const appFrame = document.querySelector('.app-frame')

  const content = (
    // .app-frame 전체를 덮는 인앱 브라우저 (헤더·바텀탭 위에 렌더링)
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', background: 'white' }}>
      {/* iOS 상태바 영역 */}
      <div style={{ background: '#F2F2F7', height: 6, flexShrink: 0 }} />

      {/* Safari 네비게이션 바 */}
      <div style={{ background: '#F2F2F7', padding: '6px 12px 8px', flexShrink: 0, borderBottom: '0.5px solid rgba(0,0,0,0.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* 뒤로가기 (비활성) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
            <path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {/* 앞으로가기 (비활성) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}>
            <path d="M9 18l6-6-6-6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* URL 캡슐 */}
          <div style={{ flex: 1, background: '#E5E5EA', borderRadius: 10, padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <rect x="3" y="11" width="18" height="11" rx="2" fill="#34C759"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="#34C759" strokeWidth="2" fill="none"/>
            </svg>
            <span style={{ fontSize: 13, color: '#000', fontWeight: 400, letterSpacing: 0 }}>{url}</span>
          </div>

          {/* 공유 버튼 */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.6 }}>
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          {/* 완료 버튼 */}
          {!hideClose ? (
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 600, color: '#007AFF', fontFamily: 'inherit', padding: '0 2px', letterSpacing: 0 }}>완료</button>
          ) : (
            <div style={{ width: 32 }} />
          )}
        </div>
      </div>

      {/* 진행 바 */}
      <div style={{ height: 2, background: '#E5E5EA', flexShrink: 0, overflow: 'hidden' }}>
        {!pageReady && (
          <div style={{ height: '100%', width: `${progress}%`, background: '#007AFF', transition: 'width 0.2s ease-out' }} />
        )}
      </div>

      {/* 페이지 컨텐츠 */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0, background: 'white' }}>
        {!pageReady ? (
          // 페이지 로딩 중 스켈레톤
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12, padding: '24px 20px' }}>
            {[80, 60, 100, 60, 40].map((w, i) => (
              <div key={i} style={{ height: i === 0 ? 20 : 14, width: `${w}%`, background: '#F0F0F0', borderRadius: 4 }} />
            ))}
          </div>
        ) : children}
      </div>

      {/* Safari 하단 툴바 */}
      <div style={{ background: '#F2F2F7', borderTop: '0.5px solid rgba(0,0,0,0.12)', padding: '8px 0 12px', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexShrink: 0 }}>
        {[
          <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}><path d="M15 18l-6-6 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round"/></svg>,
          <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.25 }}><path d="M9 18l6-6-6-6" stroke="#000" strokeWidth="2" strokeLinecap="round"/></svg>,
          <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
          <svg key="4" width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="#007AFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
          <svg key="5" width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="4" y="4" width="6" height="6" rx="1" stroke="#007AFF" strokeWidth="2"/><rect x="14" y="4" width="6" height="6" rx="1" stroke="#007AFF" strokeWidth="2"/><rect x="4" y="14" width="6" height="6" rx="1" stroke="#007AFF" strokeWidth="2"/><rect x="14" y="14" width="6" height="6" rx="1" stroke="#007AFF" strokeWidth="2"/></svg>,
        ].map((icon, i) => (
          <div key={i} style={{ padding: '4px 8px', cursor: i < 2 ? 'default' : 'pointer' }}>{icon}</div>
        ))}
      </div>
    </div>
  )

  return appFrame ? createPortal(content, appFrame) : content
}

// ── 바텀시트 셸 (PASS용) ──────────────────────────────────
interface ModalShellProps {
  children: React.ReactNode
  onClose: () => void
  headerBg: string
  headerColor: string
  logo: string
  title: string
  hideClose?: boolean
}

function ModalShell({ children, onClose, headerBg, headerColor, logo, title, hideClose }: ModalShellProps) {
  const appFrame = document.querySelector('.app-frame')

  const content = (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} onClick={hideClose ? undefined : onClose} />
      <div style={{ position: 'relative', background: 'white', borderRadius: '20px 20px 0 0', maxHeight: '85%', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: '#D1D5DB' }} />
        </div>
        <div style={{ background: headerBg, padding: '14px 20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '10px 16px 0', borderRadius: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: headerColor, fontSize: 12, fontWeight: 900, letterSpacing: -0.5 }}>{logo}</span>
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: headerColor }}>{title}</p>
              <p style={{ fontSize: 11, color: headerColor, opacity: 0.75 }}>본인 확인 서비스</p>
            </div>
          </div>
          {!hideClose && (
            <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.15)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke={headerColor} strokeWidth="2.5" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  )

  return appFrame ? createPortal(content, appFrame) : content
}

// ── 메인 컴포넌트 ──────────────────────────────────────────
export default function LoginFlow() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep] = useState(1)
  const [inputName, setInputName] = useState('')
  const [authMethod, setAuthMethod] = useState<string | null>(null)
  const [selectedFamily, setSelectedFamily] = useState<string[]>([])
  const [incomeRange, setIncomeRange] = useState<string | null>(null)
  const [hasStock, setHasStock] = useState<boolean | null>(null)
  const [stockAmount, setStockAmount] = useState('')
  const [connectedOrgs, setConnectedOrgs] = useState<string[]>(['nts', 'nhis'])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  // 인증 모달
  const [activeProvider, setActiveProvider] = useState<AuthProvider | null>(null)

  useHeaderConfig(
    done || loading
      ? { showLogo: true, showBell: false }
      : step === 1
      ? { showLogo: true, showBell: false }
      : { showBack: true, showBell: false }
  )

  const goNext = () => {
    if (step < TOTAL) { setStep(s => s + 1); return }
    setLoading(true)
    setTimeout(() => { setLoading(false); setDone(true) }, 2000)
  }
  const goBack = () => { if (step > 1) setStep(s => s - 1) }
  const toggleOrg = (id: string) => {
    const org = mydataOrgs.find(o => o.id === id)
    if (org?.required) return
    setConnectedOrgs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleAuthComplete = (method: string) => {
    setActiveProvider(null)
    setAuthMethod(method)
    goNext()
  }

  // ── 로딩 화면 ──
  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 24px', background: 'white' }}>
        <div style={{ width: 88, height: 88, background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, fontSize: 44 }}>🤖</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>AI가 분석 중이에요</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center', lineHeight: 1.6, marginBottom: 40 }}>
          연결된 마이데이터를 바탕으로<br />맞춤 혜택을 찾고 있어요
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 300 }}>
          {['소득·공제 정보 분석 중…', '건강보험·의료비 확인 중…', '맞춤 지원금 탐색 중…'].map((text, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px', background: 'var(--bg-gray)', borderRadius: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === 0 ? 'var(--primary)' : 'var(--border)', flexShrink: 0, animation: i === 0 ? 'pulse 1s infinite' : 'none' }} />
              <span style={{ fontSize: 14, color: i === 0 ? 'var(--primary)' : 'var(--text-tertiary)', fontWeight: i === 0 ? 600 : 400 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // ── 완료 화면 ──
  if (done) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '32px 24px 16px', background: 'white' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* 체크마크 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>가입을 완료했어요</h2>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>아래 내용을 확인해보세요</p>
            </div>
          </div>

          {/* 예상 혜택 요약 */}
          <div style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ background: 'var(--primary)', padding: '16px 20px' }}>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginBottom: 4 }}>예상 환급 · 절세 금액</p>
              <p style={{ color: 'white', fontSize: 32, fontWeight: 700 }}>128만원</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', background: 'white' }}>
              {[
                { label: '절세 공제 항목', value: '87.6만원' },
                { label: '정부 지원금', value: '36만원' },
                { label: '즉시 신청 가능', value: '12만원' },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 20px', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{row.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 연결된 기관 */}
          <div style={{ background: 'var(--bg-gray)', borderRadius: 18, padding: '14px 16px' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>연결된 마이데이터 기관</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {mydataOrgs.filter(o => connectedOrgs.includes(o.id)).map(o => (
                <span key={o.id} className="badge badge-blue" style={{ fontSize: 12 }}>{o.name}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ paddingTop: 16 }}>
          <button className="btn-primary" onClick={() => { login(inputName.trim() || '사용자'); navigate('/') }}>혜택 확인하기</button>
        </div>
      </div>
    )
  }

  // ── 단계별 화면 ──
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'white' }}>
        {/* 상단 진행바 */}
        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ display: 'flex', gap: 5, marginBottom: 6 }}>
            {STEPS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < step ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={goBack} style={{ background: 'none', border: 'none', cursor: step === 1 ? 'default' : 'pointer', padding: '4px 0', opacity: step === 1 ? 0 : 1, display: 'flex', alignItems: 'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <span style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>STEP {step} / {TOTAL}</span>
            <div style={{ width: 28 }} />
          </div>
        </div>

        {/* 콘텐츠 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 24px', display: 'flex', flexDirection: 'column' }}>

          {/* ─── STEP 1: 본인 인증 ─── */}
          {step === 1 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>본인 인증을<br />진행해주세요</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                안전한 서비스 이용을 위해<br />간편하게 인증할 수 있어요
              </p>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>이름</label>
                <input
                  className="input"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  placeholder="실명을 입력해주세요"
                  style={{ fontSize: 15 }}
                />
              </div>

              <div style={{ background: 'var(--primary-light)', borderRadius: 20, padding: '20px', textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 52, marginBottom: 10 }}>🔐</div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  공인인증서 없이도 간편하게<br />본인 인증을 완료할 수 있어요
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 14 }}>
                  {['✅ 개인정보 보호', '✅ 3분 완성', '✅ 무료'].map(t => (
                    <span key={t} style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: '카카오로 인증하기', bg: '#FEE500', color: '#000', icon: '💬', provider: 'kakao' as AuthProvider },
                  { label: '네이버로 인증하기', bg: '#03C75A', color: '#fff', icon: '🟢', provider: 'naver' as AuthProvider },
                  { label: 'PASS로 인증하기',  bg: 'var(--primary)', color: '#fff', icon: '📱', provider: 'pass'  as AuthProvider },
                ].map(btn => (
                  <button key={btn.label}
                    onClick={() => { if (!inputName.trim()) return; setActiveProvider(btn.provider) }}
                    style={{ width: '100%', height: 52, background: btn.bg, color: btn.color, border: authMethod === btn.label ? '2px solid #1A1A2E' : '2px solid transparent', borderRadius: 16, fontSize: 15, fontWeight: 600, fontFamily: 'inherit', cursor: inputName.trim() ? 'pointer' : 'default', opacity: inputName.trim() ? 1 : 0.45, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.15s' }}>
                    <span>{btn.icon}</span>{btn.label}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* ─── STEP 2: 가족 관계 ─── */}
          {step === 2 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>가족 관계를<br />알려주세요</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
                부양가족 공제 혜택을 찾는 데 활용돼요<br />
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>복수 선택 가능</span>
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
                {familyOptions.map(opt => {
                  const selected = selectedFamily.includes(opt.label)
                  return (
                    <button key={opt.label}
                      onClick={() => {
                        if (opt.label === '없음(1인)') { setSelectedFamily(['없음(1인)']); return }
                        setSelectedFamily(prev =>
                          selected ? prev.filter(f => f !== opt.label)
                            : [...prev.filter(f => f !== '없음(1인)'), opt.label]
                        )
                      }}
                      style={{ padding: '14px 8px', background: selected ? 'var(--primary-light)' : 'var(--bg-gray)', border: selected ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: 18, cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit', transition: 'all 0.15s' }}>
                      <div style={{ fontSize: 30, marginBottom: 6 }}>{opt.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: selected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: 2 }}>{opt.label}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.3 }}>{opt.sub}</div>
                    </button>
                  )
                })}
              </div>

              <div style={{ padding: '14px 16px', background: 'var(--bg-gray)', borderRadius: 16 }}>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                  선택: <strong style={{ color: 'var(--text-primary)' }}>
                    {selectedFamily.length === 0 ? '아직 선택하지 않음' : selectedFamily.join(', ')}
                  </strong>
                </p>
              </div>
            </>
          )}

          {/* ─── STEP 3: 소득 정보 ─── */}
          {step === 3 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>소득 정보를<br />알려주세요</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>
                정확한 공제·지원금 계산에 사용해요<br />
                <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>실제 소득과 비슷한 구간을 선택해주세요</span>
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                {[
                  { label: '2,400만원 미만', sub: '기초생활 수급자 포함' },
                  { label: '2,400 ~ 5,000만원', sub: '근로자 평균 소득 구간' },
                  { label: '5,000 ~ 8,000만원', sub: '고소득 근로자' },
                  { label: '8,000만원 이상', sub: '고액 소득자' },
                ].map(range => {
                  const selected = incomeRange === range.label
                  return (
                    <button key={range.label}
                      onClick={() => setIncomeRange(range.label)}
                      style={{ padding: '16px 18px', background: selected ? 'var(--primary-light)' : 'var(--bg-gray)', border: selected ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: 18, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s' }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: selected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: 2 }}>{range.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{range.sub}</p>
                      </div>
                      {selected && (
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3B6FE8"/><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </button>
                  )
                })}
              </div>

              <div style={{ background: '#FFF8E1', borderRadius: 16, padding: '12px 14px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span>⚠️</span>
                <p style={{ fontSize: 12, color: '#92400E', lineHeight: 1.5 }}>소득 정보는 공제 계산에만 사용되며, 마이데이터 연결 시 자동으로 가져올 수 있어요</p>
              </div>
            </>
          )}

          {/* ─── STEP 4: 주식 정보 ─── */}
          {step === 4 && (
            <>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>주식 정보를<br />알려주세요</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 28, lineHeight: 1.6 }}>주식 양도소득세 및 금융소득 공제 계산에 사용돼요</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[{ label: '주식 없음', sub: '주식 투자를 하지 않아요', value: false },
                  { label: '주식 보유 중', sub: '국내·해외 주식을 보유하고 있어요', value: true }].map(opt => {
                  const selected = hasStock === opt.value
                  return (
                    <button key={String(opt.value)} onClick={() => setHasStock(opt.value)}
                      style={{ padding: '18px 20px', background: selected ? 'var(--primary-light)' : 'var(--bg-gray)', border: selected ? '2px solid var(--primary)' : '2px solid transparent', borderRadius: 20, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 600, color: selected ? 'var(--primary)' : 'var(--text-primary)', marginBottom: 2 }}>{opt.label}</p>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{opt.sub}</p>
                      </div>
                      {selected && <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#3B6FE8"/><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                  )
                })}
              </div>

              {hasStock && (
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>보유 주식 평가액 (원)</label>
                  <div style={{ position: 'relative' }}>
                    <input className="input" value={stockAmount} onChange={e => setStockAmount(e.target.value)} placeholder="예: 5,000,000" style={{ paddingRight: 40 }} />
                    <span style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', fontSize: 14 }}>원</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {['500만원 미만', '500~2,000만원', '2,000만원 이상'].map(r => (
                      <button key={r} onClick={() => setStockAmount(r)} style={{ padding: '7px 12px', background: stockAmount === r ? 'var(--primary-light)' : 'var(--bg-gray)', border: stockAmount === r ? '1.5px solid var(--primary)' : '1.5px solid transparent', borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit', color: stockAmount === r ? 'var(--primary)' : 'var(--text-primary)', fontWeight: 600 }}>{r}</button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ─── STEP 5: 마이데이터 연결 ─── */}
          {step === 5 && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 20 }}>🔗</span>
                <span className="badge badge-blue">마이데이터</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.4, marginBottom: 6 }}>마이데이터를<br />연결해주세요</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>연결하면 소득·의료비·금융 정보를 자동으로 가져와 더 정확한 혜택을 찾아드려요</p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 20 }}>🔒 필수 기관은 해제할 수 없어요</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {mydataOrgs.map(org => {
                  const connected = connectedOrgs.includes(org.id)
                  return (
                    <button key={org.id} onClick={() => toggleOrg(org.id)}
                      style={{ padding: '14px 16px', background: connected ? 'var(--primary-light)' : 'white', border: connected ? '1.5px solid var(--primary)' : '1.5px solid var(--border)', borderRadius: 18, cursor: org.required ? 'default' : 'pointer', textAlign: 'left', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s' }}>
                      <div style={{ width: 44, height: 44, background: connected ? 'white' : 'var(--bg-gray)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: connected ? 'var(--shadow-sm)' : 'none' }}>
                        {org.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: connected ? 'var(--primary)' : 'var(--text-primary)' }}>{org.name}</p>
                          {org.required && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--error)', background: '#FEE2E2', padding: '2px 6px', borderRadius: 4 }}>필수</span>}
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{org.sub}</p>
                      </div>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: connected ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div style={{ background: 'var(--bg-gray)', borderRadius: 16, padding: '14px 16px' }}>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  📌 연결된 기관: <strong style={{ color: 'var(--text-primary)' }}>{connectedOrgs.length}개</strong><br />
                  수집된 정보는 혜택 분석에만 활용되며, 제3자에게 제공되지 않아요
                </p>
              </div>
            </>
          )}
        </div>

        {/* 하단 버튼 */}
        <div style={{ padding: '0 24px 16px', background: 'white' }}>
          {step === 1 ? (
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-tertiary)' }}>위 버튼을 눌러 인증 방법을 선택해주세요</p>
          ) : (
            <button className="btn-primary" onClick={goNext}
              style={{ opacity: step === 3 && !incomeRange ? 0.5 : 1 }}
              disabled={step === 3 && !incomeRange}>
              {step === TOTAL ? '마이데이터 연결하고 분석 시작' : '다음'}
            </button>
          )}
        </div>
      </div>

      {/* 인증 모달 오버레이 */}
      {activeProvider && (
        <AuthModal
          provider={activeProvider}
          onComplete={() => {
            const labelMap: Record<AuthProvider, string> = {
              kakao: '카카오로 인증하기',
              naver: '네이버로 인증하기',
              pass:  'PASS로 인증하기',
            }
            handleAuthComplete(labelMap[activeProvider])
          }}
          onClose={() => setActiveProvider(null)}
        />
      )}
    </div>
  )
}
