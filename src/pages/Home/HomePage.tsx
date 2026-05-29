import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { HANBEOTEAM_NAME, hanbeoteamCalendarEvents, hanbeoteamHome } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME, kimgodsaengCalendarEvents, kimgodsaengHome } from '../../data/kimgodsaeng'
import heroBenefitsImage from '../../assets/hero-benefits.png'
import heroGlassesImage from '../../assets/hero-glasses.png'

type CalEvent = {
  id: string
  type: 'policy' | 'tax'
  badge: string
  badgeColor: string
  emoji: string
  title: string
  period: string
  route: string
}

const EVENTS: Record<string, CalEvent[]> = {
  '2025-05-05': [
    { id: 'e1', type: 'policy', badge: '청년', badgeColor: 'badge-blue', emoji: '🏦', title: '청년내일채움공제 신청 기간', period: '~2025.05.14', route: '/policy/1' },
  ],
  '2025-05-07': [
    { id: 'e2', type: 'policy', badge: '청년', badgeColor: 'badge-blue', emoji: '🏦', title: '청년내일채움공제 신청 마감 D-7', period: '마감 D-7', route: '/policy/1' },
    { id: 'e3', type: 'tax', badge: '세금', badgeColor: 'badge-orange', emoji: '📊', title: '종합소득세 신고 기간', period: '~2025.05.31', route: '/recommend/card' },
  ],
  '2025-05-14': [
    { id: 'e4', type: 'policy', badge: '청년', badgeColor: 'badge-blue', emoji: '🏦', title: '청년내일채움공제 신청 마감', period: '오늘 마감!', route: '/policy/1' },
    { id: 'e5', type: 'tax', badge: '세금', badgeColor: 'badge-orange', emoji: '📊', title: '종합소득세 신고 기간 중', period: '~2025.05.31', route: '/recommend/card' },
  ],
  '2025-05-20': [
    { id: 'e6', type: 'policy', badge: '주거', badgeColor: 'badge-orange', emoji: '🏠', title: '주거급여 신청 접수 기간', period: '~2025.05.31', route: '/policy/2' },
    { id: 'e7', type: 'tax', badge: '의료비', badgeColor: 'badge-blue', emoji: '👓', title: '안경/렌즈 공제 영수증 등록', period: '연중 신청 가능', route: '/recommend/glasses' },
  ],
  '2025-05-25': [
    { id: 'e8', type: 'policy', badge: '복지', badgeColor: 'badge-green', emoji: '🏥', title: '건강검진비 공제 서류 안내', period: '연중 가능', route: '/recommend/health' },
  ],
  '2025-05-31': [
    { id: 'e9', type: 'tax', badge: '세금', badgeColor: 'badge-orange', emoji: '📊', title: '종합소득세 신고 마감', period: '오늘 마감!', route: '/recommend/card' },
    { id: 'e10', type: 'policy', badge: '주거', badgeColor: 'badge-orange', emoji: '🏠', title: '주거급여 신청 마감', period: '오늘 마감!', route: '/policy/2' },
    { id: 'e11', type: 'tax', badge: '주거비', badgeColor: 'badge-purple', emoji: '🏠', title: '월세 세액공제 신청', period: '마감일', route: '/recommend/rent' },
  ],
}

function toKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function getEvents(date: Date): CalEvent[] {
  return EVENTS[toKey(date)] ?? []
}

const APP_TODAY = new Date(2025, 4, 14)

export default function HomePage() {
  const navigate = useNavigate()
  const { userName } = useAuth()
  const isHanbeoteam = userName === HANBEOTEAM_NAME
  const isKimgodsaeng = userName === KIMGODSAENG_NAME
  const eventsByDate: Record<string, CalEvent[]> = isHanbeoteam ? hanbeoteamCalendarEvents : isKimgodsaeng ? kimgodsaengCalendarEvents : EVENTS
  const personaToday = isKimgodsaeng ? new Date(2025, 9, 20) : APP_TODAY
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

  const [selectedDate, setSelectedDate] = useState<Date>(personaToday)
  const [selectedEvents, setSelectedEvents] = useState<CalEvent[]>(eventsByDate[toKey(personaToday)] ?? [])

  const handleDateChange = (val: unknown) => {
    const date = Array.isArray(val) ? (val as Date[])[0] : val instanceof Date ? val : null
    if (date) {
      setSelectedDate(date)
      setSelectedEvents(eventsByDate[toKey(date)] ?? [])
    }
  }

  const fmtDate = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`

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

      {/* ── 일정 캘린더 ── */}
      <div className="schedule-calendar-section">
        <div className="schedule-calendar-header">
          <div>
            <span className="schedule-calendar-kicker">일정 관리</span>
            <h3 className="schedule-calendar-title">📅 일정 캘린더</h3>
          </div>
          <span className="schedule-calendar-hint">날짜를 눌러 일정 확인</span>
        </div>

        <Calendar
          className="hanip-calendar"
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={handleDateChange as any}
          value={selectedDate}
          locale="ko-KR"
          calendarType="gregory"
          formatDay={(_locale, date) => String(date.getDate())}
          tileContent={({ date, view }) => {
            if (view !== 'month') return null
            const evs = getEvents(date)
            if (evs.length === 0) return null
            return (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 2, marginTop: 1 }}>
                {evs.slice(0, 2).map((e, i) => (
                  <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: e.type === 'policy' ? '#3B6FE8' : '#F59E0B', flexShrink: 0 }} />
                ))}
              </div>
            )
          }}
          tileClassName={({ date, view }) => {
            if (view !== 'month') return null
            const day = date.getDay()
            if (day === 0) return 'cal-sun'
            if (day === 6) return 'cal-sat'
            return null
          }}
        />

        <div className="calendar-legend">
          {[{ color: '#3B6FE8', label: '정책' }, { color: '#F59E0B', label: '세금/공제' }].map(l => (
            <div key={l.label} className="calendar-legend-item">
              <div className="calendar-legend-dot" style={{ background: l.color }} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>

        <div className="selected-schedule-panel">
          <p className="selected-schedule-title">
            {fmtDate(selectedDate)}의 일정
          </p>
          {selectedEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '18px 0', color: 'var(--text-tertiary)', fontSize: 13 }}>
              이 날은 예정된 일정이 없어요
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {selectedEvents.map(ev => (
                <div
                  key={ev.id}
                  onClick={() => navigate(ev.route)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'var(--bg-gray)', borderRadius: 12, cursor: 'pointer' }}
                >
                  <div style={{ width: 40, height: 40, background: ev.type === 'policy' ? '#EBF1FF' : '#FEF3C7', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                    {ev.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ marginBottom: 3 }}>
                      <span className={`badge ${ev.badgeColor}`} style={{ fontSize: 10 }}>{ev.badge}</span>
                    </div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{ev.title}</p>
                    <p style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{ev.period}</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
