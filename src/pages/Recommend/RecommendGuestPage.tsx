import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { recommendItems as sampleItems } from './RecommendPage'

export default function RecommendGuestPage() {
  const navigate = useNavigate()
  useHeaderConfig({ title: '절세 추천', showBell: false })

  return (
    <div>
      {/* 안내 배너 */}
      <div style={{ background: 'var(--primary)', padding: '20px 20px', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginBottom: 4 }}>로그인하면 나에게 맞는 혜택만 보여드려요</p>
        <p style={{ color: 'white', fontSize: 22, fontWeight: 700, marginBottom: 16 }}>이런 혜택들이 있어요 💡</p>
        <button onClick={() => navigate('/login')} style={{ background: 'white', color: 'var(--primary)', border: 'none', borderRadius: 10, padding: '10px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          내 맞춤 혜택 확인하기 →
        </button>
      </div>

      <div style={{ padding: '16px 16px 8px' }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 2 }}>샘플 미리보기</p>
        <p style={{ fontSize: 16, fontWeight: 700 }}>이런 공제 항목들을 찾아드려요</p>
      </div>

      {/* 샘플 카드 2개 - 정상 표시 */}
      <div style={{ padding: '8px 16px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {sampleItems.slice(0, 2).map(item => (
          <div key={item.id} style={{ background: 'white', borderRadius: 16, padding: '16px 14px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', position: 'relative' }}>
            <div style={{ width: 52, height: 52, background: item.iconBg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12 }}>{item.emoji}</div>
            <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.35, paddingRight: 16 }}>{item.label}</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>{item.amount}</p>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.tag}</p>
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* 나머지 카드 - 블러 + 오버레이 */}
      <div style={{ position: 'relative', margin: '12px 16px 0' }}>
        <div style={{ filter: 'blur(3px)', pointerEvents: 'none', opacity: 0.5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {sampleItems.slice(2).map(item => (
            <div key={item.id} style={{ background: 'white', borderRadius: 16, padding: '16px 14px 14px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ width: 52, height: 52, background: item.iconBg, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, marginBottom: 12 }}>{item.emoji}</div>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4, lineHeight: 1.35 }}>{item.label}</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>{item.amount}</p>
              <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.tag}</p>
            </div>
          ))}
        </div>
        {/* 오버레이 */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '24px 24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(59,111,232,0.15)', border: '1.5px solid var(--border)', width: '90%' }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>+4개 항목 더 있어요</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>로그인하면 내 상황에 맞는<br />공제 항목만 골라서 보여드려요</p>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ height: 44, fontSize: 14 }}>
              로그인하고 전체보기
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 32 }} />
    </div>
  )
}
