import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../../data/kimgodsaeng'

const settings = [
  { label: '공지사항', icon: '📢' },
  { label: '앱 정보', icon: 'ℹ️' },
  { label: '별점 남기기', icon: '⭐' },
  { label: '고객센터', icon: '🎧' },
]

export default function MyPageGuest() {
  const navigate = useNavigate()
  const { login } = useAuth()
  useHeaderConfig({ title: '마이페이지', showBell: false })

  const handlePersonaLogin = (name: string) => {
    login(name)
    navigate('/')
  }

  return (
    <div>
      {/* 로그인 유도 카드 */}
      <div style={{ background: 'white', padding: '32px 20px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
          <div style={{ width: 72, height: 72, background: 'var(--bg-gray)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, marginBottom: 14 }}>
            👤
          </div>
          <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>로그인이 필요해요</p>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6 }}>
            로그인하면 내 혜택 내역,<br />신청 현황, 맞춤 추천을 볼 수 있어요
          </p>
        </div>

        {/* 혜택 미리보기 */}
        <div style={{ background: 'var(--primary-light)', borderRadius: 20, padding: '18px 20px', marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 8 }}>로그인하면 이런 게 보여요</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {[{ icon: '💰', label: '절세 혜택', value: '??만원' }, { icon: '🏛️', label: '지원금', value: '??만원' }, { icon: '📋', label: '신청 현황', value: '?건' }].map((item, i) => (
              <div key={i} style={{ flex: 1, background: 'white', borderRadius: 10, padding: '10px 8px', textAlign: 'center', opacity: 0.7 }}>
                <p style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</p>
                <p style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 2 }}>{item.label}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-tertiary)', filter: 'blur(4px)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-primary" onClick={() => navigate('/login')}>
            로그인 / 회원가입
          </button>
        </div>
      </div>

      {/* 설정 섹션 */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>설정 및 정보</p>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {settings.map((s, i) => (
            <button key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', background: 'none', border: 'none', borderBottom: i < settings.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
              <span style={{ fontSize: 18, width: 24 }}>{s.icon}</span>
              <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>{s.label}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10 }}>시연용 페르소나 데이터</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => handlePersonaLogin(HANBEOTEAM_NAME)} style={{ height: 44, border: '1.5px solid var(--primary)', borderRadius: 16, background: 'var(--primary-light)', color: 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              한버팀
            </button>
            <button onClick={() => handlePersonaLogin(KIMGODSAENG_NAME)} style={{ height: 44, border: '1.5px solid var(--primary)', borderRadius: 16, background: 'white', color: 'var(--primary)', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
              김갓생
            </button>
          </div>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center', marginTop: 16 }}>v1.0.0</p>
      </div>
    </div>
  )
}
