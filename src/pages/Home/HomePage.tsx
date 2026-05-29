import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamHome } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengHome } from '../../data/kimgodsaeng'
import { useMissions } from '../../hooks/useMissions'
import Emoji from '../../components/Emoji/Emoji'
import heroBenefitsImage from '../../assets/hero-benefits.png'
import heroGlassesImage from '../../assets/hero-glasses.png'

export default function HomePage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const isHanbeoteam = userName === HANBEOTEAM_NAME
  const isKimgodsaeng = userName === KIMGODSAENG_NAME
  const homeData = isHanbeoteam ? hanbeoteamHome : isKimgodsaeng ? kimgodsaengHome : {
    totalBenefit: '315',
    amountLabel: '총 받을 수 있는 혜택',
    headline: '올해 놓칠 뻔한 혜택이 총 315만 원이에요!',
    summary: '절세(혜택) 추천 항목 3개',
    benefits: [
      { title: '근로장려금 및 자녀장려금', amount: '최대 300만 원', route: '/policy/1' },
      { title: '한부모 소득공제', amount: '기본공제 외 100만 원', route: '/recommend/card' },
      { title: '취학 전 아동 학원비 세액공제', amount: '결제액의 15% 공제', route: '/recommend/glasses' },
    ],
    knowledge: {
      title: '안경 및 렌즈<br />의료비 공제 가능해요',
      desc: '시력교정용 안경과 렌즈 구입비도 공제 대상이에요.',
      route: '/recommend/glasses',
    },
  }
  useHeaderConfig({ showLogo: true, showBell: true, badgeCount: 2 })

  const { doneCount, total, pct, nextMissions } = useMissions(userName ?? '')

  return (
    <div style={{ background: 'var(--bg-default)', minHeight: '100%' }}>
      <section className="home-benefit-hero">
        <div className="home-benefit-hero-top">
          <div className="home-benefit-copy">
            <span>중요 알림</span>
            <h1>
              <span style={{ color: '#3B6FE8' }}>{userName}</span>
              <span className="home-benefit-headline" dangerouslySetInnerHTML={{ __html: '님, ' + homeData.headline }} />
            </h1>
          </div>
          <img src={heroBenefitsImage} alt="" aria-hidden="true" />
        </div>

        <div className="home-benefit-amount-card">
          <div>
            <p>{homeData.amountLabel}</p>
            <strong>{homeData.totalBenefit}<span>만원</span></strong>
          </div>
          <button onClick={() => navigate('/recommend')}>바로 확인하고 신청하기 ›</button>
        </div>

        <div className="home-benefit-mini-list">
          {homeData.benefits.map((item) => (
            <button key={item.title} onClick={() => navigate(item.route)}>
              <strong>{item.title}</strong>
              <span>자세히보기</span>
            </button>
          ))}
        </div>
      </section>

      {/* 내 미션 현황 */}
      <div style={{ padding: '20px 16px 24px', background: 'var(--bg-default)' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>내 미션 보러가기</span>
          <button onClick={() => navigate('/mypage')} style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            전체 보기 ›
          </button>
        </div>

        {/* 진행 카드 */}
        <div style={{ background: 'white', borderRadius: 20, padding: '16px 18px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{doneCount}</span>
              <span style={{ fontSize: 14, color: 'var(--text-secondary)', fontWeight: 600 }}>/ {total} 완료</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'white', background: 'var(--primary)', borderRadius: 99, padding: '4px 10px' }}>{pct}%</span>
          </div>
          <div style={{ height: 7, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>

          {/* 카테고리 바 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>💰 절세 혜택</span>
            <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: 99 }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>{pct}%</span>
          </div>

          {/* 다음 미션 */}
          {nextMissions.length > 0 && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 10 }}>다음 미션</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {nextMissions.slice(0, 2).map((m, i) => (
                  <div
                    key={m.id}
                    onClick={() => navigate('/mypage')}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
                  >
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      <Emoji char={m.emoji} size={24} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{m.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{m.sub}</p>
                    </div>
                    {m.badge ? (
                      <span style={{ fontSize: 11, fontWeight: 700, color: m.badgeColor, background: (m.badgeColor ?? '#000') + '18', borderRadius: 8, padding: '4px 8px', flexShrink: 0 }}>{m.badge}</span>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <section className="home-knowledge-card">
        <div>
          <span>오늘의 지식 한입</span>
          <h2 dangerouslySetInnerHTML={{ __html: homeData.knowledge.title }} />
          <p>{homeData.knowledge.desc}</p>
          <button onClick={() => navigate(homeData.knowledge.route)}>더 알아보기 ›</button>
        </div>
        <img src={heroGlassesImage} alt="" aria-hidden="true" />
      </section>

    </div>
  )
}