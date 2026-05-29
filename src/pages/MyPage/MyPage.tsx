import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHeaderConfig } from '../../components/Header/useHeaderConfig'
import { useAuth } from '../../context/AuthContext'
import { useChatbotCoach } from '../../context/ChatbotCoachContext'
import { HANBEOTEAM_NAME } from '../../data/hanbeoteam'
import { KIMGODSAENG_NAME } from '../../data/kimgodsaeng'

type Mission = {
  id: string
  emoji: string
  title: string
  sub: string
  badge?: string
  badgeColor?: string
  done: boolean
}

const HANBEOTEAM_MISSIONS: Mission[] = [
  { id: 'm1', emoji: '💰', title: '근로장려금 신청하기', sub: '최대 300만원 · 5.31 마감', badge: '마감 임박', badgeColor: '#EF4444', done: false },
  { id: 'm2', emoji: '👩‍👧', title: '한부모 소득공제 서류 준비', sub: '최대 100만원 · 약 10분', badge: '보통', badgeColor: '#F59E0B', done: false },
  { id: 'm3', emoji: '👶', title: '아동양육비 신청 확인', sub: '최대 21만원/월 · 약 5분', done: true },
  { id: 'm4', emoji: '🎨', title: '문화누리카드 신청', sub: '연 13만원 · 약 5분', done: true },
  { id: 'm5', emoji: '🏥', title: '건강보험 납부 내역 확인', sub: '최대 30만원 · 약 5분', done: true },
]

const KIMGODSAENG_MISSIONS: Mission[] = [
  { id: 'm1', emoji: '🏠', title: '월세 세액공제 서류 준비하기', sub: '최대 75만원 · 12.31 마감', badge: '마감 임박', badgeColor: '#EF4444', done: false },
  { id: 'm2', emoji: '🏦', title: 'ISA 계좌 개설 검토하기', sub: '최대 200만원 · 약 15분', badge: '보통', badgeColor: '#F59E0B', done: false },
  { id: 'm3', emoji: '💳', title: '신용카드 vs 체크카드 비율 확인', sub: '최대 30만원 · 약 10분', done: true },
  { id: 'm4', emoji: '🩺', title: '의료비 공제 가능 여부 체크', sub: '최대 15만원 · 약 5분', done: true },
  { id: 'm5', emoji: '📈', title: '연금저축 납입 현황 확인', sub: '최대 66만원 · 약 5분', done: true },
]

export default function MyPage() {
  const navigate = useNavigate()
  const { logout, userName } = useAuth()
  const { selectedCoach } = useChatbotCoach()
  const isHanbeoteam = userName === HANBEOTEAM_NAME
  const isKimgodsaeng = userName === KIMGODSAENG_NAME
  const profileMeta = isHanbeoteam
    ? '34세 · 중소기업 사무직 · 한부모 가정'
    : isKimgodsaeng
    ? '26세 · 공기업 신입 · 월세 1인가구'
    : '27세 · 1인 가구'
  useHeaderConfig({ title: '마이페이지', showBell: true, badgeCount: 2 })

  const initialMissions = isHanbeoteam ? HANBEOTEAM_MISSIONS : isKimgodsaeng ? KIMGODSAENG_MISSIONS : KIMGODSAENG_MISSIONS
  const [missions, setMissions] = useState<Mission[]>(initialMissions)

  const toggleMission = (id: string) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m))
  }

  const doneCount = missions.filter(m => m.done).length
  const total = missions.length
  const pct = Math.round((doneCount / total) * 100)
  const hasUrgent = missions.some(m => !m.done && m.badge === '마감 임박')

  return (
    <div>
      {/* Profile */}
      <div style={{ background: 'white', padding: '20px 16px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 17, fontWeight: 700, marginBottom: 2 }}>{userName}님</p>
            <p style={{ maxWidth: 190, overflow: 'hidden', color: 'var(--text-secondary)', fontSize: 12, lineHeight: 1.4, textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profileMeta}</p>
          </div>
          <button onClick={() => navigate('/mypage/edit')} style={{ background: 'var(--bg-gray)', border: 'none', borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'inherit' }}>
            정보 수정
          </button>
        </div>

        <div style={{ background: 'var(--primary)', borderRadius: 20, padding: '18px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'rgba(255,255,255,0.06)', borderRadius: '50%' }} />
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 4 }}>지금까지 받은 혜택</p>
          <p style={{ color: 'white', fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{isHanbeoteam ? '2,400,000원' : isKimgodsaeng ? '950,000원' : '1,236,000원'}</p>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 11, marginBottom: 14 }}>{isHanbeoteam ? '근로장려금 + 매월 아동수당' : isKimgodsaeng ? '월세 환급금 + K-패스 환급' : '2024.01 ~ 현재'}</p>
          <div style={{ display: 'flex', gap: 12 }}>
            {(isHanbeoteam
              ? [{ label: '근로장려금', amount: '1,560,000원' }, { label: '아동수당', amount: '840,000원' }, { label: '신청 임박', amount: '3건' }]
              : isKimgodsaeng
              ? [{ label: '월세 환급', amount: '720,000원' }, { label: 'K-패스', amount: '230,000원' }, { label: '예상 환급', amount: '145만원' }]
              : [{ label: '절세 혜택', amount: '876,000원' }, { label: '정부 지원금', amount: '360,000원' }, { label: '신청 중', amount: '120,000원' }]
            ).map((item, i) => (
              <div key={i} style={{ flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 8px' }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>{item.label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{item.amount}</p>
              </div>
            ))}
          </div>
          <button style={{ marginTop: 12, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, padding: '8px 0', width: '100%', color: 'white', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
            상세 내역 확인하기 ›
          </button>
        </div>
      </div>

      {/* 이번 달 목표 */}
      <div style={{ background: 'white', marginTop: 8, padding: '20px 16px' }}>
        {/* 헤더 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>🎯</span>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>이번 달 목표</span>
        </div>

        {/* 진행 카드 */}
        <div style={{ background: 'var(--bg-gray)', borderRadius: 18, padding: '16px 18px', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
            <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--primary)' }}>{doneCount}</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-secondary)' }}>/ {total}</span>
            <span style={{ fontSize: 14, color: 'var(--text-secondary)', marginLeft: 4 }}>미션 완료</span>
          </div>
          <div style={{ position: 'relative', height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${pct}%`, background: 'var(--primary)', borderRadius: 99, transition: 'width 0.4s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)' }}>{pct}%</span>
          </div>
        </div>

        {/* 코치 메시지 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', background: 'var(--primary-light)', borderRadius: 14, marginBottom: 20 }}>
          {selectedCoach
            ? <img src={selectedCoach.image} alt={selectedCoach.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
            : <span style={{ fontSize: 20, flexShrink: 0 }}>🤖</span>}
          <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, lineHeight: 1.4 }}>
            {pct === 100
              ? '이번 달 목표를 모두 달성했어요! 🎉'
              : hasUrgent
              ? '잘 하고 있어요! 마감 임박 미션을 확인해볼까요?'
              : `${total - doneCount}개 미션이 남았어요. 조금만 더 해봐요!`}
          </p>
        </div>

        {/* 섹션 라벨 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white', background: 'var(--primary)', borderRadius: 99, padding: '3px 10px' }}>{doneCount}/{total}</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>💰 절세 혜택</span>
        </div>

        {/* 미션 리스트 */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {missions.map((m, i) => (
            <div
              key={m.id}
              onClick={() => toggleMission(m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 0',
                borderBottom: i < missions.length - 1 ? '1px solid var(--border)' : 'none',
                cursor: 'pointer',
                opacity: m.done ? 0.45 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* 아이콘 / 체크 */}
              <div style={{
                width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                background: m.done ? 'var(--primary)' : 'var(--primary-light)',
                transition: 'background 0.2s',
              }}>
                {m.done
                  ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : m.emoji}
              </div>

              {/* 텍스트 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: m.done ? 500 : 700, color: m.done ? 'var(--text-tertiary)' : 'var(--text-primary)', lineHeight: 1.3, textDecoration: m.done ? 'line-through' : 'none' }}>{m.title}</p>
                <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{m.sub}</p>
              </div>

              {/* 배지 or 화살표 */}
              {!m.done && m.badge ? (
                <span style={{ fontSize: 11, fontWeight: 700, color: m.badgeColor, background: m.badgeColor + '18', borderRadius: 8, padding: '4px 8px', flexShrink: 0 }}>{m.badge}</span>
              ) : !m.done ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Logout */}
      <div style={{ background: 'white', marginTop: 8, padding: '16px' }}>
        <button
          onClick={() => { logout(); navigate('/') }}
          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left' }}
        >
          <span style={{ width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span style={{ flex: 1, fontSize: 14, color: 'var(--text-primary)' }}>로그아웃</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}
