import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../../data/kimgodsaeng'

const quickMenus = [
  { icon: '📋', label: '신청 내역' },
  { icon: '📅', label: '일일 알림' },
  { icon: '🤖', label: 'AI 챗봇' },
  { icon: '✏️', label: '편집' },
]

const settings = [
  { label: '개인 정보 수정 및 동의', icon: '👤' },
  { label: '가족·재산 정보 수정', icon: '🏠' },
  { label: '소득 조건 설정', icon: '💰' },
  { label: 'AI 코치 말투 변경', icon: '🤖' },
  { label: '고객센터', icon: '🎧' },
  { label: '공지사항', icon: '📢' },
  { label: '앱 정보', icon: 'ℹ️' },
  { label: '로그아웃', icon: '↪️' },
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
    : '27세 · 행복날 수준 · 1인 가구'
  useHeaderConfig({ title: '마이페이지', showBell: true, badgeCount: 2 })

  const handleSetting = (label: string) => {
    if (label === '로그아웃') {
      logout()
      navigate('/')
      return
    }

    if (label === 'AI 코치 말투 변경') {
      navigate('/chatbot/init')
    }
  }

  return (
    <div>
      {/* Profile */}
      <div style={{ background: 'white', padding: '20px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #667eea, #764ba2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>🦊</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{userName}님 ›</p>
            <p style={{ maxWidth: 190, overflow: 'hidden', color: 'var(--text-secondary)', fontSize: 11, lineHeight: 1.35, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileMeta}</p>
          </div>
          <button style={{ background: 'var(--primary-light)', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: 'var(--primary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            정보 수정
          </button>
        </div>

        <div style={{ background: 'var(--primary)', borderRadius: 16, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 4 }}>지금까지 받은 혜택 🎁</p>
          <p style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{isHanbeoteam ? '총 2,400,000원' : isKimgodsaeng ? '총 950,000원' : '총 1,236,000원'}</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 14 }}>{isHanbeoteam ? '작년 근로장려금 + 매월 아동수당 합산' : isKimgodsaeng ? '작년 월세 환급금 + K-패스 교통비 환급' : '2024.01 ~ 현재까지'}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {(isHanbeoteam
              ? [{ label: '근로장려금', amount: '1,560,000원' }, { label: '아동수당', amount: '840,000원' }, { label: '신청 임박', amount: '3건' }]
              : isKimgodsaeng
              ? [{ label: '월세 환급', amount: '720,000원' }, { label: 'K-패스', amount: '230,000원' }, { label: '예상 환급', amount: '145만원' }]
              : [{ label: '절세 혜택', amount: '876,000원' }, { label: '정부 지원금', amount: '360,000원' }, { label: '신청 중인 금액', amount: '120,000원' }]
            ).map((item, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{item.amount}</p>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 12, background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 8, padding: '8px 0', width: '100%', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            혜택 상세 내역 확인하기 ›
          </button>
        </div>
      </div>

      {/* Quick menus */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>자주 쓰는 메뉴</span>
          <button style={{ background: 'none', border: 'none', fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer' }}>편집</button>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {quickMenus.map((m) => (
            <button key={m.label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, background: 'var(--bg-gray)', border: 'none', borderRadius: 14, padding: '14px 8px', cursor: 'pointer', fontFamily: 'inherit' }}>
              <span style={{ fontSize: 22 }}>{m.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Benefit summary */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>나의 혜택 요약</p>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {[
            ...(isHanbeoteam
              ? [
                { icon: '💼', label: '연소득', value: '2,600만', sub: '장려금 검토', color: '#EDE9FE', textColor: '#7C3AED' },
                { icon: '👩‍👧', label: '가족 형태', value: '한부모', sub: '자녀 1명', color: '#D1FAE5', textColor: '#059669' },
                { icon: '📅', label: '이번 달 신청', value: '3건', sub: '마감 임박', color: 'var(--primary-light)', textColor: 'var(--primary)' },
              ]
              : isKimgodsaeng
              ? [
                { icon: '💼', label: '연소득', value: '4,200만', sub: '공기업 신입', color: '#EDE9FE', textColor: '#7C3AED' },
                { icon: '🏠', label: '주거 형태', value: '월세', sub: '무주택 1인', color: '#D1FAE5', textColor: '#059669' },
                { icon: '💳', label: '소비 전략', value: '체크', sub: '전환 추천', color: 'var(--primary-light)', textColor: 'var(--primary)' },
              ]
              : [
                { icon: '📊', label: '소득 분석', value: '12%', sub: '전국 상위 수준', color: '#EDE9FE', textColor: '#7C3AED' },
                { icon: '🎯', label: '공제 달성률', value: '5건', sub: '남은 수량', color: '#D1FAE5', textColor: '#059669' },
                { icon: '📅', label: '이번 달 신청', value: '3건', sub: '처리 중', color: 'var(--primary-light)', textColor: 'var(--primary)' },
              ]),
          ].map((b) => (
            <div key={b.label} style={{ flex: 1, background: b.color, borderRadius: 14, padding: '14px 12px' }}>
              <p style={{ fontSize: 22, marginBottom: 4 }}>{b.icon}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{b.label}</p>
              <p style={{ fontSize: 20, fontWeight: 700, color: b.textColor }}>{b.value}</p>
              <p style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{b.sub}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'var(--primary-light)', borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🤖</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>{isHanbeoteam ? '한버팀님 맞춤 공제 후보가 있어요!' : isKimgodsaeng ? '김갓생님 소비 전략을 바꿀 타이밍이에요!' : '더 많은 혜택을 놓치지 마요!'}</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{isHanbeoteam ? '어린이집 특별활동비 이체 내역을 확인해 보세요' : isKimgodsaeng ? '신용카드 기준치 초과, 체크카드 전환을 추천해요' : '새로운 혜택도 3건 있어요!'}</p>
          </div>
          <button onClick={() => navigate('/chatbot')} style={{ background: 'var(--primary)', border: 'none', borderRadius: 8, padding: '8px 12px', color: 'white', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            확인하기 ›
          </button>
        </div>
      </div>

      {/* Settings */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>설정 및 정보</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {settings.map((s, i) => (
            <button key={i} onClick={() => handleSetting(s.label)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', background: 'none', border: 'none', borderBottom: i < settings.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
              <span style={{ fontSize: 18, width: 24 }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{s.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>시연용 페르소나 데이터</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => login(HANBEOTEAM_NAME)} style={{ height: 44, border: '1.5px solid var(--primary)', borderRadius: 12, background: userName === HANBEOTEAM_NAME ? 'var(--primary)' : 'var(--primary-light)', color: userName === HANBEOTEAM_NAME ? 'white' : 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              한버팀
            </button>
            <button onClick={() => login(KIMGODSAENG_NAME)} style={{ height: 44, border: '1.5px solid var(--primary)', borderRadius: 12, background: userName === KIMGODSAENG_NAME ? 'var(--primary)' : 'white', color: userName === KIMGODSAENG_NAME ? 'white' : 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              김갓생
            </button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 16 }}>v1.0.0</p>
      </div>
    </div>
  )
}
