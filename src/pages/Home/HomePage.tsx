import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { useChatbotCoach } from '../../context/ChatbotCoachContext'
import { HANBEOTEAM_NAME, hanbeoteamHome } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengHome } from '../../data/kimgodsaeng'
import { useMissions } from '../../hooks/useMissions'
import Emoji from '../../components/Emoji/Emoji'
import { Bot, TrendingUp, MessageCircle, Building, Sparkles } from 'lucide-react'
import heroWallet from '../../assets/hero-wallet-blue.png'


export default function HomePage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const { selectedCoach } = useChatbotCoach()
  const isHanbeoteam = userName === HANBEOTEAM_NAME
  const isKimgodsaeng = userName === KIMGODSAENG_NAME
  const homeData = isHanbeoteam ? hanbeoteamHome : isKimgodsaeng ? kimgodsaengHome : {
    totalBenefit: '315',
    amountLabel: '총 받을 수 있는 혜택',
    headline: '놓칠 뻔한 혜택이<br/><span style="color:#3B6FE8">총 315만 원</span>이에요!',
    summary: '',
    benefits: [],
    knowledge: { title: '', desc: '', route: '/' },
  }
  useHeaderConfig({ showLogo: true, showBell: true, badgeCount: 2 })

  const { nextMissions } = useMissions(userName ?? '')
  const pendingCount = nextMissions.length

  return (
    <div style={{ background: 'var(--bg-default)', minHeight: '100%', paddingBottom: 24 }}>

      {/* 인사말 */}
      <div style={{ padding: '20px 16px 0', background: 'white' }}>
        <p style={{ fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, marginBottom: 4 }}>
          절약 AI가 최근 금융 활동을 확인했어요!
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>
          안녕하세요, <span style={{ color: 'var(--primary)' }}>{userName}</span>님
        </h1>
      </div>

      {/* AI 코치 카드 */}
      <div style={{ margin: '0 16px 12px', background: 'var(--primary)', borderRadius: 24, padding: '14px 16px 16px', position: 'relative', overflow: 'hidden' }}>
        {/* 말풍선 태그 */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 18 }}>
          <div style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 12, padding: '7px 14px' }}>
            <span style={{ fontSize: 12, color: 'white', fontWeight: 700 }}>놓치기 쉬운 혜택도 챙겨드릴게요!</span>
          </div>
          {/* 말풍선 꼬리 */}
          <div style={{ position: 'absolute', bottom: -7, left: 18, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '8px solid rgba(255,255,255,0.22)' }} />
        </div>

        {/* 중앙 레이아웃: 코치 | 텍스트 | 이미지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, position: 'relative', zIndex: 1 }}>
          {/* 코치 아바타 - 얼굴 줌인 */}
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedCoach
              ? <img src={selectedCoach.image} alt="" style={{ width: 130, height: 130, objectFit: 'cover', objectPosition: 'center top', marginTop: 18 }} />
              : <Bot size={36} color="white" />}
          </div>

          {/* 텍스트 */}
          <div style={{ flex: 1, paddingLeft: 8, paddingRight: 68 }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 2 }}>혜택 가능성</p>
            <p style={{ color: 'white', fontSize: 22, fontWeight: 800, lineHeight: 1.1, marginBottom: 6 }}>
              {pendingCount}건
            </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, marginBottom: 2 }}>예상 절세/지원 가능 금액</p>
            <p style={{ color: 'white', fontSize: 20, fontWeight: 900 }}>최대 {homeData.totalBenefit}만원</p>
          </div>

        </div>

        <img
          src={heroWallet}
          alt=""
          style={{ position: 'absolute', top: 36, right: -4, width: 126, height: 'auto', pointerEvents: 'none' }}
        />

        <button
          onClick={() => navigate('/ai-benefits')}
          style={{ position: 'relative', zIndex: 1, width: '100%', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 12, padding: '11px 0', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          AI가 찾은 혜택 보기 →
        </button>
      </div>

      {/* 오늘의 추천 항목 */}
      <div style={{ margin: '0 16px 12px', background: 'white', borderRadius: 20, padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>오늘의 추천 항목</span>
          <button onClick={() => navigate('/mypage')} style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            전체 보기 ›
          </button>
        </div>

        {nextMissions.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', padding: '12px 0' }}>모든 미션을 완료했어요</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {nextMissions.slice(0, 3).map((m, i) => (
              <div
                key={m.id}
                onClick={() => navigate('/mypage')}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none', cursor: 'pointer' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Emoji char={m.emoji} size={22} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{m.title}</p>
                  <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{m.sub}</p>
                </div>
                {m.badge ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: m.badgeColor, background: (m.badgeColor ?? '#000') + '18', borderRadius: 8, padding: '3px 8px', flexShrink: 0 }}>{m.badge}</span>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 혜택 바로가기 */}
      <div style={{ margin: '0 16px 12px', background: 'white', borderRadius: 20, padding: '16px' }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: 14 }}>혜택 바로가기</span>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          {[
            { icon: TrendingUp, label: '절세 추천', desc: '연말정산·세액공제 중심', route: '/recommend', bg: '#F0FBF4', iconBg: '#D1FAE5', color: '#16A34A' },
            { icon: Building, label: '정책 추천', desc: '정부/지자체 지원사업 중심', route: '/policy', bg: '#EFF6FF', iconBg: '#DBEAFE', color: '#2563EB' },
            { icon: Sparkles, label: '숨은 공제 탐지', desc: '카드·계좌 기반 AI 감지 알림', route: '/ai-benefits', bg: '#FAF5FF', iconBg: '#EDE9FE', color: '#7C3AED' },
          ].map(({ icon: Icon, label, desc, route, bg, iconBg, color }) => (
            <button
              key={label}
              onClick={() => navigate(route)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '14px 12px', background: bg, border: 'none', borderRadius: 16, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon size={20} color={color} strokeWidth={2} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>{label}</p>
              <p style={{ fontSize: 10, color: 'var(--text-tertiary)', lineHeight: 1.4, marginBottom: 10 }}>{desc}</p>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <span style={{ fontSize: 13, color, fontWeight: 700 }}>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* AI 상담 CTA */}
      <div style={{ margin: '0 16px' }}>
        <div
          onClick={() => navigate('/chatbot')}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'white', border: '1.5px solid var(--border)', borderRadius: 20, cursor: 'pointer' }}
        >
          {/* 얼굴 줌인 아바타 */}
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary-light)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {selectedCoach
              ? <img src={selectedCoach.image} alt="" style={{ width: 88, height: 88, objectFit: 'cover', objectPosition: 'center top', marginTop: 14 }} />
              : <Bot size={24} color="var(--primary)" />}
          </div>

          {/* 텍스트 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>궁금한 점이 있으신가요?</p>
            <p style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>AI에게 물어보면 쉽고 정확하게 알려드려요.</p>
          </div>

          {/* 버튼 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary-light)', border: '1.5px solid var(--primary)', borderRadius: 99, padding: '7px 12px', flexShrink: 0 }}>
            <MessageCircle size={14} color="var(--primary)" strokeWidth={2.5} />
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>AI에게 질문하기</span>
          </div>
        </div>
      </div>

    </div>
  )
}
