import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../../data/kimgodsaeng'

const S = '#6B7280'
const sw = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: S, strokeWidth: '2', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const Sw = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: S, strokeWidth: '2', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

const settingsData = [
  {
    label: '개인 정보 수정 및 동의',
    icon: <svg {...sw}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  },
  {
    label: '가족·재산 정보 수정',
    icon: <svg {...sw}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    label: '소득 조건 설정',
    icon: <svg {...sw}><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>,
  },
  {
    label: '상담 말투 변경',
    icon: <svg {...sw}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    label: '고객센터',
    icon: <svg {...sw}><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>,
  },
  {
    label: '공지사항',
    icon: <svg {...sw}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    label: '앱 정보',
    icon: <svg {...sw}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  },
  {
    label: '로그아웃',
    icon: <svg {...sw}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  },
]

const quickMenusData = [
  {
    label: '신청 내역',
    icon: <svg {...Sw}><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="16" y1="12" x2="8" y2="12"/><line x1="12" y1="16" x2="8" y2="16"/></svg>,
  },
  {
    label: '일일 알림',
    icon: <svg {...Sw}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  },
  {
    label: '상담',
    icon: <svg {...Sw}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  },
  {
    label: '편집',
    icon: <svg {...Sw}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  },
]

export default function MyPage() {
  const navigate = useNavigate()
  const { login, logout, userName } = useAuth()
  const isHanbeoteam = userName === HANBEOTEAM_NAME
  const isKimgodsaeng = userName === KIMGODSAENG_NAME
  const profileMeta = isHanbeoteam
    ? '34세 · 중소기업 사무직 · 한부모 가정'
    : isKimgodsaeng
    ? '26세 · 공기업 신입 · 월세 1인가구'
    : '27세 · 1인 가구'
  useHeaderConfig({ title: '마이페이지', showBell: true, badgeCount: 2 })

  const handleSetting = (label: string) => {
    if (label === '로그아웃') { logout(); navigate('/'); return }
    if (label === '상담 말투 변경') navigate('/chatbot/init')
  }

  const summaryRows = isHanbeoteam
    ? [
      { label: '연 소득', value: '2,600만원' },
      { label: '가족 형태', value: '한부모 · 자녀 1명' },
      { label: '이번 달 신청', value: '3건 마감 임박' },
    ]
    : isKimgodsaeng
    ? [
      { label: '연 소득', value: '4,200만원' },
      { label: '주거 형태', value: '무주택 월세' },
      { label: '소비 전략', value: '체크카드 전환 권장' },
    ]
    : [
      { label: '연 소득', value: '상위 12%' },
      { label: '잔여 공제', value: '5건' },
      { label: '이번 달 신청', value: '3건 진행 중' },
    ]

  return (
    <div>
      {/* Profile */}
      <div style={{ background: 'white', padding: '20px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{userName}님</p>
            <p style={{ maxWidth: 190, overflow: 'hidden', color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.4, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileMeta}</p>
          </div>
          <button style={{ background: 'var(--bg-gray)', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            정보 수정
          </button>
        </div>

        <div style={{ background: 'var(--primary)', borderRadius: 20, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>지금까지 받은 혜택</p>
          <p style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{isHanbeoteam ? '2,400,000원' : isKimgodsaeng ? '950,000원' : '1,236,000원'}</p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginBottom: 14 }}>{isHanbeoteam ? '근로장려금 + 매월 아동수당' : isKimgodsaeng ? '월세 환급금 + K-패스 환급' : '2024.01 ~ 현재'}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {(isHanbeoteam
              ? [{ label: '근로장려금', amount: '1,560,000원' }, { label: '아동수당', amount: '840,000원' }, { label: '신청 임박', amount: '3건' }]
              : isKimgodsaeng
              ? [{ label: '월세 환급', amount: '720,000원' }, { label: 'K-패스', amount: '230,000원' }, { label: '예상 환급', amount: '145만원' }]
              : [{ label: '절세 혜택', amount: '876,000원' }, { label: '정부 지원금', amount: '360,000원' }, { label: '신청 중', amount: '120,000원' }]
            ).map((item, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{item.amount}</p>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '8px 0', width: '100%', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            상세 내역 확인하기 ›
          </button>
        </div>
      </div>

      {/* Quick menus */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <span style={{ fontSize: 15, fontWeight: 700, display: 'block', marginBottom: 14 }}>자주 쓰는 메뉴</span>
        <div style={{ display: 'flex', gap: 8 }}>
          {quickMenusData.map((m) => (
            <button key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, background: 'var(--bg-gray)', border: 'none', borderRadius: 18, padding: '14px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
              {m.icon}
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Benefit summary */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>나의 현황</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {summaryRows.map((row, i) => (
            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: i === 0 ? 0 : 14, paddingBottom: 14, borderBottom: i < summaryRows.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{row.label}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{row.value}</span>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, background: 'var(--bg-gray)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{isHanbeoteam ? '추가 공제 후보가 발견됐어요' : isKimgodsaeng ? '소비 전략을 바꿀 타이밍이에요' : '놓친 혜택이 더 있을 수 있어요'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{isHanbeoteam ? '어린이집 특별활동비 이체 내역 확인' : isKimgodsaeng ? '신용카드 기준치 초과 — 체크 전환 권장' : '새로 확인된 혜택 3건'}</p>
          </div>
          <button onClick={() => navigate('/chatbot')} style={{ background: 'var(--primary)', border: 'none', borderRadius: 8, padding: '8px 12px', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            확인하기 ›
          </button>
        </div>
      </div>

      {/* Settings */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>설정 및 정보</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {settingsData.map((s, i) => (
            <button key={i} onClick={() => handleSetting(s.label)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', background: 'none', border: 'none', borderBottom: i < settingsData.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
              <span style={{ width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{s.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>시연용 페르소나 데이터</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => login(HANBEOTEAM_NAME)} style={{ height: 44, border: '1.5px solid var(--primary)', borderRadius: 16, background: userName === HANBEOTEAM_NAME ? 'var(--primary)' : 'var(--primary-light)', color: userName === HANBEOTEAM_NAME ? 'white' : 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              한버팀
            </button>
            <button onClick={() => login(KIMGODSAENG_NAME)} style={{ height: 44, border: '1.5px solid var(--primary)', borderRadius: 16, background: userName === KIMGODSAENG_NAME ? 'var(--primary)' : 'white', color: userName === KIMGODSAENG_NAME ? 'white' : 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              김갓생
            </button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 16 }}>v1.0.0</p>
      </div>
    </div>
  )
}
