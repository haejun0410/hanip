import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'

const features = [
  {
    color: '#EBF1FF',
    iconColor: '#3B6FE8',
    title: '맞춤 절세 추천',
    desc: '내 소득·지출 기반으로\n아직 챙기지 못한 공제 항목을 찾아드려요',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3B6FE8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
    ),
  },
  {
    color: '#D1FAE5',
    iconColor: '#059669',
    title: '정부 지원금 탐색',
    desc: '청년·복지·주거 정책 중\n지금 신청 가능한 혜택만 모아요',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    color: '#EDE9FE',
    iconColor: '#7C3AED',
    title: '절세 상담',
    desc: '세금·공제·복지 관련\n궁금한 점을 바로 물어보세요',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    color: '#FEF3C7',
    iconColor: '#D97706',
    title: '신청 기간 알림',
    desc: '마감 임박한 혜택을\n놓치지 않게 미리 알려드려요',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
]

const reviews = [
  { name: '이○○ · 직장인 27세', text: '연말정산 때만 챙겼는데, 한입 덕분에 평소에도 20만원 더 받았어요.' },
  { name: '김○○ · 자영업자 34세', text: '종합소득세 신고 때 어떤 항목을 빠뜨렸는지 바로 확인할 수 있어서 좋았어요.' },
  { name: '박○○ · 대학생 22세', text: '국가장학금 신청 기간을 놓칠 뻔했는데 알림 덕분에 제때 신청했어요.' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  useHeaderConfig({ showLogo: true, showBell: false })
  const goLogin = () => navigate('/login')

  return (
    <div style={{ background: 'white', minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: 'var(--primary)', padding: '48px 24px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <img src="/logo.png" alt="한입" style={{ height: 34, marginBottom: 24, filter: 'brightness(0) invert(1)', objectFit: 'contain' }} />
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'white', lineHeight: 1.45, marginBottom: 12 }}>
          지금 놓치고 있는<br />공제·지원금이 있어요
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7, marginBottom: 32 }}>
          내 소득과 지출을 분석해<br />받을 수 있는 혜택을 한눈에 보여드려요
        </p>
        <button onClick={goLogin} style={{ background: 'white', color: 'var(--primary)', border: 'none', borderRadius: 12, padding: '15px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          무료로 시작하기
        </button>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 10 }}>공인인증서 없이 · 3분 완성</p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.12)', borderRadius: 99, padding: '10px 20px', marginTop: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
          <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: 500 }}>사용자 평균 절약액 <strong style={{ color: 'white' }}>연 128만원</strong></span>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '32px 20px 24px' }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 6 }}>한입이 해드리는 것들</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>복잡한 세금과 복지, 한 번에 정리해드려요</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f) => (
            <button key={f.title} onClick={goLogin} style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 16, padding: '18px 14px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit' }}>
              <div style={{ width: 44, height: 44, background: f.color, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                {f.icon}
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview banner */}
      <div style={{ margin: '0 20px 24px', background: 'var(--primary-light)', borderRadius: 16, padding: '20px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ width: 44, height: 44, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 3 }}>지금 확인해보세요</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>내 공제 한도 <span style={{ color: 'var(--primary)' }}>120만원</span></p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>아직 신청하지 않은 혜택이 남아있어요</p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '0 20px 24px' }}>
        <h2 style={{ fontSize: 19, fontWeight: 700, marginBottom: 20 }}>시작하기 너무 쉬워요</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            {
              step: '01',
              title: '간단한 정보 입력',
              desc: '소득·가족 정보만 입력하면 끝. 3분이면 충분해요',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
            },
            {
              step: '02',
              title: '공제 항목 자동 매칭',
              desc: '수백 개 공제·지원금 중 내 조건에 맞는 것만 추려요',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
            },
            {
              step: '03',
              title: '바로 신청',
              desc: '신청 방법부터 필요 서류까지 단계별로 안내해요',
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
            },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {item.icon}
              </div>
              <div style={{ flex: 1, paddingTop: 2 }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.title}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ background: 'var(--bg-gray)', padding: '24px 20px' }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>사용자 후기</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.7, marginBottom: 10 }}>"{r.text}"</p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>— {r.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '28px 20px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>지금 바로 내 혜택 확인하기</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>가입비·이용료 없이 무료로 사용하세요</p>
        <button onClick={goLogin} className="btn-primary">
          무료로 시작하기
        </button>
      </div>
    </div>
  )
}
