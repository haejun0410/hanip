import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamHome } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengHome } from '../../data/kimgodsaeng'
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

  return (
    <div style={{ background: 'var(--bg-default)', minHeight: '100%' }}>
      <section className="home-benefit-hero">
        <div className="home-benefit-hero-top">
          <div className="home-benefit-copy">
            <span>중요 알림</span>
            <h1>
              <span className="home-benefit-name">{userName}님,</span>
              <span className="home-benefit-headline" dangerouslySetInnerHTML={{ __html: homeData.headline }} />
            </h1>
            <p>{homeData.summary}</p>
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