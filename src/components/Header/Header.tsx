import { useNavigate } from 'react-router-dom'
import { useHeader } from './HeaderContext'

export default function Header() {
  const navigate = useNavigate()
  const { config } = useHeader()
  const { title, showBack, showBell = true, showLogo, badgeCount = 2, hidden } = config

  if (hidden) return null

  return (
    <header style={{
      height: 'var(--header-height)',
      background: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingLeft: '16px',
      paddingRight: '16px',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      zIndex: 100,
    }}>
      <div style={{ width: 36, display: 'flex', alignItems: 'center' }}>
        {showBack && (
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {showLogo
          ? <img src="/logo.png" alt="한입" style={{ height: 28, objectFit: 'contain' }} />
          : title && <span style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{title}</span>
        }
      </div>

      <div style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        {showBell && (
          <button onClick={() => navigate('/notice')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#1A1A2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {badgeCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: 'var(--error)', color: 'white', borderRadius: '9999px', width: 16, height: 16, fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {badgeCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  )
}
