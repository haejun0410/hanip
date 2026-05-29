import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamRecommendations } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengRecommendations } from '../../data/kimgodsaeng'

export const recommendItems = [
  { id: 'glasses', emoji: '👓', label: '안경/렌즈',          amount: '10만원',      tag: '#의료비 공제',    iconBg: '#DBEAFE' },
  { id: 'tuition', emoji: '📚', label: '마이스터고 자녀교비', amount: '30만원',      tag: '#교육비 공제',    iconBg: '#EDE9FE' },
  { id: 'health',  emoji: '🏥', label: '건강검진 비용',       amount: '15만원',      tag: '#의료비 공제',    iconBg: '#D1FAE5' },
  { id: 'rent',    emoji: '🏠', label: '월세 세액공제',       amount: '75만원',      tag: '#주거비 공제',    iconBg: '#FEF3C7' },
  { id: 'card',    emoji: '💳', label: '신용카드 사용액',     amount: '최대 30만원', tag: '#신용카드 공제',  iconBg: '#FEE2E2' },
  { id: 'baby',    emoji: '👶', label: '출산/육아 비용',      amount: '20만원',      tag: '#출산·육아 공제', iconBg: '#FCE7F3' },
]

export default function RecommendPage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const items = userName === HANBEOTEAM_NAME
    ? hanbeoteamRecommendations
    : userName === KIMGODSAENG_NAME
    ? kimgodsaengRecommendations
    : recommendItems
  useHeaderConfig({ title: '절세 추천', showBell: true, badgeCount: 2 })

  return (
    <div style={{ background: 'var(--bg-default)', minHeight: '100%' }}>
      <div style={{ padding: '16px 16px 4px' }}>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>지금 받을 수 있는 혜택을 찾아보세요</p>
      </div>

      <div style={{ padding: '12px 16px 16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {items.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(`/recommend/${item.id}`)}
            style={{
              background: 'white',
              borderRadius: 20,
              padding: '16px 14px 14px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div style={{
              width: 52, height: 52,
              background: item.iconBg,
              borderRadius: 18,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
              marginBottom: 12,
            }}>
              {item.emoji}
            </div>

            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.35, paddingRight: 16 }}>
              {item.label}
            </p>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)', marginBottom: 6 }}>
              {item.amount}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{item.tag}</p>

            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* 더 많은 지원금 찾기 배너 */}
      <div style={{
        margin: '0 16px 24px',
        background: 'var(--primary)',
        borderRadius: 20,
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflow: 'hidden',
      }}>
        <div style={{ flex: 1, zIndex: 1 }}>
          <p style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 5 }}>더 많은 지원금 찾기</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: 14 }}>
            나에게 맞는 숨은 공제 혜택을<br />한눈에 찾아드릴게요
          </p>
          <button
            onClick={() => navigate('/chatbot')}
            style={{
              height: 36, padding: '0 16px',
              background: 'white', border: 'none', borderRadius: 18,
              fontSize: 13, fontWeight: 700, color: 'var(--primary)',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            내 맞춤 혜택 찾기 →
          </button>
        </div>
        <div style={{ fontSize: 64, flexShrink: 0, marginLeft: 8, opacity: 0.9 }}>🔍</div>
      </div>
    </div>
  )
}
