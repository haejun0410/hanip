import { useNavigate, useLocation } from 'react-router-dom'

const tabs = [
  {
    key: 'home', label: '홈', path: '/',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#3B6FE8' : 'none'} stroke={active ? '#3B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'recommend', label: '절세추천', path: '/recommend',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#3B6FE8' : 'none'} stroke={active ? '#3B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
  },
  { key: 'chatbot', label: 'AI도우미', path: '/chatbot', center: true, icon: () => null },
  {
    key: 'policy', label: '정책', path: '/policy',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#3B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    key: 'mypage', label: '마이페이지', path: '/mypage',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#3B6FE8' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    if (path === '/chatbot') return location.pathname.startsWith('/chatbot') || location.pathname.startsWith('/ai-benefits')
    return location.pathname.startsWith(path)
  }

  const handleTab = (path: string) => {
    navigate(path)
  }

  return (
    <nav style={{
      height: 'var(--bottom-nav-height)',
      background: 'white',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100,
      flexShrink: 0,
    }}>
      {tabs.map((tab) => {
        const active = isActive(tab.path)
        if (tab.center) {
          return (
            <button key={tab.key} onClick={() => handleTab(tab.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', background: 'none', border: 'none', cursor: 'pointer', paddingBottom: 8 }}>
              <div style={{ width: 52, height: 52, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: -4, boxShadow: '0 4px 16px rgba(59,111,232,0.4)', transform: 'translateY(-10px)' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--primary)', marginTop: 2 }}>{tab.label}</span>
            </button>
          )
        }
        return (
          <button key={tab.key} onClick={() => handleTab(tab.path)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', height: '100%' }}>
            {tab.icon(active)}
            <span style={{ fontSize: 10, fontWeight: 600, color: active ? 'var(--primary)' : '#9CA3AF' }}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
