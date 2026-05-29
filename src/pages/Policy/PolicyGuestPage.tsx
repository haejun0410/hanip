import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'

const samplePolicies = [
  { emoji: '🎓', title: '국가장학금 지원', tag: '교육', tagColor: 'badge-blue', deadline: 'D-30', org: '한국장학재단', desc: '대학 등록금 부담을 줄여주는 국가장학금' },
  { emoji: '🏠', title: '신혼부부 전세자금 대출', tag: '주거', tagColor: 'badge-orange', deadline: 'D-60', org: '주택도시보증공사', desc: '신혼부부 대상 저금리 전세자금 대출' },
  { emoji: '💼', title: '취업성공패키지', tag: '취업·창업', tagColor: 'badge-purple', deadline: 'D-10', org: '고용노동부', desc: '청년 맞춤형 취업 지원 프로그램' },
  { emoji: '❤️', title: '에너지바우처 지원', tag: '생활·복지', tagColor: 'badge-green', deadline: 'D-5', org: '산업통상자원부', desc: '에너지 취약 계층 전기·가스 요금 지원' },
  { emoji: '👨‍👩‍👧', title: '한부모가족 양육비 지원', tag: '생활·복지', tagColor: 'badge-green', deadline: 'D-20', org: '여성가족부', desc: '한부모 가정 자녀 양육비 월정액 지원' },
]

export default function PolicyGuestPage() {
  const navigate = useNavigate()
  useHeaderConfig({ showLogo: true, showBell: false })

  return (
    <div>
      {/* 헤더 배너 */}
      <div style={{ background: 'white', padding: '16px 16px 12px' }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>정책</h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 14 }}>지금 신청 가능한 정부 지원금을 찾아보세요</p>
        <div style={{ background: 'var(--primary-light)', borderRadius: 16, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🔍</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 2 }}>로그인하면 내 맞춤 정책만 보여드려요</p>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>소득·가족 정보 기반으로 딱 맞는 혜택 추천</p>
          </div>
          <button onClick={() => navigate('/login')} style={{ background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 8, padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
            로그인
          </button>
        </div>
      </div>

      {/* 샘플 2개 정상 */}
      <div className="section" style={{ paddingBottom: 8 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 12 }}>샘플 미리보기 · 이런 정책들이 있어요</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {samplePolicies.slice(0, 2).map((p, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 18, padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, background: 'var(--primary-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{p.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className={`badge ${p.tagColor}`}>{p.tag}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.org}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--error)', background: '#FEE2E2', padding: '2px 6px', borderRadius: 6, marginLeft: 'auto' }}>{p.deadline}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 나머지 블러 + 오버레이 */}
      <div style={{ position: 'relative', padding: '0 16px' }}>
        <div style={{ filter: 'blur(3px)', pointerEvents: 'none', opacity: 0.5, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {samplePolicies.slice(2).map((p, i) => (
            <div key={i} style={{ background: 'white', borderRadius: 18, padding: '14px 16px', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, background: 'var(--primary-light)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>{p.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <span className={`badge ${p.tagColor}`}>{p.tag}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{p.org}</span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{p.title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', borderRadius: 20, padding: '24px', textAlign: 'center', boxShadow: '0 8px 32px rgba(59,111,232,0.15)', border: '1.5px solid var(--border)', width: '85%' }}>
            <p style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>정책 {samplePolicies.length - 2}건 더 있어요</p>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>로그인하면 내 상황에 맞는<br />정책만 골라서 보여드려요</p>
            <button onClick={() => navigate('/login')} className="btn-primary" style={{ height: 44, fontSize: 14 }}>
              로그인하고 전체보기
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  )
}
