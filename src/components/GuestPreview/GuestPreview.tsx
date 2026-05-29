import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  title?: string
  desc?: string
}

export default function GuestPreview({
  children,
  title = '로그인하면 볼 수 있어요',
  desc = '무료로 가입하고 나에게 맞는\n공제·지원금 혜택을 확인해보세요',
}: Props) {
  const navigate = useNavigate()

  return (
    <div style={{ position: 'relative', minHeight: '100%' }}>
      {/* Blurred content */}
      <div style={{ filter: 'blur(3px)', pointerEvents: 'none', userSelect: 'none', opacity: 0.6 }}>
        {children}
      </div>

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
        background: 'linear-gradient(to bottom, rgba(245,247,255,0.3) 0%, rgba(245,247,255,0.85) 40%)',
      }}>
        <div style={{
          background: 'white',
          borderRadius: 24,
          padding: '32px 24px',
          textAlign: 'center',
          boxShadow: '0 8px 40px rgba(59,111,232,0.18)',
          width: '100%',
          maxWidth: 300,
          border: '1.5px solid var(--border)',
        }}>
          <div style={{ width: 64, height: 64, background: 'var(--primary-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 30 }}>
            🔒
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24, whiteSpace: 'pre-line' }}>
            {desc}
          </p>
          <button
            className="btn-primary"
            onClick={() => navigate('/login')}
            style={{ marginBottom: 12 }}
          >
            무료로 시작하기
          </button>
          <button
            onClick={() => navigate('/login')}
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit', width: '100%', padding: '4px 0' }}
          >
            이미 계정이 있어요 → 로그인
          </button>
        </div>
      </div>
    </div>
  )
}
