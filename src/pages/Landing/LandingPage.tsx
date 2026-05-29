import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'

const features = [
  {
    emoji: '💰',
    color: '#EBF1FF',
    title: '맞춤 절세 추천',
    desc: '내 소득·지출 기반으로\n놓친 공제 항목을 찾아드려요',
  },
  {
    emoji: '🏛️',
    color: '#D1FAE5',
    title: '정부 지원금 탐색',
    desc: '청년·복지·주거 정책 중\n지금 신청 가능한 혜택만 모아요',
  },
  {
    emoji: '🤖',
    color: '#EDE9FE',
    title: 'AI 도우미',
    desc: '세금·공제·복지 관련\n무엇이든 물어보세요',
  },
  {
    emoji: '📅',
    color: '#FEF3C7',
    title: '신청 기간 알림',
    desc: '마감 임박한 혜택을\n놓치지 않게 미리 알려드려요',
  },
]

const reviews = [
  { name: '이○○ · 직장인 27세', text: '연말정산 때만 챙겼는데, 한입 덕분에 평소에도 20만원 더 받았어요!' },
  { name: '김○○ · 자영업자 34세', text: '종합소득세 신고가 너무 복잡했는데 AI가 다 설명해줬어요 👍' },
  { name: '박○○ · 대학생 22세', text: '국가장학금 신청 기간 놓칠뻔 했는데 알림 덕분에 제때 신청했어요' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  useHeaderConfig({ showLogo: true, showBell: false })
  const goLogin = () => navigate('/login')

  return (
    <div style={{ background: 'white', minHeight: '100%' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(160deg, #3B6FE8 0%, #6B4FE8 100%)', padding: '48px 24px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -40, width: 200, height: 200, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
        <img src="/logo.png" alt="한입" style={{ height: 36, marginBottom: 24, filter: 'brightness(0) invert(1)', objectFit: 'contain' }} />
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', lineHeight: 1.4, marginBottom: 12 }}>
          지금 놓치고 있는<br />공제·지원금이 있어요 💸
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 32 }}>
          나에게 딱 맞는 절세 혜택과 정부 지원금을<br />AI가 3분 만에 찾아드려요
        </p>
        <button onClick={goLogin} style={{ background: 'white', color: 'var(--primary)', border: 'none', borderRadius: 14, padding: '16px 36px', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
          무료로 시작하기 →
        </button>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 12 }}>공인인증서 없이 · 3분 완성</p>

        {/* Mock amount badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.15)', borderRadius: 99, padding: '10px 20px', marginTop: 24, backdropFilter: 'blur(8px)' }}>
          <span style={{ fontSize: 20 }}>🎉</span>
          <span style={{ color: 'white', fontSize: 14, fontWeight: 600 }}>평균 사용자 절약 금액 <strong>128만원</strong></span>
        </div>
      </div>

      {/* Features */}
      <div style={{ padding: '32px 20px 24px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 6 }}>한입이 해드리는 것들</h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', textAlign: 'center', marginBottom: 24 }}>복잡한 세금과 복지, 한입에 해결하세요</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {features.map((f) => (
            <button key={f.title} onClick={goLogin} style={{ background: 'white', border: '1.5px solid var(--border)', borderRadius: 18, padding: '20px 16px', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: 48, height: 48, background: f.color, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 12 }}>
                {f.emoji}
              </div>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>{f.title}</p>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{f.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Preview banner */}
      <div style={{ margin: '0 20px 24px', background: 'var(--primary-light)', borderRadius: 20, padding: '24px 20px', display: 'flex', gap: 16, alignItems: 'center' }}>
        <div style={{ fontSize: 48, lineHeight: 1 }}>📊</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, marginBottom: 4 }}>지금 바로 확인해보세요</p>
          <p style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>내 공제 한도 <span style={{ color: 'var(--primary)' }}>120만원</span></p>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>아직 신청하지 않은 혜택이 남아있어요</p>
        </div>
      </div>

      {/* How it works */}
      <div style={{ padding: '0 20px 24px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>시작하기 너무 쉬워요</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { step: '01', title: '간단한 정보 입력', desc: '소득·가족 정보만 입력하면 끝! 3분이면 충분해요', emoji: '✏️' },
            { step: '02', title: 'AI가 분석해드려요', desc: '수백 개 공제·지원금 중 나에게 맞는 것만 추려요', emoji: '🤖' },
            { step: '03', title: '바로 신청하세요', desc: '신청 방법부터 필요 서류까지 단계별로 안내해요', emoji: '✅' },
          ].map((item) => (
            <div key={item.step} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, background: 'var(--primary)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>{item.step}</span>
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{item.emoji} {item.title}</p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div style={{ background: 'var(--bg-gray)', padding: '24px 20px' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>사용자 후기</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 14, padding: '16px' }}>
              <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: 8 }}>"{r.text}"</p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600 }}>— {r.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '28px 20px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>지금 바로 내 혜택 확인하기</p>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>가입비·이용료 없이 무료로 사용하세요</p>
        <button onClick={goLogin} className="btn-primary" style={{ maxWidth: 320, margin: '0 auto' }}>
          무료로 시작하기 →
        </button>
      </div>
    </div>
  )
}
